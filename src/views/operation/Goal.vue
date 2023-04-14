<template>
    <div class="goalAnaysis">
        <div  class="box-card bg-white header">
            <Col>
              <vs-select class="selectExample" autocomplete v-model="goalDate" >
                <vs-select-item  :value="item" :text="item" :key="index" v-for="(item,index) in years" />
              </vs-select>
            </Col>
            <vs-select class="selectExample m-l-20 " autocomplete v-model="activitySelect">
              <vs-select-item :key="index" :value="item.value" :text="item.key"
                v-for="(item,index) in activityList"
              />
            </vs-select>
            <Button size="large" class="m-l-20" type="primary" @click="handleSearch">{{ $t('查询') }}</Button>
            <Button size="large" class="m-l-20" @click="reset">{{ $t('重置') }}</Button>
        </div>
        <!-- 客流量趋势 -->
        <goalCharts
          v-if="isFestivai"
          ref="goalCharts"
          :tableList="tableData"
          :options1="options1"
          :options2="options2"
          :series1="series1"
          :series2="series2"
          style="margin-top:20px"
        >
        </goalCharts>
        <!--客流量趋势 -->
        <goal-enter
          v-if="isChart"
          ref="goalCharts"
          :tableList="tableData"
          :options1="options1"
          :options2="options2"
          :series1="series1"
          :series2="series2"
          :xAxis="xAxis"
          :isEnter='true'
          :titleText="enterTitle"
          style="margin-top:20px"
        >
        </goal-enter>
        <!-- 销售额趋势 -->
        <goal-enter
          v-if="isMarket"
          ref="marketCharts"
          :tableList="marketTableData"
          :options1="marketOptions1"
          :options2="marketOptions2"
          :series1="marketSeries1"
          :series2="marketSeries2"
          :titleText="marketTitle"
          :xAxis="xAxis"
          :isEnter='false'
          :columns='marketTableTitle'
          style="margin-top:20px"
        >
        </goal-enter>
    </div>
</template>

<script>
import { options0, options2 } from '@/libs/chart.js'
import moment from 'moment'
import goalCharts from '@/components/goal/goalCharts.vue'
import goalEnter from '@/components/goal/goalEnter.vue'
import { postEntitysCompare, getSalesTrend } from '@/api/home.js'
import { activityDataList } from '@/api/analysis.js'
import _ from 'lodash'

