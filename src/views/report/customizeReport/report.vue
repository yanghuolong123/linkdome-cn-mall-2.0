<template>
	<div class="report-center">
		<!-- 选择日期 查看 下载 -->
		<div class="filter-box flex-center">
			<DatePicker
				class="time-picker"
				:value="selectDateTime"
				type="daterange"
				@on-change="val=>selectDateTime = val"
				:options="options3"
				placeholder="选择日期">
			</DatePicker>
			<Button type="primary" class="m-l-20" @click="reportQuery" size="large">{{ $t('查询') }}</Button>
			<div class="icon-download" @click="downloadReport('customize',callData)" title="下载报告">
				<icons type="daoru" color="#2a7dc1" :size=20></icons>
			</div>
		</div>
		<report-suggest v-if="showPDF&&userRole==='超级管理员'"
										@suggestSubmit='suggestSubmit'
										:propertyId='propertyId'
										:date='callData'
										:suggestText='suggestText'
		></report-suggest>
		<!-- pdf 内容 -->
		<div class="pdf-text-box" v-if="showPDF">
			<!-- 封面 -->
			<report-cover
				:pageTotal="`${getTotalPage()}`"
				titleName='凌图智慧报告'
				:suggestText='suggestText'
			></report-cover>
			<!-- 总览 -->
			<report-one title='客流总览'
									v-if="enabledModules.includes(1)"
									:page="`${getPage(1)}`"
									:enterData='enterData'
									:listTitle='oneListData'></report-one>
			<!-- 客流趋势 -->
			<report-chart :chartHeight='600'
										:clickData='clickData'
										title='客流趋势'
										v-if="enabledModules.includes(2)"
										:page="`${getPage(2)}`"
										:listTitle='trendTitle'
										:dataList=trendChartData></report-chart>
			<!-- 客流趋势表格 -->
			<report-ratio-table title='客流趋势'
													v-if="enabledModules.includes(2)"
													:page="`${getPage(2)+1}`"
													:listTitle='trendTitle'
													:tableColumn='ratioTableColumn'
													:tableData='ratioTableData'
			></report-ratio-table>
			<!-- 出入口 -->
			<report-chart :chartHeight='600'
										:clickData='clickData' title='出入口客流'
										v-if="enabledModules.includes(3)"
										:page="`${getPage(3)}`"
										:listTitle='gateTitle'
										:dataList=gateChartData></report-chart>
			<!-- 出入口表格 -->
			<report-week-five
				title='出入口客流'
				:tableColumn='tableColumn'
				v-if="enabledModules.includes(3)"
				:page="`${getPage(3)+1}`"
				:listTitle="gateTableTitle"
				:tableData='tableData'
			></report-week-five>
			
			
			<!-- 店铺 -->
			<report-chart :chartHeight='600'
										:clickData='clickData' title='店铺客流'
										v-if="enabledModules.includes(4)"
										:page="`${getPage(4)}`"
										:listTitle='shopTitle'
										:dataList=shopChartData></report-chart>
			
			<!-- 楼层下的商铺 -->
			<report-chart-multi title='店铺客流'
													v-if="enabledModules.includes(5)"
													:page="`${getPage(5)}`"
													:listTitle='floorStoreTitle'
													:dataList='allFloorStore'></report-chart-multi>
			<!-- 业态下的商铺 -->
			<report-chart-multi title='店铺客流'
													v-if="enabledModules.includes(6)"
													:page="`${getPage(6)}`" :listTitle='formatStoreTitle'
													:dataList='allFormatStore'></report-chart-multi>
			<!-- 热力图 -->
<!--			<report-heat-map-->
<!--				:key="'heatMap'+index"-->
<!--				v-for="(item,index) in allHeatMap"-->
<!--				title='热力图'-->
<!--				:mapUrl="item.mapUrl"-->
<!--				:page='`${9+index}`'-->
<!--				:listTitle='item.title'-->
<!--				:dataList=item.data-->
<!--				:isRemark='false'-->
<!--				:chartHeight='600'-->
<!--			></report-heat-map>-->
			<!-- 店铺关联 有序-->
