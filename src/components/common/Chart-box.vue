<template>
	<div class="chart-box flex-column">
		<div class="flex-between chart-title">
			<span>{{ $t(toolList[tool] && toolList[tool].name) }}</span>
			<div class="flex-center">
				<slot></slot>
				<span
					class="icon"
					@click="changeTab(item,index)"
					v-for="(item, index) in toolList"
					:key="index"
				>
          <icons
						class="pointer"
						:type="item.icon"
						:color="tool === index ? '#37b5ed' : '#9D9D9DFF'"
						:size="20"
					></icons>
        </span>
			</div>
		</div>
		<div class="chart">
			<div
				class="line-chart"
				:id="`line-chart-${chartId}`"
				v-show="currentChart === 'line'"
			></div>
			<div
				class="bar-chart"
				:id="`bar-chart-${chartId}`"
				v-show="currentChart === 'bar'"
			></div>
			<div class="table" ref="table" v-show="currentChart === 'table'">
				<Table
					stripe
					:height="tableHeight"
					:columns="tableColumn"
					:data="tableData"
				></Table>
			</div>
		</div>
	</div>
</template>
<script>
  import { isEmpty, downloadEx } from '@/libs/util'
  import { exportEx } from '@/api/home.js'

  export default {
    name: 'ChartBox',
    props: {
      weathers1: {
        type: Array,
        default: () => [],
      },
      weathers2: {
        type: Array,
        default: () => [],
      },
      toolList: {
        type: Array,
        default: [],
      },
      horizontal: {
        type: Boolean,
        default: false,
      },
      showSummary: {
        type: Boolean,
        default: false,
      },
      chart: {
        type: Object,
        default: () => {
          return {
            barChart: null,
            lineChart: null,
          }
        },
      },
      chartId: {
        type: String,
        default: '',
      },
      isDateCompare: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      currentChart () {
        if (this.toolList[this.tool].value === 'table') {
          this.$nextTick(() => {
            this.tableHeight = this.$refs.table.offsetHeight - 20
          })
        }
        return this.toolList[this.tool].value
      },
    },
    data () {
      return {
        tool: 0,
        tableHeight: 0,
        tableData: [],
        tableColumn: [],
        chartOption: null,
      }
    },
    methods: {
      getTableData (option) {
        console.log(option)
        if (isEmpty(option)) return []
				let optionCopy = _.cloneDeep(option)
        let axle = this.horizontal ? 'yAxis' : 'xAxis'
        let data = []
        if (this.showSummary) {
          optionCopy[axle].data.push(this.$t('合计'))
        }
        let sum = []
        optionCopy[axle].data.forEach((o, i) => {
          data.push({
            time: o,
          })
          const flag = isEmpty(sum)
          optionCopy.series.forEach((s, sI) => {
            if (this.showSummary && flag) {
              sum.push(_.sum(s.data))
            }
            if (this.showSummary) {
              if (i !== optionCopy[axle].data.length - 1) {
                data[i][`entity${sI}`] = isEmpty(s.data[i])
                  ? '-'
                  : s.data[i].toLocaleString()
              } else {
                //最后一个是合计
                data[i][`entity${sI}`] = sum[sI].toLocaleString()
              }
            } else {
              data[i][`entity${sI}`] = isEmpty(s.data[i])
                ? '-'
                : s.data[i].toLocaleString()
              // + '人次'
            }
            if (this.weathers1.length && this.weathers2.length) {
              let w1 = this.weathers1[i]
              if (w1 && w1.id) {
                if (w1.type) {
                  data[i]['temperature1'] =
                    w1.temperature + '℃' + ' ' + w1.condition
                } else {
                  data[i]['temperature1'] =
                    w1.low_temperature +
                    '℃' +
                    '-' +
                    w1.high_temperature +
                    '℃' +
                    ' ' +
                    w1.condition
                }
              } else {
                data[i]['temperature1'] = '-'
              }

              let w2 = this.weathers2[i]
              if (w2 && w2.id) {
                if (w2.type) {
                  data[i]['temperature2'] =
                    w2.temperature + '℃' + ' ' + w2.condition
                } else {
                  data[i]['temperature2'] =
                    w2.low_temperature +
                    '℃' +
                    '-' +
                    w2.high_temperature +
                    '℃' +
                    ' ' +
                    w2.condition
                }
              } else {
                data[i]['temperature2'] = '-'
              }

            } else if (this.weathers1.length) {
              let w = this.weathers1[i]
              if (w && w.id) {
                if (w.type) {
                  data[i]['temperature'] =
                    w.temperature + '℃' + ' ' + w.condition
                } else {
                  data[i]['temperature'] =
                    w.low_temperature +
                    '℃' +
                    '-' +
                    w.high_temperature +
                    '℃' +
                    ' ' +
                    w.condition
                }
              } else {
                data[i]['temperature'] = '-'
              }
            }
          })
        })
        return data
      },
      getTableColumn (option) {
        if (isEmpty(option)) return []
        let flag = false;
        const target = ['出客流','入客流', '店员','外卖人员'];
        for(let i = 0;i<target.length;i++){
          if(option.legend.data.includes(target[i])){
            flag = true;
            break
					}
				}
        let column = [
          {
            title: flag ? this.$t('实体') : this.$t('时间'),
            key: 'time',
            fixed: option.legend.data.length > 10 ? 'left' : '',
            width: option.legend.data.length > 10 ? 120 : '',
          },
        ]
        column = column.concat(
          option.legend.data.map((o, i) => {
            return {
              key: 'entity' + i,
              width:
                option.legend.data.length > 10
                  ? this.isDateCompare
                  ? o.length * 15
                  : o.length * 20
                  : '',
              title: o + (option.legend.unit?(option.legend.unit[i] ? `(${option.legend.unit[i]})` : `(${this.$t('人次')})`):''),
            }
          })
        )
        if (this.weathers1.length && this.weathers2.length) {
          const date1 = _.last(option.legend.data[0].split('|'))
          const date2 = _.last(option.legend.data[1].split('|'))
          const arr = [
            {
              key: 'temperature1',
              title: this.$t('temperature')+'(' + date1 + ')',
            }, {
              key: 'temperature2',
              title: this.$t('temperature')+'(' + date2 + ')',
            }
          ]
          column = column.concat(arr)
        } else if (this.weathers1.length) {
          column.push({
            key: 'temperature',
            title: this.$t('temperature'),
          })
        }

        return column
      },
      //下载
      handleDownload (index) {
        this.$emit('download')//无效客流中要对table数据进行特殊处理，故作延迟处理
				setTimeout(()=>{
          this.initTable(this.chartOption)
          downloadEx(exportEx, this.toolList[index].name, [
            this.tableColumn,
            this.tableData,
          ])
				})
      
      },
      changeTab (item, index) {
        if (item.value === 'download') {
          this.handleDownload(index)
          return
        }
        this.tool = index
        this.$emit('toolClick', this.currentChart)
      },
      initLineChart (option) {
        this.chartOption = option
        this.chart.lineChart.setOption(option, true)
        // this.initTable(option);
        this.$nextTick(() => {
          this.chart.lineChart.resize()
        })
      },
      initBarChart (option) {
        this.chartOption = option
        this.chart.barChart.setOption(option, true)
        // this.initTable(option);
        this.$nextTick(() => {
          this.chart.barChart.resize()
        })
      },
      initTable (option) {
        this.chartOption = option
        this.tableColumn = this.getTableColumn(option)
        this.tableData = this.getTableData(option)
      },
    },
    mounted () {
      this.chart.lineChart = echarts.init(
        document.getElementById(`line-chart-${this.chartId}`)
      )
      this.chart.barChart = echarts.init(
        document.getElementById(`bar-chart-${this.chartId}`)
      )
    },
    activated () {
      this.$nextTick(() => {
        this.chart.lineChart.resize()
      })
      this.$nextTick(() => {
        this.chart.barChart.resize()
      })
    },
    watch: {
      toolList: {
        handler (newval, oldval) {
          if (newval.length > oldval.length) {
            this.tool++
          }
          if (newval.length < oldval.length && this.tool !== 0) {
            this.tool--
          }
        },
      },
    },
  }
</script>
<style lang="less" scoped>
	.chart-box {
		.chart-title {
			font-size: 18px;
			
			.flex-center {
				.icon + .icon {
					margin-left: 10px;
				}
			}
		}
		
		.chart {
			height: 0;
			flex: 1;
			
			.line-chart,
			.bar-chart {
				width: 100%;
				height: 100%;
			}
			
			.table {
				padding: 20px 0;
				height: 100%;
			}
		}
	}
</style>
