<template>
    <div class="reportOneText" style="width: 1200px;height:1682px;">
        <div class="report-list" style=" padding-bottom: 180px;">
            <report-header></report-header>
            <report-title :title='title'></report-title>
            <div class="name" v-if="storeName">{{storeName}}</div>
            <div class="report-chart" style=" padding: 0 80px;
                margin: 30px 0 30px 0;">
                <title-name :listTitle='listTitle'></title-name>
                <Row>
                  <Col :span="24">
                    <div class="report-chart-text" style="
                        border: 4px dashed #4edbda;
                        border-radius: 8px;
                        margin-top: 12px;"
                        v-if="ifOneCharts" :style="{height:chartHeight+'px'}"
                    >
                      <vue-highcharts
                      style="width: 100%;height:100%;"
                      :options="dataList.option"
                      ></vue-highcharts>
                    </div>
                   </Col>
                </Row>
            
            </div>
            <report-remark v-if="isRemark" :dataList ='dataList.remarkData' ></report-remark>
            <report-flooter :size='page'></report-flooter>
        </div>
        <img :src="flooterBg" class="report-bg" alt="">
    </div>
</template>
<script>
import reportHeader from '@/components/report-public/report_header'
import reportTitle from '@/components/report-public/report_title'
import reportRemark from '@/components/report-public/report_remark'
import reportFlooter from '@/components/report-public/report_flooter'

import titleName from '@/components/report-public/report_title_name'
import VueHighcharts from 'vue2-highcharts'
import Bus from '@/libs/bus.js'

export default {
  name: 'report-chart',
  props: {
    title: {
      type: String
    },
    dataList: {
      type: Object
    },
    page: {
      type: String
    },
    listTitle: {
      type: Object
    },
    isRemark: {
      type: Boolean,
      default: true
    },
    chartHeight:{
       type:Number,
       default:0
    },
    storeName: {
      type: String,
      default: ''
    }
  },
  components: {
    reportHeader,
    reportTitle,
    reportRemark,
    reportFlooter,
    titleName,
    VueHighcharts,
  },
  data () {
    return {
      flooterBg: require('@/assets/images/fixation_img/bg/list_bg.png'),
      ifOneCharts: true,
    }
  },
  watch:{
    clickData(){
      this.chartDataList()
    }
  },
  mounted () {
     Bus.$on('chartData', () => {
      this.chartDataList()
    })
  },
  methods: {
    chartDataList () {
      this.ifOneCharts = false
      this.$nextTick(() => {
        this.ifOneCharts = true
      })
    },
  
  },
  computed: {
  },
  created () {
  
  },
 
}
</script>
<style scoped lang="less">
.report-chart {
        width: 100%;
        .report-chart-text{
            width: 100%;
            height: auto;
        }
    }
    .reportOneText {
        display: inline-block;
        overflow: hidden;
        background-color: #eff5fa;
        position: relative;
        .report-list{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          .name {
            padding: 20Px 80Px 0 80Px;
            font-size: 50Px;
            font-weight: bold;
          }
        }
        .report-bg{
            display: block;
            width: 100%;
            height: auto;
            position: absolute;
            left: 0;
            bottom: 0;
        }
    }
</style>
