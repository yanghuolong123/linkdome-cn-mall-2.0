<template>
  <div class="selector-container common-card">
    <div class="flex-center">
      <i-date-picker
        class="w-select"
        :value="queryParams.date1Array"
        :dType="1"
        @selectDate="dateSelect"
      ></i-date-picker>
      <Select
        v-model="compareType"
        class="w-select m-l-20"
        @on-change="compareTypeChange"
      >
        <Option
          v-for="item in typeOptionsCom"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}
        </Option>
      </Select>
      <i-date-picker
        :disabled="['onYear', 'onChain'].includes(compareType)"
        class="w-select m-l-20"
        v-show="['time', 'onYear', 'onChain'].includes(compareType)"
        :dType="2"
        :value="queryParams.date2Array"
        @selectDate="dateSelect"
      ></i-date-picker>
    </div>
    <div class="flex-center raido-group" v-show="compareType === 'entity'">
      <vs-radio
        v-model="entityType"
        :vs-value="item.value"
        :key="item.value"
        v-for="item in entityOptionsCom"
        class="mr-4"
        >{{ item.label }}
      </vs-radio>
    </div>
    <div class="flex-center mt-20">
      <Select
        v-model="queryParams.bussinessType"
        :max-tag-count="1"
        multiple
        class="w-select"
        v-show="compareType === 'businessType'"
      >
        <Option
          v-for="item in bussinessTypeOptions"
          :value="item.id"
          :key="item.id"
          >{{ item.name }}
        </Option>
      </Select>
      <el-cascader
        v-show="compareType === 'entity' && entityType === 'store'"
        class="w-select"
        :placeholder="$t('holder.请选择')"
        v-model="storeCascadeData"
        filterable
        collapse-tags
        :props="{ multiple: true, expandTrigger: 'hover' }"
        :options="storeCascadeOpiton"
      >
      </el-cascader>
      <el-cascader
        v-show="compareType === 'entity' && entityType === 'gate'"
        :placeholder="$t('holder.请选择')"
        class="w-select"
        v-model="gateCascadeData"
        collapse-tags
        :props="{
          multiple: true,
          expandTrigger: 'hover',
          label: 'name',
          value: 'id',
        }"
        :options="gateCascadeOpiton"
      >
      </el-cascader>
      <el-cascader
        v-show="compareType !== 'entity' && compareType !== 'businessType'"
        :placeholder="$t('holder.请选择')"
        v-model="entityCascaderData"
        collapse-tags
        class="w-select "
        :props="cascadeProps"
        :options="entityCascaderOption"
      >
      </el-cascader>
      <Select
        v-model="queryParams.selectList"
        :max-tag-count="1"
        multiple
        class="w-select"
        v-show="
          compareType === 'entity' && !['store', 'gate'].includes(entityType)
        "
      >
        <Option v-for="item in selectOptions" :value="item.id" :key="item.id"
          >{{ item.label }}
        </Option>
      </Select>
      <Select v-model="queryParams.enterType" class="w-select m-l-20">
        <Option v-for="item in customType" :value="item.value" :key="item.value"
          >{{ item.label }}
        </Option>
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
import { formatEntityData, getCompareDate } from "@/libs/util";
import selectMixin from "@/mixin/selectMixin.js";
import { getBussinessDict } from "@/api/home";
import Moment from "moment";

export default {
  name: "flowSelector",
  mixins: [selectMixin],
  data() {
    return {
      bussinessTypeOptions: [], //业态
      typeOptions: [],
      entityOptions: [],
      cascadeProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: "hover",
      },
    };
  },
  computed: {
    typeOptionsCom() {
      this.typeOptions = [
        {
          value: "not",
          label: this.$t("无对比"),
        },
        {
          value: "entity",
          label: this.$t("实体对比"),
        },
        {
          value: "businessType",
          label: this.$t("业态对比"),
        },
        {
          value: "time",
          label: this.$t("自定义对比"),
        },
        {
          value: "onYear",
          label: this.$t("同比"),
        },
        {
          value: "onChain",
          label: this.$t("环比"),
        },
      ];
      return this.typeOptions;
    },
    entityOptionsCom() {
      this.entityOptions = [
        {
          label: this.$t("楼层"),
          value: "floor",
        },
        {
          label: this.$t("商铺"),
          value: "store",
        },
        {
          label: this.$t("区域"),
          value: "area",
        },
        {
          label: this.$t("出入口"),
          value: "gate",
        },
      ];
      return this.entityOptions;
    },
  },
  methods: {
    getBussinessDict() {
      getBussinessDict({
        property_id: this.$store.state.home.headerAction,
      }).then((res) => {
        res = res.data.data;
        this.bussinessTypeOptions = [
          {
            id: -1,
            name: "全部业态",
          },
        ];
        if (res) {
          for (let key in res) {
            this.bussinessTypeOptions.push({
              id: key,
              name: res[key],
            });
          }
        }
      });
    },
    paramsPrepare(params) {
      this.$emit("paramsPrepare", params);
    },
    compareTypeChange(val) {
      switch (val) {
        case "time":
          // 自定义时间
          this.queryParams.date2Array = [
            Moment().format("YYYY-MM-DD"),
            Moment().format("YYYY-MM-DD"),
          ];
          break;
        case "onYear":
        case "onChain":
          this.queryParams.date2Array = getCompareDate(
            this.queryParams.date1Array,
            val
          );
          break;
        case "not":
          this.queryParams.date2Array = [];
          break;
        case "entity":
          this.queryParams.selectList = this.selectOptions.map((o) => {
            return o.id;
          });
          break;
        case "businessType":
          this.queryParams.bussinessType = this.bussinessTypeOptions.map(
            (o) => {
              return o.id;
            }
          );
          break;
      }
    },
    handleBussinessTreeData(data) {
      const cascadeAuthData = _.cloneDeep(data).filter((o) => {
        return o.property_id === this.$store.state.home.headerAction;
      });
      this.entityCascaderOption = _.compact(
        formatEntityData(
          cascadeAuthData,
          this.$store.state.user.role_id,
          this.$store.state.user.checklist
        )
      );
      this.handleEntityPrivilege();
      //给级联设置默认值
      this.setEntityCascaderDataDefaultValue();
      this.handleClick();
      this.cascadeDataAddAll(this.entityCascaderOption);
    },
  },
  watch: {
    "queryParams.bussinessType": {
      handler(newval, oldval) {
        if (_.differenceWith(newval, oldval)[0] === -1) {
          this.queryParams.bussinessType = this.bussinessTypeOptions.map(
            (o) => {
              return o.id;
            }
          );
        }
        if (_.differenceWith(oldval, newval)[0] === -1) {
          this.queryParams.bussinessType = [];
        }
        if (
          this.queryParams.bussinessType.length === 1 &&
          this.queryParams.bussinessType[0] === -1
        ) {
          this.queryParams.bussinessType = [];
        }
      },
      deep: true,
    },
    "$store.state.home.headerAction": {
      handler() {
        this.getStoreCascadeOpiton();
        this.bussinessTreeReq()
          .then((res) => {
            this.getSelectOption(res); //获取实体选择时多选下拉框
            this.handleBussinessTreeData(res);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      immediate: true,
    },
  },
  created() {
    //获取所有业态
    this.getBussinessDict();
  },
};
</script>
