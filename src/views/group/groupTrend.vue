<template>
  <div v-if="canshow">
    <chart-tabs
      ref="charts"
      :xAxis="xAxisObj"
      :series="finnalSeries"
      :extraOptions="extraOptWithYaxis"
      :type="chartTypeList"
      :istotal='showTotal'
      @tableChage='enterTableChage'
      :tooltipUnit="tooltipUnit(curretIndicator)"
      class="bg-white box-card"
      :totalData="totalData"
      id='trendLine'>
      <export-menu slot="export" @onchange="exportBiztop"></export-menu>
      <template>
        <div class="flex justify-between items-center mr-10">
          <span class="whitespace-no-wrap mx-4 text-sm">{{ $t('fx.Data_indicators') }}</span>
          <!-- multiple -->
          <vs-select autocomplete   v-model="curretIndicator" @change="curretIndicatorChange" :max-selected="2" id="chartSelect">
            <vs-select-item
              v-for="(item,index) in filteredSelectList "
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
import salesDict from '@/views/home/components/salesIndicatorDict'
import moment from 'moment'
import NP from 'number-precision'
import exportMenu from '../operation/components/ExportMenu.vue'
import { exportEx } from '@/api/home.js'
import { downloadEx,findKey } from '@/libs/util'
export default {
  name: 'Trend',
  props: {
    innerRange: {
      type: String,
      default: '1h'
    },
    companyId: {
      type: null,
      default: null
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
    }
  },
  components: {
    chartTabs,
    exportMenu,
    indicatorSelector
  },
  data () {
    return {
      showTotal:true,
      canshow: false,
      allData: [],
      currentData: [],
      current: 0,
      curretIndicator: 'enter',
      chartData: {},
      extraOpt: {
        yaxis: []
      },
      isNeedRender: true,
      chartTypeList: ['line', 'bar'],
      tableListData: [],
      selectType: '',
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
      this.refreshChart()
    }
  },
  activated () {
    this.canshow = false
    setTimeout(() => { this.canshow = true })
  },
  computed: {
    totalData () { // 合计数据
      let obj = { time: '合计' };
      if(['enter','SaleAmount'].includes(this.curretIndicator)){
        this.chartData[this.curretIndicator] && this.chartData[this.curretIndicator].series.forEach(o=>{
          if(this.curretIndicator === 'enter'){
            obj[`${o.key}_${this.time1}`] = o.data[1].toLocaleString()
					}else {
            obj[`${o.key}_${this.time1}`] = parseInt(_.sum(Object.values(o.data[0]))).toLocaleString()
					}
				})
			}
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
      return sourceData.filter(e => e.value !== 'occupancy')
      // if (this.innerRange === '1h') {
      //   return sourceData
      // } else {
      //   // this.curretIndicator = _.remove(this.curretIndicator, (val) => { return val != 'occupancy' })
      //   return sourceData.filter(e => e.value !== 'occupancy')
      // }
    },
    filterSeries () {
      // 更据当前选择的指表获得图表需要的数据
      let tml = []
      if (Object.keys(this.chartData).length) {
        // this.curretIndicator.forEach(e => {
        //   tml.push(...this.chartData[e].series)
        // })
        tml.push(...this.chartData[this.curretIndicator].series)
      }
      return tml
    },
    xAxisObj () {
      let len = this.currentData.length
      if (len == 0) {
        return {
          name: '时间',
          data: [],
          key: 'time'
        }
      } else if (len == 1) {
        let data = this.currentData[0].data
        if (data.code == 200) {
          let time = this.time1.split(',')
          let dataValues = Object.values(data.data)
          let obj = {
            name: '时间',
            data: [],
            key: 'time'
          }
          if (this.curretIndicator == 'enter' || this.curretIndicator == 'occupancy') {
            dataValues.map(val => {
              let xlength = Object.keys(Object.values(val)[0])
              xlength.map(list => {
                if (time[0] == time[1]) {
                  obj.data.push(moment(list.split(' - ')[0]).format('HH:mm'))
                } else {
                  obj.data.push(moment(list).format('YYYY-MM-DD'))
                }
              })
            })
            // obj.data = _.uniq(obj.data).sort()
            //恒一广场有跨天数据展示，这里暂时不需要排序
            obj.data = _.uniq(obj.data)
          } else {
            Object.keys(Object.values(dataValues[0])[0]).map(val => obj.data.push(val))
          }
          return obj
        }
      } else if (len == 2) {
        let data = this.currentData[0].data
        if (data.code == 200) {
          let obj = {
            name: '时间',
            data: [],
            key: 'time'
          }
          if (this.curretIndicator == 'enter' || this.curretIndicator == 'occupancy') {
            let dataKeys = Object.keys(data.data)
            dataKeys.map(list => {
              obj.data.push(list)
            })
          } else {
            let dataname = Object.values(data.data)
            Object.keys(dataname[0]).map(val => obj.data.push(val))
          }
          return obj
        }
      }
    },
    allSeriesKeys () {
      // series key，可能由时间,key,id共同组成,利用正则表达式，找到key
      return this.filterSeries.map(e => e.key.match(/[A-Za-z]+/)[0])
    },
    extraOptWithYaxis () {

      if (this.yaxisArr.length) {
        let y = { ...this.extraOpt, ...{ yaxis: this.yaxisArr } }
        let YObj = {}
        YObj.yaxis = []
        if (y.yaxis[3]) {
          YObj.yaxis.push(y.yaxis[0])
          YObj.yaxis.push(y.yaxis[2])
          return YObj
        } else {
          YObj.yaxis.push(y.yaxis[0])
          return YObj
        }
      } else {
        delete this.extraOpt.yaxis
        return this.extraOpt
      }
    },
    yaxisArr () {
      let yAxiss = this.allSeriesKeys.map((e, index) => {
        let tmlYaxis = _.cloneDeep(this.indicatorData[e].yaxis)
        tmlYaxis.seriesName = e
        tmlYaxis.min = 0
        tmlYaxis.title.style = { fontSize: '13px' }
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
      let that = this
      let len = this.currentData.length
      let series = []
      if (len == 0) {
        return series
      } else if (len == 1) {
        let data = this.currentData[0].data
        if (data.code == 200) {
          let time = this.time1.split(',')
          // 判断类型是不是客流量或者集客量
          if (this.curretIndicator === 'enter' || this.curretIndicator === 'occupancy') {
            let dataKeys = Object.keys(data.data)

            dataKeys.map(list => {
              let obj = {}
              obj.name = list+'-'+this.$t(findKey(this.filteredSelectList,'value',this.curretIndicator,'name'))
              obj.key = this.curretIndicator + '_' + list + '_' + that.time1
              obj.data = []
              if (time[0] == time[1]) {
                let dataList = _.cloneDeep(Object.values(data.data[list])[0])
                // 获取相对应的数据
                this.xAxisObj.data.map(val => {
                  var count = 0
                  _.forIn(dataList, function (value, key) {
                    let h = moment(key.split(' - ')[0]).format('HH:mm')
                    if (val == h) {
                      count++
                      Number(val) < 0 ? obj.data.push(0) : obj.data.push(value)
                    }
                  })
                  if (count == 0) obj.data.push(null)
                })
              } else {
                let listValue = Object.values(Object.values(data.data[list])[0])
                listValue.map(val => {
                  Number(val) < 0 ? obj.data.push(0) : obj.data.push(val)
                })
              }
              series.push(obj)
            })
          } else {
            _.forIn(data.data,(value,key)=>{
              let obj = {
                key:`${this.curretIndicator}_${key}_${Object.keys(value)[0]}`,
                name: key+'_'+this.$t(findKey(this.filteredSelectList,'value',this.curretIndicator,'name')),
								data:Object.values(value[Object.keys(value)[0]]).map(val=>{
                  if(this.curretIndicator === 'CloseRate'){
                    return parseInt(val*100)
                  }else {
                    return parseInt(val)
                  }
								})
							};
              series.push(obj)
						})
          }
          return series
        }
      } else if (len == 2) {
        let data = this.currentData[0].data
        if (data.code == 200) {
          that.curretIndicator.map(function (name, index) {
            let obj = {}
            obj.name = that.nameList(name)
            obj.key = name + '_' + that.time1
            obj.data = []
            let presentData = that.currentData[index].data.data
            if (name == 'enter' || name == 'occupancy') {
              let listKey = Object.keys(presentData)
              listKey.map(k => {
                let v = Object.values(presentData[k])[1]
                if (Number(v) < 0) obj.data.push(0)
                else obj.data.push(v)
              })
            } else {
              Object.values(Object.values(presentData)[0]).map(list => {
                obj.data.push(parseInt(_.sum(Object.values(list))))
              })
            }
          })
          return series
        }
      }
    },
    canSelectMulti () {
      if (this.time2) return false
      else return true
    }
  },
  methods: {
    tooltipUnit (type) { // 业态排行tooltip显示的单位
      switch (type) {
        case 'enter':
          return this.$t('人次')
        case 'SquaerMetre':
          return this.$t('元/m²')
        case 'SaleAmount':
          return this.$t('元')
        case 'CloseRate':
          return '%'
        case 'UnitPrice':
          return this.$t('元')
      }
    },
    getTrendData: _.debounce(function (params) {
      const { time1, time2, companyId, indicatorData } = this
      const reqs = Object.keys(indicatorData).map(e => {
        let params = {
          time1,
          time2,
          type: e,
          company_id: companyId,
          range: this.convertInnerRange
        }
        if (['enter', 'occupancy'].includes(e)) {
          return getFootfallTrend(params)
        } else {
          if (this.convertInnerRange === 'Hour') params.range = 'Date' // 销售数据 innerrange 没有Hour
          return getSalesTrend(params)
        }
      })
      Promise.all(reqs).then(res => { // enter occupancy SaleAmount SquaerMetre ClossRate UnitPrice
        let tml = {}
        Object.keys(indicatorData).forEach((indicatorKey, index) => {
          const { data: { data: indicatorRes } } = res[index]
          let series = Object.keys(indicatorRes).map(date => {
            let eachDateRes = indicatorRes[date]
            let seriesData = Object.values(eachDateRes)
            seriesData = seriesData.map(val => Number(val) < 0 ? 0 : val)
            if (['CloseRate', 'RepeatPurchaseRate'].includes(indicatorKey))seriesData = seriesData.map(e => NP.times(e, 100))// 复购率和成交率需要乘以100
            return {
              name: time2 ? `${indicatorData[indicatorKey].name} ${date.split(',').join(' - ')}` : indicatorData[indicatorKey].name,
              key: `${indicatorKey}_${date}`,
              data: seriesData// 不需要小数点 卡片 Mall-914
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
          } else {
            let date1Data = indicatorRes[Object.keys(indicatorRes)[0]]
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
          tml[indicatorKey] = { series, xAxis }
        })
        this.chartData = tml
        this.allData = res
        this.canshow = true
        this.refreshChart()
      }).catch(err => {
        console.log(err)
      })
    }, 100),
    refreshChart () {
      let that = this
      let arr = []
      switch (this.curretIndicator) {
        case 'enter':
          arr.push(that.allData[0])
          break
        case 'occupancy':
          arr.push(that.allData[1])
          break
        case 'SaleAmount':
          arr.push(that.allData[2])
          break
        case 'SquaerMetre':
          arr.push(that.allData[3])
          break
        case 'CloseRate':
          arr.push(that.allData[4])
          break
        case 'UnitPrice':
          arr.push(that.allData[5])
          break
      }
      this.currentData = arr
    },
    nameList (name) {
      let text = ''
      switch (name) {
        case 'enter':
          text = '客流量'
          break
        case 'occupancy':
          text = '集客量'
          break
        case 'SaleAmount':
          text = '销售额'
          break
        case 'SquaerMetre':
          text = '坪效'
          break
        case 'CloseRate':
          text = '成交率'
          break
        case 'UnitPrice':
          text = '客单价'
          break
      }
      return text
    },
    exportBiztop () {
      let time = this.time1.split(',')
      let newTableData = _.cloneDeep(this.tableListData)
      // if (time[0] == time[1]) {
      //   newTableData[1].map(list => {
      //     list.time = time[0] + '  ' + list.time
      //   })
      // }
      downloadEx(exportEx,'集团趋势分析',newTableData)
    },
    enterTableChage (value) {
      this.tableListData = value.data
    },
    curretIndicatorChange(val){//只有客流量和销售额需要显示合计
      if(val!=='enter'&&val!=='SaleAmount'){
        this.showTotal = false
      }else{
        this.showTotal = true
      }
    }
  }

}
</script>
