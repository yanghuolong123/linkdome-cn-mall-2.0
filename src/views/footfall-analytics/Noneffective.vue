<template>
	<div style="position:relative">
		<!--客流数据指标-->
		<flow-selector @paramsPrepare="paramsPrepare"></flow-selector>
		<div class="flex-center">
			<chart-box ref="invalidRanking"
								 :horizontal="true"
								 style="width: 50%"
								 :chart="invalidRankChart"
								 @toolClick="(chartName) => {ranktoolClick(chartName)}"
								 class="common-card m-t-20 chart-1"
								 :toolList="ranktoolList"
								 chartId="invalidRanking"></chart-box>
			<pie-chart ref="pieChart"
								 :toolList="rankPietoolList"
								 @toolClick="pieToolClick"
								 style="width: 50%"
								 class="common-card m-t-20 m-l-20 chart-1"></pie-chart>
		</div>
		
		<chart-box
			chartId="invalidChart"
			:chart="invalidChart"
			@toolClick="(chartName) => {handletoolClick(chartName)}"
			@download="handletoolClick('table')"
			ref="invalidEnter"
			class="common-card m-t-20 chart-1"
			:toolList="toolList"
		></chart-box>
	</div>
</template>
<script>
  import FlowSelector from '_c/flow-selector/invalid-flow-selector'
  import { getInvalidFlowTrend } from '@/api/analysis.js'
  import ChartBox from '_c/common/Chart-box'
  import pieChart from './components/PieChart'
  import { config as barConfig } from '@/config/echarts-config/bar-chart'
  import { config as lineConfig } from '@/config/echarts-config/line-chart'
  import { config as pieConfig } from '@/config/echarts-config/pie-chart'

  export default {
    name: 'noneEffective',
    components: {
      FlowSelector,
      ChartBox,
      pieChart
    },
    data () {
      return {
        homeName: 'ranking',
        orderName: '客流',
        chartType: 'pie',
        barData: {
          series: [],
          xAxis: [],
        },
        pieData: {
          series: [],
          labels: []
        },
        invalidChart: {
          barChart: null,
          lineChart: null,
        },
        invalidRankChart: {
          barChart: null,
        },
        rankPietoolList: [
          {
            icon: 'fenxi',
            value: 'pie',
            name: '无效客流占比'
          }, {
            icon: 'biaoge-copy',
            value: 'table',
            name: '详细数据'
          }, {
            icon: 'daoru',
            value: 'download',
            name: '无效客流占比'
          }
        ],
        ranktoolList: [
          {
            icon: '62',
            value: 'bar',
            name: '无效客流排行'
          }, {
            icon: 'biaoge-copy',
            value: 'table',
            name: '详细数据'
          }, {
            icon: 'daoru',
            value: 'download',
            name: '无效客流排行'
          }
        ],
        toolList: [
          {
            icon: 'zhexiantu',
            value: 'line',
            name: '无效客流趋势'
          }, {
            icon: '62',
            value: 'bar',
            name: '无效客流趋势'
          }, {
            icon: 'biaoge-copy',
            value: 'table',
            name: '详细数据'
          },{
            icon: 'daoru',
            value: 'download',
            name: '无效客流趋势数据'
          }
        ],
        rankBarOption: null,
        lineOption: null,
        barOption: null,
        pieOption: null
      }
    },
    methods: {
      paramsPrepare (val) {
        const bzid = val.entitys.map(o => {
          return o.id
        }).toString()
        let params = {
          time1: val.date1Array.toString(),
          type: val.date1Array[0] === val.date1Array[1] ? 'hour' : 'date'
        }
        if (val.compareType === 'businessType') {
          params.industry_id = bzid
        } else {
          params.bzid = bzid
        }
        getInvalidFlowTrend(params).then(res => {
          res = res.data.data.time1
          this.formatInvalidEnterByEntity(res, val.compareType)
          this.formatInvalidEnterTrend(res)
        })
      },
      formatInvalidEnterByEntity (res, compareType) {
        /*柱状图数据*/
        res.forEach(o => {
          if (o.list) {
            const enters = Object.values(o.list).map(list => {
              return list.enter
            })
            o.enterSum = _.sum(enters)
          } else {
            o.enterSum = 0
          }
        })
        res = _.sortBy(res, 'enterSum')//先将返回结果进行排序
        //typeList : 1为店员，２为外卖
        let barConfigCopy = _.cloneDeep(barConfig)
        barConfigCopy.grid.left = barConfigCopy.grid.right = 20
        barConfigCopy.xAxis = {
          type: 'value'
        }
        barConfigCopy.color = ['#26ECC9', '#26AEEC']
        barConfigCopy.yAxis = {
          type: 'category',
          data: res.map(o => {
            return o.name
          })
        }
        barConfigCopy.series = []
        barConfigCopy.legend.data = ['店员', '外卖人员'];
        ['店员', '外卖人员'].forEach(o => {
          let data = []
          res.forEach(e => {
            let sum = 0
            if (e.list) {
              Object.values(e.list).forEach(l => {
                if (o === '店员') {
                  sum += l.typeList['1'].enter
                } else {
                  sum += l.typeList['2'].enter
                }
              })
            }
            data.push(sum)
          })
          let obj = {
            name: o,
            type: 'bar',
            stack: 'total',
            barMaxWidth: 80,
            emphasis: {
              focus: 'series'
            },
            data
          }
          barConfigCopy.series.push(obj)
        })
        this.rankBarOption = barConfigCopy
        this.ranktoolClick(this.$refs.invalidRanking.currentChart)
        /*饼图数据*/
        let pieData = []
        res.forEach(o => {
          const staffList = Object.values(o.list).map(m => {
            return m.typeList['1'].enter
          })
          const takeoutPer = Object.values(o.list).map(m => {
            return m.typeList['2'].enter
          })
          const obj = {
            value: o.enterSum,
            name: o.name,
            staff: _.sum(staffList),
            takeout: _.sum(takeoutPer),
          }
          pieData.push(obj)
        })
        let pieConfigCopy = _.cloneDeep(pieConfig)
        pieConfigCopy.series[0].data = pieData
        pieConfigCopy.compareType = compareType
        pieConfigCopy.category = ['店员', '外卖人员']
        pieConfigCopy.tooltip.formatter = function (params) {
          return `<span style="font-size: 18px">${params.data.name}:${params.data.value}</span><br><span style="line-height: 18px">店员: ${params.data.staff}</span><br><span style="line-height: 18px">外卖人员: ${params.data.takeout}</span>`

        }
        this.pieOption = pieConfigCopy
        this.$nextTick(() => {
          this.$refs.pieChart.initChart(pieConfigCopy)
          this.$refs.pieChart.initTableNoneEff(pieConfigCopy)
        })

      },
      formatInvalidEnterTrend (res) {
        let lineConfigCopy = _.cloneDeep(lineConfig)
        lineConfigCopy.dataZoom = []
        let barConfigCopy = _.cloneDeep(barConfig)

        let legend = [], xAxis = [], lineSeries = [], barSeries = []
        lineConfigCopy.legend.data = legend
        barConfigCopy.legend.data = legend

        res.forEach(o => {
          legend.push(o.name)
          //构造x轴数据
          if (!xAxis.length && o.list) {
            xAxis = Object.keys(o.list).map(l => {
              return l.substring(0, 16)
            })
          }
          lineSeries.push({
            name: o.name,
            type: 'line',
            data: Object.values(o.list).map(l => {
              return {
                value: l.enter,
                staff: l.typeList['1'].enter,
                takeout: l.typeList['2'].enter
              }
            }),

          })
          barSeries.push({
            name: o.name,
            type: 'bar',
            barGap: '0%',
            itemStyle: {
              normal: {
                //柱形图圆角
                barBorderRadius: [80, 80, 0, 0],
              },
            },
            data: Object.values(o.list).map(l => {
              return {
                value: l.enter,
                staff: l.typeList['1'].enter,
                takeout: l.typeList['2'].enter
              }
            }),
          })
        })
        lineConfigCopy.xAxis.data = xAxis
        barConfigCopy.xAxis.data = xAxis

        lineConfigCopy.series = lineSeries
        barConfigCopy.series = barSeries

        barConfigCopy.tooltip.formatter = lineConfigCopy.tooltip.formatter = function (params) {
          let result = `${params[0].axisValue}<br>`
          params.forEach(o => {
            result += `${o.marker}${o.seriesName}:${o.data.value} 店员:${o.data.staff} 外卖人员:${o.data.takeout}<br>`
          })
          return result
        }
        this.lineOption = lineConfigCopy
        this.barOption = barConfigCopy
        this.$refs.invalidEnter.initLineChart(this.lineOption)
      },
      pieToolClick (type) {
        switch (type) {
          case 'table':
            this.$nextTick(() => {
              this.$refs.pieChart.initTableNoneEff(this.pieOption)
            })
            break
          case 'pie':
            this.$nextTick(() => {
              this.$refs.pieChart.initChart(this.pieOption)
            })
            break
        }
      },
      ranktoolClick (chartName) {
        switch (chartName) {
          case 'table':
            this.$nextTick(() => {
              this.$refs.invalidRanking.initTable(_.cloneDeep(this.rankBarOption))
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.$refs.invalidRanking.initBarChart(this.rankBarOption)
            })
            break
        }
      },
      handletoolClick (chartName) {
        switch (chartName) {
          case 'line':
            this.$nextTick(() => {
              this.$refs.invalidEnter.initLineChart(this.lineOption)
            })
            break
          case 'table':
            this.$nextTick(() => {
              let tableOption = _.cloneDeep(this.lineOption)
              tableOption.series.forEach(o => {
                o.data = o.data.map(d => {
                  return `${d.value.toLocaleString()}(店员:${d.staff.toLocaleString()} 外卖人员:${d.takeout.toLocaleString()})`
                })
              })
              this.$refs.invalidEnter.initTable(tableOption)
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.$refs.invalidEnter.initBarChart(this.barOption)
            })
            break
        }
      }
    },

  }
