<template>
  <div class="report-center" style="min-width: 1200px;">
    <!-- 选择日期 查看 下载 -->
    <div style="width: 100%; margin-bottom: 21px">
      <div class="month-report-date flex-center">
        <DatePicker
          type="month"
          @on-change="selectTimeDate"
          :editable="false"
          :options="options3"
          v-model="selectDateTime"
        >
        </DatePicker>
        <div class="report-query" v-on:click="reportQuery">
          {{ $t('query') }}
        </div>
        <div
          class="icon-download"
          v-on:click="downloadReport('month', selectDate)"
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
      :date="selectDate"
      :suggestText="suggestText"
    ></report-suggest>
    <!-- pdf 内容 -->
    <div class="pdf-text-box" v-if="showPDF" style="max-width:1200px">
      <div id="pdfDom">
        <!-- 封面 -->
        <report-cover
          :pageTotal="`${getTotalPage()}`"
          :suggestText="suggestText"
          :titleName="$t('report.linkdomeMonthReport')"
        ></report-cover>
        <!-- 总览 -->
        <report-one
                :title="$t('report.enterOverview')"
          :page="`${getPage(1)}`"
          v-if="enabledModules.includes(1)"
          :showLastYearData="showLastYearData"
          :enterData="enterData"
          :listTitle="oneListData"
        ></report-one>
        <report-remark
                :title="$t('report.enterOverview')"
          :page="`${getPage(1)+1}`"
          v-if="enabledModules.includes(1)"
          :remarkData="enterData[3]"
        ></report-remark>
        <!-- 客流趋势 -->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
          :title="$t('report.enterTrend')"
          :listTitle="trendTitle"
          v-if="enabledModules.includes(2)"
          :page="`${getPage(2)}`"
          :dataList="trendChartData"
        ></report-chart>
        <report-ratio-table
                :title="$t('report.enterTrend')"
          v-if="enabledModules.includes(2)"
          :page="`${getPage(2)+1}`"
          :listTitle="analyseTitle"
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
          :listTitle="gate10Title"
          :dataList="gateTop10"
        ></report-chart>

        <report-month-table
                :title="$t('report.gateEnter')"
          v-if="enabledModules.includes(3)"
          :showLastYearData="showLastYearData"
          :page="`${getPage(3)+1}`"
          :listTitle="gateFloorTitle"
          :tableData="gateTableData"
          :tableColumn="gateTableColumn"
        ></report-month-table>

        <!-- 楼层 出入口 -->
        <report-chart-multi
          v-for="(item, index) in floorGateChartData"
          :key="index + 'a'"
          :title="$t('report.gateEnter')"
          v-if="enabledModules.includes(3)"
          :page="`${getPage(3)+2+index}`"
          :listTitle="gateFloorTitle"
          :dataList="item.data"
        ></report-chart-multi>

        <!-- 店铺 -->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
          :title="$t('report.storeEnter')"
          v-if="enabledModules.includes(4)"
          :page="`${getPage(4)}`"
          :listTitle="shop10Title"
          :dataList="shop10Data"
        ></report-chart>
        <!-- 楼层 店铺 -->
        <!-- <report-chart-multi title='店铺客流' page='9' :listTitle='floorShopTitle'
														:dataList='floorShopChartData'></report-chart-multi> -->
        <report-chart-multi
                :title="$t('report.storeEnter')"
          v-for="(item, index) in floorShopChartData"
          :key="index"
          v-if="enabledModules.includes(5)"
          :page="`${getPage(5) + index}`"
          :listTitle="floorShopTitle"
          :dataList="item.data"
        ></report-chart-multi>
        <!-- 业态 店铺 -->
        <report-chart-multi
                :title="$t('report.storeEnter')"
          v-if="enabledModules.includes(6)"
          :page="`${getPage(6)}`"
          :listTitle="shopcAtivitiesTitle"
          :dataList="formatShopChartData"
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

