
<template>
    <div class="reportOneText">
        <div class="report-list">
            <report-header></report-header>
            <report-title :title='title'></report-title>
            <div class="chart-center" >
                <title-name :listTitle='listTitle'></title-name>
                <Row :gutter="20" >
                    <Col :span="item.span" :key="index" v-for="(item,index) in dataList">
                        <div class="chart-list" :style="{height:item.height+'px'}" v-if="isChart" >
                            <vue-highcharts
                            style="width: 100%;height:100%;"
                            :options="item.option"
                            ></vue-highcharts>
                        </div>
                    </Col>
                </Row>

            </div>

            <report-flooter :size='page'></report-flooter>
        </div>
        <img :src="logo" class="report-bg" alt="">
    </div>
</template>
<script>
import reportHeader from '@/components/report-public/report_header'
import reportTitle from '@/components/report-public/report_title'
import titleName from '@/components/report-public/report_title_name'
import reportFlooter from '@/components/report-public/report_flooter'
import VueHighcharts from 'vue2-highcharts'
import Bus from '@/libs/bus.js'
import _ from 'lodash'
export default {
  name: 'report-month-chart-multi',
  props: {
    title: {
      type: String
    },
    dataList: {
      type: Array
    },
    page: {
      type: String
    },
    listTitle: {
      type: Object
    },
    stacking: {
      type: String,
      default: null
    }
  },
  components: {
    reportHeader,
    reportTitle,
    titleName,
    reportFlooter,
    VueHighcharts
  },
  data () {
    return {
      isChart: true,
      logo: require('@/assets/images/fixation_img/bg/list_bg.png')
    }
  },
  created () {
    Bus.$on('chartData', () => {
      this.chartDataList()
    })
  },
  mounted () {
  },
  methods: {
    chartDataList () {
      this.isChart = false
      this.$nextTick(() => {
        this.isChart = true
      })
    }
  },
  computed: {
  }

}
</script>
<style lang="less">
  .highcharts-axis-labels{
    span{
      display: inline-block;
      max-width: 80px;
      overflow: hidden;
      text-overflow:ellipsis!important;
      white-space: nowrap;
    }
  }
</style>
<style scoped lang="less">
    .reportOneText {
        display: inline-block;
        width: 1200px;
        height: 1682px;
        overflow: hidden;
        background-color: #eff5fa;
        position: relative;
        .report-list{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            padding-bottom: 150px;
            .chart-center{
                padding:  0 80px;
                .chart-list{
                    margin-top: 12px;
                    border: 4px dashed #4edbda;
                    background-color: #fff;
                    border-radius:8px;
                }
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
