<template>
<div class="report-center">
  <!-- 选择日期 查看 下载 -->
  <div style="width: 100%; margin-bottom: 21px">
    <div class="day-report-date">
        <Row  class="week-select-date">
          <Col span="12">
            <DatePicker
              type="date"
              @on-change="selectTimeDate"
              @on-open-change = selectDate
              :editable="false"
              :options="options3"
              placeholder="选择日期"
              style="width: 230px"
              :format="selectDateText"
              v-model="selectDateTime"
            >
            </DatePicker>
          </Col>
        </Row>
        <div class="report-query" v-on:click="reportQuery">查询</div>
        <div class="icon-download" v-on:click="uploadReport('week',callData)" title="下载报告">
          <icons type="daoru" color="#2a7dc1" :size = 20 ></icons>
        </div>
        <div style="clear: both"></div>
    </div>
  </div>
    <report-suggest v-if="showPDF&&userRole==='超级管理员'"
      @suggestSubmit='suggestSubmit'
      :propertyId='propertyId'
      :date='callData'
      :suggestText='suggestText'
    ></report-suggest>
  <!-- pdf 内容 -->
  <div class="pdf-text-box" v-bind:class="{pdfAction:showPDF}">
    <div id="pdfDom">
      <!-- 封面 -->
      <report-cover pageTotal='4' titleName='凌图智慧周报' :reportType='reportType' :suggestText='suggestText'></report-cover>
      <!-- 总览 -->
      <report-one title='客流总览' :enterData='enterData'  :listTitle='oneListData' ></report-one>
      <!-- 客流趋势 -->
      <report-chart title='客流趋势' page='2' :listTitle='trendTitle'  :dataList=trendChartData></report-chart>
      <!-- 客流趋势表格 -->
      <report-ratio-table title='客流趋势' page='3'
        :listTitle='trendTitle'
        :tableColumn='ratioTableColumn'
        :tableData ='ratioTableData'
      ></report-ratio-table>
      <!-- 出入口 -->
      <!-- <report-chart title='出入口客流' page='4' :listTitle='gateTitle'  :dataList=gateChartData></report-chart> -->
      <!-- 出入口表格 -->
      <!-- <report-week-five title='出入口客流'
        :listTitle='gate10Title'
        :tableColumn='tableColumn'
        :tableData='tableData'
      ></report-week-five> -->
      <!-- 店铺 -->
      <report-chart title='店铺客流' page='4' :listTitle='shopTitle' :dataList=shopChartData></report-chart>
      <report-back-cover></report-back-cover>
    </div>
  </div>
</div>
</template>
<script>

import reportOne from '@/components/report/newReport/report_one'
import reportWeekFive from '@/components/week-report/new_report_week_five'

import reportCover from '@/components/report/newReport/report_cover'
import reportRatioTable from '@/components/report/newReport/report_ratio_table'
import reportChart from '@/components/report/newReport/report_chart'
import reportSuggest from '@/components/report-public/report_suggest'
import reportBackCover from '@/components/report/newReport/report_back_cover'

import { newReportEnter, newReportSuggest, newReportGate, newReportShop } from '@/api/report'
import { getanalysiseeo } from '@/api/home'

