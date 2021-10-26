<template>
  <div>
    <!-- <div class="flex-center common-card">
      <i-date-picker
        class="w-select"
        v-model="time"
        :dType="1"
        @selectDate="dateSelect"
      ></i-date-picker>
      <Button size="large" type="primary" class="m-l-20" @click="handleClick">{{
        $t("查询")
      }}</Button>
      <Button size="large" @click="resetClick" class="m-l-20">{{
        $t("重置")
      }}</Button>
    </div> -->
    <attributeFlowSelect></attributeFlowSelect>
    <Table
      stripe
      height="400"
      :columns="columns"
      :span-method="objectSpanMethod"
      :data="arr"
    >
      <!-- <template slot-scope="{ row }" slot="entityType">
        <span>{{ getItype(row.entityName) }}</span>
      </template> -->
    </Table>
  </div>
</template>

<script>
import iDatePicker from "@/components/common/idatepicker.vue";
import attributeFlowSelect from "@/components/flow-selector/attribute-flow-select";
import ChartBox from "_c/common/Chart-box";
import config from "@/config/index";
import { LineChartConstructor } from "@/libs/echart-constructor/line.class.js";
import { BarChartConstructor } from "@/libs/echart-constructor/bar.class.js";
import { ParamsConstructor } from "@/libs/params-constructor/params.class.js";

import { entityFlow } from "@/api/entityNew";
import moment from "moment";

export default {
  name: "Group",
  data() {
    return {
      time: [
        moment()
          .add(-6, "days")
          .format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD"),
      ],
      oParams: {},
      responseData: [],
      enterChart: {
        barChart: null,
        lineChart: null,
      },
      enterSelect: "",
      isHour: false,
      enterFlowList: [],
      toolList: config.toolList,
      columns: [{ key: "n", title: "实体名称" }, { key: "g", title: "时间" }],
      arr: [
        { n: 1, g: "00", l: 2 },
        { n: 1, g: "100", l: 2 },
        { n: 1, g: "010", l: 2 },
        { n: 2, g: "001", l: 2 },
        { n: 2, g: "0051", l: 2 },
        { n: 2, g: "0051", l: 2 },
        { n: 2, g: "0051", l: 2 },
      ],
    };
  },
  components: {
    iDatePicker,
    ChartBox,
    attributeFlowSelect,
  },
  created() {
    this.enterFlowList = config.dictionary.filter((o) => {
      return ["enter", "exit"].includes(o.value);
    });
    this.getTableData();
    console.log(this.$store.state.home.headerAction);
  },
  methods: {
    dateSelect(val) {
      this.time = val;
    },
    // 表格合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: row.num ? row.num : 1,
          colspan: 1,
        };
      }
    },
    getTableData() {
      this.arr = this.arr.reverse();
      for (let i = 0; i < this.arr.length; i++) {
        let item = this.arr[i];
        let count = 0;
        let iName = item.n;
        console.log(iName);
        for (let j = 0; j < this.arr.length; j++) {
          if (item.n == this.arr[j].n) {
            count++;
            this.arr[j].num = 0;
          }
        }
        item["n"] = iName;
        item.num = count;
      }
      this.arr = this.arr.reverse();
      console.log(this.arr);
    },
    // get数据
    getData() {
      let p = {
        bussinessType: [],
        compareType: "",
        date1Array: this.time,
        date2Array: [],
        enterType: "",
        // entitys: [],
        selectList: [],
      };
      this.oParams = new ParamsConstructor(p, this.isHour);
      let reqList = [];
      let responseList = []; //用于对应api返回的是哪种类型的数据（出客流，入客流，集客量）
      //默认查询出客流和入客流数据
      this.enterFlowList.forEach((o) => {
        responseList.push(o.value);
        const data = {
          type: o.value,
          range: "Hour",
          time1: this.time.join(","),
          bzid: this.$store.state.home.headerAction,
        };
        reqList.push(entityFlow(data));
      });

      Promise.all(reqList)
        .then((res) => {
          responseList.forEach((o, i) => {
            this.responseData[o] = res[i].data.data;
          });
          this.updateChart("chartEnter");
        })
        .catch((err) => {
          this.$Message.error("数据获取失败");
          console.log(err);
        });
      console.log(this.responseData);
    },
    // 查询
    handleClick() {
      this.getData();
    },
    // 重置
    resetClick() {
      this.time = [
        moment()
          .add(-6, "days")
          .format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD"),
      ];
      this.getData();
    },
    // swich切换
    compareTypeChange() {
      this.handleClick();
    },
    // 选择数据指标
    enterSelectChange() {
      console.log(this.enterSelect);
    },
    // 点击切换图表
    handletoolClick(chartName, componentName, quta = this.enterSelect) {
      switch (chartName) {
        case "line":
        case "table":
          this.$nextTick(() => {
            this.updateLineChart(componentName, quta);
          });
          break;
        case "bar":
          this.$nextTick(() => {
            this.updateBarChart(componentName, quta);
          });
          break;
      }
    },
    updateChart(componentName, quta = this.enterSelect) {
      if (componentName === "chartEnter" && this.enterSelect.length > 1) {
        this.updateBarChart(componentName, quta);
      } else {
        this.$nextTick(() => {
          //等子组件渲染完成，数据更新
          switch (this.$refs[componentName].currentChart) {
            case "line":
            case "table":
              this.updateLineChart(componentName, quta);
              break;
            case "bar":
              this.updateBarChart(componentName, quta);
              break;
          }
        });
      }
    },
    updateLineChart(componentName, quta = this.enterSelect) {
      const lineOpiton = this.getLineOption(quta);
      this.$refs[componentName].initLineChart(lineOpiton);
    },
    updateBarChart(componentName, quta = this.enterSelect) {
      const data = _.cloneDeep(this.responseData);
      let BarChart = new BarChartConstructor(data, this.oParams, quta);
      let barOpiton = BarChart.getPostEntitysCompare();
      this.$refs[componentName].initBarChart(barOpiton);
    },
    getLineOption(quta = this.enterSelect) {
      const data = _.cloneDeep(this.responseData);
      let LineChart = new LineChartConstructor(data, this.oParams, quta);
      let lineOpiton = LineChart.getPostEntitysCompare();
      return lineOpiton;
    },
  },
};
</script>
<style lang="scss" scoped>
.i-date-picker {
  width: 300px;
}
.chart-1 {
  height: 540px;

  .quota {
    font-size: 14px;
    margin-right: 50px;
    word-break: keep-all;
    white-space: nowrap;
    .quota-label {
      margin-right: 20px;
    }
    .switch {
      width: 145px;
      margin-left: 20px;
      &.ivu-switch-large.ivu-switch-checked:after {
        left: 50px;
      }
    }
  }
}
</style>
