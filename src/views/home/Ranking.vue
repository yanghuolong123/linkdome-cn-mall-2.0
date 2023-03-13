<template>
  <div class="mt-6 ranking-box">
     <div class="box-card bg-white">
        <chart-tabs ref="enterRanking" @tableChage="tableChange" :title="mallTitle" :xAxis="leftXaxis" :series="leftSeries" :type="['bar']" horizonta>
          <export-menu slot="export" @onchange="handleDownload"></export-menu>
        </chart-tabs>
     </div>
     <div class="box-card bg-white">
        <template v-if="chartType ==='bar'">
          <chart-tabs :title="formatTitle"
                      :xAxis="rightXaxis"
                      :series="rightValue"
                      :type="['bar']" horizonta></chart-tabs>
        </template>
        <template v-else>
          <div class= "pieTitle">{{$t('客流占比')}}</div>
          <div class="pieNoData" v-if="isNodata"></div>
          <vue-apex-charts
            ref='pieCharts'
            width='100%'
            height='400'
            type='pie'
            :options="peiOptions"
            :series="pieSeries"
          ></vue-apex-charts>
        </template>
     </div>
  </div>
</template>
<script>
import chartTabs from '_c/common/ChartTabs.vue'
import { getTopmall, postEntitysCompare,exportEx } from '@/api/home'
import { gotInnerRange, formatTableData,downloadEx } from '@/libs/util'
import VueApexCharts from 'vue-apexcharts'
import _ from 'lodash'
import NP from 'number-precision'
import exportMenu from "@/views/operation/components/ExportMenu.vue";

