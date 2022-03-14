<template>
  <div class="report-center">
    <div class="pdf-text-box">
      <div id="pdfDom" v-if="showPDF" style="width: 1200px;">
        <!-- 封面 -->
        <report-cover
          :suggestText="suggestText"
          titleName="凌图智慧日报"
          :pageTotal="`${11 + allHeatMap.length + allFloorStore.length - 1}`"
        ></report-cover>
        <!-- 总览 -->
        <report-one
          title="客流总览"
          :enterData="enterData"
          :listTitle="oneListData"
        ></report-one>
        <!--客流趋势  -->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
          title="客流趋势"
          page="2"
          :listTitle="trendTitle"
          :dataList="trendChartData"
        ></report-chart>
        <report-ratio-table
          title="客流趋势"
          page="3"
          :listTitle="trendTitle"
          :tableColumn="ratioTableColumn"
          :tableData="ratioTableData"
        >
        </report-ratio-table>
        <!-- 出入口 -->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
          title="出入口客流"
          page="4"
          :listTitle="gateTitle"
          :dataList="gateChartData"
        ></report-chart>
        <!-- 店铺 -->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
          title="店铺客流"
          page="5"
          :listTitle="shopTitle"
          :dataList="shopChartData"
        ></report-chart>
        <!-- 楼层下的商铺 -->
        <report-chart-multi
          title="店铺客流"
          v-for="(item, index) in allFloorStore"
          :key="index"
          :page="`${6 + index}`"
          :listTitle="floorStoreTitle"
          :dataList="item.data"
        ></report-chart-multi>
        <!-- 业态下的商铺 -->
        <report-chart-multi
          title="店铺客流"
          :page="`${7 + allFloorStore.length - 1}`"
          :listTitle="formatStoreTitle"
          :dataList="allFormatStore"
        ></report-chart-multi>
        <!-- 热力图 -->
        <report-heat-map
          :key="'heatMap' + index"
          v-for="(item, index) in allHeatMap"
          title="热力图"
          :page="`${8 + index + allFloorStore.length - 1}`"
          :listTitle="item.title"
          :dataList="item.data"
          :isRemark="false"
          :chartHeight="600"
        ></report-heat-map>
        <!-- 店铺关联 有序-->
        <report-table
          title="店铺关联"
          :listTitle="orderlyTitle"
          :tableData="orderlyData"
          :page="`${8 + allHeatMap.length + allFloorStore.length - 1}`"
        ></report-table>
        <!-- 店铺关联 无序-->
        <report-table
          title="店铺关联"
          :listTitle="disorderTitle"
          :tableData="disorderData"
          :page="`${9 + allHeatMap.length + allFloorStore.length - 1}`"
        ></report-table>
        <!-- 停留时间 业态-->
        <report-chart
          :chartHeight="600"
          :clickData="clickData"
          title="停留时间"
          :isRemark="false"
          :page="`${10 + allHeatMap.length + allFloorStore.length - 1}`"
          :listTitle="dwellTitle"
          :dataList="dwellChartData"
          chartType="dwell"
        ></report-chart>
        <!-- 停留时间 业态下的商铺-->
        <report-chart-multi
          chartType="dwell"
          title="停留时间"
          :page="`${11 + allHeatMap.length + allFloorStore.length - 1}`"
          :listTitle="formatDwellStoreTitle"
          :dataList="allDwellFormatStore"
        ></report-chart-multi>
        <report-back-cover></report-back-cover>
      </div>
    </div>
  </div>
</template>
<script>
import reportCover from "@/components/report/newReport/report_cover";
import reportOne from "@/components/report/newReport/report_one";
import reportChart from "@/components/report/newReport/report_chart";
import reportHeatMap from "@/components/report/newReport/report_heat_map";
import reportRatioTable from "@/components/report/newReport/report_ratio_table";
import reportBackCover from "@/components/report/newReport/report_back_cover";
import reportTable from "@/components/report/newReport/report_table";
import reportChartMulti from "@/components/report/newReport/report_chart_multi";
import moment from "moment";
import _ from "lodash";
import Bus from "@/libs/bus.js";
import { setToken } from "@/libs/util";
import axios from "axios";
import mixins from "./reportMixin.js";

