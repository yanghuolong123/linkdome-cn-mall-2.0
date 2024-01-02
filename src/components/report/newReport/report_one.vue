<template>
    <div class="reportOneText" style=" width: 1200px;height: 1682px;">
        <div class="report-list" style="padding-bottom: 110px;">
            <report-header></report-header>
            <report-title :title="title"></report-title>
            <report-enter :data='enterData[0]' :listTitle='listTitle[0]'></report-enter>
            <report-enter :data='enterData[1]' :listTitle='listTitle[1]'></report-enter>
            <report-enter v-if="reportType === 'month'&&showLastYearData " :data='enterData[2]'
                          :listTitle='listTitle[2]'></report-enter>
            <report-remark v-if="reportType !== 'month'" :dataList='enterData[2]'></report-remark>
            <report-flooter size='1'></report-flooter>
        </div>
        <img :src="flooterBg" class="report-bg" alt="">

    </div>
</template>
<script>
  import reportHeader from '@/components/report-public/report_header'
  import reportTitle from '@/components/report-public/report_title'
  import reportEnter from '@/components/report-public/report_enter'
  import reportRemark from '@/components/report-public/report_remark'
  import reportFlooter from '@/components/report-public/report_flooter'
  import { mapState } from 'vuex'

  export default {
    name: 'report-week-one',
    props: {
      title: {
        type: String
      },
      listTitle: {
        type: Array
      },
      enterData: {
        type: Array
      },
      showLastYearData: {
        type: Boolean,
      }
    },
    components: {
      reportHeader,
      reportTitle,
      reportEnter,
      reportRemark,
      reportFlooter
    },
    data () {
      return {
        flooterBg: require('@/assets/images/fixation_img/bg/list_bg.png')

      }
    },
    methods: {},
    computed: {
      ...mapState({
        reportType: (state) => state.report.reportHeaderType,

      })

    },
    created () {
    },
    mounted () {
    }
  }
</script>
<style scoped lang="less">
    .reportOneText {
        display: inline-block;

        overflow: hidden;
        background-color: #eff5fa;
        position: relative;

        .report-list {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }

        .report-bg {
            display: block;
            width: 100%;
            height: auto;
            position: absolute;
            left: 0;
            bottom: 0;
        }
    }
</style>
