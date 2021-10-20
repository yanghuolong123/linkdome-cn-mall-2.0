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
          :extraOptions="arrivalChartData.extraOptions"
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
import labels from "../home/seriesDict";
import { time } from "highcharts";
export default {
  name: "Arrival",
  components: {
    FlowSelector,
    chartTabs,
    exportMenu,
  },
  data() {
    return {
      chartData: { arrivalChartData: {}, personChartData: {} },
      entitys: {},
      arrivalLabels: [],
      personLabels: [],
    };
  },
  computed: {
    arrivalChartData() {
      return this.chartData.arrivalChartData;
    },
    personChartData() {
      return this.chartData.personChartData;
    },
    chartWidth() {
      let width;
      if (this.chartData.arrivalChartData.xAxis) {
        let xSize = this.chartData.arrivalChartData.xAxis.data.length;
        xSize < 10 ? (width = "100%") : (width = xSize * 60);
      } else width = "100%";
      console.log(width);
      return width;
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
      let arrivalSeries = [];
      let personSeries = [];
      let arrivalX;
      let personX;
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
      if (data.length === 1 && singleTime) {
        this.arrivalLabels = {
          name: this.$t("到店次数"),
          key: "arrival",
          data: Object.keys(arrivalCollection[0].data).map((e, i) => {
            return labels[e].name;
          }),
          icons: Object.keys(arrivalCollection[0].data).map((e, i) => {
            return labels[e].icon;
          }),
        };
        this.personLabels = {
          name: this.$t("新老顾客"),
          key: "arrival",
          data: Object.keys(personCollection[0].data).map((e, i) => {
            return labels[e].name;
          }),
          icons: Object.keys(personCollection[0].data).map((e, i) => {
            return labels[e].icon;
          }),
        };
        arrivalSeries = Object.values(arrivalCollection[0].data);
        personSeries = Object.values(personCollection[0].data);
        return {
          arrivalChartData: {
            type: ["pie"],
            series: arrivalSeries,
            labels: this.arrivalLabels,
          },
          personChartData: {
            type: ["donut"],
            series: personSeries,
            labels: this.personLabels,
          },
        };
      } else {
        delete this.arrivalLabels.icons;
        delete this.personLabels.icons;
        if (data.length == 1) {
          arrivalX = {
            name: this.$t("时间"),
            key: "time",
            data: JSON.parse(JSON.stringify(this.getArrivalx(data, ["time"]))),
          };
          personX = {
            name: this.$t("时间"),
            key: "time",
            data: JSON.parse(JSON.stringify(this.getPersonX(data, ["time"]))),
          };
          this.personLabels.data.forEach((item, i) => {
            personSeries.push({
              key: i,
              name: item,
              data:
                Object.values(data[0].stat).map((person) => {
                  let num = i == 0 ? "newNum" : "oldNum";
                  return person.new_old_proportion[num];
                }) || [],
            });
          });
          this.arrivalLabels.data.forEach((item, i) => {
            arrivalSeries.push({
              key: i,
              name: item,
              data:
                Object.values(data[0].stat).map((arrival) => {
                  return arrival.arrival_distribution[i + 1];
                }) || [],
            });
          });
        } else {
          let arrA = [];
          data.forEach((item) => {
            arrA = arrA.concat(Object.values(item.stat));
          });
          this.personLabels.data.forEach((item, i) => {
            personSeries.push({
              key: i,
              name: item,
              data:
                arrA.map((person) => {
                  let num = i == 0 ? "newNum" : "oldNum";
                  return person.new_old_proportion[num];
                }) || [],
            });
          });
          let arrP = [];
          data.forEach((item) => {
            arrP = arrP.concat(Object.values(item.stat));
          });
          this.arrivalLabels.data.forEach((item, i) => {
            arrivalSeries.push({
              key: i,
              name: item,
              data:
                Object.values(arrP).map((arrival) => {
                  return arrival.arrival_distribution[i + 1];
                }) || [],
            });
          });
          if (singleTime) {
            arrivalX = {
              name: this.$t("名称"),
              key: "time",
              data: JSON.parse(JSON.stringify(this.getArrivalx(data, ["id"]))),
            };
            personX = {
              name: this.$t("名称"),
              key: "time",
              data: JSON.parse(JSON.stringify(this.getPersonX(data, ["id"]))),
            };
          } else {
            arrivalX = {
              name: this.$t("类别"),
              key: "type",
              data: JSON.parse(
                JSON.stringify(this.getArrivalx(data, ["time", "id"]))
              ),
            };
            personX = {
              name: this.$t("类别"),
              key: "type",
              data: JSON.parse(
                JSON.stringify(this.getPersonX(data, ["time", "id"]))
              ),
            };
          }
        }
        return {
          arrivalChartData: {
            type: ["bar"],
            series: arrivalSeries,
            xAxis: arrivalX,
            extraOptions: {
              chart: {
                stacked: true,
              },
              plotOptions: {
                bar: {
                  endingShape: "flat",
                },
              },
              legend: {
                show: true,
              },
            },
          },
          personChartData: {
            type: ["bar"],
            series: personSeries,
            xAxis: personX,
          },
        };
      }
    },

    getArrivalx(data, type) {
      let arrivalXA = [];
      data.forEach((e) => {
        let arrivalNames = [];
        if (type) {
          type.forEach((cate) => {
            if (cate === "id")
              arrivalNames.push(
                `${
                  this.entitys.find((o) => Number(o.id) === Number(e.bzid))
                    .label
                }`
              );
            if (cate === "time")
              arrivalNames.push(
                Object.keys(e.stat).map((val) => val.split(",").join(" - "))
              );
          });
        }
        let nameA = arrivalNames.length ? arrivalNames.join(" ") : "";

        if (type.length == 2) {
          arrivalXA = arrivalXA.concat([
            arrivalNames[0][0] + arrivalNames[1],
            arrivalNames[0][1] + arrivalNames[1],
          ]);
        } else {
          arrivalXA.push(nameA);
        }
      });
      return arrivalXA;
    },
    getPersonX(data, type) {
      let personXA = [];
      data.forEach((e) => {
        let personNames = [];
        if (type) {
          type.forEach((cate) => {
            if (cate === "id")
              personNames.push(
                `${
                  this.entitys.find((o) => Number(o.id) === Number(e.bzid))
                    .label
                }`
              );
            if (cate === "time")
              personNames.push(
                Object.keys(e.stat).map((val) => val.split(",").join(" - "))
              );
          });
        }
        let nameP = personNames.length ? personNames.join(" ") : "";

        if (type.length == 2) {
          personXA = personXA.concat([
            personNames[0][0] + personNames[1],
            personNames[0][1] + personNames[1],
          ]);
        } else {
          personXA.push(nameP);
        }
      });
      console.log(personXA);
      return personXA;
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
      downloadEx(exportEx, "新老顾客到店次数统计数据", value);
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
