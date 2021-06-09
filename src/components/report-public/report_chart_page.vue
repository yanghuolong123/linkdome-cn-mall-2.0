
<template>
    <div class="reportOneText">
        <div class="report-list">
            <report-header></report-header>
            <report-title :title='title'></report-title>
            <report-chart :chartData=dataList :listTitle='listTitle'></report-chart>
            <report-remark></report-remark>
            <report-flooter :size='pageNumber'></report-flooter>
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
      type: Array
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
    listTitle () {
      let data = this.$store.state.report.reportHeader
      let obj = {
        name: '',
        text: '客流时间:' + data.year + '.' + data.time
      }
      this.title === '店铺客流' ? obj.name = '本周店铺客流TOP10' : this.title === '出入口客流' ? obj.name = '本周出入口客流总览' : obj.name = '本周客流趋势'

      return obj
    },
    pageNumber () {
      return this.title === '店铺客流' ? 5 : this.title === '出入口客流' ? 4 : 2
    }
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
