
<template>
    <div class="reportOneText">
        <report-list-header :monthlyType="monthlyType" ></report-list-header>
        <div class="one-occupancy-total">
            <page-title :companyName="companyName" :typeName="typeName"></page-title>
            <div class="one-occupancy-total-text">
                <div class="one-occupancy-list" v-for="(item,index) in totalOccupancy" :key="index">
                    <img :src="item.img" alt="">
                    <div class="one-occupancy-list-text"
                         v-bind:class="{'list-text-one':item.action}"
                    >
                        <p class="list-text-name">{{item.name}}</p>
                        <p class="list-text-data">{{item.data}}人</p>
                        <p class="list-text-date" v-if="item.date">{{item.date}}</p>
                        <p class="list-text-time" v-if="item.time">{{item.time}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="one-trend-total">
            <page-title  :typeName="peakType"></page-title>
            <vue-highcharts v-if="ifOneCharts"
                            style="width: 100%;height: 500px;margin-top: 30px"
                            :options="trendOption"
            ></vue-highcharts>
        </div>
        <h4 class="table-title">同环比数据详情</h4>
        <table v-if="ifOneCharts">
          <tr>
            <td rowspan="2">时间</td>
            <td rowspan="2">入客流</td>
            <td colspan="3">同比</td>
            <td colspan="3">环比</td>
          </tr>
          <tr>
            <td>时间</td>
            <td>入客流</td>
            <td>增长率</td>
            <td>时间</td>
            <td>入客流</td>
            <td>增长率</td>
          </tr>
          <tr>
            <td v-for="item in tableData">
              {{item}}
            </td>
          </tr>
        </table>
        <div class="page_number">第2页</div>
        <report-list-floor></report-list-floor>
    </div>
</template>
<script>
import reportListHeader from '@/components/report/report_day_list_header'
import reportListFloor from '@/components/report/report_day_list_floor'
import VueHighcharts from 'vue2-highcharts'
import pageTitle from '@/components/report/pageTitle'
import moment from 'moment'
import _ from 'lodash'
import newReportTable from '@/components/week-report/newReportTable.vue'
export default {
  name: 'report-monthly-one',
  props: {
    computedData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    reportListHeader,
    reportListFloor,
    VueHighcharts,
    pageTitle,
    newReportTable

  },
  data () {
    return {
      tableName: '时间',
      monthlyType: ' ',
      ifOneCharts: false,
      typeName: '客流总览',
      peakType: '客流趋势',
      detailsType: '详细客流数据',
      totalOccupancy: [
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu1.webp'),
          name: '累计客流',
          action: true,
          data: 0
        },
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu2.webp'),
          name: '客流峰值',
          data: 0,
          date: ''

        },
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu4.webp'),
          name: '平均客流',
          data: 0,
          date: '每天'

        },
        {
          img: require('@/assets/images/fixation_img/logo/837398fc2219715c1fb81436befe6e7.webp'),
          name: '集客量峰值',
          data: 0,
          date: '',
          time: ''

        }
      ],
      trendOption: {

        title: { text: ' ' },
        subtitle: { text: '' },
        credits: { enabled: false },
        yAxis: {
          title: { text: '' }
        },
        xAxis: {
          categories: ['同比', '环比']
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.y.toLocaleString()
              }
            }
          }
        },
        tooltip: {
          formatter () {
            return this.x + '<br>' + this.series.name + ': ' + this.y.toLocaleString() + '人'
          }
        },
        series: [
          {
            name: '同环比',
            color: '#4472c4',
            type: 'column',
            data: []
          },
          {
            name: '本月',
            type: 'column',
            color: '#ed7d31',
            data: []

          }
        ],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      },
      tableData: []
    }
  },
  methods: {
    occupancyList (data) {
      this.totalOccupancy[0].data = data.property[0].enter.total.number.toLocaleString()
      this.totalOccupancy[1].data = data.property[0].enter.highest.number.toLocaleString()

      var time = data.property[0].enter.highest.timeRange.split('-')
      var date1 = time[2].split(' ')[0]
      var showTime = time[0] + '-' + time[1] + '-' + date1
      this.totalOccupancy[1].date = moment(showTime).format('YYYY-MM-DD')
      this.totalOccupancy[2].data = data.property[0].enter.avg.number.toLocaleString()

      this.totalOccupancy[3].data = data.property[0].occupancy.highest.number.toLocaleString()
      var occupancyTime = data.property[0].occupancy.highest.timeRange.split('-')
      var timeOne = occupancyTime[2].split(' ')[1]
      var timeTwo = occupancyTime[5].split(' ')[1]
      var timeThree = occupancyTime[2].split(' ')[0]
      var occupancyShowTime = occupancyTime[0] + '-' + occupancyTime[1] + '-' + timeThree

      this.totalOccupancy[3].date = moment(occupancyShowTime).format('YYYY-MM-DD')
      this.totalOccupancy[3].time = timeOne + ' - ' + timeTwo
    },
    dataList (data) {
      let that = this
      // lastYearMonth 同比 lastMonth 环比
      this.trendOption.series[0].data = [data.lastYearMonth.data, data.lastMonth.data]
      this.trendOption.series[1].data = [data.currentMonth.data, data.currentMonth.data]
      let number = Math.round(((data.currentMonth.data - data.lastYearMonth.data) /  data.lastYearMonth.data) * 10000) / 10000
      let numberTwo = Math.round(((data.currentMonth.data - data.lastMonth.data) /  data.lastMonth.data) * 10000) / 10000
      let yearOn = data.lastYearMonth.data === 0 ? '100%' : (number * 100).toFixed(2) + '%'
      let relative = data.lastMonth.data === 0 ? '100%' : (numberTwo * 100).toFixed(2) + '%'
      this.tableData = [
        data.currentMonth.time,
        data.currentMonth.data,
        data.lastYearMonth.time,
        data.lastYearMonth.data,
        yearOn,
        data.lastMonth.time,
        data.lastMonth.data,
        relative
      ]
      this.$nextTick(() => {
        that.ifOneCharts = true
      })
    }
  },
  computed: {
    companyName () {
      return this.$store.state.report.companyName
    }
  },
  created () {},
  mounted () {}
}
</script>
<style scoped lang="less">
.table-title{
  margin-top: 20px;
  line-height: 80px;
  border-bottom: 2px solid #b7c4ca;
  font-size: 27px;
  color: #1190d5;
  font-weight: normal;
  border-bottom:2px solid #b7c4ca;
}
table{
  width: 100%;
  height: auto;
  margin-top: 30px;
  tr{
    background-color: #cfd5ea;
      color: #000;
      font-size: 16px;
    &:nth-child(1){
      background-color: #4472c4;
      color: #fff;
    }
    &:nth-child(2){
      background-color: #4472c4;
       color: #fff;
    }
     &:nth-child(3){
       margin-top: 5px;
    }
    td{
      text-align: center;
      height: 40px;
      line-height: 40px;
    }
  }
}
    .reportOneText {
        display: inline-block;
        width: 1200px;
        height: 1682px;
        overflow: hidden;
        padding: 100px 50px;
        background-color: #fff;
        position: relative;
        .one-occupancy-total{
            width: 100%;
            height: auto;
            .one-occupancy-total-text{
                width: 100%;
                height: 215px;
                border: 1px solid #cecece;
                border-radius: 5px;
                -moz-border-radius: 5px;
                -webkit-border-radius: 5px;
                overflow: hidden;
                margin-top: 20px;
                .one-occupancy-list{
                    height: 175px;
                     width: 23%;
                    margin-top: 19px;
                    border:1px solid #cecece;
                    float: left;
                    margin-left: 1.6%;
                    padding: 25px 20px;
                    border-radius: 5px;
                    -moz-border-radius: 5px;
                    -webkit-border-radius: 5px;

                    img{
                        float: left;
                        display: block;
                         width: 21%;
                        height: auto;
                        margin-top: 29px;
                    }
                    .one-occupancy-list-text{
                       width: 60%;
                        float: right;
                        height: auto;

                        .list-text-name{
                            font-size: 1.375rem;
                            color: #1190d5;
                            letter-spacing: 3px;
                        }
                        .list-text-date{
                            font-size: 1.375rem;
                            color: #747474;
                        }
                        .list-text-time{
                            font-size: 1.375rem;
                            color: #747474;
                        }
                        .list-text-data{
                            font-size: 1.375rem;
                            color: #4e4e4e;
                            &:nth-child(1){
                                margin: 8px 0;
                            }

                        }
                        span{
                            display: inline-block;
                            width: 100%;
                            font-size: 1rem;
                            color: #a0a7ad;
                        }
                        &:first-child{
                            width: 125px;
                        }
                    }
                    .list-text-one{
                        .list-text-data{
                            margin: 5px 0;
                        }
                    }
                }
            }
        }
        .one-trend-total{
            width: 100%;
            height: auto;
            margin-top: 20px;
            .table{
                width: 100%;
                height: auto;
                margin-top: 30px;
                .table-time{
                    width: 100%;
                    height: auto;
                    overflow: hidden;
                    background-color: #4472c4;
                    p{
                        float: left;
                        text-align: center;
                        color: #fff;
                        border-right: 1px solid #fff;
                        height: 50px;
                        font-size: 18px;
                        line-height:50px;
                    }
                }
            }
            .table-enter{
                width: 100%;
                height: auto;
                overflow: hidden;
                background-color: #cfd5ea;
                margin-top: 5px;
                p{
                    float: left;
                    text-align: center;
                    color: #000;
                    border-right: 1px solid #fff;
                    height: 50px;
                    font-size: 18px;
                   line-height: 50px;
                    span{
                       display: inline-block;
                       width: 50%;
                       text-align: center;
                        border-right: 1px solid #fff;
                        &:nth-child(2){
                            border-right:none;
                        }
                    }
                }
            }
            .table-peak{
                width: 100%;
                height: auto;
                overflow: hidden;
                border-top: 1px solid #fff;
                .table-peak-total{
                    height: 120px;
                    float: left;
                    border-right: 1px solid #fff;
                    .total-left{
                        width: 50%;
                        float: left;
                        font-size: 18px;
                        color: #000;
                        line-height: 120px;
                        background-color: #e9ebf5;
                        border-right: 1px solid #fff;
                        text-align: center;
                    }
                    .total-right{
                        width: 50%;
                        float: right;
                        height: 100%;
                        p{
                            width: 100%;
                            height: 50%;
                            text-align: center;
                            font-size: 18px;
                            color: #000;
                            line-height: 50px;
                            &:nth-child(1){
                                background-color: #e9ebf5;
                                border-bottom: 1px solid #fff;
                            }
                            &:nth-child(2){
                                background-color: #cfd5ea;
                            }
                        }
                    }
                }
                .table-peak-list{
                    height: 120px;
                    float: left;
                    border-right: 1px solid #fff;
                    p{
                        width: 100%;
                        height: 50%;
                        text-align: center;
                        font-size: 18px;
                        color: #000;
                        line-height: 50px;
                        &:nth-child(1){
                            background-color: #e9ebf5;
                            border-bottom: 1px solid #fff;
                        }
                        &:nth-child(2){
                            background-color: #cfd5ea;
                        }
                    }
                }
            }

        }

    }

    .page_number{
        font-size: 20px;
        color: #a0a7ad;
        position: absolute;
        right: 50px;
        bottom: 100px;
    }
</style>