</script>
<style lang="less" scoped>
	.rate_analysis_title {
		width: 100%;
		height: auto;
		
		span {
			display: inline-block;
			height: 36px;
			border-left: 2px solid rgba(0, 160, 233, 1);
			font-size: 24px;
			line-height: 36px;
			color: #4096e5;
			padding-left: 20px;
			margin-bottom: 40px;
		}
	}
	
	.rate_analysis {
		margin-top: 20px;
		padding: 0 20px 20px;
		background-color: #fff;
		border-radius: 8px;
		-webkit-border-radius: 8px;
		-moz-border-radius: 8px;
		border: 1px solid #d7dfe3;
		
		> p {
			font-size: 20px;
			color: #919191;
			text-align: left !important;
			font-family: SourceHanSansCN-Regular;
			line-height: 96px;
			padding-left: 56px;
			border-bottom: 1px solid rgba(215, 223, 227, 1);
		}
	}
	
	.bottomRow {
		margin-top: 16px;
		height: 40px;
	}
	
	.selectorbox {
		border-radius: 6px;
		box-shadow: 0 0 9px 0 rgba(166, 168, 169, .4);
	}
	
	.chart-1 {
		height: 540px;
	}
</style>
<style lang="stylus" scoped>
	.selectorbox /deep/
	.ivu-card-bordered
		border none
	
	.ivu-card-body
		padding 20px
		padding-top 0px
</style>
