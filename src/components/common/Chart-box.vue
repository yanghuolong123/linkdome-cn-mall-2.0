<template>
	<div class="chart-box flex-column">
		<div class="flex-between chart-title">
			<span>{{toolList[tool]&&toolList[tool].name}}</span>
			<div class="flex-center">
				<slot></slot>
				<span class="icon" @click="changeTab(index)" v-for="(item,index) in toolList" :key="index">
					<icons class="pointer" :type="item.icon"
						   :color="tool===index?'#37b5ed':'#9D9D9DFF'"
						   :size="20"></icons>
				</span>
			</div>
		</div>
		<div class="chart">
			<div class="line-chart" :id="`line-chart-${chartId}`" v-show="currentChart === 'line'"></div>
			<div class="bar-chart" :id="`bar-chart-${chartId}`" v-show="currentChart === 'bar'"></div>
			<div class="table" ref="table" v-show="currentChart === 'table'">
				<Table stripe
					   :height="tableHeight"
					   :columns="tableColumn" :data="tableData"></Table>
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
      toolList: {
        type: Array,
        default: []
      },
      showSummary: {
        type: Boolean,
        default: false
      },
      chart: {
        type: Object,
        default: () => {
          return {
            barChart: null,
            lineChart: null
          }
        }
      },
      chartId: {
        type: String,
        default: ''
      },
      isDateCompare:{
        type: Boolean,
        default: false
	  }
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
        chartOption: null
      }
    },
    methods: {
      getTableData (option) {
        if (isEmpty(option)) return []
        let data = []
        if (this.showSummary) {
          option.xAxis.data.push('合计')
        }
        let sum = []
        option.xAxis.data.forEach((o, i) => {
          data.push({
            time: o,
          })
          const flag = isEmpty(sum)
          option.series.forEach((s, sI) => {
            if (this.showSummary && flag) {
              sum.push(_.sum(s.data))
            }
            if(this.showSummary){
              if (i !== option.xAxis.data.length - 1) {
                data[i][`entity${sI}`] = isEmpty(s.data[i]) ? '-' : (s.data[i].toLocaleString() )
              } else {//最后一个是合计
                data[i][`entity${sI}`] = sum[sI].toLocaleString() 
              }
			}else {
              data[i][`entity${sI}`] = isEmpty(s.data[i]) ? '-' : (s.data[i].toLocaleString() )
              // + '人次'
			}

          })
        })

        return data
      },
      getTableColumn (option) {
        if (isEmpty(option)) return []
        let column = [
          {
            title: option.legend.data.includes('出客流' || '入客流') ? '实体' : '时间',
            key: 'time',
            fixed: option.legend.data.length > 10 ? 'left' : '',
            width: option.legend.data.length > 10 ? 120 : '',
          }
        ]
        column = column.concat(option.legend.data.map((o, i) => {
          return {
            key: 'entity' + i,
            width: option.legend.data.length > 10 ? this.isDateCompare?(o.length * 15):(o.length * 20) : '',
            title: o  + ' ( 人次 ) '
          }
        }))
        return column
      },
      //下载
      handleDownload (index) {
        downloadEx(exportEx, this.toolList[index].name, [this.tableColumn, this.tableData])
      },
      changeTab (index) {
        if (index === this.toolList.length - 1) {
          this.handleDownload(index)
          return
        }
        this.tool = index
        this.$emit('toolClick', this.currentChart)
      },
      initLineChart (option) {
        this.chartOption = option
        this.chart.lineChart.setOption(option, true)
        this.initTable(option)
        this.$nextTick(() => {
          this.chart.lineChart.resize()
        })
      },
      initBarChart (option) {
        this.chartOption = option
        this.chart.barChart.setOption(option, true)
        this.initTable(option)
        this.$nextTick(() => {
          this.chart.barChart.resize()
        })
      },
      initTable (option) {
        this.tableColumn = this.getTableColumn(option)
        this.tableData = this.getTableData(option)
      }
    },
    mounted () {
      this.chart.lineChart = echarts.init(document.getElementById(`line-chart-${this.chartId}`))
      this.chart.barChart = echarts.init(document.getElementById(`bar-chart-${this.chartId}`))
    },
	activated(){
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
        }
      }
    }
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
			
			.line-chart, .bar-chart {
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
