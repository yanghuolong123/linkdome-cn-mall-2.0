<template>
  <div>
    <flow-selector @paramsPrepare="paramsPrepare" ref="flowSelector"></flow-selector>
    <chart-box 	:chart="chart"
                ref="chart"
                class="common-card chart m-t-20"
                @toolClick="toolClick"
                :toolList="toolList">
      <i-switch
        class="ml-20 switch"
        size="large"
        v-if="headerData.show_actual_val &&( oParams&&!oParams.isDateCompare())"
        @on-change="compareTypeChange"
        v-model="isHour"
      >
        <span slot="open">{{ $t("hour") }}</span>
        <span slot="close">{{ $t("fx.day") }}</span>
      </i-switch>
    </chart-box>
    <table-default
      class="m-t-20"
      :tableTitle="tableTitle"
      :tableName="tableName"
      :tableList="tableList"
    ></table-default>
  </div>
</template>

<script>
import Vue from "vue";
import TableDefault from "../ui-elements/table/TableDefault.vue";
import VxBreadcrumb from "@/layouts/components/VxBreadcrumb.vue";
import { dwellTime,dwellTimeNew } from "@/api/analysis";
import _ from "lodash";
import FlowSelector from "_c/flow-selector/dwellTime-flow-selector";
import { initTimes } from "@/libs/util";
Vue.component(VxBreadcrumb.name, VxBreadcrumb);
import ChartBox from '_c/common/Chart-box'
import { config as barConfig } from '@/config/echarts-config/bar-chart'
import { config as lineConfig } from '@/config/echarts-config/line-chart'

