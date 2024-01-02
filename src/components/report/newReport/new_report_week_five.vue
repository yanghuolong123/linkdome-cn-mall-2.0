
<template>
    <div class="reportOneText" style=" width: 1200px;
        height: 1682px;">
        <div class="report-list" style=" padding-bottom: 110px;">
            <report-header></report-header>
            <report-title :title="title"></report-title>
            <report-table width='25%' :listTitle='listTitle' :tableColumn='tableColumn' :tableData='tableData' ></report-table>
            <report-flooter :size='page'></report-flooter>
        </div>
        <img :src="logo" class="report-bg" alt="">
    </div>
</template>
<script>
import reportHeader from '@/components/report-public/report_header'
import reportTitle from '@/components/report-public/report_title'
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
      page: {
          type: String
      },
    tableData: {
      type: Array
    },
    listTitle: {
      type: Object
    },
  },
  components: {
    reportHeader,
    reportTitle,
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
  created () {},
  mounted () {}
}
</script>
<style scoped lang="less">
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
