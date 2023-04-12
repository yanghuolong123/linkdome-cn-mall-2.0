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
			<div class="pie-chart flex-center"   v-show="currentChart === 'pie'">
				<div class="entitys flex-column" v-if="entities.length>1">
					<div class="item" :class="{'active':i===activeEntityIndex}" @click="entityClick(i)" v-for="(item,i) in entities">{{item.name}}</div>
				</div>
				<div id="pie-chart-arrival" :class="{'mul-entity':entities.length>1}"></div>
			</div>
			<div class="bar-chart" id="bar-chart-arrival" v-show="currentChart === 'bar'"></div>
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
    name:'ArrivalTimes',
    props: {
      toolList: {
        type: Array,
        default: () => []
      },
      entities: {
        type: Array,
        default: () => []
      },
      chart: {
        type: Object,
        default: () => {
          return {
            barChart: null,
            pieChart: null,
          }
        },
      },
      activeEntityIndex:{
        type:Number,
				default:0
			}
    },
    data () {
      return {
        tool: 0,
        tableHeight: 0,
        chartOption: null,
        tableData: [],
        tableColumn: [],
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
    methods: {
      entityClick(index){
      	this.$emit('changeEntity',index)
			},
      getTableData1 (option) {
        return option.series[0].data.map(o => {
          return {
            type: o.name,
            column0: o.value.toLocaleString()
          }
        })
      },
      getTableData2(option){
        let tableData = []
        option.xAxis.data.forEach((o,i)=>{
          let obj = {
            type:o
					}
          option.series.forEach((s,idx)=>{
            obj[`column${idx}`] = s.data[i].toLocaleString()
					})
          tableData.push(obj)
				})
				return tableData
			},
      getTableColumn2 (option) {
        if (isEmpty(option)) return []
        let column = [
          {
            title: this.$t('时间'),
            key: 'type',
						width:220
          }
        ]
        column = column.concat(
          option.series.map((o, i) => {
            return {
              key: 'column' + i,
              title: o.name,
							width:i===4?100:''
            }
          })
        )
        return column
      },
      changeTab (item, index) {
        if (item.value === 'download') {
          this.handleDownload(index)
          return
        }
        this.tool = index
        this.$emit('toolClick', this.currentChart)
      },
      handleDownload (index) {
        downloadEx(exportEx, this.toolList[index].name, [
          this.tableColumn,
          this.tableData,
        ])
      },
      initPieChart (option) {
        this.chartOption = option
        this.chart.pieChart.setOption(option, true)
        this.$nextTick(() => {
          console.log('resize')
          this.chart.pieChart.resize()
        })
      },
      initBarChart (option) {
        this.chartOption = option
        this.chart.barChart.setOption(option, true)
        this.$nextTick(() => {
          this.chart.barChart.resize()
        })
      },
      initTable (option,isDateCompare) {
        if(isDateCompare){
          this.tableColumn = this.getTableColumn2(option)
          this.tableData = this.getTableData2(option)
				}else {
          this.tableColumn = [
            {
              title: this.$t('类型'),
              key: 'type',
            },{
              title: this.$t("fn.EnterUnit", [this.$t("人")]),
              key: 'column0',
            }
          ]
          this.tableData = this.getTableData1(option)
				}

      }
    },
    mounted () {
      this.chart.barChart = echarts.init(
        document.getElementById(`bar-chart-arrival`)
      )
      this.chart.pieChart = echarts.init(
        document.getElementById(`pie-chart-arrival`)
      )
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
			
			.pie-chart {
				width: 100%;
				height: 100%;
			}
			.mul-entity{
				width: 80%!important;
			}
			#bar-chart-arrival,
			#pie-chart-arrival{
				height: 100%;
				width: 100%;
			}
			.entitys{
				flex: 1;
				height: 70%;
				overflow-y: scroll;
				margin-left: 20px;
				.item{
					cursor: pointer;
					&:hover{
						color: #33B3ED;
					}
					&.active{
						color: #33B3ED;
					}
				}
				.item+.item{
					margin-top: 15px;
				}
			}

			.table {
				padding: 20px 0;
				height: 100%;
			}
		}
	}
</style>
