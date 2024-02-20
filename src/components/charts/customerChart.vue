<template>
<div class="customerChart">
    <div class="chartss">
        <i-tabs  class="chartsTable" v-model="current">
            <tab-item :icon="icon1" :title="title1" style="height: 380px!important;">
                <vue-apex-charts type=donut  :height="height" :options="apexOptions" :series="series" />
                <div class="datass">
                    <div class="datas">
                        <icons  class="icons" :size="20"  type="kehulianxiren1" color="#2280D7"></icons>
                        <span class="names">&nbsp;{{labels[1]}}&nbsp;</span>
                        <span class="number">{{series[1]}}</span>
                    </div>
                    <div class="datas">
                        <icons class="icons" :size="20"  type="kehulianxiren" color="#F9A246"></icons>
                        <span class="names">&nbsp;{{labels[0]}}&nbsp;</span>
                        <span class="number">{{series[0]}}</span>
                    </div>
                </div>
            </tab-item>
            <tab-item :icon="icon2" :title="title2">
                  <i-table :columns="columns" :data="tableList"></i-table>
                <!-- <TableMultipleSelected  :tableName = "columns" :tableList="tableList"></TableMultipleSelected> -->
            </tab-item>
        </i-tabs>
    </div>
</div>
</template>

<script>
// import _ from 'lodash'
import iTable from '@/views/footfall-analytics/components/iTable.vue'
import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
// import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import iTabs from '_c/I-Tabs/Itabs.vue'
export default {
  components: {
    VueApexCharts,
    tabItem,
    iTabs,
    iTable
    // TableMultipleSelected
  },
  props: {
    series: {
      type: Array,
      default: () => [80, 20]
    },
    labels: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '350px'
    },
    icon1: {
      type: String,
      default: 'fenxi'
    },
    icon2: {
      type: String,
      default: 'biaoge-copy'
    },
    title1: {
      type: String,
      default: 'newOldCusProportion'
    },
    title2: {
      type: String,
      default: '详细数据'
    }
  },
  computed: {
    apexOptions () {
    //   this.chartOptions.labels = this.labels
    //   return this.chartOptions
      return { ...this.chartOptions, ...{ labels: this.labels } }
    },
    tableList () {
    //   var data = this.series
    //   var sum = _.sum(data)
    //   var columns = ['类型', '客流量', '百分比']
    //   var labels = this.labels
    //   var tableLists = []
    //   var nan = {}
    //   nan.name = labels[0]
    //   nan.begin = data[0]
    //   nan.end = Math.round(data[0] / sum * 100) + '%'
    //   tableLists.push(nan)
    //   var nv = {}
    //   nv.name = labels[1]
    //   nv.begin = data[1]
    //   nv.end = (100 - Math.round(data[0] / sum * 100)) + '%'
    //   tableLists.push(nv)
    //   this.columns = columns
    //   return tableLists
      const [newCustom, oldCustom] = this.series
      const sumEnter = this.series.reduce((accumulator, currentValue) => accumulator + currentValue)
      let result = [
        {
          type: 'newCustomer',
          enter: newCustom,
          rate: sumEnter ? `${Math.round(newCustom / sumEnter)}%` : '0%'
        },
        {
          type: 'reCustomer',
          enter: oldCustom,
          rate: sumEnter ? `${Math.round(oldCustom / sumEnter)}%` : '0%'
        }
      ]
      return result
    },
    columns () {
      let tml = [
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '客流量',
          key: 'enter'
        },
        {
          title: '占比',
          key: 'rate'
        }
      ]
      return tml
    }
  },
  data () {
    return {
      current: 0,
      //   columns: ['类型', '客流量', '百分比'],
      // Product Orders
      chartOptions: {
        plotOptions: {
          pie: {
            donut: { size: '65%' },
            size: 100
          }
        },
        colors: ['#857AEF', '#F9A143', '#EA5455', '#FF9F43', '#1E1E1E'],
        responsive: [{
          breakpoint: 480,
          dataLabels: {
            enabled: false
          },
          options: {
            chart: {
              width: '35%'
            }
          }
        }],
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'gradient',
          gradient: {
            // enabled: true,
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: [ '#AAA3F4', '#F5C380' ],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        legend: {
          show: false
        }
      }
    }
  }

}
</script>

<style scope lang="scss">
.customerChart{
    .chartsTable{
        background-color: #fff;
        margin-top: 20px;
        border-radius: 6px;
    }
    .datass{
        position: absolute;
        bottom: 20px;
        left: 0%;
        width: 100%;
        .datas{
            font-size: 18px;
            height: 30px;
            .icons{
                position: absolute;
                left: 16%;
            }
            .names{
                position: absolute;
                left:25%;
            }
            .number{
                position: absolute;
                right:20%;
            }
        }
    }

}
</style>
