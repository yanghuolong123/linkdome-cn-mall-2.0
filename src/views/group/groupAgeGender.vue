<template>
  <div>
    <div class="group-client">
      <div class="box-card left">
        <div class="title">
          <p>{{ $t("ageDist") }}</p>
          <ul>
            <li
              :title="iconTitle[icon.type]"
              :key="index"
              v-for="(icon, index) in iconList"
              v-on:click="iconClick(index, 'age')"
            >
              <icons
                :type="icon.type"
                :size="20"
                :color="iconIndex === icon.value ? iconColor : '#9D9D9DFF'"
              ></icons>
            </li>
          </ul>
        </div>
        <div class="flex-cell">
          <vue-apex-charts
            v-if="iconIndex == 0"
            ref="ageGenderBar"
            type="bar"
            :options="ageOptions"
            :series="ageSeries"
          ></vue-apex-charts>
          <table-default
            v-else
            class="groupTable"
            :tableName="ageName"
            :tableList="ageTableList"
          ></table-default>
        </div>
      </div>

      <div class=" box-card center">
        <div class="title">
          <p>{{ $t("genderDist") }}</p>
          <ul>
            <li
              :title="iconTitle[icon.type]"
              :key="index"
              v-for="(icon, index) in iconList"
              v-on:click="iconClick(index, 'gender')"
            >
              <icons
                :type="icon.type"
                :size="20"
                :color="
                  genderIconIndex === icon.value ? iconColor : '#9D9D9DFF'
                "
              ></icons>
            </li>
          </ul>
        </div>
        <div class="flex-cell">
          <vue-apex-charts
            v-if="genderIconIndex == 0"
            ref="genderBar"
            type="bar"
            :options="genderChartOptions"
            :series="genderSeries"
          ></vue-apex-charts>
          <table-default
            v-else
            class="groupTable"
            :tableName="genderName"
            :tableList="genderTableList"
          ></table-default>
        </div>
      </div>
    </div>
    <div class=" group-age-gender">
      <div class=" box-card left">
        <div class="title">
          <p>
            {{ $t("newOldCusProportion") }}
            <Tooltip
              :content="$t('notices.customer')"
              placement="bottom"
              theme="light"
              transfer
              max-width="600"
            >
              <icons type="wenhao" />
            </Tooltip>
          </p>
          <ul>
            <li
              :key="index"
              v-for="(icon, index) in iconList"
              v-on:click="iconClick(index, 'client')"
              :title="iconTitle[icon.type]"
            >
              <icons
                :type="icon.type"
                :size="20"
                :color="
                  clientIconIndex === icon.value ? iconColor : '#9D9D9DFF'
                "
              ></icons>
            </li>
          </ul>
        </div>
        <div class="flex-cell">
          <vue-apex-charts
            v-if="clientIconIndex == 0"
            ref="clientBar"
            type="bar"
            :options="clientOptions"
            :series="clientSeries"
          ></vue-apex-charts>
          <table-default
            v-else
            class="groupTable"
            :tableName="clientName"
            :tableList="clientTableList"
          ></table-default>
        </div>
      </div>
      <div class=" box-card right">
        <div class="title">
          <p>{{ $t("storeVisitProportion") }}</p>
          <ul>
            <li
              :key="index"
              v-for="(icon, index) in iconList"
              v-on:click="iconClick(index, 'frequency')"
              :title="iconTitle[icon.type]"
            >
              <icons
                :type="icon.type"
                :size="20"
                :color="
                  frequencyIconIndex === icon.value ? iconColor : '#9D9D9DFF'
                "
              ></icons>
            </li>
          </ul>
        </div>
        <div class="flex-cell">
          <vue-apex-charts
            v-if="frequencyIconIndex == 0"
            ref="frequencyBar"
            type="bar"
            :options="frequencyOptions"
            :series="frequencySeries"
          ></vue-apex-charts>
          <table-default
            v-else
            class="groupTable"
            :tableName="frequencyName"
            :tableList="frequencyTableList"
          ></table-default>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import { getEntityFlow, exportEx } from "@/api/home.js";
