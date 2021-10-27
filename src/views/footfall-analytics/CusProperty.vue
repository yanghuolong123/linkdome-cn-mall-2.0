<template>
  <div>
    <cusPropertySelect @handleClick="handleClick"></cusPropertySelect>
    <div class="mt-4 common-card">
      <h4 class="title mb-2">{{ $t("顾客属性详细信息统计") }}</h4>
      <Table
        class="mt-4"
        stripe
        height="510"
        :columns="tableColumns"
        :data="tableData"
      ></Table>
      <div class="paginations">
        <!-- <vs-pagination
          :total="cusTotal ? cusTotal : 1"
          v-model="currentP"
          goto
        ></vs-pagination> -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-sizes="[20, 50, 100, 200,500]"
          :page-size="params.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="cusTotal"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from "moment";

import { cusProperty } from "@/api/analysis";
import cusPropertySelect from "_c/flow-selector/property-flow-select.vue";
export default {
  name: "CusProperty",
  components: { cusPropertySelect },
  watch: {
    currentP() {
      this.params.page = this.currentP;
      this.getList();
    },
  },
  data() {
    return {
      tableColumns: [
        { title: "进入时间", key: "create_time" },
        {
          title: "性别",
          key: "is_male",
          render(h, params) {
            return h("span", params.row.is_male ? "男" : "女");
          },
        },
        { title: "年龄区间", key: "range" },
        {
          title: "进店方式",
          key: "is_together",
          render(h, params) {
            return h("span", params.row.is_together ? "结伴" : "独行");
          },
        },
      ],
      tableData: [],
      cusTotal: 1,
      params: {
        limit: 20,
        time1: Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
        time2: Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
      },
      currentP: 1,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSizeChange(val) {
      this.params.limit = val;
      this.params.page = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    // 点击查询
    handleClick(val) {
      this.params = val;
      this.params.page = 1;
      this.currentP = 1;
      this.getList();
    },
    getList() {
      cusProperty(this.params).then((res) => {
        let data = res.data.data;
        data.list.forEach((item) => {
          item.range = item.age + "-" + item.age_max;
        });
        this.cusTotal = data.count;
        this.tableData = data.list;
      });
    },
  },
};
</script>

<style scoped lang="less">
.paginations {
  position: relative;
  bottom: 6px;
  margin-top: 20px;
  .el-pagination {
    text-align: center;
  }
}
</style>
