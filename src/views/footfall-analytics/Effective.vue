<template>
	<div class="effective">
		<flow-selector ref="selectData" @paramsPrepare="paramsPrepare"></flow-selector>
		<div class="flex-center l-1 m-t-20 chart-1">
			<chart-box :toolList="toolList"
								 ref="tendencyChart"
								 @toolClick="toolClick"
								 chartId="tendencyChart"
								 :chart="tendencyChart"
								 class="common-card  tendency"></chart-box>
			<div class="card-box flex-column" 	 v-if="!isMultiEntity">
				<Cards class="card"

							 v-for="item in statisticList"
							 :isTime="oParams&&oParams.isDateCompare()"
							 :isUp="item.isUp"
							 :item="item"></Cards>

			</div>
			<div class="common-card entity-table" ref="table" v-else>
				<Table
					stripe
					:columns="tableColumn"
					:height="tableHeight"
					:data="tableData"
				></Table>
			</div>

		</div>
		<div class="flex-center l-2 m-t-20">
			<arrival-times-chart ref="arrival"
													 style="width: 45%"
													 class="common-card chart-2"
													 :entities="entities"
													 :activeEntityIndex="activeEntityIndex"
													 @changeEntity="changeEntity"
													 @toolClick="arrivalToolClick"
													 :chart="arrivalChart"
													 :toolList="arrivalToolList"></arrival-times-chart>
			<chart-box :toolList="freequencyToolList"
								 ref="freequencyChart"
								 @toolClick="freequencyToolClick"
								 chartId="freequencyChart"
								 :chart="freequencyChart"
								 style="flex: 1"
								 class="common-card m-l-20 chart-2"></chart-box>
		</div>
	</div>
</template>

