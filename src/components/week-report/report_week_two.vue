
<template>
    <div class="reportOneText">
        <report-list-header :monthlyType="monthlyType"></report-list-header>
        <div class="one-occupancy-total">
            <page-title :companyName="companyName" :typeName="passagesType"></page-title>
        </div>
        <div class="one-trend-total">
            <div class="one-trend-total-title">
                <span>出入口TOP10两周数据对比</span>
            </div>
            <vue-highcharts v-if="ifLevel"
                            style="width: 100%;height: 500px;margin-top: 50px"
                            :options="weekTwoData"
            ></vue-highcharts>
        </div>
        <div style="overflow: hidden">
            <div class="one-trend-total" style="width: 500px;float: left">
                <div class="one-trend-total-title">
                     <span>出入口TOP10排行</span>
                </div>
                <vue-highcharts v-if="ifLevel"
                                style="width: 100%;height: 450px;margin-top: 50px"
                                :options="levelOption"
                ></vue-highcharts>
            </div>
            <div class="one-trend-total" style="width: 500px;height:450px;float: right">
                <div class="one-trend-total-title">
                     <span>出入口TOP10占比</span>
                </div>
                <vue-highcharts  v-if="ifAccounted"
                                 style="width: 100%;height: 390px;margin-top: 50px"
                                 :options="accountedOption"
                ></vue-highcharts>
            </div>
        </div>
        <div class="page_number">第2页</div>
        <report-list-floor></report-list-floor>
    </div>
</template>
<script>
import reportListHeader from '@/components/report/report_day_list_header'
import reportListFloor from '@/components/report/report_day_list_floor'
import VueHighcharts from 'vue2-highcharts'
import pageTitle from '@/components/report/pageTitle'
import reportTable from '@/components/monthly-report/report_table'
import _ from 'lodash'
export default {
  name: 'report-monthly-two',
  components: {
    reportListHeader,
    reportListFloor,
    VueHighcharts,
    pageTitle,
    reportTable
  },
  data () {
    return {
      ifLevel: true,
      ifAccounted: true,
      table: '',
      monthlyType: ' ',
      passagesType: '出入口客流分析',
      passagesTOP: '出入口TOP10数据',
      weekTwoData: {
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
          categories: ['name1', 'name2', 'name3', 'name4', 'name5', 'name6', 'name7', 'name8', 'name9', 'name10'],
          crosshair: true,

          labels: {
            style: {
              color: '#666',
              fontSize: '10px',
              fontWeight: 'bold',
              fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif'
            }
          }

        },
        yAxis: {
          min: 0,
          title: {
            text: ' '
          }
        },
        tooltip: {

          formatter () {
            return this.x + '<br>' + this.series.name + ': ' + this.y.toLocaleString() + '人'
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
          {
            name: '本周客流',
            color: '#4472c4',
            data: [
              43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175,
              43934, 52503
            ]
          },
          {
            name: '上周客流',
            color: '#ed7d31',
            data: [
              33934, 51503, 27177, 49658, 77031, 99931, 117133, 134175,
              63934, 92503
            ]
          }
        ]
      },
      levelOption: {
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
          categories: ['name1', 'name2', 'name3', 'name4', 'name5', 'name6', 'name7', 'name8', 'name9', 'name10'],
          crosshair: true,

          labels: {
            style: {
              color: '#666',
              fontSize: '10px',
              fontWeight: 'bold',
              fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif'
            }
          }

        },
        yAxis: {
          min: 0,
          title: {
            text: ' '
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
          {
            name: '客流量',
            color: '#4472c4',
            data: [
              43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175,
              43934, 52503
            ]
          }
        ]
      },
      accountedOption: {
        chart: {
          type: 'container',
          spacing: [0, 0, 0, 0],
          margin: [0, 0, 0, 0]
        },
        title: {
          floating: true,
          text: ''
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          /* formatter () {
                         return this.x+": "+this.y.toLocaleString()+'人'
                         } */
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: '#666'
              }
            },
            point: {
              events: {}
            }
          }
        },
        series: [
          {
            type: 'pie',
            innerSize: '60%',
            name: '客流',
            data: [
              { name: 'Firefox', y: 45.0 },
              ['IE', 26.8],
              {
                name: 'Chrome',
                y: 12.8
              },
              ['Safari', 8.5],
              ['Opera', 6.2],
              ['其他', 0.7]
            ]
          }
        ]
      },
      function (c) {
        // 图表初始化完毕后的会掉函数
        // 环形图圆心
        var centerY = c.series[0].center[1],
          titleHeight = parseInt(c.title.styles.fontSize)
        // 动态设置标题位置
        c.setTitle({
          y: centerY + titleHeight / 2
        })
      }
    }
  },
  methods: {
    tableList (data, lastWeekData) {
      var that = this

      that.ifLevel = false
      that.ifAccounted = false

      that.weekTwoData.xAxis.categories = []
      that.weekTwoData.series = []

      that.levelOption.xAxis.categories = []
      that.levelOption.series = []

      that.accountedOption.series[0].data = []

      var AccountedData = []
      var rakingList = {}
      rakingList.name = '客流量'
      rakingList.color = '#4472c4'
      rakingList.data = []
      let lastWeekSeries = {
        name: '上周客流',
        data: [],
        color: '#ed7d31'
      }
      var currentData = []
      data.forEach(list => {
        if (list) {
          list.gate.forEach(value => {
            currentData.push(value)
          })
        }
      })
      var lastWeek = []
      lastWeekData.forEach(list => {
        list.gate.forEach(value => {
          lastWeek.push(value)
        })
      })
      var listEnter = _.orderBy(currentData, ['enter'], 'desc')
      _.forEach(listEnter, function (e, listIndex) {
        if (listIndex < 10) {
          that.levelOption.xAxis.categories.push(e.name)
          that.weekTwoData.xAxis.categories.push(e.name)
          rakingList.data.push(e.enter)
          lastWeekSeries.data.push(_.find(lastWeek, o => o.bzid === e.bzid).enter || null)// 从上周取到当前bzid对应的数据如取不到则为null
          if (e.enter != 0) {
            var AccountedList = {}
            AccountedList.name = e.name
            AccountedList.y = e.enter
            AccountedData.push(AccountedList)
            that.accountedOption.series[0].data.push(AccountedList)
          }
        }
      })
      that.levelOption.series.push(rakingList)

      let cloneList = _.cloneDeep(rakingList)
      cloneList.name = '本周客流'
      that.weekTwoData.series.push(cloneList)
      that.weekTwoData.series.push(lastWeekSeries)// push上周的数据列

      this.$nextTick(() => {
        that.ifLevel = true
        that.ifAccounted = true
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
.passages-two-week{
    width: 100%;
    height: auto;
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
                    font-size: 27px;
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
        }
        .one-trend-total{
            width: 100%;
            height: auto;
            margin-top: 50px;
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
    }
.page_number{
    font-size: 20px;
    color: #a0a7ad;
    position: absolute;
    right: 50px;
    bottom: 100px;
}

</style>
