<template>
<div class="genderChart">
    <div class="chartss middle">
        <i-tabs  class="chartsTable" v-model="current">
            <tab-item :icon="icon1" :title="title1" :style="{height: height0}">
                <vue-apex-charts type=radialBar :height="height" :options="apexOptions" :series="series" />
                <div class="datass">
                    <div class="datas">
                        <icons class="icons" :size="20" :type="icon3" :color="color1"></icons>
                        <span class="names" >&nbsp;{{labels[1]}}&nbsp;</span>
                        <span class="number">{{series[1]}}</span>
                    </div>
                    <div class="datas">
                        <icons  class="icons" :style="{margin:margins2}":size="20" :type="icon4" :color="color2"></icons>
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
      default: () => [70, 30]
    },
    labels: {
      type: Array,
      default: () => []
    },
    height0: {
      type: String,
      default: '380px!important'
    },
    height: {
      type: String,
      default: '350px'
    },
    margins2: {
      type: String,
      default: ''
    },
    color1: {
      type: String,
      default: '#E85D59'
    },
    color2: {
      type: String,
      default: '#05A6E7'
    },
    icon1: {
      type: String,
      default: 'fenxi'
    },
    icon2: {
      type: String,
      default: 'biaoge-copy'
    },
    icon3: {
      type: String,
      default: 'female'
    },
    icon4: {
      type: String,
      default: 'male'
    },
    title1: {
      type: String,
      default: '性别分布'
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
    //   var columns = ['性别', '客流量', '百分比']
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
      const [maleEnter, femaleEnter] = this.series
      const sumEnter = this.series.reduce((accumulator, currentValue) => accumulator + currentValue)
      let result = [
        {
          gender: '男',
          enter: maleEnter,
          rate: sumEnter ? `${Math.round(maleEnter / sumEnter)}%` : '0%'
        },
        {
          gender: '女',
          enter: femaleEnter,
          rate: sumEnter ? `${Math.round(femaleEnter / sumEnter)}%` : '0%'
        }
      ]
      return result
    },
    columns () {
      let tml = [
        {
          title: '性别',
          key: 'gender'
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
.genderChart{
    .chartsTable{
        background-color: #fff;
        margin-top: 20px;
        border-radius: 6px;
    }
    .middle{
        margin:  0% 0.95%;
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
                    left:22%;
                }
                .number{
                    position: absolute;
                    right:20%;
                }
            }
        }

}
</style>
