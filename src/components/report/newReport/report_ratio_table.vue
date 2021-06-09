
<template>
    <div class="reportOneText">
        <div class="report-list">
            <report-header></report-header>
            <report-title :title="title"></report-title>
            <report-ratio
            :listTitle='listTitle'
            :tableColumn='tableColumn'
            :tableData ='tableData'>
            </report-ratio>
            <!-- <report-remark></report-remark> -->
            <report-flooter :size='page'></report-flooter>
        </div>
        <img :src="flooterBg" class="report-bg" alt="">
    </div>
</template>
<script>
import reportHeader from '@/components/report-public/report_header'
import reportTitle from '@/components/report-public/report_title'
import reportRatio from '@/components/report-public/report_table_ratio'
// import reportRemark from '@/components/report-public/report_remark'
import reportFlooter from '@/components/report-public/report_flooter'
export default {
  name: 'report-table-ratio',
  props: {
    title: {
      type: String
    },
    page: {
      type: String
    },
    listTitle: {
      type: Object
    },
    tableColumn: {
      type: Object
    },
    tableData: {
      type: Array,
      defaults: []
    }
  },
  components: {
    reportHeader,
    reportTitle,
    reportRatio,
    // reportRemark,
    reportFlooter
  },
  data () {
    return {
      flooterBg: require('@/assets/images/fixation_img/bg/list_bg.png')
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
