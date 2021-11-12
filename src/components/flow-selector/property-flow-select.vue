<template>
  <div class="selector-container common-card">
    <div class="flex-center">
      <i-date-picker
        class="w-select"
        @selectDate="dateSelect"
        :value="time"
      ></i-date-picker>
      <Select
        v-show="!polygon"
        placeholder="顾客性别"
        v-model="queryParams.is_male"
        class="w-select m-l-20"
      >
        <Option :value="0">女</Option>
        <Option :value="1">男</Option>
      </Select>
      <Select
        v-show="!polygon"
        placeholder="年龄区间"
        v-model="age"
        class="w-select m-l-20"
        @on-change="ageChange"
      >
        <Option v-for="item in ageList" :value="item.value" :key="item.value">{{
          item.lable
        }}</Option>
      </Select>
      <Select
        placeholder="到店方式"
        v-model="queryParams.is_together"
        class="w-select m-l-20"
        v-show="!polygon"
      >
        <Option v-for="item in wayList" :value="item.value" :key="item.value">{{
          item.lable
        }}</Option>
      </Select>
      <Select
        placeholder="收银柜台"
        v-model="queryParams.polygon_id"
        class="w-select m-l-20"
        v-show="polygon"
      >
        <Option v-for="item in polygonList" :value="item.id" :key="item.id">{{
          item.name
        }}</Option>
      </Select>
      <Button size="large" type="primary" class="m-l-20" @click="handleClick">{{
        $t("查询")
      }}</Button>
      <Button size="large" @click="resetClick" class="m-l-20">{{
        $t("重置")
      }}</Button>
    </div>
  </div>
</template>
<script>
import iDatePicker from "_c/common/idatepicker.vue";
import Moment from "moment";
import { cashierList } from "@/api/analysis";

export default {
  name: "attributeFlowSelect",
  components: {
    iDatePicker,
  },
  props: ["polygon"],
  data() {
    return {
      polygonList: [],
      queryParams: {},
      time: [
        Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
        Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
      ],
      age: "",
      wayList: [{ value: 0, lable: "独行" }, { value: 1, lable: "结伴" }],
      ageList: [
        { value: "0-16", lable: "16及以下" },
        { value: "16-30", lable: "16-30" },
        { value: "30-40", lable: "30-40" },
        { value: "40-55", lable: "40-55" },
        { value: "55-65", lable: "55-65" },
        { value: "65-150", lable: "65及以上" },
      ],
    };
  },
  methods: {
    dateSelect(time) {
      this.queryParams.time1 = Moment(time[0]).format("YYYY-MM-DD");
      this.queryParams.time2 = Moment(time[1]).format("YYYY-MM-DD");
    },
    ageChange() {
      if (this.age) {
        let age = this.age.split("-");
        this.queryParams.age1 = age[0];
        this.queryParams.age2 = age[1];
      } else {
        this.queryParams.age1 = "";
        this.queryParams.age2 = "";
      }
    },
    handleClick() {
      this.$emit("handleClick", this.queryParams);
    },
    resetClick() {
      this.queryParams = {};
      this.age = "";
      this.time = [
        Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
        Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
      ];
      this.dateSelect(this.time);
    },
  },
  created() {
    if (this.polygon) {
      cashierList().then((res) => {
        this.polygonList = res.data.data;
      });
    }
  },
};
</script>

<style lang="less" scoped>
.ipt {
  width: 350px !important;
}
</style>
