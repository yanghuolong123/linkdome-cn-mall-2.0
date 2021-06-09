<template>
  <div class="report-center">
    <div class="pdf-text-box">
      <div id="pdfDom">
         <!-- 封面 -->
      <report-cover pageTotal='4' titleName='凌图智慧周报' :reportType='reportType' :suggestText='suggestText'></report-cover>
      <!-- 总览 -->
      <report-one title='客流总览' :enterData='enterData'  :listTitle='oneListData' ></report-one>
      <!-- 客流趋势 -->
      <report-chart title='客流趋势' page='2' :listTitle='trendTitle'  :dataList='trendChartData'></report-chart>
      <!-- 客流趋势表格 -->
      <report-ratio-table title='客流趋势' page='3'
        :listTitle='trendTitle'
        :tableColumn='ratioTableColumn'
        :tableData ='ratioTableData'
      ></report-ratio-table>
      <!-- 出入口 -->
      <!-- <report-chart title='出入口客流' page='4' :listTitle='gateTitle'  :dataList='gateChartData'></report-chart> -->
      <!-- 出入口表格 -->
      <!-- <report-week-five title='出入口客流'
        :listTitle='gate10Title'
        :tableColumn='tableColumn'
        :tableData='tableData'
      ></report-week-five> -->
      <!-- 店铺 -->
      <report-chart title='店铺客流' page='4' :listTitle='shopTitle' :dataList='shopChartData'></report-chart>
      <report-back-cover></report-back-cover>
      </div>

    </div>
  </div>
</template>
<script>
import reportCover from '@/components/report/newReport/report_cover'
import reportOne from '@/components/report/newReport/report_one'
import reportChart from '@/components/report/newReport/report_chart'
import reportRatioTable from '@/components/report/newReport/report_ratio_table'
import reportWeekFive from '@/components/week-report/new_report_week_five'
import reportBackCover from '@/components/report/newReport/report_back_cover'

