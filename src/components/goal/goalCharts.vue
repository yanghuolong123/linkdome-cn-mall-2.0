<template>
  <div class="bg-white box-card box-cardss">
    <i-tabs  class="chartsTable" v-model="current">
      <tab-item :icon="icon1" class="chart-div" >
        <div class="left-title">
          <p class="title">{{ $t(title1) }}</p>
          <span v-if="isText">
            <hr v-if="dataType"></hr><p>{{dataType}}</p>
          </span>
        </div>
        <vue-apex-charts v-if="isChart"  :height="height1" :options="options1" :series="series1"></vue-apex-charts>
      </tab-item>
      <tab-item :icon="icon2" class="chart-div" >
        <div class="left-title">
          <p class="title">{{ $t(title1) }}</p>
          <span v-if="isText">
            <hr v-if="dataType"></hr><p>{{dataType}}</p>
          </span>
        </div>
        <vue-apex-charts ref="graphBar" :type="type2" :height="height1" :options="options2" :series="series2"></vue-apex-charts>
      </tab-item>
      <tab-item :icon="icon3" class="chart-div">
        <div class="left-title">
          <p class="title">{{ $t(title1) }}</p>
          <span v-if="isText">
            <hr v-if="dataType"></hr>
            <p>{{dataType}}</p>
          </span>
        </div>
        <TableMultipleSelected  style="overflow-y:scroll;" :style="{height:height3}" :tableName="columns" :tableList="tableList"></TableMultipleSelected>
      </tab-item>
    </i-tabs>
  </div>
</template>
<script>
import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import iTabs from '_c/I-Tabs/Itabs.vue'
export default {
  name: 'goalCharts',
  props: {
    options1: {
      type: Object,
      default: () => {}
    },
    options2: {
      type: Object,
      default: () => {}
    },
    series1: {
      type: Array,
      default: () => []
    },
    series2: {
      type: Array,
      default: () => []
    },
    icon1: {
      type: String,
      default: () => 'zhexiantu'
    },
    icon2: {
      type: String,
      default: () => '62'
    },
    icon3: {
      type: String,
      default: () => 'biaoge-copy'
    },
    title1: {
      type: String,
      default: () => '客流量趋势'
    },
    title2: {
      type: String,
      default: () => '详细数据'
    },
    columns: {
      type: Array,
      default: () => ['日期', '客流量 ( 人次 )', '目标客流量 ( 人次 )']
    },
    tableList: {
      type: Array,
      default: () => []
    },
    type1: {
      type: String,
      default: 'line'
    },
    type2: {
      type: String,
      default: 'bar'
    },
    height1: {
      type: String,
      default: '530px'
    },
    height3: {
      type: String,
      default: '530px'
    },
    dataType: {
      type: String,
      default: ''
    },
    isText: {
      type: Boolean,
      default: true
    }
  },
  components: {
    tabItem,
    VueApexCharts,
    TableMultipleSelected,
    iTabs
  },
  data () {
    return {
      current: 0,
      isChart: false,
    }
  },
  computed: {

  },
  watch: {
    series1 () {
      this.isChart = false
      this.series1.map(list => {
        if (list.data.length == 1 && list.data[0] == null)list.data[0] = 0
      })
      this.isChart = true
    }
  },
  mounted () {
    this.isChart = false
    this.series1.map(list => {
      if (list.data.length == 1 && list.data[0] == null)list.data[0] = 0
    })
    this.isChart = true
  },
  methods: {

  }
}
</script>
<style lang="less">
.box-cardss{
  height:100%;
  .chartsTable{
    margin-top: 0!important;

    .chart-div{
      position: relative;
    }
    .left-title{
      position: absolute;
      left: 0;
      top: -40px;
      font-size: 1.25rem;
      color: #3e3c3c;
      .title{
        font-size: 18px;
        color: #3e3c3c;
        padding-left:19px;
      }
      p{
        display: inline-block;
        float: left;
      }
      span{
        p{
          display: inline-block;
          float: left;
          color: #2bd9cf;
        }
      }

      hr{
        display: inline-block;
        height: 1.25rem;
        float: left;
        border-left: 1px solid #2bd9cf ;
        margin: 4px 10px 0 10px;
      }
    }
  }
}

</style>
