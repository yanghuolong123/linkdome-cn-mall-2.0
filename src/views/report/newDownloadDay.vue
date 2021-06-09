<template>
  <div class="report-center">
    <div class="pdf-text-box">
      <div id="pdfDom">
        <!-- 封面 -->
        <report-cover :reportType='reportType'  :suggestText='suggestText' titleName='凌图智慧日报' pageTotal='4'></report-cover>
        <!-- 总览 -->
        <report-one title='客流总览' :enterData='enterData' :listTitle='oneListData'></report-one>
        <!--客流趋势  -->
        <report-chart title='客流趋势' page='2' :listTitle='trendTitle'  :dataList=trendChartData></report-chart>
        <report-ratio-table
          title='客流趋势'
          page='3'
          :listTitle='trendTitle'
          :tableColumn='ratioTableColumn'
          :tableData ='ratioTableData'
        >
        </report-ratio-table>
        <!-- 出入口 -->
        <!-- <report-chart title='出入口客流' page='4' :listTitle='gateTitle' :dataList='gateChartData'></report-chart> -->
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
  name: 'new-download-report-day',
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportRatioTable,
    reportBackCover

  },
  data () {
    return {
      reportType: 'daily',
      trendChartData: {
        seriesData: [
          {
            name: '客流',
            color: '#745AEF',
            type: 'line',
            data: []
          },
          {
            name: '集客量',
            type: 'line',
            color: '#00A0E9',
            data: []
          }
        ],
        xAxisData: [],
        remarkData: []
      },
      gateChartData: {
        seriesData: [
          {
            name: '本日客流',
            color: '#2081D4',
            type: 'column',
            data: []
          },
          {
            name: '昨日客流',
            color: '#2BD9CF',
            type: 'column',
            data: []
          }
        ],
        xAxisData: [],
        remarkData: []
      },
      shopChartData: {
        seriesData: [
          {
            name: '本日客流',
            color: '#2081d4',
            type: 'column',
            data: []
          },
          {
            name: '昨日客流',
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
        name2: ['环比分析'],
        name3: ['时间', '入客流', '增长率']
      },
      ratioTableData: []
    }
  },
  computed: {
    oneListData () {
      let data = this.$store.state.report.reportHeader
      return [
        {
          name: '当日客流总览',
          text: '客流时间:' + data.year + '.' + data.time
        },
        {
          name: '昨日客流总览',
          text: '客流时间:' + data.yester
        }
      ]
    },
    trendTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '当日客流趋势',
        text: '客流时间:' + data.year + '.' + data.time
      }
    },
    gateTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '当日出入口客流TOP10对比分析',
        text: '客流时间:' + data.year + '.' + data.time
      }
    },
    shopTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '当日店铺客流TOP10对比分析',
        text: '客流时间:' + data.year + '.' + data.time
      }
    },
    selectDateText () {
      return this.$route.query.date
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
      let reportDate = this.$route.query.date.split(',')[0]
      this.headerDate(reportDate)
      let yesterday = moment(reportDate).subtract(1, 'days').format('YYYY-MM-DD')
      Promise.all([
        // 建议
        newReportSuggest({ property_id: this.propertyId, date: this.selectDateText }),
        // 客流总览
        newReportEnter({ property_id: this.propertyId, timeRange: this.selectDateText }),
        //  当前趋势
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.selectDateText, innerRange: '1h' }),
        // 当前集客量
        getanalysiseeo({ bzid: this.bzid, type: 'occupancy', range: this.selectDateText, innerRange: '1h' }),
        // 昨日趋势
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: yesterday + ',' + yesterday, innerRange: '1h' }),
        // 出入口
        // newReportGate({ timeRange1: this.selectDateText, timeRange2: yesterday + ',' + yesterday, report_type: 'day', property_id: this.propertyId }),
        // 商铺
        newReportShop({ time1: this.selectDateText, time2: yesterday + ',' + yesterday, report_type: 'day', property_id: this.propertyId })
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
        // 客流趋势
        this.trendDataList(res[2].data.data, res[3].data.data, res[4].data.data)
        // 出入口
        // this.gateDataList(res[5].data.data)
        // 商铺
        this.shopDataList(res[5].data.data)
        Bus.$emit('chartData')
        let ht = window.location.href.split('://')[0]
        setTimeout(() => {
          axios.get(ht + '://pdfcenter.linkdome.cn/pdf/finish', {
            params: {
              filename: this.selectDateText
            }
          })
            .then(function (response) {
            })
        }, 5000)
      })
    },

    // 趋势数据
    trendDataList (enterData, occupancyData, yesterdayData) {
      this.trendChartData.xAxisData = []
      this.trendChartData.seriesData[0].data = []
      this.trendChartData.seriesData[1].data = []
      this.trendChartData.remarkData = []
      this.ratioTableData = []
      let highest = {
        number: 0,
        time: ''
      }
      if (enterData) {
        enterData.forEach((list, index) => {
          let time = moment(list.begin).format('HH:mm')
          this.trendChartData.xAxisData.push(time)
          this.trendChartData.seriesData[0].data.push(list.enter)
          let occupancy = occupancyData[index].occupancy < 0 ? 0 : occupancyData[index].occupancy
          this.trendChartData.seriesData[1].data.push(occupancy)
          if (Number(list.enter) > highest.number) {
            highest.number = list.enter
            highest.time = Number(moment(list.begin).format('H'))
          }
          // 表格
          this.ratioTableData.push({
            data: [
              moment(list.begin).format('YYYY-MM-DD-HH:mm'),
              list.enter.toLocaleString() + '人次',
              moment(yesterdayData[index].begin).format('YYYY-MM-DD-HH:mm'),
              yesterdayData[index].enter.toLocaleString() + '人次',
              this.sequential(list.enter, yesterdayData[index].enter) + '%'
            ]
          })
        })
      }
      let cuT = _.sumBy(enterData, (o) => { return o.enter })
      let yeT = _.sumBy(yesterdayData, (o) => { return o.enter })
      this.ratioTableData.push({
        data: [
          '合计',
          cuT.toLocaleString() + '人次',
          '-',
          yeT.toLocaleString() + '人次',
          this.sequential(cuT, yeT) + '%'
        ]
      })
      let enterNumber = this.trendChartData.seriesData[0].data
      this.trendChartData.remarkData = [
        '当日开始营业时间客流量' + enterNumber[0].toLocaleString() + '人次',
        '当日结束营业时间客流量' + enterNumber[enterNumber.length - 1].toLocaleString() + '人次',
        '当日' + highest.time + '点到' + (highest.time + 1) + '点达到客流峰值' + highest.number.toLocaleString() + '人次'
      ]
    },
    gateDataList (gateData) {
      this.gateChartData.seriesData[0].data = []
      this.gateChartData.xAxisData = []
      this.gateChartData.remarkData = []
      if (gateData.data) {
        gateData.data.forEach(list => {
          this.gateChartData.seriesData[0].data.push(list.enter)
          let yesterEnter = _.find(gateData.contrast, o => o.bzid === list.bzid).enter
          this.gateChartData.seriesData[1].data.push(yesterEnter)
          this.gateChartData.xAxisData.push(list.name)
        })
      }

      this.gateChartData.remarkData = gateData.comment
    },
    shopDataList (shopData) {
      this.shopChartData.seriesData[0].data = []
      this.shopChartData.seriesData[1].data = []
      this.shopChartData.xAxisData = []
      this.shopChartData.remarkData = []
      if (shopData.current) {
        _.take(shopData.current, 10).forEach(list => {
          this.shopChartData.seriesData[0].data.push(list.data)
          let yesterEnter = _.find(shopData.contrast, o => o.id === list.id).data
          this.shopChartData.seriesData[1].data.push(yesterEnter)
          this.shopChartData.xAxisData.push(list.name)
        })
      }
      this.shopChartData.remarkData = shopData.comment
    },
    headerDate (value) {
      let headerDate = {
        year: moment(value).format('YYYY'),
        time: moment(value).format('MM.DD'),
        period: '',
        week: this.weekType(),
        type: 'daily',
        yester: moment(value).subtract(1, 'days').format('YYYY.MM.DD'),
        reportDate: moment(value).format('YYYY.MM.DD')
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