import moment from 'moment'
import _ from 'lodash'
import Bus from '@/libs/bus.js'
import { setToken } from '@/libs/util'
import axios from 'axios'
import mixins from './reportMixin.js'
import { newReportEnter, newReportSuggest, newReportGate, newReportShop } from '@/api/report'
import { getanalysiseeo, getGroupOrganization } from '@/api/home'
export default {
  name: 'new-download-report-week',
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportWeekFive,
    reportRatioTable,
    reportBackCover

  },
  data () {
    return {
      reportType: 'week',
      trendChartData: {
        seriesData: [
          {
            name: '本周客流',
            color: '#2081D4',
            type: 'column',
            data: []
          },
          {
            name: '上周客流',
            type: 'column',
            color: '#2BD9CF',
            data: []

          }
        ],
        xAxisData: ['name1', 'name2', 'name2'],
        remarkData: []
      },
      gateChartData: {
        seriesData: [
          {
            name: '本周客流',
            color: '#2081D4',
            type: 'column',
            data: []
          },
          {
            name: '上周客流',
            type: 'column',
            color: '#2BD9CF',
            data: []

          }
        ],
        xAxisData: [],
        remarkData: []
      },
      shopChartData: {
        seriesData: [
          {
            name: '本周客流',
            color: '#2081D4',
            type: 'column',
            data: []
          },
          {
            name: '上周客流',
            type: 'column',
            color: '#2BD9CF',
            data: []

          }
        ],
        xAxisData: [],
        remarkData: []
      },
      ratioTableColumn: {
        name1: ['时间', '入客流'],
        name2: ['同比分析', '环比分析'],
        name3: ['时间', '入客流', '增长率', '时间', '入客流', '增长率']
      },
      ratioTableData: [],
      tableColumn: ['出入口名称', '客流量', '客流峰值', '平均客流量/小时'],
      tableData: []
    }
  },
  computed: {
    oneListData () {
      let data = this.$store.state.report.reportHeader
      return [
        {
          name: '本周客流总览',
          text: '客流周期:' + data.year + '年第' + data.period + '周'
        },
        {
          name: '上周客流总览',
          text: '客流周期:' + data.yester
        }
      ]
    },
    trendTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本周客流趋势',
        text: '客流周期:' + data.year + '年第' + data.period + '周'
      }
    },
    gateTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本周出入口客流TOP10对比分析',
        text: '客流周期:' + data.year + '年第' + data.period + '周'
      }
    },
    gate10Title () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本周出入口客流TOP10',
        text: '客流周期:' + data.year + '年第' + data.period + '周'
      }
    },
    shopTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本周店铺客流TOP10对比分析',
        text: '客流周期:' + data.year + '年第' + data.period + '周'
      }
    },

    callData () {
      return this.$route.query.date
    },
    lastWeekDate () {
      var start = this.$route.query.date.split(',')[0]
      let yester = moment(moment(start).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let lastWeekStart = moment(yester).startOf('isoweek').format('YYYY-MM-DD')
      let lastWeekend = moment(yester).endOf('isoweek').format('YYYY-MM-DD')
      return lastWeekStart + ',' + lastWeekend
    },
    lastYearDate () {
      let value = this.$route.query.date.split(',')[0]
      let lastYear = moment(value).add(-1, 'y').format('YYYY')
      let lastYearStart = lastYear + moment(value).startOf('isoweek').format('-MM-DD')
      let lastYearEnd = lastYear + moment(value).endOf('isoweek').format('-MM-DD')
      return lastYearStart + ',' + lastYearEnd
    }

  },
  watch: {
  },
  activated () {
  },
  mounted () {
    let token = this.$route.query.token
    setToken(token, 1)
    this.parameterData()
  },
  methods: {
    parameterData () { // 查找对应的 购物中心 id
      getGroupOrganization().then(res => {
        let propertyId = Number(this.$route.query.propertyId)
        let property = _.filter(res.data.data.property, o => { return o.property_id === propertyId })[0]
        this.$store.commit('saveOrganizationData', res.data.data)
        this.$store.commit('headerData', { text: property.name, value: property.property_id, img: property.map_url })
        this.$store.commit('headerAction', property.property_id)
        setTimeout(() => {
          this.reportQuery()
        }, 1000)
      })
    },
    reportQuery () {
      this.headerDate()
      Promise.all([
        newReportSuggest({ property_id: this.propertyId, date: this.callData }),
        // 总客流
        newReportEnter({ property_id: this.propertyId, timeRange: this.callData }),
        // 本周客流
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.callData, innerRange: '1day' }),
        // 上周客流
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.lastWeekDate, innerRange: '1day' }),
        // 去年客流
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.lastYearDate, innerRange: '1day' }),
        // 出入口
        // newReportGate({ timeRange1: this.callData, timeRange2: this.lastWeekDate, report_type: 'week', property_id: this.propertyId }),
        // 商铺
        newReportShop({ time1: this.callData, time2: this.lastWeekDate, report_type: 'week', property_id: this.propertyId })
      ]).then(res => {
        this.showPDF = true
        // 建议
        if (res[0].data.code === 200) {
          this.suggestText = res[0].data.data[0].property_suggest
        }
        // 客流总览
        if (res[1].data.code === 200) {
          this.reportOneData(res[1].data.data)
        }
        // 趋势数据
        this.trendDataList(res[2].data.data, res[3].data.data, res[4].data.data)
        // 出入口数据
        // this.gateDateList(res[5].data.data)
        // 商铺数据
        this.shopDataList(res[5].data.data)
        Bus.$emit('chartData')
        let ht = window.location.href.split('://')[0]
        setTimeout(() => {
          axios.get(ht + '://pdfcenter.linkdome.cn/pdf/finish', {
            params: {
              filename: this.callData
            }
          })
            .then(function (response) {
            })
        }, 5000)
      })
    },

    trendDataList (enter, lastEnter, yearEnter) {
      this.trendChartData.seriesData[0].data = []
      this.trendChartData.seriesData[1].data = []
      this.trendChartData.xAxisData = []
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
      let size = 0
      let size2 = 999
      enter.forEach((list, index) => {
        let weekType = this.weekType(list.begin)
        this.trendChartData.seriesData[0].data.push(list.enter)
        this.trendChartData.seriesData[1].data.push(lastEnter[index].enter)
        this.trendChartData.xAxisData.push(weekType)
        // 环比数据
        let lastWeekNumber = this.sequential(list.enter, lastEnter[index].enter)
        // 同比数据
        let yearNumber = this.sequential(list.enter, yearEnter[index].enter)
        // 环比的绝对值
        let absolute = Math.abs(lastWeekNumber)
        if (absolute < size2) {
          size2 = absolute
          smooth.date = moment(list.begin).format('YYYY年MM月DD号') + weekType
          smooth.enter = list.enter.toLocaleString()
          smooth.ratio = lastWeekNumber
        }
        if (absolute > size) {
          size = absolute
          maxHighest.date = moment(list.begin).format('YYYY年MM月DD号') + weekType
          maxHighest.enter = list.enter.toLocaleString()
          maxHighest.ratio = lastWeekNumber
        }
        this.ratioTableData.push({
          data: [
            moment(list.begin).format('YYYY-MM-DD') + ' ' + weekType,
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
      let cuT = _.sumBy(enter, (o) => { return o.enter })
      let laT = _.sumBy(lastEnter, (o) => { return o.enter })
      let yeT = _.sumBy(yearEnter, (o) => { return o.enter })
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
      let type = smooth.ratio > 0 ? '增长' : '减少'
      let type2 = maxHighest.ratio > 0 ? '增长' : '减少'
      this.trendChartData.remarkData = [
        '本周' + smooth.date + '客流' + type + '平稳，为' + smooth.enter + '人次，比上周环比' + type + smooth.ratio + '%',
        '本周' + maxHighest.date + '客流' + type2 + '达到顶峰，为' + maxHighest.enter + '人次，比上周环比' + type2 + maxHighest.ratio + '%'
      ]
    },
    gateDateList (data) {
      this.gateChartData.seriesData[0].data = []
      this.gateChartData.seriesData[1].data = []
      this.gateChartData.xAxisData = []
      this.gateChartData.remarkData = []
      this.tableData = []
      let cunnentData = data.data
      let lastData = data.contrast
      cunnentData.forEach(list => {
        this.gateChartData.seriesData[0].data.push(list.enter)
        let lastSize = _.filter(lastData, (o) => { return o.bzid === list.bzid })[0]
        let lastNumber = lastSize ? lastSize.enter : 0
        this.gateChartData.seriesData[1].data.push(lastNumber)
        this.gateChartData.xAxisData.push(list.name)
        this.tableData.push({
          name: list.name,
          enter: list.enter.toLocaleString(),
          peak: list.highest.number.toLocaleString(),
          time: moment(list.highest.begin).format('YYYY-MM-DD'),
          mean: list.avg.toLocaleString()
        })
      })
      this.gateChartData.remarkData = data.comment ? data.comment : []
    },
    shopDataList (data) {
      this.shopChartData.seriesData[0].data = []
      this.shopChartData.seriesData[1].data = []
      this.shopChartData.xAxisData = []
      this.shopChartData.remarkData = []
      _.take(data.current, 10).forEach(list => {
        this.shopChartData.seriesData[0].data.push(list.data)
        let contrast = _.filter(data.contrast, (o) => { return o.id === list.id })[0]
        this.shopChartData.seriesData[1].data.push(contrast ? contrast.data : 0)
        this.shopChartData.xAxisData.push(list.name)
      })
      this.shopChartData.remarkData = data.comment ? data.comment : []
    },
    headerDate (value) {
      var start = this.$route.query.date.split(',')[0]
      var end = this.$route.query.date.split(',')[1]
      let yester = moment(moment(start).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let headerDate = {
        year: moment(start).format('YYYY'),
        period: moment(start).format('WW'),
        time: moment(start).format('MM.DD') + ' - ' + moment(end).format('MM.DD'),
        week: '',
        type: 'week',
        yester: moment(yester).format('YYYY') + '年第' + moment(yester).format('WW') + '周',
        reportDate: moment(start).startOf('isoweek').format('YYYY.MM.DD') + ' - ' + moment(start).endOf('isoweek').format('YYYY.MM.DD')
      }
      this.$store.commit('reportHeader', headerDate)
    }
  }
}
</script>

<style lang="less" scoped>
#pdfDom{
    background-color: #fff;
    overflow: hidden;
    width: 1200px;
    .reportOneText{
      float: left;
    }
}
</style>