import TableDefault from "@/views/ui-elements/table/TableDefault.vue";
import { downloadEx } from "@/libs/util";
import _ from "lodash";
import moment from "moment";
export default {
  name: "group-age-gender",
  props: {
    outRange: String,
    default: "",
  },
  components: {
    VueApexCharts,
    TableDefault,
  },
  data() {
    return {
      downLoadIcon: "daoru",
      tootipText: this.$t("notices.customer"),
      iconColor: "rgb(34, 128, 215)",
      iconIndex: 0,
      frequencyIconIndex: 0,
      vipIconIndex: 0,
      clientIconIndex: 0,
      genderIconIndex: 0,
      iconList: [
        {
          type: "62",
          color: "#9D9D9DFF",
          value: 0,
        },
        {
          type: "biaoge-copy",
          color: "#9D9D9DFF",
          value: 1,
        },
        {
          type: "daoru",
          color: "#9D9D9DFF",
          value: 2,
        },
      ],
      iconTitle: {
        "62": this.$t('barChart'),
        "biaoge-copy":this.$t('detailDt'),
        daoru: this.$t('download'),
      },
      // table
      ageName: ["shopmall"],
      ageTableList: [],
      frequencyName: ["shopmall"],
      frequencyTableList: [],
      clientName: ["shopmall"],
      clientTableList: [],
      genderName: ["shopmall"],
      genderTableList: [],
      vipName: ["shopmall"],
      vipTableList: [],
      // chart type
      // 年龄分布
      ageSeries: [],
      ageOptions: {
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            columnWidth: "20%",
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return Number(val).toLocaleString();
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val)=> {
              return val.toLocaleString() + this.$t("person");
            },
          },
        },
        colors: ["#2BD9CF", "#00A0E9", "#33b3ed", "#FBA940", "#EC7172"],
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
      },
      // 到店次数
      frequencySeries: [],
      frequencyOptions: {
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            columnWidth: "20%",
            //  endingShape: 'rounded'
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return Number(val).toLocaleString();
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val) =>{
              return val.toLocaleString() + this.$t("person");
            },
          },
        },
        colors: ["#2BD9CF", "#00A0E9", "#33b3ed", "#FBA940", "#EC7172"],
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
      },
      // 新老顾客
      clientSeries: [],
      clientOptions: {
        chart: {
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            columnWidth: "40%",
            endingShape: "rounded",
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return Number(val).toLocaleString();
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val)=> {
              return val.toLocaleString() + this.$t("person");
            },
          },
        },
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
      },
      // 性别分布
      genderSeries: [],
      genderChartOptions: {
        chart: {
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            columnWidth: "40%",
            endingShape: "rounded",
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        colors: ["#ee7552", "rgb(0, 160, 233)"],
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return Number(val).toLocaleString();
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val) =>{
              return val.toLocaleString() + this.$t("person");
            },
          },
        },
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
      },
      vipSeries: [],
      vipChartOptions: {
        chart: {
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            columnWidth: "20%",
            endingShape: "rounded",
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return Number(val).toLocaleString();
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val.toLocaleString();
            },
          },
        },
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
      },
      ageTabList: [],
      genderTabList: [],
      customTabList: [],
      numTabList: [],
      downloadName: "",
    };
  },
  computed: {},
  mounted() {},
  updated() {},
  activated() {
    // 进入页面 初始化页面数据
    // this.initializeData()
  },
  watch: {
    // 监听事件 请求数据
    outRange() {
      this.dataList();
    },
  },
  methods: {
    // 请求数据
    dataList() {
      let that = this;
      let companyId = this.$store.state.user.companyId;
      let params = { range: this.outRange, company_id: companyId };
      getEntityFlow(params).then((res) => {
        if (res.data.code == 200) {
          this.initializeData();
          let data = res.data.data;
          // 年龄分布
          this.uploadChartXaxis(
            "age",
            data.age_distribution,
            "ageSeries",
            "ageGenderBar",
            "ageOptions"
          );

          // 到店次数
          this.uploadChartXaxis(
            "number",
            data.arrival_distribution,
            "frequencySeries",
            "frequencyBar",
            "frequencyOptions"
          );

          // 新老顾客占比
          this.uploadChartXaxis(
            "client",
            data.new_old_proportion,
            "clientSeries",
            "clientBar",
            "clientOptions"
          );

          // vip顾客占比
          //  this.uploadChartXaxis('vip', data.vip_proportion,'vipSeries','vipBar,'vipChartOptions')

          // 性别分析
          let genderKeys = Object.keys(data.gender_propotion);
          let genderValues = Object.values(data.gender_propotion);
          if (genderValues.length != 0) {
            Object.keys(genderValues[0]).map((name, index) => {
              let obj = {};
              obj.name = this.$t(index == 0 ? "female" : "male");
              obj.data = [];
              genderValues.map((lise) => {
                obj.data.push(lise[index]);
              });
              that.genderSeries.push(obj);
            });
          }

          this.genderChartOptions.xaxis.categories = genderKeys;
          that.$refs.genderBar &&
            that.$refs.genderBar.updateOptions({
              xaxis: { categories: that.genderChartOptions.xaxis.categories },
            });
          that.genderSeries.map((name) => {
            that.genderName.push(name.name + `(${this.$t('person')})`);
          });
          genderKeys.map(function(list, index) {
            let obj = {};
            obj.name = list;
            obj.percentList = [];
            that.genderSeries.map((val) => {
              obj.percentList.push(Number(val.data[index]).toLocaleString());
            });
            that.genderTableList.push(obj);
          });
          this.$nextTick(() => {
            this.iconIndex = -1;
            this.frequencyIconIndex = -1;
            this.vipIconIndex = -1;
            this.clientIconIndex = -1;
            this.genderIconIndex = -1;
            setTimeout(() => {
              this.iconIndex = 0;
              this.frequencyIconIndex = 0;
              this.vipIconIndex = 0;
              this.clientIconIndex = 0;
              this.genderIconIndex = 0;
            }, 100);
          });
        }
      });
    },
    uploadChartXaxis(type, data, series, ref, option) {
      let chartData;
      let that = this;
      switch (type) {
        case "age":
          chartData = this.dataAssemble(data, "age");
          break;
        case "number":
          chartData = this.dataAssemble(data, "number");
          break;
        case "client":
          chartData = this.clinetAssemble(data, "client");
          break;
        case "vip":
          chartData = this.clinetAssemble(data, "vip");
          break;
      }
      this[series] = chartData.series;
      this[option].xaxis.categories = chartData.xaxis;
      this.$refs[ref].updateOptions({
        xaxis: { categories: that[option].xaxis.categories },
      });
    },
    // 年龄分布 到店次数 数据处理
    dataAssemble(data, type) {
      let that = this;
      let dataNumber = {
        xaxis: Object.keys(data),
        series: [],
      };
      let ageValue = Object.values(data);
      let nameList = Object.keys(ageValue[0]);
      let names = ["Juvenile", "Youth", "midLife", "oldAge"];
      nameList.map((list, index) => {
        let obj = {};
        if (type == "number") {
          let xName;
          Number(list) == nameList.length
            ? (xName = this.$t('over5times'))
            : (xName = this.$t("fn.times", [this.$t(list)]));
          obj.name = xName;
        } else if (type === "age") {
          if (nameList.length <= 4) {
            obj.name = names[index];
          } else {
            obj.name = list
              .replace("_", "-")
              .replace("less-", this.$t('lessThan'))
              .replace(/more-/, this.$t('moreThan'));
          }
        } else {
          obj.name = list + `(${this.$t('person')})`;
        }
        obj.data = [];
        ageValue.map(function(val, vIndex) {
          _.forIn(val, function(value, key) {
            if (list == key) {
              let size;
              type == "age"
                ? (size = Number(value.female) + Number(value.male))
                : (size = value);
              obj.data.push(size);
            }
          });
        });
        dataNumber.series.push(obj);
      });
      dataNumber.series.map((name) => {
        let tableName = name.name + `(${this.$t('person')})`;
        type == "age"
          ? that.ageName.push(tableName)
          : that.frequencyName.push(tableName);
      });
      dataNumber.xaxis.map(function(list, index) {
        let obj = {};
        obj.name = list;
        obj.percentList = [];
        dataNumber.series.map((val) => {
          obj.percentList.push(Number(val.data[index]).toLocaleString());
        });
        type == "age"
          ? that.ageTableList.push(obj)
          : that.frequencyTableList.push(obj);
      });
      return dataNumber;
    },
    // 新老顾客 vip顾客占比 数据处理
    clinetAssemble(data, type) {
      let that = this;
      let dataNumber = {
        xaxis: Object.keys(data),
        series: [],
      };
      let clinetValue = Object.values(data);
      let nameList = Object.keys(clinetValue[0]);
      nameList.map((name) => {
        let obj = {};
        if (type == "client")
          obj.name = this.$t(name == "newNum" ? "newCustomer" : "reCustomer");
        else obj.name = name == "vipNum" ? "VIP顾客" : "普通顾客";
        obj.data = [];
        clinetValue.map((list) => {
          _.forIn(list, (value, key) => {
            if (name == key) obj.data.push(value);
          });
        });
        dataNumber.series.push(obj);
      });

      dataNumber.series.map((name) => {
        let tableName = name.name + `(${this.$t('person')})`;
        type == "client"
          ? that.clientName.push(tableName)
          : that.vipName.push(tableName);
      });
      dataNumber.xaxis.map(function(list, index) {
        let obj = {};
        obj.name = list;
        obj.percentList = [];
        dataNumber.series.map((val) => {
          obj.percentList.push(Number(val.data[index]).toLocaleString());
        });
        type == "client"
          ? that.clientTableList.push(obj)
          : that.vipTableList.push(obj);
      });
      return dataNumber;
    },
    // 图标点击
    iconClick(index, type) {
      switch (type) {
        case "vip":
          if (index == 2) this.downloadVipData();
          else this.vipIconIndex = index;
          break;
        case "client":
          if (index == 2) this.downloadCusData();
          else this.clientIconIndex = index;
          break;
        case "gender":
          if (index == 2) this.downloadGenData();
          else this.genderIconIndex = index;
          break;
        case "frequency":
          if (index == 2) this.downloadNumData();
          else this.frequencyIconIndex = index;
          break;
        case "age":
          if (index == 2) this.downloadAgeData();
          else this.iconIndex = index;
          break;
      }
    },
    // 数据初始化
    initializeData() {
      this.ageSeries = [];
      this.ageOptions.xaxis.categories = [];
      this.frequencySeries = [];
      this.frequencyOptions.xaxis.categories = [];
      this.clientSeries = [];
      this.clientOptions.xaxis.categories = [];
      this.genderSeries = [];
      this.genderChartOptions.xaxis.categories = [];
      this.vipSeries = [];
      this.vipChartOptions.xaxis.categories = [];

      this.iconIndex = 0;
      this.frequencyIconIndex = 0;
      this.vipIconIndex = 0;
      this.clientIconIndex = 0;
      this.genderIconIndex = 0;

      this.ageName = ["shopmall"];
      this.ageTableList = [];
      this.frequencyName = ["shopmall"];
      this.frequencyTableList = [];
      this.clientName = ["shopmall"];
      this.clientTableList = [];
      this.genderName = ["shopmall"];
      this.genderTableList = [];
      this.vipName = ["shopmall"];
      this.vipTableList = [];
    },
    downloadData(val1, val2) {
      let [columns, data] = [[], []];
      val1.forEach((list, index) => {
        if (index == 0) {
          columns.push({ title: list, key: "name" });
        } else {
          columns.push({ title: list, key: "type" + index });
        }
      });

      val2.forEach((list, index) => {
        let obj = {};
        obj.name = list.name;
        columns.forEach((val, vindex) => {
          if (vindex === 0) {
            obj[val.key] = list.name;
          } else {
            obj[val.key] = list.percentList[vindex - 1];
          }
        });
        data.push(obj);
      });
      return [columns, data];
    },
    downloadAgeData() {
      let tableData = this.downloadData(this.ageName, this.ageTableList);
      downloadEx(exportEx, this.$t("ageDistFlowData"), tableData);
    },
    downloadGenData() {
      let tableData = this.downloadData(this.genderName, this.genderTableList);
      downloadEx(exportEx, this.$t("genderDistFlowData"), tableData);
    },
    downloadCusData() {
      let tableData = this.downloadData(this.clientName, this.clientTableList);
      downloadEx(exportEx, this.$t("customerProData"), tableData);
    },
    downloadNumData() {
      let tableData = this.downloadData(
        this.frequencyName,
        this.frequencyTableList
      );
      downloadEx(exportEx, this.$t("customerVisitProData"), tableData);
    },
    downloadVipData() {},
  },
  deactivated() {}, // 离开页面使用时调用
};
</script>
<style lang="less" scoped>
@import "./groupAgeGender.less";
</style>
