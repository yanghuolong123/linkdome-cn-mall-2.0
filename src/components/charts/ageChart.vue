<template>
    <div class="ageChart">
        <!-- <div class="hasCover" v-if="hasCover == 1"></div> -->
        <div class="chartss">
            <i-tabs  class="chartsTable" v-model="current">
                <tab-item :icon="icon1" :title="title1">
                    <div class="flexs">
                        <div class="circle" :style="{backgroundColor:apexOptions.colors[0]}"></div> {{series[0].name}}
                        <div class="circle" :style="{backgroundColor:apexOptions.colors[1]}"></div> {{series[1].name}}
                    </div>
                    <vue-apex-charts type=radar :height="height" :options="apexOptions" :series="series" />
                </tab-item>
                <tab-item :icon="icon2" :title="title2" >
                    <!-- <div style="max-height:350px;">
                        <TableMultipleSelected  :tableName = "columns" :tableList="tableList"></TableMultipleSelected>
                    </div> -->
                    <i-table :columns="columns" :data="tableList"></i-table>
                </tab-item>
            </i-tabs>

        </div>
    </div>
</template>

<script>
import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
// import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import iTabs from '_c/I-Tabs/Itabs.vue'
import iTable from '@/views/footfall-analytics/components/iTable.vue'
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
      default: () => [ {
        name: '男性',
        data: [70, 75, 70, 76, 20, 85]
      },
      {
        name: '女性',
        data: [90, 50, 86, 40, 100, 20]
      } ]
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
      default: '年龄分布'
    },
    title2: {
      type: String,
      default: '详细数据'
    }
  },
  computed: {
    apexOptions () {
      // this.chartOptions.labels = this.labels
      // return this.chartOptions
      return { ...this.chartOptions, ...{ labels: this.labels } }
    },
    tableList () {
      // var data = this.series
      // var columns = _.cloneDeep(this.column)
      // columns.push(data[0].name)
      // columns.push(data[1].name)
      // var labels = this.labels
      // var tableLists = []
      // data[0].data.forEach(function (m, index) {
      //   var obj = {}
      //   obj.name = labels[index]
      //   obj.begin = data[0].data[index]
      //   obj.end = data[1].data[index]
      //   tableLists.push(obj)
      // })
      // // this.columns = columns
      // return tableLists
      let result = []
      this.series[0].data.forEach((e, index) => {
        let tml = {}
        tml.age = this.labels[index]
        tml.male = e
        tml.female = this.series[1].data[index]
        result.push(tml)
      })
      return result
    },
    columns () {
      let tml = [
        {
          title: '年龄',
          key: 'age'
        }
      ]
      let genders = this.series.map(e => { return { title: e.name, key: e.key } })
      return [...tml, ...genders]
    }
  },
  data () {
    return {
      current: 0,
      column: ['年龄'],
      chartOptions: {
        labels: ['<20', '20-30', '30-40', '40-50', '50-60', '60+'],
        dataLabels: {
          style: {
            colors: ['#b9c3cd', '#b9c3cd', '#b9c3cd', '#b9c3cd', '#b9c3cd', '#b9c3cd']
          }
        },
        yaxis: {
          show: false
        },
        grid: {
          show: false
        },
        legend: { show: false },
        chart: {
          dropShadow: {
            enabled: false,
            blur: 8,
            left: 1,
            top: 1,
            opacity: 0.2
          },
          toolbar: {
            show: false
          }
        },
        stroke: {
          width: 0
        },
        colors: ['#00A0E9', '#E7585B'],
        plotOptions: {
          radar: {
            polygons: {
              strokeColors: ['#e8e8e8', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
              connectorColors: 'transparent'
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#52BEF0', '#FEB33D'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },
        markers: {
          size: 0
        }
      }
    }
  }

}
</script>

<style scope lang="scss">
.ageChart{
    // position: relative;
    .chartsTable{
        background-color: #fff;
        margin-top: 20px;
        border-radius: 6px;
    }
    .circle{
        width: 8px;
        height:8px;
        border-radius: 50%;
        margin-right:6px;
        margin-left:14px;
    }
    .flexs{
        display: flex;
        line-height: 12px;
        padding-left:10px;
    }
    // .vs-table--tbody-table .tr-values td {
    //  padding: 0px!important;
    // }
}
// .hasCover{
//     position: absolute;
//     z-index: 9999;
//     background-color: #ababab;
//     width: 100%;
//     height: 100%;
//     opacity: 0.3;
// }

</style>