import reportCover from "@/components/report/newReport/report_cover";
import reportRatioTable from "@/components/report/newReport/report_ratio_table";
import reportChart from "@/components/report/newReport/report_chart";
import reportSuggest from "@/components/report-public/report_suggest";
import reportChartMulti from "@/components/report/newReport/report_chart_multi";
import reportBackCover from "@/components/report/newReport/report_back_cover";
import reportHeatMap from "@/components/report/newReport/report_heat_map";
import reportTable from "@/components/report/newReport/report_table";
import reportRemark from "@/components/report/newReport/report_remark";
import reportMonthTable from "@/components/report/newReport/new_report_month_table";

import { getanalysiseeo } from "@/api/home";
import {
  newReportEnter,
  newReportSuggest,
  newReportMonthRemark,
  newReportGate,
  monthlyCameraList,
  newReportShop,
} from "@/api/report";

import {
  newReportFloorStore,
  newReportFormatStore,
  newReportHeatMap,
  newReportOrderly,
  newReportDisorder,
  newReportDwellStore,
  newReportDwellFormat,
  newReportGateLast,
  newReportMonthlyGate,
} from "@/api/new_report";

import _ from "lodash";
import Bus from "@/libs/bus.js";
import moment from "moment";
import mixins from "./reportMixin.js";
import {replaceBraces} from '../../libs/util'