<script>
  import ChartBox from '_c/common/Chart-box'
  import Cards from './components/Cards.vue'
  import VueApexCharts from 'vue-apexcharts'
  import { validFlow } from '@/api/analysis'

  import moment from 'moment'
  import _ from 'lodash'
  import { formatNumber } from '@/libs/util'
  import FlowSelector from '_c/flow-selector/effective-flow-selector'
  import { config as barConfig } from '@/config/echarts-config/bar-chart'
  import { config as lineConfig } from '@/config/echarts-config/line-chart'
  import { config as pieConfig } from '@/config/echarts-config/pie-chart'

  import { ParamsConstructor } from '@/libs/params-constructor/params.class.js'
  import ArrivalTimesChart from './components/ArrivalTimesChart'
	import {mapState} from 'vuex'
  export default {
    name: 'Effective',
    components: {
      VueApexCharts,
      Cards,
      FlowSelector,
      ChartBox,
      ArrivalTimesChart
    },
    computed: {
      ...mapState({
        propertyId: state => state.home.headerAction,
      }),
      arrivalToolList () {
        if (this.oParams && this.oParams.isDateCompare()) {
          return [
            {
              icon: '62',
              value: 'bar',
              name: '到店次数'
            }, {
              icon: 'biaoge-copy',
              value: 'table',
              name: '详细数据'
            }, {
              icon: 'daoru',
              value: 'download',
              name: '到店次数'
            }
          ]
        }
        return [
          {
            icon: 'fenxi',
            value: 'pie',
            name: '到店次数'
          }, {
            icon: 'biaoge-copy',
            value: 'table',
            name: '详细数据'
          }, {
            icon: 'daoru',
            value: 'download',
            name: '到店次数'
          }
        ]
      },
			isMultiEntity(){
        return this.oParams && this.oParams.params.entitys.length>1
			},
      toolList(){
        let list = [
            {
              icon: 'zhexiantu',
              value: 'line',
              name: '有效客流趋势'
            }, {
              icon: '62',
              value: 'bar',
              name: '有效客流趋势'
            }, {
              icon: 'biaoge-copy',
              value: 'table',
              name: '详细数据'
            }, {
              icon: 'daoru',
              value: 'download',
              name: '有效客流趋势'
            }
          ]
				if(this.oParams && this.oParams.params.entitys.length>1){
				  return list.splice(1)
				}
				return list
			}
    },
    data () {
      return {
        tableHeight:0,
        arrivalChart: {
          barChart: null,
          pieChart: null,
        },
        arrivalOption: {
          barOptions: null,
          pieOptions: null
        },
        tendencyChart: {
          barChart: null,
          lineChart: null,
        },
        freequencyChart: {
          barChart: null,
          lineChart: null,
        },
        tendencyOption: {
          lineOptions: null,
          barOptions: null
        },
        freequencyOption: {
          lineOptions: null,
          barOptions: null
        },
        oParams: null,

        freequencyToolList: [
          {
            icon: 'zhexiantu',
            value: 'line',
            name: '平均到访频次趋势'
          }, {
            icon: '62',
            value: 'bar',
            name: '平均到访频次趋势'
          }, {
            icon: 'biaoge-copy',
            value: 'table',
            name: '详细数据'
          }, {
            icon: 'daoru',
            value: 'download',
            name: '平均到访频次趋势'
          }
        ],
        statisticList: [
          {
            icon: 'youxiaokeliu1',
            title: '有效客流',
            bg: '#EAE8FD',
            color: '#776AED',
            total1: '',
            total2: '',
          }, {
            icon: 'zhongfu',
            title: '重复客流',
            bg: '#D7F7F5',
            color: '#2BD9CF',
            total1: '',
            total2: '',
          }, {
            icon: 'daofang',
            title: '平均到访次数',
            bg: '#D8F1FB',
            color: '#03A1E9',
            total1: '',
            total2: '',
          },
        ],
        tableColumn:[
					{
					  key:'entity',
						title:'实体',
					},{
            key:'valid',
            title:'有效客流',
            width:100
          },{
            key:'repeat',
            title:'重复客流',
            width:100
          },
				],
        tableData:[],
				reqData:[],
        entities:[],
				activeEntityIndex:0
      }
    },
    methods: {
      changeEntity(index){
        this.activeEntityIndex = index
				this.setPieOption(this.reqData)
			},
      arrivalToolClick (type) {
        switch (type) {
          case 'table':
            let options = this.oParams.isDateCompare() ? this.arrivalOption.barOptions : this.arrivalOption.pieOptions
            this.$nextTick(() => {
              this.$refs.arrival.initTable(options, this.oParams.isDateCompare())
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.$refs.arrival.initBarChart(this.arrivalOption.barOptions)
            })
            break
          case 'pie':
            this.$nextTick(() => {
              this.$refs.arrival.initPieChart(this.arrivalOption.pieOptions)
            })
            break
        }
      },
      toolClick (chartName) {
        switch (chartName) {
          case 'table':
            this.$nextTick(() => {
              this.$refs.tendencyChart.initTable(this.tendencyOption.lineOptions)
            })
            break
          case 'line':
            this.$nextTick(() => {
              this.$refs.tendencyChart.initLineChart(this.tendencyOption.lineOptions)
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.$refs.tendencyChart.initBarChart(this.tendencyOption.barOptions)
            })
            break
        }
      },
      freequencyToolClick (chartName) {
        switch (chartName) {
          case 'table':
            this.$nextTick(() => {
              this.$refs.freequencyChart.initTable(this.freequencyOption.lineOptions)
            })
            break
          case 'line':
            this.$nextTick(() => {
              this.$refs.freequencyChart.initLineChart(this.freequencyOption.lineOptions)
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.$refs.freequencyChart.initBarChart(this.freequencyOption.barOptions)
            })
            break
        }
      },
			//卡片统计
      statistics(data){
        const data1 = data[0].time1.list
        if (data1 && data1.length) {
          this.statisticList[0].total1 = _.sumBy(data1, 'validFlow')
          this.statisticList[1].total1 = formatNumber(_.sumBy(data1, 'flow') - this.statisticList[0].total1)
          this.statisticList[2].total1 = data[0].time1.total_avg_vist
        }

        const params = this.oParams.getParams()
        if (this.oParams.isDateCompare()) {
          const data2 = data[0].time2.list
          if (data2 && data2.length) {
            this.statisticList[0].total2 = _.sumBy(data2, 'validFlow')
            this.statisticList[1].total2 = formatNumber(_.sumBy(data2, 'flow') - this.statisticList[0].total2)
            this.statisticList[2].total2 = formatNumber(_.sumBy(data2, 'avg_vist') / data2.length)
          }
          this.statisticList.forEach(o => {
            this.$set(o, 'time1', this.formatDate(params.time1))
            this.$set(o, 'time2', this.formatDate(params.time2))
            o.isUp = o.total2 > o.total1
            let addPrecent
            if (o.total2 === 0) {
              addPrecent = '-100%'
            } else if (o.total1 === 0) {
              addPrecent = '100%'
            } else if (o.total1 === o.total2) {
              addPrecent = '0%'
            } else {
              addPrecent = o.isUp ? ((Math.round(o.total2 / o.total1 * 100) - 100) + '%') : ((100 - Math.round(o.total2 / o.total1 * 100)) + '%')
            }
            this.$set(o, 'addPrecent', addPrecent)
          })

        }
			},

      //有效客流趋势(时间对比)
      trendByDate(data,option){
        let options = {
          ...option,
          series: []
        }
        data = [data.time1,data.time2]
        option.legend.data.forEach((o, i) => {
          options.series.push({
            name: o,
            data: data[i].list.map(m => {
              return m.validFlow
            })
          })
        })
        this.tendencyOption.lineOptions = this.setLineOption(options)
        this.tendencyOption.barOptions = this.setBarOption(options)
        this.toolClick(this.$refs.tendencyChart.currentChart)
			},


      trendByMultiEntity(data){
        let options = {
          legend: {
            data: [this.$t('全部客流'), this.$t('有效客流')],
            unit:[this.$t('人'),this.$t('人')]
          },
          xAxis: data.map(o=>{
            return o.name
          }),
          series: [],
        }
        options.legend.data.forEach((o, i) => {
          options.series.push({
            name: o,
            data: i ? data.map(m => {
              return m.time1.total_validFlow
            }) : data.map(m => {
              return m.time1.total_flow
            })
          })
        })
        this.tableData = []
				data.forEach(o=>{
				  this.tableData.push({
						entity:o.name,
						valid:o.time1.total_validFlow.toLocaleString(),
            repeat:o.time1.total_repeat.toLocaleString(),
            visit:o.time1.total_avg_vist
					})
				})
        this.tendencyOption.lineOptions = this.setLineOption(options)
        this.tendencyOption.barOptions = this.setBarOption(options)
        this.toolClick(this.$refs.tendencyChart.currentChart)
			},
      //有效客流趋势(无对比)
      trendByNone(data){
        let options = {
          legend: {
            data: [this.$t('全部客流'), this.$t('有效客流')],
            unit:[this.$t('人'),this.$t('人')]
          },
          xAxis: [],
          series: [],
        }
        data = data[0].time1.list;
        options.legend.data.forEach((o, i) => {
          options.series.push({
            name: o,
            data: i ? data.map(m => {
              return m.validFlow
            }) : data.map(m => {
              return m.flow
            })
          })
        })
        data.forEach(o => {
          options.xAxis.push(o.date)
        })
        this.tendencyOption.lineOptions = this.setLineOption(options)
        this.tendencyOption.barOptions = this.setBarOption(options)
        this.toolClick(this.$refs.tendencyChart.currentChart)
			},
      setBarOption (options) {
        let barConfigCopy = _.cloneDeep(barConfig)
        const obj = {
          type: 'bar',
          barGap: '0%',
					barMaxWidth:80,
          itemStyle: {
            normal: {
              //柱形图圆角
              barBorderRadius: [80, 80, 0, 0],
            },
          },
        }
        let copyOption = _.cloneDeep(options)
        copyOption.series.forEach(o => {
          Object.assign(o, obj)
        })
        barConfigCopy.xAxis.data = copyOption.xAxis
        Object.assign(barConfigCopy.legend, copyOption.legend)
        barConfigCopy.series = copyOption.series
        return barConfigCopy
      },
      setLineOption (options) {
        let lineConfigCopy = _.cloneDeep(lineConfig)
        lineConfigCopy.dataZoom = []
        const obj = {
          type: 'line'
        }
        let copyOption = _.cloneDeep(options)
        copyOption.series.forEach(o => {
          Object.assign(o, obj)
        })
        lineConfigCopy.series = copyOption.series
        lineConfigCopy.xAxis.data = copyOption.xAxis
        Object.assign(lineConfigCopy.legend, copyOption.legend)
        return lineConfigCopy
      },

      //平均到访频次趋势（无对比）
      freequencyByNone(data){
        const list = data[0].time1.list
        let options = {
          xAxis: list.map(o=>{return o.date}),
          series: [],
          legend: {
            data: data.map(o=>{return o.name}),
          },
        }
        options.legend.data.forEach((o, i) => {
          options.series.push({
            name: o,
            data: data[i].time1.list.map(m=>{return m.avg_vist})
          })
        })
        this.freequencyOption.lineOptions = this.setLineOption(options)
        this.freequencyOption.barOptions = this.setBarOption(options)
        this.freequencyToolClick(this.$refs.freequencyChart.currentChart)
			},
      //平均到访频次趋势（时间对比）
      freequencyByDate(data,option){
        let options = {
          ...option,
          series: []
        }
        data = [data.time1,data.time2]
        option.legend.data.forEach((o, i) => {
          options.series.push({
            name: o,
            data: data[i].list.map(m => {
              return m.avg_vist
            })
          })
        })
        this.freequencyOption.lineOptions = this.setLineOption(options)
        this.freequencyOption.barOptions = this.setBarOption(options)
        this.freequencyToolClick(this.$refs.freequencyChart.currentChart)
			},
      //到底按次数（时间对比柱状图)
      setArrivalBarOpiton(data){
        const arrival = data[0].time1.list[0].arrival_distribution
        const params = this.oParams.getParams()
        let option = {
          xAxis: [this.formatDate(params.time1), this.formatDate(params.time2)],
          legend: []
        }
        for (let key in arrival) {
          if (Number(key) < 5) {
            option.legend.push(this.$t('fn.times', [this.$t(key)]))
          } else {
            option.legend.push(this.$t(key + '次及以上'))
          }
        }
				data = [data[0].time1.list,data[0].time2.list]
        let barConfigCopy = _.cloneDeep(barConfig)
        barConfigCopy.legend.data = option.legend
        barConfigCopy.xAxis.data = option.xAxis
        let series = []
        option.legend.forEach((le, index) => {
          let time1Data = 0,time2Data=0;
          data[0].forEach(m=>{
            time1Data+=(m.arrival_distribution[index+1]||0)
					})
          data[1].forEach(m=>{
            time2Data+=(m.arrival_distribution[index+1]||0)
					})
          const obj = {
            name: le,
            type: 'bar',
            stack: 'total',
            data: [time1Data,time2Data]
          }
          series.push(obj)
        })
        barConfigCopy.series = series
        this.arrivalOption.barOptions = barConfigCopy
        this.arrivalToolClick(this.$refs.arrival.currentChart)

      },



      //到店次数（饼图）
      setPieOption(res){
        let pieConfigCopy = _.cloneDeep(pieConfig)
				res = res[this.activeEntityIndex].time1.list;
        let serierData = [], name = ''
				for(let i= 0;i<res.length;i++){
          for (let key in res[i].arrival_distribution){
            if(Number(key) < 5){
              name = this.$t('fn.times', [this.$t(key)])
            } else {
              name = this.$t(key + '次及以上')
            }
            let series = serierData.find(o=>{
              return o.name === name
						})
						if(series){
              series.value += res[i].arrival_distribution[key]
						}else {
              serierData.push({
								name,
								value:res[i].arrival_distribution[key]
							})
						}

					}
				}
        const legend = serierData.map(o => {
          return o.name
        })
        pieConfigCopy.legend.data = legend
        pieConfigCopy.legend.left = '70%'
        pieConfigCopy.legend.top = 'middle'
        pieConfigCopy.legend.itemGap = 20
        pieConfigCopy.legend.formatter = (name) =>{
          const value = _.find(serierData, o => {
            return o.name === name
          }).value
          return '{a|' + name + '}{b|' + value.toLocaleString() + '}'
        }
        pieConfigCopy.legend.textStyle = {
          rich: {
            a: {
              width: 100
            }
          }
        }
        pieConfigCopy.series[0].radius = ['0%', '70%']
        pieConfigCopy.series[0].center = ['30%', '50%']
        pieConfigCopy.series[0].name = this.$t('到店次数')
        pieConfigCopy.series[0].data = serierData
        this.arrivalOption.pieOptions = pieConfigCopy
        this.arrivalToolClick(this.$refs.arrival.currentChart)
			},


      /*
			*@method 查询
			*@param {obj} value 查询控件封装的数据
			*/
      paramsPrepare (value) {
        if (!value.entitys.length) {
          this.$alert({ content: '请选择实体' })
          return
        }
				if(['time','onYear','onChain'].includes(value.compareType) && value.entitys.length>1){
          this.$alert({ content: '时间对比不支持多实体查询！' })
          return
				}
        this.activeEntityIndex = 0
        this.entities = value.entitys
        this.oParams = new ParamsConstructor(value)
        const params = this.oParams.getParams()
        params.range = params.range === 'Hour' ? 'Date' : params.range
        validFlow({property_id:this.propertyId,...params}).then(res=>{
					res = res.data.data;
					this.reqData = res;
					//非时间对比
          if (!this.oParams.isDateCompare()){
            //多实体

            if(value.entitys.length > 1){

              this.trendByMultiEntity(res)
						}else {
              this.trendByNone(res)

						}
            this.setPieOption(res)
            this.freequencyByNone(res)

					}else {
            const type = params.range === 'Month' ? 'Month' : 'day'
            const diff1 = moment(value.date1Array[1]).diff(moment(value.date1Array[0]), type)
            const diff2 = moment(value.date2Array[1]).diff(moment(value.date2Array[0]), type)
            let diff = diff1 > diff2 ? diff1 : diff2
            diff++
            diff++
            let options = {
              xAxis: [],
              legend: {
                data: [this.formatDate(params.time1), this.formatDate(params.time2)]
              }
            }
            for (let i = 1; i < diff; i++) {
              options.xAxis.push(params.range === 'Month' ? this.$t('fn.第_月', [i]) : this.$t('fn.第_天', [i]))
            }
     				this.trendByDate(res[0],options)
            this.freequencyByDate(res[0], options)
            //到店次数
            this.setArrivalBarOpiton(res)
					}
          this.statistics(res)
        })
      },
      formatDate (dateStr) {
        if (!dateStr) return ''
        const dateArr = dateStr.split(',')
        if (dateArr.length === 1 || dateArr[0] === dateArr[1]) {
          return dateArr[0]
        } else {
          return `${dateArr[0]}-${dateArr[1]}`
        }
      }
    },
		watch:{
      isMultiEntity:{
        handler(newval){
          if(newval){
            this.$nextTick(()=>{
              this.tableHeight = this.$refs.table.offsetHeight -30
						})
					}
				}
			}
		}
  }
</script>

<style lang="scss" scoped>
	.effective {
		.chart-2 {
			height: 383px;
		}

		.l-1 {
			height: 535px;

			.card-box {
				height: 100%;
				width: 21%;
				justify-content: space-between;

				.card {
					height: 165px;
				}

				.cards {
					box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
					border-radius: 6px;

				}
			}
			.entity-table{
				height: 100%;
				width: 27%;
			}
			.tendency {
				height: 100%;
				flex: 1;
				margin-right: 20px;
			}
		}
	}
</style>
