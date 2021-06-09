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
      ratioTableColumn: {
        name1: ['时间', '入客流'],
        name2: ['同比分析', '环比分析'],
        name3: ['时间', '入客流', '增长率', '时间', '入客流', '增长率']
      },
      ratioTableData: [],
      tableColumn: ['出入口名称', '客流量', '客流峰值', '平均客流量/天'],
      tableData: [],
      allFloorStore: [],
      allFormatStore: [],
      allHeatMap: [],
      orderlyData: {
        relevancy: {
          column: ['实体名称', '实体名称', '关联度'],
          table: []
        },
        inversion: {
          column: ['实体名称', '实体名称', '转换量'],
          table: []
        }
      },
      disorderData: {
        relevancy: {
          column: ['实体名称', '实体名称', '关联度'],
          table: []
        },
        inversion: {
          column: ['实体名称', '实体名称', '转换量'],
          table: []
        }
      },
      dwellChartData: {
        option: {},
        remarkData: []
      },
      allDwellFormatStore: [],
    }
  },
  computed:{
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
          name: '本期客流总览',
          text: '客流周期:' + this.saveHeaderData.reportDate
        },
        {
          name: '上期客流总览',
          text: '客流周期:' + this.saveHeaderData.yester
        }
      ]
    },
    trendTitle () {
      return {
        name: '本期客流趋势',
        text: '客流周期:' + this.saveHeaderData.reportDate
      }
    },
    gateTitle () {
      return {
        name: '本期出入口客流TOP10对比分析',
        text: '客流周期:' + this.saveHeaderData.reportDate
      }
    },
    gateTableTitle () {
      return {
        name: '本期出入口客流TOP10',
        text: '客流周期:' + this.saveHeaderData.reportDate
      }
    },
    shopTitle () {
      return {
        name: '本期店铺客流TOP10对比分析',
        text: '客流周期:' + this.saveHeaderData.reportDate
      }
    },
    floorStoreTitle () {
      return {
        name: '本期各楼层TOP10店铺客流分析',
        text: '客流周期:' + this.saveHeaderData.reportDate
      }
    },
    formatStoreTitle () {
      return {
        name: '本期各业态TOP10店铺客流分析',
        text: '客流周期:' + this.saveHeaderData.reportDate
      }
    },
    orderlyTitle () {
      return {
        relevancy: {
          name: '本期无序关联度TOP10',
          text: '客流周期:' + this.saveHeaderData.reportDate
        },
        inversion: {
          name: '本期无序转换量TOP10',
          text: '客流周期:' + this.saveHeaderData.reportDate
        }
      }
    },
    disorderTitle () {
      return {
        relevancy: {
          name: '本期有序关联度TOP10',
          text: '客流周期:' + this.saveHeaderData.reportDate
        },
        inversion: {
          name: '本期有序转换量TOP10',
          text: '客流周期:' + this.saveHeaderData.reportDate
        }
      }
    },
    dwellTitle () {
      return {
        name: '本期业态停留时间TOP10',
        text: '客流周期:' + this.saveHeaderData.reportDate
      }
    },
    formatDwellStoreTitle () {
      return {
        name: '本期业态中商铺停留时间TOP10',
        text: '客流周期:' + this.saveHeaderData.reportDate
      }
    },
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
          name: '本期客流',
          color: '#2081D4',
          type: 'column',
          data: []
        },
        {
          name: '上期客流',
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
        this.trendChartData.option.xAxis.categories.push(`第${index + 1}天`)
        // 环比数据
        let lastWeekNumber = this.sequential(list.enter, lastEnter[index].enter)
        // 同比数据
        let yearNumber = this.sequential(list.enter, yearEnter[index].enter)
        // 环比的绝对值
        let absolute = Math.abs(lastWeekNumber)
        if (absolute < size2) {
          size2 = absolute
          smooth.date = moment(list.begin).format('YYYY年MM月DD号')
          smooth.enter = list.enter.toLocaleString()
          smooth.ratio = lastWeekNumber
        }
        if (absolute > size) {
          size = absolute
          maxHighest.date = moment(list.begin).format('YYYY年MM月DD号')
          maxHighest.enter = list.enter.toLocaleString()
          maxHighest.ratio = lastWeekNumber
        }
        this.ratioTableData.push({
          data: [
            moment(list.begin).format('YYYY-MM-DD'),
            list.enter.toLocaleString() + '人次',
            moment(yearEnter[index].begin).format('YYYY-MM-DD'),
            yearEnter[index].enter.toLocaleString() + '人次',
            yearNumber + '%',
            moment(lastEnter[index].begin).format('YYYY-MM-DD'),
            lastEnter[index].enter.toLocaleString() + '人次',
            lastWeekNumber + '%'
          ]
        })
      })
      let cuT = _.sumBy(enter, 'enter')
      let laT = _.sumBy(lastEnter, 'enter')
      let yeT = _.sumBy(yearEnter, 'enter')
      this.trendChartData.option.series = [oneObj, twoObj]
      this.ratioTableData.push({
        data: [
          '合计',
          cuT.toLocaleString() + '人次',
          '-',
          yeT.toLocaleString() + '人次',
          this.sequential(cuT, yeT) + '%',
          '-',
          laT.toLocaleString() + '人次',
          this.sequential(cuT, laT) + '%'
        ]
      })
      this.trendChartData.remarkData = []
      let type = smooth.ratio > 0 ? '增长' : '减少'
      let type2 = maxHighest.ratio > 0 ? '增长' : '减少'

      let text1 = '本期' + smooth.date + '客流' + type + '平稳，为' + smooth.enter + '人次，比上期环比' + type + Math.abs(smooth.ratio) + '%'
      let text2 = '本期' + maxHighest.date + '客流' + type2 + '达到顶峰，为' + maxHighest.enter + '人次，比上期环比' + type2 + Math.abs(maxHighest.ratio) + '%'
      if (smooth.ratio !== '') this.trendChartData.remarkData.push(text1)
      if (maxHighest.ratio !== '') this.trendChartData.remarkData.push(text2)
    },
    gateDataList (gateData) {
      this.gateChartData.option = _.cloneDeep(this.enterOption)
      this.tableData = []
      let [currentObj, yesterObj, lastObj] = [
        {
          name: '本期客流',
          color: '#2081D4',
          type: 'column',
          data: []
        },
        {
          name: '上期客流',
          type: 'column',
          color: '#2BD9CF',
          data: []
        },
        {

          name: '同期客流',
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
      this.gateChartData.option.series = [currentObj, yesterObj, lastObj]
      this.gateChartData.remarkData = gateData.comment ? gateData.comment : []
    },
    shopDataList (shopData) {
      this.shopChartData.option = _.cloneDeep(this.enterOption)
      let [currentObj, yesterObj] = [
        {
          name: '本期客流',
          color: '#2081D4',
          type: 'column',
          data: []
        },
        {
          name: '上期客流',
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