<!--			<report-table title='店铺关联' :listTitle='orderlyTitle' :tableData='orderlyData'-->
<!--										:page='`${9+allHeatMap.length}`'></report-table>-->
<!--			&lt;!&ndash; 店铺关联 无序&ndash;&gt;-->
<!--			<report-table title='店铺关联' :listTitle='disorderTitle' :tableData='disorderData'-->
<!--										:page='`${10+allHeatMap.length}`'></report-table>-->
			<!-- 停留时间 业态-->
			<report-chart :chartHeight='600' :clickData='clickData' :isRemark='false' title='停留时间'
										v-if="enabledModules.includes(10)"
										:page="`${getPage(10)}`"
										:listTitle='dwellTitle' :dataList='dwellChartData'
										chartType='dwell'></report-chart>
			<!-- 停留时间 业态下的商铺-->
			<report-chart-multi chartType='dwell' title='停留时间'
													v-if="enabledModules.includes(10)"
													:page="`${getPage(10)+1}`"
													:listTitle='formatDwellStoreTitle'
													:dataList='allDwellFormatStore'></report-chart-multi>
			<report-back-cover></report-back-cover>
		</div>
	</div>
</template>
<script>


  // api
  import { newReportEnter, newReportSuggest, newReportGate, newReportShop } from '@/api/report'
  import { getanalysiseeo } from '@/api/home'
  import {
    newReportFloorStore,
    newReportFormatStore,
    newReportOrderly,
    newReportDisorder,
    newReportDwellStore,
    newReportDwellFormat,
    newReportGateLast
  } from '@/api/new_report'
  import { getHeatMapDistribution, getHeatMapFloorData } from '@/api/analysis'
  import mixins from '../reportMixin.js'

  import _ from 'lodash'
  import customizeMixin from './mixin'

  export default {
    name: 'report-week',
    mixins: [customizeMixin, mixins,],

    data () {
      return {
        options3: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now() - 86400000
          }
        }
      }
    },
    computed: {

      callData () {
        if (!this.selectDateTime[0] || !this.selectDateTime[1]) return ''
        if (this.selectDateTime[0] === this.selectDateTime[1]) return 'same'
        return this.selectDateTime.toString()
      },
      pageConfig(){
        return [
          {
            id:1,
            count:1,
            name:'客流总览',
          },{
            id:2,
            count:2,
            name:'客流趋势',
          },{
            id:3,
            count:2,
            name:'出入口客流',
          },{
            id:4,
            count:1,
            name:'店铺客流',
          },{
            id:5,
            count:1,
            name:'店铺客流-楼层',
          },{
            id:6,
            count:1,
            name:'店铺客流-业态',
          },{
            id:10,
            count:2,
            name:'停留时间',
          }
        ]
      }
    },

    async mounted () {
      const floors = await getHeatMapFloorData({ property_id: this.propertyId, type: 'is_heatmap' })
      this.floorList = floors.data.data
      this.reportQuery()
    },
    methods: {
      // 查询
      async reportQuery () {
        if (!this.callData) {
          this.$alert({ content: '请选择时间' })
          return
        }
        if (this.callData === 'same') {
          this.$alert({ content: '查询时间不能为同一天' })
          return
        }
        await this.getReportSetting()
        if(!this.enabledModules.length){
          this.$alert({ content: "未配置相关模块！" });
          return
        }
        this.headerDate(this.selectDateTime)
        this.showPDF = false;
        // const heatmapReqArr = this.floorBzids.map(o => {
        //   return getHeatMapDistribution({
        //     begin_time: this.selectDateTime[0],
        //     end_time: this.selectDateTime[1],
        //     floor_bzid: o,
        //     type: 'day'
        //   })
        // })
        Promise.all([
          newReportSuggest({ property_id: this.propertyId, date: this.callData }),
          // 总客流
          newReportEnter({ property_id: this.propertyId, timeRange: this.callData, report_type: 'customize' }),
          // 本期客流
          getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.callData, innerRange: '1day' }),
          // 上期客流
          getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.onChainDate, innerRange: '1day' }),
          // 去年客流
          getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.onYearDate, innerRange: '1day' }),
          // 出入口
          newReportGate({
            timeRange1: this.callData,
            timeRange2: this.onChainDate,
            report_type: 'customize',
            property_id: this.propertyId
          }),
          // 商铺
          newReportShop({
            time1: this.callData,
            time2: this.onChainDate,
            report_type: 'customize',
            property_id: this.propertyId
          }),
          // 楼层下的商铺
          newReportFloorStore({ time: this.callData, property_id: this.propertyId }),
          // 业态下的商铺
          newReportFormatStore({ time: this.callData, property_id: this.propertyId }),
          // 热力图
          // ...heatmapReqArr,
          // getHeatMapDistribution({ begin_time:this.selectDateTime[0],end_time:this.selectDateTime[1],floor_bzid:this.floorIds.toString(),type:'day' }),
          // // 关联度 有序
          // newReportOrderly({
          //   time: this.callData,
          //   property_id: this.propertyId,
          //   sort_parameter: 'rate',
          //   report_type: 'week'
          // }),
          // newReportOrderly({
          //   time: this.callData,
          //   property_id: this.propertyId,
          //   sort_parameter: 'value',
          //   report_type: 'week'
          // }),
          // // 关联度 无序
          // newReportDisorder({
          //   time: this.callData,
          //   property_id: this.propertyId,
          //   sort_parameter: 'rate',
          //   report_type: 'week'
          // }),
          // newReportDisorder({
          //   time: this.callData,
          //   property_id: this.propertyId,
          //   sort_parameter: 'value',
          //   report_type: 'week'
          // }),
          // 停留时间 业态
          newReportDwellFormat({ time: this.callData, property_id: this.propertyId, }),
          // 停留时间 业态下的商铺
          newReportDwellStore({ time: this.callData, property_id: this.propertyId, }),
          newReportGateLast({ timeRange1: this.callData, property_id: this.propertyId })
        ]).then(res => {
          this.showPDF = true
          if (res[0].data.code === 200) {
            this.suggestText = res[0].data.data[0].property_suggest
          }
          if (res[1].data.code === 200) {
            this.enabledModules.includes(1)&&this.reportOneData(res[1].data.data)
          }
          // 趋势数据
          this.enabledModules.includes(2)&& this.trendDataList(res[2].data.data, res[3].data.data, res[4].data.data)
          // 出入口数据
          this.enabledModules.includes(3)&&this.gateDataList(res[5].data.data)
          // 商铺数据
          this.enabledModules.includes(4)&& this.shopDataList(res[6].data.data)
          // 楼层下的商铺
          this.enabledModules.includes(5)&&this.floorDataList(res[7].data.data)
          // 业态下的商铺
          this.enabledModules.includes(6)&&this.formatDataList(res[8].data.data)
          // 热力图
          // this.allHeatMap = [];
          // this.floorList.forEach((o, i) => {
          //   const data = res[9 + i].data.data
          //   this.allHeatMap.push({
          //     mapUrl: o.map_url,
          //     data,
          //     title: {
          //       name: '本期' + data.floor.name + '客流分析',
          //       text: '客流周期:' + this.saveHeaderData.reportDate
          //     }
          //   })
          // })
          // //   关联度 有序
          // this.relevanceTableData(res[9 + this.allHeatMap.length].data.data.matrixList, res[10 + this.allHeatMap.length].data.data.matrixList, 'orderlyData')
          // // 关联度 无序
          // this.relevanceTableData(res[11 + this.allHeatMap.length].data.data, res[12 + this.allHeatMap.length].data.data, 'disorderData')
          // 停留时间 业态
          this.enabledModules.includes(10)&&this.dwellFormatData(res[9].data.data)
          // 停留时间 业态 商铺
          this.enabledModules.includes(10)&&this.dwellFormatStoreData(res[10].data.data)
        })
      }

    }

  }
