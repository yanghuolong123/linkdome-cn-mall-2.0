<template>
  <div class="storeCharts">
    <div class="chartss">
      <i-tabs class="chartsTable"
              v-model="current"
              :style="{height:allHeight}">
        <tab-item :icon="icon1"
                  :titles="title1">

          <div style="display:flex;"
               v-if="showCharts">
            <!-- <vue-apex-charts  v-if="showCharts" style="width:100%;" type="bar" height=300 :options="chartOptionss" :series="seriess" /> -->
            <vue-apex-charts v-bind:class="{alls:isTime}"
                             :type="pieType"
                             :height="height"
                             :options="chartOptions"
                             :series="series" />
            <div class="storedatass"
                 style="width:50%"
                 v-if="!isTime">
              <div class="datas"
                   v-for="(item,index) in labels"
                   :key="index">
                <div class="circle"
                     :style="{backgroundColor:colors[index]}"></div>
                <span class="names">&nbsp;{{index < 4 ? $t('fn.times',[$t(labels[index])]) : $t(labels[index])}}&nbsp;</span>
                <span class="number">{{series[index]?Number(series[index]).toLocaleString():''}}</span>
              </div>
              <div class="noData"
                   v-if="isNoData"></div>
            </div>
          </div>

        </tab-item>
        <tab-item :icon="icon2"
                  :titles="title2">
          <i-table :columns="columns"
                   :data="tableList"
                   maxHeight='309px'
          ></i-table>
        </tab-item>
      </i-tabs>
    </div>

  </div>
</template>

<script>
import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
import iTable from '@/views/footfall-analytics/components/iTable.vue'
import iTabs from '_c/I-Tabs/Itabs.vue'
export default {
  components: {
    VueApexCharts,
    tabItem,
    iTabs,
    iTable
  },
  props: {
    series: {
      type: Array,
      default: () => [44, 55, 13, 43, 20]
    },
    isTime: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '276px'
    },
    allHeight: {
      type: String,
      default: '365px'
    },
    icon1: {
      type: String,
      default: 'fenxi'
    },
    icon2: {
      type: String,
      default: 'biaoge-copy'
    },
    title1: {
      type: String,
      default: '到店次数占比'
    },
    title2: {
      type: String,
      default: '详细数据'
    },
    pieType: {
      type: String,
      default: 'pie'
    },
    chartOptions: {
      type: Object,
      default: {}
    },
    showCharts: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    tableList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
  },
  data () {
    return {
      isNoData: false,
      current: 0,
      colors: ['#E85A5A', '#00A0E9', '#2BD9CF', '#F9A143', '#857AEF'],
      labels: ['1', '2', '3', '4', '5次及以上']
    }
  },
  methods: {
    isShowChart () {
      if (_.sum(this.series) === 0) {
        this.isNoData = true
      } else {
        this.isNoData = false
      }
    }
  },
  mounted () {
    this.isShowChart()
  },
  updated () {
    this.isShowChart()
  }
}
</script>

<style scope lang="scss">
.storeCharts {
  .alls {
    width: 100% !important;
  }
  .chartsTable {
    background-color: #fff;
    border-radius: 6px;
    margin-bottom:20px;
  }
  .storedatass {
    position: relative;
    bottom: -7px;
    left: 0%;
    width: 100%;
    padding-top: 8%;
    font-size: 16px;
    .datas {
      padding-left: 16%;
      height: 30px;
      display: flex;
      line-height: 10px;
      .circle {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 6px;
        margin-left: 14px;
      }
      .icons {
        margin-right: 2%;
      }
      .names {
      }
      .number {
        right: 20%;
        position: absolute;
      }
    }
    .noData {
      position: absolute;
      top: 3%;
      left: -69%;
      width: 228px;
      height: 228px;
      background-color: rgba(235, 235, 235, 0.85);
      border-radius: 50%;
    }
  }
}

</style>
