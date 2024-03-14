<template>
  <div class="report-center" style="min-width: 1200px;">
    <!-- 选择日期 查看 下载 -->
    <div style="width: 100%; margin-bottom: 21px">
      <div class="day-report-date flex-center">
        <el-date-picker
          v-model="selectDateTime"
          @change="selectTimeDate"
          type="week"
          :format="$t('datepicker_format')"
          :picker-options="{ firstDayOfWeek: 1, disabledDate: disabledDate }"
          placeholder="选择周"
        >
        </el-date-picker>
        <div class="report-query" v-on:click="reportQuery">
          {{ $t('query') }}
        </div>
        <div
          class="icon-download"
          v-on:click="downloadReport('week', callData)"
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
      :date="callData"
      :suggestText="suggestText"
    ></report-suggest>
    <!-- pdf 内容 -->
    <div class="pdf-text-box" v-if="showPDF" style="max-width:1200px">
      <div id="pdfDom">
        <!-- 封面 -->
        <report-cover
          :pageTotal="`${getTotalPage()}`"
          :titleName="$t('report.linkdomeWeekReport')"
          :suggestText="suggestText"
        ></report-cover>
        <!-- 总览 -->
        <report-one
          :title="$t('report.enterOverview')"
          :page="`${getPage(1)}`"
          v-if="enabledModules.includes(1)"
          :enterData="enterData"
          :listTitle="oneListData"
        ></report-one>
        <!-- 客流趋势 -->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
          :title="$t('report.enterTrend')"
          v-if="enabledModules.includes(2)"
          :page="`${getPage(2)}`"
          :listTitle="trendTitle"
          :dataList="trendChartData"
        ></report-chart>
        <!-- 客流趋势表格 -->
        <report-ratio-table
          :title="$t('report.enterTrend')"
          v-if="enabledModules.includes(2)"
          :page="`${getPage(2)+1}`"
          :listTitle="trendTitle"
          :tableColumn="ratioTableColumn"
          :tableData="ratioTableData"
        ></report-ratio-table>
        <!-- 出入口 -->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
          :title="$t('report.gateEnter')"
          v-if="enabledModules.includes(3)"
          :page="`${getPage(3)}`"
          :listTitle="gateTitle"
          :dataList="gateChartData"
        ></report-chart>
        <!-- 出入口表格 -->
        <report-week-five
          :title="$t('report.gateEnter')"
          v-if="enabledModules.includes(3)"
          :page="`${getPage(3)+1}`"
          :listTitle="gateTableTitle"
          :tableColumn="tableColumn"
          :tableData="tableData"
        ></report-week-five>

        <report-gate-table
          :title="$t('report.gateEnter')"
          v-if="enabledModules.includes(3)"
          :page="`${getPage(3)+2}`"
          :listTitle="gateTitle"
          :showLastYearData="showLastYearData"
          :tableColumn="gateTableColumn"
          :tableData="gateTableData"
        ></report-gate-table>

        <!-- 店铺 -->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
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
          :page="`${getPage(7) + index }`"
          :listTitle="item.title"
          :dataList="item.data"
          :isRemark="false"
          :chartHeight="600"
        ></report-heat-map>
        <!-- 店铺关联 有序-->
        <report-table
          :title="$t('report.storeAsso')"
          :listTitle="orderlyTitle"
          :tableData="orderlyData"
          v-if="enabledModules.includes(8)"
          :page="`${getPage(8)}`"
        ></report-table>
        <!-- 店铺关联 无序-->
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
          :clickData="clickData"
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
import reportOne from "@/components/report/newReport/report_one";
import reportWeekFive from "@/components/report/newReport/new_report_week_five";

import reportCover from "@/components/report/newReport/report_cover";
import reportHeatMap from "@/components/report/newReport/report_heat_map";
import reportRatioTable from "@/components/report/newReport/report_ratio_table";
import reportChart from "@/components/report/newReport/report_chart";
import reportSuggest from "@/components/report-public/report_suggest";
import reportBackCover from "@/components/report/newReport/report_back_cover";
import reportTable from "@/components/report/newReport/report_table";
import reportChartMulti from "@/components/report/newReport/report_chart_multi";