export default {
  name: 'home_ranking',
  components: {
    chartTabs,
    VueApexCharts,
    exportMenu
  },
  props: {
    range: {
      type: String
    },
    propertyId: {
      type: null,
      default: 'company'
    },
    chartType: {
      type: String,
      default: 'bar'
    },
    bzids: {
      type: Array,
      default: () => []
    },
    orderName: {
      type: String,
      default: '商铺'
    }
  },
  data () {
    return {
      charType: 'pie',
      isNodata: false,
      current: 0,
      businessCurrent: 0,
      rightTabCurrent: 0,
      colors: ['#42efe9'],
      leftXaxis: [],
      leftSeries: [],
      rightXaxis: [],
      rightValue: [],
      leftTableData: [],
      rightTableData: [],
      chartHeight: 700,
      ismallMore: false,
      isformatMore: false,
      compareBzids: [],
      isLeftAllzero: false,
      isRightAllzero: false,
      peiOptions: {
        chart: {
          type: 'pie'
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opt) {
            // 判断是否是最后一个数据
            if (opt.seriesIndex == opt.w.globals.seriesPercent.length - 1) {
              let newData = []
              // 所有数据组成新的数据统一保留两位小数进行计算
              opt.w.globals.seriesPercent.map(item => {
                newData.push(Number(item[0].toFixed(2)))
              })
              // 除去数组中最后一个数据外的和保留两位小数
              let newTotal = Number(_.sum(_.initial(newData)).toFixed(2))
              // 计算出最后一个值
              let size = NP.minus(100, newTotal)
              return size + '%'
            } else {
              return val.toFixed(2) + '%'
            }
          }
        },
        labels: [''],
        legend: {
          position: 'left',
          show:false
        },
        tooltip: {
          followCursor: true,
          y: {
            formatter: function (val) {
              return Number(val).toLocaleString()
            }
          }
        }
      },
      pieSeries: [],
      tableList:[]

    }
  },
  activated () {
  },
  watch: {
    range (newval, oldval) {
      if (newval !== oldval) this.topDataReq()
    },
    propertyId (newval, oldval) {
      if (newval !== oldval && this.bzids.length > 1) this.topDataReq()
    },
    mallTitle (newval, oldval) {
      this.$nextTick(() => {
        this.$refs.rankList.updateNav()
      })
    },
    formatTitle (newval, oldval) {
      this.$nextTick(() => {
        this.$refs.bussniessRank.updateNav()
      })
    }
  },
  computed: {
    formatTitle () {
      if (this.isformatMore) return ['业态排行 T O P 10', '业态排行']
      return ['业态排行']
    },
    mallTitle () {
      if (this.ismallMore) return [`${this.orderName}排行 T O P 10`, `${this.orderName}排行`]
      else return [ `${this.orderName}排行` ]
    },
    leftFormatedData () {
      return formatTableData(this.leftTableData, ['enter'])
    },
    rightFormatedData () {
      return formatTableData(this.rightTableData, ['enter'])
    }
  },
  methods: {
    tableChange(val){
      this.tableList = val
    },
    handleDownload(){
      downloadEx(exportEx, this.mallTitle, [this.$refs.enterRanking.tableData.column,this.$refs.enterRanking.tableData.data]);
    },
    topDataReq () {
      let type = 'store'
      if (this.propertyId === 'company' || this.bzids.length === 1 || !this.propertyId) type = 'mall'
      Promise.all([
        getTopmall(this.initParams(type)),
        getTopmall(this.initParams('format'))
      ]).then(res => {
        let leftData = this.handleResData(res[0])
        let rightData = this.handleResData(res[1])
        this.leftXaxis = leftData.xAxis
        this.leftSeries = leftData.series
        this.rightXaxis = rightData.xAxis
        this.rightValue = rightData.series
      }).catch(err => {
        console.log(err)
      })
    },
    initParams (type) {
      let id = null
      if (this.propertyId === 'company' || this.bzids.length === 1 || !this.propertyId) {
        id = 'company'
      } else id = this.propertyId
      let params = {
        entity: type,
        type: 'enter',
        range: this.range,
        id // 这里存在问题：即当有多个购物中心的时候会有 company 这个id,但是当前只有一个购物中心的时候，系统认为这就是一个集团
      }
      return params
    },
    entitysCompareReq (range, bzids,compareType) {
      this.compareBzids = bzids
      let innerRange = gotInnerRange(range)
      let bzidArr = []
      bzids.forEach(e => bzidArr.push(e.id))
      let params = {
        type: 'enter',
        range: range.toString(),
        innerRange,
       
      }
      if(compareType === 'entity'){
        params.bzid = bzidArr.toString()
      }else {
        params.industry_id = bzidArr.toString()
      }
      postEntitysCompare(params).then(res => {
        this.handleCompareRes(res)
      }).catch(err => {
        console.log(err)
      })
    },
    handleResData (res) {
      let data = res.data.data.company ? res.data.data.company : res.data.data
      let sortedData = _.orderBy(data, ['enter'], ['desc'])
      let { xAxis, value, uniqarr } = this.processData(sortedData)
      if (uniqarr.length) sortedData = uniqarr
      return {
        xAxis: [
          {
            name: '实体名称',
            key: 'entity',
            data: xAxis
          }
        ],
        series: [
          {
            name: '客流量',
            data: value,
            key: 'enter'
          }
        ]
      }
    },
    processData (data) {
      let tmlXaxis = []
      let tmlValue = []
      let uniqarr = []
      data.forEach(e => {
        if (e.business_type_id) { // 去重处理
          let hasitem = _.find(uniqarr, o => o.business_type_id === e.business_type_id)
          if (!hasitem) uniqarr.push(e)
          else uniqarr.forEach(item => { if (item.business_type_id === e.business_type_id) item.enter += e.enter })
        } else {
          tmlXaxis.push(e.name)
          tmlValue.push(e.enter)
        }
      })
      if (uniqarr.length) {
        uniqarr.forEach(ele => {
          tmlXaxis.push(ele.name)
          tmlValue.push(ele.enter)
        })
      }
      return {
        xAxis: tmlXaxis,
        value: tmlValue,
        uniqarr
      }
    },
    handleCompareRes (res) {
      let data = res.data.data
      let xAxis = []
      let series = []
      let seriesData = []
      let pieSeriesData = []
      let pieSeries = []
      let tabData = []
      this.compareBzids.forEach((e, index) => {
        let tmlValue = 0
        data.forEach((d, i) => {
          if (d.compares[index]) {
            tmlValue += d.compares[index].number
          }
        })

        pieSeriesData.push({
          name: e.name,
          y: tmlValue
        })
      })
      pieSeries.push({
        size: '50%',
        name: '客流排行',
        data: pieSeriesData.filter(e => e.y > 0)// 业务需求，零不显示
      })
      let sortedData = _.orderBy(pieSeriesData, 'y', 'desc')
      sortedData.forEach(e => {
        xAxis.push(e.name)
        seriesData.push(e.y)
        tabData.push({
          name: e.name,
          enter: e.y
        })
      })
      series = [{
        name: this.$t('客流量'),
        data: seriesData,
        key:'enter',
        showInLegend: false
      }]
      this.leftXaxis = [
        {
          name: '名称',
          key: 'time',
          data: xAxis
        }
      ]
      this.leftSeries = series
      var pieXaxis = []
      var pieYaxis = []
      pieSeriesData.forEach(function (value) {
        pieXaxis.push(value.y)
        pieYaxis.push(value.name)
      })
      this.peiOptions.labels = pieYaxis
      this.peiOptions.legend.show = true;
      _.sum(pieXaxis) == 0 ? this.isNodata = true : this.isNodata = false
      this.pieSeries = pieXaxis
      this.$refs.pieCharts.updateOptions(this.peiOptions)
    }
  }
}
</script>
<style lang="less" scoped>
.pieTitle{
    line-height: 30px;
    font-size: 18px;
    color: #3e3c3c;
    padding: 27px 0 18px 19px;
}
.pieNoData{
  width: 226px;
  height: 226px;
  background-color: rgba(235, 235, 235, .85);
  border-radius: 50%;
  position: absolute;
  left: 40%;
  top: 19%;
  z-index: 10;
}
.ranking-box{
    ::v-deep.apexcharts-legend-series{
        margin-top: 10px!important;
    }
}
</style>
<style lang="stylus" scoped>
.ranking-box
  width 100%
  display grid
  grid-template-columns repeat(2,minmax(0,1fr))
  grid-auto-rows auto
  grid-gap 20px
  // @media (max-width:768px) {
  //   grid-template-columns repeat(1,minmax(0,1fr))
  // }
</style>
