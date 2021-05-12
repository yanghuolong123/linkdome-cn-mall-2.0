<template>
	<div class="report-center ">
		<div class="filter-box flex-center">
			<DatePicker
				type="date"
				:editable="false"
				@on-change="val=>selectDateTime = val"
				:options="options3"
				placeholder="选择日期"
				:value="selectDateTime"
			>
			</DatePicker>
			<!--改成多选时要注意后端没有按照前端返回的id顺序返回门店，造成报告混乱，需处理-->
			<Select v-model="storeSelected" class="m-l-20" style="width: 200px"  filterable>
				<Option v-for="item in storeListOptions" :value="item.id" :key="item.id">{{ item.name }}</Option>
			</Select>
			<Button type="primary" :disabled="!storeSelected" class="m-l-20" @click="reportQuery" size="large">查询</Button>
			<div class="icon-download" v-on:click="downloadReport('storeDay',`${selectDateTime},${selectDateTime}`)"
					 title="下载报告">
				<icons type="daoru" color="#2a7dc1" :size=20></icons>
			</div>
		</div>
		<div class="pdf-text-box" v-if="showReport">
			<!-- 封面 -->
			<report-cover
				titleName='凌图智慧日报'
				:pageTotal="`${validStoreSelectedList.length*14}`"
			></report-cover>
			<!--			&lt;!&ndash; 总览 &ndash;&gt;
						<report-overview title='客流总览' :enterData='enterData' :listTitle='oneListData'></report-overview>
						&lt;!&ndash;客流趋势（图表）&ndash;&gt;
						<report-trend-chart :chartHeight='450' title='客流趋势' page='2' :listTitle='trendTitle'
											:dataList=trendChartData></report-trend-chart>
						&lt;!&ndash;客流趋势（表格）&ndash;&gt;
						<report-ratio-table
								title='客流趋势'
								page='3'
								:listTitle='trendTitle'
								:tableColumn='ratioTableColumn'
								:tableData='ratioTableData'
						></report-ratio-table>
						&lt;!&ndash;年龄性别趋势分析(图表)&ndash;&gt;
						<report-age-gender-chart title='年龄性别趋势分析' page='4' :listTitle='ageGenderTitle'
												 :dataList=ageGenderChartData></report-age-gender-chart>
						&lt;!&ndash;年龄性别趋势分析(表格)&ndash;&gt;
						<report-age-gender-table
								title='年龄性别趋势分析'
								page='5'
								:listTitle='ageGenderTitle'
								:tableColumn='ageGenderTableColumn'
								:tableData='ageGenderTableData'
						></report-age-gender-table>-->
			<div v-for="(store,i) in validStoreSelectedList">
				<report-chart :chartHeight='600'
											v-if="storeEnterChartList.length"
											title='店铺客流分析'
											:page='(14*i+1).toString()'
											:isRemark="false"
											:storeName="storeEnterChartList[i].storeName"
											:listTitle='storeTrendTitle("enter")'
											:dataList=storeEnterChartList[i].chartData></report-chart>
				<!--门店 当日店铺入客流（表格）-->
				<report-ratio-table
					v-if="storeEnterFlowList.length"
					title='店铺客流分析'
					:page='(14*i+2).toString()'
					:listTitle='storeTrendTitle("enter")'
					:tableColumn='ratioTableColumn'
					:tableData='storeEnterFlowList[i].tableData'
					:storeName="storeEnterFlowList[i].storeName"
				></report-ratio-table>
				<report-chart :chartHeight='600'
											v-if="storeExitChartList.length"
											title='店铺客流分析'
											:page='(14*i+3).toString()'
											:isRemark="false"
											:listTitle='storeTrendTitle("exit")'
											:storeName="storeExitChartList[i].storeName"
											:dataList=storeExitChartList[i].chartData></report-chart>
				<!--门店 当日店铺出客流（表格）-->
				<report-ratio-table
					v-if="storeExitFlowList.length"
					title='店铺客流分析'
					:page='(14*i+4).toString()'
					:listTitle='storeTrendTitle("exit")'
					:tableColumn='ratioExitTableColumn'
					:tableData='storeExitFlowList[i].tableData'
					:storeName="storeExitFlowList[i].storeName"
				></report-ratio-table>
				<report-chart :chartHeight='600'
											v-if="storeTotalChartList.length"
											title='店铺客流分析'
											:page='(14*i+5).toString()'
											:isRemark="false"
											:storeName="storeTotalChartList[i].storeName"
											:listTitle='storeTrendTitle("total")'
											:dataList=storeTotalChartList[i].chartData></report-chart>
				<!--门店 当日店铺总客流（表格）-->
				<report-ratio-table
					v-if="storeTotalFlowList.length"
					title='店铺客流分析'
					:page='(14*i+6).toString()'
					:listTitle='storeTrendTitle("total")'
					:tableColumn='ratioTotalTableColumn'
					:tableData='storeTotalFlowList[i].tableData'
					:storeName="storeTotalFlowList[i].storeName"
				></report-ratio-table>
				<report-chart :chartHeight='600'
											v-if="storePassbyChartList.length"
											title='店铺客流分析'
											:page='(14*i+7).toString()'
											:isRemark="false"
											:listTitle='stroePssbyTitle'
											:storeName="storePassbyChartList[i].storeName"
											:dataList=storePassbyChartList[i].chartData></report-chart>
				<!--门店 当日路经客流-->
				<report-ratio-table
					v-if="storePassbyFlowList.length"
					title='店铺客流分析'
					:page='(14*i+8).toString()'
					:listTitle='stroePssbyTitle'
					:tableColumn='passbyTableColunm'
					:tableData='storePassbyFlowList[i].tableData'
					:storeName="storePassbyFlowList[i].storeName"
				></report-ratio-table>
				<report-age-gender-chart title='店铺客流分析'
																 v-if="ageGenderChartData.length"
																 :page='(14*i+9).toString()'
																 :listTitle='ageGenderTitle("enter")'
																 :storeName="ageGenderChartData[i].storeName"
																 :dataList=ageGenderChartData[i].chartData></report-age-gender-chart>
				<!--当日进店年龄性别入客流-->
				<report-age-gender-table
					v-if="storeAgeGenderFlowList.length"
					title='店铺客流分析'
					:page='(14*i+10).toString()'
					:listTitle='storeAgeGenderTitle("enter")'
					:tableColumn='ageGenderTableColumn'
					:tableData='storeAgeGenderFlowList[i].tableData'
					:storeName="storeAgeGenderFlowList[i].storeName"
				></report-age-gender-table>
				<!--当日进店年龄性别出客流-->
				<report-age-gender-chart title='店铺客流分析'
																 v-if="ageGenderExitChartData.length"
																 :page='(14*i+11).toString()'
																 :listTitle='ageGenderTitle("exit")'
																 :storeName="ageGenderExitChartData[i].storeName"
																 :dataList=ageGenderExitChartData[i].chartData></report-age-gender-chart>
			
				<report-age-gender-table
					v-if="storeAgeGenderExitFlowList.length"
					title='店铺客流分析'
					:page='(14*i+12).toString()'
					:listTitle='storeAgeGenderTitle("exit")'
					:tableColumn='ageGenderTableColumn'
					:tableData='storeAgeGenderExitFlowList[i].tableData'
					:storeName="storeAgeGenderExitFlowList[i].storeName"
				></report-age-gender-table>
				<!--当日路经年龄性别客流-->
				<report-age-gender-chart title='店铺客流分析'
																 v-if="storeAgeGenderPssbyFlowChart.length"
																 :page='(14*i+13).toString()'
																 :listTitle='storeAgeGenderPssbyTitle'
																 :storeName="storeAgeGenderPssbyFlowChart[i].storeName"
																 :dataList=storeAgeGenderPssbyFlowChart[i].chartData></report-age-gender-chart>
				<report-age-gender-table
					v-if="storeAgeGenderPssbyFlowList.length"
					title='店铺客流分析'
					:page='(14*i+14).toString()'
					:listTitle='storeAgeGenderPssbyTitle'
					:tableColumn='ageGenderTableColumn'
					:tableData='storeAgeGenderPssbyFlowList[i].tableData'
					:storeName="storeAgeGenderPssbyFlowList[i].storeName"
				></report-age-gender-table>
