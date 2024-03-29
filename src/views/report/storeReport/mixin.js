import { mapState } from 'vuex'
import Bus from '@/libs/bus.js'
import moment from 'moment/moment'

export default {
  data () {
    return {
      trendChartData: {
        lineOption: {},
        barOption: {},
      },
      ratioTableData: [],
      ageGender:{},
      ageGenderTableData: [],
      storeEnterChartList:[],
      storeEnterFlowList: [],//当日进店客流
      storeExitFlowList: [],//当日出店客流
      storeExitChartList:[],
      storeTotalFlowList: [],//当日店铺总客流
      storeTotalChartList:[],
      storePassbyFlowList: [],//当日路经客流
      storePassbyChartList:[],
      storeAgeGenderFlowList: [],//当日进店年龄性别入客流
      ageGenderChartData:[],
      ageGenderExitChartData:[],
      storeAgeGenderExitFlowList: [],//当日进店年龄性别出客流
      storeAgeGenderPssbyFlowChart:[],
      storeAgeGenderPssbyFlowList: [],//当日路经年龄性别客流
      storeDwellList: [],
      storeSelected: '',
    }
  },
  computed: {
    ...mapState({
      propertyId: state => state.home.headerAction,
    }),
    ratioTableColumn(){
      return {
        name1: [this.$t("time"), this.$t("Incoming")],
        name2: [ this.$t("report.qoqAnaly")],
        name3: [this.$t("time"), this.$t("Incoming"),this.$t("report.growthRate")],
      }
    },
    ratioExitTableColumn(){
      return {
        name1: [this.$t("time"), this.$t("Outbound")],
        name2: [this.$t("report.qoqAnaly")],
        name3: [this.$t("time"), this.$t("Outbound"), this.$t('report.growthRate')]
      }
    },
    ratioTotalTableColumn(){
      return {
        name1: [this.$t("time"),this.$t("report.totalEnter")],
        name2: [this.$t("report.qoqAnaly")],
        name3: [this.$t("time"),this.$t("report.totalEnter"),  this.$t('report.growthRate')]
      }
    },
    passbyTableColunm(){
      return {
        name1: [this.$t("time"),this.$t("report.passByEnter")],
        name2:[this.$t("report.qoqAnaly")],
        name3: [this.$t("time"),this.$t("report.passByEnter"),  this.$t('report.growthRate')]
      }
    },
    ageGenderTableColumn(){
      return {
        name1: [this.$t("time")],
        name2: [this.$t('age')],
        name3: [this.$t('gender')],
        name4: Object.values(this.ageGender)||[],
        name5: [this.$t('male'), this.$t('female')]
      }
    },
    validStoreSelectedList(){
      // return this.storeSelected.filter(o=>{
      //   return Number(o) > -1
      // })
      return [this.storeSelected]
    },
    storeNames(){
      let name = '';
      this.validStoreSelectedList.forEach(o=>{
        const store = this.storeListOptions.find(store=>{
          return store.id === o
        })
        name += store.name
      })
      return name
    },
    storeBzids () {
      return this.validStoreSelectedList.toString()
    },
    oneListData () {
      return [
        {
          name:  this.$t('report.todayEnterOverview'),
          text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.year + '.' + this.saveHeaderData.time
        },
        {
          name: this.$t('report.yesterdayEnterOverview'),
          text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.yester
        }
      ]
    },
    dwellTitle () {
      return {
        name: this.$t('avgDwellTime'),
        text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.year + '.' + this.saveHeaderData.time
      }
    },
    trendTitle () {
      return {
        name: this.$t('report.todayEnterTrendCompare'),
        text:`${this.$t('report.enterTime')}:` + this.saveHeaderData.year + '.' + this.saveHeaderData.time
      }
    },
    storeTrendTitle () {
      return function (type) {

        return {
          name: this.$t(`report.store${type}Flow`),
          text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.year + '.' + this.saveHeaderData.time
        }
      }

    },
    stroePssbyTitle () {
      return {
        name: this.$t('report.todayPassByEnter'),
        text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.year + '.' + this.saveHeaderData.time
      }
    },
    ageGenderTitle () {
      return function (type) {
        return {
          name:this.$t(`report.ageGender${type}FlowTrend`),
          text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.year + '.' + this.saveHeaderData.time
        }
      }

    },
    storeAgeGenderTitle () {
      return function (type) {
        return {
          name: this.$t(`report.ageGender${type}Flow`),
          text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.year + '.' + this.saveHeaderData.time
        }
      }
    },
    storeAgeGenderPssbyTitle () {
      return {
        name: this.$t('report.todayPassbyAgeGender'),
        text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.year + '.' + this.saveHeaderData.time
      }
    },
  },
  methods: {
    //总客流
    getTotalFlowList (arr1, arr2) {
      let result = []
      arr1.forEach(a1 => {
        const storeInfo = arr2.find(a2 => {
          return a2.id === a1.id
        })
        _.forIn(a1.list, (value, key) => {
          _.forIn(value, (innerVal, innerKey) => {
            value[innerKey] = Number(storeInfo.list[key][innerKey]) + Number(innerVal)
          })
        })
        result.push(a1)
      })
      return result
    },
    // 趋势数据
    trendDataList (enterData, yesterdayData) {
      this.ratioTableData = []
      this.trendChartData.lineOption = _.cloneDeep(this.enterOption)
      this.trendChartData.barOption = _.cloneDeep(this.enterOption)
      let todayEnterObj = {
        name: this.$t('report.todayEnterTrend'),
        color: '#2081D4',
        type: 'line',
        data: []
      }
      let yesterdayEnterObj = {
        name: this.$t('report.yesterdayEnterTrend'),
        color: '#745AEF',
        type: 'line',
        data: []
      }
      enterData.forEach((list, index) => {
        let time = moment(list.begin).format('HH:mm')
        this.trendChartData.lineOption.xAxis.categories.push(time)
        this.trendChartData.barOption.xAxis.categories.push(time)
        todayEnterObj.data.push(list.enter)
        // 表格
        this.ratioTableData.push({
          data: [
            moment(list.begin).format('YYYY-MM-DD-HH:mm'),
            list.enter.toLocaleString() + this.$t('personTime'),
            moment(yesterdayData[index].begin).format('YYYY-MM-DD-HH:mm'),
            yesterdayData[index].enter.toLocaleString() + this.$t('personTime'),
            this.sequential(list.enter, yesterdayData[index].enter) + '%'
          ]
        })
      })
      yesterdayEnterObj.data = yesterdayData.map(o => {
        return o.enter
      })
      this.trendChartData.lineOption.series = [todayEnterObj, yesterdayEnterObj]
      let barTodayCopy = _.cloneDeep(todayEnterObj)
      barTodayCopy.type = 'column'
      let barYesterdayCopy = _.cloneDeep(yesterdayEnterObj)
      barYesterdayCopy.type = 'column'
      this.trendChartData.barOption.series = [barTodayCopy, barYesterdayCopy]
      //表格统计
      let cuT = _.sumBy(enterData, (o) => {
        return o.enter
      })
      let yeT = _.sumBy(yesterdayData, (o) => {
        return o.enter
      })
      this.ratioTableData.push({
        data: [
          this.$t('total'),
          cuT.toLocaleString() + this.$t('personTime'),
          '-',
          yeT.toLocaleString() + this.$t('personTime'),
          this.sequential(cuT, yeT) + '%'
        ]
      })
      Bus.$emit('chartData')
    },
    storeEnterChart(data){
      if(!data.length) return [];
      let result = [];
      let option = _.cloneDeep(this.enterOption)
      option.xAxis.categories = Object.keys(data[0].list.time1).map(o=>{
        return o.substring(11,16)
      });
      let currentObj = {
        name: this.$t('report.todayEnter'),
        color: '#2081d4',
        type: 'column',
        data: []
      },yesterObj = {
        name: this.$t('report.qoqEnter'),
        type: 'column',
        color: '#2BD9CF',
        data: []
      };
      data.forEach(o=>{
        currentObj.data = Object.values(o.list.time1)
        yesterObj.data = Object.values(o.list.time2)
        option.series = [currentObj,yesterObj]
        result.push({
          chartData:{
            option:_.cloneDeep(option)
          },
          storeName:o.name
        })
      })
      return result
    },
    storeEnterFlow (data) {
      let result = []
      data.forEach(o => {
        const obj = {
          storeName: o.name,
          tableData: []
        }
        const time1 = o.list.time1
        const time1Total = _.sum(Object.values(time1))
        const time2 = o.list.time2
        const time12Total = _.sum(Object.values(time2))
        let i = 0
        for (let key in time1) {
          obj.tableData[i] = {
            data: []
          }
          obj.tableData[i].data.push(key.substring(0, 16))
          obj.tableData[i].data.push(time1[key])
          i++
        }
        i = 0
        for (let key in time2) {
          obj.tableData[i].data.push(key.substring(0, 16))
          obj.tableData[i].data.push(time2[key])
          obj.tableData[i].data.push(this.sequential(obj.tableData[i].data[1], obj.tableData[i].data[3]) + '%')
          obj.tableData[i].data[1] = obj.tableData[i].data[1].toLocaleString() + this.$t('personTime')
          obj.tableData[i].data[3] = obj.tableData[i].data[3].toLocaleString() + this.$t('personTime')
          i++
        }
        obj.tableData.push({
          data: [this.$t('total'), time1Total.toLocaleString() + this.$t('personTime'), '-', time12Total.toLocaleString() + this.$t('personTime'), this.sequential(time1Total, time12Total) + '%']
        })
        result.push(obj)
      })
      return result
    },
    ageGenderTable (data, attr) {
      let result = []
      if (data) {
        for (let key in data[attr]) {
          let innerArr = []
          innerArr.push(key.substring(0, 16))
          const dataArr = Object.values(data[attr][key])
          //年龄分布
          innerArr = innerArr.concat(
            dataArr.length ?
              dataArr.map(o => {
                return Number(o.female_flow) + Number(o.male_flow)
              })
              :
              Object.keys(this.ageGender).map(o => {
                return '-'
              })
          )

          //性别统计
          innerArr = innerArr.concat(dataArr.length ? [_.sumBy(dataArr, 'male_flow'), _.sumBy(dataArr, 'female_flow')] : ['-', '-'])
          result.push(innerArr)
        }
        //算合计
        let total = new Array(Object.keys(this.ageGender).length + 2).fill('-')
        result.forEach((out, outIndex) => {
          out.forEach((inner, innerIndex) => {
            if (innerIndex > 0) {
              if (total[innerIndex - 1] === '-') {
                total[innerIndex - 1] = inner
              } else {
                if (inner !== '-') {
                  total[innerIndex - 1] = total[innerIndex - 1] + inner
                }
              }
            }
          })
        })
        total.unshift(this.$t('total'))
        result.push(total)
      }
      return result
    },
    ageGenderList (data,attr) {
      let result = [];

      const colors1 = ['rgba(0,160,233)', 'rgba(238,117,82)', 'rgba(38, 218, 208)', 'rgba(251,171,64)', 'rgba(232,88,90)', 'rgba(141,130,240)']
      const colors2 = ['rgba(0,160,233,.5)', 'rgba(238,117,82,.5)', 'rgba(38, 218, 208,.5)', 'rgba(251,171,64,.5)', 'rgba(232,88,90,.5)', 'rgba(141,130,240,.5)']

      let option = _.cloneDeep(this.enterOption)
      option.chart = {
        type: 'column'
      }
      option.plotOptions.column.stacking = 'normal'
      const category = Object.keys(data[0][attr]).map(o => {
        return o.substring(10, 16)
      })
      data.forEach(obj=>{
        const values = Object.values(obj[attr])
        let res = {}
        this.ageGender = {};
        Object.keys(values[0]).forEach(o=>{
          this.ageGender[o] = o.replace('less',this.$t('lessThan')).replace('more',this.$t('moreThan'));
        })

        let series = []
        values.forEach((o,i)=>{
          for(let key in o){
            Array.isArray(res[key])?res[key].push(o[key]):res[key] = [o[key]]
          }
        })
        res = Object.values(res)
        res.forEach((o, i) => {
          const name =  o[0].ageRange.replace('less',this.$t('lessThan')).replace('more',this.$t('moreThan'))
          series.push({
            name: name + `(${this.$t('male')})`,
            stack: 'male',
            color: colors1[i],
            data: o.map(o => {
              return o.male_flow
            })
          })
          series.push({
            name: name + `(${this.$t('female')})`,
            stack: 'female',
            color: colors2[i],
            data: o.map(o => {
              return o.female_flow
            })
          })
        })
        option.series = series
        option.xAxis.categories = category
        result.push({
          chartData:{
            option:_.cloneDeep(option)
          },
          storeName:obj.name
        })
      })
      return result
    },
    reportOneData (data, gender) {
      this.enterData = []
      let currentData = data.current[0]
      let contrastData = data.contrast[0]
      let cETime = currentData.enter.highest.timeRange
      // 当前时间
      let cEDate = cETime.split(' ')[0] + ' ' + cETime.split(' ')[2]
      // 昨天时间
      let tETime = contrastData.enter.highest.timeRange
      let tEDate = tETime.split(' ')[0] + ' ' + tETime.split(' ')[2]

      let textList = Object.values(data.comment)
      let type = this.saveHeaderData.type === 'daily' ? this.$t('report.hour') :this.$t('report.day')
      const todayFemale = _.sum(gender.today) > 0 ? ((gender.today[0] / _.sum(gender.today)) * 100).toFix(1) : 0
      const todayMale = _.sum(gender.today) > 0 ? ((gender.today[1] / _.sum(gender.today)) * 100).toFix(1) : 0
      const yesFemale = _.sum(gender.yesterday) > 0 ? ((gender.yesterday[0] / _.sum(gender.yesterday)) * 100).toFix(1) : 0
      const yesMale = _.sum(gender.yesterday) > 0 ? ((gender.yesterday[1] / _.sum(gender.yesterday)) * 100).toFix(1) : 0
      this.enterData = [
        { // 当前时间数据
          enter: currentData.enter.total.number.toLocaleString() + this.$t('personTime'),
          enterPeak: currentData.enter.highest.number.toLocaleString() +this.$t('personTime'),
          enterTime: this.timeTYpe(cEDate, cETime, '客流量'),
          occupancyPeak: currentData.occupancy.highest.number.toLocaleString() +this.$t('personTime'),
          average: currentData.enter.avg.number.toLocaleString() + `${this.$t('personTime')}/` + type,
          female: todayFemale,
          male: _.sum([Number(todayFemale), Number(todayMale)]) > 0 ? (100 - todayFemale).toFix(1) : todayMale
        },
        { // 昨天时间数据
          enter: contrastData.enter.total.number.toLocaleString() + this.$t('personTime'),
          enterPeak: contrastData.enter.highest.number.toLocaleString() + this.$t('personTime'),
          enterTime: this.timeTYpe(tEDate, tETime, '客流量'),
          occupancyPeak: contrastData.occupancy.highest.number.toLocaleString() + this.$t('personTime'),
          average: contrastData.enter.avg.number.toLocaleString() + `${this.$t('personTime')}/` + type,
          female: yesFemale,
          male: _.sum([Number(yesFemale), Number(yesMale)]) > 0 ? (100 - yesFemale).toFix(1) : yesMale
        },
      ]
      this.enterData.push(textList)
    },
    headerDate (value) {
      let headerDate = {
        year: moment(value).format('YYYY'),
        time: moment(value).format('MM.DD'),
        period: '',
        week: this.weekType(value),
        type: 'daily',
        yester: moment(value).subtract(1, 'days').format('YYYY.MM.DD'),
        reportDate: moment(value).format('YYYY.MM.DD')
      }
      this.saveHeaderData = headerDate
      this.$store.commit('dayReportHeader', headerDate)
    },
  }
}
