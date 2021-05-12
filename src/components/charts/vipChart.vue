<template>
    <div class="vipCharts">
        <div class="chartss">
            <i-tabs  class="chartsTable" v-model="current">
                <tab-item :icon="icon1" :titles="title1">
                    <div style="display:flex">
                            <vue-apex-charts style="width:45%" type=radialBar :height="height" :options="apexOptions" :series="series" />
                            <div class="vipdatass" style="width:55%">
                                <div class="datas">
                                    <icons class="icons" :style="{margin:margins1}" :size="20" type="shengjivip" color="#E85D59"></icons>
                                    <span class="names">&nbsp;{{labels[1]}}&nbsp;</span>
                                    <span class="number">{{series[1]}}</span>
                                </div>
                                <div class="datas">
                                    <icons  class="icons" :style="{margin:margins2}" :size="20" type="maozi-copy" color="#05A6E7"></icons>
                                    <span class="names">&nbsp;{{labels[0]}}&nbsp;</span>
                                    <span class="number">{{series[0]}}</span>
                                </div>
                            </div>
                    </div>

                </tab-item>
                <tab-item :icon="icon2" :titles="title2">
                      <i-table :columns="columns" :data="tableList"></i-table>
                    <!-- <TableMultipleSelected  :tableName = "columns" :tableList="tableList"></TableMultipleSelected> -->
                </tab-item>
            </i-tabs>
        </div>
    </div>
</template>

<script>
// import _ from 'lodash'
import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
// import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import iTable from '@/views/footfall-analytics/components/iTable.vue'
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
      default: () => [70, 30]
    },
    labels: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '340px'
    },
    margins1: {
      type: String,
      default: '0 15px 0px 7px'
    },
    margins2: {
      type: String,
      default: ''
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
      default: 'VIP顾客占比'
    },
    title2: {
      type: String,
      default: '详细数据'
    }
  },
  computed: {
    apexOptions () {
      return { ...this.chartOptions, ...{ labels: this.labels } }
    },
    tableList () {
      const [commonCustom, vipCustom] = this.series
      const sumEnter = this.series.reduce((accumulator, currentValue) => accumulator + currentValue)
      let result = [
        {
          type: 'vip顾客',
          enter: vipCustom,
          rate: sumEnter ? `${Math.round(vipCustom / sumEnter)}%` : '0%'
        },
        {
          type: '普通顾客',
          enter: commonCustom,
          rate: sumEnter ? `${Math.round(commonCustom / sumEnter)}%` : '0%'
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
      // Product Orders
      chartOptions: {
        labels: [],
        plotOptions: {
          radialBar: {
            size: 135,
            hollow: {
              size: '20%'
            },
            track: {
              background: '#ebebeb',
              strokeWidth: '100%',
              margin: 15
            },
            dataLabels: {
              show: true,
              name: {
                fontSize: '18px'
              },
              value: {
                fontSize: '16px',
                color: '#636a71',
                offsetY: 11
              },
              total: {
                show: false,
                label: '',
                formatter: function () {

                }
              }
            }
          }
        },
        responsive: [{
          breakpoint: 576,
          options: {
            plotOptions: {
              radialBar: {
                size: 100,
                hollow: {
                  size: '10%'
                },
                track: {
                  background: '#ebebeb',
                  strokeWidth: '100%',
                  margin: 15
                }
              }
            }
          }
        }],
        colors: ['#E85A5A', '#00A0E9'],
        fill: {
          type: 'gradient',
          gradient: {
            // enabled: true,
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: [ '#FCAC3F', '#01A1E9' ],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        chart: {
          dropShadow: {
            enabled: false,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1
          }
        }
      }
    }
  }

}
</script>

<style scope lang="scss">
.vipCharts{
    .chartsTable{
        background-color: #fff;
        margin-top: 20px;
        border-radius: 6px;
    }
    .middle{
        margin:  0% 0.95%;
    }
    .vipdatass{
        position: relative;
        bottom: -7px;
        left: 0%;
        width: 100%;
        padding-top: 17%;
        .datas{
            font-size: 18px;
            padding-left: 16%;
            height: 30px;
            .icons{
                margin-right: 2%;
            }
            .number{
                position: absolute;
                right: 20%;
            }
        }
    }

}
</style>
