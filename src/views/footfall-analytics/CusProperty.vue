<template>
  <div>
    <cusPropertySelect @handleClick="handleClick"></cusPropertySelect>
    <div class="mt-4 common-card">
      <h4 class="title mb-2">{{ $t("顾客属性详细信息统计") }}</h4>
      <Table
        class="mt-4"
        stripe
        height="470"
        :columns="tableColumns"
        :data="tableData"
      ></Table>
      <div class="paginations">
        <vs-pagination
          :total="cusTotal ? cusTotal : 1"
          v-model="currentP"
          goto
        ></vs-pagination>
      </div>
    </div>
  </div>
</template>

<script>
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
            return h("span", params.row.is_together ? "结伴" : "独自");
          },
        },
      ],
      tableData: [],
      cusTotal: 1,
      params: { limit: 10 },
      currentP: 1,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleClick(val) {
      this.params = val;
      this.params.page = 1;
      this.currentP = 1
      this.getList();
    },
    getList() {
      cusProperty(this.params).then((res) => {
        let data = res.data.data;
        data.list.forEach((item) => {
          item.range = item.age + "-" + item.age_max;
        });
        this.cusTotal = Math.ceil(data.count / 10);
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
}
</style>
