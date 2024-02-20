import reportOne from '@/components/report/newReport/report_one'
import reportWeekFive from '@/components/report/newReport/new_report_week_five'

import reportCover from '@/components/report/newReport/report_cover'
import reportHeatMap from '@/components/report/newReport/report_heat_map_color'
import reportRatioTable from '@/components/report/newReport/report_ratio_table'
import reportChart from '@/components/report/newReport/report_chart'
import reportSuggest from '@/components/report-public/report_suggest'
import reportBackCover from '@/components/report/newReport/report_back_cover'
import reportTable from '@/components/report/newReport/report_table'
import reportChartMulti from '@/components/report/newReport/report_chart_multi'

import reportGateTable from '@/components/report/newReport/new_report_week_gateTable'
import moment from 'moment'
import { getCompareDate } from '@/libs/util'
import Bus from '@/libs/bus.js'
import { mapState } from "vuex";
export default{
  data(){
    return{
      showPDF:false,
      // 日期
      selectDateTime: [moment().subtract(2, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD')],
      floorList: [],//楼层
      clickData: 0,
      trendChartData: {
        option: {},
        remarkData: []
      },
      gateChartData: {
        option: {},
        remarkData: []
      },
      shopChartData: {
        option: {},
        remarkData: []
      },
      ratioTableData: [],

      tableData: [],
      allFloorStore: [],
      allFormatStore: [],
      allHeatMap: [],
      dwellChartData: {
        option: {},
        remarkData: []
      },
      allDwellFormatStore: [],
    }
  },
  computed:{
    tableColumn(){
      return [this.$t('gateName'), this.$t('report.enterFlow'),  this.$t('report.enterPeak'),  this.$t('report.avgEnterPerDay')]
    },
    disorderData(){
      return {
        relevancy: {
          column: [this.$t('fn.name',[this.$t('entity')]), this.$t('fn.name',[this.$t('entity')]), this.$t('Relevancy')],
          table: []
        },
        inversion: {
          column: [this.$t('fn.name',[this.$t('entity')]), this.$t('fn.name',[this.$t('entity')]), this.$t('report.Conversion')],
          table: []
        }
      }
    },
    orderlyData(){
      return {
        relevancy: {
          column: [this.$t('fn.name',[this.$t('entity')]), this.$t('fn.name',[this.$t('entity')]), this.$t('Relevancy')],
          table: []
        },
        inversion: {
          column: [this.$t('fn.name',[this.$t('entity')]), this.$t('fn.name',[this.$t('entity')]), this.$t('report.Conversion')],
          table: []
        }
      }
    },
    ratioTableColumn(){
      if(this.showLastYearData){
        return  {
          name1: [this.$t("time"), this.$t("Incoming")],
          name2: [ this.$t("report.yoyAnaly"), this.$t("report.qoqAnaly")],
          name3: [this.$t("time"), this.$t("Incoming"),this.$t("report.growthRate"), this.$t("time"),this.$t("Incoming"),this.$t("report.growthRate")],
        }
      }else {
        return  {
          name1: [this.$t("time"), this.$t("Incoming")],
          name2: [ this.$t("report.qoqAnaly")],
          name3: [ this.$t("time"), this.$t("Incoming"),this.$t("report.growthRate")],
        }
      }
    },
    floorBzids () {
      return this.floorList.map(o => {
        return o.bzid
      })
    },
    //环比时间
    onChainDate () {
      if ((!this.selectDateTime[0] || !this.selectDateTime[1])) {
        return ''
      } else {
        return getCompareDate(this.selectDateTime, 'onChain').toString()
      }
    },
    onYearDate () {
      if ((!this.selectDateTime[0] || !this.selectDateTime[1])) {
        return ''
      } else {
        return getCompareDate(this.selectDateTime, 'onYear').toString()
      }
    },
    oneListData () {
      return [
        {
          name:this.$t("report.thisPeriodEnterOverview"),
          text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
        },
        {
          name: this.$t("report.lastPeriodEnterOverview"),
          text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.yester
        }
      ]
    },
    trendTitle () {
      return {
        name:this.$t('report.thisPeriodEnterTrend'),
        text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
      }
    },
    gateTitle () {
      return {
        name: this.$t('report.thisPeriodGateTop10Compare'),
        text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
      }
    },
    gateTableTitle () {
      return {
        name: this.$t('report.thisPeriodGateTop10'),
        text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
      }
    },
    shopTitle () {
      return {
        name: this.$t('report.thisPeriodStoreTop10Compate'),
        text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
      }
    },
    floorStoreTitle () {
      return {
        name:this.$t('report.thisPeriodFloorStoreTop10'),
        text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
      }
    },
    formatStoreTitle () {
      return {
        name: this.$t('report.thisPeriodBussStoreTop10'),
        text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
      }
    },
    orderlyTitle () {
      return {
        relevancy: {
          name: this.$t('report.thisPeriodUnorderTop10'),
          text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
        },
        inversion: {
          name: this.$t('report.thisPeriodUnorderConversionTop10'),
          text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
        }
      }
    },
    disorderTitle () {
      return {
        relevancy: {
          name: this.$t('report.thisPeriodOrderTop10'),
          text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
        },
        inversion: {
          name: this.$t('report.thisPeriodOrderConversionTop10'),
          text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
        }
      }
    },
    dwellTitle () {
      return {
        name: this.$t('report.thisPeriodDwellTimeTop10'),
        text: `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
      }
    },
    formatDwellStoreTitle () {
      return {
        name: this.$t('report.thisPeriodwellTimeStoreTop10'),
        text:  `${this.$t('report.enterCyc')}:` + this.saveHeaderData.reportDate
      }
    },
    ...mapState({
      language: (state) => state.language,//en-US
    })
  },
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportHeatMap,
    reportRatioTable,
    reportWeekFive,
    reportSuggest,
    reportBackCover,
    reportTable,
    reportChartMulti,
    reportGateTable

  },
  methods:{
    dwellFormatStoreData (data) {
      this.allDwellFormatStore = []
      this.multiChartData(data, 'allDwellFormatStore', 'dwell')
      this.$nextTick(() => {
        this.clickData = this.clickData + 1
        Bus.$emit('chartData')
      })
    },
    headerDate (value) {
      const headerDate = {
        year: moment(value[0]).format('YYYY'),
        time: `${moment(value[0]).format('MM.DD')}-${moment(value[1]).format('MM.DD')}`,
        week: '',
        type: 'customize',
        yester: `${getCompareDate(value, 'onChain')[0].replace(/-/g, '.')}-${getCompareDate(value, 'onChain')[1].replace(/-/g, '.')}`,//上期
        reportDate: `${value[0].replace(/-/g, '.')}-${value[1].replace(/-/g, '.')}`
      }
      this.saveHeaderData = headerDate
      this.$store.commit('customizeReportHeader', headerDate)
    },
    trendDataList (enter, lastEnter, yearEnter) {
      this.trendChartData.option = _.cloneDeep(this.enterOption)
      this.ratioTableData = []
      let smooth = {
        date: '',
        enter: '',
        ratio: ''
      }
      let maxHighest = {
        date: '',
        enter: '',
        ratio: ''
      }
      let [oneObj, twoObj] = [
        {
          name: this.$t('report.thisPeriodEnter'),
          color: '#2081D4',
          type: 'column',
          data: []
        },
        {
          name: this.$t('report.lastPeriodEnter'),
          type: 'column',
          color: '#2BD9CF',
          data: []

        }
      ]
      let size = 0
      let size2 = 999
      enter.forEach((list, index) => {
        oneObj.data.push(list.enter)
        twoObj.data.push(lastEnter[index].enter)
        this.trendChartData.option.xAxis.categories.push(this.$t("fn.dayTh", [index + 1]))
        // 环比数据
        let lastWeekNumber = this.sequential(list.enter, lastEnter[index].enter)
        // 同比数据
        let yearNumber = this.sequential(list.enter, yearEnter[index].enter)
        // 环比的绝对值
        let absolute = Math.abs(lastWeekNumber)
        if (absolute < size2) {
          size2 = absolute
          smooth.date = moment(list.begin).format('YYYY-MM-DD')
          smooth.enter = list.enter.toLocaleString()
          smooth.ratio = lastWeekNumber
        }
        if (absolute > size) {
          size = absolute
          maxHighest.date = moment(list.begin).format('YYYY-MM-DD')
          maxHighest.enter = list.enter.toLocaleString()
          maxHighest.ratio = lastWeekNumber
        }
        let onYearData = []
        if(this.showLastYearData){
          onYearData = [
            moment(yearEnter[index].begin).format('YYYY-MM-DD'),
            yearEnter[index].enter.toLocaleString() + this.$t('personTime'),
            yearNumber + '%',
          ]
        }
        this.ratioTableData.push({
          data: [
            moment(list.begin).format('YYYY-MM-DD'),
            list.enter.toLocaleString() + this.$t('personTime'),
            ...onYearData,
            moment(lastEnter[index].begin).format('YYYY-MM-DD'),
            lastEnter[index].enter.toLocaleString() + this.$t('personTime'),
            lastWeekNumber + '%'
          ]
        })
      })
      let cuT = _.sumBy(enter, 'enter')
      let laT = _.sumBy(lastEnter, 'enter')
      let yeT = _.sumBy(yearEnter, 'enter')
      this.trendChartData.option.series = [oneObj, twoObj]
      let onYearTotal = []
      if(this.showLastYearData){
        onYearTotal = [
          '-',
          yeT.toLocaleString() + this.$t('personTime'),
          this.sequential(cuT, yeT) + '%',
        ]
      }
      this.ratioTableData.push({
        data: [
          this.$t('total'),
          cuT.toLocaleString() +this.$t('personTime'),
          ...onYearTotal,
          '-',
          laT.toLocaleString() + this.$t('personTime'),
          this.sequential(cuT, laT) + '%'
        ]
      })
      this.trendChartData.remarkData = []
      let type = smooth.ratio > 0 ? this.$t("report.growth") : this.$t("report.decrease");
      let type2 = maxHighest.ratio > 0 ? this.$t("report.growth") : this.$t("report.decrease");

      let text1 =this.language==='en-US'?(
          `On ${smooth.date}, the passenger flow ${type} steadily, reaching ${smooth.enter} people, an ${type} of ${Math.abs(smooth.ratio)}% compared to the previous period`
        ):
        ("本期" +
          smooth.date +
          "客流" +
          type +
          "平稳，为" +
          smooth.enter +
          "人次，比上期环比" +
          type +
          Math.abs(smooth.ratio) +
          "%");
      let text2 =this.language==='en-US'?(
          `The passenger flow ${type2} reached its peak on ${maxHighest.date}, with ${maxHighest.enter} people, a ${Math.abs(maxHighest.ratio)}% ${type2} compared to the previous period's month on month growth`
        ):
        ("本期" +
          maxHighest.date +
          "客流" +
          type2 +
          "达到顶峰，为" +
          maxHighest.enter +
          "人次，比上期环比" +
          type2 +
          Math.abs(maxHighest.ratio) +
          "%");      if (smooth.ratio !== '') this.trendChartData.remarkData.push(text1)
      if (maxHighest.ratio !== '') this.trendChartData.remarkData.push(text2)
    },
    gateDataList (gateData) {
      this.gateChartData.option = _.cloneDeep(this.enterOption)
      this.tableData = []
      let [currentObj, yesterObj, lastObj] = [
        {
          name: this.$t("report.thisPeriodEnter"),
          color: '#2081D4',
          type: 'column',
          data: []
        },
        {
          name: this.$t("report.lastPeriodEnter"),
          type: 'column',
          color: '#2BD9CF',
          data: []
        },
        {

          name: this.$t("report.thePeriodEnter"),
          type: 'column',
          color: '#874bd9',
          data: []

        }
      ]
      if (gateData.data) {
        gateData.data.forEach(list => {
          currentObj.data.push(list.enter)
          let yesterEnter = _.find(gateData.contrast, o => o.bzid === list.bzid).enter
          yesterObj.data.push(yesterEnter)
          let lastEnter = _.find(gateData.period, o => o.bzid === list.bzid).enter
          lastObj.data.push(lastEnter)
          this.gateChartData.option.xAxis.categories.push(list.name)
          this.tableData.push({
            name: list.name,
            enter: list.enter.toLocaleString(),
            peak: list.highest.number.toLocaleString(),
            time: moment(list.highest.begin).format('YYYY-MM-DD'),
            mean: list.avg.toLocaleString()
          })
        })
      }
      this.gateChartData.option.series = [currentObj, yesterObj]
      if(this.showLastYearData){
        this.gateChartData.option.series.push(lastObj)
      }
      this.gateChartData.remarkData = gateData.comment ? gateData.comment : []
    },
    shopDataList (shopData) {
      this.shopChartData.option = _.cloneDeep(this.enterOption)
      let [currentObj, yesterObj] = [
        {
          name: this.$t("report.thisPeriodEnter"),
          color: '#2081D4',
          type: 'column',
          data: []
        },
        {
          name: this.$t("report.lastPeriodEnter"),
          type: 'column',
          color: '#2BD9CF',
          data: []

        }
      ]
      if (shopData.current) {
        _.take(shopData.current, 10).forEach(list => {
          currentObj.data.push(list.data)
          if (shopData.contrast.length !== 0) {
            let yesterEnter = _.find(shopData.contrast, o => o.id === list.id).data
            yesterObj.data.push(yesterEnter)
          } else {
            yesterObj.data.push(0)
          }
          this.shopChartData.option.xAxis.categories.push(list.name)
        })
      }
      this.shopChartData.option.series = [currentObj, yesterObj]
      this.shopChartData.remarkData = shopData.comment ? shopData.comment : []
    },
    floorDataList (data) {
      this.allFloorStore = []
      this.multiChartData(data, 'allFloorStore', 'chart')
    },
    formatDataList (data) {
      this.allFormatStore = []
      this.multiChartData(data, 'allFormatStore', 'chart')
    },
  }
}