import {
  newReportEnter,
  newReportSuggest,
  newReportGate,
  newReportShop,
} from "@/api/report";
import { getanalysiseeo, getGroupOrganization } from "@/api/home";
import {
  newReportFloorStore,
  newReportFormatStore,
  newReportHeatMap,
  newReportOrderly,
  newReportDisorder,
  newReportDwellStore,
  newReportDwellFormat,
} from "@/api/new_report";
export default {
  name: "new-download-report-day",
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportHeatMap,
    reportRatioTable,
    reportBackCover,
    reportTable,
    reportChartMulti,
  },
  data() {
    return {
      clickData: 0,
      showPDF: false,
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
      ratioTableColumn: {
        name1: ["时间", "入客流"],
        name2: ["环比分析"],
        name3: ["时间", "入客流", "增长率"],
      },
      ratioTableData: [],
      allFloorStore: [],
      allFormatStore: [],
      allHeatMap: [],
      orderlyData: {
        relevancy: {
          column: ["实体名称", "实体名称", "关联度"],
          table: [],
        },
        inversion: {
          column: ["实体名称", "实体名称", "转换量"],
          table: [],
        },
      },
      disorderData: {
        relevancy: {
          column: ["实体名称", "实体名称", "关联度"],
          table: [],
        },
        inversion: {
          column: ["实体名称", "实体名称", "转换量"],
          table: [],
        },
      },
      dwellChartData: {
        option: {},
        remarkData: [],
      },
      allDwellFormatStore: [],
      pdfBaseUrl: "",
    };
  },
  computed: {
    selectDateText() {
      return this.$route.query.date;
    },
    oneListData() {
      return [
        {
          name: "当日客流总览",
          text:
            "客流时间:" +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time,
        },
        {
          name: "昨日客流总览",
          text: "客流时间:" + this.saveHeaderData.yester,
        },
      ];
    },
    trendTitle() {
      return {
        name: "当日客流趋势",
        text:
          "客流时间:" +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time,
      };
    },
    gateTitle() {
      return {
        name: "当日出入口客流TOP10对比分析",
        text:
          "客流时间:" +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time,
      };
    },
    shopTitle() {
      return {
        name: "当日店铺客流TOP10对比分析",
        text:
          "客流时间:" +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time,
      };
    },
    floorStoreTitle() {
      return {
        name: "当日各楼层TOP10店铺客流分析",
        text:
          "客流时间:" +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time,
      };
    },
    formatStoreTitle() {
      return {
        name: "当日各业态TOP10店铺客流分析",
        text:
          "客流时间:" +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time,
      };
    },
    orderlyTitle() {
      return {
        relevancy: {
          name: "当日无序关联度TOP10",
          text:
            "客流时间:" +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time,
        },
        inversion: {
          name: "当日无序转换量TOP10",
          text:
            "客流时间:" +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time,
        },
      };
    },
    disorderTitle() {
      return {
        relevancy: {
          name: "当日有序关联度TOP10",
          text:
            "客流时间:" +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time,
        },
        inversion: {
          name: "当日有序转换量TOP10",
          text:
            "客流时间:" +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time,
        },
      };
    },
    dwellTitle() {
      return {
        name: "当日业态停留时间TOP10",
        text:
          "客流时间:" +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time,
      };
    },
    formatDwellStoreTitle() {
      return {
        name: "当日业态中商铺停留时间TOP10",
        text:
          "客流时间:" +
          this.saveHeaderData.year +
          "." +
          this.saveHeaderData.time,
      };
    },
  },
  watch: {},
  activated() {},
  mounted() {
    let token = this.$route.query.token;
    this.pdfBaseUrl = this.$route.query.pdfUrl;
    setToken(token, 1);
    this.parameterData();
  },
  methods: {
    parameterData() {
      // 查找对应的 购物中心 id
      getGroupOrganization().then((res) => {
        let propertyId = Number(this.$route.query.propertyId);
        let property = _.filter(res.data.data.property, (o) => {
          return o.property_id === propertyId;
        })[0];
        this.$store.commit("saveOrganizationData", res.data.data);
        this.$store.commit("headerData", {
          text: property.name,
          value: property.property_id,
          img: property.map_url,
        });
        this.$store.commit("headerAction", property.property_id);
        setTimeout(() => {
          this.reportQuery();
        }, 1000);
      });
    },
    reportQuery() {
      let reportDate = this.$route.query.date.split(",")[0];
      this.headerDate(reportDate);
      let yesterday = moment(reportDate)
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      this.showPDF = false;
      let lastWeek = moment(this.selectDateText.split(",")[0])
        .subtract(1, "weeks")
        .format("YYYY-MM-DD");
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
          report_type: "day",
        }),
        //  当前趋势
        getanalysiseeo({
          bzid: this.bzid,
          type: "enter",
          range: this.selectDateText,
          innerRange: "1h",
        }),
        // 当前集客量
        // getanalysiseeo({ bzid: this.bzid, type: 'occupancy', range: this.selectDateText, innerRange: '1h' }),
        // 昨日趋势
        getanalysiseeo({
          bzid: this.bzid,
          type: "enter",
          range: yesterday + "," + yesterday,
          innerRange: "1h",
        }),
        // 出入口
        newReportGate({
          timeRange1: this.selectDateText,
          timeRange2: yesterday + "," + yesterday,
          report_type: "day",
          property_id: this.propertyId,
        }),
        // 商铺
        newReportShop({
          time1: this.selectDateText,
          time2: yesterday + "," + yesterday,
          report_type: "day",
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
        // 关联度 有序
        newReportOrderly({
          time: this.selectDateText,
          property_id: this.propertyId,
          sort_parameter: "rate",
          report_type: "day",
        }),
        newReportOrderly({
          time: this.selectDateText,
          property_id: this.propertyId,
          sort_parameter: "value",
          report_type: "day",
        }),
        // 关联度 无序
        newReportDisorder({
          time: this.selectDateText,
          property_id: this.propertyId,
          sort_parameter: "rate",
          report_type: "day",
        }),
        newReportDisorder({
          time: this.selectDateText,
          property_id: this.propertyId,
          sort_parameter: "value",
          report_type: "day",
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
          type: "enter",
          range: lastWeek + "," + lastWeek,
          innerRange: "1h",
        }),
      ]).then((res) => {
        this.showPDF = true;
        // 建议
        this.suggestText = res[0].data.data[0].property_suggest;
        // 客流总览
        this.reportOneData(res[1].data.data);
        // 客流趋势
        this.trendDataList(
          res[2].data.data,
          res[3].data.data,
          res[15].data.data
        );
        // 出入口
        this.gateDataList(res[4].data.data);
        // 商铺
        this.shopDataList(res[5].data.data);
        // 楼层下的商铺
        this.floorDataList(res[6].data.data);
        // 业态下的商铺
        this.formatDataList(res[7].data.data);
        // 热力图
        this.heatMapData(res[8].data.data, "当日");
        // 关联度 有序
        this.relevanceTableData(
          res[9].data.data.matrixList,
          res[10].data.data.matrixList,
          "orderlyData"
        );
        // 关联度 无序
        this.relevanceTableData(
          res[11].data.data,
          res[12].data.data,
          "disorderData"
        );
        // 停留时间 业态
        this.dwellFormatData(res[13].data.data);
        // 停留时间 业态 商铺
        this.dwellFormatStoreData(res[14].data.data);
      });
    },
    headerDate(value) {
      let headerDate = {
        year: moment(value).format("YYYY"),
        time: moment(value).format("MM.DD"),
        period: "",
        week: this.weekType(value),
        type: "daily",
        yester: moment(value)
          .subtract(1, "days")
          .format("YYYY.MM.DD"),
        reportDate: moment(value).format("YYYY.MM.DD"),
      };
      this.saveHeaderData = headerDate;
      this.$store.commit("dayReportHeader", headerDate);
    },
    // 趋势数据
    trendDataList(enterData, yesterdayData, lastWeekData) {
      this.ratioTableData = [];
      let highest = {
        number: 0,
        time: "",
      };
      let highestYest = {
        number: 0,
        time: "",
      };
      let highestWeek = {
        number: 0,
        time: "",
      };
      this.trendChartData.option = _.cloneDeep(this.enterOption);
      let enterObj = {
        name: "今日客流",
        color: "#745AEF",
        type: "line",
        data: [],
      };
      let enterObjYest = {
        name: "昨日客流",
        color: "#00A0E9",
        type: "line",
        data: [],
      };
      let enterObjWeek = {
        name: "上周同日客流",
        color: "#00A0A0",
        type: "line",
        data: [],
      };
      // let occupancyObj = {
      //    name: '集客量',
      //       color: '#00A0E9',
      //       type: 'line',
      //       data: []
      // }
      enterData.forEach((list, index) => {
        let time = moment(list.begin).format("HH:mm");
        this.trendChartData.option.xAxis.categories.push(time);
        enterObj.data.push(list.enter);
        enterObjYest.data.push(yesterdayData[index].enter);
        enterObjWeek.data.push(lastWeekData[index].enter);
        //   let occupancy = occupancyData[index].occupancy < 0 ? 0 : occupancyData[index].occupancy
        // occupancyObj.data.push(occupancy)
        if (Number(list.enter) > highest.number) {
          highest.number = list.enter;
          highest.time = Number(moment(list.begin).format("H"));
        }
        if (Number(yesterdayData[index].enter) > highestYest.number) {
          highestYest.number = yesterdayData[index].enter;
          highestYest.time = Number(
            moment(yesterdayData[index].begin).format("H")
          );
        }
        if (Number(lastWeekData[index].enter) > highestWeek.number) {
          highestWeek.number = lastWeekData[index].enter;
          highestWeek.time = Number(
            moment(lastWeekData[index].begin).format("H")
          );
        }
        // 表格
        this.ratioTableData.push({
          data: [
            moment(list.begin).format("YYYY-MM-DD-HH:mm"),
            list.enter.toLocaleString() + "人次",
            moment(yesterdayData[index].begin).format("YYYY-MM-DD-HH:mm"),
            yesterdayData[index].enter.toLocaleString() + "人次",
            this.sequential(list.enter, yesterdayData[index].enter) + "%",
          ],
        });
      });
      //  this.trendChartData.option.series=[enterObj,occupancyObj]
      this.trendChartData.option.series = [
        enterObj,
        enterObjYest,
        enterObjWeek,
      ];
      let cuT = _.sumBy(enterData, (o) => {
        return o.enter;
      });
      let yeT = _.sumBy(yesterdayData, (o) => {
        return o.enter;
      });
      this.ratioTableData.push({
        data: [
          "合计",
          cuT.toLocaleString() + "人次",
          "-",
          yeT.toLocaleString() + "人次",
          this.sequential(cuT, yeT) + "%",
        ],
      });
      let enterNumber = this.trendChartData.option.series[0].data;
      let yestNum = this.trendChartData.option.series[1].data;
      let weekNum = this.trendChartData.option.series[2].data;
      this.trendChartData.remarkData = [
        "开始营业后一小时间客流量 当日 " +
          enterNumber[0].toLocaleString() +
          "人次" +
          " 昨日 " +
          yestNum[0].toLocaleString() +
          "人次" +
          " 上周同日 " +
          +weekNum[0].toLocaleString() +
          "人次",
        "结束营业前一小时间客流量 当日 " +
          enterNumber[enterNumber.length - 1].toLocaleString() +
          "人次" +
          " 昨日 " +
          yestNum[yestNum.length - 1].toLocaleString() +
          "人次" +
          " 上周同日 " +
          weekNum[weekNum.length - 1].toLocaleString() +
          "人次",
        "当日" +
          highest.time +
          "点到" +
          (highest.time + 1) +
          "点达到客流峰值" +
          highest.number.toLocaleString() +
          "人次；" +
          "昨日" +
          highestYest.time +
          "点到" +
          (highestYest.time + 1) +
          "点达到客流峰值" +
          highestYest.number.toLocaleString() +
          "人次；" +
          "上周同日" +
          (highestWeek.time ? highestWeek.time : 0) +
          "点到" +
          (highestWeek.time + 1) +
          "点达到客流峰值" +
          highestWeek.number.toLocaleString() +
          "人次",
      ];
    },
    gateDataList(gateData) {
      this.gateChartData.option = _.cloneDeep(this.enterOption);
      let [currentObj, yesterObj, lastObj, lastWeekObj] = [
        {
          name: "本日客流",
          color: "#2081D4",
          type: "column",
          data: [],
        },
        {
          name: "昨日客流",
          color: "#2BD9CF",
          type: "column",
          data: [],
        },
        {
          name: "同期客流",
          color: "#874bd9",
          type: "column",
          data: [],
        },
        {
          name: "上周同日客流",
          color: "#554Dd0",
          type: "column",
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

          let lastWeekEnter = _.find(
            gateData.last_week_day,
            (o) => o.bzid === list.bzid
          ).enter;
          lastWeekObj.data.push(lastWeekEnter);
          this.gateChartData.option.xAxis.categories.push(list.name);
        });
      }
      this.gateChartData.option.series = [
        currentObj,
        yesterObj,
        lastObj,
        lastWeekObj,
      ];
      this.gateChartData.remarkData = gateData.comment;
    },
    shopDataList(shopData) {
      this.shopChartData.option = _.cloneDeep(this.enterOption);
      let [currentObj, yesterObj, lastObj] = [
        {
          name: "本日客流",
          color: "#2081d4",
          type: "column",
          data: [],
        },
        {
          name: "昨日客流",
          type: "column",
          color: "#2BD9CF",
          data: [],
        },
        {
          name: "上周同日客流",
          type: "column",
          color: "#3DD0FC",
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
          if (shopData.last_week_day.length) {
            let lastEnter = _.find(
              shopData.last_week_day,
              (o) => o.id === list.id
            ).data;
            lastObj.data.push(lastEnter);
          } else {
            lastObj.data.push(0);
          }
          this.shopChartData.option.xAxis.categories.push(list.name);
        });
      }
      this.shopChartData.option.series = [currentObj, yesterObj, lastObj];
      this.shopChartData.remarkData = shopData.comment;
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
        if (!this.pdfBaseUrl) {
          this.$message.warning(this.$t("error.pdfError"));
        } else {
          setTimeout(() => {
            axios.get(this.pdfBaseUrl + "/pdf/finish", {
              params: { filename: this.selectDateText },
            });
          }, 8000);
        }
      });
    },
  },
};
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
