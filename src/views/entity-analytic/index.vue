<template>
  <div>
    <flow-selector
      :maxEntity="false"
      ref="flowSelector"
      @paramsPrepare="paramsPrepare"
    ></flow-selector>
    <!--总客流量趋势-->
    <chart-box
      chartId="enter"
      :chart="enterChart"
      ref="chartEnter"
      :isDateCompare="oParams && oParams.isDateCompare()"
      :showSummary="true"
      @toolClick="
        (chartName) => {
          handletoolClick(chartName, 'chartEnter', enterSelect, responseData);
        }
      "
      class="common-card m-t-20 chart-1"
      :toolList="toolList"
    >
      <div class="flex-center quota">
        <span class="quota-label">{{ $t("fx.Data_indicators") }}</span>
        <Select
          v-model="enterSelect"
          multiple
          :max-tag-count="1"
          @on-change="enterSelectChange"
        >
          <Option
            v-for="item in enterFlowList"
            :value="item.value"
            :key="item.value"
            >{{ $t(item.name) }}</Option
          >
        </Select>
        <i-switch
          v-if="
            oParams &&
              !oParams.isDateCompare() &&
              !(
                (oParams && oParams.isSingleDay()) ||
                (enterSelect.length > 1 &&
                  (oParams && oParams.params.entitys.length > 1))
              )
          "
          class="ml-20 switch"
          size="large"
          @on-change="
            (val) => {
              compareTypeChange(val, 'enter');
            }
          "
          v-model="isHour"
        >
          <span slot="open">{{ $t("小时") }}</span>
          <span slot="close">{{ $t("fx.day") }}</span>
        </i-switch>
      </div>
    </chart-box>
    <!--顾客客流量趋势-->
    <chart-box
      chartId="customer"
      :chart="customerEnterChart"
      ref="customerChartEnter"
      :isDateCompare="oParams && oParams.isDateCompare()"
      :showSummary="true"
      @toolClick="
        (chartName) => {
          handletoolClick(
            chartName,
            'customerChartEnter',
            customerEnterSelect,
            customerResponseData
          );
        }
      "
      class="common-card m-t-20 chart-1"
      :toolList="customerToolList"
    >
      <div class="flex-center quota">
        <span class="quota-label">{{ $t("fx.Data_indicators") }}</span>
        <Select
          v-model="customerEnterSelect"
          multiple
          :max-tag-count="1"
          @on-change="customerEnterSelectChange"
        >
          <Option
            v-for="item in enterFlowList"
            :value="item.value"
            :key="item.value"
            >{{ $t(item.name) }}</Option
          >
        </Select>
        <i-switch
          v-if="
            oParams &&
              !oParams.isDateCompare() &&
              !(
                (oParams && oParams.isSingleDay()) ||
                (customerEnterSelect.length > 1 &&
                  (oParams && oParams.params.entitys.length > 1))
              )
          "
          class="ml-20 switch"
          size="large"
          @on-change="
            (val) => {
              compareTypeChange(val, 'customer');
            }
          "
          v-model="c_IsHour"
        >
          <span slot="open">{{ $t("小时") }}</span>
          <span slot="close">{{ $t("fx.day") }}</span>
        </i-switch>
      </div>
    </chart-box>
    <!--店员客流量趋势-->
    <chart-box
      chartId="staff"
      :chart="staffEnterChart"
      ref="staffChartEnter"
      :isDateCompare="oParams && oParams.isDateCompare()"
      :showSummary="true"
      @toolClick="
        (chartName) => {
          handletoolClick(
            chartName,
            'staffChartEnter',
            staffEnterSelect,
            staffResponseData
          );
        }
      "
      class="common-card m-t-20 chart-1"
      :toolList="staffToolList"
    >
      <div class="flex-center quota">
        <span class="quota-label">{{ $t("fx.Data_indicators") }}</span>
        <Select
          v-model="staffEnterSelect"
          multiple
          :max-tag-count="1"
          @on-change="staffEnterSelectChange"
        >
          <Option
            v-for="item in enterFlowList"
            :value="item.value"
            :key="item.value"
            >{{ $t(item.name) }}</Option
          >
        </Select>
        <i-switch
          v-if="
            oParams &&
              !oParams.isDateCompare() &&
              !(
                (oParams && oParams.isSingleDay()) ||
                (staffEnterSelect.length > 1 &&
                  (oParams && oParams.params.entitys.length > 1))
              )
          "
          class="ml-20 switch"
          size="large"
          @on-change="
            (val) => {
              compareTypeChange(val, 'staff');
            }
          "
          v-model="s_IsHour"
        >
          <span slot="open">{{ $t("小时") }}</span>
          <span slot="close">{{ $t("fx.day") }}</span>
        </i-switch>
      </div>
    </chart-box>
    <!--		<div class="common-card m-t-20" ref="enterTable" v-show="enterSelect.length === 1">-->
    <!--			<div class="detail-title">{{ $t('fn.detailData', [$t('enter')]) }}</div>-->
    <!--			<Table stripe height="400" :columns="enterTableColumnsTrans" :data="enterTable.tableData">-->
    <!--				<template slot-scope="{row}" slot="entityType">-->
    <!--					<span>{{getItype(row.entityName)}}</span>-->
    <!--				</template>-->
    <!--			</Table>-->
    <!--		</div>-->

    <chart-box
      chartId="occu"
      :chart="occuChart"
      v-show="showOccu"
      @toolClick="
        (chartName) => {
          handletoolClick(chartName, 'chartOccu', ['occupancy']);
        }
      "
      ref="chartOccu"
      class="common-card m-t-20 chart-1"
      :toolList="occuTool"
    ></chart-box>
    <div class="common-card m-t-20" ref="occuTable" v-show="showOccu">
      <div class="detail-title">{{ $t("fn.detailData", [$t("集客量")]) }}</div>
      <Table
        stripe
        height="400"
        :columns="occuTableColumnsTrans"
        :data="occuTable.tableData"
      >
        <template slot-scope="{ row }" slot="entityType">
          <span>{{ getItype(row.entityName) }}</span>
        </template>
      </Table>
    </div>
  </div>
