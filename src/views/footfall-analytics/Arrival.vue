<template>
  <div>
    <flow-selector @paramsPrepare="paramsPrepare"></flow-selector>
    <!-- enter -->
    <div class="mt-6 age-chart-box">
      <div class="bg-white box-card pb-6">
        <chart-tabs
          :xAxis="personChartData.xAxis"
          :labels="personChartData.labels"
          :series="personChartData.series"
          :type="personChartData.type"
          title="新老顾客"
          :tooltipUnit="$t('人')"
          @tableChage="genderTableChange"
        >
          <export-menu
            slot="export"
            @onchange="genderExportBiztop"
          ></export-menu>
        </chart-tabs>
      </div>
      <div class="bg-white box-card pb-6">
        <chart-tabs
          :xAxis="arrivalChartData.xAxis"
          :labels="arrivalChartData.labels"
          :series="arrivalChartData.series"
          :type="arrivalChartData.type"
          title="到店次数"
          :tooltipUnit="$t('人')"
          @tableChage="ageTableChange"
        >
          <export-menu slot="export" @onchange="ageExportBiztop"></export-menu>
        </chart-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { exportEx } from "@/api/home.js";
import { downloadEx } from "@/libs/util";
import { getEntityFlowBatch } from "@/api/analysis";
import exportMenu from "@/views/operation/components/ExportMenu.vue";
import chartTabs from "@/components/common/CopyChartsTabs.vue";
import FlowSelector from "_c/flow-selector/age-gender-flow-selector";
export default {
  name: "ageGender",
  components: {
    FlowSelector,
    chartTabs,
    exportMenu,
  },
  data() {
    return {
      chartData: { arrivalChartData: {}, personChartData: {} },
    };
  },
  computed: {
    arrivalChartData() {
      return this.chartData.arrivalChartData;
    },
    personChartData() {
      return this.chartData.personChartData;
    },
  },
  methods: {
    async paramsPrepare(pparams) {
      this.entitys = pparams.entitys;
      this.bzids = this.entitys.map((i) => i.id);
      this.range = pparams.date1Array.toString();
      let res;
      if (["time", "onYear", "onChain"].includes(pparams.compareType)) {
        // 时间对比
        this.range2 = pparams.date2Array.toString();
        res = await getEntityFlowBatch({
          range1: this.range,
          range2: this.range2,
          bzid: this.bzids.toString(),
        });
      } else {
        res = await getEntityFlowBatch({
          range1: this.range,
          bzid: this.bzids.toString(),
        });
      }
      this.chartData = this.handleTypeData(res);
      console.log(this.chartData);
    },
    handleTypeData(res) {
      const {
        data: { data },
      } = res;
      let singleTime = Object.keys(data[0].stat).length === 1; // 时间对比，选择相同的时间，后台返回一个
      let arrivalCollection = [];
      let personCollection = [];
      let arrivalLabels;
      let personLabels;
      let ageXaxis = [];
      let arrivalSeries;
      let personSeries;
      let genderChartData;
      data.forEach((e) => {
        Object.keys(e.stat).forEach((i) => {
          let eleOfTimes = e.stat[i];
          arrivalCollection.push({
            id: e.bzid,
            time: i,
            name: "arrival_distribution",
            data: eleOfTimes.arrival_distribution
              ? eleOfTimes.arrival_distribution
              : [],
          });
          personCollection.push({
            id: e.bzid,
            time: i,
            name: "new_old_proportion",
            data: eleOfTimes.new_old_proportion
              ? eleOfTimes.new_old_proportion
              : [],
          });
        });
      });
      console.log(arrivalCollection);
      console.log(personCollection);
      arrivalLabels = {
        name: this.$t("到店次数"),
        key: "arrival",
        data: Object.keys(arrivalCollection[0].data).map((e, i) => {
          return e == Object.keys(arrivalCollection[0].data).length - 1
            ? e + "次以上"
            : "第" + e + "次";
        }),
      };
      personLabels = {
        name: this.$t("新老顾客"),
        key: "arrival",
        data: Object.keys(personCollection[0].data),
      };
      arrivalSeries = Object.values(arrivalCollection[0].data);
      personSeries = Object.values(personCollection[0].data);
      console.log(personSeries);
      return {
        arrivalChartData: {
          type: ["pie"],
          series: arrivalSeries,
          labels: arrivalLabels,
          xAxis: {},
        },
        personChartData: {
          type: ["donut"],
          series: arrivalSeries,
          labels: personLabels,
          xAxis: {},
        },
      };
    },
    ageTableChange(value) {
      this.ageTableList = value.data;
    },
    ageExportBiztop() {
      this.uploadList(this.ageTableList);
    },
    genderTableChange(value) {
      this.genderTableList = value.data;
    },
    genderExportBiztop() {
      this.uploadList(this.genderTableList);
    },
    uploadList(value) {
      downloadEx(exportEx, "年龄性别客流数据", value);
    },
  },
  activated() {},
};
</script>
<style lang="stylus">
.age-chart-box
  display grid
  grid-template-columns repeat(2, minmax(10px, 1fr))
  grid-template-areas 'age gender'
  grid-gap 20px
  // @media (max-width: 768px)
  //   grid-template-columns minmax(10px, 1fr)
  //   grid-template-areas 'age' 'gender'
  // grid-gap 20px
  >div
    &:nth-child(1)
      grid-area age
      margin-right 20px
    &:nth-child(2) /deep/
      grid-area gender
      .custom-legend-box
        padding 0 60px
</style>
