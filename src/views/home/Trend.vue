<template>
  <div v-if="canshow">
    <chart-tabs
      ref="charts"
      :xAxis="xAxisObj"
      :series="finnalSeries"
      :extraOptions="extraOptWithYaxis"
      :istotal='istotal'
      :tooltipUnit="tooltipUnit(curretIndicator)"
      :totalData="totalData"
      @tableChage='TableChageList'
      class="bg-white box-card"
      id='trendLine'
      title="购物中心趋势分析">
      <export-menu  slot="export" @onchange="enterExportBiztop"></export-menu>
      <template>
        <div class="flex justify-between items-center mr-10">
          <span class="whitespace-no-wrap mx-4 text-sm">{{ $t('fx.Data_indicators') }}</span>
          <vs-select autocomplete :multiple='canSelectMulti' v-model="curretIndicator" :max-selected="2" id="chartSelect" @change="curretIndicatorChange">
            <vs-select-item
              v-for="(item,index) in filteredSelectList"
              :text="$t(item.name)"
              :key="index"
              :value="item.value"
            />
          </vs-select>
        </div>
      </template>
    </chart-tabs>
  </div>
</template>
<script>
import chartTabs from '_c/common/CopyChartsTabs.vue'
import indicatorSelector from '_c/common/IndicatorSelector.vue'
import _ from 'lodash'
import { getSalesTrend } from '@/api/home'
import { getFootfallTrend } from '@/api/passenger'
import salesDict from './components/salesIndicatorDict'
import NP from 'number-precision'
import exportMenu from '@/views/operation/components/ExportMenu.vue'
import { exportEx } from '@/api/home.js'
import { downloadEx } from '@/libs/util'
export default {
  name: 'Trend',
  props: {
    innerRange: {
      type: String,
      default: '1h'
    },
    propertyId: {
      type: null,
      default: null
    },
    bzids: {
      type: Array,
      default: () => []
    },
    time1: {
      type: String,
      default: ''
    },
    time2: {
      type: String,
      default: ''
    },
    indicatorData: {
      type: Object,
      default: () => salesDict
    },
    istotal: {
      type: Boolean,
      default: false
    }
  },
  components: {
    chartTabs,
    indicatorSelector,
    exportMenu
  },
  data () {
    return {
      current: 0,
      curretIndicator: ['enter'],
      chartData: {},
      extraOpt: {
        yaxis: []
      },
      canshow: false,
      isNeedRender: true,
      tableListData: []
      // loadingSize: 0
    }
  },
  watch: {
    time1: {
      immediate: true,
      handler: function (val, oldVal) {
        this.getTrendData()
      }
    },
    time2: {
      immediate: true,
      handler: function (val, oldVal) {
        this.getTrendData()
      }
    },
    propertyId: {
      immediate: true,
      handler: function (val, oldVal) {
        if (val) this.getTrendData()
      }
    },
    curretIndicator (val, oldVal) {
      // 来回切换指标的数据，图表不能重新适应页面，所以在此处理重新绘制
      if (this.curretIndicator.length == 0) this.curretIndicator = ['enter']
      this.refreshChart()
    }
  },
  activated () {
    this.canshow = false
    setTimeout(() => {
      this.canshow = true
    })
  },
  computed: {
    totalData () { // 合计数据
      let obj = { time: '合计' }
      _.forIn(this.chartData, (val, key) => {
        if (this.curretIndicator.includes(key)) {
          Object.assign(obj, val.total)
        }
      })
      return obj
    },
    convertInnerRange () {
      // 由于之前的innerrang 约定为 1hour 1day 1month ,新的innerrang 约定为 Hour Date Month,需要抓换
      if (this.innerRange === '1h') return 'Hour'
      if (this.innerRange === '1day') return 'Date'
      if (this.innerRange === '1month') return 'Month'
    },
    filteredSelectList () {
      // 当 innerange 不为1h,过滤掉 occupancy
      let sourceData = Object.keys(this.indicatorData).map(e => ({
        value: e, name: this.indicatorData[e].name
      }))
        // this.curretIndicator = _.remove(this.curretIndicator, (val) => { return val != 'occupancy' })
        return sourceData.filter(e => e.value !== 'occupancy')
      // if (this.innerRange === '1h') {
      //   return sourceData
      // } else {
      //   this.curretIndicator = _.remove(this.curretIndicator, (val) => { return val != 'occupancy' })
      //   return sourceData.filter(e => e.value !== 'occupancy')
      // }
    },
    filterSeries () {
      // 更据当前选择的指表获得图表需要的数据
      let tml = []
      if (Object.keys(this.chartData).length) {
        if (this.canSelectMulti) {
          this.time2 = ''
          this.curretIndicator.forEach(e => {
            tml.push(...this.chartData[e].series)
          })
        } else {
          tml.push(...this.chartData[this.curretIndicator].series)
        }
      }
      return tml
    },
    xAxisObj () {
      // 因为销售的数据是以天为粒度，客流的数据存在小时的粒度
      // 时间对比上，除了两个单天以外，已经处理过，不会存在横轴不一致的情况，
      // 如果此处不一致，当是时间对比，我们需要设置横轴为‘第一天’,非时间对比，只有选择的是一个单天，只要将那天的时间设为横轴即可

      if (this.curretIndicator.length === 0) {
        return {
          name: '时间',
          data: [],
          key: 'time'
        }
      } else {
        if (this.chartData[this.curretIndicator[0]]) {
          // curretIndicator 是 数组
          return {
            name: '时间',
            data: !this.isChangeCategories ? this.chartData[this.curretIndicator[0]].xAxis : this.time2 ? ['第一天'] : [this.time1.split(',')[0]],
            key: 'time'
          }
        } else if (this.chartData[this.curretIndicator]) {
          // curretIndicator 是 obj
          return {
            name: '时间',
            data: !this.isChangeCategories ? this.chartData[this.curretIndicator].xAxis : this.time2 ? ['第一天'] : [this.time1.split(',')[0]],
            key: 'time'
          }
        }
      }
    },
    isChangeCategories () {
      // 当指标超过两个，并且其中一个是集客量或者进客流，其他的销售指标，且 innerrange 为小时
      let series = this.filterSeries
      let filterFootfall
      if (this.canSelectMulti) {
        filterFootfall = this.curretIndicator.filter(e => ['enter', 'occupancy'].includes(e))
      } else {
        filterFootfall = this.curretIndicator
      }
      return series.length >= 2 && this.innerRange === '1h' && filterFootfall.length === 1
    },
    allSeriesKeys () {
      // series key，可能由时间,key,id共同组成,利用正则表达式，找到key
      return this.filterSeries.map(e => e.key.match(/[A-Za-z]+/)[0])
    },
    extraOptWithYaxis () {
      if (this.yaxisArr.length) {
        return { ...this.extraOpt, ...{ yaxis: this.yaxisArr } }
      } else {
        delete this.extraOpt.yaxis
        return this.extraOpt
      }
    },
    yaxisArr () {
      // if (!this.isNeedYaxis) return []
      let yAxiss = this.allSeriesKeys.map((e, index) => {
        let tmlYaxis = _.cloneDeep(this.indicatorData[e].yaxis)
        tmlYaxis.seriesName = e
        tmlYaxis.title.style = { fontSize: '13px' }
        tmlYaxis.min = 0
        tmlYaxis.labels = {
          formatter (value) {
            if (typeof (value) === 'number') {
              return value ? _.round(value, 0).toLocaleString() : ''
            } else {
              return value
            }
          }
        }
        return tmlYaxis
      })
      // 同一类的只需要保留一个轴,分组之后,将第一个除外其余隐藏
      let groupYaxis = _.groupBy(yAxiss, 'seriesName')
      Object.keys(groupYaxis).forEach(e => {
        let eleOfyAxis = groupYaxis[e]
        let [, ...rest] = eleOfyAxis
        rest.forEach(r => { r.show = false })
      })
      // 将另外一组 yaxis 设在右边
      if (Object.keys(groupYaxis).length > 1) {
        Object.values(groupYaxis)[1][0].opposite = true
      }
      return yAxiss
    },
    finnalSeries () {
      // 因为进客流和集客量存在小时类别,当与销售数据一块显示需要累加成当天的数据之和
      let series = _.cloneDeep(this.filterSeries)
      if (this.isChangeCategories) { // 需要计算出enter / occupancy 的和
        series.forEach(e => {
          e.data = [_.sum(e.data)]
        })
      }
      return series
    },
    canSelectMulti () {
      if (this.time2) return false
      else return true
    }
  },
  methods: {
    curretIndicatorChange(val){
      const hideSummary = val.some(o=>{
        return ['SquaerMetre','CloseRate','UnitPrice'].includes(o)
      })
      this.$emit('curretIndicatorChange',hideSummary)
    },
    tooltipUnit (type) { // 业态排行tooltip显示的单位
      if (Array.isArray(type)) {
        return type.map(o => {
          return this.tooltipUnit(o)
        })
      } else {
        let name = ''
        switch (type) {
          case 'enter':
          case 'occupancy':
            name = '人次'
            break
          case 'SquaerMetre':
            name = '元/m²'
            break
          case 'UnitPrice':
          case 'SaleAmount':
            name = '元'
            break
          case 'CloseRate':
            name = '%'
            break
        }
        return {
          value: type,
          name
        }
      }
    },
    getTrendData: _.debounce(function (params) {
      const { time1, time2, propertyId, indicatorData, bzids } = this
      if(!time1) return
      else this.curretIndicator = ['enter']
      const reqs = Object.keys(indicatorData).map(e => {
        let params = {
          time1,
          time2,
          type: e,
          property_id: propertyId,
          range: this.convertInnerRange,
          bzid: bzids }
        if (['enter', 'occupancy'].includes(e)) {
          return getFootfallTrend(params)
        } else {
          if (this.convertInnerRange === 'Hour') params.range = 'Date' // 销售数据 innerrange 没有Hour
          return getSalesTrend(params)
        }
      })
   
      Promise.all(reqs).then(res => {
        let tml = {}
        Object.keys(indicatorData).forEach((indicatorKey, index) => {
          const { data: { data: indicatorRes } } = res[index]
          let series = Object.keys(indicatorRes).map(date => {
            let eachDateRes = indicatorRes[date]
            let seriesData = Object.values(eachDateRes)
            seriesData = seriesData.map(val => Number(val) < 0 ? 0 : val)
            if (['CloseRate', 'RepeatPurchaseRate'].includes(indicatorKey)) seriesData = seriesData.map(e => NP.times(e, 100))// 复购率和成交率需要乘以100
            seriesData = seriesData.map(val => Number(val) < 0 ? 0 : parseInt(val))
            return {
              name: time2 ? `${indicatorData[indicatorKey].name} ${date.split(',').join(' - ')}` : indicatorData[indicatorKey].name,
              key: `${indicatorKey}_${date}`,
              data: seriesData
            }
          })
          let xAxis = []
          if (time2 && this.innerRange !== '1h') {
            let date1Len = series[0].data.length
            let date2Len = series[1].data.length
            let maxLen = Math.max(date1Len, date2Len)
            xAxis = Array.from({ length: maxLen }, (v, k) => `第${k + 1}${this.innerRange === '1day' ? '天' : '月'}`)
            // 给时间较短的填充 null
            series.forEach(e => {
              if (e.data.length < maxLen) {
                let fillItems = new Array(maxLen - e.data.length)
                fillItems.fill(null)
                e.data = [...e.data, ...fillItems]
              }
            })
            tml[indicatorKey] = { series, xAxis }
          } else {
            let date1Data = indicatorRes[Object.keys(indicatorRes)[0]]
            if (date1Data) {
              let tml = Object.keys(date1Data)
              if (tml[0]) {
                if (tml[0].split(' ').length > 1) {
                  xAxis = tml.map(e => {
                    let splitStr = e.split(' ')
                    return splitStr[1].slice(0, 5)
                  })
                } else xAxis = tml
              }
            }
            if (time2 && this.innerRange === '1h' && indicatorKey === 'enter') {
              series.map(list => {
                list.data = [_.sum(list.data)]
              })
              xAxis = ['第一天']
            }
            tml[indicatorKey] = { series, xAxis }
          }
        })
        _.forIn(tml, (val, key) => {
          val.total = {}
          let series = val.series[0]
          if(series) val.total[`${series.key}`] = _.sum(series.data).toLocaleString() 
        })
        this.chartData = tml
        this.canshow = true
      }).catch(err => {
        console.log(err)
      })
    }, 100),
    refreshChart () {
      if (this.$refs.charts && this.$refs.charts.$children.length) {
        let components = this.$refs.charts.$children[0].$children
        let charts = components.filter(item =>
          item.$options.name === 'TabItem' && item.$attrs.icon !== 'biaoge-copy'
        )
        charts.forEach(e => this.$nextTick(() => {
          e.$children[0].refresh()
        }))
      }
    },
    // 下载exs
    TableChageList (value) { this.tableListData = value.data },
    enterExportBiztop () {
      let time = this.time1.split(',')
      let newTableData = _.cloneDeep(this.tableListData)
      // if (time[0] == time[1]) {
      //   newTableData[1].map(list => {
      //     list.time = time[0] + '  ' + list.time
      //   })
      // }
      downloadEx(exportEx,'购物中心趋势分析',newTableData)
    }
  }

}
</script>
