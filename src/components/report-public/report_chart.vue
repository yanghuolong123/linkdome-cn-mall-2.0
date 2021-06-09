
<template>
    <div class="report-chart">
      	<title-name :listTitle='listTitle'></title-name>
        <div class="chart-text">
            <vue-highcharts v-if="ifOneCharts"
            style="width: 100%;height:600px;"
            :options="trendOption"
            ></vue-highcharts>
        </div>
    </div>
</template>
<script>
import titleName from './report_title_name'
import VueHighcharts from 'vue2-highcharts'
import Bus from '@/libs/bus.js'
export default {
  name: 'report-chart',
  props: {
    listTitle: {
      type: Object
    },
    chartData: {
      type: Object
    },
    stacking: {
      type: String,
      defaults: null
    }
  },
  components: {
    titleName,
    VueHighcharts
  },
  data () {
    return {
      ifOneCharts: false,
      trendOption: {
        title: { text: ' ' },
        subtitle: { text: '' },
        credits: { enabled: false },
        yAxis: {
          title: { text: '' },
          labels: {
            formatter () {
              return this.value.toLocaleString()
            }
          }
        },
        xAxis: {
          categories: []
        },
        plotOptions: {
          column: {
            stacking: this.stacking,
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.y.toLocaleString()
              },
              allowOverlap: true,
              style: {
                color: '#000',
                padding: 0
              }
            },
            maxPointWidth: 20
          },
          line: {
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
            return this.x + '<br>' + this.series.name + ': ' + this.y.toLocaleString() + '人次'
          }
        },
        series: [
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
  watch: {

  },
  computed: {
  },
  created () {
    Bus.$on('chartData', () => {
      this.chartDataList()
    })
  },
  mounted () {

  },
  methods: {
    chartDataList () {
      this.ifOneCharts = false
      this.trendOption.series = this.chartData.seriesData
      this.trendOption.xAxis.categories = this.chartData.xAxisData
      this.$nextTick(() => {
        this.ifOneCharts = true
      })
    }
  }
}
</script>
<style scoped lang="less">
    .report-chart {
        width: 100%;
        padding: 0 80px;
        margin: 50px 0 30px 0;
        .chart-text{
            width: 100%;
            height: auto;
            border: 4px dashed #4edbda;
            border-radius: 8px;
            margin-top: 12px;
        }
    }
</style>
