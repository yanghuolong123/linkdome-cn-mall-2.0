<template>
  <div>
    <flow-selector @paramsPrepare="paramsPrepare"></flow-selector>
    <!-- enter -->
    <div class="mt-6 age-chart-box">
      <div class="bg-white box-card pb-6">
        <chart-tabs
          :xAxis="agechartData.xAxis"
          :labels="agechartData.labels"
          :series="agechartData.series"
          :type="agechartData.type"
          :chartWidth="ageChartWidth"
          title="年龄分布"
          :tooltipUnit="$t('人')"
          @tableChage="ageTableChange"
        >
          <export-menu slot="export" @onchange="ageExportBiztop"></export-menu>
        </chart-tabs>
      </div>
      <div class="bg-white box-card pb-6">
        <chart-tabs
          :xAxis="genderChartData.xAxis"
          :labels="genderChartData.labels"
          :series="genderChartData.series"
          :type="genderChartData.type"
          :chartWidth="ageChartWidth"
          title="性别分布"
          :tooltipUnit="$t('人')"
          @tableChage="genderTableChange"
        >
          <export-menu
            slot="export"
            @onchange="genderExportBiztop"
          ></export-menu>
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
      typeOfCustom: "0",
      range: "",
      range2: "",
      canshow: false,
      genderName: {
        "1": {
          name: this.$t("男性"),
          icon: "male",
        },
        "0": {
          name: this.$t("女性"),
          icon: "female",
        },
      },
      genderDict: {
        female: this.$t("女性"),
        male: this.$t("男性"),
      },
      chartData: { age: {}, gender: {} },
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
      ageTableList: [],
      genderTableList: [],
    };
  },
  computed: {
    agechartData() {
      return this.chartData.age;
    },
    genderChartData() {
      return this.chartData.gender;
    },
    ageChartWidth() {
      let width;
      if (this.chartData.age.xAxis) {
        let xSize = this.chartData.age.xAxis.data.length;
        xSize < 14 ? (width = "100%") : (width = xSize * 60);
      } else width = "100%";
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
        let params = {
          range1: this.range,
        }
        if(pparams.compareType === 'businessType'){
          params.industry_id = this.bzids.toString()
        }else {
          params.bzid = this.bzids.toString()
        }
        res = await getEntityFlowBatch(params);
      }
      this.chartData = this.handleTypeData(res,pparams.compareType);
    },
    handleTypeData(res,compareType) {
      const {
        data: { data },
      } = res;
      let singleTime = Object.keys(data[0].stat).length === 1; // 时间对比，选择相同的时间，后台返回一个
      let ageCollection = [];
      let genderCollection = [];
      let ageLabels;
      let ageXaxis = [];
      let ageSeries;
      let genderChartData;
      const typeKey = compareType === 'businessType'?'industry_id':"bzid"
      data.forEach((e) => {
        Object.keys(e.stat).forEach((i) => {
          let eleOfTimes = e.stat[i];
          ageCollection.push({
            id: e[typeKey],
            time: i,
            name: "age_distribution",
            data: eleOfTimes.age_distribution
              ? eleOfTimes.age_distribution
              : [],
          });
          genderCollection.push({
            id: e[typeKey],
            time: i,
            name: "gender_propotion",
            data: eleOfTimes.gender_propotion
              ? eleOfTimes.gender_propotion
              : [],
          });
        });
      });
      if (ageCollection[0].data) {
        let flag = Object.values(ageCollection[0].data).length <= 4;
        ageLabels = {
          name: this.$t("年龄"),
          key: "age",
          data: flag
            ? ["少年", "青年", "中年", "老年"]
            : Object.keys(ageCollection[0].data).map((e) => {
                return e
                  .replace("_", "-")
                  .replace("less-", this.$t("小于"))
                  .replace(/more-/, this.$t("大于"));
              }),
        };
      }

      if (singleTime) {
        // 多个实体单个时间，柱状图，xAxis,分类为实体
        const { labels, ...rest } = this.getGenderChartData(genderCollection, [
          "id",
        ]);
        genderChartData = {
          xAxis: {
            name: this.$t("实体"),
            key: "id",
            data: labels,
          },
          ...rest,
        };
        ageXaxis = {
          name: this.$t("实体"),
          key: "id",
          data: this.getAgeXaxis(ageCollection, ["id"]), // `${this.entitys.find(o => Number(o.id) === Number(e.id)).label}`
        };
        ageSeries = this.getAgeSeries(ageCollection);
      } else {
        // 多个实体多个时间，柱状图，xAxis,分类为实体+时间
        const { labels, ...rest } = this.getGenderChartData(genderCollection, [
          "id",
          "time",
        ]);
        genderChartData = {
          xAxis: {
            name: this.$t("名称"),
            key: "name",
            data: labels,
          },
          ...rest,
        };
        ageXaxis = {
          name: this.$t("类别"),
          key: "id_key",
          data: this.getAgeXaxis(ageCollection, ["id", "time"]),
        };
        ageSeries = this.getAgeSeries(ageCollection);
      }
      if (data.length === 1) {
        if (singleTime) {
          // 单个实体单个时间，饼图，labels,series,年龄为radiabar
          genderChartData = {
            labels: {
              name: this.$t("性别"),
              key: "gender",
              data: Object.keys(genderCollection[0].data).map(
                (e) => this.genderName[e].name
              ),
              icons: Object.keys(genderCollection[0].data).map(
                (e) => this.genderName[e].icon
              ),
            },
            series: Object.values(genderCollection[0].data),
            type: ["radialBar"],
          };
          ageSeries = Object.keys(this.genderDict).map((g) => ({
            name: this.genderDict[g],
            key: g,
            data: Object.values(ageCollection[0].data).map((e) => e[g]),
          }));
        } else {
          // 单个实体多个时间,柱状图，xAxis,series,横轴分类为时间
          const { labels, ...rest } = this.getGenderChartData(
            genderCollection,
            ["time"]
          );
          genderChartData = {
            xAxis: {
              name: this.$t("时间"),
              key: "time",
              data: labels,
            },
            ...rest,
          };
          ageXaxis = {
            name: this.$t("时间"),
            key: "time",
            data: this.getAgeXaxis(ageCollection, ["time"]),
          };
          ageSeries = this.getAgeSeries(ageCollection);
        }
      } else {
        if (singleTime) {
          // 多个实体单个时间，柱状图，xAxis,分类为实体
          const { labels, ...rest } = this.getGenderChartData(
            genderCollection,
            ["id"]
          );
          genderChartData = {
            xAxis: {
              name: this.$t("实体"),
              key: "id",
              data: labels,
            },
            ...rest,
          };
          ageXaxis = {
            name: this.$t("实体"),
            key: "id",
            data: this.getAgeXaxis(ageCollection, ["id"]), // `${this.entitys.find(o => Number(o.id) === Number(e.id)).label}`
          };
          ageSeries = this.getAgeSeries(ageCollection);
        } else {
          // 多个实体多个时间，柱状图，xAxis,分类为实体+时间
          const { labels, ...rest } = this.getGenderChartData(
            genderCollection,
            ["id", "time"]
          );
          genderChartData = {
            xAxis: {
              name: this.$t("名称"),
              key: "name",
              data: labels,
            },
            ...rest,
          };
          ageXaxis = {
            name: this.$t("类别"),
            key: "id_key",
            data: this.getAgeXaxis(ageCollection, ["id", "time"]),
          };
          ageSeries = this.getAgeSeries(ageCollection);
        }
      }
      if (data.length === 1 && singleTime) {
        return {
          age: {
            labels: ageLabels,
            series: ageSeries,
            type: ["bar"],
          },
          gender: genderChartData,
        };
      } else {
        return {
          age: {
            xAxis: ageXaxis,
            series: ageSeries,
            type: ["bar"],
            extraOptions: this.extraOptions,
          },
          gender: genderChartData,
        };
      }
    },

    getAgeXaxis(data, categoriesKeys) {
      let res = [];
      data.forEach((e) => {
        Object.keys(this.genderDict).forEach((k) => {
          let names = [];
          if (categoriesKeys) {
            categoriesKeys.forEach((cate) => {
              if (cate === "id")
                names.push(
                  `${
                    this.entitys.find((o) => Number(o.id) === Number(e.id))
                      .label
                  }`
                );
              if (cate === "time") names.push(e[cate].split(",").join(" - "));
            });
          }
          let name = names.length
            ? `${names.join(" ")} ${this.genderDict[k]}`
            : `${this.genderDict[k]}`;
          res.push(name);
        });
      });
      return res;
    },
    getAgeSeries(data) {
      let res = [];
      let newData = null;
      data.forEach((list) => {
        if (list.data.length !== 0) {
          newData = list.data;
          return false;
        }
      });
      if (!newData) return res;
      Object.keys(newData).forEach((e) => {
        let tml = {};
        let eachSeriesData = [];
        tml.name = e;
        tml.key = e;
        data.forEach((c) => {
          Object.keys(this.genderDict).forEach((gender) => {
            if (c.data[e]) {
              eachSeriesData.push(c.data[e][gender]);
            } else {
              eachSeriesData.push(0);
            }
          });
        });
        tml.data = eachSeriesData;
        res.push(tml);
      });
      res.map((list) => {
        list.name = list.name
          .replace("_", "-")
          .replace("less-", this.$t("小于"))
          .replace(/more-/, this.$t("大于"));
      });
      return res;
    },
    getGenderChartData(data, keys) {
      let labels = [];
      let series = [];
      let newData = null;
      data.forEach((e) => {
        let categories = [];
        keys.forEach((k) => {
          if (k === "id")
            categories.push(
              `${this.entitys.find((o) => Number(o.id) === Number(e.id)).label}`
            );
          if (k === "time") categories.push(e[k].split(",").join(" - "));
        });
        labels.push(categories.join(" "));
      });
      data.forEach((list) => {
        if (list.length !== 0) {
          newData = list.data;
          return false;
        }
      });
      if (!newData) {
        series = [];
        return false;
      }
      series = Object.keys(newData).map((e) => {
        let tml = {
          name: this.genderName[e].name,
          key: e,
          data: labels.map((label, index) => {
            return data[index].data[e] || 0;
          }),
        };
        return tml;
      });

      let genderOpt = {
        chart: {
          stacked: keys.length !== 1,
        },
        plotOptions: {
          bar: {
            endingShape: keys.length !== 1 ? "flat" : "rounded",
          },
        },
        legend: {
          show: true,
        },
      };
      return { labels, series, type: ["bar"], extraOptions: genderOpt };
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
    &:nth-child(2) ::v-deep
      grid-area gender
      .custom-legend-box
        padding 0 60px
</style>
