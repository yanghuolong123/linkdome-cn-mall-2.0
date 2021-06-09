<template>
  <i-tabs v-model="current" v-if="canshow" >
     <slot slot="select"></slot>
    <tab-item
      :icon="iconCheck[item.type]"
      :titles="item.title"
      v-for="(item,index) in tabsInfo"
      :key="index"
    >
      <vue-apex-charts
        :type="item.type"
        height="400"
        :options="optionOfapxeCharts"
        :series="cloneSeries"
      ></vue-apex-charts>
    </tab-item>
    <tab-item icon="biaoge-copy" :titles="title[0]" id="table-item">
      <vs-table :data="tableData.data" maxHeight="400px" :noDataText="nodata">
        <template slot="thead">
          <vs-th :key="index" v-for="(item,index) in tableData.column" class="px-2">{{item.title}}</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td v-for="(c,idx) in tableData.column" :key="idx">{{tr[c.key] || ""}}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </tab-item>
    <tab-item icon="chakan"
      v-if="showChakan"
      :title="item.title"
      v-for="(item,index) in tabsInfo"
      :key="index"
    >
      <div style="height:400px; width:100%; overflow-y: auto;overflow-x: hidden" >
        <!-- <div class="allTable"></div> -->
        <vue-apex-charts
          :type="item.type"
          :width='chartWidth'
          :height="chartHeight"
          :options="optionOfapxeCharts"
          :series="cloneSeries"
        ></vue-apex-charts>
      </div>
    </tab-item>
  </i-tabs>
