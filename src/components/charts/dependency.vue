<template>
<div>
  <div ref="dom"  id="dom" >
  </div>
</div>

</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsWheel from 'highcharts/modules/dependency-wheel'
import HighchartsOldie from 'highcharts/modules/oldie'
import HighchartsSankey from 'highcharts/modules/sankey'
import HighchartsExporting from 'highcharts/modules/exporting'

HighchartsOldie(Highcharts)
HighchartsSankey(Highcharts)
HighchartsExporting(Highcharts)
HighchartsWheel(Highcharts)
export default {
  name: 'dependency-wheel',
  data () {
    return {
      dom: null,
      option: {
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        exporting: { enabled: false },
        tooltip: {
          userHTML: true,
          formatter () {
            var data
            if (this.point.from) {
              data = this.point.from + '<span style="font-size:20px">↔</span>' + this.point.to + ':' + this.point.weight + '%'
            } else {
              // + ':' + (this.point.sum).toFixed(2) + '%'
              data = this.point.name
            }
            return data
          }
        },
        series: [
          {
            keys: ['from', 'to', 'weight'],
            data: [
              ['城市立方购物中心', '城市立方一层', 0],
              ['城市立方购物中心', '负三层六部梯', 1],
              ['城市立方购物中心', '负三层观光梯', 2],
              ['城市立方购物中心', '负三层东侧扶梯', 3]
            ],
            type: 'dependencywheel',
            name: '',
            dataLabels: {
              color: '#333',
              textPath: {
                enabled: true,
                attributes: {
                  dy: 5
                }
              },
              distance: 10
            },
            size: '95%',
            animation: {
              duration: 0
            }
          }]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
        this.initCharts()
    })
  },
  methods: {
    initCharts (newdata) {
      this.option.series[0].data = []
      this.option.series[0].data = newdata
      this.$nextTick(() => {
        this.dom = Highcharts.chart(this.$refs.dom, this.option)
      })
      
    }
  }
}
</script>
<style>
  #dom{
    height: 600px;
  }
</style>
