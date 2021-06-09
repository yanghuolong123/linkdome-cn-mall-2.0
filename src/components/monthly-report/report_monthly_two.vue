
<template>
    <div class="reportOneText">
        <report-list-header></report-list-header>
        <div class="one-occupancy-total">
            <page-title :companyName="companyName" :typeName="passagesType"></page-title>
        </div>

        <div style="overflow: hidden">
            <div class="one-trend-total" style="width: 500px;float: left">
                <div class="one-trend-total-title">
                    <div class="one-trend-total-title">
                        <span>出入口TOP10排行</span>
                    </div>
                </div>
                <vue-highcharts v-if="ifLevel"
                                style="width: 100%;height: 420px;margin-top: 30px"
                                :options="levelOption"
                ></vue-highcharts>
            </div>
            <div class="one-trend-total" style="width: 500px;float: right">
                <div class="one-trend-total-title">
                    <div class="one-trend-total-title">
                        <span>出入口TOP10占比</span>
                    </div>
                </div>
                <vue-highcharts  v-if="ifAccounted"
                                 style="width: 100%;height: 420px;margin-top: 30px"
                                 :options="accountedOption"
                ></vue-highcharts>
            </div>
        </div>

        <div class="one-trend-total" style="height: 821px ;overflow: hidden">
            <page-title :typeName="passagesTOP"></page-title>
            <report-table ref="report_table" ></report-table>
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
import moment from 'moment'
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

      passagesType: '出入口客流分析',
      passagesTOP: '出入口TOP10数据',
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
          categories: [],
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
            data: []
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
            data: []
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
    tableList (data) {
      var that = this
      that.ifLevel = false
      that.ifAccounted = false
      var tableList = []
      let dataList = []
      Object.values(data).forEach(list => {
        list.gate.forEach(value => {
          dataList.push(value)
        })
      })
      var tableData = _.orderBy(dataList, ['enter'], 'desc')
      _.forEach(tableData, function (e) {
        if (tableList.length < 10) {
          var obj = {}
          obj.name = e.name
          obj.enter = e.enter.toLocaleString() + '人'
          obj.peak = e.highest.number.toLocaleString()
          obj.time = moment(e.highest.begin).format('YYYY-MM-DD')
          obj.mean = e.avg.toLocaleString()
          tableList.push(obj)
        }
      })
      this.$refs.report_table.listData(tableList)

      that.levelOption.xAxis.categories = []
      that.levelOption.series = []
      that.accountedOption.series[0].data = []

      var AccountedData = []
      var rakingList = {}
      rakingList.name = '客流量'
      rakingList.color = '#4472c4'
      rakingList.data = []
      _.forEach(tableData, function (e, listIndex) {
        if (listIndex < 10) {
          that.levelOption.xAxis.categories.push(e.name)
          rakingList.data.push(e.enter)
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
    }

    .page_number{
        font-size: 20px;
        color: #a0a7ad;
        position: absolute;
        right: 50px;
        bottom: 100px;
    }
</style>
