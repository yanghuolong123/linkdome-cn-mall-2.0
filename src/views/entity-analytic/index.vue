<template>
	<div>
		<flow-selector :maxEntity="false" ref="flowSelector" @paramsPrepare="paramsPrepare"></flow-selector>
		<chart-box chartId="enter" :chart="enterChart" ref="chartEnter"
				   :isDateCompare="oParams&&oParams.isDateCompare()"
				   :showSummary="true"
				   @toolClick="(chartName)=>{handletoolClick(chartName,'chartEnter')}"
				   class="common-card m-t-20 chart-1"
				   :toolList="toolList">
			<div class="flex-center quota">
				<span>数据指标：</span>
				<Select v-model="enterSelect" multiple :max-tag-count="1" @on-change="enterSelectChange">
					<Option v-for="item in enterFlowList" :value="item.value" :key="item.value">{{ item.name }}</Option>
				</Select>
				<i-switch
						:disabled="(oParams && oParams.isSingleDay())||(enterSelect.length>1&&(oParams&&oParams.params.entitys.length>1))"
						v-if="oParams && !oParams.isDateCompare()"
						class="ml-20"
						size="large"
						@on-change="compareTypeChange" v-model="isHour">
					<span slot="open">小时</span>
					<span slot="close">默认</span>
				</i-switch>
			</div>
		</chart-box>
		<div class="common-card m-t-20" ref="enterTable" v-show="enterSelect.length === 1">
			<div class="detail-title">客流量详细数据信息</div>
			<Table stripe height="400" :columns="enterTable.columns" :data="enterTable.tableData">
				<template slot-scope="{row}" slot="entityType">
					<span>{{getItype(row.entityName)}}</span>
				</template>
			</Table>
		</div>
		<chart-box chartId="occu" :chart="occuChart" v-show="showOccu"
				   @toolClick="(chartName)=>{handletoolClick(chartName,'chartOccu',['occupancy'])}"
				   ref="chartOccu" class="common-card m-t-20 chart-1"
				   :toolList="occuTool"></chart-box>
		<div class="common-card m-t-20" ref="occuTable" v-show="showOccu">
			<div class="detail-title">集客量详细数据信息</div>
			<Table stripe height="400" :columns="occuTable.columns" :data="occuTable.tableData">
				<template slot-scope="{row}" slot="entityType">
					<span>{{getItype(row.entityName)}}</span>
				</template>
			</Table>
		</div>
	</div>
