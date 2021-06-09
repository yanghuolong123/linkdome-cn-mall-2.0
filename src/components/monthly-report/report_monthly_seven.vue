<template>
  <div class="seventhBox">
    <page-header ></page-header>
    <div class>
      <sub-title :companyName="propertyName" :typeName="firstSubTitle"></sub-title>
      <spline :isSpline="false" ref="spline"></spline>
      <sub-title :typeName="secondSubTitle" ></sub-title>
       <report-table :data="tableData" :columns="columns"></report-table>
    </div>
    <div class="page_number">第{{pageNumber}}页</div>
    <page-floor></page-floor>
  </div>
</template>

<script>
import pageHeader from '_c/report/report_day_list_header'
import pageFloor from '_c/report/report_day_list_floor'
import subTitle from '_c/report/pageTitle.vue'
import { spline } from '_c/charts'
// import reportTable from './report_table'
import reportTable from '../week-report/newReportTable.vue'
import _ from 'lodash'
export default {
  name: 'monthlySeven',
  components: {
    pageHeader,
    pageFloor,
    subTitle,
    spline,
    reportTable
  },
  props: {
    res: {
      type: Object,
      default: () => ({})
    },
    holiyDayInfo: {
      type: Object,
      default: () => ({})
    },
    pageNumber: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {

      coName: '城市立方',
      firstSubTitle: '节假日活动客流分析',
      secondSubTitle: '详细数据',
      series: [],
      tableData: [],
      columns: [
        {
          name: '节假日活动名称',
          key: 'name'
        },
        {
          name: '客流量',
          key: 'enter'
        },
        {
          name: '客流峰值',
          key: 'highest'
        },
        {
          name: '平均客流',
          key: 'avg'
        }
      ]
    }
  },
  computed: {
    propertyName () {
      return this.$store.state.home.headerData.text
    }
  },
  watch: {
    res: {
      deep: true,
      immediate: true,
      handler (val, oldVal) {
        if (_.isEmpty(this.holiyDayInfo) && _.isEmpty(val)) return
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
        let date = this.holiyDayInfo.duration === 1 ? e.begin.split(' ')[1].slice(0, 5) : e.begin.split(' ')[0]// date format :xx月xx日
        xAxis.push(date)
        seriesData.push(e.enter)
      })
      series.push({
        name: `${this.holiyDayInfo.name}客流量`,
        data: seriesData
      })
      let maxTime = xAxis[seriesData.indexOf(_.max(seriesData))]
      let formatMaxtime = this.holiyDayInfo.duration === 1 ? `${maxTime}-${maxTime.replace(/00$/, '59')}` : maxTime
      tableData.push({
        name: this.holiyDayInfo.name, // 节日姓名
        enter: `${_.sum(seriesData).toLocaleString()}人`, // 总客流
        highest: `${_.max(seriesData).toLocaleString()}人   ${formatMaxtime}`, // 客流峰值
        avg: `${_.floor(_.mean(seriesData)).toLocaleString()}人/${this.holiyDayInfo.duration === 1 ? '小时' : '天'}`// 平均客流
      })
      this.tableData = tableData
      this.$nextTick(() => {
        this.$refs.spline.initCharts({ xAxis, value: series })
      })
    }
  }
}
</script>
<style lang='stylus' scope>
  .page_number{
    font-size: 20px;
    color: #a0a7ad;
    position: absolute;
    right: 25px;
    bottom: 100px;
  }
.seventhBox
    width 1200px
    height 1682px
    overflow hidden
    padding 100px 50px
    display inline-block
    position relative
    float left
    background-color #fff
    .tablebox
        margin-top 10px
        .ivu-table th
            background-color #4472c4
            color #fff
        .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td
            background-color #cfd5ea
</style>
