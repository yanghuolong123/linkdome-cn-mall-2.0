<template>
  <div class="bg-white box-card box-cardss" style=" position: relative;">
    <div class="enterType">
      <div class="enterYear"
        v-for="(item,index) in enterTypeList"
        :key="index"
        v-bind:class="{selectAction:typeAction==index}"
        v-on:click='enterTypeClick(index)'>
        {{ $t(item) }}
      </div>
      <div class="lineBox"></div>
    </div>
      <ul class="enterIcon">
        <li :key="index" v-for="(icon,index) in iconList" v-on:click="iconClick(index)">
          <icons
          :title="iconTitle[icon.type]"
          :type="icon.type"
          :size="20"
          :color="iconIndex === index ? iconColor :'#9D9D9DFF'"
          ></icons>
        </li>
      </ul>
    <i-tabs  class="chartsTable" v-model="current">
      <tab-item  class="chart-div" v-if="typeAction==0">
        <div class="left-title">
          <p class="title">{{ $t(titleText) }}</p>
        </div>
        <vue-apex-charts type="line" height="530" :options="options1" :series="series1" class="ape-chart"></vue-apex-charts>
      </tab-item>
      <tab-item  class="chart-div" v-if="typeAction==1">
        <div class="left-title">
          <p class="title">{{ $t(titleText) }}</p>
        </div>
        <gola-enter-analysis :xAxis='options2.xaxis.categories' :options="options2" :series='series2'></gola-enter-analysis>
      </tab-item>
      <tab-item  class="chart-div">
        <div class="left-title">
          <p class="title">{{ $t(titleText) }}</p>
        </div>
        <TableMultipleSelected style="height:530px" class="table-chart" :tableName="columns" :tableList="tableList"></TableMultipleSelected>
      </tab-item>
    </i-tabs>
  </div>
</template>
<script>

import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import iTabs from '_c/I-Tabs/Itabs.vue'
import i18n from '@/i18n/i18n'

import golaEnterAnalysis from '@/components/goal-achievement/enterAnalysis.vue'
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
    xAxis: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => [i18n.t('Date'), i18n.t('fn.EnterUnit',[i18n.t('personTime')]), i18n.t('fn.TargetEnterUnit',[i18n.t('personTime')])]
    },
    tableList: {
      type: Array,
      default: () => []
    },
    titleText: {
      type: String,
      default: ''
    },
    isEnter: {
      type: Boolean,
      default: true
    }
  },
  components: {
    tabItem,
    VueApexCharts,
    TableMultipleSelected,
    iTabs,
    golaEnterAnalysis
  },
  data () {
    return {
      istab: true,
      current: 0,
      enterTypeList: ['annualTrend', 'monthTrend'],
      typeAction: 0,
      iconIndex: 0,
      iconColor: 'rgb(34, 128, 215)',
      tableText: [],
      iconList: [
        {
          type: 'zhexiantu',
          color: '#9D9D9DFF'
        },
        {
          type: 'biaoge-copy',
          color: '#9D9D9DFF'
        }
      ],
      iconTitle: {
        'zhexiantu': this.$t('lineChart'),
        '62': this.$t('barChart'),
        'biaoge-copy': this.$t('detailDt')
      }
    }
  },
  computed: {
  },
  activated () {
    this.iconIndex = 0
    this.current = 0
  },
  mounted () {
  },
  methods: {
    enterTypeClick (index) {
      this.typeAction = index
      if (index == 0) {
        this.iconList[0].type = 'zhexiantu'
      } else {
        this.iconList[0].type = '62'
      }
    },
    iconClick (index) {
      this.iconIndex = index
      this.current = index
      let title
      if (this.isEnter == true) title = 'enterTrend'
      else title = 'salesOverview'
      index == 1 ? this.titleText = 'detailDt' : this.titleText = title
    }
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
        .ape-chart{
          padding-top: 55px;
        }
        .table-chart{
          overflow-y:scroll;
          margin-top:60px;
        }
    }
    .tab-bar{
      height: 50px;
    }
    .left-title{
      position: absolute;
      left: 0;
      top: -50px;
      font-size: 1.25rem;
      color: #3e3c3c;
      .title{
        font-size: 18px;
        color: #3e3c3c;
        padding-left:22px;
        padding-top:27px;
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
.enterType{
    position: absolute;
    left:0px;
    right: 0px;
    top: 69px;
    height: auto;
    z-index: 1;
    padding: 0 10px;
    box-shadow:0px 3px 2px 0px rgba(166, 168, 169, .3);
    // .lineBox{
    //     position: absolute;
    //     width: 100%;
    //     height: 0px;
    //     left: 0;
    //     background-color:rgb(166, 168, 169);
    //     bottom: 0;
    //     box-shadow:0px 0px 9px 0px rgba(166, 168, 169, .8);
    // }
    .enterYear{
      width: auto;
      height: 36px;
      padding: 0 15px;
      line-height: 36px;
      font-size: 14px;
      float: left;
      color: #666;
      cursor: pointer;
      &:nth-child(1){
        margin-right: 20px;
      }
      // &:hover{
      //     background-color: rgba(0, 160, 233, 0.1)
      // }
    }
    .selectAction{
      // background-color: #00a0e9;
      color: #33b3ed;
      border-bottom: 2px solid #33b3ed;
      &:hover{
        // background-color: #00a0e9
      }
    }
}
.enterIcon{
  position: absolute;
  right: 50px;
  top: 60px;
  z-index: 1;
  li{
    float:left;
    &:nth-child(1){
      margin-right: 10px;
    }
    i{
      cursor: pointer;
    }
  }
}
</style>
