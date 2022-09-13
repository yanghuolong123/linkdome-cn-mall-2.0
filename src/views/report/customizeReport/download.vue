<template>
	<div class="report-center" style="min-width: 1200px;">
		<div class="pdf-text-box">
			<div id="pdfDom" v-if="showPDF" style="width: 1200px;">
				<!-- 封面 -->
				<report-cover
					:suggestText='suggestText'
					titleName='凌图智慧报告'
					:pageTotal="`${getTotalPage()}`"
				></report-cover>
				<!-- 总览 -->
				<report-one title='客流总览'
										v-if="enabledModules.includes(1)"
										:page="`${getPage(1)}`"
										:enterData='enterData'
										:listTitle='oneListData'></report-one>
				<!--客流趋势  -->
				<report-chart :chartHeight='600' :clickData='clickData' title='客流趋势'
											v-if="enabledModules.includes(2)"
											:page="`${getPage(2)}`"
											:listTitle='trendTitle'
											:dataList=trendChartData></report-chart>
				<report-ratio-table
					title='客流趋势'
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
											:dataList='gateChartData'></report-chart>
				<!-- 出入口表格 -->
				<report-week-five
					title='出入口客流'
					v-if="enabledModules.includes(3)"
					:page="`${getPage(3)+1}`"
					:listTitle="gateTableTitle"
					:tableColumn='tableColumn'
					:tableData='tableData'
				></report-week-five>
				<!-- 店铺 -->
				<report-chart :chartHeight='600'
											:clickData='clickData' title='店铺客流'
											v-if="enabledModules.includes(4)"
											:page="`${getPage(4)}`"
											:listTitle='shopTitle'
											:dataList='shopChartData'></report-chart>
				<!-- 楼层下的商铺 -->
				<report-chart-multi title='店铺客流'
														v-if="enabledModules.includes(5)"
														:page="`${getPage(5)}`"
														:listTitle='floorStoreTitle'
														:dataList='allFloorStore'></report-chart-multi>
				<!-- 业态下的商铺 -->
				<report-chart-multi title='店铺客流'
														v-if="enabledModules.includes(6)"
														:page="`${getPage(6)}`"
														:listTitle='formatStoreTitle'
														:dataList='allFormatStore'></report-chart-multi>
				<!-- 热力图 -->
<!--				<report-heat-map-->
<!--					:key="'heatMap'+index"-->
<!--					v-for="(item,index) in allHeatMap"-->
<!--					title='热力图'-->
<!--					:mapUrl="item.mapUrl"-->
<!--					:page='`${9+index}`'-->
<!--					:listTitle='item.title'-->
<!--					:dataList=item.data-->
<!--					:isRemark='false'-->
<!--					:chartHeight='600'-->
<!--				></report-heat-map>-->
				<!-- 店铺关联 有序-->
<!--				<report-table title='店铺关联' :listTitle='orderlyTitle' :tableData='orderlyData'-->
<!--											:page='`${9+allHeatMap.length}`'></report-table>-->
<!--				&lt;!&ndash; 店铺关联 无序&ndash;&gt;-->
<!--				<report-table title='店铺关联' :listTitle='disorderTitle' :tableData='disorderData'-->
<!--											:page='`${10+allHeatMap.length}`'></report-table>-->
				<!-- 停留时间 业态-->
				<report-chart :chartHeight='600' :clickData='clickData' title='停留时间' :isRemark='false'
											v-if="enabledModules.includes(10)"
											:page="`${getPage(10)}`"
											:listTitle='dwellTitle' :dataList='dwellChartData'
											chartType='dwell'></report-chart>
				<!-- 停留时间 业态下的商铺-->
				<report-chart-multi chartType='dwell'
														title='停留时间'
														v-if="enabledModules.includes(10)"
														:page="`${getPage(10)+1}`"
														:listTitle='formatDwellStoreTitle' :dataList='allDwellFormatStore'></report-chart-multi>
				<report-back-cover></report-back-cover>
			</div>
		
		</div>
	</div>
