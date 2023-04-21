<template>
  <div class="holidayAnaysis">
    <div class="box-card bg-white selector-container">
      <div class="flex-center">
        <vs-select
          class="w-select"
          @change="yearChangeData(1)"
          autocomplete
          v-model="selectYear"
        >
          <vs-select-item
            :value="item.value"
            :text="item.key"
            :key="index"
            v-for="(item, index) in years"
          />
        </vs-select>
        <vs-select class="w-select m-l-20" autocomplete v-model="selectHoliday">
          <vs-select-item
            :value="item.value"
            :text="$t(item.key)"
            :key="index"
            v-for="(item, index) in holidays"
          />
        </vs-select>
        <Button
          size="large"
          class="m-l-20"
          type="primary"
          @click="handleSearch"
          >{{ $t("查询") }}</Button
        >
        <Button size="large" class="m-l-20" @click="trendResetData">{{
          $t("重置")
        }}</Button>
      </div>
    </div>
    <HolidayAnalysis
      class="HolidayAnalysis"
      :series="series"
      :type="type"
      :options="options"
      :columns="columns"
      :tableList="tableList"
      :dateTime="selectYear"
      :pdfName="trendPdf"
      :domId="idOne"
      :selectHoliday="selectHoliday"
      :ExcelData="trendExcel"
    ></HolidayAnalysis>

    <div class="box-card bg-white selector-container">
      <!-- <p class="title">节假日活动对比分析</p> -->
      <div class="flex-center">
        <vs-select
          class="w-select"
          autocomplete
          @change="yearChangeData(2)"
          v-model="compareYear1"
        >
          <vs-select-item
            :value="item.value"
            :text="item.key"
            v-for="(item, index) in years"
          />
        </vs-select>
        <vs-select
          class="w-select m-l-20"
          autocomplete
          v-model="compareHoliday1"
        >
          <vs-select-item
            :value="item.value"
            :text="item.key"
            v-for="(item, index) in holidayActives1"
          />
        </vs-select>
      </div>
      <div class="flex-center">
        <vs-select
          class="w-select"
          autocomplete
          @change="yearChangeData(3)"
          v-model="compareYear2"
        >
          <vs-select-item
            :value="item.value"
            :text="item.key"
            v-for="(item, index) in years"
          />
        </vs-select>
        <vs-select
          class="w-select m-l-20"
          autocomplete
          v-model="compareHoliday2"
        >
          <vs-select-item
            :value="item.value"
            :text="item.key"
            v-for="(item, index) in holidayActives2"
          />
        </vs-select>
        <Button
          size="large"
          class="m-l-20"
          type="primary"
          @click="handleSearchCompare"
          >{{ $t("查询") }}</Button
        >
        <Button size="large" class="m-l-20" @click="HolidaysResetData">{{
          $t("重置")
        }}</Button>
      </div>
    </div>
    <HolidayAnalysis
      class="HolidayAnalysis"
      :type="type"
      :series="series2"
      :options="options2"
      :columns="columns2"
      :tableList="tableList2"
      :pdfName="contrastPdf"
      :domId="idTwo"
      :ExcelData="contrastExcel"
      :title1="'节假日活动对比分析'"
    ></HolidayAnalysis>
  </div>
</template>

<script>
import Moment from "moment";
import HolidayAnalysis from "@/components/holiday-analysis/holiday-analysis.vue";
import { getDateCompare, getYearList } from "@/api/operate";
import { getanalysiseeo } from "@/api/home";
import { getActiveDays, holidayAnalysis } from "@/api/manager.js";
import {  gotInnerRange } from "@/libs/util.js";

