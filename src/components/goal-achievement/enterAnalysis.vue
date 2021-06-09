<template>
  <div>
        <vue-apex-charts
            ref="chartBar"
            type=bar
            height="640"
            :options="chartOptions"
            :series="series"
            style="padding-top:55px"
        ></vue-apex-charts>
  </div>
</template>
<script>

import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import iTabs from '_c/I-Tabs/Itabs.vue'
export default {
  name: 'goalCharts',
  props: {
    xAxis: {
      type: Array
    },
    series: {
      type: Array
    }
  },
  components: {
    tabItem,
    VueApexCharts,
    TableMultipleSelected,
    iTabs
  },
  data () {
    return {
      isChart: true,
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '70%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        chart: {
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }

        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        colors: ['#00A0E9', '#897FF0', '#EA5455', '#FF9F43', '#1E1E1E'],
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: ''
          },
          min: 0,
          labels: {
            show: true,
            formatter: (value) => { return Number(value.toFixed(0)).toLocaleString() }
          }
        },
        fill: {
          opacity: 1

        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toLocaleString() + '人'
            }
          }
        }
      }
    }
  },
  computed: {
  },
  activated () {
    this.iconIndex = 0
    this.current = 0
  },
  watch: {
    'xAxis' () {
      this.dataList()
    }
  },
  mounted () {
    this.dataList()
  },
  methods: {
    dataList () {
      let that = this
      this.chartOptions.xaxis.categories = this.xAxis
      this.$refs.chartBar.updateOptions({
        xaxis: { categories: that.chartOptions.xaxis.categories }
      })
      if (that.chartOptions.xaxis.categories.length < 5) {
        that.chartOptions.plotOptions.bar.columnWidth = '15%'
        that.$refs.chartBar.updateOptions({ plotOptions: that.chartOptions.plotOptions })
      } else {
        that.chartOptions.plotOptions.bar.columnWidth = '70%'
        that.$refs.chartBar.updateOptions({ plotOptions: that.chartOptions.plotOptions })
      }
    }
  }
}
</script>
<style lang="less">

</style>
