
<template>
    <div class="reportOneText">
        <div class="report-list">
            <report-header></report-header>
            <report-title :title="title"></report-title>
            <report-table :listTitle='listTitle' :tableColumn='tableColumn' :tableData='tableData' ></report-table>
            <report-flooter size='5'></report-flooter>
        </div>
        <img :src="logo" class="report-bg" alt="">
    </div>
</template>
<script>
import reportHeader from '@/components/report-public/report_header'
import reportTitle from '@/components/report-public/report_title'
import reportChart from '@/components/report-public/report_chart'
import reportFlooter from '@/components/report-public/report_flooter'
import reportTable from '@/components/report-public/report_table'
export default {
  name: 'report-week-one',
  props: {
    title: {
      type: String
    },
    tableColumn: {
      type: Array
    },
    tableData: {
      type: Array
    }
  },
  components: {
    reportHeader,
    reportTitle,
    reportChart,
    reportFlooter,
    reportTable
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
      return {
        name: '本周出入口客流TOP10',
        text: '客流周期:' + data.year + '年第' + data.period + '周'
      }
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