export default {
  components: {
    HolidayAnalysis,
  },
  data() {
    return {
      trendExcel: {
        type: 1,
        enter: "enter",
        bzid: "",
        year: "",
      },
      contrastExcel: {
        type: 2,
        data: {},
      },
      idOne: "idOne",
      idTwo: "idTwo",
      trendPdf: "节假日活动趋势分析/",
      contrastPdf: "节假日活动对比分析/",
      type: "bar",
      years: [],
      entities: [],
      holidays: [], // 节假日数据
      holidayActives1: [], // 节假日活动数据
      holidayActives2: [], // 节假日活动数据
      selectYear: new Date().getFullYear(),
      compareYear1: new Date().getFullYear(),
      compareYear2: new Date().getFullYear(),
      compareHoliday1: "",
      compareHoliday2: "",
      selectEntity: "",
      selectEntity2: "",
      selectHoliday: "",
      targetData: [],
      AllHolidayData: [], // 所有的节假日
      current: 0,
      year: "",
      bzids: [],
      columns: ["节日", "客流量"],
      columns2: ["时间"],
      tableList: [],
      tableList2: [],
      series: [
        {
          name: "",
          data: [],
        },
      ],
      series2: [],
      options0: {
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: "rounded",
            columnWidth: "30%",
          },
        },
        chart: {
          height: 505,
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#7467ED", "#2BD9CF", "#EA5455", "#FF9F43", "#1E1E1E"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 2,
        },
        title: {
          text: "",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        noData: {
          text: "暂无数据",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: "14px",
            fontFamily: undefined,
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: "",
          },
          labels: {
            show: true,
            formatter: (value) => {
              return value.toLocaleString();
            },
          },
        },
        tooltip: {
          y: {
            formatter: (val) => {
              if (val === null) return "";
              else {
                return (
                  this.$t("客流量") +
                  ":" +
                  val.toLocaleString() +
                  this.$t("人次")
                );
              }
            },
          },
        },
      },
      options2: {
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: "rounded",
            columnWidth: "30%",
          },
        },
        chart: {
          height: 505,
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 2,
        },
        title: {
          text: "",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        noData: {
          text: "暂无数据",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: "14px",
            fontFamily: undefined,
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: "",
          },
          labels: {
            show: true,
            formatter: (value) => {
              return value.toLocaleString();
            },
          },
        },
        tooltip: {
          y: {
            formatter: (val) => {
              if (val === 0)
                return this.$t("客流量") + ":" + 0 + this.$t("人次");
              if (val === null) return "";
              else
                return (
                  this.$t("客流量") +
                  ":" +
                  val.toLocaleString() +
                  this.$t("人次")
                );
            },
          },
        },
        markers: {
          size: 5,
          hover: {
            sizeOffset: 2,
          },
        },
      },
      options: {
        colors: ["#00A0E9", "#7467ED", "#EA5455", "#FF9F43", "#1E1E1E"],
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: "rounded",
            columnWidth: "30%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: false,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: "",
          },
          labels: {
            show: true,
            formatter: (value) => {
              return value.toLocaleString();
            },
          },
        },
        noData: {
          text: "暂无数据",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: "14px",
            fontFamily: undefined,
          },
        },
        fill: {
          opacity: 1,
        },
        chart: {
          toolbar: {
            show: false,
          },
        },
        tooltip: {
          y: {
            formatter: (val) => {
              if (val === 0)
                return this.$t("客流量") + ":" + 0 + this.$t("人次");
              if (val === null) return "";
              else
                return (
                  this.$t("客流量") +
                  ":" +
                  val.toLocaleString() +
                  this.$t("人次")
                );
            },
          },
        },
      },
    };
  },
  watch: {
    "$store.state.home.headerAction"() {
      this.trendResetData();
      this.HolidaysResetData();
      let routerName = this.$router.currentRoute.name;
      if (routerName === "HolidayAnalysis") this.init();
    },
  },
  computed: {},
  activated() {
    this.init();
  },
  mounted() {},
  methods: {
    // 开始加载
    async init() {
      let propertyId = this.$store.state.home.headerAction;
      await getYearList({ property_id: propertyId }).then((res) => {
        this.years = res.data.data.map((val) => {
          return (val = { key: val, value: val });
        });
      });
      this.selectYear = Moment().year();
      this.compareYear1 = Moment().year();
      this.compareYear2 = Moment().year();
      this.initialApiData();
      this.selectEntity = "";
      this.selectEntity2 = "";
      var bussinessTree = this.$store.state.home.bussinessTree;
      var entities = [];
      bussinessTree.forEach(function(m, index) {
        if (m.property_id == propertyId) {
          var data = {};
          data.key = m.name;
          data.value = m.id;
          entities.push(data);
        }
      });
      this.entities = entities;
      this.selectEntity = entities[0].value;
      this.selectEntity2 = entities[0].value;
    },
    initialApiData() {
      let year = this.selectYear;
      let propertyId = this.$store.state.home.headerAction;
      const params1 = {
        type_id:20,
        year,
      }
      const params2 = {
        type_id:21,
        year,
        property_id:propertyId
      }
      Promise.all([
        getActiveDays(params1),
        getActiveDays(params2),
      ]).then((res) => {
        // 节假日
        this.holidays = [];
        this.holidayActives1 = [];
        this.holidayActives2 = [];
        this.AllHolidayData = [];
        console.log(res[0].data)
        if (res[0].data.code == 200) {
          let data = res[0].data.data.list;
          this.holidays.push({ key: "全部节假日活动", value: "" });
          data.map((list) => {
            this.AllHolidayData.push(list);
            let obj = {};
            obj.value = list.id;
            obj.key = list.name;
            this.holidays.push(obj);
            this.holidayActives1.push(obj);
            this.holidayActives2.push(obj);
          });
          this.selectHoliday = this.holidays[0] ? this.holidays[0].value : "";
          setTimeout(() => {
            this.compareHoliday1 = this.holidayActives1[0]
              ? this.holidayActives1[0].value
              : "";
            this.compareHoliday2 = this.holidayActives2[0]
              ? this.holidayActives2[0].value
              : "";
          });
        }
        // 活动
        if (res[1].data.code == 200) {
          let data = res[1].data.data.list;
          data.map((list) => {
            this.AllHolidayData.push(list);
            let obj = {};
            obj.value = list.id;
            obj.key = list.name;
            this.holidays.push(obj);
            this.holidayActives1.push(obj);
            this.holidayActives2.push(obj);
          });
          setTimeout(() => {
            this.handleSearch();
            this.handleSearchCompare();
          });
        }
      });
    },
    yearChangeData(type) {
      let year;
      let propertyId = this.$store.state.home.headerAction;
      switch (type) {
        case 1:
          year = this.selectYear;
          break;
        case 2:
          year = this.compareYear1;
          break;
        case 3:
          year = this.compareYear2;
          break;
      }

      Promise.all([
        getActiveDays(year, 20),
        getActiveDays(year, 21, propertyId),
      ]).then((res) => {
        // 节假日

        if (res[0].data.code == 200) {
          let data = res[0].data.data;
          let listData = data.map((list) => {
            this.AllHolidayData.push(list);
            let obj = {};
            obj.value = list.id;
            obj.key = list.name;
            return obj;
          });
          switch (type) {
            case 1:
              year = this.selectYear;
              this.holidays = [];
              this.holidays = [
                { key: "全部节假日活动", value: "" },
                ...listData,
              ];
              break;
            case 2:
              year = this.compareYear1;
              this.holidayActives1 = [];
              this.holidayActives1 = listData;
              break;
            case 3:
              year = this.compareYear2;
              this.holidayActives2 = [];
              this.holidayActives2 = listData;
              break;
          }
        }
        // 活动
        if (res[1].data.code == 200) {
          let data = res[1].data.data;
          let listData = data.map((list) => {
            this.AllHolidayData.push(list);
            let obj = {};
            obj.value = list.id;
            obj.key = list.name;
            return obj;
          });
          switch (type) {
            case 1:
              this.holidays = [...this.holidays, ...listData];
              this.selectHoliday = this.holidays[0]
                ? this.holidays[0].value
                : "";
              break;
            case 2:
              this.holidayActives1 = [...this.holidayActives1, ...listData];
              this.compareHoliday1 = this.holidayActives1[0]
                ? this.holidayActives1[0].value
                : "";
              break;
            case 3:
              this.holidayActives2 = [...this.holidayActives2, ...listData];
              this.compareHoliday2 = this.holidayActives2[0]
                ? this.holidayActives2[0].value
                : "";
              break;
          }
        }
      });
    },
    // 趋势分析 查询
    handleSearch() {
      var year = this.selectYear;
      var bzid = this.selectEntity;
      var holiday = this.selectHoliday;
      var that = this;
      if (!year) {
        this.$alert({ content: "请选择年份" });
        return;
      }
      if (!bzid) {
        this.$alert({ content: "请选择购物中心" });
        return;
      }
      if (!holiday) {
        that.trendExcel.bzid = bzid;
        that.trendExcel.year = year;
        that.trendExcel.innerRange = "";
        that.trendExcel.range = "";
        holidayAnalysis("enter", bzid, year).then(function(res) {
          var xAxis = res.data.data.map(function(m) {
            return m.name;
          });
          var series = res.data.data.map(function(m) {
            return m.enter;
          });
          var options = _.cloneDeep(that.options);
          options.xaxis.categories = xAxis;
          var columnWidth = "30%";
          if (xAxis.length) columnWidth = xAxis.length < 5 ? "20%" : "70%";
          options.plotOptions.bar.columnWidth = columnWidth;
          that.options = options;
          that.series[0].data = series;
          var tableList = res.data.data;
          tableList.forEach(function(m) {
            m.enter = m.enter == 0 ? " " : m.enter.toLocaleString();
          });
          that.tableList = tableList;
          that.columns = ["节日", that.$t("fn.EnterUnit", [that.$t("人次")])];
        });
      } else {
        let holiday = _.find(this.AllHolidayData, { id: this.selectHoliday });
        let innerRange = gotInnerRange([holiday.start_date, holiday.end_date]);
        var range = holiday.start_date + "," + holiday.end_date;
        var params = {
          type: "enter",
          bzid: bzid,
          innerRange: innerRange,
          range: range,
        };
        that.trendExcel.bzid = bzid;
        that.trendExcel.year = "";
        that.trendExcel.innerRange = innerRange;
        that.trendExcel.range = range;
        var xAxis;
        getanalysiseeo(params).then(function(res) {
          if (innerRange == "1h") {
            console.log(res)
            xAxis = res.data.data.map(function(m) {
              return m.begin.split(" ")[1];
            });
          } else {
            xAxis = res.data.data.map(function(m) {
              return m.begin.split(" ")[0];
            });
          }
          var series = res.data.data.map(function(m) {
            return m.enter;
          });
          var options = _.cloneDeep(that.options);
          options.xaxis.categories = xAxis;
          var columnWidth = "30%";
          if (xAxis.length) {
            columnWidth = xAxis.length < 5 ? "20%" : "70%";
          }
          options.plotOptions.bar.columnWidth = columnWidth;
          that.options = options;
          that.series[0].data = series;
          var tableList = res.data.data;
          var tableData = [];
          tableList.forEach(function(m) {
            var obj = {};
            if (innerRange == "1h") {
              obj.begin = m.begin.split(" ")[1];
            } else {
              obj.begin = m.begin.split(" ")[0];
            }
            obj.enter = m.enter == 0 ? " " : m.enter.toLocaleString();
            tableData.push(obj);
          });
          that.columns = ["日期", that.$t("fn.EnterUnit", [that.$t("人")])];
          that.tableList = tableData;
        });
      }
    },
    // 节假日活动对比分析 查询
    handleSearchCompare() {
      var that = this;

      that.columns2 = ["时间"];
      var compare1 = _.find(this.AllHolidayData, { id: this.compareHoliday1 });
      var compare2 = _.find(this.AllHolidayData, { id: this.compareHoliday2 });
      if (!compare1 || !compare2) return;
      var date1 = { start_date: compare1.start_date, end_date: compare1.end_date };
      var date2 = { start_date: compare2.start_date, end_date: compare2.end_date };
      var params = {
        date1: {
          start_date: date1.start_date,
          end_date: date1.end_date,
        },
        date2: {
          start_date: date2.start_date,
          end_date: date2.end_date,
        },
        type: "enter",
        bzid: this.selectEntity,
      };
      that.columns2.push(
        Moment(compare1.start_date).format("YYYY") +
          compare1.name +
          " ( " +
          this.$t("人次") +
          " )"
      );
      that.columns2.push(
        Moment(compare2.start_date).format("YYYY") +
          compare2.name +
          " ( " +
          this.$t("人次") +
          " )"
      );
      that.contrastExcel.data = params;
      getDateCompare(params).then((res) => {
        var data = res.data.data;
        var xaxis = [];
        data.forEach((m, index) => {
          xaxis.push(this.$t("fn.第_天", [this.$t(index + 1)]));
        });
        var resData1 = [];
        if (Moment(compare1.start_date).isAfter(Moment(new Date()))) {
          resData1 = data.map(function(m, index) {
            return "";
          });
        } else {
          resData1 = data.map(function(m, index) {
            // if (Moment(m.date1.belong).isBetween(compare1.start_date, compare1.end_date) ||
            // Moment(m.date1.belong).isSame(compare1.start_date) || Moment(m.date1.belong).isSame(compare1.end_date)) {
            //   if (!m.date1.enter) return 0
            //   else return m.date1.enter
            // }
            if (!m.date1.enter) return 0;
            else return m.date1.enter;
          });
        }
        var resData2 = [];
        if (Moment(compare2.start_date).isAfter(Moment(new Date()))) {
          resData2 = data.map(function(m, index) {
            return "";
          });
        } else {
          resData2 = data.map(function(m) {
            // if (Moment(m.date2.belong).isBetween(compare2.start_date, compare2.end_date) ||
            // Moment(m.date2.belong).isSame(compare2.start_date) || Moment(m.date2.belong).isSame(compare2.end_date)) {
            //   if (!m.date2.enter) return 0
            //   else return m.date2.enter
            // }
            if (!m.date2.enter) return 0;
            else return m.date2.enter;
          });
        }
        var series2 = [{ name: "", data: [] }, { name: "", data: [] }];
        series2[0].name = Moment(compare1.start_date).format("YYYY") + compare1.name;
        series2[0].smooth = true;
        series2[0].data = resData1;
        series2[1].name = Moment(compare2.start_date).format("YYYY") + compare2.name;
        series2[1].smooth = true;
        series2[1].data = resData2;
        that.series2 = series2;

        var options2 = _.cloneDeep(that.options0);
        options2.xaxis.categories = xaxis;
        var columnWidth = "30%";
        if (xaxis.length) {
          columnWidth = xaxis.length < 5 ? "20%" : "70%";
        }
        options2.plotOptions.bar.columnWidth = columnWidth;
        that.options2 = options2;
        var tableList2 = [];
        resData1.forEach(function(m, index) {
          var obj = {};
          obj.name = xaxis[index] ? xaxis[index] : " ";
          if (m || m === 0) obj.begin = m.toLocaleString() || " ";
          else obj.begin = " ";
          obj.end =
            resData2[index] || resData2[index] === 0
              ? resData2[index].toLocaleString()
              : " ";
          tableList2.push(obj);
        });
        that.tableList2 = tableList2;
      });
    },
    // 趋势分析重置
    trendResetData() {
      this.selectHoliday = this.holidays[0].value;
      this.selectYear = new Date().getFullYear();
    },
    // 节假日活动对比分析 重置
    HolidaysResetData() {
      this.compareYear1 = new Date().getFullYear();
      this.compareYear2 = new Date().getFullYear();
      this.compareHoliday1 = this.holidayActives1[0].value;
      this.compareHoliday2 = this.holidayActives2[0].value;
    },
  },
};
</script>

<style scope lang="less">
.holidayAnaysis {
  .chartsTable {
    background-color: #fff;
    margin-top: 20px;
    border-radius: 6px;
    box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, 0.4);
  }
  .title {
    width: 100%;
    font-size: 18px;
    color: #636363;
  }
  .HolidayAnalysis {
    margin-bottom: 40px;
    position: relative;
  }
}
</style>
