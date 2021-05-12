<template>
  <div ref="dom" id="dom">
  </div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsNoData from 'highcharts/modules/no-data-to-display'
import mixins from './chartMixin'
import {isAllZero} from '@/libs/util'
HighchartsNoData(Highcharts)
Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ','
  },
  style: {
    fontFamily: 'Microsoft YaHei',
    fontWeight: 'normal'
  },
  xAxis: {
    tickmarkPlacement: 'on'// 此处会影响横轴分组的样式
  },
  plotOptions: {
    series: {
      maxPointWidth: 100
      // pointPlacement: 'between'
    }
  }
})
export default {
  name: 'spline',
  mixins: [mixins],
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    colors: {
      type: Array
    },
    xAxis: {
      type: Array
    },
    value: {
      type: Array
    },
    isSpline: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dom: null,
      option: {
        chart: {
          type: this.isSpline ? 'spline' : null,
          reflow: true,
          marginTop: 30
        },
        colors: this.colors ? this.colors : ['#2280D7', '#745AEF', '#2bd9cf', '#FEB33D', '#00AEEF', '#F1511B'],
        title: {
          text: this.title ? this.title : ''
        },
        subtitle: {
          text: this.subtitle ? this.subtitle : ''
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
        xAxis: {
          categories: this.xAxis,
          title: {
            text: null
          },
          visible: true,
          allowDecimals: false
        },
        yAxis: {
          title: {
            text: '客流量'
          },
          visible: true,
          plotLines: []
        },
        tooltip: {
          valueSuffix: '人',
          thousandsSep: ','
          // crosshairs: true,
          // shared: true
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1
            }
          }
        },
        legend: {
          // layout: 'vertical',
          // align: 'right',
          // verticalAlign: 'top',
          // x: -40,
          // y: 80,
          // floating: true,
          // borderWidth: 1,
          // backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
          // shadow: true
        },
        credits: {
          enabled: false
        },
        series: []
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
      // newdata:{xAxis:[],value:[]}
      if (newdata) {
        if (isAllZero(newdata.value)) {
          this.option.xAxis.categories = []
          this.option.series = []
          // 在此抛出是否全为零的状态
          this.$emit('onAllzero', true)
        } else {
          this.$emit('onAllzero', false)
          this.option.xAxis.categories = newdata.xAxis
          this.option.series = newdata.value
          if (!newdata.value.length) {
            this.option.xAxis.visible = false
            this.option.yAxis.visible = false
          } else {
            this.option.xAxis.visible = true
            this.option.yAxis.visible = true
          }
        }
      }
      this.$nextTick(() => {
        this.dom = Highcharts.chart(this.$refs.dom, this.option)
      })
    },
    sInitCharts (newdata) {
      /**
       * 目标分析页面，不需要对数据全是零进行检测
       */
      this.option.xAxis.categories = newdata.xAxis
      this.option.series = newdata.value
      this.$nextTick(() => {
        this.dom = Highcharts.chart(this.$refs.dom, this.option)
      })
    }
    // renderLabels () {
    //   this.$nextTick(() => {
    //     console.log(this.dom)
    //     this.dom.series[0].yAxis.plotLinesAndBands[0].label.element({
    //       fill: '#FFFFEF',
    //       stroke: 'gray',
    //       'stroke-width': 1,
    //       zIndex: 4
    //     })
    //   })
    // }
  }
}
</script>
