<template>
  <div class="seventhBox">
    <page-header :monthlyType="monthlyType"></page-header>
    <div class>
      <sub-title :companyName="coName" :typeName="firstSubTitle"></sub-title>
      <spline :isSpline="false" ref="spline"></spline>
      <sub-title :typeName="secondSubTitle" ></sub-title>
       <report-table firstName="节假日" ref="table"></report-table>
    </div>

    <page-floor></page-floor>
  </div>
</template>

<script>
import pageHeader from '_c/report/report_day_list_header'
import pageFloor from '_c/report/report_day_list_floor'
import subTitle from '_c/report/pageTitle.vue'
import { spline } from '_c/charts'
import reportTable from './report_table'
import _ from 'lodash'
export default {
  name: 'monthlySeven',
  props: {
    res: {
      type: Object,
      default: () => ({})
    },
    holiyDayInfo: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    pageHeader,
    pageFloor,
    subTitle,
    spline,
    reportTable
  },
  data () {
    return {
      monthlyType: '月',
      coName: '城市立方',
      firstSubTitle: '节假日客流分析',
      secondSubTitle: '详细数据',
      series: [
      ],
      tableData: [

      ]
    }
  },
  watch: {
    res: {
      deep: true,
      immediate: true,
      handler (val, oldVal) {
        if (_.isElement(this.holiyDayInfo) && _.isEmpty(val)) return
        this.handleRes()
      }
    }

  },
  methods: {
    handleRes () {
      const data = this.res.data.data
      if (!data.length) {
        this.$refs.table.list = []
        thie.$refs.spline.initCharts({ xAxis: [], value: [] })
        return
      }
      let xAxis = []
      let seriesData = []
      let tableData = []
      let series = []
      data.forEach(e => {
        let date = e.begin.slice(5, 10).replace('-', '月') + '日'// date format :xx月xx日
        xAxis.push(date)
        seriesData.push(e.enter)
      })
      series.push({
        name: '客流量',
        data: seriesData
      })
      tableData.push({
        name: this.holiyDayInfo.name, // 节日姓名
        enter: _.sum(seriesData), // 总客流
        peak: _.max(seriesData), // 客流峰值
        time: xAxis[_.findIndex(seriesData, _.max(seriesData))], // 峰值日期
        mean: _.mean(seriesData)// 平均客流
      })
      this.$nextTick(() => {
        this.$refs.table.list = tableData
        this.$refs.spline.initCharts({ xAxis, value: series })
      })
    }
  }
}
</script>
<style lang='stylus' scope>
.seventhBox
    display inline-block
    width: 1200px;
    height: 1682px;
    padding: 100px 50px;
    position relative
    background-color #fff
    .tablebox
        margin-top 10px
        .ivu-table th
            background-color #4472c4
            color #fff
        .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td
            background-color #cfd5ea
</style>