</template>
<script>
  import FlowSelector from '_c/flow-selector/entity-flow-selector'
  import ChartBox from '_c/common/Chart-box'
  import { ParamsConstructor } from '@/libs/params-constructor/params.class.js'
  import { LineChartConstructor } from '@/libs/echart-constructor/line.class.js'
  import { BarChartConstructor } from '@/libs/echart-constructor/bar.class.js'
  import config from '@/config/index'
  import { entityFlow,staffEntityFlow } from '@/api/entityNew'
  import { getMaxIndex, findKey, deepFind } from '@/libs/util'
  import moment from 'moment'
	import {isEmpty} from '../../libs/util'
	let staffToolList = [
    {
      icon: 'zhexiantu',
      value:'line',
      name: '店员客流量趋势'
    }, {
      icon: '62',
      value:'bar',
      name: '店员客流量趋势'
    }, {
      icon: 'biaoge-copy',
      value:'table',
      name: '详细数据'
    }, {
      icon: 'daoru',
      value:'download',
      name: '实体客流分析店员客流量趋势'
    }
  ];
  let customerToolList = [
    {
      icon: 'zhexiantu',
      value:'line',
      name: '顾客客流量趋势'
    }, {
      icon: '62',
      value:'bar',
      name: '顾客客流量趋势'
    }, {
      icon: 'biaoge-copy',
      value:'table',
      name: '详细数据'
    }, {
      icon: 'daoru',
      value:'download',
      name: '实体客流分析顾客客流量趋势'
    }
  ];
  export default {
    name: 'entity-analytic',
    components: {
      FlowSelector,
      ChartBox
    },
    data () {
      return {
        oParams: null,
        isHour: false,//按小时
        c_IsHour: false,//按小时(顾客)
        s_IsHour: false,//按小时(员工)
        originParams:{},
        enterFlowList: [],
        enterSelect: ['enter'],
        staffEnterSelect: ['enter'],
        customerEnterSelect: ['enter'],
        responseData: {},//接口返回的数据
        staffResponseData: {},//接口返回的数据(员工)
        customerResponseData: {},//接口返回的数据(顾客)
        enterChart: {
          barChart: null,
          lineChart: null
        },
        customerEnterChart: {
          barChart: null,
          lineChart: null
        },
        staffEnterChart: {
          barChart: null,
          lineChart: null
        },
        occuChart: {
          barChart: null,
          lineChart: null
        },
        enterTable: {
          columns: [],
          tableData: []
        },
        occuTable: {
          columns: [],
          tableData: []
        }
      }
    },
    computed: {
      customerToolList(){
        if (!this.oParams || !this.oParams.getBzid()) return customerToolList
        //当选择了多指标，多实体时，不显示折线图
        if (this.customerEnterSelect.length > 1 && this.oParams.getBzid().split(',').length > 1) {
          let toolList = _.cloneDeep(customerToolList)
          return toolList.splice(1)
        } else {
          return customerToolList
        }
			},
      staffToolList(){
        if (!this.oParams || !this.oParams.getBzid()) return staffToolList
        //当选择了多指标，多实体时，不显示折线图
        if (this.staffEnterSelect.length > 1 && this.oParams.getBzid().split(',').length > 1) {
          let toolList = _.cloneDeep(staffToolList)
          return toolList.splice(1)
        } else {
          return staffToolList
        }
			},
      toolList () {
        if (!this.oParams || !this.oParams.getBzid()) return config.toolList
        //当选择了多指标，多实体时，不显示折线图
        if (this.enterSelect.length > 1 && this.oParams.getBzid().split(',').length > 1) {
          let toolList = _.cloneDeep(config.toolList)
          return toolList.splice(1)
        } else {
          return config.toolList
        }
      },
      //显示集客量图表的条件为：选择了购物中心 并且 是单天的数据
      showOccu () {
        return false //沃尔玛不显示集客量
        if (!this.oParams) return false
        return !isEmpty(this.oParams.getSelectedShopId()) && this.oParams.isSingleDay()&&this.oParams.params.compareType!=="businessType"
      },
  },
  computed: {
    toolList() {
      if (!this.oParams || !this.oParams.getBzid()) return config.toolList;
      //当选择了多指标，多实体时，不显示折线图
      if (
        this.enterSelect.length > 1 &&
        this.oParams.getBzid().split(",").length > 1
      ) {
        let toolList = _.cloneDeep(config.toolList);
        return toolList.splice(1);
      } else {
        return config.toolList;
      }
    },
    methods: {
      //按小时开关
      compareTypeChange (val,type) {
        this.oParams = new ParamsConstructor(_.cloneDeep(this.originParams), val)
        switch (type) {
					case 'enter':
					  this.getEnterData()
						break
					case 'staff':
					  this.getStaffData()
						break
					case 'customer':
					  this.getCustomerData()
						break
        }
      },
      enterSelectChange (val) {
        if (!val.length) {
          this.enterSelect = ['enter']
        }
        this.updateChart('chartEnter',this.enterSelect,this.responseData)
        // this.enterTable = this.updateTableDetail(this.enterSelect)
      },
      staffEnterSelectChange(val){
        if (!val.length) {
          this.staffEnterSelect = ['enter']
        }
        this.updateChart('staffChartEnter',this.staffEnterSelect,this.staffResponseData)
        // this.enterTable = this.updateTableDetail(this.staffEnterSelect)
			},
      customerEnterSelectChange(val){
        if (!val.length) {
          this.customerEnterSelect = ['enter']
        }
        this.updateChart('customerChartEnter',this.customerEnterSelect,this.customerResponseData)
        // this.enterTable = this.updateTableDetail(this.staffEnterSelect)
			},
      handletoolClick (chartName, componentName, quta ,sourceData) {
        switch (chartName) {
          case 'line':
          case 'table':
            this.$nextTick(() => {
              this.updateLineChart(componentName, quta,sourceData)
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.updateBarChart(componentName, quta,sourceData)
            })
            break
        }
      },
      getEnterData(){
        let reqList = [],responseList = [];
        this.enterFlowList.forEach(o => {
          responseList.push(o.value);
          const data = {
            type: o.value,
            ...this.oParams.getParams()
          }
          reqList.push(entityFlow(data))
        })
        Promise.all(reqList).then(res => {
          responseList.forEach((o, i) => {
            this.responseData[o] = res[i].data.data
          })
          this.updateChart('chartEnter',this.enterSelect,this.responseData)
          // if (this.enterSelect.length < 2) {
          //   this.enterTable = this.updateTableDetail(this.enterSelect)
          // }
          // if (this.showOccu) {
          //   this.updateChart('chartOccu', ['occupancy'])
          //   this.occuTable = this.updateTableDetail(['occupancy'])
          // }
        }).catch(err => {
          this.$Message.error('数据获取失败')
          console.log(err)
        })
			},
      getStaffData(){
        let reqList = [],responseList = [];
        this.enterFlowList.forEach(o => {
          responseList.push(o.value);
          const data = {
            type: o.value,
            ...this.oParams.getParams(),
            mode:'Staff'
          }
          reqList.push(staffEntityFlow(data))
        })
        Promise.all(reqList).then(res => {
          responseList.forEach((o, i) => {
            this.staffResponseData[o] = res[i].data.data
          })
          this.updateChart('staffChartEnter',this.staffEnterSelect,this.staffResponseData)
        }).catch(err => {
          this.$Message.error('员工数据获取失败')
          console.log(err)
        })
			},
      getCustomerData(){
        let reqList = [],responseList = [];
        this.enterFlowList.forEach(o => {
          responseList.push(o.value);
          const data = {
            type: o.value,
            ...this.oParams.getParams(),
            mode:'Customer'
          }
          reqList.push(staffEntityFlow(data))
        })
        Promise.all(reqList).then(res => {
          responseList.forEach((o, i) => {
            this.customerResponseData[o] = res[i].data.data
          })
          this.updateChart('customerChartEnter',this.customerEnterSelect,this.customerResponseData)
        }).catch(err => {
          this.$Message.error('顾客数据获取失败')
          console.log(err)
        })
			},
      paramsPrepare (params) {
				this.originParams = params
        if(['time', 'onYear', 'onChain'].includes(params.compareType)){
          this.isHour = false
          this.c_IsHour = false
          this.s_IsHour = false
				}
        this.oParams = new ParamsConstructor(_.cloneDeep(params), this.isHour)
        if (this.oParams.isSingleDay()) {
          this.isHour = false//单天将开关置为默认
          this.c_IsHour = false//单天将开关置为默认
          this.s_IsHour = false//单天将开关置为默认
        }
        this.getEnterData();
        this.getStaffData();
        this.getCustomerData();

        // //判断是否需要查询集客量数据
        // if (this.showOccu) {
        //   reqList.push(entityFlow({
        //     type: 'occupancy',
        //     ...this.oParams.getParams(true)
        //   }))
        //   responseList.push('occupancy')
        // }




      },
      updateLineChart (componentName, quta,sourceData) {
        const lineOpiton = this.getLineOption(quta,sourceData)
        this.$refs[componentName].initLineChart(lineOpiton)
      },
      updateBarChart (componentName, quta,sourceData) {

        const data = _.cloneDeep(sourceData)
        let BarChart, barOpiton
        if (this.oParams.isDateCompare()) {
          BarChart = new BarChartConstructor(data, this.oParams, quta)
          barOpiton = BarChart.getDateCompare()
        } else {
          BarChart = new BarChartConstructor(data, this.oParams, quta)
          barOpiton = BarChart.getPostEntitysCompare()
        }
        this.$refs[componentName].initBarChart(barOpiton)
      },
      updateChart (componentName, quta,sourceData) {
        if (!this.oParams) return
        //多指标并且多实体渲染柱状图
        if (['chartEnter','staffChartEnter'].includes(componentName) && quta.length > 1 && this.oParams.getBzid().split(',').length > 1) {
          this.updateBarChart(componentName, quta,sourceData)
        } else {
          this.$nextTick(() => {//等子组件渲染完成，数据更新
            switch (this.$refs[componentName].currentChart) {
              case 'line':
              case 'table':
                this.updateLineChart(componentName, quta,sourceData)
                break
              case 'bar':
                this.updateBarChart(componentName, quta,sourceData)
                break
            }

          })

        }

      },
      getLineOption (quta = this.enterSelect,sourceData) {
        const data = _.cloneDeep(sourceData)
        let LineChart, lineOpiton
        if (this.oParams.isDateCompare()) {
          LineChart = new LineChartConstructor(data, this.oParams, quta)
          lineOpiton = LineChart.getDateCompare()
        } else {
          LineChart = new LineChartConstructor(data, this.oParams, quta)
          lineOpiton = LineChart.getPostEntitysCompare()
        }
        return lineOpiton
      },
      //更新表格【客流量,集客量详细数据信息】
      updateTableDetail (quta) {
        if (!this.oParams || quta.length > 1) {
          return {
            columns: [],
            tableData: []
          }
        });
      }
    },
    getLineOption(quta = this.enterSelect) {
      const data = _.cloneDeep(this.responseData);
      let LineChart, lineOpiton;
      if (this.oParams.isDateCompare()) {
        LineChart = new LineChartConstructor(data, this.oParams, quta);
        lineOpiton = LineChart.getDateCompare();
      } else {
        LineChart = new LineChartConstructor(data, this.oParams, quta);
        lineOpiton = LineChart.getPostEntitysCompare();
      }
      return lineOpiton;
    },
    //更新表格【客流量,集客量详细数据信息】
    updateTableDetail(quta) {
      if (!this.oParams || quta.length > 1) {
        return {
          columns: [],
          tableData: [],
        };
      }
      let tableData = [];
      const option = this.getLineOption(quta);
      const qutaName = findKey(config.dictionary, "value", quta[0], "name");
      const keyName =
        this.oParams.params.compareType === "businessType" ? "业态" : "实体";
      let columns = [
        {
          title: `${keyName}名称`,
          key: "entityName",
        },
        {
          title: `${keyName}类别`,
          slot: "entityType",
        },
        {
          title: `${qutaName}峰值`,
          key: "highest",
        },
      ];
      if (this.oParams.params.compareType === "businessType") {
        columns.splice(1, 1);
      }
      if (this.oParams.isDateCompare()) {
        columns.splice(2, 0, {
          title: "时间点",
          key: "time",
        });
      }
      columns.splice(-1, 0, {
        title: `累计${qutaName}`,
        key: "total",
      });
      option.legend.data.forEach((d, dIndex) => {
        const data = option.series[dIndex].data;
        if (!data.length) return;
        const entityName = d.split("|")[0];
        const highestIndex = getMaxIndex(data);
        const total = _.sum(data).toLocaleString() + this.$t("人次");
        let time;
        if (this.oParams.isDateCompare()) {
          time = d.split("|")[2];
        }
        let highestTime;
        if (
          this.oParams.getInnerRange() === "Hour" ||
          !this.oParams.isDateCompare()
        ) {
          if (this.oParams.getInnerRange() !== "Hour") {
            highestTime = `${option.xAxis.data[highestIndex]}`;
          } else {
            highestTime = `${
              option.xAxis.data[highestIndex]
            } - ${option.xAxis.data[highestIndex].replace(/00/, "59")}`;
          }
        } else {
          highestTime = moment(time.split(" - ")[0])
            .add(highestIndex, "d")
            .format("YYYY-MM-DD");
        }
        tableData.push({
          entityName,
          entityType: entityName,
          highest: `${data[highestIndex].toLocaleString()} ${this.$t(
            "人次"
          )} ${highestTime}`,
          total,
          time,
        });
      });
      return {
        columns,
        tableData,
      };
    },
    getItype(name) {
      const node = deepFind(
        this.$refs.flowSelector.entityCascaderOption,
        (o) => {
          return o.name === name;
        },
        "children"
      );
      if (node) {
        return (
          this.$t(findKey(config.dictionary, "value", node.itype, "name")) ||
          this.$t("购物中心")
        );
      } else {
        return "";
      }
    },
  },
  created() {
    this.enterFlowList = config.dictionary.filter((o) => {
      return ["enter", "exit"].includes(o.value);
    });
  },
};
</script>
<style scoped lang="less">
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

.detail-title {
  font-size: 18px;
  margin-bottom: 20px;
}
</style>
