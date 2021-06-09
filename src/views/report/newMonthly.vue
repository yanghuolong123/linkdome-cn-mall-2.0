<template>
<div class="report-center">
  <!-- 选择日期 查看 下载 -->
   <div style="width: 100%; margin-bottom: 21px">
            <div class="month-report-date">
                <Row style="float: left">
                    <Col span="12">
                      <DatePicker
                        type="month"
                        @on-change="selectTimeDate"
                        :editable="false"
                        :options="options3"
                        placeholder="选择日期"
                        style="width: 230px"
                        v-model="selectDateTime"
                      >
                      </DatePicker>
                    </Col>
                </Row>
                <div class="report-query" v-on:click="reportQuery">查询</div>
                <div class="icon-download" v-on:click="uploadReport('month',selectDate)" title="下载报告">
                    <icons type="daoru" color="#2a7dc1" :size = 20 ></icons>
                </div>
                <div style="clear: both"></div>
            </div>
        </div>
    <report-suggest
     v-if="showPDF&&userRole==='超级管理员'"
      @suggestSubmit='suggestSubmit'
      :propertyId='propertyId'
      :date='selectDate'
      :suggestText='suggestText'
    ></report-suggest>
  <!-- pdf 内容 -->
  <div class="pdf-text-box" v-bind:class="{pdfAction:showPDF}">
    <div id="pdfDom">
      <!-- 封面 -->
      <report-cover pageTotal='6'  :suggestText='suggestText' titleName='凌图智慧月报' :reportType='reportType'></report-cover>
      <!-- 总览 -->
      <report-one title='客流总览' :enterData='enterData' :listTitle='oneListData' ></report-one>
      <!-- 客流趋势 -->
      <report-chart title='客流趋势' :listTitle='trendTitle' page='2'  :dataList=trendChartData></report-chart>
      <report-ratio-table
        title="客流分析"
        page='3'
        :listTitle='analyseTitle'
        :tableColumn='ratioTableColumn'
        :tableData ='ratioTableData'
       ></report-ratio-table>
      <!-- 出入口 -->
      <!-- <report-chart title='出入口客流' page='4' :listTitle='gate10Title' :dataList='gateTop10'></report-chart> -->
      <!-- 楼层 出入口 -->
      <!-- <report-chart-multi title='出入口客流' page='5' :listTitle='gateFloorTitle' :dataList='floorGateChartData'></report-chart-multi> -->
      <!-- 店铺 -->
      <report-chart title='店铺客流' page='4' :listTitle='shop10Title' :dataList='shop10Data'></report-chart>
      <!-- 楼层 店铺 -->
      <report-chart-multi title='店铺客流' page='5'  :listTitle='floorShopTitle' :dataList='floorShopChartData'></report-chart-multi>
      <!-- 业态 店铺 -->
      <report-chart-multi title='店铺客流' page='6'  :listTitle='shopcAtivitiesTitle' :dataList='formatShopChartData'></report-chart-multi>
      <report-back-cover></report-back-cover>
    </div>
  </div>
</div>
</template>
<script>

import reportOne from '@/components/report/newReport/report_one'