</template>
<script>
  import customizeMixin from './mixin'
  import _ from 'lodash'
  import { setToken } from '@/libs/util'
  import axios from 'axios'
  import mixins from '../reportMixin.js'
  // api
  import { newReportEnter, newReportSuggest, newReportGate, newReportShop } from '@/api/report'
  import { getanalysiseeo, getGroupOrganization } from '@/api/home'
  import {
    newReportFloorStore,
    newReportFormatStore,
    newReportOrderly,
    newReportDisorder,
    newReportDwellStore,
    newReportDwellFormat
  } from '@/api/new_report'
  import { getHeatMapDistribution, getHeatMapFloorData } from '@/api/analysis'
  export default {
    name: 'new-download-report-week',
    mixins: [customizeMixin, mixins,],
		data(){
      return{
        pdfBaseUrl:''
			}
		},
    computed: {
      callData () {
        return this.$route.query.date
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
      let token = this.$route.query.token
      this.pdfBaseUrl = this.$route.query.pdfUrl
      this.selectDateTime = this.$route.query.date.split(',')
      setToken(token, 1)
      const floors = await getHeatMapFloorData({ property_id: this.propertyId, type: 'is_heatmap' })
      this.floorList = floors.data.data
      this.parameterData()
      //enabledModules：启用的模块
      let enabledModules = this.$route.query.enabledModules && this.$route.query.enabledModules.split(',')||[];
      if(enabledModules && enabledModules.length){
        this.enabledModules = enabledModules.map(o=>{return Number(o)})
      }
      console.log(this.enabledModules)
      //是否显示同比
      this.showLastYearData = this.$route.query.showYear==='true'
    },
    methods: {
      parameterData () { // 查找对应的 购物中心 id
        getGroupOrganization().then(res => {
          let propertyId = Number(this.$route.query.propertyId)
          let property = _.filter(res.data.data.property, o => {
            return o.property_id === propertyId
          })[0]
          this.$store.commit('saveOrganizationData', res.data.data)
          this.$store.commit('headerData', { text: property.name, value: property.property_id, img: property.map_url })
          this.$store.commit('headerAction', property.property_id)
          this.reportQuery()
        })
      },
      reportQuery () {
        this.headerDate(this.selectDateTime)
        this.showPDF = false
        // const heatmapReqArr = this.floorBzids.map(o => {
        //   return getHeatMapDistribution({
        //     begin_time: this.selectDateTime[0],
        //     end_time: this.selectDateTime[1],
        //     floor_bzid: o,
        //     type: 'day'
        //   })
        // })
        Promise.all([
          newReportSuggest({
            property_id: this.propertyId,
            date: this.callData
          }),
          // 总客流
          newReportEnter({
            property_id: this.propertyId,
            timeRange: this.callData,
            report_type: 'customize'
          }),
          // 本周客流
          getanalysiseeo({
            bzid: this.bzid,
            type: 'enter',
            range: this.callData,
            innerRange: '1day'
          }),
          // 上周客流
          getanalysiseeo({
            bzid: this.bzid,
            type: 'enter',
            range: this.onChainDate,
            innerRange: '1day'
          }),
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
        ]).then(res => {
          this.showPDF = true
          // 建议
          this.suggestText = res[0].data.data[0].property_suggest
          // 客流总览
          this.reportOneData(res[1].data.data)
          // 趋势数据
          this.trendDataList(res[2].data.data, res[3].data.data, res[4].data.data)
          // 出入口数据
          this.gateDataList(res[5].data.data)
          // 商铺数据
          this.shopDataList(res[6].data.data)
          // 楼层下的商铺
          this.floorDataList(res[7].data.data)
          // 业态下的商铺
          this.formatDataList(res[8].data.data)
          // 热力图
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
          this.dwellFormatData(res[9].data.data)
          // 停留时间 业态 商铺
          this.dwellFormatStoreData(res[10].data.data)
          this.handleDownload()
        })
      },
      handleDownload () {
        if(!this.pdfBaseUrl){
          this.$message.warning(this.$t('error.pdfError'))
        }else{
          setTimeout(() => {
            axios.get(this.pdfBaseUrl + '/pdf/finish', {
              params: { filename: this.callData }
            })
          }, 3000)
				}
      },
    }
  }
</script>

<style lang="less" scoped>
	#pdfDom {
		background-color: #fff;
		overflow: hidden;
		
		.reportOneText {
			float: left;
		}
	}
</style>
