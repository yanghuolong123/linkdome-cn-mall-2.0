<template>
  <div ref="dom" id="dom" :style="{height:`${height}px`}">
  </div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsNoData from 'highcharts/modules/no-data-to-display'
import mixins from './chartMixin'
import {isAllZero} from '@/libs/util'
import HighchartsGroupedCategories from 'highcharts-grouped-categories/grouped-categories'
Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ','
  }

})
HighchartsNoData(Highcharts)
HighchartsGroupedCategories(Highcharts)
export default {
  name: 'bar',
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
    valueSuffix: {
      type: String,
      default: '人'
    },
    height: {
      type: Number,
      default: 400
    },
    showInLegend: {
      type: Boolean,
      default: true
    },
    labelsFormatter: {
      type: Object,
      default: () => ({})
    },
    isxAxisGroup: {
      type: Boolean,
      default: false
    },
    stacking: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dom: null,
      option: {
        chart: {
          type: 'column',
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
          noData: this.$t("holder.NoData"),
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
          categories: [],
          title: {
            text: null
          },
          visible: true,
          allowDecimals: false,
          tickmarkPlacement: this.isxAxisGroup ? 'between' : 'on'// 此处全局设为on,但是柱状图分组的时候，样式乱掉，应该改为between
        },
        yAxis: {
          title: {
            text: '客流量'
          },
          visible: true,
          labels: this.labelsFormatter
        },
        tooltip: {
          valueSuffix: this.valueSuffix
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: false
            },
            showInLegend: this.showInLegend,
            stacking: this.stacking
          }
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
    }
  }
}
</script>
