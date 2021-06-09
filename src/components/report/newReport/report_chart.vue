
<template>
    <div class="reportOneText">
        <div class="report-list">
            <report-header></report-header>
            <report-title :title='title'></report-title>
            <report-chart :chartData='dataList' :stacking='stacking' :listTitle='listTitle'></report-chart>
            <report-remark v-if="isRemark" :dataList ='dataList.remarkData' ></report-remark>
            <report-flooter :size='page'></report-flooter>
        </div>
        <img :src="logo" class="report-bg" alt="">
    </div>
</template>
<script>
import reportHeader from '@/components/report-public/report_header'
import reportTitle from '@/components/report-public/report_title'
import reportChart from '@/components/report-public/report_chart'
import reportRemark from '@/components/report-public/report_remark'
import reportFlooter from '@/components/report-public/report_flooter'
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
    stacking: {
      type: String,
      default: null
    },
    isRemark: {
      type: Boolean,
      default: true
    }
  },
  components: {
    reportHeader,
    reportTitle,
    reportChart,
    reportRemark,
    reportFlooter
  },
  data () {
    return {
      logo: require('@/assets/images/fixation_img/bg/list_bg.png')
    }
  },
  methods: {
  },
  computed: {
  },
  created () {},
  mounted () {}
}
</script>
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
            z-index: 10;
            padding-bottom: 180px;
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