import mixins from './reportMixin.js'
import Bus from '@/libs/bus.js'
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'report-week',
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportRatioTable,
    reportWeekFive,
    reportSuggest,
    reportBackCover

  },
  data () {
    return {
      showPDF: false,
      reportType: 'week',
      // 日期
      selectDateTime: '',
      selectDateText: '',
      callData: '',
      options3: {
        disabledDate (date) {
          var week = moment().locale('zh').format('d')
          if (Number(week) == 0) week = 7
          return date && date.valueOf() > Date.now() - 86400000 * (Number(week))
        }
      },
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
      tableColumn: ['出入口名称', '客流量', '客流峰值', '平均客流量/天'],
      tableData: [],
      lastWeekDate: '',
      lastYearDate: ''

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
    }
  },
  watch: {
    selectDateText () {
      let value = this.selectDateTime
      if (value.length === 0 || value.length === 23) {
        this.callData = ''
        this.selectDateText = ''
        this.selectDateTime = ''
        return false
      }
      var start = moment(value).startOf('isoweek').format('YYYY-MM-DD')
      var end = moment(value).endOf('isoweek').format('YYYY-MM-DD')
      this.selectDateText = (start) + ' - ' + (end)
    }
  },

  activated () {
    this.callData = ''
    this.selectDateText = ''
    this.selectDateTime = ''
    this.showPDF = false
  },
  mounted () {

  },
  methods: {
    // 查询
    reportQuery () {
      if (this.callData === '') {
        alert('请选择时间')
        return false
      }
      this.point('周报分析页面', '数据分析')
      this.headerDate(this.selectDateTime)
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
        if (res[0].data.code === 200) {
          this.suggestText = res[0].data.data[0].property_suggest
        }
        if (res[1].data.code === 200) {
          this.reportOneData(res[1].data.data)
        }
        // 趋势数据
        this.trendDataList(res[2].data.data, res[3].data.data, res[4].data.data)
        // 出入口数据
        // this.gateDateList(res[5].data.data)
        // 商铺数据
        this.shopDataList(res[6].data.data)
        Bus.$emit('chartData')
      })
    },
    // 时间发生变化
    selectTimeDate (value) {
      if (value.length === 0 || value.length === 23) {
        this.callData = ''
        this.selectDateText = ''
        this.selectDateTime = ''
        return false
      }
      var start = moment(value).startOf('isoweek').format('YYYY-MM-DD')
      var end = moment(value).endOf('isoweek').format('YYYY-MM-DD')
      this.selectDateText = (start) + ' - ' + (end)
      this.callData = start + ',' + end
      // 上周时间
      let yester = moment(moment(start).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let lastWeekStart = moment(yester).startOf('isoweek').format('YYYY-MM-DD')
      let lastWeekend = moment(yester).endOf('isoweek').format('YYYY-MM-DD')
      this.lastWeekDate = lastWeekStart + ',' + lastWeekend
      // 去年时间
      let lastYear = moment(value).add(-1, 'y').format('YYYY')
      let lastYearStart = lastYear + moment(value).startOf('isoweek').format('-MM-DD')
      let lastYearEnd = lastYear + moment(value).endOf('isoweek').format('-MM-DD')
      this.lastYearDate = lastYearStart + ',' + lastYearEnd
    },
    selectDate (value) {
      if (value == true) {
        this.selectDateTime = ''
        this.selectDateText = ''
        this.callData = ''
      }
    },
    headerDate (value) {
      var start = moment(value).startOf('isoweek').format('YYYY-MM-DD')
      var end = moment(value).endOf('isoweek').format('YYYY-MM-DD')
      let yester = moment(moment(start).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let headerDate = {
        year: moment(value).format('YYYY'),
        period: moment(value).format('WW'),
        time: moment(start).format('MM.DD') + ' - ' + moment(end).format('MM.DD'),
        week: '',
        type: 'week',
        yester: moment(yester).format('YYYY') + '年第' + moment(yester).format('WW') + '周',
        reportDate: moment(value).startOf('isoweek').format('YYYY.MM.DD') + '-' + moment(value).endOf('isoweek').format('YYYY.MM.DD')
      }
      this.$store.commit('reportHeader', headerDate)
    },
    trendDataList (enter, lastEnter, yearEnter) {
      this.dataEmpty('trendChartData')

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
        '本周' + smooth.date + '客流' + type + '平稳，为' + smooth.enter + '人次，比上周环比' + type + Math.abs(smooth.ratio) + '%',
        '本周' + maxHighest.date + '客流' + type2 + '达到顶峰，为' + maxHighest.enter + '人次，比上周环比' + type2 + Math.abs(maxHighest.ratio) + '%'
      ]
    },
    gateDateList (data) {
      this.dataEmpty('gateChartData')
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
      this.dataEmpty('shopChartData')
      _.take(data.current, 10).forEach(list => {
        this.shopChartData.seriesData[0].data.push(list.data)
        let contrast = _.filter(data.contrast, (o) => { return o.id === list.id })[0]
        this.shopChartData.seriesData[1].data.push(contrast ? contrast.data : 0)
        this.shopChartData.xAxisData.push(list.name)
      })
      this.shopChartData.remarkData = data.comment ? data.comment : []
    }
  },
  created () {}

}
</script>
<style lang="less">
    .week-select-date{
      .ivu-input{
        height: 43px;
        font-size: 16px;
        border: 1px solid rgba(0, 0, 0, .2);
        font-family: "source_han_sans_cn", "Roboto", sans-serif;
      }
    }
</style>
<style lang="less" scoped>

    .pdf-text-box{
        background-color: #fff;
        height: 0;
        overflow: hidden;
    }
    .pdfAction{
        height: auto!important;
    }
    .day-report-date{
        margin-top: 9px;
        padding: 20px 0 20px 30px;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
        position: relative;
        .report-query{
          float: left;
          height: 43px;
          padding: .75rem 2rem;
          border-radius: 6px;
          background: #37b5ed!important;
          border: 1px solid #37b5ed;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          margin-left: 30px;
        }
    }
    .week-select-date{
        float: left;
    }
    .icon-download{
        width: 43px;
        height: 43px;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        background-color: #fff;
        text-align: center;
        line-height: 43px;
        float: left;
        margin-left: 60px;
        box-shadow:0px 0px 9px 0px rgba(166, 168, 169, .4);
        cursor: pointer;
        &:before{
          content:none
        }
    }
     #pdfDom{
        background-color: #fff;
        margin: 0 auto;
        overflow: hidden;
        width: 1200px;
        .reportOneText{
          float: left;
          width: 100%;
          // height: auto;
          padding-bottom: 150px;
          border-bottom: 2px solid #99abb4;
        }
    }
</style>
