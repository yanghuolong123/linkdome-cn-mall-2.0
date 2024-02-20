<template>
    <div class="report-center" style="min-width: 1200px;">
        <div style="margin-bottom: 21px">
            <div class="day-report-date flex-center">
                <DatePicker
                        type="date"
                        @on-change="selectTimeDate"
                        :editable="false"
                        :options="options3"
                        placeholder="选择日期"
                        v-model="selectDateTime"
                >
                </DatePicker>
                <div class="report-query" v-on:click="reportQuery">
                    {{ $t('query') }}
                </div>
                <div
                        class="icon-download"
                        v-on:click="downloadReport('day', selectDateText)"
                        :title="$t('report.reportDwonload')"
                >
                    <icons type="daoru" color="#2a7dc1" :size="20"></icons>
                </div>
            </div>
        </div>
        <report-suggest
                v-if="showPDF && userRole === '超级管理员'"
                @suggestSubmit="suggestSubmit"
                :propertyId="propertyId"
                :date="selectDateText"
                :suggestText="suggestText"
        ></report-suggest>
        <div class="pdf-text-box" style="max-width:1200px" v-if="showPDF">
            <div id="pdfDom">
                <!-- 封面 -->
                <report-cover
                        :suggestText="suggestText"
                        :titleName="$t('report.linkdomeDailyReport')"
                        :pageTotal="`${getTotalPage()}`"
                ></report-cover>
                <!-- 总览 -->
                <report-one
                        :title="$t('report.enterOverview')"
                        :page="`${getPage(1)}`"
                        v-if="enabledModules.includes(1)"
                        :enterData="enterData"
                        :listTitle="oneListData"
                ></report-one>
                <!--客流趋势  -->
                <report-chart
                        v-if="enabledModules.includes(2)"
                        :page="`${getPage(2)}`"
                        :chartHeight="600"
                        :title="$t('report.enterTrend')"
                        :listTitle="trendTitle"
                        :dataList="trendChartData"
                ></report-chart>
                <report-ratio-table
                        v-if="enabledModules.includes(2)"
                        :title="$t('report.enterTrend')"
                        :page="`${getPage(2)+1}`"
                        :listTitle="trendTitle"
                        :tableColumn="ratioTableColumn"
                        :tableData="ratioTableData"
                ></report-ratio-table>
                <!-- 出入口 -->
                <report-chart
                        :chartHeight="600"
                        :title="$t('report.gateEnter')"
                        v-if="enabledModules.includes(3)"
                        :page="`${getPage(3)}`"
                        :listTitle="gateTitle"
                        :dataList="gateChartData"
                ></report-chart>
                <!-- <report-gate-table title='出入口客流' page='5' :tableData='gateTableData' :listTitle='gateTitle'></report-gate-table> -->

                <!-- 店铺 -->
                <report-chart
                        :chartHeight="600"
                        :title="$t('report.storeEnter')"
                        v-if="enabledModules.includes(4)"
                        :page="`${getPage(4)}`"
                        :listTitle="shopTitle"
                        :dataList="shopChartData"
                ></report-chart>
                <!-- 楼层下的商铺 -->
                <report-chart-multi
                        :title="$t('report.storeEnter')"
                        v-for="(item, index) in allFloorStore"
                        :key="index"
                        v-if="enabledModules.includes(5)"
                        :page="`${getPage(5) + index}`"
                        :listTitle="floorStoreTitle"
                        :dataList="item.data"
                ></report-chart-multi>
                <!-- 业态下的商铺 -->
                <report-chart-multi
                        :title="$t('report.storeEnter')"
                        v-if="enabledModules.includes(6)"
                        :page="`${getPage(6)}`"
                        :listTitle="formatStoreTitle"
                        :dataList="allFormatStore"
                ></report-chart-multi>
                <!-- 热力图 -->
                <report-heat-map
                        :key="'heatMap' + index"
                        v-for="(item, index) in allHeatMap"
                        :title="$t('report.heatmap')"
                        v-if="enabledModules.includes(7)"
                        :page="`${getPage(7) + index }`"
                        :listTitle="item.title"
                        :dataList="item.data"
                        :isRemark="false"
                        :chartHeight="600"
                ></report-heat-map>
                <!-- 店铺关联 无序-->
                <report-table
                        :title="$t('report.storeAsso')"
                        :listTitle="orderlyTitle"
                        :tableData="orderlyData"
                        v-if="enabledModules.includes(8)"
                        :page="`${getPage(8)}`"
                ></report-table>
                <!-- 店铺关联 有序-->
                <report-table
                        :title="$t('report.storeAsso')"
                        :listTitle="disorderTitle"
                        :tableData="disorderData"
                        v-if="enabledModules.includes(9)"
                        :page="`${getPage(9)}`"
                ></report-table>
                <!-- 停留时间 业态-->
                <report-chart
                        :chartHeight="600"
                        :isRemark="false"
                        :title="$t('report.dwellTime')"
                        v-if="enabledModules.includes(10)"
                        :page="`${getPage(10)}`"
                        :listTitle="dwellTitle"
                        :dataList="dwellChartData"
                        chartType="dwell"
                ></report-chart>
                <!-- 停留时间 业态下的商铺-->
                <report-chart-multi
                        chartType="dwell"
                        :title="$t('report.dwellTime')"
                        v-if="enabledModules.includes(11)"
                        :page="`${getPage(11)}`"
                        :listTitle="formatDwellStoreTitle"
                        :dataList="allDwellFormatStore"
                ></report-chart-multi>
                <report-back-cover></report-back-cover>
            </div>
        </div>
    </div>
