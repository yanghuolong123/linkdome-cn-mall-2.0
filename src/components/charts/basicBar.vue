<template>
  <div ref="dom" id="dom" class="test" :style="{height:`${height}px`}">
  </div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsNoData from 'highcharts/modules/no-data-to-display'
import mixins from './chartMixin'
import {isAllZero} from '@/libs/util'
import {chartScroll} from './chartScroll.js'
chartScroll(Highcharts)
HighchartsNoData(Highcharts)
export default {
  name: 'basicBar',
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
    height: {
      type: Number,
      default: 400
    },
    scrollbarEnable: {
      type: Boolean,
      default: false
    },
    yAxisVisble: {
      type: Boolean,
      default: false
    },
    isAllZero: {
      type: Boolean
    },
    chartPadding: {
      type: Number,
      default: 70
    }
  },
  data () {
    return {
      dom: null,
      option: {
        chart: {
          type: 'bar',
          style: {
            fontFamily: 'Microsoft YaHei'
          }
          // spacingRight: this.chartPadding
        },
        colors: this.colors ? this.colors : ['#1c81da', '#3A8EDB', '#4E9AE4', '#2AD6CE', '#FEB33D'],
        title: {
          text: this.title ? this.title : ''
        },
        subtitle: {
          text: this.subtitle ? this.subtitle : ''
        },
        lang: {
          noData: this.$t('holder.NoData')
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
          categories: [],
          title: {
            text: null
          },
          showEmpty: false,
          min: 0,
          max: null,
          // labels: {//这里隐藏一个bug,横坐标需要textover-flow ellipsis 的时候，datalables,失去了自动判断出现位置的能力。
          //   useHTML: true, // Set to true
          //   // step: 1,
          //   formatter: function () { // use formatter to break word.
          //     return '<div align="center" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + this.value + '</div>'
          //   }
          // },
          scrollbar: {
            enabled: this.scrollbarEnable,
            showFull: true
          },
          events: {
            afterSetExtremes () {
              var xAxis = this
              var numberOfPoints = xAxis.series[0].points.length - 1
              var minRangeValue = xAxis.getExtremes().min
              var maxRangeValue = xAxis.getExtremes().max
              if (minRangeValue < 0) {
                xAxis.setExtremes(null, xAxis.options.max)
              } else if (maxRangeValue > numberOfPoints) {
                xAxis.setExtremes(numberOfPoints - xAxis.options.max, numberOfPoints)
              }
            }
          }
        },
        yAxis: {
          title: {
            text: '客流量'
          },
          visible: this.yAxisVisble
        },
        tooltip: {
          valueSuffix: '人'
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: false
            }
          }
        },
        // legend: {
        //   layout: 'vertical',
        //   align: 'right',
        //   verticalAlign: 'top',
        //   x: -40,
        //   y: 80,
        //   floating: true,
        //   borderWidth: 1,
        //   backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
        //   shadow: true
        // },
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
      if (newdata) {
        /**
         *  如果全是零或空数组，则绘制暂无数据
         * 只要数组不为空且只要有一个值不为零就绘制否则绘制空数组
        }
         */
        if (isAllZero(newdata.value)) {
          this.option.xAxis.categories = []
          this.option.series = []
          this.$emit('onAllzero', true)
        } else {
          this.$emit('onAllzero', false)
          this.option.xAxis.max = newdata.xAxis.length > 10 ? 9 : newdata.xAxis.length - 1
          // if (newdata.xAxis.length > 10) this.option.tooltip = {backgroundColor: '#FCFFC5'}// when series's length more than ten the tootip is overflow xaxis'lable
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
    }
  }
}
</script>
