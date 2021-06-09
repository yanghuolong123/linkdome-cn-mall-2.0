
<template>
    <div class="reportOneText">
        <report-list-header></report-list-header>
        <div class="one-occupancy-total">
            <div class="one-occupancy-total-title">
                <p>{{propertyName}}</p>
                <span>出入口客流分析</span>
            </div>
        </div>
        <div style="overflow: hidden">
            <div class="one-trend-total" style="width: 500px;float: left">
                <div class="one-trend-total-title">
                    <div class="one-trend-total-title">
                        <span>出入口TOP10排行</span>
                    </div>
                </div>
                <vue-highcharts v-if="ifLevel" style="width: 100%;height: 450px;margin-top: 50px" :options="levelOption" ></vue-highcharts>
            </div>
            <div class="one-trend-total" style="width: 500px;float: right">
                <div class="one-trend-total-title">
                    <div class="one-trend-total-title">
                        <span>出入口TOP10占比</span>
                    </div>
                </div>
                <vue-highcharts  v-if="ifAccounted" style="width: 100%;height: 450px;margin-top: 50px" :options="accountedOption" ></vue-highcharts>
            </div>
        </div>

        <div class="one-trend-total" style="height: 821px ;overflow: hidden">
            <div class="one-trend-total-title">
                <div class="one-trend-total-title">
                    <span>出入口TOP10数据</span>
                </div>
            </div>
            <ul class="table">
                <li>
                    <p>出入口信息</p>
                    <p>客流量</p>
                    <p>客流量峰值</p>
                    <p>平均客流量</p>
                </li>
                <li :key="index" v-for="(item,index) in data1">
                    <p>{{item.name}}</p>
                    <p>{{item.age}}</p>
                    <p>{{item.address}}</p>
                    <p>{{item.date}}</p>
                </li>
            </ul>
        </div>
        <div class="page_number">第{{pageNumber}}页</div>
        <report-list-floor></report-list-floor>
    </div>
</template>
<script>
import reportListHeader from '@/components/report/report_day_list_header'
import reportListFloor from '@/components/report/report_day_list_floor'
import VueHighcharts from 'vue2-highcharts'
export default {
  name: 'report-day-two',
  components: {
    reportListHeader,
    reportListFloor,
    VueHighcharts
  },
  data () {
    return {
      ifLevel: true,
      ifAccounted: true,
      propertyName: '',
      pageNumber: 3,
      data1: [
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }

      ],
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
        series: []
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
    tableList (name, data1, data2, data3, data4, pageNumber) {
      var that = this
      this.propertyName = name
      this.data1 = []
      this.data1 = data1

      this.ifAccounted = false
      this.ifLevel = false
      // 初始化数据
      this.levelOption.xAxis.categories = []
      this.levelOption.series = []
      this.accountedOption.series[0].data = []
      // 赋值
      this.levelOption.xAxis.categories = data2
      this.levelOption.series = data3
      this.accountedOption.series[0].data = data4
      // 页数
      this.pageNumber = pageNumber

      this.$nextTick(() => {
        that.ifLevel = true
        that.ifAccounted = true
      })
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style>
    .sixTable th, .sixTable td{
        height: 60px!important;
        font-size: 20px!important;
        text-align: center;

    }
</style>
<style scoped lang="less">
    .table{
        width: 100%;
        height: auto;
        margin-top: 20px;
        li{
            width: 100%;
            height: auto;
            overflow: hidden;
            background-color: #e9ebf5;
            border-bottom: 1px solid #fff;
            &:nth-child(1){
                background-color: #4472c4;
                margin-bottom: 5px;
                p{
                    color: #fff;
                }
            }
            &:nth-child(2n+0){
                background-color: #cfd5ea;
            }
            p{
                width: 25%;
                float:left;
                text-align: center;
                color: #000;
                height: 45px;
                line-height:45px;
                font-size: 18px;
                border-right: 1px solid #fff;
                &:nth-child(4){
                    border-right: none;
                };
            }
        }
    }
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