</template>
<script>
  import FlowSelector from '_c/flow-selector/entity-flow-selector'
  import ChartBox from '_c/common/Chart-box'
  import { ParamsConstructor } from '@/libs/params-constructor/params.class.js'
  import { LineChartConstructor } from '@/libs/echart-constructor/line.class.js'
  import { BarChartConstructor } from '@/libs/echart-constructor/bar.class.js'
  import config from '@/config/index'
  import { entityFlow } from '@/api/entityNew'
  import { getMaxIndex, findKey, deepFind } from '@/libs/util'
  import moment from 'moment'
	import {isEmpty} from '../../libs/util'

  export default {
    name: 'entity-analytic',
    components: {
      FlowSelector,
      ChartBox
    },
    data () {
      return {
        oParams: null,
        isHour: false,//按小时
        enterFlowList: [],
        enterSelect: ['enter'],
        responseData: {},//接口返回的数据
        enterChart: {
          barChart: null,
          lineChart: null
        },
        occuChart: {
          barChart: null,
          lineChart: null
        },
        enterTable: {
          columns: [],
          tableData: []
        },
        occuTable: {
          columns: [],
          tableData: []
        }
      }
    },
    computed: {
      toolList () {
        if (!this.oParams || !this.oParams.getBzid()) return config.toolList
        //当选择了多指标，多实体时，不显示折线图
        if (this.enterSelect.length > 1 && this.oParams.getBzid().split(',').length > 1) {
          let toolList = _.cloneDeep(config.toolList)
          return toolList.splice(1)
        } else {
          return config.toolList
        }
      },
      occuTool () {
        let tools = _.cloneDeep(config.toolList)
        tools.forEach(o => {
          o.name = o.name.replace(/客流量/g, '集客量')
        })
        return tools
      },
      //显示集客量图表的条件为：选择了购物中心 并且 是单天的数据
      showOccu () {
        if (!this.oParams) return false
        return !isEmpty(this.oParams.getSelectedShopId()) && this.oParams.isSingleDay()&&this.oParams.params.compareType!=="businessType"
      },
    },
    methods: {
      //按小时开关
      compareTypeChange (val) {
        this.$refs.flowSelector.handleClick()
      },
      enterSelectChange (val) {
        if (!val.length) {
          this.enterSelect = ['enter']
        }
        this.updateChart('chartEnter')
        this.enterTable = this.updateTableDetail(this.enterSelect)
      },
      handletoolClick (chartName, componentName, quta = this.enterSelect) {
        switch (chartName) {
          case 'line':
          case 'table':
            this.$nextTick(() => {
              this.updateLineChart(componentName, quta)
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.updateBarChart(componentName, quta)
            })
            break
        }
      },
      paramsPrepare (params) {
        if(['time', 'onYear', 'onChain'].includes(params.compareType)){
          this.isHour = false
		}
        this.oParams = new ParamsConstructor(_.cloneDeep(params), this.isHour)
        if (this.oParams.isSingleDay()) {
          this.isHour = false//单天将开关置为默认
        }
        let reqList = []
        let responseList = []//用于对应api返回的是哪种类型的数据（出客流，入客流，集客量）
        //默认查询出客流和入客流数据
        this.enterFlowList.forEach(o => {
          responseList.push(o.value)
          const data = {
            type: o.value,
            ...this.oParams.getParams()
          }
          reqList.push(entityFlow(data))

        })
        //判断是否需要查询集客量数据
        if (this.showOccu) {
          reqList.push(entityFlow({
            type: 'occupancy',
            ...this.oParams.getParams(true)
          }))
          responseList.push('occupancy')
        }
        Promise.all(reqList).then(res => {
          responseList.forEach((o, i) => {
            this.responseData[o] = res[i].data.data
          })
          this.updateChart('chartEnter')
          if (this.enterSelect.length < 2) {
            this.enterTable = this.updateTableDetail(this.enterSelect)
          }
          if (this.showOccu) {
            this.updateChart('chartOccu', ['occupancy'])
            this.occuTable = this.updateTableDetail(['occupancy'])
          }
        }).catch(err => {
          this.$Message.error('数据获取失败')
          console.log(err)
        })

      },
      updateLineChart (componentName, quta = this.enterSelect) {
        const lineOpiton = this.getLineOption(quta)
        this.$refs[componentName].initLineChart(lineOpiton)
      },
      updateBarChart (componentName, quta = this.enterSelect) {
        const data = _.cloneDeep(this.responseData)
        let BarChart, barOpiton
        if (this.oParams.isDateCompare()) {
          BarChart = new BarChartConstructor(data, this.oParams, quta)
          barOpiton = BarChart.getDateCompare()
        } else {
          BarChart = new BarChartConstructor(data, this.oParams, quta)
          barOpiton = BarChart.getPostEntitysCompare()
        }
        this.$refs[componentName].initBarChart(barOpiton)
      },
      updateChart (componentName, quta = this.enterSelect) {
        if (!this.oParams) return
        //多指标并且多实体渲染柱状图
        if (componentName === 'chartEnter' && this.enterSelect.length > 1 && this.oParams.getBzid().split(',').length > 1) {
          this.updateBarChart(componentName, quta)
        } else {
          this.$nextTick(() => {//等子组件渲染完成，数据更新
            switch (this.$refs[componentName].currentChart) {
              case 'line':
              case 'table':
                this.updateLineChart(componentName, quta)
                break
              case 'bar':
                this.updateBarChart(componentName, quta)
                break
            }

          })

        }

      },
      getLineOption (quta = this.enterSelect) {
        const data = _.cloneDeep(this.responseData)
        let LineChart, lineOpiton
        if (this.oParams.isDateCompare()) {
          LineChart = new LineChartConstructor(data, this.oParams, quta)
          lineOpiton = LineChart.getDateCompare()
        } else {
          LineChart = new LineChartConstructor(data, this.oParams, quta)
          lineOpiton = LineChart.getPostEntitysCompare()
        }
        return lineOpiton
      },
      //更新表格【客流量,集客量详细数据信息】
      updateTableDetail (quta) {
        if (!this.oParams || quta.length > 1) {
          return {
            columns: [],
            tableData: []
          }
        }
        let tableData = []
        const option = this.getLineOption(quta)
        const qutaName = findKey(config.dictionary, 'value', quta[0], 'name')
        const keyName = this.oParams.params.compareType === 'businessType' ? '业态' : '实体'
        let columns = [{
          title: `${keyName}名称`,
          key: 'entityName'
        }, {
          title: `${keyName}类别`,
          slot: 'entityType'
        }, {
          title: `${qutaName}峰值`,
          key: 'highest'
        }]
        if (this.oParams.params.compareType === 'businessType') {
          columns.splice(1, 1)
        }
        if (this.oParams.isDateCompare()) {
          columns.splice(2, 0, {
            title: '时间点',
            key: 'time'
          })
        }
        columns.splice(-1, 0, {
          title: `累计${qutaName}`,
          key: 'total'
        })
        option.legend.data.forEach((d, dIndex) => {
          const data = option.series[dIndex].data
					if(!data.length) return;
          const entityName = d.split('|')[0]
          const highestIndex = getMaxIndex(data)
          const total = _.sum(data).toLocaleString() + '人次'
          let time
          if (this.oParams.isDateCompare()) {
            time = d.split('|')[2]
          }
          let highestTime
          if (this.oParams.getInnerRange() === 'Hour' || !this.oParams.isDateCompare()) {
            if (this.oParams.getInnerRange() !== 'Hour') {
              highestTime = `${option.xAxis.data[highestIndex]}`
            } else {
              highestTime = `${option.xAxis.data[highestIndex]} - ${option.xAxis.data[highestIndex].replace(/00/, '59')}`
            }
          } else {
            highestTime = moment(time.split(' - ')[0]).add(highestIndex, 'd').format('YYYY-MM-DD')
          }
          tableData.push({
            entityName,
            entityType: entityName,
            highest: `${data[highestIndex].toLocaleString()}人次 ${highestTime}`,
            total,
            time
          })
        })
        return {
          columns,
          tableData
        }
      },
      getItype (name) {
        const node = deepFind(this.$refs.flowSelector.entityCascaderOption, o => {
          return o.name === name
        }, 'children')
        if (node) {
          return findKey(config.dictionary, 'value', node.itype, 'name') || '购物中心'
        } else {
          return ''
        }
      }
    },
    created () {
      this.enterFlowList = config.dictionary.filter(o => {
        return ['enter', 'exit'].includes(o.value)
      })
    }
  }
</script>
<style scoped lang="less">
	.chart-1 {
		height: 540px;
		
		.quota {
			font-size: 14px;
			margin-right: 50px;
			width: 360px;
			word-break: keep-all;
			
			.ml-20 {
				width: 100px;
				margin-left: 20px;
			}
		}
	}
	
	.detail-title {
		font-size: 18px;
		margin-bottom: 20px;
	}
</style>
