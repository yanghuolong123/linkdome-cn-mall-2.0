<template>
  <div ref="dom" id="dom" class="charts chart-dashboard">
  </div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import solidGauge from 'highcharts/modules/solid-gauge'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts3D from 'highcharts/highcharts-3d'
import mixins from './chartMixin'
HighchartsMore(Highcharts)
solidGauge(Highcharts)
HighchartsDrilldown(Highcharts)
Highcharts3D(Highcharts)
export default {
  name: 'ChartDashboard',
  mixins: [mixins],
  props: {
    title: {
      type: String,
      default: '本月客流达成率'
    }
  },
  data () {
    return {
      options: {
        chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false,
          style: {
            fontFamily: 'yahei'
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: this.title,
          verticalAlign: 'bottom',
          y: -10,
          style: {
            color: '#d7d7d7'
          }
        },
        pane: {
          startAngle: -90,
          endAngle: 90,
          background: [
            {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '100%',
              innerRadius: '100%'
            }
          ]
        },
        yAxis: {
          min: 0,
          max: 300,
          minorTickInterval: 'false',
          minorTickWidth: 1,
          minorTickLength: 0,
          minorTickPosition: 'inside',
          tickInterval: 150,
          plotBands: []
        },
        plotOptions: {
          gauge: {
            dial: {
              radius: '50%',
              backgroundColor: '#745AEF',
              baseLength: '100%',
              rearLength: '0%'
            },
            pivot: {
              backgroundColor: '#745AEF',
              radius: 3
            }
          }
        },
        tooltip: {
          enabled: false
        },
        series: [
          {
            name: 'Speed',
            data: [80],
            dataLabels: {
              borderColor: '#fff',
              color: '#745AEF',
              format: '{y} %',
              style: {
                fontSize: '38px',
                color: '#745AEF'
              }
            }
          }
        ]
      },
      dom: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.dom = this.initCharts({rate: 0, color: '#745AEF'})
    })
  },
  methods: {
    initCharts ({rate = 0, color}) {
      this.$set(this.options.series[0].data, 0, rate)
      this.options.plotOptions.gauge.dial.backgroundColor = color
      this.options.plotOptions.gauge.pivot.backgroundColor = color
      this.options.series[0].dataLabels.color = color
      if (rate <= 300) {
        this.options.yAxis.max = 300
        this.options.yAxis.tickInterval = 150
        this.options.yAxis.plotBands = [
          {
            from: 0,
            to: rate,
            color: color
          },
          {
            from: rate,
            to: 300,
            color: '#d4e2e8'
          }
        ]
      } else {
        this.options.yAxis.max = rate
        this.options.yAxis.tickInterval = rate
        this.options.yAxis.plotBands = [
          {
            from: 0,
            to: rate,
            color
          }
        ]
      }
      this.dom = Highcharts.chart(this.$refs.dom, this.options)
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
