<template>
	<div style="position:relative">
		<!--客流数据指标-->
		<flow-selector @paramsPrepare="paramsPrepare"></flow-selector>
		<bar-pie
			ref='ranking'
			:chartTitle="[['无效客流排行'],'无效客流占比']"
			:barData="barData"
			:pieData="pieData"
			:orderName='orderName'
			:chartType="chartType"
		></bar-pie>
		<chart-box
			chartId="invalidChart"
			:chart="invalidChart"
			@toolClick="
        (chartName) => {
          handletoolClick(chartName);
        }
      "
			ref="invalidEnter"
			class="common-card m-t-20 chart-1"
			:toolList="toolList"
		></chart-box>
	</div>
</template>
<script>
  import BarPie from '@/views/home/BarPie.vue'
  import FlowSelector from '_c/flow-selector/rank-flow-selector'
	import {getInvalidFlowTrend} from '@/api/analysis.js'
  import ChartBox from "_c/common/Chart-box";
  import config from "@/config/index";
  import { entityFlow } from "@/api/entityNew";
  import { config as barConfig } from "@/config/echarts-config/bar-chart";
  import { config as lineConfig  } from "@/config/echarts-config/line-chart";

  export default {
    name: 'noneEffective',
    components: {
      BarPie,
      FlowSelector,
      ChartBox
    },
    data () {
      return {
        homeName: 'ranking',
        orderName: '客流',
        chartType: 'pie',
        barData:{
          series:[],
          xAxis:[],
				},
				pieData:{
          series:[],
					labels:[]
				},
        invalidChart:{
          barChart: null,
          lineChart: null,
				},
        toolList:[
          {
            icon: 'zhexiantu',
            value:'line',
            name: '无效客流趋势'
          }, {
            icon: '62',
            value:'bar',
            name: '无效客流趋势'
          }, {
            icon: 'biaoge-copy',
            value:'table',
            name: '详细数据'
          },
        ],
				lineOption:null,
				barOption:null
      }
    },
    methods: {
      paramsPrepare (val) {
				const params = {
          bzid:val.entitys.map(o=>{return o.id}).toString(),
					time1:val.date1Array.toString(),
          type:val.date1Array[0] === val.date1Array[1]?'hour':'date'
				}
        const paramsEnter = {
          type:'enter',
          bzid:val.entitys.map(o=>{return o.id}).toString(),
          range:val.date1Array[0] === val.date1Array[1]?'Hour':'Date',
          time1:val.date1Array.toString(),
        }
        Promise.all([getInvalidFlowTrend(params),entityFlow(paramsEnter)]).then(res=>{
					this.formatInvalidEnterByEntity(res[0].data.data.time1)
					this.formatInvalidEnterTrend(res)
        })
      },
      formatInvalidEnterByEntity(res){
        let series = [
          {
            name:'客流量',
            data:[]
          }
        ],xAxis=[
          {
            name:'名称',
            key:'time',
            data:[]
          }
        ];
        res.forEach(o=>{
          if(o.list){
            const enters = Object.values(o.list).map(list=>{
              return list.enter
            })
            o.enterSum =_.sum(enters)
          }else {
            o.enterSum = 0
          }
        })
        res = _.sortBy(res,'enterSum').reverse()
        res.forEach(o=>{
          series[0].data.push(o.enterSum);
          xAxis[0].data.push(o.name);
        })
        this.barData.series = series;
        this.barData.xAxis = xAxis;
        this.pieData.labels = xAxis[0].data;
        this.pieData.series = series[0].data;
        this.$refs.ranking.handleCompareRes()
			},
      formatInvalidEnterTrend(res){
        let lineConfigCopy = _.cloneDeep(lineConfig);
        lineConfigCopy.dataZoom = []
        let barConfigCopy = _.cloneDeep(barConfig);
        const legend = ['全部客流','无效客流']
        lineConfigCopy.legend.data = legend
        barConfigCopy.legend.data = legend
				const allRes = res[1].data.data;
				const invalidRes = res[0].data.data.time1;
				const xAxis = Object.keys(allRes[0].list.time1).map(o=>{
				  return o.substring(0,16)
				})
        lineConfigCopy.xAxis.data = xAxis;
        barConfigCopy.xAxis.data = xAxis;
				let enterObj1 = {}
				let enterObj2 = {}
        invalidRes.forEach(o=>{
          if(o.list){
            for(let key in o.list){
              if(enterObj1[key]){
                enterObj1[key]+=o.list[key].enter
							}else {
                enterObj1[key] = o.list[key].enter
							}
						}
					}
				})
        allRes.forEach(o=>{
          const obj = o.list.time1
            for(let key in obj){
              if(enterObj2[key]){
                enterObj2[key]+=obj[key]
							}else {
                enterObj2[key] = obj[key]
							}
						}
				})
				const series = [
					{
					  name:'全部客流',
            type: 'line',
						data:Object.values(enterObj2)
					},{
            name:'无效客流',
            type: 'line',
            data:Object.values(enterObj1)
					}
				]
        lineConfigCopy.series = [
          {
            name:'全部客流',
            type: 'line',
            data:Object.values(enterObj2)
          },{
            name:'无效客流',
            type: 'line',
            data:Object.values(enterObj1)
          }
        ]
        barConfigCopy.series = [
          {
            name:'全部客流',
            type: "bar",
            barGap: "0%",
            itemStyle: {
              normal: {
                //柱形图圆角
                barBorderRadius: [80, 80, 0, 0],
              },
            },
            data:Object.values(enterObj2)
          },{
            name:'无效客流',
            type: "bar",
            barGap: "0%",
            itemStyle: {
              normal: {
                //柱形图圆角
                barBorderRadius: [80, 80, 0, 0],
              },
            },
            data:Object.values(enterObj1)
          }
        ]
				this.lineOption = lineConfigCopy;
				this.barOption = barConfigCopy;
 				this.$refs.invalidEnter.initLineChart(this.lineOption)
      },
      handletoolClick(chartName){
        switch (chartName) {
          case "line":
          case "table":
            this.$nextTick(() => {
              this.$refs.invalidEnter.initLineChart(this.lineOption)
            });
            break;
          case "bar":
            this.$nextTick(() => {
              this.$refs.invalidEnter.initBarChart(this.barOption)
            });
            break;
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
	.selectorbox{
		border-radius: 6px;
		box-shadow: 0 0 9px 0 rgba(166,168,169,.4);
	}
	.chart-1{
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
