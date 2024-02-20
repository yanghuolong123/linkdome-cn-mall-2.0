<template>
  <div ref="dom" id="dom" :style="{height:`${height}px`}">
  </div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsNoData from 'highcharts/modules/no-data-to-display'
import mixins from './chartMixin'
HighchartsNoData(Highcharts)
export default {
  name: 'pie',
  mixins: [mixins],
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    colors: {
      type: Array,
      default: () => ['#1c81da', '#3A8EDB', '#4E9AE4', '#2AD6CE', '#FEB33D']
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
    valueSuffix: {
      type: String,
      default: '人'
    },
    showInLegend: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dom: null,
      option: {
        chart: {
          type: 'pie',
          reflow: true
        },
        colors: ['#1c81da', '#00b8a9', '#f6416c', '#f8b739', '#007880'],
        title: {
          text: this.title,
          style: {'fontFamily': 'Microsoft YaHei', 'fontSize': '18px'}
        },
        subtitle: {
          text: this.subtitle
        },
        lang: {
          noData: this.$t("holder.NoData")
        },
        noData: {
          style: {
            fontSize: '12px',
            fontWeight: 'normal',
            fontFamily: 'Microsoft YaHei',
            color: '#515a6e'
          }
        },
        yAxis: {
          title: {
            text: '客流量'
          },
          visible: true
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            size: '80%',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: 'black'
              }
            },
            showInLegend: this.showInLegend
          }
        },
        legend: {
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
  watch: {
    // 本组件可以通过watch value 重绘图表，也可以通过直接调用refs.ininCharts()重绘，任选其一
    value: {
      deep: true,
      immediate: true,
      handler (val, oldVal) {
        this.initCharts({value: val})
      }
    }
  },
  methods: {
    initCharts (newdata) {
      if (newdata && newdata.value) {
        if (newdata.value[0].data.some(e => e.y !== 0)) this.option.series = newdata.value// 是否不全为零
        else this.option.series = []
        if (!newdata.value.length) {
          this.option.yAxis.visible = false
        } else {
          this.option.yAxis.visible = true
        }
      }
      this.$nextTick(() => {
        this.dom = Highcharts.chart(this.$refs.dom, this.option)
      })
    }
  }
}
</script>
