<template>
  <div class="report-center">
    <div style="margin-bottom: 21px">
      <div class="day-report-date">
        <Row style="float: left">
          <Col span="12">
            <DatePicker
              type="date"
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
        <div class="icon-download" v-on:click="uploadReport('day',selectDateText)" title="下载报告">
			  <icons type="daoru" color="#2a7dc1" :size = 20 ></icons>
      </div>
      <div style="clear: both"></div>
      </div>
    </div>
    <report-suggest v-if="showPDF&&userRole==='超级管理员'"
      @suggestSubmit='suggestSubmit'
      :propertyId='propertyId'
      :date='selectDateText'
      :suggestText='suggestText'
    ></report-suggest>
    <div class="pdf-text-box" v-bind:class="{pdfAction:showPDF}">
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
import reportSuggest from '@/components/report-public/report_suggest'
import reportBackCover from '@/components/report/newReport/report_back_cover'

import moment from 'moment'
import _ from 'lodash'
import Bus from '@/libs/bus.js'
import mixins from './reportMixin.js'
import { newReportEnter, newReportSuggest, newReportGate, newReportShop } from '@/api/report'
import { getanalysiseeo } from '@/api/home'

export default {
  name: 'report-day',
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportRatioTable,
    reportSuggest,
    reportBackCover
  },
  data () {
    return {
      showPDF: false,
      reportType: 'daily',
      selectDateTime: '',
      selectDateText: '',
      options3: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000
        }
      },
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
      return [
        {
          name: '当日客流总览',
          text: '客流时间:' + this.headerData.year + '.' + this.headerData.time
        },
        {
          name: '昨日客流总览',
          text: '客流时间:' + this.headerData.yester
        }
      ]
    },
    trendTitle () {
      return {
        name: '当日客流趋势',
        text: '客流时间:' + this.headerData.year + '.' + this.headerData.time
      }
    },
    gateTitle () {
      return {
        name: '当日出入口客流TOP10对比分析',
        text: '客流时间:' + this.headerData.year + '.' + this.headerData.time
      }
    },
    shopTitle () {
      return {
        name: '当日店铺客流TOP10对比分析',
        text: '客流时间:' + this.headerData.year + '.' + this.headerData.time
      }
    }

  },
  watch: {

  },
  activated () {
    this.showPDF = false
    this.selectDateTime = ''
  },
  mounted () {
  },
  methods: {
    selectTimeDate (value) {
      if (value == '') {
        this.selectDateTime = ''
        this.selectDateText = ''
        return false
      }
      this.selectDateText = value + ',' + value
    },
    reportQuery () {
      if (this.selectDateText === '') {
        alert('请选择时间')
        return false
      }
      this.point('日报分析页面', '数据分析')
      this.showPDF = false
      this.headerDate(this.selectDateTime)
      let yesterday = moment(this.selectDateTime).subtract(1, 'days').format('YYYY-MM-DD')
      Promise.all([
        // 建议
        newReportSuggest({ property_id: this.propertyId, date: this.selectDateText }),
        // 客流总览
        newReportEnter({ property_id: this.propertyId, timeRange: this.selectDateText }),
        //  当前客流趋势
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.selectDateText, innerRange: '1h' }),
        // 当前集客量趋势
        getanalysiseeo({ bzid: this.bzid, type: 'occupancy', range: this.selectDateText, innerRange: '1h' }),
        // 昨日客流趋势
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
      })
    },
    // 趋势数据
    trendDataList (enterData, occupancyData, yesterdayData) {
      this.dataEmpty('trendChartData')
      this.ratioTableData = []
      let highest = {
        number: 0,
        time: ''
      }
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
      this.dataEmpty('gateChartData')
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
      this.dataEmpty('shopChartData')
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
<style lang='less'>
.ivu-spin-fix .ivu-spin-main{
  margin-left: -24px;
  margin-top: -24px;
}
.day-report-date{
  .ivu-input{
    width: 230px;
    height: 43px;
    font-size: 16px;
    border: 1px solid rgba(0, 0, 0, .2);
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }
  .ivu-input-suffix{
    i{
      height: 43px;
      line-height: 43px;
    }
  }

}
</style>
<style lang="less" scoped>

.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 300px;
    position: relative;
    border: 1px solid #eee;
}

.pdf-text-box{
    background-color: #fff;
    height: 0;
    overflow: hidden;
}

.pdfAction{
    height: auto!important;
}
.day-report-type{
  display: inline-block;
  float: left;
  margin-top: 7px;
  p{
    display: inline-block;
    float: left;
    height: 45px;
    width: 120px;
    // background-color: #2d8cf0;
    text-align: center;
    font-size: 18px;
    color: #fff;
    line-height: 45px;
    margin-right: 30px;
    cursor: pointer;
    border-radius: 5px;
    &:last-child{
      margin-right: 0;
    }
    &:hover{
      background-color: #feb33d;
    }
  }
    .action{
        background-color: #9e9e9e !important;
    }
}
.title-name{
    font-size: 24px;
    color: #4096e5;
    font-weight: normal;
    border-left: 2px solid currentColor;
    line-height: 1;
    padding-left: 34px;
    margin-top: 15px;
    margin-left: 23px;
    float: left;
    position: relative;
}
.select-date-type{
    position: absolute;
    left: 100px;
    top:0;
    i{
        color: #4096E5!important;
    }
    .ivu-dropdown-menu{
      min-width: 55px!important;
    }
}
  .day-report-date{
    margin-top: 9px;
    padding: 20px 0 20px 30px;
    background-color: #fff;
    box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
    border-radius: 6px;
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