</script>
<style lang="less" scoped>
	.report-center {
		min-width: 1200Px;
		
		.filter-box {
			background-color: #fff;
			margin-top: 9px;
			padding: 20px 30px;
			box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
			border-radius: 6px;
			margin-bottom: 20px;
			
			/deep/ .ivu-input {
				width: 230Px;
			}
			
			
			.icon-download {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				-webkit-border-radius: 50%;
				-moz-border-radius: 50%;
				background-color: #fff;
				text-align: center;
				line-height: 40px;
				float: left;
				margin-left: 60px;
				box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
				cursor: pointer;
				
				&:before {
					content: none
				}
			}
		}
		
		.pdf-text-box {
			margin: 0px auto;
			max-width: 1200Px
		}
	}
	
	
	.day-report-date {
		margin-top: 9px;
		padding: 20px 0 20px 30px;
		background-color: #fff;
		border-radius: 6px;
		box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
		position: relative;
		
		.report-query {
			float: left;
			height: 43px;
			padding: .6rem 2rem;
			border-radius: 6px;
			background: #37b5ed !important;
			border: 1px solid #37b5ed;
			color: #fff;
			font-size: 1rem;
			cursor: pointer;
			margin-left: 30px;
		}
	}
	
	.week-select-date {
		float: left;
	}
	
	.icon-download {
		width: 43px;
		height: 43px;
		border-radius: 50%;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		background-color: #fff;
		text-align: center;
		line-height: 43px;
		float: left;
		margin-left: 60px;
		box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
		cursor: pointer;
		
		&:before {
			content: none
		}
	}

</style>
