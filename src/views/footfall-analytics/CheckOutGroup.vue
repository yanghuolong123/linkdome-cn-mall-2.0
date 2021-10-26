<template>
  <div>
    <cusPropertySelect
      polygon="true"
      @handleClick="handleClick"
    ></cusPropertySelect>
    <div class="mt-4 common-card">
      <h4 class="title mb-2">{{ $t("顾客结账信息统计") }}</h4>

      <Table stripe height="400" :columns="tableColumns" :data="tableData">
        <!-- <template slot-scope="{ row }" slot="entityType">
          <span>{{ getItype(row.entityName) }}</span>
        </template> -->
      </Table>
      <div class="paginations">
        <vs-pagination
          :total="cusTotal ? cusTotal : 1"
          v-model="params.page"
          goto
        ></vs-pagination>
      </div>
    </div>
    <BigImg @close="close" :info="info"></BigImg>
  </div>
</template>

<script>
import BigImg from "./components/BigImg.vue";
import { checkoutGroup } from "@/api/analysis";
import cusPropertySelect from "_c/flow-selector/property-flow-select.vue";
export default {
  name: "CusProperty",
  components: { cusPropertySelect, BigImg },
  data() {
    return {
      info: {},
      tableColumns: [
        { title: "收银柜台", key: "create_time" },
        { title: "开始时间", key: "is_male" },
        { title: "结束时间", key: "is_male" },
        { title: "花费时间", key: "is_together" },
        {
          title: "截图",
          key: "is_together",
          render: (h, params) => {
            return h("img", {
              style: { width: "9.375rem", height: "6.25rem" },
              attrs: {
                src: params.row.src,
                onclick: getImg(params.row),
              },
            });
          },
        },
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
    close() {},
    getImg(val) {
      this.info = val;
    },
    handleClick(val) {
      this.params = val;
      this.params.page = 1;
      this.getList();
    },
    getList() {
      checkoutGroup(this.params).then((res) => {
        console.log(res);
        let data = res.data.data;
        data.list.forEach((element) => {});
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
