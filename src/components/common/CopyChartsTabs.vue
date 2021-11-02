<template>
	<i-tabs
			v-model="current"
			ref="chartsTabs"
			v-if="isTypeChange"
	>
		<slot slot="select"></slot>
		<slot slot="export" name="export"></slot>
		<tab-item
				:icon="getIcon(item==='salesPie'?'pie':item)"
				:titles="title"
				v-for="(item,index) in type"
				:key="index"
				class="chart-tab-box"
				:class="{times:item==='radialBar'}"
		>
			<div :style="item==='bar'?'':'margin-top:20px;'" class="graphStyle">
				<vue-apex-charts
						:type="item==='salesPie'?'pie':item"
						:width="chartWidth"
						:height="chartHeight(item)"
						:options="getOpt(item)"
						:series=" (item=== 'radialBar' ? radiabarSeries : cloneSeries())　|| []"
            :class="{showOverFlow: isOver}"
				>
				</vue-apex-charts>
			</div>
			<custom-legend :data="lengendData" v-if="lengendData.length" :unit="$t(unit)"></custom-legend>
			<div class="noDataStyle" v-if="isNoData" :class="'noDataStyle'+item"></div>
		</tab-item>
		<tab-item icon="biaoge-copy" :titles="tableTitle" id="table-item">
			<i-table :columns="columns" :data="tableData"></i-table>
		</tab-item>
	</i-tabs>
</template>
<script>
import iTabs from '_c/I-Tabs/Itabs.vue'
import tabItem from '_c/I-Tabs/TabItem.vue'
import exportMenu from '@/views/operation/components/ExportMenu.vue'

