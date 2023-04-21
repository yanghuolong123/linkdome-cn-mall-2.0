<template>
	<div>
		<flow-selector
			:maxEntity="false"
			ref="flowSelector"
			:multiQuta="enterSelect.length >1"
			@paramsPrepare="paramsPrepare"
		></flow-selector>
		<chart-box
			:weathers1="((enterSelect.length > 1 &&
                  (oParams && oParams.params.entitys.length > 1))||['time'].includes(oParams &&oParams.params.compareType))?[]:weathers1"
			:weathers2="((enterSelect.length > 1 &&
                  (oParams && oParams.params.entitys.length > 1))||['time','not','entity','businessType'].includes(oParams &&oParams.params.compareType))?[]:weathers2"
			chartId="enter"
			:chart="enterChart"
			ref="chartEnter"
			:isDateCompare="oParams && oParams.isDateCompare()"
			:showSummary="true"
			@toolClick="
        (chartName) => {
          handletoolClick(chartName, 'chartEnter');
        }
      "
			class="common-card m-t-20 chart-1"
			:toolList="toolList"
		>
			<div class="flex-center quota">
				<span class="quota-label">{{ $t('fx.Data_indicators') }}</span>
				<Select
					v-model="enterSelect"
					multiple
					:max-tag-count="1"
					@on-change="enterSelectChange"
				>
					<Option
						v-for="item in enterFlowList"
						:value="item.value"
						:key="item.value"
					>{{ $t(item.name) }}
					</Option
					>
				</Select>
				<i-switch
					v-if="
            oParams &&
              !oParams.isDateCompare() &&
              !(
                (oParams && oParams.isSingleDay()) ||
                (enterSelect.length > 1 &&
                  (oParams && oParams.params.entitys.length > 1))
              )
          "
					class="ml-20 switch"
					size="large"
					@on-change="compareTypeChange"
					v-model="isHour"
				>
					<span slot="open">{{ $t('小时') }}</span>
					<span slot="close">{{ $t('fx.day') }}</span>
				</i-switch>
			</div>
		</chart-box>
		<div
			class="common-card m-t-20"
			ref="enterTable"
		>
			<div class="detail-title">{{ $t('fn.detailData', [$t('enter')]) }}</div>
			<Table
				stripe
				height="400"
				:columns="enterTableColumnsTrans"
				:data="enterTable.tableData"
			>
				<template slot-scope="{ row }" slot="entityType">
					<span>{{ getItype(row.entityName) }}</span>
				</template>
			</Table>
		</div>
		<chart-box
			chartId="occu"
			:chart="occuChart"
			:weathers1="weathers1"
			v-show="showOccu"
			@toolClick="
        (chartName) => {
          handletoolClick(chartName, 'chartOccu', ['occupancy']);
        }
      "
			ref="chartOccu"
			class="common-card m-t-20 chart-1"
			:toolList="occuTool"
		></chart-box>
		<div class="common-card m-t-20" ref="occuTable" v-show="showOccu">
			<div class="detail-title">{{ $t('fn.detailData', [$t('集客量')]) }}</div>
			<Table
				stripe
				height="400"
				:columns="occuTableColumnsTrans"
				:data="occuTable.tableData"
			>
				<template slot-scope="{ row }" slot="entityType">
					<span>{{ getItype(row.entityName) }}</span>
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
  import { entityFlow, weatherTrend, entityFlowMin } from '@/api/entityNew'
  import { getMaxIndex, findKey, deepFind } from '@/libs/util'
  import moment from 'moment'
  import { isEmpty } from '../../libs/util'
	import {mapState} from 'vuex'
  export default {
    name: 'entity-analytic',
    components: {
      FlowSelector,
      ChartBox,
    },
    data () {
      return {
        oParams: null,
        isHour: false, //按小时
        enterFlowList: [],
        weathers1: [],
        weathers2: [],
        enterSelect: ['enter'],
        responseData: {}, //接口返回的数据
        enterChart: {
          barChart: null,
          lineChart: null,
        },
        occuChart: {
          barChart: null,
          lineChart: null,
        },
        enterTable: {
          columns: [],
          tableData: [],
        },
        occuTable: {
          columns: [],
          tableData: [],
        },
      }
    },
    computed: {
      ...mapState({
        propertyId: state => state.home.headerAction,
        headerData:state => state.home.headerData,
      }),
			//是否按分钟查询
			isMin(){
        return this.oParams&&this.oParams.isSingleDay()&&this.oParams.params.range !=='Hour'
			},
      toolList () {
        if (!this.oParams || !this.oParams.getBzid()) return config.toolList
        //当选择了多指标，多实体时，不显示折线图
        if (
          this.enterSelect.length > 1 &&
          this.oParams.getBzid().split(',').length > 1
        ) {
          let toolList = _.cloneDeep(config.toolList)
          return toolList.splice(1)
        } else {
          return config.toolList
        }
      },
      occuTool () {
        let tools = _.cloneDeep(config.toolList)
        tools.forEach((o) => {
          o.name = o.name.replace(/客流量/g, '集客量')
        })
        return tools
      },
      //显示集客量图表的条件为：选择了购物中心 并且 是单天的数据
      showOccu () {
        if (!this.oParams) return false
				if(this.isMin) return  false
        return (
          !isEmpty(this.oParams.getSelectedShopId()) &&
          this.oParams.isSingleDay() &&
          this.oParams.params.compareType !== 'businessType'
        )
      },
      // 这里实现对表头内容的翻译
      enterTableColumnsTrans () {
        let newArrey = []
        this.enterTable.columns.forEach((a) => {
          let part = {
            title: this.$t(a.title),
            key: a.key,
            slot: a.slot,
          }
          newArrey.push(part)
        })
        return newArrey
      },
      // 第二个表头内容的翻译
      occuTableColumnsTrans () {
        let newArrey = []
        this.occuTable.columns.forEach((a) => {
          let part = {
            title: this.$t(a.title),
            key: a.key,
            slot: a.slot,
          }
          newArrey.push(part)
        })
        return newArrey
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
            this.$nextTick(() => {
              this.updateLineChart(componentName, quta)
            })
            break
          case 'table':
            this.$nextTick(() => {
              this.updateTable(componentName, quta)
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.updateBarChart(componentName, quta)
            })
            break
        }
      },
      async paramsPrepare (params) {
        if (['time', 'onYear', 'onChain'].includes(params.compareType)) {
          this.isHour = false
        }
        this.oParams = new ParamsConstructor(_.cloneDeep(params), this.isHour)
        if (this.oParams.isSingleDay()) {
          this.isHour = false //单天将开关置为默认
        }
        let reqList = []
        let responseList = [] //用于对应api返回的是哪种类型的数据（出客流，入客流，集客量）
        //默认查询出客流和入客流数据
        this.enterFlowList.forEach((o) => {
          responseList.push(o.value)
          const data = {
            type: o.value,
            ...this.oParams.getParams(),
          }
          if (this.isMin) {
            data.property_id = this.propertyId
            reqList.push(entityFlowMin(data))
          } else {
            reqList.push(entityFlow(data));
          }

        })
        //判断是否需要查询集客量数据
        if (this.showOccu) {
          if (this.isMin){
            reqList.push(
              entityFlowMin({
                type: 'occupancy',
                property_id: this.propertyId,
                ...this.oParams.getParams(true),
              })
						)
					}else {
            reqList.push(
              entityFlow({
                type: 'occupancy',
                ...this.oParams.getParams(true),
              })
            )
					}

          responseList.push('occupancy')
        }
        let type = params.date1Array[0].split('-')[2] === params.date1Array[1].split('-')[2] || this.isHour
        let data = {
          ...this.oParams.getParams(),
          property_id: this.$store.state.home.headerAction,
          type: type ? 1 : 0,
        }
        //自定义时间对比 和 分钟粒度 查询时，不显示天气对比
        this.weathers1 = []
        this.weathers2 = []
        if (!this.isMin && this.oParams.params.compareType !== 'time') {
          await weatherTrend(data).then((weather) => {
            weather = weather.data.data
            if (weather) {
              this.weathers1 = weather[this.oParams.params.date1Array.toString()][0].list
              this.weathers2 = this.oParams.isDateCompare() ? weather[this.oParams.params.date2Array.toString()][0].list : []
            } else {
              this.weathers1 = []
              this.weathers2 = []
            }
            if (this.weathers1.length) {
              if (!this.weathers1[0].hasOwnProperty('type')) {
                this.weathers1 = []
              }
            }
            if (this.weathers2.length) {
              if (!this.weathers2[0].hasOwnProperty('type')) {
                this.weathers2 = []
              }
            }
          })
        }

        Promise.all(reqList)
          .then((res) => {
            responseList.forEach((o, i) => {
              this.responseData[o] = res[i].data.data
            })
            this.updateChart('chartEnter')
              this.enterTable = this.updateTableDetail(this.enterSelect)
            if (this.showOccu) {
              this.updateChart('chartOccu', ['occupancy'])
              this.occuTable = this.updateTableDetail(['occupancy'])
            }
          })
          .catch((err) => {
            this.$Message.error('数据获取失败')
            console.log(err)
          })
      },
      updateLineChart (componentName, quta = this.enterSelect) {
        const lineOpiton = this.getLineOption(quta)
        this.$refs[componentName].initLineChart(lineOpiton)
      },
      updateTable (componentName, quta = this.enterSelect) {
        const lineOpiton = this.getLineOption(quta)
        this.$refs[componentName].initTable(lineOpiton)
      },
      updateBarChart (componentName, quta = this.enterSelect) {
        const data = _.cloneDeep(this.responseData)
        let BarChart, barOpiton
        if (this.oParams.isDateCompare()) {
          BarChart = new BarChartConstructor(
            data,
            this.oParams,
            quta,
            (['businessType', 'time', 'entity'].includes(this.oParams.params.compareType) && quta.length > 1) ? [] : this.weathers1,
            (['businessType', 'time', 'entity'].includes(this.oParams.params.compareType) && quta.length > 1) ? [] : this.weathers2
          )
          barOpiton = BarChart.getDateCompare()
        } else {
          BarChart = new BarChartConstructor(
            data,
            this.oParams,
            quta,
            (['businessType', 'time', 'entity'].includes(this.oParams.params.compareType) && quta.length > 1) ? [] : this.weathers1,
            (['businessType', 'time', 'entity'].includes(this.oParams.params.compareType) && quta.length > 1) ? [] : this.weathers2,
          )
          barOpiton = BarChart.getPostEntitysCompare()
        }
        this.$refs[componentName].initBarChart(barOpiton)
      },
      updateChart (componentName, quta = this.enterSelect) {
        if (!this.oParams) return
        //多指标并且多实体渲染柱状图
        if (
          componentName === 'chartEnter' &&
          this.enterSelect.length > 1 &&
          this.oParams.getBzid().split(',').length > 1
        ) {
          this.updateBarChart(componentName, quta)
        } else {
          this.$nextTick(() => {
            //等子组件渲染完成，数据更新
            switch (this.$refs[componentName].currentChart) {
              case 'line':
                this.updateLineChart(componentName, quta)
                break
              case 'table':
                this.updateTable(componentName, quta)
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
          LineChart = new LineChartConstructor(
            data,
            this.oParams,
            quta,
            (['businessType', 'time', 'entity'].includes(this.oParams.params.compareType) && quta.length > 1) ? [] : this.weathers1,
            (['businessType', 'time', 'entity'].includes(this.oParams.params.compareType) && quta.length > 1) ? [] : this.weathers2
          )
          lineOpiton = LineChart.getDateCompare()
        } else {
          LineChart = new LineChartConstructor(
            data,
            this.oParams,
            quta,
            (['businessType', 'time', 'entity'].includes(this.oParams.params.compareType) && quta.length > 1) ? [] : this.weathers1,
            (['businessType', 'time', 'entity'].includes(this.oParams.params.compareType) && quta.length > 1) ? [] : this.weathers2
          )
          lineOpiton = LineChart.getPostEntitysCompare()
        }
        return lineOpiton
      },
      //更新表格【客流量,集客量详细数据信息】
      updateTableDetail (quta) {
        if (!this.oParams ) {
          return {
            columns: [],
            tableData: [],
          }
        }
      

        const keyName = this.oParams.params.compareType === 'businessType' ? '业态' : '实体'
				let columns = [
          {
            title: `${keyName}名称`,
            key: 'entityName',
          },
          {
            title: `${keyName}类别`,
            slot: 'entityType',
          },
				]
				quta.forEach(o=>{
          const qutaName = findKey(config.dictionary, 'value', o, 'name')
          columns = columns.concat([
            {
              title: `${qutaName}峰值`,
              key: 'highest-'+o,
            },
          ])
				})
      
        if (this.oParams.params.compareType === 'businessType') {
          columns.splice(1, 1)  //删除实体类别
        }
        if (this.oParams.isDateCompare()) {
          columns.splice(2, 0, {
            title: '时间点',
            key: 'time',
          })
        }
        if (!quta.includes('occupancy')) {
          quta.forEach((o,i)=>{
            const qutaName = findKey(config.dictionary, 'value', o, 'name')
            columns.splice((i)-quta.length, 0, {
              title: `累计${qutaName}`,
              key: 'total-'+o,
            })
					})

        }
        let option,tableData = []
        if(quta.length>1&&this.oParams.params.entitys.length>1){
          option = this.getLineOption([quta[0]])
					quta.forEach(o=>{
            option = this.getLineOption([o]);
            tableData = tableData.concat(this.getTableData(quta,option))
					})
        }else {
          option = this.getLineOption(quta)
          tableData = this.getTableData(quta,option)
        }
				
        if(quta.length > 1){
          let arr = []
          tableData.forEach(o=>{
            let entity = arr.find(a=>{
							return a&&a.id === o.id
						})
            if(entity){
						  Object.assign(entity,o)
            }else {
						  arr.push(o)
            }
					})
          tableData = arr
        }
        return {
          columns,
          tableData,
        }
      },
			getTableData(quta,option){
        let tableData = []
        option.legend.data.forEach((d, dIndex) => {
          const data = option.series[dIndex].data
          if (!data.length) return
          const entityName = d.split('|')[0]
          const qutaType = d.split('|')[1] === '入客流'?'enter':'exit'
          const highestIndex = getMaxIndex(data)
          const total = _.sum(data).toLocaleString() + this.$t('人次')
          let time
          if (this.oParams.isDateCompare()) {
            time = d.split('|')[2]
          }
          let highestTime
          if (
            this.oParams.getInnerRange() === 'Hour' ||
            !this.oParams.isDateCompare()
          ) {
            if (this.oParams.getInnerRange() !== 'Hour') {
              highestTime = `${option.xAxis.data[highestIndex]}`
            } else {
              highestTime = `${
                option.xAxis.data[highestIndex]
                } - ${option.xAxis.data[highestIndex] && option.xAxis.data[highestIndex].replace(/00/, '59')}`
            }
          } else {
            highestTime = moment(time.split(' - ')[0])
              .add(highestIndex, 'd')
              .format('YYYY-MM-DD')
          }
          if (quta.includes('occupancy')) {
            let obj = {
              entityName,
              entityType: entityName,
              time,
            }
            obj[`highest-occupancy`] = `${data[highestIndex].toLocaleString()} ${this.$t('人次')} ${highestTime}`;
            tableData.push(obj)
          } else {
            let obj = {
              entityType: entityName,
              entityName,
              time,
              id:`${entityName}-${time}`
            }
            obj[`highest-${qutaType}`] =  `${data[highestIndex].toLocaleString()} ${this.$t('人次')} ${highestTime}`;
            obj[`total-${qutaType}`] = total
            tableData.push(obj)
          }
        })
				return tableData
			},
      getItype (name) {
        const node = deepFind(
          this.$refs.flowSelector.entityCascaderOption,
          (o) => {
            return o.name === name
          },
          'children'
        )
        if (node) {
          return (
            this.$t(findKey(config.entityType, 'value', node.type_name, 'name'))
          )
        } else {
          return ''
        }
      },
    },
    created () {
      this.enterFlowList = config.dictionary.filter((o) => {
        return ['enter', 'exit'].includes(o.value)
      })
    },
  }
</script>
<style scoped lang="less">
	.chart-1 {
		height: 540px;
		
		.quota {
			font-size: 14px;
			margin-right: 50px;
			word-break: keep-all;
			white-space: nowrap;
			
			.quota-label {
				margin-right: 20px;
			}
			
			.switch {
				width: 145px;
				margin-left: 20px;
				
				&.ivu-switch-large.ivu-switch-checked:after {
					left: 50px;
				}
			}
		}
	}
	
	.detail-title {
		font-size: 18px;
		margin-bottom: 20px;
	}
</style>