import { ParamsConstructor } from "@/libs/params-constructor/params.class.js";
import {mapState} from 'vuex'
export default {
  name: "DwellTime",

  components: {
    TableDefault,
    ChartBox,
    FlowSelector,
  },
  computed:{
    ...mapState({
      propertyId: state => state.home.headerAction,
      headerData:state => state.home.headerData,

    }),
    toolList(){
      let list = [
        {
          icon: 'zhexiantu',
          value: 'line',
          name: 'residenceTimeDistribution'
        },
        {
          icon: '62',
          value: 'bar',
          name: 'residenceTimeDistribution'
        }, {
          icon: 'biaoge-copy',
          value: 'table',
          name: 'residenceTimeDistribution'
        }, {
          icon: 'daoru',
          value: 'download',
          name: 'residenceTimeDistribution'
        }
      ]
      if((this.oParams && !this.oParams.isSingleDay())|| this.isHour){
        return list
      }else {
        let listCopy = _.cloneDeep(list)
        listCopy.shift()
        return listCopy
      }
    }
  },
  data() {
    return {
      tableTitle: "detailData",
      isTableDate: false,
      iconIndex: 1,
      iconColor: "rgb(34, 128, 215)",
      iconList: [
        {
          type: "62",
          color: "#9D9D9DFF",
          value: 1,
        },
        {
          type: "biaoge-copy",
          color: "#9D9D9DFF",
          value: 2,
        },
        {
          type: "daoru",
          color: "#9D9D9DFF",
          value: 3,
        },
      ],
      chartTableName: ["entityName", "停留时间"],
      chartTableListL: [],
      tableName: ["entityName", "entityCategory", "avgDwellTime"],
      tableList: [],


      oParams:null,
      isHour:false,
      chart:{
        barChart: null,
      },
      chartOption:{
        lineOption:null,
        barOption:null,
        tableOption:null
      }

    };
  },

  methods: {
    //按小时开关
    compareTypeChange(val) {
      this.$refs.flowSelector.handleClick();
    },
    handleData(){
      if(this.oParams.isDateCompare()){
        this.isHour = false
      }
      let range
      if(this.isHour){
        range = 'Hour'
      }else {
        range = this.oParams.getParams().range === 'Hour'?'Date':this.oParams.getParams().range
      }
      const params = {
        ...this.oParams.getParams(),
        property_id:this.propertyId,
        range
      }
      dwellTimeNew(params).then(res=>{
        res = res.data.data;
        let legend = [],xAxis=[],series = []
        res.forEach(o=>{
          if(this.oParams.isSingleDay()){
            if(this.oParams.isDateCompare()){
              xAxis.push(`${o.name}|${params.time1.split(',')[0]}`)
              xAxis.push(`${o.name}|${params.time2.split(',')[0]}`)
              series.push({
                name:`${o.name}|${params.time1.split(',')[0]}`,
                data:o.time1.map(m=>{
                  return {
                    value:m.dwell,
                    data:initTimes(m.dwell),
                  }
                })
              })
              series.push({
                name:`${o.name}|${params.time2.split(',')[0]}`,
                data:o.time2.map(m=>{
                  return {
                    value:m.dwell,
                    data:initTimes(m.dwell),
                  }
                })
              })
            }else {
              if(this.isHour){
                xAxis = o.time1.map(m=>{
                  return m.datetime
                })
                legend.push(o.name)
                series.push({
                  name:o.name,
                  data:o.time1.map(m=>{
                    return {
                      value:m.dwell,
                      data:initTimes(m.dwell),
                    }
                  })
                })
              }else {
                xAxis.push(o.name)
                legend=[params.time1.split(',')[0]]
                if(!series.length){
                  series.push({
                    name:params.time1.split(',')[0],
                    data:o.time1.map(m=>{
                      return {
                        value:m.dwell,
                        data:initTimes(m.dwell),
                      }
                    })
                  })
                }else {
                  series[0].data.push({
                    value:o.time1[0].dwell,
                    data:initTimes(o.time1[0].dwell),
                  })
                }
              }


            }
          }else {
            if(this.oParams.isDateCompare()){
              if(!xAxis.length){
                const days = Math.max(res[0].time1.length,res[0].time2.length)
                for(let i=1;i<=days;i++){
                  xAxis.push( this.$t("fn.dayTh", [i]))
                }
              }

              legend.push(`${o.name}|${params.time1.replace(',',' - ')}`)
              legend.push(`${o.name}|${params.time2.replace(',',' - ')}`)
              series.push({
                name:`${o.name}|${params.time1.replace(',',' - ')}`,
                data: o.time1.map(m=>{
                  return {
                    value:m.dwell,
                    data:initTimes(m.dwell),
                  }
                })
              })
              series.push({
                name:`${o.name}|${params.time2.replace(',',' - ')}`,
                data: o.time2.map(m=>{
                  return {
                    value:m.dwell,
                    data:initTimes(m.dwell),
                  }
                })
              })
            }else {
              xAxis = res[0].time1.map(m=>{
                return m.datetime
              })
              legend.push(o.name)
              series.push({
                name:o.name,
                data:o.time1.map(m=>{
                  return {
                    value:m.dwell,
                    data:initTimes(m.dwell),
                  }
                })
              })
            }
          }
        })
        const options = {
          legend:{
            show:!this.oParams.isSingleDay(),
            data:legend
          },
          yAxis:{
            type: 'value',
            axisLabel: {
              formatter: function (value, index) {
                return initTimes(value)
              }
            }
          },
          xAxis,
          series,
          tooltip:{
            trigger: 'axis',
            formatter:(params)=>{
              let html =`${this.$t('avgDwellTime')}<br>`
              if(this.oParams.isSingleDay()){
                html = `${this.$t('avgDwellTime')}<br>`
              }else {
                html =  params[0].axisValue+'<br>'
              }
              params.forEach(o=>{
                let inner = ''
                if(this.oParams.isSingleDay()){
                  inner =  `${o.marker}${o.axisValue}：${o.data.data}<br>`
                }else {
                  inner = `${o.marker}${o.seriesName}：${o.data.data}<br>`
                }
                html += inner
              })
              return html
            }
          }
        }
        this.chartOption.barOption = this.setBarOption(options)
        this.chartOption.lineOption = this.setLineOption(options)
        this.chartOption.tableOption = this.setTableOption(options)
        this.toolClick(this.$refs.chart.currentChart)
      })
    },
    setTableOption(options){
      let optionsCopy = _.cloneDeep(options)
      optionsCopy.legend.type = this.oParams.isSingleDay()&&!this.isHour?'entity':''
      optionsCopy.xAxis = {
        data:optionsCopy.xAxis
      }
      optionsCopy.series.forEach(o=>{
        o.data = o.data.map(m=>{
          return m.data
        })
      })
      return optionsCopy

    },
    setLineOption(options){
      let lineConfigCopy = _.cloneDeep(lineConfig)
      if(options.xAxis.length > 20){
        lineConfigCopy.dataZoom = [
          {
            type: "slider",
            zoomLock: false,
            show: true, //flase直接隐藏图形
            xAxisIndex: [0],
            left: "4%", //滚动条靠左侧的百分比
            height:24,
            bottom: 60,
            start: 0, //滚动条的起始位置
            end: 100,
            // end:parseInt((20/length)*100 ) //滚动条的截止位置（按比例分割你的柱状图x轴长度）
          },
        ]
      }else {
        delete lineConfigCopy.dataZoom
      }

      const obj = {
        type: 'line'
      }
      let copyOption = _.cloneDeep(options)
      copyOption.series.forEach(o => {
        Object.assign(o, obj)
      })
      lineConfigCopy.series = copyOption.series
      lineConfigCopy.xAxis.data = copyOption.xAxis
      Object.assign(lineConfigCopy.legend, copyOption.legend)
      Object.assign(lineConfigCopy.yAxis, copyOption.yAxis)
      lineConfigCopy.tooltip = copyOption.tooltip
      return lineConfigCopy
    },
    setBarOption(options){
      let barConfigCopy = _.cloneDeep(barConfig)
      if(options.xAxis.length > 20){
        barConfigCopy.dataZoom = [
          {
            type: "slider",
            zoomLock: false,
            show: true, //flase直接隐藏图形
            xAxisIndex: [0],
            left: "4%", //滚动条靠左侧的百分比
            height:24,
            bottom: 60,
            start: 0, //滚动条的起始位置
            end: 100,
            // end:parseInt((20/length)*100 ) //滚动条的截止位置（按比例分割你的柱状图x轴长度）
          },
        ]
      }else {
        delete barConfigCopy.dataZoom
      }
      const obj = {
        type: 'bar',
        barGap: '0%',
        barMaxWidth:80,
        itemStyle: {
          normal: {
            //柱形图圆角
            barBorderRadius: [80, 80, 0, 0],
          },
        },
      }
      let copyOption = _.cloneDeep(options)
      copyOption.series.forEach(o => {
        Object.assign(o, obj)
      })
      barConfigCopy.xAxis.data = copyOption.xAxis
      Object.assign(barConfigCopy.legend, copyOption.legend)
      Object.assign(barConfigCopy.yAxis, copyOption.yAxis)
      barConfigCopy.series = copyOption.series
      barConfigCopy.tooltip = copyOption.tooltip
      return barConfigCopy
    },
    paramsPrepare(value) {
      this.oParams = new ParamsConstructor(_.cloneDeep(value), this.isHour);
      this.handleData()
      var time1 = value.date1Array[0] + "," + value.date1Array[1];
      var time2;
      var charType = false;
      if (this.oParams.isDateCompare()) {
        time2 = value.date2Array[0] + "," + value.date2Array[1];
        if (value.date1Array[0] === value.date1Array[1]) {
          charType = value.date2Array[0] === value.date2Array[1]
        } else {
          charType = false;
        }
      } else {
        time2 = "";
        charType =value.date1Array[0] === value.date1Array[1]
      }
      var bzid = [];
      value.entitys.map(function(d) {
        bzid.push(d.id);
      });
      bzid = _.remove(bzid, function(n) {
        return n != 0;
      }).join(",");
      this.tableType(time2);
      this.dataList(time1, time2, bzid, charType);
    },
    dataList(time1, time2, bzid, charType) {
      var that = this;
      dwellTime({ time1, time2, bzid })
        .then((res) => {
          // 表格数据
          that.tableList = [];
          console.log(res.data.data.zones)
          res.data.data.zones.map((d) => {
            var obj = {};
            obj.name = d.name;
            // todo
            //接口数据 类型为中文  d.type
            obj.type = this.$t(d.type == null ? "gate" : d.type);
            if (!this.oParams.isDateCompare()) obj.time = "";
            else {
              let date;
              if (d.date) {
                const arr = d.date.split(",");
                if (arr[0] === arr[1]) {
                  date = arr[0];
                } else {
                  date = `${arr[0]} - ${arr[1]}`;
                }
              }
              obj.time = d.date ? date : (obj.time = " ");
            }
            obj.avg = initTimes(d.avg);
            that.tableList.push(obj);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    toolClick(chartName){
      switch (chartName) {
        case 'table':
          this.$nextTick(() => {
            this.$refs.chart.initTable(this.chartOption.tableOption)
          })
          break
        case 'line':
          this.$nextTick(() => {
            this.$refs.chart.initLineChart(this.chartOption.lineOption)
          })
          break
        case 'bar':
          this.$nextTick(() => {
            this.$refs.chart.initBarChart(this.chartOption.barOption)
          })
          break
      }
    },
    tableType(value) {
      if (value === "") {
        this.tableName = ["entityName", "entityCategory", "avgDwellTime"];
      } else {
        this.tableName = ["entityName", "entityCategory", "timing", "avgDwellTime"];
      }
    },

  },
};
</script>
<style lang="scss" scoped>
.dwell-chart-table {
  padding: 20px;
  padding-top: 0;
}
.chart{
  height: 500px;
  .switch {
    width: 60px;
    margin-right: 20px;
    &.ivu-switch-large.ivu-switch-checked:after {
      left: 40px;
    }
  }
}

</style>
