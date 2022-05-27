<template>
  <div class="effective">
    <flow-selector
      :onlyTime="true"
      ref="selectData"
      @paramsPrepare="paramsPrepare"
    ></flow-selector>
    <div class="chartContent" v-if="isShowChart">
      <div ref="effCahrt" class="eff-box">
        <goalCharts
          class="charts"
          id="tendencyLine"
          title1="去重客流趋势"
          :height1="chartheight"
          :height3="chartheight"
          :options1="trendAndAvg.trendLineOption"
          :options2="trendAndAvg.trendBarOption"
          :series1="trendAndAvg.trendLineSeries"
          :series2="trendAndAvg.trendBarSeries"
          :columns="trendAndAvg.trendColumn"
          :tableList="trendAndAvg.trendTable"
        ></goalCharts>
      </div>
      <div class="cardContent">
        <div style="align-self: start;width: 100%; position: relative">
          <div class="flex-between title">
            <span>无效客流占比</span>
            <span>{{ invalidRate }}%</span>
          </div>
          <div class="rate">
            <span style="color:#37B5ED">{{ invalidFlow }}</span
            >/{{ allFlow }}
          </div>
          <el-progress
            :stroke-width="10"
            color="#37B5ED"
            :percentage="Number(invalidRate)"
            :show-text="false"
          ></el-progress>
        </div>
        <div class="flex-between">
          <vue-apex-charts
            type="radialBar"
            width="90%"
            :options="optionsA1"
            :series="[
              seriesA[0] ? ((seriesA[0] / invalidFlow) * 100).toFixed(2) : 0,
            ]"
          >
          </vue-apex-charts>
          <div class="rightDes">
            <span>{{ nameA[0] }}</span>
            <div>{{ seriesA[0] + "" }}</div>
          </div>
        </div>
        <div class="flex-between">
          <vue-apex-charts
            type="radialBar"
            width="90%"
            :options="optionsA2"
            :series="[
              seriesA[1] ? ((seriesA[1] / invalidFlow) * 100).toFixed(2) : 0,
            ]"
          >
          </vue-apex-charts>
          <div class="rightDes">
            <span>{{ nameA[1] }}</span>
            <div>{{ String(seriesA[1]) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import goalCharts from "@/components/goal/goalCharts.vue";
import Cards from "./components/Cards.vue";
import storeChart from "@/components/charts/storeChart.vue";
import VueApexCharts from "vue-apexcharts";
import { getInvalid } from "@/api/analysis";
import opt from "@/views/home/components/apexChartoption.js";

import _ from "lodash";
import { lineOptions, formatNumber, storeOption1 } from "@/libs/util";
import { options2 } from "@/libs/chart.js";
import FlowSelector from "_c/flow-selector/effective-flow-selector";
export default {
  name: "DwellTime",

  components: {
    VueApexCharts,
    Cards,
    goalCharts,
    storeChart,
    FlowSelector,
  },
  data() {
    return {
      allFlow: 0,
      invalidRate: 0,
      invalidFlow: 0,
      optionsA1: Object.assign(_.cloneDeep(opt.invalidRadialbar), {
        colors: ["#1DD9D1"],
      }),
      optionsA2: opt.invalidRadialbar,
      seriesA: [0, 0],
      nameA: [],
      isShowChart: true,
      chartheight: "0",
      showCharts: false,
      chartOptions: {},
      trendAndAvg: {
        trendLineOption: {},
        trendLineSeries: [],
        trendColumn: [],
        trendTable: [],
        trendBarOption: {},
        trendBarSeries: [],
      },
    };
  },
  mounted() {
    setTimeout(() => {
      let height = this.$refs.effCahrt.offsetHeight - 89;
      this.chartheight = height + "px";
    }, 200);
    window.onresize = () => {
      this.isShowChart = false;
      let height = this.$refs.effCahrt.offsetHeight - 89;
      this.chartheight = height + "px";
      setTimeout(() => {
        this.isShowChart = true;
      }, 500);
    };
  },
  methods: {
    /*
     *@method 处理图表需要的数据
     *@param {obj} res 请求的数据
     *@param {arr} xaxisCategories 时间对比的横坐标
     */
    initTrend(res, xaxisCategories) {
      var trendAndAvg = _.cloneDeep(this.trendAndAvg);
      if (res.status == 200) {
        var data = res.data.data;
        if (!data.invalid[0]) return (this.seriesA = [0, 0]);
        this.seriesA = [];
        var lineO = _.cloneDeep(lineOptions);
        var barO = _.cloneDeep(options2);
        // 处理横坐标
        // 无时间对比
        lineO.xaxis.categories = Object.keys(data.total.list);
        barO.xaxis.categories = Object.keys(data.total.list);
        // 处理series
        var lineSeries = [];
        var obj = {};
        obj.name = data.total.name;
        obj.data = Object.values(data.total.list);
        var obj2 = {};
        obj2.name = this.$t("无效客流");
        let invalidObj = {};
        data.invalid.forEach((ele) => {
          for (const key in ele.list) {
            invalidObj[key] = invalidObj[key] || 0;
            invalidObj[key] += Number(ele.list[key]);
            console.log(invalidObj[key]);
          }
        });
        obj2.data = Object.values(invalidObj);
        lineSeries.push(obj);
        lineSeries.push(obj2);
        var columnSeries = _.cloneDeep(lineSeries);
        columnSeries.forEach(function(m) {
          m.type = "column";
        });

        trendAndAvg.trendLineOption = Object.assign(lineO, {
          colors: ["#897FF0", "#FC4662"],
        });
        trendAndAvg.trendLineSeries = lineSeries;
        if (
          this.$refs.selectData.queryParams.compareType === "not" &&
          this.$refs.selectData.queryParams.date1Array[0] ===
            this.$refs.selectData.queryParams.date1Array[1]
        ) {
          var div = document.getElementById("tendencyLine");
          var width;
          if (div) width = div.offsetWidth;
          var number = (width / 2).toFixed(2) - 50;
          trendAndAvg.trendLineOption.xaxis.labels.offsetX = number;
        } else {
          trendAndAvg.trendLineOption.xaxis.labels.offsetX = 0;
        }
        if (barO.xaxis.categories.length < 2) {
          barO.plotOptions.bar.columnWidth = "15%";
        } else {
          barO.plotOptions.bar.columnWidth = "45%";
        }
        trendAndAvg.trendBarOption = Object.assign(barO, {
          colors: ["#897FF0", "#FC4662"],
        });
        trendAndAvg.trendBarSeries = columnSeries;
        this.allFlow = Object.values(data.total.list).reduce(
          (p, c) => p + c,
          0
        ); // total无效客流
        this.invalidFlow =
          Object.values(invalidObj).reduce((p, c) => p + c, 0) || 0;
        this.invalidRate =
          ((this.invalidFlow / this.allFlow) * 100).toFixed(2) || 0;

        data.invalid.forEach((ele, i) => {
          this.seriesA.push(
            Object.values(ele.list).reduce((p, c) => p + Number(c), 0)
          );
          this.nameA.push(ele.name.split("（")[0]);
        });
        trendAndAvg.trendTable = Object.keys(data.total.list).map((ele) => {
          let obj = {};
          obj.name = ele;
          obj.begin = data.total.list[ele] + "";
          obj.end = invalidObj[ele] + "";
          return obj;
        });
        trendAndAvg.trendColumn = [
          "日期",
          data.total.name + "（人）",
          "无效客流（人）",
        ];
      }
      return trendAndAvg;
    },
    /*
     *@method 查询
     *@param {obj} value 查询控件封装的数据
     */
    async paramsPrepare(value) {
      var that = this;
      this.showCharts = false;
      that.$store.commit("setRequestNumber", 2);
      this.chartOptions = storeOption1;

      var date1 = value.date1Array[0];
      var date2 = value.date1Array[1];
      // 请求数据
      getInvalid({ date1, date2 }).then((res) => {
        var trendAndAvg = that.initTrend(res);
        that.trendAndAvg = trendAndAvg;
        that.showCharts = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.effective {
  position: relative;
  .chartContent {
    min-height: 487px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    .eff-box {
      width: 77.5%;
      margin-right: 20px;
    }
    // .charts {
    //   width: 100%;
    //   // height: 534px;
    // }
    .rate {
      position: absolute;
      top: 80px;
      right: 0;
    }
    .cardContent {
      padding: 40px 30px;
      background-color: #fff;
      width: 21%;
      box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, 0.4);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
      .el-progress {
        padding: 30px 0;
      }
      .rightDes {
        width: 55%;
        font-size: 15px;
        font-weight: bold;
        line-height: 40px;
        div {
          font-weight: normal;
        }
      }
    }
    .cir-box {
      margin-top: 20px;
      width: 100%;
    }
    .circles {
      border-radius: 6px;
      background-color: #fff;
      width: 44.5%;
      display: inline-block;
      margin-right: 20px;
      box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, 0.4);
    }
  }
  .chartsTable .left-title .title {
    padding-top: 0 !important;
  }
}
</style>
