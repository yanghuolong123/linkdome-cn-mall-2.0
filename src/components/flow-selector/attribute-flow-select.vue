<template>
  <div class="selector-container common-card">
    <div class="flex-center">
      <i-date-picker
        class="w-select"
        :value="time"
        :dType="1"
        @selectDate="dateSelect"
      ></i-date-picker>
      <Select
        v-model="age"
        class="w-select m-l-20"
        @on-change="compareTypeChange"
      >
        <Option v-for="item in ageList" :value="item.value" :key="item.value">{{
          item.lable
        }}</Option>
      </Select>
      <div class="mt-2 m-l-20">
        <vs-radio v-model="is_together" :vs-value="0" class="mr-4"
          >全部</vs-radio
        >
        <vs-radio v-model="is_together" :vs-value="1" class="mr-4"
          >结伴同行</vs-radio
        >
      </div>
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

export default {
  name: "attributeFlowSelect",
  components: {
    iDatePicker,
  },
  data() {
    return {
      is_together: 0,
      queryParams: {},
      time: [],
      age: "",
      ageList: [
        {
          value: "0-20",
          lable: "小于20",
        },
        {
          value: "20-30",
          lable: "20-30",
        },
        {
          value: "30-40",
          lable: "30-40",
        },
        {
          value: "40-50",
          lable: "40-50",
        },
        {
          value: "50-60",
          lable: "50-60",
        },
        {
          value: "60-100",
          lable: "大于60",
        },
      ],
    };
  },
  methods: {
    compareTypeChange() {
      let age = this.age.split("-");
      this.queryParams.age1 = age[0];
      this.queryParams.age2 = age[1];
    },
    dateSelect() {
      this.queryParams.time1 = Moment(this.time[0]).format("YYYY-MM-DD");
      this.queryParams.time2 = Moment(this.time[1]).format("YYYY-MM-DD");
    },
    handleClick() {
      this.queryParams.is_together = this.is_together;
      console.log(this.queryParams);
    },
    resetClick() {
      this.is_together = 0;
      console.log(this.is_together);
      // this.queryParams = {};
      console.log(this.queryParams);
    },
  },
};
</script>
