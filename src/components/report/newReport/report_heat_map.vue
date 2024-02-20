<template>
    <div class="reportOneText" style="width: 1200px;height:1682px;">
        <div class="report-list" style=" padding-bottom: 110px;">
            <report-header></report-header>
            <report-title :title='title'></report-title>
              <div class="report-chart" style=" padding: 0 80px;
                  margin: 50px 0 30px 0;">
                  <title-name :listTitle='listTitle'></title-name>
                  <div class="report-heat-map"
                  style=" border: 4px dashed #4edbda;
                      border-radius: 8px;
                      margin-top: 12px;"

                  >
                      <div :id="'passengerFlowDistribution'+page" style="width: 100%" :style="{height:chartHeight+'px'}"></div>
                  </div>
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


import ChartOption from '@/views/ui-elements/card/analyticsData'
import titleName from '@/components/report-public/report_title_name'
import Bus from '@/libs/bus.js'
let flowDistributionCharts = null
export default {
  name: 'report-week-one',
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
  },
  components: {
    reportHeader,
    reportTitle,
    reportRemark,
	  reportFlooter,
    titleName,
  },
  data () {
    return {
      flooterBg: require('@/assets/images/fixation_img/bg/list_bg.png')
    }
  },
  watch:{
    clickData(){
        this.initFlowDstrbtCharts(this.dataList.data,this.dataList.maxAvg,this.dataList.workingtime)
    }
  },
  mounted () {
    Bus.$on('chartData', () => {
        this.initFlowDstrbtCharts(this.dataList.data,this.dataList.maxAvg,this.dataList.workingtime)
    })
  },
  methods: {
     initFlowDstrbtCharts (data = [], maxAvg = 100, workingtime = []) {
       console.log(data)
       let dome = document.getElementById(`${'passengerFlowDistribution'+this.page}`)
       if(dome){
          flowDistributionCharts = echarts.init(dome)
          data = data.map((item) => {
              if(item)  return [item[1], item[0], item[2] || '-']
          })
          let option = _.cloneDeep(ChartOption.timeDistributeOption)
          option.visualMap.max = maxAvg
          option.series[0].data = data
          option.xAxis.data = workingtime
         option.yAxis.data =  [ this.$t('Sun'),  this.$t('Sat'), this.$t( 'Fri'),
           this.$t('Thr'),  this.$t('Wed'),  this.$t('Tue'),  this.$t('Mon')],
           flowDistributionCharts.setOption(option)
          flowDistributionCharts.resize()
       }

    },
  },
  computed: {
  },

  created () {},

}
</script>
<style scoped lang="less">
  .report-chart {
        width: 100%;
        .report-heat-map{
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