</template>
<script>
import iTabs from '_c/I-Tabs/Itabs.vue'
import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
import indicatorSelector from './IndicatorSelector'
import _ from 'lodash'
export default {
  name: 'chartTabs',
  components: {
    iTabs,
    tabItem,
    VueApexCharts,
    indicatorSelector
  },
  props: {
    xAxis: {
      type: Array,
      default: () => []// 与series 数据结构相同，[{key:xx,name:xx,data:[]}] 其中name 是作为表格第一列的名称，其他列从series中取
    },
    series: {
      type: Array, // chart series [{key:xx,name:xx,data:[]}]
      default: () => []
    },
    type: {
      type: Array,
      default: () => ['line', 'bar']
    },
    chartLib: {
      type: String, // 图表库，默认是apex ,此外还支持echarts
      default: 'Apex'
    },
    title: {
      type: Array, // tab 名称
      default: () => ['客流量趋势', '客流量趋势']
    },
    horizonta: {// 柱状图是否水平，默认false
      type: Boolean,
      default: false
    },
    extraOption: {
      type: Object,
      default: () => ({})
    },
    footfallSelect: {// 是否可以选择进出客流
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showChakan: false,
      isAllData: false,
      current: 0,
      nodata: '暂无数据',
      chartWidth: '99%',
      chartHeight: 385,
      canshow: false,
      option: {
        legend: {},
        tooltip: {
          trigger: 'axis'
        },
        dataset: {
          source: []
        },
        grid: {
          left: 'center',
          width: '90%'
        },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: []
      },
      iconCheck: {
        bar: '62',
        line: 'zhexiantu'
      },
      apexOptions: {
        xaxis: {
          categories: [],
          labels: {
            show: true,
            style: {
              fontFamily: 'Roboto,sans-serif'
            }
          }
        },
        colors: ['#00A0E9', '#2BD9CF', '#8D82F0', '#E8585A', '#E8585A', '#94E2FF'],
        yaxis: {
          labels: {
            formatter (value) {
              return value ? value.toLocaleString() : ''
            },
            style: {
              fontFamily: 'Roboto,sans-serif',
              marginLeft: '10px'
            }
          }
        },
        tooltip: {
          shared: true
        },
        stroke: {
          curve: 'straight',
          width: 2
        },
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            radius: 0,
            distributed: false
          }
        },
        dataLabels: {
          enabled: false
        },
        noData: {
          text: '暂无数据',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
        chart: {
          toolbar: {
            show: false
          },
          fontFamily: 'source_han_sans_cn',
          zoom: {
            enabled: false
          }
        },
        responsive: [
          {
            breakpoint: 1000,
            options: {
              plotOptions: {
                bar: {
                  horizontal: false
                }
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    mergeData () {
      return [...this.xAxis, ...this.series]
    },
    tableData () {
      let column = []
      let data = []
      if (!this.mergeData.length) return { column, data }
      this.mergeData.forEach((e, dindex) => {
        let { name: title, key } = e
        column.push({ title, key })
      })
      this.xAxis[0].data.forEach((e, dindex) => {
        let tml = {}
        column.forEach((k, kindex) => {
          let value = this.mergeData[kindex].data[dindex];
          if(typeof value === 'number'){
            value = value.toLocaleString()+'人次'
          }
          tml[k.key] = value
        })
        data.push(tml)
      })
      return { column, data }
    },
    optionOfapxeCharts () {
      if (!this.xAxis.length) return this.apexOptions
      let categories
      if (this.isAllData) {
        categories = this.xAxis[0].data
        if (categories.length < 10) {
          this.chartHeight = 400
          this.chartWidth = '100%'
        } else {
          this.chartHeight = categories.length * 40
          this.chartWidth = '99%'
        }
      } else {
        this.showChakan = this.xAxis[0].data.length > 10
        categories = _.take(this.xAxis[0].data, 10)
        this.chartHeight = 400
      }
      const ifhasData = Boolean(categories.length)
      let extraBarOpt = {
        plotOptions: {
          bar: {
            columnWidth: categories.length < 5 ? '20%' : '70%'
          }
        }
      }
      if (this.horizonta) {
        let horizbar = {
          yaxis: {
            labels: {
              offsetY: categories.length < 5 ? -10 : 0,
              offsetX: 10,
              show: ifhasData
              // formatter: (value) => { return value + '123' }
            },
            show: ifhasData
          },
          plotOptions: {
            bar: {
              barHeight: categories.length < 5 ? '20%' : '70%',
              horizontal: true
            }
          },
          tooltip:{
            y:{
              formatter:(val)=>{
                if (val == undefined || val == null || val == ''){
                  return ''
                };
                if(typeof val === 'number'){
                  return val.toLocaleString()+'人次'
                }else {
                  return val+'人次'
                }
              }
            }
          },
          xAxis: {
            lines: {
              show: ifhasData
            }

          },
          grid: {
            yaxis: {
              lines: {
                show: ifhasData
              }
            }
          }
        }
        extraBarOpt = _.merge(extraBarOpt, horizbar)
      }
      let mergeObj = _.merge(this.apexOptions, extraBarOpt)
      let xData = {
        xaxis: {
          categories,
          labels: {
            formatter: (value) => { return value.toLocaleString() }
          }
        }
      }
      return { ...mergeObj, ...xData }
    },
    cloneSeries () {
      let cloneData = _.cloneDeep(this.series)
      if (this.isAllData) {
        return cloneData// 因为apexchart 点击图例会影响到外部的数据，需要在外部克隆一份
      } else {
        cloneData.map(list => {
          let newData = []
          list.data.map(val => {
            if (newData.length < 10)newData.push(val)
          })
          list.data = newData
        })
        return cloneData
      }
    },
    tabsInfo () {
      let data = []
      this.type.forEach((item, index) => {
        let tml = {
          type: item,
          title: this.title[index]
        }
        data.push(tml)
      })
      return data
    }
  },
  watch: {
    series () {
      this.canshow = false
      this.$nextTick(() => { this.canshow = true })
    },
    current () {
      this.current == 2 ? this.isAllData = true : this.isAllData = false
    }
  },
  methods: {
    transformToSet (xAxis, series) {
      let dataset = []
      if (!xAxis.length || !series.length) return { dataset: { source: dataset } }
      let firstItem = series.map(s => s.name)
      xAxis[0].data.forEach((e, index) => {
        let tml = []
        tml.push(e)
        series.forEach(s => { tml.push(s.data[index]) })
        dataset.push(tml)// 生成dataset
      })
      firstItem.unshift(xAxis[0].key || '')
      dataset.unshift(firstItem)// 将这项添加在dataset头部
      let seriesCheckObj = this.initSeriesOfEchart() // 生成各类型的serie
      return { dataset: { source: dataset }, seriesCheckObj }
    },
    initSeriesOfEchart () {
      let result = {}
      this.type.forEach(type => {
        let tml = { series: [] }
        this.series.forEach(s => { tml.series.push({ type, barMaxWidth: 80 }) })
        result[type] = tml
      })
      return result
    }
  }

}
</script>

<style lang="stylus" scoped>
#table-item /deep/
  .vs-component.vs-con-table
    overflow auto
    .vs-table--thead
      >tr
        background-color #f8f8f8
        >th
          white-space nowrap
          min-width fit-content
    .vs-table.vs-table--tbody-table
      >tr
        border-bottom 1px solid #f8f8f8
        white-space nowrap
        min-width fit-content
</style>
