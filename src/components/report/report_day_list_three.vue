
<template>
    <div class="reportOneText">
        <report-list-header></report-list-header>
        <div class="one-occupancy-total">
            <div class="one-occupancy-total-title">
                <p>{{propertyName}}</p>
                <span>客流总览</span>
            </div>
            <div class="one-occupancy-total-text">
                <div class="one-occupancy-list" v-for="item in totalOccupancy">
                    <img :src="item.img" alt="">
                    <div class="one-occupancy-list-text"
                         v-bind:class="{'list-text-one':item.action}"
                    >
                        <p class="list-text-name">{{item.name}}</p>
                        <p class="list-text-data">{{item.data}}人</p>
                        <p class="list-text-time" v-if="item.time">{{item.time}}</p>
                       <!-- <span v-if="item.male">男性:&nbsp;&nbsp;&nbsp;&nbsp;{{item.male}}</span>
                        <span v-if="item.female">女性:&nbsp;&nbsp;&nbsp;&nbsp;{{item.female}}</span>-->
                    </div>
                </div>
            </div>
        </div>

        <div class="one-trend-total">
            <div class="one-trend-total-title">
                <div class="one-trend-total-title">
                    <span>客流和集客量趋势</span>
                </div>
            </div>
            <vue-highcharts v-if="ifShowList" style="width: 100%;height: 700px;margin-top: 50px" :options="trendOption" ></vue-highcharts>
        </div>

       <!-- <div class="one-trend-total">
            <div class="one-trend-total-title">
                <div class="one-trend-total-title">
                    <span>商铺TOP10客流排行</span>
                </div>
            </div>
            <vue-highcharts v-if="ifShowRanking" style="width: 100%;height: 510px;margin-top: 50px" :options="rankingOption" ></vue-highcharts>
        </div>-->
        <div class="page_number">第1页</div>
        <report-list-floor></report-list-floor>
    </div>
</template>
<script>
import reportListHeader from '@/components/report/report_day_list_header'
import reportListFloor from '@/components/report/report_day_list_floor'
import VueHighcharts from 'vue2-highcharts'
import _ from 'lodash'
export default {
  name: 'report-day-one',
  components: {
    reportListHeader,
    reportListFloor,
    VueHighcharts
  },
  data () {
    return {
      ifShowList: true,
      ifShowRanking: true,
      propertyName: '',
      totalOccupancy: [
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu1.webp'),
          name: '累计客流',
          action: true,
          data: 0,
          male: '0%',
          female: '0%'
        },
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu2.webp'),
          name: '客流峰值',
          data: 0,
          time: '15:00 - 16:00'

        },
        {
          img: require('@/assets/images/fixation_img/logo/837398fc2219715c1fb81436befe6e7.webp'),
          name: '集客量峰值',
          data: 0,
          time: '00:00 - 01:00'

        },
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu4.webp'),
          name: '平均客流量',
          data: 0,
          time: '每小时'

        }
      ],
      trendOption: {
        chart: {
          type: 'line'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        credits: {
          enabled: false
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          },
          allowDecimals: false
        },
        lang: {
          noData: '暂无数据',
          thousandsSep: ','
        },
        noData: {
          style: {
            fontSize: '12px',
            fontWeight: 'normal',
            fontFamily: 'Microsoft YaHei',
            color: '#515a6e'
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
        tooltip: {
          formatter () {
            return this.x + '<br>' + this.series.name + ': ' + this.y.toLocaleString() + '人'
          }
        },
        xAxis: {
          tickmarkPlacement: 'on',
          categories: []
        },
        series: [],
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
      rankingOption: {
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true
        },
        yAxis: {
          // min: 0,
          title: {
            text: ''
          }
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
        plotOptions: {
          column: {
            borderWidth: 0
          }
        },
        credits: {
          enabled: false
        },
        series: [

        ]
      }
    }
  },
  methods: {
    dataList (name, data, lineTime, lineData, rankingTime, rankingData) {
      var that = this
      that.propertyName = name
      that.totalOccupancy = data
      that.ifShowList = false
      that.trendOption.xAxis.categories = []
      that.trendOption.xAxis.categories = lineTime
      that.trendOption.series = []
      that.trendOption.series = lineData
      let oneTotal1 = _.sum(lineData[0].data)
      let twoTotal2 = _.sum(lineData[1].data)
      if (oneTotal1 === 0 && twoTotal2 === 0) {
        that.trendOption.yAxis.max = 5
      } else {
        that.trendOption.yAxis.max = null
      }

      that.ifShowRanking = false
      that.rankingOption.xAxis.categories = []
      that.rankingOption.xAxis.categories = rankingTime
      that.rankingOption.series = []
      that.rankingOption.series = rankingData
      that.$nextTick(() => {
        that.ifShowList = true
        that.ifShowRanking = true
      })
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<!--<style>
    .ivu-table th{
        background-color: #4472c4;
        color: #fff;
        border-right: 1px solid #fff;
        font-size: 18px;
        font-weight: normal;
    }
    .ivu-table-row td{
        background-color: #cfd5ea;
        font-size: 18px!important;
        color: #000;
        border-right: 1px solid #fff;
        border-bottom: 1px solid #fff;
        font-weight: normal;
    }
    .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td{
        background-color: #e9ebf5;
    }
    .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td{
        background-color: #cfd5ea;
    }
</style>-->
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
        .one-occupancy-total-title{
            height: 95px;
            width: 100%;
            border-bottom: 2px solid #b7c4ca;
            position: relative;
            p{
                width: 100%;
                line-height: 95px;
                text-align: center;
                color: #363636;
                font-size: 28px;
            }
            span{
                position: absolute;
                left: 0;
                top:0;
                display: inline-block;
                font-size: 27px;
                color: #1190d5;
                line-height: 95px;
            }
        }
        .one-occupancy-total-text{
            width: 100%;
            height: 215px;
            border: 1px solid #cecece;
            border-radius: 5px;
            -moz-border-radius: 5px;
            -webkit-border-radius: 5px;
            overflow: hidden;
            margin-top: 20px;
            border-bottom: 10px solid #00a0e9;
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
                    .list-text-time{
                        font-size: 1.375rem;
                        color: #747474;
                        margin: 8px 0;
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
        margin-top: 30px;
        .one-trend-total-title{
            height: 50px;
            width: 100%;
            border-bottom: 2px solid #b7c4ca;
            span{
                display: inline-block;
                font-size: 27px;
                color: #1190d5;
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

}

</style>