</template>
<script>
  import reportCover from '@/components/report/newReport/report_cover'
  import reportOne from '@/components/report/newReport/report_one'
  import reportChart from '@/components/report/newReport/report_chart'
  import reportHeatMap from '@/components/report/newReport/report_heat_map'
  import reportRatioTable from '@/components/report/newReport/report_ratio_table'
  import reportSuggest from '@/components/report-public/report_suggest'
  import reportBackCover from '@/components/report/newReport/report_back_cover'
  import reportTable from '@/components/report/newReport/report_table'
  import reportChartMulti from '@/components/report/newReport/report_chart_multi'
  import reportRemark from '@/components/report/newReport/report_remark'
  import reportGateTable from '@/components/report/newReport/report_gate_table'
  import { mapState } from 'vuex'

  import moment from 'moment'
  import _ from 'lodash'
  import Bus from '@/libs/bus.js'
  import mixins from './reportMixin.js'
  import {
    newReportEnter,
    newReportSuggest,
    newReportGate,
    newReportShop,

  } from '@/api/report'
  import { getanalysiseeo } from '@/api/home'
  import {
    newReportFloorStore,
    newReportFormatStore,
    newReportHeatMap,
    newReportOrderly,
    newReportDisorder,
    newReportDwellStore,
    newReportDwellFormat,
  } from '@/api/new_report'

  export default {
    name: 'report-day',
    mixins: [mixins],
    components: {
      reportCover,
      reportOne,
      reportChart,
      reportHeatMap,
      reportRatioTable,
      reportSuggest,
      reportBackCover,
      reportTable,
      reportChartMulti,
      reportRemark,
      reportGateTable,
    },
    data () {
      return {
        allFloorStore: [],
        clickData: 0,
        showPDF: false,
        selectDateTime: '',
        selectDateText: '',
        options3: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now() - 86400000
          },
        },
        trendChartData: {
          option: {},
          remarkData: [],
        },
        gateChartData: {
          option: {},
          remarkData: [],
        },
        gateTableData: {
          column: [],
          data: [],
        },
        shopChartData: {
          option: {},
          remarkData: [],
        },
        ratioTableData: [],
        allFormatStore: [],
        allHeatMap: [],

        dwellChartData: {
          optin: {},
          remarkData: [],
        },
        allDwellFormatStore: [],

      }
    },
    computed: {
      ...mapState({
        propertyId: (state) => state.home.headerAction,
      }),
      oneListData () {
        return [
          {
            name: this.$t('report.todayEnterOverview'),
            text: `${this.$t('report.enterTime')}:` +
              this.saveHeaderData.year +
              '.' +
              this.saveHeaderData.time,
          },
          {
            name: this.$t('report.yesterdayEnterOverview'),
            text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.yester,
          },
        ]
      },
      trendTitle () {
        return {
          name: this.$t('report.todayEnterTrend'),
          text:
            `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            '.' +
            this.saveHeaderData.time,
        }
      },
      gateTitle () {
        return {
          name: this.$t('report.todayGateTop10Compare'),
          text:
            `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            '.' +
            this.saveHeaderData.time,
        }
      },
      shopTitle () {
        return {
          name: this.$t('report.todayStoreTop10Compare'),
          text:
            `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            '.' +
            this.saveHeaderData.time,
        }
      },
      floorStoreTitle () {
        return {
          name: '当日各楼层TOP10店铺客流分析',
          text:
            `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            '.' +
            this.saveHeaderData.time,
        }
      },
      formatStoreTitle () {
        return {
          name: this.$t('report.todayBussStoreTop10'),
          text:
            `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            '.' +
            this.saveHeaderData.time,
        }
      },
      orderlyTitle () {
        return {
          relevancy: {
            name: this.$t('report.todayUnorderTop10'),
            text:
              `${this.$t('report.enterTime')}:` +
              this.saveHeaderData.year +
              '.' +
              this.saveHeaderData.time,
          },
          inversion: {
            name: this.$t('report.todayUnorderConversionTop10'),
            text:
              `${this.$t('report.enterTime')}:` +
              this.saveHeaderData.year +
              '.' +
              this.saveHeaderData.time,
          },
        }
      },
      disorderTitle () {
        return {
          relevancy: {
            name: this.$t('report.todayOrderTop10'),
            text:
              `${this.$t('report.enterTime')}:` +
              this.saveHeaderData.year +
              '.' +
              this.saveHeaderData.time,
          },
          inversion: {
            name: this.$t('report.todayOrderConversionTop10'),
            text:
              `${this.$t('report.enterTime')}:` +
              this.saveHeaderData.year +
              '.' +
              this.saveHeaderData.time,
          },
        }
      },
      dwellTitle () {
        return {
          name: this.$t('report.todayDwellTimeTop10'),
          text:
            `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            '.' +
            this.saveHeaderData.time,
        }
      },
      formatDwellStoreTitle () {
        return {
          name: this.$t('report.todayDwellTimeStoreTop10'),
          text:
            `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            '.' +
            this.saveHeaderData.time,
        }
      },
      pageConfig () {
        return [
          {
            id: 1,
            count: 1,
            name: this.$t('report.enterOverview'),
          }, {
            id: 2,
            count: 2,
            name: this.$t('report.enterTrend'),
          }, {
            id: 3,
            count: 1,
            name: this.$t('gateEnter'),
          }, {
            id: 4,
            count: 1,
            name: this.$t('report.storeEnter'),
          }, {
            id: 5,
            count: this.allFloorStore.length,
            name: `${this.$t('report.storeEnter')}-${this.$t('floor')}`,
          }, {
            id: 6,
            count: 1,
            name: `${this.$t('report.storeEnter')}-${this.$t('bussinessType')}`,
          }, {
            id: 7,
            count: this.allHeatMap.length,
            name: this.$t('report.heatmap'),
          }, {
            id: 8,
            count: 1,
            name: `${this.$t('report.storeEnter')}-${this.$t('无序')}`,
          }, {
            id: 9,
            count: 1,
            name: `${this.$t('report.storeEnter')}-${this.$t('有序')}`,
          }, {
            id: 10,
            count: 1,
            name: `${this.$t('report.dwellTime')}-${this.$t('bussinessType')}`,
          }, {
            id: 11,
            count: 1,
            name: `${this.$t('report.dwellTime')}-${this.$t('store')}`,
          }
        ]
      },
      ratioTableColumn(){
        return {
          name1: [this.$t('time'), this.$t("Incoming")],
          name2: [this.$t('report.qoqAnaly')],
          name3: [this.$t('time'), this.$t("Incoming"), this.$t('report.growthRate')],
        }
      },
      orderlyData(){
        return  {
          relevancy: {
            column: [this.$t('report.entityName'), this.$t('report.entityName'), this.$t('Relevancy')],
            table: [],
          },
          inversion: {
            column: [this.$t('report.entityName'), this.$t('report.entityName'), this.$t('report.Conversion')],
            table: [],
          },
        }
      },
      disorderData(){
        return {
          relevancy: {
            column: [this.$t('report.entityName'), this.$t('report.entityName'), this.$t('Relevancy')],
            table: [],
          },
          inversion: {
            column: [this.$t('report.entityName'), this.$t('report.entityName'), this.$t('report.Conversion')],
            table: [],
          },
        }
      }
    },
    mounted () {
      let time = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
      this.selectDateTime = time
      this.selectDateText = time + ',' + time
      this.reportQuery()
    },
    methods: {
      selectTimeDate (value) {
        if (value == '') {
          this.selectDateTime = ''
          this.selectDateText = ''
          return false
        }
        this.selectDateText = value + ',' + value
      },
      async reportQuery () {
        if (this.selectDateText === '') {
          this.$alert({ content: this.$t('fn.select', [this.$t('time')]) })
          return false
        }
        await this.getReportSetting()
        if (!this.enabledModules.length) {
          this.$alert({ content: this.$t('report.noConfig') })
          return
        }
        this.headerDate(this.selectDateTime)
        let yesterday = moment(this.selectDateTime)
          .subtract(1, 'days')
          .format('YYYY-MM-DD')
        let lastWeek = moment(this.selectDateTime)
          .subtract(1, 'weeks')
          .format('YYYY-MM-DD')
        this.showPDF = false
        Promise.all([
          // 建议
          newReportSuggest({
            property_id: this.propertyId,
            date: this.selectDateText,
          }),
          // 客流总览
          newReportEnter({
            property_id: this.propertyId,
            timeRange: this.selectDateText,
            report_type: 'day',
          }),
          //  当前客流趋势
          getanalysiseeo({
            bzid: this.bzid,
            type: 'enter',
            range: this.selectDateText,
            innerRange: '1h',
          }),
          // 当前集客量趋势
          // getanalysiseeo({ bzid: this.bzid, type: 'occupancy', range: this.selectDateText, innerRange: '1h' }),
          // 昨日客流趋势
          getanalysiseeo({
            bzid: this.bzid,
            type: 'enter',
            range: yesterday + ',' + yesterday,
            innerRange: '1h',
          }),
          // 出入口
          newReportGate({
            timeRange1: this.selectDateText,
            timeRange2: yesterday + ',' + yesterday,
            report_type: 'day',
            property_id: this.propertyId,
          }),
          // 商铺
          newReportShop({
            time1: this.selectDateText,
            time2: yesterday + ',' + yesterday,
            report_type: 'day',
            property_id: this.propertyId,
          }),
          // 楼层下的商铺
          newReportFloorStore({
            time: this.selectDateText,
            property_id: this.propertyId,
          }),
          // 业态下的商铺
          newReportFormatStore({
            time: this.selectDateText,
            property_id: this.propertyId,
          }),
          // 热力图
          newReportHeatMap({
            time: this.selectDateText,
            property_id: this.propertyId,
          }),
          // 关联度 无序
          newReportOrderly({
            time: this.selectDateText,
            property_id: this.propertyId,
            sort_parameter: 'rate',
            report_type: 'day',
          }),
          newReportOrderly({
            time: this.selectDateText,
            property_id: this.propertyId,
            sort_parameter: 'value',
            report_type: 'day',
          }),
          // 关联度 有序
          newReportDisorder({
            time: this.selectDateText,
            property_id: this.propertyId,
            sort_parameter: 'rate',
            report_type: 'day',
          }),
          newReportDisorder({
            time: this.selectDateText,
            property_id: this.propertyId,
            sort_parameter: 'value',
            report_type: 'day',
          }),
          // 停留时间 业态
          newReportDwellFormat({
            time: this.selectDateText,
            property_id: this.propertyId,
          }),
          // 停留时间 业态下的商铺
          newReportDwellStore({
            time: this.selectDateText,
            property_id: this.propertyId,
          }),
          // 上周客流趋势
          getanalysiseeo({
            bzid: this.bzid,
            type: 'enter',
            range: lastWeek + ',' + lastWeek,
            innerRange: '1h',
          }),
        ]).then((res) => {
          this.showPDF = true
          // 建议
          this.suggestText = res[0].data.data[0].property_suggest
          // 客流总览
          this.enabledModules.includes(1) && this.reportOneData(res[1].data.data)
          // 客流趋势
          this.enabledModules.includes(2) && this.trendDataList(
            res[2].data.data,
            res[3].data.data,
            res[15].data.data
          )
          // 出入口
          this.enabledModules.includes(3) && this.gateDataList(res[4].data.data)
          // 商铺
          this.enabledModules.includes(4) && this.shopDataList(res[5].data.data)
          // 楼层下的商铺
          this.enabledModules.includes(5) && this.floorDataList(res[6].data.data)
          // 业态下的商铺
          this.enabledModules.includes(6) && this.formatDataList(res[7].data.data)
          // 热力图
          this.enabledModules.includes(7) && this.heatMapData(res[8].data.data, 'today')
          // 关联度 无序
          this.enabledModules.includes(8) && this.relevanceTableData(
            res[9].data.data.matrixList,
            res[10].data.data.matrixList,
            'orderlyData'
          )
          // 关联度 有序
          this.enabledModules.includes(9) && this.relevanceTableData(
            res[11].data.data,
            res[12].data.data,
            'disorderData'
          )
          // 停留时间 业态
          this.dwellFormatData(res[13].data.data)
          // 停留时间 业态 商铺
          this.dwellFormatStoreData(res[14].data.data)
        })
      },
      // 趋势数据
      trendDataList (enterData, yesterdayData, lastWeekData) {
        this.ratioTableData = []
        let highest = {
          number: 0,
          time: '',
        }
        let highestYest = {
          number: 0,
          time: '',
        }
        let highestWeek = {
          number: 0,
          time: '',
        }
        this.trendChartData.option = _.cloneDeep(this.enterOption)
        let enterObj = {
          name: this.$t('report.todayEnter'),
          color: '#745AEF',
          type: 'line',
          data: [],
        }
        let enterObjYest = {
          name: this.$t('report.yesterdayEnter'),
          color: '#00A0E9',
          type: 'line',
          data: [],
        }
        let enterObjWeek = {
          name: this.$t('report.lastWeekSameDay'),
          color: '#00A0A0',
          type: 'line',
          data: [],
        }
        // let occupancyObj = {
        //    name: '集客量',
        //       color: '#00A0E9',
        //       type: 'line',
        //       data: []
        // }
        enterData.forEach((list, index) => {
          let time = moment(list.begin).format('HH:mm')
          this.trendChartData.option.xAxis.categories.push(time)
          enterObj.data.push(list.enter)
          enterObjYest.data.push(yesterdayData[index].enter)
          enterObjWeek.data.push(lastWeekData[index].enter)
          if (Number(list.enter) > highest.number) {
            highest.number = list.enter
            highest.time = Number(moment(list.begin).format('H'))
          }
          if (Number(yesterdayData[index].enter) > highestYest.number) {
            highestYest.number = yesterdayData[index].enter
            highestYest.time = Number(
              moment(yesterdayData[index].begin).format('H')
            )
          }
          if (Number(lastWeekData[index].enter) > highestWeek.number) {
            highestWeek.number = lastWeekData[index].enter
            highestWeek.time = Number(
              moment(lastWeekData[index].begin).format('H')
            )
          }
          // 表格
          this.ratioTableData.push({
            data: [
              moment(list.begin).format('YYYY-MM-DD-HH:mm'),
              list.enter.toLocaleString() + this.$t('personTime'),
              moment(yesterdayData[index].begin).format('YYYY-MM-DD-HH:mm'),
              yesterdayData[index].enter.toLocaleString() + this.$t('personTime'),
              this.sequential(list.enter, yesterdayData[index].enter) + '%',
            ],
          })
        })
        //  this.trendChartData.option.series=[enterObj,occupancyObj]
        this.trendChartData.option.series = [
          enterObj,
          enterObjYest,
          enterObjWeek,
        ]
        let cuT = _.sumBy(enterData, (o) => {
          return o.enter
        })
        let yeT = _.sumBy(yesterdayData, (o) => {
          return o.enter
        })
        this.ratioTableData.push({
          data: [
            this.$t('total'),
            cuT.toLocaleString() + this.$t('personTime'),
            '-',
            yeT.toLocaleString() + this.$t('personTime'),
            this.sequential(cuT, yeT) + '%',
          ],
        })
        let enterNumber = this.trendChartData.option.series[0].data
        let yestNum = this.trendChartData.option.series[1].data
        let weekNum = this.trendChartData.option.series[2].data
        this.trendChartData.remarkData = this.language === 'en-US' ? [
          `After opening for an hour, the passenger flow was ${enterNumber[0].toLocaleString()} people on the same day, ${yestNum[0].toLocaleString()} people yesterday, and ${weekNum[0].toLocaleString()} people on the same day last week`,
          `One hour before the end of business, the passenger flow was ${enterNumber[enterNumber.length - 1].toLocaleString()} on the same day, ${yestNum[yestNum.length - 1].toLocaleString()} on the same day yesterday, and ${weekNum[weekNum.length - 1].toLocaleString()} on the same day last week`,
          `On the same day, the peak passenger flow reached ${highest.number.toLocaleString()} people from ${highest.time} to ${(highest.time + 1)}; Yesterday from ${highestYest.time} to ${(highestYest.time + 1)}, the peak passenger flow reached ${highestYest.number.toLocaleString()} people; Last week, from ${(highestWeek.time ? highestWeek.time : 0)} to ${highestWeek.time + 1} on the same day, the peak passenger flow reached ${highestWeek.number.toLocaleString()} people`
        ] : [
          '开始营业后一小时间客流量 当日 ' +
          enterNumber[0].toLocaleString() +
          '人次' +
          ' 昨日 ' +
          yestNum[0].toLocaleString() +
          '人次' +
          ' 上周同日 ' +
          +weekNum[0].toLocaleString() +
          '人次',
          '结束营业前一小时间客流量 当日 ' +
          enterNumber[enterNumber.length - 1].toLocaleString() +
          '人次' +
          ' 昨日 ' +
          yestNum[yestNum.length - 1].toLocaleString() +
          '人次' +
          ' 上周同日 ' +
          weekNum[weekNum.length - 1].toLocaleString() +
          '人次',
          '当日' +
          highest.time +
          '点到' +
          (highest.time + 1) +
          '点达到客流峰值' +
          highest.number.toLocaleString() +
          '人次；' +
          '昨日' +
          highestYest.time +
          '点到' +
          (highestYest.time + 1) +
          '点达到客流峰值' +
          highestYest.number.toLocaleString() +
          '人次；' +
          '上周同日' +
          (highestWeek.time ? highestWeek.time : 0) +
          '点到' +
          (highestWeek.time + 1) +
          '点达到客流峰值' +
          highestWeek.number.toLocaleString() +
          '人次',
        ]
      },
      gateDataList (gateData) {
        this.gateChartData.option = _.cloneDeep(this.enterOption)
        let time = moment(this.selectDateTime).format('YYYY-MM-DD')
        let time2 = moment(this.selectDateTime)
          .subtract(1, 'years')
          .format('YYYY-MM-DD')
        this.gateTableData.column = [
          this.$t('gateName'),
          `${this.$t('report.thePeriod')} (${time})`,
          `${this.$t('report.synchronism')} (${time2})`,
          this.$t('report.yoy'),
        ]
        let [currentObj, yesterObj, lastObj, lastWeekObj] = [
          {
            name: this.$t('report.todayEnter'),
            color: '#2081D4',
            type: 'column',
            data: [],
          },
          {
            name: this.$t('report.yesterdayEnter'),
            color: '#2BD9CF',
            type: 'column',
            data: [],
          },
          {
            name: this.$t('report.thePeriodEnter'),
            color: '#874bd9',
            type: 'column',
            data: [],
          },
          {
            name: this.$t('report.lastWeekSameDay'),
            color: '#554Dd0',
            type: 'column',
            data: [],
          },
        ]

        if (gateData.data) {
          gateData.data.forEach((list) => {
            currentObj.data.push(list.enter)
            const yNode = _.find(
              gateData.contrast,
              (o) => o.bzid === list.bzid
            )
            let yesterEnter = yNode && yNode.enter||0
            yesterObj.data.push(yesterEnter)
            const lNode =  _.find(gateData.period, (o) => o.bzid === list.bzid)
            let lastEnter =lNode && lNode.enter || 0
            lastObj.data.push(lastEnter)
            const lwNode =  _.find(
              gateData.last_week_day,
              (o) => o.bzid === list.bzid
            )
            let lastWeekEnter =lwNode&&lwNode.enter||0
            lastWeekObj.data.push(lastWeekEnter)
            this.gateTableData.data.push({
              name: list.name,
              curr: list.enter.toLocaleString(),
              last: lastEnter.toLocaleString(),
              basis: this.sequential(list.enter, lastEnter),
            })
            this.gateChartData.option.xAxis.categories.push(list.name)
          })
        }
        this.gateChartData.option.series = [
          currentObj,
          yesterObj,
          lastWeekObj,
        ]
        if (this.showLastYearData) {
          this.gateChartData.option.series.splice(-1, 0, lastObj)
        }
        this.gateChartData.remarkData = gateData.comment ? gateData.comment : []
      },
      shopDataList (shopData) {
        this.shopChartData.option = _.cloneDeep(this.enterOption)

        let [currentObj, yesterObj, lastObj] = [
          {
            name: this.$t('report.todayEnter'),
            color: '#2081d4',
            type: 'column',
            data: [],
          },
          {
            name: this.$t('report.yesterdayEnter'),
            type: 'column',
            color: '#2BD9CF',
            data: [],
          },
          {
            name: this.$t('report.lastWeekSameDay'),
            type: 'column',
            color: '#3DD0FC',
            data: [],
          },
        ]
        if (shopData.current) {
          _.take(shopData.current, 10).forEach((list) => {
            currentObj.data.push(list.data)
            if (shopData.contrast.length) {
              let yesterEnter = _.find(shopData.contrast, (o) => o.id === list.id)
                .data
              yesterObj.data.push(yesterEnter)
            } else {
              yesterObj.data.push(0)
            }
            if (shopData.last_week_day.length) {
              let lastEnter = _.find(
                shopData.last_week_day,
                (o) => o.id === list.id
              ).data
              lastObj.data.push(lastEnter)
            } else {
              lastObj.data.push(0)
            }
            this.shopChartData.option.xAxis.categories.push(list.name)
          })
        }
        this.shopChartData.option.series = [currentObj, yesterObj, lastObj]
        this.shopChartData.remarkData = shopData.comment ? shopData.comment : []
      },
      headerDate (value) {
        let headerDate = {
          year: moment(value).format('YYYY'),
          time: moment(value).format('MM.DD'),
          period: '',
          week: this.weekType(value),
          type: 'daily',
          yester: moment(value)
            .subtract(1, 'days')
            .format('YYYY.MM.DD'),
          reportDate: moment(value).format('YYYY.MM.DD'),
        }
        this.saveHeaderData = headerDate
        this.$store.commit('dayReportHeader', headerDate)
      },
      floorDataList (data) {
        this.allFloorStore = _.chunk(data, 8)
        this.allFloorStore.forEach((ele, index) => {
          this.multiChartData(ele, `allFloorStore+${index}`, 'chart')
        })
      },
      formatDataList (data) {
        this.allFormatStore = []
        this.multiChartData(data, 'allFormatStore', 'chart')
      },
      dwellFormatStoreData (data) {
        this.allDwellFormatStore = []
        this.multiChartData(data, 'allDwellFormatStore', 'dwell')

        this.$nextTick(() => {
          Bus.$emit('chartData')
          this.clickData = this.clickData + 1
        })
      },

    },
  }
</script>
<style lang="less">
    .ivu-spin-fix .ivu-spin-main {
        margin-left: -24px;
        margin-top: -24px;
    }

    .day-report-date {
        .ivu-input {
            width: 230px;
            font-size: 16px;
        }

        .ivu-input-suffix {
            i {
                height: 43px;
                line-height: 43px;
            }
        }
    }
</style>
<style lang="less" scoped>
    .demo-spin-col {
        height: 300px;
        position: relative;
        border: 1px solid #eee;
    }

    .pdf-text-box {
        background-color: #fff;
        margin: 0 auto;
        height: auto;
    }

    .day-report-type {
        float: left;
        margin-top: 7px;

        p {
            float: left;
            height: 45px;
            width: 120px;
            // background-color: #2d8cf0;
            text-align: center;
            font-size: 18px;
            color: #fff;
            line-height: 45px;
            margin-right: 30px;
            cursor: pointer;
            border-radius: 5px;

            &:last-child {
                margin-right: 0;
            }

            &:hover {
                background-color: #feb33d;
            }
        }

        .action {
            background-color: #9e9e9e !important;
        }
    }

    .title-name {
        font-size: 24px;
        color: #4096e5;
        font-weight: normal;
        border-left: 2px solid currentColor;
        line-height: 1;
        padding-left: 34px;
        margin-top: 15px;
        margin-left: 23px;
        float: left;
        position: relative;
    }

    .select-date-type {
        position: absolute;
        left: 100px;
        top: 0;

        i {
            color: #4096e5 !important;
        }

        .ivu-dropdown-menu {
            min-width: 55px !important;
        }
    }

    .day-report-date {
        margin-top: 9px;
        padding: 20px 0 20px 30px;
        background-color: #fff;
        box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, 0.4);
        border-radius: 6px;

        .report-query {
            float: left;
            height: 43px;
            padding: 0.6rem 2rem;
            border-radius: 6px;
            background: #37b5ed !important;
            border: 1px solid #37b5ed;
            color: #fff;
            font-size: 1rem;
            cursor: pointer;
            margin-left: 20px;
        }
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
        box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, 0.4);
        cursor: pointer;

        &:before {
            content: none;
        }
    }

    #pdfDom {
        background-color: #fff;
        overflow: auto;

        .reportOneText {
            float: left;
            width: 100% !important;
            height: auto;
            padding-bottom: 150px;
            border-bottom: 2px solid #99abb4;
        }
    }
</style>