import reportCover from '@/components/report/newReport/report_cover'
import reportRatioTable from '@/components/report/newReport/report_ratio_table'
import reportChart from '@/components/report/newReport/report_chart'
import reportSuggest from '@/components/report-public/report_suggest'
import reportChartMulti from '@/components/report/newReport/report_chart_multi'
import reportBackCover from '@/components/report/newReport/report_back_cover'
import { newReportEnter,
  newReportSuggest,
  newReportMonthRemark,
  newReportGate,
  monthlyCameraList,
  newReportShop,
  newReportFloorShop,
  newReportFormatShop
} from '@/api/report'
import { getanalysiseeo } from '@/api/home'
import _ from 'lodash'
import Bus from '@/libs/bus.js'
import moment from 'moment'
import mixins from './reportMixin.js'
export default {
  name: 'report-week',
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportRatioTable,
    reportSuggest,
    reportChartMulti,
    reportBackCover

  },
  data () {
    return {
      showPDF: false,
      reportType: 'monthly',
      // 日期
      selectDateTime: '',
      selectDate: '',
      lastMonthDate: '',
      options3: {
        disabledDate (date) {
          var curDate = new Date()
          /* 获取当前月份 */
          var curMonth = curDate.getMonth()
          /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
          curDate.setMonth(curMonth + 1)
          /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
          curDate.setDate(0)
          /* 返回当月的天数 */
          var size = curDate.getDate()
          return date && date.valueOf() > Date.now() - 86400000 * size
        }
      },
      trendChartData: {
        seriesData:
          [
            {
              name: '每日客流',
              type: 'column',
              color: '#00A0E9',
              data: []
            },
            {
              name: '本月客流趋势',
              type: 'spline',
              color: '#4EDBDA',
              marker: {
                enabled: false
              },
              dataLabels: {
                enabled: true,
                allowOverlap: true, // 允许数据标签重叠
                formatter () {
                  return this.y.toLocaleString()
                }
              },
              data: [],
              tooltip: {
                valueSuffix: ''
              }
            },
            {
              name: '平均客流',
              type: 'spline',
              color: '#FEB33D',
              marker: {
                enabled: false
              },
              data: [],
              tooltip: {
                valueSuffix: ''
              }
            }

          ],
        xAxisData: [],
        remarkData: []
      },
      gateTop10: {
        seriesData: [
          {
            name: '本月客流',
            type: 'column',
            color: '#2081D4',
            data: []
          },
          {
            name: '上月客流',
            type: 'column',
            color: '#2BD9CF',
            data: []
          }
        ],
        xAxisData: [],
        remarkData: []
      },
      floorGateChartData: [],
      shop10Data: {
        seriesData: [
          {
            name: '本月客流',
            type: 'column',
            color: '#2081D4',
            data: []
          },
          {
            name: '上月客流',
            type: 'column',
            color: '#2BD9CF',
            data: []
          }
        ],
        xAxisData: [],
        remarkData: []
      },
      floorShopChartData: [],
      formatShopChartData: [],
      ratioTableColumn: {
        name1: ['时间', '客流量'],
        name2: ['客流峰值'],
        name3: ['时间', '客流峰值']
      },
      ratioTableData: []
    }
  },
  computed: {
    oneListData () {
      let data = this.$store.state.report.reportHeader
      return [
        {
          name: '本月客流总览',
          text: '客流时间:' + data.year + '年' + data.time + '月'
        },
        {
          name: '上月客流总览',
          text: '客流时间:' + data.yester
        }
      ]
    },
    trendTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本月客流趋势',
        text: '客流时间:' + data.year + '年' + data.time + '月'
      }
    },
    analyseTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本月每周客流分析',
        text: '客流时间:' + data.year + '年' + data.time + '月'
      }
    },
    gate10Title () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本月出入口客流TOP10对比分析',
        text: '客流时间:' + data.year + '年' + data.time + '月'
      }
    },
    gateFloorTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本月各楼层TOP10出入口客流分析',
        text: '客流时间:' + data.year + '年' + data.time + '月'
      }
    },
    shop10Title () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本月店铺客流TOP10对比分析',
        text: '客流时间:' + data.year + '年' + data.time + '月'
      }
    },
    floorShopTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本月各楼层TOP10店铺客流分析',
        text: '客流时间:' + data.year + '年' + data.time + '月'
      }
    },
    shopcAtivitiesTitle () {
      let data = this.$store.state.report.reportHeader
      return {
        name: '本月各业态TOP10店铺客流分析',
        text: '客流时间:' + data.year + '年' + data.time + '月'
      }
    }
  },
  watch: {

  },

  activated () {
    this.showPDF = false
    this.selectDateTime = ''
    this.selectDate = ''
  },
  mounted () {
  },
  methods: {
    // 查询
    reportQuery () {
      if (this.selectDate === '') {
        alert('请选择时间')
        return false
      }
      this.headerDate(this.selectDateTime)
      this.point('月报分析页面', '数据分析')
      Promise.all([
        // 建议
        newReportSuggest({ property_id: this.propertyId, date: this.selectDate }),
        newReportEnter({ property_id: this.propertyId, timeRange: this.selectDate }),
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.selectDate, innerRange: '1day' }),
        newReportMonthRemark({ property_id: this.propertyId, timeRange: this.selectDate }),
        // newReportGate({ property_id: this.propertyId, timeRange1: this.selectDate, timeRange2: this.lastMonthDate, report_type: 'month' }),
        // monthlyCameraList(this.propertyId, this.selectDate),
        newReportShop({ time1: this.selectDate, time2: this.lastMonthDate, report_type: 'month', property_id: this.propertyId }),
        newReportFloorShop({ property_id: this.propertyId, timeRange: this.selectDate }),
        newReportFormatShop({ property_id: this.propertyId, timeRange: this.selectDate })
      ]).then(res => {
        this.suggestText = res[0].data.data[0].property_suggest
        this.reportOneData(res[1].data.data)
        this.trendDataList(res[2].data.data, res[3].data.data)
        this.trendTableData(res[2].data.data)
        // this.gateDataList(res[4].data.data)
        // this.floorGateData(res[5].data.data)
        this.shopDataList(res[4].data.data)
        this.floorShopDataList(res[5].data.data)
        this.formatShopDataList(res[6].data.data)
        Bus.$emit('chartData')
        this.showPDF = true
      })
    },
    // 时间发生变化
    selectTimeDate (value) {
      if (value == '') { this.selectDateTime = ''; return false }
      var startTime = moment(value).startOf('month')
      var endTime = moment(value).endOf('month')
      let yester = moment(moment(startTime).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let yesterStart = moment(yester).startOf('month')
      let yesterEnd = moment(yester).endOf('month')
      this.selectDate = moment(startTime).format('YYYY-MM-DD') + ',' + moment(endTime).format('YYYY-MM-DD')
      this.lastMonthDate = moment(yesterStart).format('YYYY-MM-DD') + ',' + moment(yesterEnd).format('YYYY-MM-DD')
    },
    trendDataList (data, remarkData) {
      this.dataEmpty('trendChartData')
      let totalNumber = Number((_.sumBy(data, 'enter') / data.length).toFixed(2))
      data.forEach((list, index) => {
        this.trendChartData.seriesData[0].data.push(list.enter)
        this.trendChartData.seriesData[1].data.push(list.enter)
        this.trendChartData.seriesData[2].data.push(totalNumber)
        this.trendChartData.xAxisData.push(moment(list.begin).format('YYYY-MM-DD'))
      })
      this.trendChartData.remarkData = remarkData.comment
    },
    trendTableData (data) {
      this.ratioTableData = []
      let maxEnter = _.maxBy(data, o => { return o.enter })
      let totalEnter = _.sumBy(data, o => { return o.enter })
      let newArr = [[], [], [], [], [], []]
      let week = moment(data[0].begin).locale('zh').format('d')
      for (var i = 0; i <= (7 - Number(week)); i++) {
        var obj = {}
        obj.time = moment(data[i].begin).format('YYYY-MM-DD')
        obj.enter = data[i].enter
        newArr[0].push(obj)
      }
      var le1 = newArr[0].length
      newArr[1] = this.weekLists(data, le1)

      var le2 = newArr[0].length + newArr[1].length
      newArr[2] = this.weekLists(data, le2)

      var le3 = newArr[0].length + newArr[1].length + newArr[2].length
      newArr[3] = this.weekLists(data, le3)

      var le4 = newArr[0].length + newArr[1].length + newArr[2].length + newArr[3].length
      newArr[4] = this.weekLists(data, le4)

      var le5 = newArr[0].length + newArr[1].length + newArr[2].length + newArr[3].length + newArr[4].length
      newArr[5] = this.weekLists(data, le5)
      for (let i = 0; i < newArr.length; i++) {
        this.processingTableData(newArr[i])
      }
      let total = {
        data: [
          '本月合计',
          totalEnter.toLocaleString() + '人次'
          // moment(maxEnter.begin).format('YYYY-MM-DD'),
          // maxEnter.enter.toLocaleString() + '人次'
        ]
      }
      this.ratioTableData.push(total)
    },
    // 出入口
    gateDataList (data) {
      this.dataEmpty('gateTop10')
      data.data.forEach((list, index) => {
        this.gateTop10.seriesData[0].data.push(list.enter)
        let last = _.filter(data.contrast, (o) => { return o.bzid === list.bzid })[0]
        this.gateTop10.seriesData[1].data.push(last ? last.enter : 0)
        this.gateTop10.xAxisData.push(list.name)
      })
      this.gateTop10.remarkData = data.comment
    },
    floorGateData (data) {
      this.floorGateChartData = []
      this.shopDataDispose(data, 'floorGateChartData')
    },
    shopDataList (data) {
      this.dataEmpty('shop10Data')
      _.take(data.current, 10).forEach(list => {
        this.shop10Data.seriesData[0].data.push(list.data)
        let last = _.filter(data.contrast, (o) => { return o.id === list.id })[0]
        this.shop10Data.seriesData[1].data.push(last ? last.data : 0)
        this.shop10Data.xAxisData.push(list.name)
      })
      this.shop10Data.remarkData = data.comment
    },
    floorShopDataList (data) {
      this.floorShopChartData = []
      this.shopDataDispose(data, 'floorShopChartData')
    },
    formatShopDataList (data) {
      this.formatShopChartData = []
      this.shopDataDispose(data, 'formatShopChartData')
    },
    headerDate (value) {
      var startTime = moment(value).startOf('month')
      var year = moment(value).format('YYYY')
      var MM = moment(value).format('M')
      let yester = moment(moment(startTime).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let headerDate = {
        year: year,
        period: '',
        time: MM,
        week: '',
        type: 'monthly',
        yester: moment(yester).format('YYYY') + '年' + moment(yester).format('M') + '月',
        reportDate: moment(value).format('YYYY.MM')
      }
      this.$store.commit('reportHeader', headerDate)
    },
    weekLists (data, index) {
      var arr = []
      for (var i = index; i < 7 + index; i++) {
        if (i >= data.length) break
        var obj = {}
        obj.time = moment(data[i].begin).format('YYYY-MM-DD')
        obj.enter = data[i].enter
        arr.push(obj)
      }
      return arr
    },
    processingTableData (data) {
      if (data.length === 0) return false
      let obj = {
        data: [
          moment(data[0].time).format('YYYY-MM-DD') + ' - ' + moment(data[data.length - 1].time).format('YYYY-MM-DD'),
          _.sumBy(data, 'enter').toLocaleString() + '人次'
        ]
      }
      let numberObj = {
        time: '',
        enter: 0
      }
      data.forEach(list => {
        if (list.enter > numberObj.enter) {
          numberObj.time = list.time
          numberObj.enter = list.enter
        }
      })
      obj.data.push(numberObj.time, numberObj.enter.toLocaleString() + '人次')
      this.ratioTableData.push(obj)
    },
    shopDataDispose (data, type) {
      let colorArr = ['#745AEF', '#EE690B', '#4EDBDA', '#2081D4']
      let nameList = Object.keys(data)
      nameList.forEach((list, index) => {
        let listObj = {
          option: _.cloneDeep(this.option)
        }
        listObj.option.xAxis.categories = []
        listObj.option.series = [
          {
            name: list,
            type: 'bar',
            color: index > 4 ? colorArr[index - 4] : colorArr[index],
            data: []
          }
        ]
        let dataType = data[list].shop ? data[list].shop : data[list].gate
        let shop = _.take(_.orderBy(dataType, 'enter', 'desc'), 10)
        shop.forEach(value => {
          listObj.option.series[0].data.push(value.enter)
          listObj.option.xAxis.categories.push(value.name)
        })
        switch (nameList.length) {
          case 1 :
          case 2:
            listObj.span = 24
            listObj.height = 500
            break
          case 3:
          case 4:
            listObj.span = 12
            listObj.height = 500
            break
          case 5 :
          case 6:
            listObj.span = 8
            listObj.height = 500
            break
          case 7 :
          case 8:
            listObj.span = 6
            listObj.height = 500
            break
        }
        this[type].push(listObj)
      })
    }
  },
  created () {}

}
</script>
<style lang="less">
    .month-report-date{
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
    .month-report-date{
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
