<template>
  <div>
    <cusPropertySelect
      polygon="true"
      @handleClick="handleClick"
    ></cusPropertySelect>
    <div class="mt-4 common-card">
      <h4 class="title mb-2">{{ $t("顾客结账信息统计") }}</h4>
      <Table
        class="mt-4"
        stripe
        height="510"
        :columns="tableColumns"
        :data="tableData"
      ></Table>
      <div class="paginations">
        <!-- <vs-pagination
          :total="checkTotal ? checkTotal : 1"
          v-model="currentP"
          goto
        ></vs-pagination> -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-sizes="[25, 50, 100, 200, 500]"
          :page-size="params.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="checkTotal"
        >
        </el-pagination>
      </div>
    </div>
    <BigImg
      :info="info"
      :index="index + '-' + +new Date()"
      :keyName="keyName"
    ></BigImg>
  </div>
</template>

<script>
import Moment from "moment";

import { addZero } from "@/libs/util";
import _ from "lodash";
import BigImg from "./components/GetBigImg.vue";
import { checkoutGroup } from "@/api/analysis";
import cusPropertySelect from "_c/flow-selector/property-flow-select.vue";
export default {
  name: "CusProperty",
  components: { cusPropertySelect, BigImg },
  watch: {
    currentP() {
      this.params.page = this.currentP;
      this.getList();
    },
  },
  data() {
    return {
      keyName: {
        title: "Cashier",
        time1: "start_time",
        time2: "end_time",
        image_path: "image_path",
      },
      index: 0,
      currentP: 1,
      tableColumns: [
        { title: "收银柜台", key: "Cashier" },
        { title: "开始时间", key: "start_time" },
        { title: "结束时间", key: "end_time" },
        {
          title: "花费时间",
          key: "checkout_time",
          render: (h, params) => {
            return h("span", this.getTime(params.row.checkout_time));
          },
        },
        {
          title: "截图",
          key: "image_path",
          render: (h, params) => {
            console.log(params);
            return h("img", {
              style: {
                width: "7.75rem",
                height: "4.375rem",
                marginTop: ".3125rem",
              },
              attrs: {
                src: params.row.image_path,
              },
              on: {
                click: () => {
                  this.getImg(_.cloneDeep(params.row), params.index);
                },
              },
            });
          },
        },
      ],
      tableData: [],
      checkTotal: 1,
      params: {
        limit: 25,
        time1: Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
        time2: Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
      },
      info: {},
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
    // 秒钟时间转换
    getTime(time) {
      let h = addZero(parseInt(time / 3600));
      let m = addZero(parseInt(time / 60));
      let s = addZero(parseInt(time % 60));
      return h + ":" + m + ":" + s;
    },
    // 查看大图
    getImg(val, i) {
      this.info = _.cloneDeep(this.tableData);
      this.index = i;
    },
    // 查询
    handleClick(val) {
      this.params = Object.assign(this.params, val);
      this.params.page = 1;
      this.currentP = 1;
      this.getList();
    },
    // 请求
    getList() {
      checkoutGroup(this.params).then((res) => {
        let data = res.data.data;
        this.checkTotal = data.count;
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