export default {
  name: "report-week",
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportRatioTable,
    reportSuggest,
    reportChartMulti,
    reportBackCover,
    reportHeatMap,
    reportTable,
    reportRemark,
    reportMonthTable,
  },
  data() {
    return {
      clickData: 0,
      showPDF: false,
      // 日期
      selectDateTime: "",
      selectDate: "",
      lastMonthDate: "",
      lastYear: "",
      options3: {
        disabledDate(date) {
          var curDate = new Date();
          if (moment(date).year() > moment(curDate).year()) {
            return true;
          }
          return (
            moment(curDate).month() < moment(date).month() + 1 &&
            moment(date).year() >= moment(curDate).year()
          );
        },
      },
      trendChartData: {
        option: {},
        remarkData: [],
      },
      gateTop10: {
        option: {},
        remarkData: [],
      },
      floorGateChartData: [],
      shop10Data: {
        option: {},
        remarkData: [],
      },
      floorShopChartData: [],
      formatShopChartData: [],
      ratioTableData: [],
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
          name: this.$t('report.theMonthOverview'),
          text:
                  `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time
        },
        {
          name: this.$t('report.lastMonthOverview'),
          text: `${this.$t('report.enterTime')}:` + this.saveHeaderData.yester,
        },
        {
          name: this.$t('report.lastYearSameMonth'),
          text:
                  `${this.$t('report.enterTime')}:` +
            moment(this.saveHeaderData.year)
              .add(-1, "y")
              .format("YYYY") +
            "." +
            this.saveHeaderData.time
        },
      ];
    },
    trendTitle() {
      return {
        name: this.$t('report.MonthEnterTrend'),
        text:
                `${this.$t('report.enterTime')}:` +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time
      };
    },
    analyseTitle() {
      return {
        name: this.$t('report.MonthPerWeekEnter'),
        text:
                `${this.$t('report.enterTime')}:` +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time
      };
    },
    gate10Title() {
      return {
        name: this.$t('report.thisMonthGateTop10Compare'),
        text:
                `${this.$t('report.enterTime')}:` +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time ,
      };
    },
    gateFloorTitle() {
      return {
        name:this.$t('report.thisMonthFloorGateTop10'),
        text:
                `${this.$t('report.enterTime')}:` +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time
      };
    },
    shop10Title() {
      return {
        name: this.$t('report.thisMonthTop10Compare'),
        text:
                `${this.$t('report.enterTime')}:` +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time
      };
    },
    floorShopTitle() {
      return {
        name: this.$t('report.thisMonthFloorStoreTop10'),
        text:
                `${this.$t('report.enterTime')}:`+
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time
      };
    },
    shopcAtivitiesTitle() {
      return {
        name: this.$t('report.thisMonthBussStoreTop10'),
        text:
                `${this.$t('report.enterTime')}:` +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time
      };
    },
    orderlyTitle() {
      return {
        relevancy: {
          name: this.$t('report.thisMonthUnorderTop10'),
          text:
                  `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time
        },
        inversion: {
          name: this.$t('report.thisMonthUnorderConversionTop10'),
          text:
                  `${this.$t('report.enterTime')}:`+
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time
        },
      };
    },
    disorderTitle() {
      return {
        relevancy: {
          name: this.$t('report.thisMonthOrderTop10'),
          text:
                  `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time
        },
        inversion: {
          name: this.$t('report.thisMonthOrderConversionTop10'),
          text:
                  `${this.$t('report.enterTime')}:`  +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time
        },
      };
    },
    dwellTitle() {
      return {
        name: this.$t('report.thisMonthDwellTimeTop10'),
        text:
                `${this.$t('report.enterTime')}:`  +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time
      };
    },
    formatDwellStoreTitle() {
      return {
        name: this.$t('report.thisMonthDwellTimeStoreTop10'),
        text:
                `${this.$t('report.enterTime')}:`  +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time
      };
    },
    pageConfig(){
      return [
        {
          id:1,
          count:2,
          name:this.$t("report.enterOverview"),
        },{
          id:2,
          count:2,
          name:this.$t("report.enterTrend"),
        },{
          id:3,
          count:2+this.floorGateChartData.length,
          name:this.$t('gateEnter'),
        },{
          id:4,
          count:1,
          name:this.$t("report.storeEnter"),
        },{
          id:5,
          count:this.floorShopChartData.length,
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
    ratioTableColumn(){
      return {
        name1: [this.$t('time'), this.$t('fx.enter')],
        name2: [ this.$t("flowPeak")],
        name3: [this.$t('time'), this.$t("flowPeak")],
      }
    }
  },
  mounted() {
    let newDate = moment(new Date())
      .subtract(1, "months")
      .format("YYYY-MM");
    this.selectDateTime = newDate;
    this.dateTimeCount(newDate);
    this.reportQuery();
  },
  methods: {
    // 查询
    async reportQuery() {
      if (this.selectDate === "") {
        this.$alert({ content:  this.$t('fn.select',[this.$t('time')])});
        return false;
      }
      await this.getReportSetting()
      if(!this.enabledModules.length){
        this.$alert({ content: this.$t('report.noConfig')});
        return
      }
      this.headerDate(this.selectDateTime);
      this.showPDF = false;
      Promise.all([
        // 建议
        newReportSuggest({
          property_id: this.propertyId,
          date: this.selectDate,
        }),
        newReportEnter({
          property_id: this.propertyId,
          timeRange: this.selectDate,
          report_type: "month",
        }),
        newReportEnter({
          property_id: this.propertyId,
          timeRange: this.lastYear,
          report_type: "month",
        }),
        getanalysiseeo({
          bzid: this.bzid,
          type: "enter",
          range: this.selectDate,
          innerRange: "1day",
        }),
        newReportMonthRemark({
          property_id: this.propertyId,
          timeRange: this.selectDate,
        }),
        // 出入口
        newReportGate({
          property_id: this.propertyId,
          timeRange1: this.selectDate,
          timeRange2: this.lastMonthDate,
          report_type: "month",
        }),
        monthlyCameraList(this.propertyId, this.selectDate),
        // 商铺
        newReportShop({
          time1: this.selectDate,
          time2: this.lastMonthDate,
          report_type: "month",
          property_id: this.propertyId,
        }),
        // 楼层下的商铺
        newReportFloorStore({
          property_id: this.propertyId,
          time: this.selectDate,
        }),
        // 业态下的商铺
        newReportFormatStore({
          property_id: this.propertyId,
          time: this.selectDate,
        }),
        // 热力图
        newReportHeatMap({
          time: this.selectDate,
          property_id: this.propertyId,
        }),
        // 关联度 有序
        newReportOrderly({
          time: this.selectDate,
          property_id: this.propertyId,
          sort_parameter: "rate",
          report_type: "month",
        }),
        newReportOrderly({
          time: this.selectDate,
          property_id: this.propertyId,
          sort_parameter: "value",
          report_type: "month",
        }),
        // 关联度 无序
        newReportDisorder({
          time: this.selectDate,
          property_id: this.propertyId,
          sort_parameter: "rate",
          report_type: "month",
        }),
        newReportDisorder({
          time: this.selectDate,
          property_id: this.propertyId,
          sort_parameter: "value",
          report_type: "month",
        }),
        // 停留时间 业态
        newReportDwellFormat({
          time: this.selectDate,
          property_id: this.propertyId,
        }),
        // 停留时间 业态下的商铺
        newReportDwellStore({
          time: this.selectDate,
          property_id: this.propertyId,
        }),
        // newReportGateLast({ timeRange1: this.selectDate, property_id: this.propertyId }),
        newReportMonthlyGate({
          property_id: this.propertyId,
          year: this.saveHeaderData.year,
          month: this.saveHeaderData.time,
        }),
        getanalysiseeo({
          bzid: this.bzid,
          type: "enter",
          range: this.lastMonthDate,
          innerRange: "1day",
        }),
      ]).then((res) => {
        this.showPDF = true;
        this.suggestText = res[0].data.data[0].property_suggest;
        this.enabledModules.includes(1)&&this.reportOneData(res[1].data.data, res[2].data.data);
        this.enabledModules.includes(2)&&this.trendDataList(
          res[3].data.data,
          res[4].data.data,
          res[18].data.data
        );
        this.enabledModules.includes(2)&&this.trendTableData(res[3].data.data);
        this.enabledModules.includes(3)&&this.gateDataList(res[5].data.data);
        this.enabledModules.includes(3)&&this.floorGateData(res[6].data.data);
        this.enabledModules.includes(4)&&this.shopDataList(res[7].data.data);
        this.enabledModules.includes(5)&&this.floorShopDataList(res[8].data.data);
        this.enabledModules.includes(6)&&this.formatShopDataList(res[9].data.data);
        this.enabledModules.includes(7)&&this.heatMapData(res[10].data.data, "thisMonth");
        // // 关联度 有序
        this.enabledModules.includes(8)&&this.relevanceTableData(
          res[11].data.data.matrixList,
          res[12].data.data.matrixList,
          "orderlyData"
        );
        // // 关联度 无序
        this.enabledModules.includes(9)&&this.relevanceTableData(
          res[13].data.data,
          res[14].data.data,
          "disorderData"
        );
        // 停留时间 业态
        this.dwellFormatData(res[15].data.data);
        // 停留时间 业态 商铺
        this.dwellFormatStoreData(res[16].data.data);
        this.gateFlowTop10(res[17].data.data);
      });
    },
    //各楼层TOP10出入口客流
    gateFlowTop10(data) {
      this.gateTableColumn = [];
      this.gateTableData = [];
      const total = {
        name:this.$t('total'),
        enter: [],
      };
      data.forEach((o, index) => {
        o.curent_start_time &&
          this.gateTableColumn.push({
            name: this.$t('fn.weekTh',[index + 1]),
            time1: `${o.curent_start_time} - ${o.current_end_time}`,
            time2: `${o.last_start_time} - ${o.last_end_time}`,
          });

        if (!index) {
          o.list = _.sortBy(o.list, "current_num")
            .reverse()
            .splice(0, 10);
        }
        let totalCurr = 0;
        let totalLast = 0;
        if (o.curent_start_time) {
          o.list&&o.list.forEach((gate, gateIdx) => {
            let fidx = this.gateTableData.findIndex(
              (ele) => ele.bzid == gate.bzid
            );
            if (!index) {
              totalCurr = totalCurr + gate.current_num;
              totalLast = totalLast + gate.last_num;
              this.gateTableData.push({
                bzid: gate.bzid,
                name: gate.name,
                currTotal: gate.current_num,
                enter: [
                  {
                    curr:
                      (gate.current_num && gate.current_num.toString()) || 0,
                    period:
                      (gate.last_num && gate.last_num.toLocaleString()) || 0,
                    ratio:
                      (gate.ratio && (gate.ratio * 100).toFix(2) + "%") || "0%",
                  },
                ],
              });
            } else if (fidx !== -1) {
              totalCurr = totalCurr + gate.current_num;
              totalLast = totalLast + gate.last_num;
              this.gateTableData[fidx].currTotal =
                this.gateTableData[fidx].currTotal + gate.current_num;
              this.gateTableData[fidx].enter.push({
                curr: (gate.current_num && gate.current_num.toString()) || 0,
                period: (gate.last_num && gate.last_num.toLocaleString()) || 0,
                ratio:
                  (gate.ratio && (gate.ratio * 100).toFix(2) + "%") || "0%",
              });
            }
          });
          total.enter.push({
            curr: (totalCurr && totalCurr.toLocaleString()) || 0,
            period: (totalLast && totalLast.toLocaleString()) || 0,
            ratio: totalLast
              ? (((totalCurr - totalLast) / totalLast) * 100).toFix(2) + "%"
              : "0%",
          });
        }
      });
      this.gateTableData.push(total);
    },
    // 时间发生变化
    selectTimeDate(value) {
      if (value == "") {
        this.selectDateTime = "";
        return false;
      }
      this.dateTimeCount(value);
    },
    trendTableData(data) {
      this.ratioTableData = [];
      let maxEnter = _.maxBy(data, (o) => {
        return o.enter;
      });
      let totalEnter = _.sumBy(data, (o) => {
        return o.enter;
      });
      let newArr = [[], [], [], [], [], []];
      let week = moment(data[0].begin)
        .locale("zh")
        .format("d");
      for (var i = 0; i <= 7 - Number(week); i++) {
        var obj = {};
        obj.time = moment(data[i].begin).format("YYYY-MM-DD");
        obj.enter = data[i].enter;
        newArr[0].push(obj);
      }
      var le1 = newArr[0].length;
      newArr[1] = this.weekLists(data, le1);

      var le2 = newArr[0].length + newArr[1].length;
      newArr[2] = this.weekLists(data, le2);

      var le3 = newArr[0].length + newArr[1].length + newArr[2].length;
      newArr[3] = this.weekLists(data, le3);

      var le4 =
        newArr[0].length +
        newArr[1].length +
        newArr[2].length +
        newArr[3].length;
      newArr[4] = this.weekLists(data, le4);

      var le5 =
        newArr[0].length +
        newArr[1].length +
        newArr[2].length +
        newArr[3].length +
        newArr[4].length;
      newArr[5] = this.weekLists(data, le5);
      for (let i = 0; i < newArr.length; i++) {
        this.processingTableData(newArr[i]);
      }
      let total = {
        data: [
          this.$t('total'),
          totalEnter.toLocaleString() +this.$t('personTime'),
          // moment(maxEnter.begin).format('YYYY-MM-DD'),
          // maxEnter.enter.toLocaleString() + '人次'
        ],
      };
      this.ratioTableData.push(total);
    },
    trendDataList(data, remarkData, lastM) {
      this.trendChartData.option = _.cloneDeep(this.enterOption);
      let [enterObj, trendObj, lastObj, averageObj] = [
        {
          name: this.$t('report.dailyEnter'),
          type: "column",
          color: "#00A0E9",
          data: [],
        },
        {
          name: this.$t('report.MonthEnterTrend'),
          type: "spline",
          color: "#4EDBDA",
          marker: {
            enabled: false,
          },
          dataLabels: {
            enabled: true,
            allowOverlap: true, // 允许数据标签重叠
            formatter() {
              return this.y.toLocaleString();
            },
          },
          data: [],
          tooltip: {
            valueSuffix: "",
          },
        },
        {
          name:this.$t('report.lastMonthEnter'),
          type: "spline",
          color: "#ABA00B",
          marker: {
            enabled: false,
          },
          data: [],
          tooltip: {
            valueSuffix: "",
          },
        },
        {
          name: this.$t("avgEnter"),
          type: "spline",
          color: "#FEB33D",
          marker: {
            enabled: false,
          },
          data: [],
          tooltip: {
            valueSuffix: "",
          },
        },
      ];
      let totalNumber = Number(
        (_.sumBy(data, "enter") / data.length).toFixed(0)
      );
      data.forEach((list, index) => {
        enterObj.data.push(list.enter || 0);
        trendObj.data.push(list.enter || 0);
        lastM[index] && lastObj.data.push(lastM[index].enter || 0);
        averageObj.data.push(totalNumber);
        this.trendChartData.option.xAxis.categories.push(
          moment(list.begin).format("YYYY-MM-DD")
        );
      });
      this.trendChartData.option.series = [
        enterObj,
        trendObj,
        averageObj,
        lastObj,
      ];
      this.trendChartData.remarkData = [];
      remarkData.comment.forEach(o=>{
        this.trendChartData.remarkData.push(replaceBraces(o,(match,p1)=>{
          return this.$t(p1)||match
        }))
      })
    },
    gateDataList(data) {
      this.gateTop10.option = _.cloneDeep(this.enterOption);
      let [oneObj, twoObj, threeObj] = [
        {
          name: this.$t('report.theMonthEnter'),
          type: "column",
          color: "#2081D4",
          data: [],
        },
        {
          name: this.$t('report.lastMonthEnter'),
          type: "column",
          color: "#2BD9CF",
          data: [],
        },
        {
          name: this.$t('report.thePeriodEnter'),
          type: "column",
          color: "#874bd9",
          data: [],
        },
      ];
      data.data.forEach((list, index) => {
        oneObj.data.push(list.enter);
        let last = _.filter(data.contrast, (o) => {
          return o.bzid === list.bzid;
        })[0];
        twoObj.data.push(last ? last.enter : 0);
        let sameEnter = _.find(data.period, (o) => o.bzid === list.bzid).enter;
        threeObj.data.push(sameEnter);
        this.gateTop10.option.xAxis.categories.push(list.name);
      });
      this.gateTop10.option.series = [oneObj, twoObj];
      if(this.showLastYearData){
        this.gateTop10.option.series.push(threeObj)
      }
      this.gateTop10.remarkData = []
      data.comment.forEach(o=>{
        this.gateTop10.remarkData.push(replaceBraces(o,(match,p1)=>{
          return this.$t(p1)||match
        }))
      })
    },
    shopDataList(data) {
      this.shop10Data.option = _.cloneDeep(this.enterOption);
      let [oneObj, twoObj] = [
        {
          name: this.$t('report.theMonthEnter'),
          type: "column",
          color: "#2081D4",
          data: [],
        },
        {
          name: this.$t('report.lastMonthEnter'),
          type: "column",
          color: "#2BD9CF",
          data: [],
        },
      ];
      _.take(data.current, 10).forEach((list) => {
        oneObj.data.push(list.data);
        if (data.contrast.length !== 0) {
          let last = _.filter(data.contrast, (o) => {
            return o.id === list.id;
          })[0];
          twoObj.data.push(last ? last.data : 0);
        } else {
          twoObj.data.push(0);
        }
        this.shop10Data.option.xAxis.categories.push(list.name);
      });
      this.shop10Data.option.series = [oneObj, twoObj];
      this.shop10Data.remarkData = []
      data.comment.forEach(o=>{
        this.shop10Data.remarkData.push(replaceBraces(o,(match,p1)=>{
          return this.$t(p1)||match
        }))
      })
    },
    floorGateData(data) {
      this.floorGateChartData = [];
      this.shopDataDispose(data, "floorGateChartData");
    },
    headerDate(value) {
      var startTime = moment(value).startOf("month");
      var year = moment(value).format("YYYY");
      var MM = moment(value).format("M");
      let yester = moment(
        moment(startTime)
          .subtract(1, "days")
          .format("YYYY-MM-DD")
      ).format("YYYY-MM-DD");
      let headerDate = {
        year: year,
        period: "",
        time: MM,
        week: "",
        type: "monthly",
        yester:
          moment(yester).format("YYYY") +
          "." +
          moment(yester).format("M"),
        reportDate: moment(value).format("YYYY.MM"),
      };
      this.saveHeaderData = headerDate;
      this.$store.commit("monthReportHeader", headerDate);

      let lastYear =
        moment(year)
          .add(-1, "y")
          .format("YYYY") +
        "-" +
        MM;
      let Start = moment(lastYear).startOf("month");
      let End = moment(lastYear).endOf("month");
      this.lastYear =
        moment(Start).format("YYYY-MM-DD") +
        "," +
        moment(End).format("YYYY-MM-DD");
    },
    weekLists(data, index) {
      var arr = [];
      for (var i = index; i < 7 + index; i++) {
        if (i >= data.length) break;
        var obj = {};
        obj.time = moment(data[i].begin).format("YYYY-MM-DD");
        obj.enter = data[i].enter;
        arr.push(obj);
      }
      return arr;
    },
    processingTableData(data) {
      if (data.length === 0) return false;
      let obj = {
        data: [
          moment(data[0].time).format("YYYY-MM-DD") +
            " - " +
            moment(data[data.length - 1].time).format("YYYY-MM-DD"),
          _.sumBy(data, "enter").toLocaleString() + this.$t('personTime'),
        ],
      };
      let numberObj = {
        time: "",
        enter: 0,
      };
      data.forEach((list) => {
        if (list.enter > numberObj.enter) {
          numberObj.time = list.time;
          numberObj.enter = list.enter;
        }
      });
      obj.data.push(numberObj.time, numberObj.enter.toLocaleString() +this.$t('personTime'));
      this.ratioTableData.push(obj);
    },
    shopDataDispose(data, type) {
      let colorArr = ["#745AEF", "#EE690B", "#4EDBDA", "#2081D4"];
      let nameListArr = _.chunk(Object.keys(data), 8);
      nameListArr.forEach((nameList, nameIndex) => {
        type == "floorGateChartData"
          ? (this[type][nameIndex] = { data: [] })
          : "";
        nameList.forEach((list, index) => {
          let listObj = {
            option: _.cloneDeep(this.enterOption),
          };
          listObj.option.xAxis.categories = [];
          listObj.option.series = [
            {
              name: list,
              type: "bar",
              color: index > 4 ? colorArr[index - 4] : colorArr[index],
              data: [],
            },
          ];
          let dataType = data[list].shop ? data[list].shop : data[list].gate;
          let shop = _.take(_.orderBy(dataType, "enter", "desc"), 10);
          shop.forEach((value) => {
            listObj.option.series[0].data.push(value.enter);
            listObj.option.xAxis.categories.push(value.name);
          });
          if (nameIndex) {
            listObj.span = 6;
            listObj.height = 500;
          } else {
            this.switchHeight(nameList, listObj);
          }
          type == "floorGateChartData"
            ? this[type][nameIndex].data.push(listObj)
            : this[type].push(listObj);
        });
      });
    },
    floorShopDataList(data) {
      this.floorShopChartData = _.chunk(data, 8);
      this.floorShopChartData.forEach((ele, index) => {
        this.multiChartData(ele, `floorShopChartData+${index}`, "chart");
      });
    },
    formatShopDataList(data) {
      this.formatShopChartData = [];
      this.multiChartData(data, "formatShopChartData", "chart");
    },
    dwellFormatStoreData(data) {
      this.allDwellFormatStore = [];
      this.multiChartData(data, "allDwellFormatStore", "dwell");
      this.$nextTick(() => {
        this.clickData = this.clickData + 1;
        Bus.$emit("chartData");
      });
    },
    dateTimeCount(value) {
      var startTime = moment(value).startOf("month");
      var endTime = moment(value).endOf("month");
      let yester = moment(
        moment(startTime)
          .subtract(1, "days")
          .format("YYYY-MM-DD")
      ).format("YYYY-MM-DD");
      let yesterStart = moment(yester).startOf("month");
      let yesterEnd = moment(yester).endOf("month");
      this.selectDate =
        moment(startTime).format("YYYY-MM-DD") +
        "," +
        moment(endTime).format("YYYY-MM-DD");
      this.lastMonthDate =
        moment(yesterStart).format("YYYY-MM-DD") +
        "," +
        moment(yesterEnd).format("YYYY-MM-DD");
    },
  },
};
</script>
<style lang="less">
.month-report-date {
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

.month-report-date {
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
    width: 100%;
    height: auto;
    padding-bottom: 150px;
    border-bottom: 2px solid #99abb4;
  }
}
</style>