export default {
  components: {
    goalCharts,
    goalEnter,
  },

  data () {
    return {
      years: [],
      isFestivai: false,
      isChart: false,
      isMarket: false,
      chartHeight: '660px',
      enterListData: '',
      enterTitle: '客流量趋势',
      marketTitle: '销售额总览',
      flow_year_data: '',
      xAxis: [],
      selectType: [
        {
          name: '年份',
          value: 0
        }
      ],
      goalDate: '',
      activityList: [],
      entities: [{
        key: '城市立方',
        value: 15
      }
      ],
      activitySelect: '',
      selectEntity: '',
      targetData: [],
      year: '',
      bzids: [],
      tableData: [],
      issingleEntity: true,
      series1: [],
      series2: [],
      options1: {},
      options2: {},
      // 销售 类型
      marketTableTitle: ['日期',this.$t('fn.SaleUnit',[this.$t('元')]),this.$t('fn.TargetSaleUnit',[this.$t('元')])],
      marketTableData: [],
      marketOptions1: {},
      marketOptions2: {},
      marketSeries1: [],
      marketSeries2: []
    }
  },
  created () {
    this.checkTargetData()
    this.options1 = _.cloneDeep(options0)
    this.marketOptions1 = _.cloneDeep(options0)
    // this.marketOptions1.tooltip.y = {
    //   formatter: function (val) {
    //     console.log(val);
    //     if (val == undefined || val == null || val == '') {
    //       return ''
    //     } else {
    //       return val.toLocaleString() + '元'
    //     }
    //   }
    // }
    this.options2 = _.cloneDeep(options2)
    this.marketOptions2 = _.cloneDeep(options2)
    // this.marketOptions2.tooltip.y = {
    //   formatter: function (val) {
    //     if (val == undefined || val == null || val == '') {
    //       return ''
    //     } else {
    //       return val.toLocaleString() + '元'
    //     }
    //   }
    // }
  },
  watch: {
    '$store.state.home.headerAction' () {
      this.reset()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'Goal') {
        this.shoppingList()
      }
    },
    goalDate () {
      this.shoppingList()
    }
  },
  mounted () {
    this.goalDate = moment(new Date()).year()
    this.shoppingList()
  },
  activated () {
    this.isChart = false
    this.isMarket = false
    this.shoppingInfoData()
  },
  methods: {
    reset () {
      this.goalDate = moment(new Date()).year()
      this.activitySelect = this.activityList[0].value
    },
    shoppingList () {
      this.isChart = false
      this.isMarket = false
      var bussinessTree = this.$store.state.home.bussinessTree
      this.entities = []
      let propertyId = this.$store.state.home.headerAction
      bussinessTree.forEach(m => {
        if (m.property_id == propertyId) {
          var data = {}
          data.key = m.name
          data.value = m.id
          data.property_id = m.property_id
          this.entities.push(data)
        }
      })
      this.shoppingInfoData()
    },
    handleShoppingInfoData (data) {
      let bzid = this.entities[0].value
      const property = data.find(a => {
        return a.property_id === this.$store.state.home.headerAction
      })
      this.years = property.goal_sale.map(a => {
        return a.year
      })
      data.map(list => {
        if (list.bzid == bzid) this.flow_year_data = list
      })
      this.activityData()
    },
    shoppingInfoData () {
      const organizationData = this.$store.state.home.organizationData
      this.handleShoppingInfoData(organizationData.property)
    },
    activityData () { // 选择列表
      var that = this
      let propertyId = this.$store.state.home.headerAction
      activityDataList({ date: that.goalDate, property_id: propertyId }).then(res => {
        that.activityList = []
        var obj = {}
        obj.value = '1'
        obj.key = this.$t('客流量趋势')
        obj.time = `${this.goalDate}-01-01` + ',' + `${this.goalDate}-12-31`
        obj.action = true
        that.activityList.push(obj)
        var data = res.data.data
        data.map(function (d) {
          var list = {}
          list.value = d.id
          list.key = d.name
          list.time = d.begin + ',' + d.end
          list.enter = d.target_enter&&d.target_enter.split(',')
          list.action = false
          that.activityList.push(list)
        })
        that.activitySelect = that.activityList[0].value
        that.handleSearch()
      }).catch(err => {
        console.log(err)
      })
    },
    timeList () {
      let arr = []
      let year = moment().year()
      let i = -1
      while (++i < 1) {
        arr.push({
          key: year,
          value: year
        })
        year--
      }
      return arr
    },
    handleSearch () { // 查询
      var year = this.goalDate
      if (typeof (year) !== 'number') {
        year = moment(year).format('YYYY')
      }
      var that = this
      if (!year) {
        this.$alert({ content:this.$t('选择年份') })
        return
      }
      if (this.flow_year_data.goal_flow) {
        if (this.flow_year_data.goal_flow[0].flow_year) {
          this.year = year
          var data = _.find(that.activityList, function (o) { return o.value == that.activitySelect })
          var range = data.time
          let date1 = moment(range.split(',')[0])
          let date2 = moment(range.split(',')[1])
          var innerRange = Math.abs(date2.diff(date1, 'day')) < 60 ? '1day' : '1month'
          this.getData(range, this.entities[0].value, innerRange)
          this.marketData(year, this.entities[0].property_id)
        } else {
          this.$alert({ content:this.$t('无目标数据') })
        }
      }
    },
    getData (range, id, innerRange) { // 客流
      var that = this
      postEntitysCompare({
        type: 'enter',
        range: range,
        bzid: id,
        innerRange: innerRange
      }).then(res => {
        that.handleRes(res.data.data)
      }).catch(err => {
        console.log(err)
      })
    },
    handleRes (data, bzid) {
      let goal_flow = _.cloneDeep(this.flow_year_data.goal_flow)
      let dataList = _.find(goal_flow, ['year', this.goalDate])
      let that = this
      let compares = []
      data.forEach(e => { compares.push(e.compares) })
      let zipCompares = _.zip(...compares)
      let reallyValue = zipCompares[0].map(e => e.number)
      let xAxis = []
      if (zipCompares[0]) zipCompares[0].map(e => e.number)
      let tableData = []
      var goalNumber
      if (dataList.is_year == 'year') {
        goalNumber = Number(dataList.flow_year)
      } else {
        var arr = []
        dataList.detail.months.map(function (e) {
          _.forIn(e, function (v, k) {
            arr.push(v)
          })
        })
        goalNumber = Number(_.sum(arr))
      }

      this.issingleEntity = true
      let i = 1
      let addUpArr = []
      var goal = []
      var sele = _.find(this.activityList, function (o) { return o.value == that.activitySelect })
      that.isMarket = sele.action
      if (that.activitySelect != '1') {
        that.isChart = false
        that.isFestivai = true
      } else {
        that.isChart = true
        that.isFestivai = false
      }
      if (sele.action == true) { // 年份
        while (reallyValue.length < 12) { reallyValue.push(null) }
        addUpArr = this.cumsumArr(reallyValue)
        while (i < 13) {
          if (i < 10) {
            xAxis.push(`${this.year}-0${i}`)// 横坐标为12月份
          } else {
            xAxis.push(`${this.year}-${i}`)// 横坐标为12月份
          }
          goal.push(goalNumber)
          i++
        }
      } else {
        var goalData = sele.enter
        data.map(function (value, index) {
          var time = moment(value.begin).format('YYYY-MM-DD')
          xAxis.push(time)
          // goal = goal.concat(goalData)
          if(goalData.length>1){
            goal.push(goalData[index])
          }else {
            goal.push(goalData[0])
          }
        })
        addUpArr = this.cumsumArr(reallyValue)
      }
      // 线
      this.series1 = [
        { name: this.$t('客流量'), data: addUpArr },
        { name: this.$t('目标客流量'), data: goal }
      ]

      this.options1 = _.cloneDeep(options0)
      this.options1.xaxis.categories = xAxis
      var barData1 = []
      var barData2 = []
      if (sele.action == true) {
        dataList.detail.months.map(function (list, index) {
          let obj = {}
          obj.name = xAxis[index]
          barData1.push(reallyValue[index])
          let begin = reallyValue[index] ? (reallyValue[index].toLocaleString() ) : ' '
          obj.begin = begin
          var num

          if (dataList.is_year == 'year') {
            num = (Number(dataList.flow_year) / 12).toFixed(0)
          } else {
            _.forIn(list, function (v, k) {
              num = v
            })
          }
          num == null ? barData2.push(0) : barData2.push(num)
          var end = Number(num).toLocaleString()
          obj.end = end
          tableData.push(obj)
        })
      } else {
        data.forEach(function (list, index) {
          let obj = {}
          obj.name = xAxis[index]
          barData1.push(reallyValue[index])
          let begin = reallyValue[index] ? (reallyValue[index].toLocaleString()  ) : ' '
          obj.begin = begin
          var num;
          if(sele.enter.length>1){
            num = (sele.enter[index] / data.length).toFixed(0)
          }else {
            num = (sele.enter[0] / data.length).toFixed(0)
          }
          
          barData2.push(num)
          var end = Number(num).toLocaleString()
          obj.end = end
          tableData.push(obj)
        })
      }

      // 柱状图
      this.series2 = [
        { name: this.$t('客流量'), data: barData1 },
        { name: this.$t('目标客流量'), data: barData2 }
      ]
      let optionsBar = _.cloneDeep(options2)
      optionsBar.xaxis.categories = xAxis
      this.xAxis = xAxis
        if (xAxis.length < 2) {
            optionsBar.plotOptions.bar.columnWidth = '10%'
        } else if (xAxis.length < 5) {
            optionsBar.plotOptions.bar.columnWidth = '55%'
        }else if (xAxis.length < 10) {
            optionsBar.plotOptions.bar.columnWidth = '55%'
        }else if (xAxis.length < 15) {
            optionsBar.plotOptions.bar.columnWidth = '65%'
        } else {
            optionsBar.plotOptions.bar.columnWidth = '80%'
        }
      this.options2 = optionsBar
      this.tableData = tableData
    },
    // 数组累加
    cumsumArr (arr) {
      let tml = []
      arr.forEach((e, index) => {
        if (e === undefined || e === 0 || e === null) tml.push(0)
        else tml.push(_.sumBy(_.take(arr, index + 1)))
      })
      return tml
    },
    // 从store 获取  数据 类型
    checkTargetData () {
      if (!this.$store.state.home.allTargetData.length) this.targetDataReq()
      else this.targetData = _.cloneDeep(this.$store.state.home.allTargetData)
    },
    marketData (time, bzid) { // 销售
      let rangeStart = `${time}-01-01`
      let rangeEnd = `${time}-12-31`
      getSalesTrend({
        time1: rangeStart + ',' + rangeEnd, type: 'SaleAmount', property_id: this.entities[0].property_id, range: 'Month'
      })
        .then(res => {
          var dataList = []
          // this.$vs.loading.close()
          // this.$store.commit('loadingState', false)
          _.forIn(res.data.data, function (value, key) {
            _.forIn(value, function (v, k) {
              var obj = {}
              obj.begin = k
              obj.end = k
              obj.compares = []
              var list = {}
              list.number = Number(v)
              obj.compares.push(list)
              dataList.push(obj)
            })
          })
          this.markerListData(dataList, bzid)
        }).catch(err => {
          console.log(err)
        })
    },
    markerListData (data, bzid) {
        const index = this.years.findIndex(o=>{
            return o === this.goalDate
        })
        let dataList = this.flow_year_data.goal_sale[index]
      let compares = []
      data.forEach(e => { compares.push(e.compares) })
      let zipCompares = _.zip(...compares)
      let reallyValue = zipCompares[0].map(e => e.number)
      let xAxis = []
      while (reallyValue.length !== 12) { reallyValue.push(null) }
      let tableData = []
      var goalNumber
      if (dataList.is_year == 'year') {
        goalNumber = Number(dataList.sale_year)
      } else {
        var arr = []
        dataList.detail.months.map(function (e) {
          _.forIn(e, function (v, k) {
            arr.push(v)
          })
        })
        goalNumber = Number(_.sum(arr))
      }

      if (bzid) { // 单个实体
        this.issingleEntity = true
        let i = 1
        let addUpArr = this.cumsumArr(reallyValue)
        var goal = []
        while (i < 13) { // 横坐标为12月份
          if (i < 10) {
            xAxis.push(`${this.year}-0${i}`)
          } else {
            xAxis.push(`${this.year}-${i}`)
          }
          goal.push(goalNumber)
          i++
        }
        // 线
        this.marketSeries1 = [
          { name: this.$t('销售额'), data: addUpArr },
          { name: this.$t('目标销售额'), data: goal }
        ]
        this.marketOptions1 = _.cloneDeep(options0)
        this.marketOptions1.xaxis.categories = xAxis
        this.marketOptions1.tooltip.y = {
          formatter:  (val)=> {
            if (val == undefined || val == null || val == '') {
              return ''
            } else {
              return val.toLocaleString() +this.$t('元')
            }
          }
        }
        var barData1 = []
        var barData2 = []
        dataList.detail.months.map(function (list, index) {
          let obj = {}
          obj.name = xAxis[index]
          barData1.push(reallyValue[index])
          let begin = reallyValue[index] ? (reallyValue[index].toLocaleString() ) : ' '
          obj.begin = begin
          var num
          if (dataList.is_year == 'year') {
            num = (Number(dataList.sale_year) / 12).toFixed(0)
          } else {
            _.forIn(list, function (v, k) {
              num = v
            })
          }
          num == null ? barData2.push(0) : barData2.push(num)
          var end = Number(num).toLocaleString()
          obj.end = end
          tableData.push(obj)
        })
        // 柱状图
        this.marketSeries2 = [
          { name: this.$t('销售额'), data: barData1 },
          { name: this.$t('目标销售额'), data: barData2 }
        ]
        this.marketOptions2 = _.cloneDeep(options2)
        this.marketOptions2.xaxis.categories = xAxis
        this.marketOptions2.tooltip.y = {
          formatter: (val)=> {
            if (val == undefined || val == null || val == '') {
              return ''
            } else {
              return val.toLocaleString() +this.$t('元')
            }
          }
        }
        this.marketTableData = tableData
      }
    }
  }
}
</script>

<style scope lang="scss">
.goal-date{
  margin-right: 20px;
  .ivu-input{
    height: 43px;
    font-size: 14px;
    border: 1px solid rgba(0, 0, 0, .2);
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }
}
.goalAnaysis{
    .header{
        display: flex;
        align-items: center;
        padding: 20px;
    }
    .more{
        width:300px;
    }
    .tab-con .tabitem:nth-child(3){
      .vx-card{
        margin-top:30px
      }
    }
}

</style>
