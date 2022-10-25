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
			<div class="card-box flex-column">
				<Cards class="card"
							 v-for="item in statisticList"
							 :isTime="oParams&&oParams.isDateCompare()"
							 :isUp="item.isUp"
							 :item="item"></Cards>
			</div>
		</div>
		<div class="flex-center l-2 m-t-20">
			<arrival-times-chart ref="arrival"
													 style="width: 45%"
													 class="common-card chart-2"
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
  import { getEffective } from '@/api/analysis'
  import { getEntityFlow } from '@/api/home'

  import moment from 'moment'
  import _ from 'lodash'
  import { formatNumber } from '@/libs/util'
  import FlowSelector from '_c/flow-selector/effective-flow-selector'
  import { config as barConfig } from '@/config/echarts-config/bar-chart'
  import { config as lineConfig } from '@/config/echarts-config/line-chart'
  import { config as pieConfig } from '@/config/echarts-config/pie-chart'

  import { ParamsConstructor } from '@/libs/params-constructor/params.class.js'
  import ArrivalTimesChart from './components/ArrivalTimesChart'

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
              name: '到店次数数据'
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
            name: '到店次数数据'
          }
        ]
      }
    },
    data () {
      return {
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
        toolList: [
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
            name: '有效客流趋势数据'
          }
        ],
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
            name: '平均到访频次趋势数据'
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
        ]

      }
    },
    methods: {
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
      statistics (data) {
        const data1 = data[0].data
        if (data1 && data1.length) {
          this.statisticList[0].total1 = _.sumBy(data1, 'unique_visits')
          this.statisticList[1].total1 = formatNumber(_.sumBy(data1, 'visits') - this.statisticList[0].total1)
          this.statisticList[2].total1 = formatNumber(_.sumBy(data1, 'avgFrequencyVisits') / data1.length)
        }

        const params = this.oParams.getParams()
        if (this.oParams.isDateCompare()) {
          const data2 = data[1].data
          if (data2 && data2.length) {
            this.statisticList[0].total2 = _.sumBy(data2, 'unique_visits')
            this.statisticList[1].total2 = formatNumber(_.sumBy(data2, 'visits') - this.statisticList[0].total2)
            this.statisticList[2].total2 = formatNumber(_.sumBy(data2, 'avgFrequencyVisits') / data2.length)
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
      trendByDate (data, option) {
        let options = {
          ...option,
          series: []
        }
        option.legend.data.forEach((o, i) => {
          options.series.push({
            name: o,
            data: data[i].data.map(m => {
              return m.unique_visits
            })
          })
        })
        this.tendencyOption.lineOptions = this.setLineOption(options)
        this.tendencyOption.barOptions = this.setBarOption(options)
        this.toolClick(this.$refs.tendencyChart.currentChart)
      },
      //有效客流趋势(无对比)
      trendByNone (data) {
        let options = {
          legend: {
            data: [this.$t('全部客流'), this.$t('有效客流')],
						unit:[this.$t('人'),this.$t('人')]
          },
          xAxis: [],
          series: [],
        }
        options.legend.data.forEach((o, i) => {
          options.series.push({
            name: o,
            data: i ? data.map(m => {
              return m.unique_visits
            }) : data.map(m => {
              return m.visits
            })
          })
        })
        data.forEach(o => {
          options.xAxis.push(o.date_time)
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
      freequencyByNone (data) {
        let options = {
          xAxis: [],
          series: [
            {
              name: this.$t('平均到访频次'),
              data: []
            }
          ],
          legend: {
            data: [this.$t('平均到访频次')],
            show: false
          },
        }
        data.forEach(o => {
          options.xAxis.push(o.date_time)
          options.series[0].data.push(o.avgFrequencyVisits)
        })

        this.freequencyOption.lineOptions = this.setLineOption(options)
        this.freequencyOption.barOptions = this.setBarOption(options)
        this.freequencyToolClick(this.$refs.freequencyChart.currentChart)
      },
      //平均到访频次趋势（时间对比）
      freequencyByDate (data, option) {
        let options = {
          ...option,
          series: []
        }
        option.legend.data.forEach((o, i) => {
          options.series.push({
            name: o,
            data: data[i].data.map(m => {
              return m.avgFrequencyVisits
            })
          })
        })
        this.freequencyOption.lineOptions = this.setLineOption(options)
        this.freequencyOption.barOptions = this.setBarOption(options)
        this.freequencyToolClick(this.$refs.freequencyChart.currentChart)
      },
      //到底按次数（时间对比柱状图)
      setArrivalBarOpiton (data, option) {
        data = data.map(o => {
          return o.data.data.arrival_distribution
        })
        let barConfigCopy = _.cloneDeep(barConfig)
        barConfigCopy.legend.data = option.legend
        barConfigCopy.xAxis.data = option.xAxis
        let series = []
        option.legend.forEach((le, index) => {
          const obj = {
            name: le,
            type: 'bar',
            stack: 'total',
            data: data.map(o => {
              return o[index + 1]
            })
          }
          series.push(obj)
        })
        barConfigCopy.series = series
        this.arrivalOption.barOptions = barConfigCopy
        this.arrivalToolClick(this.$refs.arrival.currentChart)

      },
      //到店次数（饼图）
      setPieOption (res) {
        let pieConfigCopy = _.cloneDeep(pieConfig)
        let serierData = [], name = ''
        for (let key in res) {
          if (Number(key) < 5) {
            name = this.$t('fn.times', [this.$t(key)])
          } else {
            name = this.$t(key + '次及以上')
          }
          serierData.push({
            value: res[key],
            name
          })

        }
        const legend = serierData.map(o => {
          return o.name
        })
        pieConfigCopy.legend.data = legend
        pieConfigCopy.legend.left = '70%'
        pieConfigCopy.legend.top = 'middle'
        pieConfigCopy.legend.itemGap = 20
        pieConfigCopy.legend.formatter = function (name) {
          const value = _.find(serierData, o => {
            return o.name === name
          }).value
          return '{a|' + name + '}{b|' + value.toLocaleString() + '}'
        }
        pieConfigCopy.legend.textStyle = {
          rich: {
            a: {
              width: 80
            }
          }
        }
        pieConfigCopy.series[0].radius = ['0%', '70%']
        pieConfigCopy.series[0].center = ['30%', '50%']
        pieConfigCopy.series[0].name = '到店次数'
        pieConfigCopy.series[0].data = serierData
        this.arrivalOption.pieOptions = pieConfigCopy
        this.arrivalToolClick(this.$refs.arrival.currentChart)

      },
      /*
			*@method 查询
			*@param {obj} value 查询控件封装的数据
			*/
      paramsPrepare (value) {
        if (value.entitys.length == 0) {
          this.$alert({ content: '请选择实体' })
          return
        }
        this.oParams = new ParamsConstructor(value)
        const params = this.oParams.getParams()
        params.range = params.range === 'Hour' ? 'Date' : params.range
        if (!this.oParams.isDateCompare()) { // 无对比
          let parmas1 = {
            start_time: value.date1Array[0],
            end_time: value.date1Array[1],
            innerRange: params.range,
            ...this.oParams.getParams()
          }
          let parmas2 = {
            ...this.oParams.getParams(),
            range: this.oParams.getParams().time1,
          }

          getEffective(parmas1).then(res => {
            this.trendByNone(res.data.data || [])
            this.freequencyByNone(res.data.data || [])
            this.statistics([res.data])
          })
          getEntityFlow(parmas2).then(res => {
            res = res.data.data.arrival_distribution
            this.setPieOption(res)
          })

        } else { // 时间对比
          const params1 = {
            bzid: params.bzid,
            start_time: value.date1Array[0],
            end_time: value.date1Array[1],
            innerRange: params.range
          }
          const params2 = {
            bzid: params.bzid,
            start_time: value.date2Array[0],
            end_time: value.date2Array[1],
            innerRange: params.range
          }
          const params3 = {
            range: params.time1,
            bzid: params.bzid
          }
          const params4 = {
            range: params.time2,
            bzid: params.bzid
          }
          //有效客流 & 平均到访频次
          Promise.all([getEffective(params1), getEffective(params2)]).then(res => {
            res = res.map(o => {
              return o.data
            })
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
            this.trendByDate(res, options)
            this.freequencyByDate(res, options)
            //统计
            this.statistics(res)
          })
          //到店次数
          Promise.all([getEntityFlow(params3), getEntityFlow(params4)]).then(res => {
            const arrival = res[0].data.data.arrival_distribution
            let options = {
              xAxis: [this.formatDate(params.time1), this.formatDate(params.time2)],
              legend: []
            }
            for (let key in arrival) {
              if (Number(key) < 5) {
                options.legend.push(this.$t('fn.times', [this.$t(key)]))
              } else {
                options.legend.push(this.$t(key + '次及以上'))
              }
            }
            this.setArrivalBarOpiton(res, options)
          })
        }
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
			.tendency {
				height: 100%;
				width: 77.5%;
				margin-right: 20px;
			}
		}
	}
</style>
