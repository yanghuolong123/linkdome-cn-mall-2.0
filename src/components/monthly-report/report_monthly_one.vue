
<template>
    <div class="reportOneText">
        <report-list-header ></report-list-header>
        <div class="one-occupancy-total">
            <page-title :companyName="companyName" :typeName="typeName"></page-title>
            <div class="one-occupancy-total-text">
                <div
                  class="one-occupancy-list"
                  v-for="(item,index) in totalOccupancy"
                  :key="index"
                >
                    <img :src="item.img" alt="">
                    <div
                      class="one-occupancy-list-text"
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
                            style="width: 100%;height: 500px;margin-top: 50px"
                            :options="trendOption"
            ></vue-highcharts>
        </div>
        <div class="one-trend-total">
            <page-title  :typeName="detailsType"></page-title>
            <ul class="table" v-if="ifOneCharts">
                <li class="table-time">
                    <p
                      :key="index"
                      v-for="(item,index) in tableData.time"
                      :style="{width:tableWidth+'%',fontSize:tableSize+'px'}"
                    >
                      {{item}}
                    </p>
                </li>
                <li class="table-enter">
                    <p
                      :style="{width:tableWidth+'%'}"
                    >
                      <span>客流量</span>
                      <span>{{tableData.enter.total}}人</span>
                    </p>
                    <p
                      :style="{width:tableWidth+'%'}"
                      v-for="(item,index) in tableData.enter.list"
                      :key="index"
                    >
                      {{item}}人
                    </p>
                </li>
                <li class="table-peak">
                  <div class="table-peak-total" :style="{width:tableWidth+'%'}">
                    <div class="total-left">客流峰值</div>
                    <div class="total-right">
                        <p>{{tableData.peakData.total.data}}人</p>
                        <p>{{tableData.peakData.total.time}}</p>
                    </div>
                  </div>
                  <div
                    class="table-peak-list"
                    :style="{width:tableWidth+'%'}"
                    v-for="(item,index) in tableData.peakData.list"
                    :key="index"
                  >
                    <p>{{item.data}}人</p>
                    <p>{{item.time}}</p>
                  </div>
                </li>
            </ul>
        </div>
        <div class="page_number">第1页</div>
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
export default {
  name: 'report-monthly-one',
  components: {
    reportListHeader,
    reportListFloor,
    VueHighcharts,
    pageTitle
  },
  data () {
    return {
      ifOneCharts: false,
      typeName: '客流总览',
      peakType: '客流趋势',
      detailsType: '详细客流数据',
      dataMean: '',
      tableData: {
        time: [],
        enter: {
          total: '',
          list: []
        },
        peakData: {
          total: {
            time: '',
            data: ''
          },
          list: []
        }
      },
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

        }
        // {
        //   img: require('@/assets/images/fixation_img/logo/837398fc2219715c1fb81436befe6e7.webp'),
        //   name: '集客量峰值',
        //   data: 0,
        //   date: '',
        //   time: ''

        // }
      ],
      trendOption: {
        title: { text: ' ' },
        subtitle: { text: '' },
        credits: { enabled: false },
        yAxis: {
          title: { text: '' },
          min: 0,
          allowDecimals: false
        },
        xAxis: {
          categories: [],
          plotBands: []
        },
        tooltip: {
          // head + 每个 point + footer 拼接成完整的 table
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
          formatter () {
            return this.x + '<br>' + this.points[0].series.name + ': ' + this.y.toLocaleString() + '人'
          }
        },
        series: [
          {
            name: '每日客流',
            type: 'column',
            color: 'rgb(68,114,196)',
            data: []
          },
          {
            name: '本月客流趋势',
            type: 'spline',
            color: 'rgb(112,173,71)',
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
            color: 'rgb(237,125,49)',
            marker: {
              enabled: false
            },
            data: [],
            tooltip: {
              valueSuffix: ''
            }
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
      }
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

      // this.totalOccupancy[3].data = data.property[0].occupancy.highest.number.toLocaleString()
      // var occupancyTime = data.property[0].occupancy.highest.timeRange.split('-')
      // var timeOne = occupancyTime[2].split(' ')[1]
      // var timeTwo = occupancyTime[5].split(' ')[1]
      // var timeThree = occupancyTime[2].split(' ')[0]
      // var occupancyShowTime = occupancyTime[0] + '-' + occupancyTime[1] + '-' + timeThree

      // this.totalOccupancy[3].date = moment(occupancyShowTime).format('YYYY-MM-DD')
      // this.totalOccupancy[3].time = timeOne + ' - ' + timeTwo

      /* table total data  */
      this.tableData.enter.total = data.property[0].enter.total.number.toLocaleString()
      this.tableData.peakData.total.data = data.property[0].enter.highest.number.toLocaleString()
      this.tableData.peakData.total.time = moment(showTime).format('YYYY-MM-DD')
      this.dataMean = data.property[0].enter.avg.number
    },
    dataList (data) {
      if (data.length == 0) return false
      var that = this
      that.trendOption.xAxis.categories = []
      that.trendOption.series[0].data = []
      that.trendOption.series[1].data = []
      that.trendOption.series[2].data = []
      that.ifOneCharts = false
      /* var totalEnter = _.sumBy(data, function(o) { return o.enter; }); */
      var mean = that.dataMean
      data.forEach(function (e, index) {
        var time = moment(e.begin).format('YYYY-MM-DD')
        that.trendOption.xAxis.categories.push(time)
        that.trendOption.series[0].data.push(e.enter)
        that.trendOption.series[1].data.push(e.enter)
        that.trendOption.series[2].data.push(mean)
      })
      let total = _.sum(that.trendOption.series[0].data)
      if (total === 0) {
        that.trendOption.yAxis.max = 5
      } else {
        that.trendOption.yAxis.max = null
      }
      /* 月份 分 周 开始 */
      var arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = [], arr6 = []
      var week = moment(data[0].begin).locale('zh').format('d')
      for (var i = 0; i <= (7 - Number(week)); i++) {
        var obj = {}
        obj.time = moment(data[i].begin).format('YYYY-MM-DD')
        obj.enter = data[i].enter
        arr1.push(obj)
      }

      var le1 = arr1.length
      arr2 = this.weekLists(data, le1)

      var le2 = arr1.length + arr2.length
      arr3 = this.weekLists(data, le2)

      var le3 = arr1.length + arr2.length + arr3.length
      arr4 = this.weekLists(data, le3)

      var le4 = arr1.length + arr2.length + arr3.length + arr4.length
      arr5 = this.weekLists(data, le4)

      var le5 = arr1.length + arr2.length + arr3.length + arr4.length + arr5.length
      arr6 = this.weekLists(data, le5)

      /* 月份 分 周 结束 */

      this.tableData.time = []
      this.tableData.peakData.list = []
      this.tableData.enter.list = []

      /* table 进行赋值 开始 */
      var startTime = moment(data[0].begin).format('YYYY-MM-DD')
      var endTime = moment(data[data.length - 1].begin).format('YYYY-MM-DD')
      var totalTime = startTime + ' - ' + endTime
      this.tableData.time.push(totalTime)

      this.tableDataList(arr1)
      this.tableDataList(arr2)
      this.tableDataList(arr3)
      this.tableDataList(arr4)
      this.tableDataList(arr5)
      this.tableDataList(arr6)

      /* table 进行赋值 结束 */

      this.$nextTick(() => {
        that.ifOneCharts = true
      })
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
    tableDataList (data) {
      if (data.length != 0) {
        var arrTime1 = data[0].time + ' - ' + data[data.length - 1].time
        this.tableData.time.push(arrTime1)
        var enter = _.sumBy(data, function (o) { return o.enter })
        this.tableData.enter.list.push(enter ? enter.toLocaleString() : '')
        var obj = {}
        obj.data = 0
        obj.time = ''
        data.forEach(function (e) {
          if (Number(e.enter) > obj.data) {
            obj.data = e.enter
            obj.time = e.time
          }
        })
        obj.data = obj.data.toLocaleString()
        this.tableData.peakData.list.push(obj)
      }
    }
  },
  computed: {
    companyName () {
      return this.$store.state.report.companyName
    },
    tableWidth () {
      return 100 / this.tableData.time.length
    },
    tableSize () {
      return this.tableData.peakData.list.length < 6 ? 14 : 12
    }
  },
  created () {},
  mounted () {}
}
</script>
<style scoped lang="less">
    .reportOneText {
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
                    width:31.2%;
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
                            font-size:1rem;
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
                    font-size: 14px;
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
                    height: 100px;
                    float: left;
                    border-right: 1px solid #fff;
                    .total-left{
                        width: 50%;
                        float: left;
                        font-size:14px;
                        color: #000;
                        line-height: 100px;
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
                            font-size: 14px;
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
                    height: 100px;
                    float: left;
                    border-right: 1px solid #fff;
                    p{
                        width: 100%;
                        height: 50%;
                        text-align: center;
                        font-size: 14px;
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