import VueApexCharts from 'vue-apexcharts'
import iTable from '@/views/footfall-analytics/components/iTable.vue'
import opt from '@/views/home/components/apexChartoption.js'
import _ from 'lodash'
import customLegend from '@/views/home/components/legend.vue'
import { isArray } from 'highcharts'
export default {
  name: 'copyChartsTabs',
  components: {
    iTabs,
    tabItem,
    VueApexCharts,
    iTable,
    customLegend,
    exportMenu
  },
  props: {
    tooltipUnit: {
      type: String || Array,
      default: () => {
        return ''
      }
    },
    totalData: {// 合计数据（传入）
      type: Object,
      default: () => ({})
    },
    xAxis: {
      type: Object,
      default: () => ({})// {key:xx,name:xx,data:[]} 其中name 是作为表格第一列的名称，其他列从series中取
    },
    labels: {
      type: Object,
      default: () => ({})
    },
    series: {
      type: Array, // chart series [{key:xx,name:xx,data:[]}]
      default: () => []
    },
    type: {
      type: Array,
      default: () => ['line', 'bar']
    },
    title: {
      type: String, // tab 名称
      default: '客流量趋势'
    },
    extraOptions: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: Number,
      default: 400
    },
    isEntityAnalytics: {
      type: Boolean,
      default: false
    },
    isHome: {
      type: Boolean,
      default: false
    },
    istotal: {
      type: Boolean,
      default: false
    },
    chartWidth: {
      default: '99%'
    },
    unit: {
      type: String,
      default: '人'
    },
    tableTitle: {
      type: String,
      default: '详细数据'
    },
    typeParameter: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      current: 0,
      isTypeChange: true,
      iconCheck: {
        bar: '62',
        line: 'zhexiantu',
        pie: 'fenxi',
        donut: 'fenxi',
        radialBar: 'fenxi',
        radar: 'fenxi'
      },
      isNoData: false
    }
  },
  computed: {
    xaxisOrlabels () {
      return _.merge(this.xAxis, this.labels)
    },
    isOver () {
      return _.isNumber(this.chartWidth)
    },
    megerSeries () {
      if (typeof (this.series[0]) === 'object') {
        // 柱状图，线图
        return [this.xaxisOrlabels, ...this.series]
      } else {
        // 饼图系列
        if (this.type[0] === 'salesPie') {
          let newObj = { name: '', key: this.typeParameter, data: this.series }
          if (this.typeParameter === 'SaleAmount') {
            newObj.name = '销售额'
          } else if (this.typeParameter === 'SquaerMetre') {
            newObj.name = '坪效'
          } else if (this.typeParameter === 'CloseRate') {
            newObj.name = '成交率'
          } else if (this.typeParameter === 'UnitPrice') {
            newObj.name = '客单价'
          }
          return [this.xaxisOrlabels, ...[newObj]]
        } else { return [this.xaxisOrlabels, ...[{ name: '客流量', key: 'enter', data: this.series }]] }
      }
    },
    columns () {
      let column = this.megerSeries.map((e,index) =>{
        if(index!==0){
          if(Array.isArray(this.tooltipUnit)){
           return { title: e.name+' ( '+ this.tooltipUnit[index-1].name +' ) ', key: e.key }
          }else{
            if(this.tooltipUnit){
               return { title: this.$t(e.name)+' ( '+ this.tooltipUnit +' ) ', key: e.key }
            }else{
               return { title: this.$t(e.name), key: e.key }
            }
           
          }
        }else{
          return { title: this.$t(e.name), key: e.key }
        }
      })
      this.$emit('getShopTableCoumn', column)
      return column
    },
    tableData () {
      if (!this.xaxisOrlabels.data) return []
      let tableList = this.xaxisOrlabels.data.map((e, index) => {
        let tml = {}
        this.columns.forEach((c, cindex) => {
          let itemData = this.megerSeries[cindex].data[index]
          if (typeof (itemData) === 'string') {
            if (itemData.indexOf(':00') > -1) {
              var itemDatas = _.cloneDeep(itemData)
              let hours = itemDatas.replace(':00', '')
              hours = Number(hours)
              itemData = itemData + ' - ' + hours + ':59'
            }
          }
          try {
            if (this.megerSeries[cindex].key) {
              if (!_.isNumber(this.megerSeries[cindex].key)){
                if (this.megerSeries[cindex].key.match(/[A-Za-z]+/)) {
                  if ([ 'RepeatPurchaseRate'].includes(this.megerSeries[cindex].key.match(/[A-Za-z]+/)[0])) {
                    itemData = `${parseInt(itemData)}%`
                  }
                }
              }
              
            }
          } catch (error) { // 客流分析中到店次数在上面的正则当中会出错
            console.log(error)
          }
          tml[c.key] = itemData
        })
        return tml
      })
      let total = {}
      if (tableList[0] && this.istotal && !Object.keys(this.totalData).length) {
        let keys = Object.keys(tableList[0])
        keys.map((val, index) => {
          if (index === 0) total[keys[0]] = '合计'
          else {
            const name = keys[index].split('_')[0]
            const name2 = keys[index].split('_')[1]
            let totalNum = 0
            if (name === 'enter' || name === 'exit') {
              tableList.map(list => {
                totalNum += Object.values(list)[index]
              })
              total[keys[index]] = totalNum.toLocaleString()
            } else if (name2 === 'enter' || name2 === 'exit') {
              tableList.map(list => {
                totalNum += Object.values(list)[index]
              })
              total[keys[index]] = _.isNaN(totalNum) ? '' : totalNum.toLocaleString()
            } else total[keys[index]] = ''
          }
        })
      }
      // 给表格数据加单位
      tableList.forEach(o => {
        _.forIn(o, (val, key) => {
          if (!Array.isArray(this.tooltipUnit) && typeof val === 'number') {
            o[key] = val.toLocaleString()
          }
          // 首页购物中心趋势分析 数据指标是多选 tooltipUnit会传入多个
          if (Array.isArray(this.tooltipUnit)) {
            if (typeof val === 'number') {
              const unitKey = key.split('_')[0]
              const tooltipUnit = this.tooltipUnit.find(o => {
                return o.value === unitKey
              })
              if (tooltipUnit) {
                o[key] = val.toLocaleString()
              }
            }
          }
        })
      })
      if (this.istotal) { // 有传入的合计数据，就显示传入的
        if (Object.keys(this.totalData).length) {
          tableList.push(this.totalData)
        } else {
          tableList.push(total)
        }
      }
      this.$emit('getShopTableData', tableList)
      var data = {
        type: this.title,
        data: [this.columns, tableList]
      }
      this.$emit('tableChage', data)
      return tableList
    },
    radiabarSeries () {
      if (this.series.length) {
        const sumSeries = _.sum(this.series)
        return this.series.map(e => sumSeries ? _.round((e / sumSeries) * 100, 1) : 0)
      } else return []
    },
    lengendData () {
      if (this.labels.data && this.labels.icons) {
        return this.labels.data.map((e, index) => ({
          title: e,
          icon: this.labels.icons[index],
          value: this.series[index],
          color: this.type[0]?opt[this.type[0]].colors[index]:''
        }))
      } else return []
    }

  },
  watch: {
    type: {
      handler (val, oldVal) {
        this.$nextTick(() => {
          // this.$refs.chartsTabs.updateNav()// 手动更新icon,弃用改用下面的方法，有些时候chart 会出现莫名奇妙的问题
          this.isTypeChange = false
          this.$nextTick(() => { this.isTypeChange = true })
        })
      }
    },
    current () {
      this.$emit('tableSwitchover', this.current)
    }
  },
  methods: {
    
    getOpt (type) {
      let tmlOptions = this.labels.data ? { ...opt[type], ...{ labels: this.labels.data } } :
		  {
		  ...opt[type],
		  ...{
		    xaxis: {
		      categories: this.xAxis.data,
          labels: {
            formatter (value) {
              if (typeof (value) === 'number') {
                return value ? _.round(value, 0).toLocaleString() : ''
              } else {
                return value
              }
            },
            show: type==='line'?this.xAxis.data &&this.xAxis.data.length>1:true
          }
			  },
		  },
		  ...{ markers: { size: 5, hover: { sizeOffset: 2 } } }
		  }
      if (tmlOptions.tooltip) {
        let unit = this.tooltipUnit
        // 首页购物中心趋势分析会传入多个tooltipUnit
        tmlOptions.tooltip.y.formatter = (val, p) => {
          if (Array.isArray(this.tooltipUnit)) unit = this.tooltipUnit[p.seriesIndex].name
          if(val===0) return 0 + unit
          if (val == undefined || val == null || val == '')  return ''
          if (typeof val === 'number') {
            return val.toLocaleString() + unit
          } else {
            return val + unit
          }
        }
      }

      let cloneOpt = _.cloneDeep(tmlOptions)
      let dataArr = []
      this.series.forEach(t => {
        dataArr = dataArr.concat(t.data)
      })
      // 处理当数据过小时，y轴刻度会重复的问题
      if (cloneOpt.yaxis) {
        if (Math.max(...dataArr) < 5) {
          cloneOpt.yaxis.tickAmount = 2
        }
        if (Math.max(...dataArr) < 3) {
          cloneOpt.yaxis.tickAmount = 1
        }
      }
      if (type === 'bar') { // 柱状图需要特殊处
        const categoriesLen = this.xAxis.data ? this.xAxis.data.length : 6
        let barOpt = {
          yaxis: {
            labels: {
              align:'center',
            }
          },
          plotOptions: {
            bar: {
              columnWidth: categoriesLen < 5 ? categoriesLen < 3 ? '10%' : '20%' : '70%',
              dataLabels: {
                position: 'center',
                maxItems: 100,
                hideOverflowingLabels: true
              }
            }
          }
        }

        if (this.extraOptions && this.extraOptions.plotOptions && this.extraOptions.plotOptions.bar.horizontal) {
          barOpt.plotOptions.bar.barHeight = categoriesLen < 5 ? '30%' : '70%'
        }
        var optionsData = _.merge(cloneOpt, _.merge( this.extraOptions,barOpt))
        var newX = []
        if (optionsData.xaxis.categories) {
          optionsData.xaxis.categories.forEach(function (list, index) {
            if (index < 10) newX.push(list)
          })
        }
        if (this.isHome) optionsData.xaxis.categories = newX
        if(!optionsData.labels){
          if(optionsData.xaxis.categories&&optionsData.xaxis.categories.length===0){
            optionsData.yaxis.labels.show = false
          }else{
            optionsData.yaxis.labels.show = true
          }
        }
        return optionsData
      } else {
        var optionsData = _.merge(cloneOpt, this.extraOptions)
        return optionsData
      }
    },
    getIcon (type) {
      return this.iconCheck[type]
    },
    cloneSeries () {
      let tml = _.cloneDeep(this.series)
      let newData = []
      if (tml.length == 0) return false
      if (tml[0].data) {
        tml[0].data.forEach(function (list, index) {
          if (index < 10) newData.push(list)
        })
        if (this.isHome) tml[0].data = newData // 首页 排行前十
      }

      let sumSize = _.sum(tml)
      if (sumSize == 0) { this.isNoData = true } else { this.isNoData = false }
      return tml// 因为apexchart 点击图例会影响到外部的数据，需要在外部克隆一份,新版本已修复，可以不克隆
    },
    chartHeight (type) {
      if (this.lengendData.length) {
        return 250
      } else {
        if (type === 'radar') return 290
        else return 420
      }
    }
  }
}
</script>
<style lang="less" scoped>
.showOverFlow{
overflow-x: auto;overflow-y: hidden;
}
	.times {
		top: 70px;
	}
	.noDataStyle {
		position: absolute;
		z-index: 20;
	}
	.noDataStyledonut {
		width: 226px !important;
		height: 226px;
		left: 28%;
		top: 5%;
		margin-left: -100px;
		background-color: rgba(235, 235, 235, 0.85);
		border-radius: 50%;
		margin-top:20px;
	}
	.noDataStylepie {
		width: 226px !important;
		height: 226px !important;
		top: 5%;
		left: 15%;
		background-color: rgba(235, 235, 235, 0.85);
		border-radius: 50%;
		margin-top:20px;
	}
	.chart-tab-box .graphStyle{
    width :100%;
	}
</style>
<style lang="stylus" scoped>
	.chart-tab-box
		display flex
		justify-content space-between
		align-items center
		flex-direction column
			grid-column-end span 2
		>div:nth-child(1)
			// min-height 280px!important
			flex 1
			width 100%
		>div:nth-child(2)
			flex 1
			width 80%
	.tooltipss
		position relative
		left -128px
		top -38px
	.entityTips
		left -61px
		top -38px
</style>
