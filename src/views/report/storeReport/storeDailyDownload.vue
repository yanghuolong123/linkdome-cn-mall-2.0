<template>
	<div class="report-center" style="min-width: 1200px;">
		
		<div class="pdf-text-box">
			<div id="pdfDom" v-if="showPDF" style="width: 1200px;">
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
  import { getGroupOrganization } from '@/api/home'
  import {  ageGenderPassbyTrend, passbyTrend, ageGenderTrend, getDwellTime } from '@/api/report'
  import moment from 'moment/moment'
  import { entityFlow } from '@/api/entityNew'
  import { setToken } from '@/libs/util'
  import axios from 'axios'
  import storeMixin from './mixin'
  import {mapState} from 'vuex'
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
        showPDF: false,
        bzids: '',
        storeName:''
      }
    },
    computed: {
      ...mapState({
        pdfBaseUrl: state => state.report.pdfBaseUrl,
      }),
      selectDateText () {
        return this.$route.query.date
      },
      validStoreSelectedList(){
        return this.bzids.split(',')
			}
    },
    mixins: [mixins, storeMixin],
    mounted () {
      const { token, bzid } = this.$route.query
			this.storeName = decodeURI(this.$route.query.storeNames)
      this.bzids = bzid
      setToken(token, 1)
      this.parameterData()

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
        let reportDate = this.$route.query.date.split(',')[0]
        this.headerDate(reportDate)
        let yesterday = moment(reportDate).subtract(1, 'days').format('YYYY-MM-DD')
        this.showPDF = false
        Promise.all([
          /*      newReportEnter({
									property_id: this.propertyId,
									timeRange: `${this.selectDateTime},${this.selectDateTime}`,
									report_type: 'day'
								}),
								//  查询当天客流趋势
								getanalysiseeo({
									bzid: this.bzids,
									type: 'enter',
									range: `${this.selectDateTime},${this.selectDateTime}`,
									innerRange: '1h'
								}),
								// 前一天客流趋势
								getanalysiseeo({ bzid: this.bzids, type: 'enter', range: yesterday + ',' + yesterday, innerRange: '1h' }),
								//年龄性别趋势(查询当天)3
								getEntityFlow({ property_id: this.propertyId, range: `${this.selectDateTime},${this.selectDateTime}` }),
								//年龄性别趋势(前一天)4
								getEntityFlow({ property_id: this.propertyId, range: yesterday + ',' + yesterday }),
								//年龄性别趋势（表格）5
								ageGenderTrend({
									property_id: this.propertyId,
									bzid: this.bzids,
									time1: `${this.selectDateTime},${this.selectDateTime}`,
									type: 'enter',
									range: 'Hour'
								}),*/
          //当日进店客流6
          entityFlow({
            type: 'enter',
            range: 'Hour',
            time1: this.selectDateText,
            time2: yesterday + ',' + yesterday,
            bzid: this.bzids,
          }),
          //当日出店客流6
          entityFlow({
            type: 'exit',
            range: 'Hour',
            time1: this.selectDateText,
            time2: yesterday + ',' + yesterday,
            bzid: this.bzids,
          }),
          //路经客流7
          passbyTrend({
            property_id: this.propertyId,
            bzid: this.bzids,
            time1: this.selectDateText,
            time2: yesterday + ',' + yesterday,
            type: 'enter',
            range: 'Hour',
          }),
          //年龄性别趋势（表格）7
          ageGenderTrend({
            property_id: this.propertyId,
            bzid: this.bzids,
            time1: this.selectDateText,
            type: 'enter',
            range: 'Hour'
          }),
          //年龄性别出客流趋势（表格）7
          ageGenderTrend({
            property_id: this.propertyId,
            bzid: this.bzids,
            time1: this.selectDateText,
            type: 'exit',
            range: 'Hour'
          }),
          // 性别年龄　路经　客流趋势9
          ageGenderPassbyTrend({
            property_id: this.propertyId,
            bzid: this.bzids,
            time1: this.selectDateText,
          }),
          //停留时间10
          // getDwellTime({
          //   property_id: this.propertyId,
          //   bzid: this.bzids,
          //   time1: this.selectDateText,
          //   range: 'Date'
          // })
        ]).then(res => {
          this.showPDF = true
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
          this.handleDownload()
        })
      },
      handleDownload () {
        if(!this.pdfBaseUrl){
          this.$message.warning('未获取到pdf_center服务器地址')
        }else{
          setTimeout(() => {
            axios.get(this.pdfBaseUrl + '/pdf/finish', {
              params: { filename: this.selectDateText+this.storeName }
            })
          }, 3000)
				}
      },

    },
  }
</script>
<style lang="less">
	#pdfDom {
		background-color: #fff;
		overflow: hidden;
		
		.reportOneText {
			float: left;
		}
	}
</style>