<!--				<report-dwell title='店铺客流分析' v-if="storeDwellList.length" :page='(7*i+7).toString()' :enterData='storeDwellList[i]'-->
<!--											:listTitle='dwellTitle'></report-dwell>-->
			</div>

			<report-back-cover></report-back-cover>
		
		</div>
	</div>
</template>
<script>
  import reportChart from '@/components/report/newReport/report_chart'
  import reportCover from '@/components/report/newReport/report_cover'
  import reportOverview from './components/report-overview'
  import reportDwell from './components/report-dwell'
  import reportBackCover from '@/components/report/newReport/report_back_cover'
  import reportTrendChart from './components/report-trend-chart'
  import reportAgeGenderChart from './components/report-age-gender-chart'
  import reportAgeGenderTable from './components/report-age-gender-table'
  import reportRatioTable from '@/components/report/newReport/report_ratio_table'
  import mixins from '../reportMixin.js'
  import { getEntity } from '@/api/home'
  import axios from 'axios'
  import {  ageGenderPassbyTrend, passbyTrend, ageGenderTrend, getDwellTime } from '@/api/report'

  import moment from 'moment/moment'
  import { disabledDate,getToken } from '@/libs/util.js'

  import { entityFlow } from '@/api/entityNew'
  import storeMixin from './mixin'
  import config from '@/config/index'

  export default {
    components: {
      reportCover,
      reportBackCover,
      reportOverview,
      reportChart,
      reportTrendChart,
      reportRatioTable,
      reportAgeGenderChart,
      reportAgeGenderTable,
      reportDwell
    },
    data () {
      return {
        selectDateTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        options3: disabledDate,
        storeListOptions:[],
        showReport:false
      }
    },
    mixins: [mixins, storeMixin],
    async mounted () {
      const data = await getEntity(this.propertyId, 50)
      // this.storeListOptions = [{
      //   name:'全部',
      //   id:-1
			// },...data.data.data]
      this.storeListOptions = [...data.data.data]
			

    },
		watch:{
      // storeSelected:{
      //   handler(newval,oldval){
      //     if(_.differenceWith(newval, oldval)[0] === -1){
      //       this.storeSelected = this.storeListOptions.map(o=>{
      //         return o.id
			// 			})
			// 		}
      //     if(_.differenceWith(oldval,newval)[0] === -1){
      //       this.storeSelected = []
			// 		}
      //     if(this.storeSelected.length===1 && this.storeSelected[0] === -1){
      //       this.storeSelected = []
			// 		}
			// 	},
			// 	deep:true
			// }
		},
    methods: {
      downloadReport (type, time) {
        if(!this.storeSelected){
          this.$alert({ content: '请选择门店' })
          return false
				}
        if (time === '') {
          this.$alert({ content: '请选择时间' })
          return false
        }
        let pdfUrl = window.location.href.split('/#/')[0]
        let token = getToken()
        let objName = (pdfUrl.split('://')[1]).split('.')[0]
        let ht = pdfUrl.split('://')[0]
        let url = pdfUrl + '/#/downloadStoreDayPdf?propertyId=' + this.propertyId + '&date=' + time + '&token=' + token + '&bzid=' + this.storeBzids+'&storeNames='+encodeURI(this.storeNames)
        this.$vs.loading()
        const datelist = time.split(',')
        const filename = datelist[0] === datelist[1] ? datelist[0] : time
        axios.post(ht + config.pdfBaseUrl + '/pdf/execute', {
          filename: time+this.storeNames,
          project: objName,
          url: url
        }, { responseType: 'blob' })
          .then((response) => {
            this.$vs.loading.close()
            var blob = new Blob([response.data])
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = filename + '门店日报'+this.storeNames + '.pdf' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      reportQuery () {
        this.headerDate(this.selectDateTime)
        const yesterday = moment(this.selectDateTime).subtract(1, 'days').format('YYYY-MM-DD')
        this.showReport = true
				Promise.all([
          /*      newReportEnter({
									property_id: this.propertyId,
									timeRange: `${this.selectDateTime},${this.selectDateTime}`,
									report_type: 'day'
								}),
								//  查询当天客流趋势
								getanalysiseeo({
									bzid: this.bzid,
									type: 'enter',
									range: `${this.selectDateTime},${this.selectDateTime}`,
									innerRange: '1h'
								}),
								// 前一天客流趋势
								getanalysiseeo({ bzid: this.bzid, type: 'enter', range: yesterday + ',' + yesterday, innerRange: '1h' }),
								//年龄性别趋势(查询当天)3
								getEntityFlow({ property_id: this.propertyId, range: `${this.selectDateTime},${this.selectDateTime}` }),
								//年龄性别趋势(前一天)4
								getEntityFlow({ property_id: this.propertyId, range: yesterday + ',' + yesterday }),
								//年龄性别趋势（表格）5
								ageGenderTrend({
									property_id: this.propertyId,
									bzid: this.bzid,
									time1: `${this.selectDateTime},${this.selectDateTime}`,
									type: 'enter',
									range: 'Hour'
								}),*/
          //当日进店客流6
          entityFlow({
            type: 'enter',
            range: 'Hour',
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            time2: yesterday + ',' + yesterday,
            bzid: this.storeBzids,
          }),
          //当日出店客流6
          entityFlow({
            type: 'exit',
            range: 'Hour',
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            time2: yesterday + ',' + yesterday,
            bzid: this.storeBzids,
          }),
          //路经客流7
          passbyTrend({
            property_id: this.propertyId,
            bzid: this.storeBzids,
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            time2: yesterday + ',' + yesterday,
            type: 'enter',
            range: 'Hour',
          }),
          //年龄性别趋势（表格）7
          ageGenderTrend({
            property_id: this.propertyId,
            bzid: this.storeBzids,
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            type: 'enter',
            range: 'Hour'
          }),
          //年龄性别出客流趋势（表格）7
          ageGenderTrend({
            property_id: this.propertyId,
            bzid: this.storeBzids,
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            type: 'exit',
            range: 'Hour'
          }),
          // 性别年龄　路经　客流趋势9
          ageGenderPassbyTrend({
            property_id: this.propertyId,
            bzid: this.storeBzids,
            time1: `${this.selectDateTime},${this.selectDateTime}`,
          }),
          //停留时间10
          // getDwellTime({
          //   property_id: this.propertyId,
          //   bzid: this.storeBzids,
          //   time1: `${this.selectDateTime},${this.selectDateTime}`,
          //   range: 'Date'
          // })
        ]).then(res => {
          /*          const gender = {
											today: res[3].data.data.gender_propotion,
											yesterday: res[4].data.data.gender_propotion
										}
										// 客流总览
										this.reportOneData(res[0].data.data, gender)
										// 客流趋势
										this.trendDataList(res[1].data.data, res[2].data.data)
										//年龄性别趋势
										this.ageGenderList(res[5].data.data.time1[0])
										//年龄性别趋势（表格）
										this.ageGenderTableData = this.ageGenderTable(res[5].data.data.time1[0],'hourly')*/
          
          //门店数据（当日入客流）
          this.storeEnterChartList = Object.freeze(this.storeEnterChart(res[0].data.data))
          this.storeEnterFlowList = Object.freeze(this.storeEnterFlow(res[0].data.data))
					
          //门店数据（当日出客流）
          this.storeExitFlowList = Object.freeze(this.storeEnterFlow(res[1].data.data))
					this.storeExitChartList = Object.freeze(this.storeEnterChart(res[1].data.data))
					
          //总客流
					const totalData = this.getTotalFlowList(res[0].data.data, res[1].data.data)
          this.storeTotalFlowList = Object.freeze(this.storeEnterFlow(totalData));
          this.storeTotalChartList = Object.freeze(this.storeEnterChart(totalData));
					
          //路径客流
          this.storePassbyFlowList = Object.freeze(this.storeEnterFlow(res[2].data.data))
          this.storePassbyChartList = Object.freeze(this.storeEnterChart(res[2].data.data));
					
          //门店进店年龄性别客流

          this.ageGenderChartData = Object.freeze(this.ageGenderList(res[3].data.data.time1,'hourly'));
          console.log(_.cloneDeep(this.ageGenderChartData))
          this.storeAgeGenderFlowList = Object.freeze(res[3].data.data.time1.map(o => {
            return {
              storeName: o.name,
              tableData: this.ageGenderTable(o, 'hourly')
            }
          }))
          //门店出店年龄性别客流
					this.ageGenderExitChartData =  Object.freeze(this.ageGenderList(res[4].data.data.time1,'hourlyExit'));
          this.storeAgeGenderExitFlowList = Object.freeze(res[4].data.data.time1.map(o => {
            return {
              storeName: o.name,
              tableData: this.ageGenderTable(o, 'hourlyExit')
            }
          }))
          // 性别年龄　路经　客流趋势
          this.storeAgeGenderPssbyFlowChart = Object.freeze(this.ageGenderList(res[5].data.data.time1, 'passbyHourly'))
          this.storeAgeGenderPssbyFlowList = Object.freeze(res[5].data.data.time1.map(o => {
            return {
              storeName: o.name,
              tableData: this.ageGenderTable(o, 'passbyHourly')
            }
          }))
					//停留时间
          // this.storeDwellList = res[6].data.data.time1 || []
        })
      },
    },
  }
</script>
<style lang="less">
	.report-center {
		min-width: 1200Px;
		
		.filter-box {
			background-color: #fff;
			margin-top: 9px;
			padding: 20px 30px;
			box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
			border-radius: 6px;
			margin-bottom: 20px;
			
			.ivu-input {
				width: 230px;
				font-size: 16px;
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
</style>