import reportGateTable from "@/components/report/newReport/new_report_week_gateTable";

// api
import {
  newReportEnter,
  newReportSuggest,
  newReportGate,
  newReportShop,
} from "@/api/report";
import { getanalysiseeo } from "@/api/home";
import {
  newReportFloorStore,
  newReportFormatStore,
  newReportHeatMap,
  newReportOrderly,
  newReportDisorder,
  newReportDwellStore,
  newReportDwellFormat,
  newReportGateLast,
} from "@/api/new_report";

import mixins from "./reportMixin.js";
import Bus from "@/libs/bus.js";
import _ from "lodash";
import moment from "moment";
export default {
  name: "report-week",
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportHeatMap,
    reportRatioTable,
    reportWeekFive,
    reportSuggest,
    reportBackCover,
    reportTable,
    reportChartMulti,
    reportGateTable,
  },
  data() {
    return {
      clickData: 0,
      showPDF: false,
      // 日期
      selectDateTime: "",
      selectDateText: "",
      callData: "",

      trendChartData: {
        option: {},
        remarkData: [],
      },
      gateChartData: {
        option: {},
        remarkData: [],
      },
      shopChartData: {
        option: {},
        remarkData: [],
      },

      ratioTableData: [],

      tableData: [],
      lastWeekDate: "",
      lastYearDate: "",
      allFloorStore: [],
      allFormatStore: [],
      allHeatMap: [],
      dwellChartData: {
        option: {},
        remarkData: [],
      },
      allDwellFormatStore: [],
      gateTableColumn: [],
      gateTableData: [],
    };
  },
  computed: {
    oneListData() {
      return [
        {
          name: this.$t('report.theWeekOverview'),
          text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
        },
        {
          name: this.$t('report.lastWeekEnterOverview'),
          text: this.$t('report.enterCyc')+':' + this.saveHeaderData.yester,
        },
      ];
    },
    trendTitle() {
      return {
        name:this.$t('report.thisWeekEnterTrend'),
        text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
      };
    },
    gateTitle() {
      return {
        name: this.$t('report.thisWeekGateTop10Compare'),
        text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
      };
    },
    gateTableTitle() {
      return {
        name: this.$t('report.thisWeekGateTop10'),
        text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
      };
    },
    shopTitle() {
      return {
        name: this.$t('report.thisWeekStoreTop10'),
        text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
      };
    },
    floorStoreTitle() {
      return {
        name: this.$t('report.thisWeekFloorStoreTop10'),
        text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
      };
    },
    formatStoreTitle() {
      return {
        name: this.$t('report.thisWeekBussStoreTop10'),
        text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
      };
    },
    orderlyTitle() {
      return {
        relevancy: {
          name: this.$t('report.thisWeekUnorderTop10'),
          text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
        },
        inversion: {
          name: this.$t('report.thisWeekUnorderConversionTop10'),
          text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
        },
      };
    },
    disorderTitle() {
      return {
        relevancy: {
          name: this.$t('report.thisWeekOrderTop10'),
          text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
        },
        inversion: {
          name:this.$t('report.thisWeekOrderConversionTop10'),
          text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
        },
      };
    },
    dwellTitle() {
      return {
        name: this.$t('report.thisWeekDwellTimeTop10'),
        text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
      };
    },
    formatDwellStoreTitle() {
      return {
        name: this.$t('report.thisWeekDwellTimeStoreTop10'),
        text:this.$t('report.period_week',[this.saveHeaderData.year,this.saveHeaderData.period]),
      };
    },
    ratioTableColumn(){
      if(this.showLastYearData){
        return  {
          name1: [this.$t("time"), this.$t("Incoming")],
          name2: [this.$t("report.yoyAnaly"), this.$t("report.qoqAnaly")],
          name3: [this.$t("time"), this.$t("Incoming"), this.$t("report.growthRate"), this.$t("time"), this.$t("Incoming"), this.$t("report.growthRate")],
        }
      }else {
        return  {
          name1: [this.$t("time"),this.$t("Incoming")],
          name2: [ this.$t("report.qoqAnaly")],
          name3: [this.$t("time"), this.$t("Incoming"),this.$t("report.growthRate")],
        }
      }
    },
    pageConfig(){
      return [
        {
          id:1,
          count:1,
          name:this.$t("report.enterOverview"),
        },{
          id:2,
          count:2,
          name:this.$t("report.enterTrend"),
        },{
          id:3,
          count:3,
          name:this.$t('出入口客流'),
        },{
          id:4,
          count:1,
          name:this.$t("report.storeEnter"),
        },{
          id:5,
          count:this.allFloorStore.length,
          name:`${this.$t("report.storeEnter")}-${this.$t('floor')}`,
        },{
          id:6,
          count:1,
          name:`${this.$t("report.storeEnter")}-${this.$t('bussinessType')}`,
        },{
          id:7,
          count:this.allHeatMap.length,
          name:this.$t("report.heatmap"),
        },{
          id:8,
          count:1,
          name:`${this.$t("report.storeEnter")}-${this.$t('report.unordered')}`,
        },{
          id:9,
          count:1,
          name:`${this.$t("report.storeEnter")}-${this.$t('report.orderly')}`,
        },{
          id:10,
          count:1,
          name:`${this.$t("report.dwellTime")}-${this.$t('bussinessType')}`,
        },{
          id:11,
          count:1,
          name:`${this.$t("report.dwellTime")}-${this.$t('store')}`,
        }
      ]
    },
    orderlyData(){
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
    },
    tableColumn(){
      return [this.$t('report.gateName'), this.$t('report.enterFlow'),  this.$t('report.enterPeak'), this.$t('report.avgEnterPerDay')]
    }
  },

  mounted() {
    let weekDate = moment()
      .subtract(7, "days")
      .format("YYYY-MM-DD");
    this.selectDateTime = weekDate;
    this.dateTimeCount(weekDate);
    this.reportQuery();
  },
  methods: {

    disabledDate(date) {
      var week = moment()
        .locale("zh")
        .format("d");
      if (Number(week) == 0) week = 7;
      return date && date.valueOf() > Date.now() - 86400000 * Number(week);
    },
    // 查询
    async reportQuery() {
      if (this.callData === "") {

        this.$alert({ content:   this.$t('fn.select',[this.$t('time')]) });
        return false;
      }
      await this.getReportSetting()
      if(!this.enabledModules.length){
        this.$alert({ content: this.$t('report.noConfig')});
        return
      }
      this.headerDate(moment(this.selectDateTime).format("YYYY-MM-DD"));
      this.showPDF = false;
      Promise.all([
        newReportSuggest({ property_id: this.propertyId, date: this.callData }),
        // 总客流
        newReportEnter({
          property_id: this.propertyId,
          timeRange: this.callData,
          report_type: "week",
        }),
        // 本周客流
        getanalysiseeo({
          bzid: this.bzid,
          type: "enter",
          range: this.callData,
          innerRange: "1day",
        }),
        // 上周客流
        getanalysiseeo({
          bzid: this.bzid,
          type: "enter",
          range: this.lastWeekDate,
          innerRange: "1day",
        }),
        // 去年客流
        getanalysiseeo({
          bzid: this.bzid,
          type: "enter",
          range: this.lastYearDate,
          innerRange: "1day",
        }),
        // 出入口
        newReportGate({
          timeRange1: this.callData,
          timeRange2: this.lastWeekDate,
          report_type: "week",
          property_id: this.propertyId,
        }),
        // 商铺
        newReportShop({
          time1: this.callData,
          time2: this.lastWeekDate,
          report_type: "week",
          property_id: this.propertyId,
        }),
        // 楼层下的商铺
        newReportFloorStore({
          time: this.callData,
          property_id: this.propertyId,
        }),
        // 业态下的商铺
        newReportFormatStore({
          time: this.callData,
          property_id: this.propertyId,
        }),
        // 热力图
        newReportHeatMap({ time: this.callData, property_id: this.propertyId }),
        // 关联度 有序
        newReportOrderly({
          time: this.callData,
          property_id: this.propertyId,
          sort_parameter: "rate",
          report_type: "week",
        }),
        newReportOrderly({
          time: this.callData,
          property_id: this.propertyId,
          sort_parameter: "value",
          report_type: "week",
        }),
        // 关联度 无序
        newReportDisorder({
          time: this.callData,
          property_id: this.propertyId,
          sort_parameter: "rate",
          report_type: "week",
        }),
        newReportDisorder({
          time: this.callData,
          property_id: this.propertyId,
          sort_parameter: "value",
          report_type: "week",
        }),
        // 停留时间 业态
        newReportDwellFormat({
          time: this.callData,
          property_id: this.propertyId,
        }),
        // 停留时间 业态下的商铺
        newReportDwellStore({
          time: this.callData,
          property_id: this.propertyId,
        }),
        newReportGateLast({
          timeRange1: this.callData,
          property_id: this.propertyId,
        }),
      ]).then((res) => {
        this.showPDF = true;
        if (res[0].data.code === 200) {
          this.suggestText = res[0].data.data[0].property_suggest;
        }
        if (res[1].data.code === 200) {
          this.enabledModules.includes(1)&&this.reportOneData(res[1].data.data);
        }
        // 趋势数据
        this.enabledModules.includes(2)&&this.trendDataList(
          res[2].data.data,
          res[3].data.data,
          res[4].data.data
        );
        // 出入口数据
        this.enabledModules.includes(3)&&this.gateDataList(res[5].data.data);
        // 商铺数据
        this.enabledModules.includes(4)&&this.shopDataList(res[6].data.data);
        // 楼层下的商铺
        this.enabledModules.includes(5)&&this.floorDataList(res[7].data.data);
        // 业态下的商铺
        this.enabledModules.includes(6)&&this.formatDataList(res[8].data.data);
        // 热力图
        this.enabledModules.includes(7)&&this.heatMapData(res[9].data.data, "thisWeek"),
          // 关联度 无序
        this.enabledModules.includes(8)&&this.relevanceTableData(
            res[10].data.data.matrixList,
            res[11].data.data.matrixList,
            "orderlyData"
          );
        // 关联度 有序
        this.enabledModules.includes(9)&&this.relevanceTableData(
          res[12].data.data,
          res[13].data.data,
          "disorderData"
        );
        // 停留时间 业态
        this.dwellFormatData(res[14].data.data);
        // 停留时间 业态 商铺
        this.dwellFormatStoreData(res[15].data.data);

        this.gateTableDataList(res[16]);
      });
    },
    // 时间发生变化
    selectTimeDate(value) {
      if (value.length === 0 || value.length === 23) {
        this.callData = "";
        this.selectDateText = "";
        this.selectDateTime = "";
        return false;
      }
      this.dateTimeCount(value);
    },
    selectDate(value) {
      if (value == true) {
        this.selectDateTime = "";
        this.selectDateText = "";
        this.callData = "";
      }
    },
    headerDate(value) {
      var start = moment(value)
        .startOf("isoweek")
        .format("YYYY-MM-DD");
      var end = moment(value)
        .endOf("isoweek")
        .format("YYYY-MM-DD");
      let yester = moment(
        moment(start)
          .subtract(1, "days")
          .format("YYYY-MM-DD")
      ).format("YYYY-MM-DD");
      let headerDate = {
        year: moment(start).format("YYYY"),
        period: moment(value).format("WW"),
        time:
          moment(start).format("MM.DD") + " - " + moment(end).format("MM.DD"),
        week: "",
        type: "week",
        yester:this.$t('datepicker_format_display',[moment(yester).format("YYYY"),moment(yester).format("WW")]),
        reportDate:
          moment(value)
            .startOf("isoweek")
            .format("YYYY.MM.DD") +
          "-" +
          moment(value)
            .endOf("isoweek")
            .format("YYYY.MM.DD"),
      };
      this.saveHeaderData = headerDate;
      this.$store.commit("weekReportHeader", headerDate);
    },
    trendDataList(enter, lastEnter, yearEnter) {
      this.trendChartData.option = _.cloneDeep(this.enterOption);
      this.ratioTableData = [];
      let smooth = {
        date: "",
        enter: "",
        ratio: "",
      };
      let maxHighest = {
        date: "",
        enter: "",
        ratio: "",
      };
      let [oneObj, twoObj] = [
        {
          name: this.$t('report.theWeekEnter'),
          color: "#2081D4",
          type: "column",
          data: [],
        },
        {
          name: this.$t('report.lastWeekEnter'),
          type: "column",
          color: "#2BD9CF",
          data: [],
        },
      ];
      let size = 0;
      let size2 = 999;
      enter.forEach((list, index) => {
        let weekType = this.weekType(list.begin);
        oneObj.data.push(list.enter);
        twoObj.data.push(lastEnter[index].enter);
        this.trendChartData.option.xAxis.categories.push(weekType);
        // 环比数据
        let lastWeekNumber = this.sequential(
          list.enter,
          lastEnter[index].enter
        );
        // 同比数据
        let yearNumber = this.sequential(list.enter, yearEnter[index].enter);
        // 环比的绝对值
        let absolute = Math.abs(lastWeekNumber);
        if (absolute < size2) {
          size2 = absolute;
          smooth.date = moment(list.begin).format("YYYY-MM-DD") + weekType;
          smooth.enter = list.enter.toLocaleString();
          smooth.ratio = lastWeekNumber;
        }
        if (absolute > size) {
          size = absolute;
          maxHighest.date =
            moment(list.begin).format("YYYY-MM-DD") + weekType;
          maxHighest.enter = list.enter.toLocaleString();
          maxHighest.ratio = lastWeekNumber;
        }
        let onYearData = []
        if(this.showLastYearData){
          onYearData = [
            moment(yearEnter[index].begin).format("YYYY-MM-DD"),
            yearEnter[index].enter.toLocaleString() + this.$t('personTime'),
            yearNumber + "%",
          ]
        }
        this.ratioTableData.push({
          data: [
            moment(list.begin).format("YYYY-MM-DD") + " " + weekType,
            list.enter.toLocaleString() + this.$t('personTime'),
            ...onYearData,
            moment(lastEnter[index].begin).format("YYYY-MM-DD"),
            lastEnter[index].enter.toLocaleString() + this.$t('personTime'),
            lastWeekNumber + "%",
          ],
        });
      });
      let cuT = _.sumBy(enter, (o) => {
        return o.enter;
      });
      let laT = _.sumBy(lastEnter, (o) => {
        return o.enter;
      });
      let yeT = _.sumBy(yearEnter, (o) => {
        return o.enter;
      });
      this.trendChartData.option.series = [oneObj, twoObj];
      let onYearTotal = []
      if(this.showLastYearData){
        onYearTotal = [
          "-",
          yeT.toLocaleString() + this.$t('personTime'),
          this.sequential(cuT, yeT) + "%",
        ]
      }
      this.ratioTableData.push({
        data: [
          this.$t('total'),
          cuT.toLocaleString() + this.$t('personTime'),
          ...onYearTotal,
          "-",
          laT.toLocaleString() + this.$t('personTime'),
          this.sequential(cuT, laT) + "%",
        ],
      });
      this.trendChartData.remarkData = [];
      let type = smooth.ratio > 0 ? this.$t("report.growth") : this.$t("report.decrease");
      let type2 = maxHighest.ratio > 0 ? this.$t("report.growth") : this.$t("report.decrease");
      let text1 = this.$t('report.week_summary.summary1',[smooth.date,type,smooth.enter,Math.abs(smooth.ratio)])
      let text2 = this.$t('report.week_summary.summary2',[maxHighest.date,type2,maxHighest.enter,Math.abs(maxHighest.ratio)])

      if (smooth.ratio !== "") this.trendChartData.remarkData.push(text1);
      if (maxHighest.ratio !== "") this.trendChartData.remarkData.push(text2);
    },
    gateDataList(gateData) {
      this.gateChartData.option = _.cloneDeep(this.enterOption);
      this.tableData = [];
      let [currentObj, yesterObj, lastObj] = [
        {
          name: this.$t("report.theWeekEnter"),
          color: "#2081D4",
          type: "column",
          data: [],
        },
        {
          name: this.$t("report.lastWeekEnter"),
          type: "column",
          color: "#2BD9CF",
          data: [],
        },
        {
          name: this.$t("report.thePeriodEnter"),
          type: "column",
          color: "#874bd9",
          data: [],
        },
      ];
      if (gateData.data) {
        gateData.data.forEach((list) => {
          currentObj.data.push(list.enter);
          let yesterEnter = _.find(
            gateData.contrast,
            (o) => o.bzid === list.bzid
          ).enter;
          yesterObj.data.push(yesterEnter);
          let lastEnter = _.find(gateData.period, (o) => o.bzid === list.bzid)
            .enter;
          lastObj.data.push(lastEnter);
          this.gateChartData.option.xAxis.categories.push(list.name);
          this.tableData.push({
            name: list.name,
            enter: list.enter.toLocaleString(),
            peak: list.highest.number.toLocaleString(),
            time: moment(list.highest.begin).format("YYYY-MM-DD"),
            mean: list.avg.toLocaleString(),
          });
        });
      }

      this.gateChartData.option.series = [currentObj, yesterObj];
      if(this.showLastYearData){
        this.gateChartData.option.series.push(lastObj)
      }
      this.gateChartData.remarkData = gateData.comment ? gateData.comment : [];
    },
    shopDataList(shopData) {
      this.shopChartData.option = _.cloneDeep(this.enterOption);
      let [currentObj, yesterObj] = [
        {
          name:this.$t("report.theWeekEnter"),
          color: "#2081D4",
          type: "column",
          data: [],
        },
        {
          name: this.$t("report.lastWeekEnter"),
          type: "column",
          color: "#2BD9CF",
          data: [],
        },
      ];
      if (shopData.current) {
        _.take(shopData.current, 10).forEach((list) => {
          currentObj.data.push(list.data);
          if (shopData.contrast.length !== 0) {
            let yesterEnter = _.find(shopData.contrast, (o) => o.id === list.id)
              .data;
            yesterObj.data.push(yesterEnter);
          } else {
            yesterObj.data.push(0);
          }
          this.shopChartData.option.xAxis.categories.push(list.name);
        });
      }
      this.shopChartData.option.series = [currentObj, yesterObj];
      this.shopChartData.remarkData = shopData.comment ? shopData.comment : [];
    },
    floorDataList(data) {
      this.allFloorStore = _.chunk(data, 8);
      this.allFloorStore.forEach((ele, index) => {
        this.multiChartData(ele, `allFloorStore+${index}`, "chart");
      });
    },
    formatDataList(data) {
      this.allFormatStore = [];
      this.multiChartData(data, "allFormatStore", "chart");
    },
    dwellFormatStoreData(data) {
      this.allDwellFormatStore = [];
      this.multiChartData(data, "allDwellFormatStore", "dwell");
      this.$nextTick(() => {
        this.clickData = this.clickData + 1;
        Bus.$emit("chartData");
      });
    },
    gateTableDataList(data) {
      data = data.data.data;
      console.log(_.cloneDeep(data))
      this.gateTableColumn = [];
      let that = this;
      if(data.length){
        for (let i = 0; i < 7; i++) {
          let obj = {};
          obj.name = "";
          obj.time1 = this.$t("report.thePeriod") + Object.keys(data[0].current[i])[0];
          obj.time2 = this.$t("report.synchronism") + Object.keys(data[0].contrast[i])[0];
          switch (i) {
            case 0:
              obj.name = this.$t('Mon');
              break;
            case 1:
              obj.name = this.$t('Tue');
              break;
            case 2:
              obj.name = this.$t('Wed');
              break;
            case 3:
              obj.name = this.$t('Thr');
              break;
            case 4:
              obj.name = this.$t('Fri');
              break;
            case 5:
              obj.name = this.$t('Sat');
              break;
            case 6:
              obj.name = this.$t('Sun');
              break;
          }
          that.gateTableColumn.push(obj);
        }
        this.gateTableData = [];
        data.forEach((o) => {
          const currData = o.current
                  .map((inner) => {
                    return Object.values(inner);
                  })
                  .flat();
          o.currTotal = _.sum(currData);
        });
        let to10 = _.sortBy(data, "currTotal")
                .reverse()
                .splice(0, 10);
        to10.forEach((list) => {
          let obj = {};
          obj.current = [];
          obj.period = [];
          obj.ratio = [];
          obj.name = list.name;
          list.current.map((e, index) => {
            let currentEnter = Object.values(e)[0].toLocaleString();
            obj.current.push(currentEnter);
            let periodEnter = Object.values(
                    list.contrast[index]
            )[0].toLocaleString();
            obj.period.push(periodEnter);
            let ratio = this.sequential(
                    Object.values(e)[0],
                    Object.values(list.contrast[index])[0]
            );
            obj.ratio.push(ratio + "%");
          });
          this.gateTableData.push(obj);
        });
        let total = {};
        total.current = [];
        total.period = [];
        total.ratio = [];
        total.name = this.$t('total');
        to10[0].current.forEach((list, index) => {
          let arr = [],
                  arr2 = [];
          to10.forEach((val) => {
            arr.push(Object.values(val.current[index])[0]);
            arr2.push(Object.values(val.contrast[index])[0]);
          });
          total.current.push(_.sum(arr).toLocaleString());
          total.period.push(_.sum(arr2).toLocaleString());
          total.ratio.push(this.sequential(_.sum(arr), _.sum(arr2)) + "%");
        });
        this.gateTableData.push(total);
      }


    },
    dateTimeCount(value) {
      var start = moment(value)
        .startOf("isoweek")
        .format("YYYY-MM-DD"); //获取本周周一
      var end = moment(value)
        .endOf("isoweek")
        .format("YYYY-MM-DD"); //获取本周周日
      this.selectDateText = start + " - " + end;
      this.callData = start + "," + end;
      // 上周时间
      let yester = moment(
        moment(start)
          .subtract(1, "days")
          .format("YYYY-MM-DD")
      ).format("YYYY-MM-DD");
      let lastWeekStart = moment(yester)
        .startOf("isoweek")
        .format("YYYY-MM-DD");
      let lastWeekend = moment(yester)
        .endOf("isoweek")
        .format("YYYY-MM-DD");
      this.lastWeekDate = lastWeekStart + "," + lastWeekend;
      // 去年时间
      let lastStart = moment(start)
        .add(-1, "y")
        .format("YYYY");
      let lastEnd = moment(end)
        .add(-1, "y")
        .format("YYYY");
      let lastYearStart =
        lastStart +
        moment(value)
          .startOf("isoweek")
          .format("-MM-DD");
      let lastYearEnd =
        lastEnd +
        moment(value)
          .endOf("isoweek")
          .format("-MM-DD");
      this.lastYearDate = lastYearStart + "," + lastYearEnd;
    },
  },
  created() {},
};
</script>
<style lang="less">
.week-select-date {
  .ivu-input {
    height: 43px;
    font-size: 16px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }
}
</style>
<style lang="less" scoped>
.pdf-text-box {
  margin: 0 auto;
  background-color: #fff;
  height: auto;
}
.day-report-date {
  margin-top: 9px;
  padding: 20px 0 20px 30px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, 0.4);
  position: relative;
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
