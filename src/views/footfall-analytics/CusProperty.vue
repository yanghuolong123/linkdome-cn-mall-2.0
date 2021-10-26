<template>
  <div>
    <cusPropertySelect @handleClick="handleClick"></cusPropertySelect>
    <div class="mt-4 common-card">
      <h4 class="title mb-2">{{ $t("顾客属性详细信息统计") }}</h4>

      <Table stripe height="400" :columns="tableColumns" :data="tableData">
        <template slot-scope="row" slot="is_male">
          <span>{{ row.is_male ? "男" : "女" }}</span>
        </template>
        <template slot-scope="row" slot="is_together">
          <span>{{ row.is_together ? "结伴" : "独自" }}</span>
        </template>
        <template slot-scope="row" slot="is_together">
          <span>{{ row.is_together ? "结伴" : "独自" }}</span>
        </template>
      </Table>
      <div class="paginations">
        <vs-pagination
          :total="cusTotal ? cusTotal : 1"
          v-model="params.page"
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
  data() {
    return {
      tableColumns: [
        { title: "进入时间", key: "create_time" },
        { title: "性别", key: "is_male" },
        { title: "年龄区间", key: "age_range" },
        { title: "进店方式", key: "is_together" },
      ],
      tableData: [],
      currentx: 1,
      cusTotal: 1,
      params: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleClick(val) {
      this.params = val;
      this.params.page = 1;
      this.params.limit = 10;
      this.getList();
    },
    getList() {
      cusProperty(this.params).then((res) => {
        console.log(res);
        let data = res.data.data;
        data.list.forEach((item) => {
          item.range = item.age + "-" + age_max;
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
}
</style>
