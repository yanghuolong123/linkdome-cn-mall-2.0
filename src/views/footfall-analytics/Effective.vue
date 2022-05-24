<template>
  <div class="effective">
    <flow-selector ref="selectData" @paramsPrepare="paramsPrepare"></flow-selector>
    <div class="chartContent" v-if="isShowChart">
      <div ref="effCahrt" class="eff-box">
        <goalCharts
          class="charts"
          id='tendencyLine'
          title1="去重客流趋势"
          :height1="chartheight"
          :height3="chartheight"
          :options1="trendAndAvg.trendLineOption"
          :options2="trendAndAvg.trendBarOption"
          :series1="trendAndAvg.trendLineSeries"
          :series2="trendAndAvg.trendBarSeries"
          :columns="trendAndAvg.trendColumn"
          :tableList="trendAndAvg.trendTable"
        ></goalCharts>
      </div>
      <div class="cardContent">
        <Cards style="height: 165px;" :isTime="isTime" :isUp="isUp1" :item="effective"></Cards>
        <Cards style="height: 165px;" :isTime="isTime" :isUp="isUp2" :item="repeat" margin="20px 0px"></Cards>
        <Cards style="height: 165px;" :isTime="isTime" :isUp="isUp3" :item="avgTimes"></Cards>
      </div>
      <div class="cir-box"></div>
      <div class="circles">
        <storeChart class="cir" title1="到店次数"
        :columns="chartColumns"
        :tableList="chartTable"
        :showCharts="showCharts"
        :isTime="isTime" :pieType="pieType" :chartOptions="chartOptions" :series="circleSeries"></storeChart>
      </div>
      <div style="width:54%;height:383px;display:inline-block">
        <goalCharts height1="309px" height3="309px" title1="平均到访频次趋势" id='tendencyLine2'
          :options1="trendAndAvg.avgLineOption" :series1="trendAndAvg.avgLineSeries"
          :options2="trendAndAvg.avgBarOption" :series2="trendAndAvg.avgBarSeries" :columns="trendAndAvg.avgColumn"
          :tableList="trendAndAvg.avgTable"></goalCharts>
      </div>
    </div>
  </div>
</template>

<script>
import goalCharts from '@/components/goal/goalCharts.vue'
import Cards from './components/Cards.vue'
import storeChart from '@/components/charts/storeChart.vue'
import VueApexCharts from 'vue-apexcharts'
import { getEffective } from '@/api/analysis'
import { getEntityFlow } from '@/api/home'

import moment from 'moment'
import _ from 'lodash'
import { lineOptions, formatNumber, storeOption1, storeOption2, } from '@/libs/util'
import { options2 } from '@/libs/chart.js'
import FlowSelector from '_c/flow-selector/effective-flow-selector'
export default {
  name: 'DwellTime',

  components: {
    VueApexCharts,
    Cards,
    goalCharts,
    storeChart,
    FlowSelector,
  },
  data () {
    return {
      isShowChart:true,
      chartheight:'0',
      isEffectiveChart: false,
      showCharts: false,
      isTime: false,
      isUp1: false,
      isUp2: false,
      isUp3: false,
      pieType: 'pie',
      effective: {
        icon: 'youxiaokeliu1',
        title: '去重客流',
        number: '',
        bg: '#EAE8FD',
        color: '#776AED',
        time1: '',
        time2: '',
        precent: '',
        addPrecent: ''
      },
      repeat: {
        icon: 'zhongfu',
        title: '重复客流',
        number: '',
        bg: '#D7F7F5',
        color: '#2BD9CF',
        time1: '',
        time2: '',
        precent: '',
        addPrecent: ''
      },
      avgTimes: {
        icon: 'daofang',
        title: '平均到访次数',
        number: '',
        bg: '#D8F1FB',
        color: '#03A1E9',
        time1: '',
        time2: '',
        precent: '',
        addPrecent: ''
      },
      dwellText: 'effective',
      iconColor: 'rgb(34, 128, 215)',
      chartOptions: {},
      trendAndAvg: {
        trendLineOption: {},
        trendLineSeries: [],
        trendColumn: [],
        trendTable: [],
        trendBarOption: {},
        trendBarSeries: [],
        effectiveNumbser: '',
        repeatNumber: '',
        avgTimesNumber: '',
        avgLineOption: {},
        avgLineSeries: [],
        avgBarOption: {},
        avgBarSeries: [],
        avgColumn: [],
        avgTable: []
      },
      circleSeries: [],
      chartColumns: [],
      chartTable: [],
      isNumber: 0

    }
  },
  activated () {
    // this.isEffectiveChart = false
    // setTimeout(() => {
    //   this.isEffectiveChart = true
    // })
  },
  mounted () {
    setTimeout( ()=> {
      let height = this.$refs.effCahrt.offsetHeight - 89
      this.chartheight =  height + 'px'
    }, 200)
    window.onresize=()=>{
      this.isShowChart = false
      let height = this.$refs.effCahrt.offsetHeight - 89
      this.chartheight =  height + 'px'
      setTimeout(() => {
        this.isShowChart = true
      },500);
    }
  },
  methods: {

    /*
    *@method 处理图表需要的数据
    *@param {obj} res 请求的数据
    *@param {arr} xaxisCategories 时间对比的横坐标
    */
    initTrend (res, xaxisCategories) {
      var trendAndAvg = _.cloneDeep(this.trendAndAvg)
      if (res.status == 200) {
        var data = res.data.data
        var lineO = _.cloneDeep(lineOptions)
        var barO = _.cloneDeep(options2)
        // 处理横坐标
        if (xaxisCategories != undefined) { // 有时间对比
          lineO.xaxis.categories = xaxisCategories
          barO.xaxis.categories = xaxisCategories
        } else { // 无时间对比
          lineO.xaxis.categories = data.map(function (m, index) {
            return moment(m.date_time).format('YYYY-MM-DD')
          })
          barO.xaxis.categories = data.map(function (m, index) {
            return moment(m.date_time).format('YYYY-MM-DD')
          })
        }
        // 处理series
        var lineSeries = []
        var obj = {}
        obj.name = this.$t('全部客流')
        obj.data = data.map(function (m) {
          return m.visits
        })
        var obj2 = {}
        obj2.name = this.$t('去重客流')
        obj2.data = []
        if(xaxisCategories != undefined){
          xaxisCategories.forEach((element,index) => {
            if(data[index]){
              obj2.data.push(data[index].unique_visits)
            }else{
              obj2.data.push(0)
            }
          });
        }else{
          obj2.data = data.map(function (m) {
            return m.unique_visits
          })
        }
      
        lineSeries.push(obj)
        lineSeries.push(obj2)
        var columnSeries = _.cloneDeep(lineSeries)
        columnSeries.forEach(function (m) {
          m.type = 'column'
        })
     
        trendAndAvg.trendLineOption = lineO
        trendAndAvg.trendLineSeries = lineSeries
        if(this.$refs.selectData.queryParams.compareType==='not'&&
          this.$refs.selectData.queryParams.date1Array[0]===this.$refs.selectData.queryParams.date1Array[1]
        ){
          var div = document.getElementById('tendencyLine')
          var width
          if (div) width = div.offsetWidth
          var number = (width / 2).toFixed(2) - 50
          trendAndAvg.trendLineOption.xaxis.labels.offsetX = number
        }else{
          trendAndAvg.trendLineOption.xaxis.labels.offsetX = 0
        }
        if (barO.xaxis.categories.length < 2) {
          barO.plotOptions.bar.columnWidth = '15%'
        } else {
          barO.plotOptions.bar.columnWidth = '45%'
        }
        trendAndAvg.trendBarOption = barO
        trendAndAvg.trendBarSeries = columnSeries
        trendAndAvg.effectiveNumbser = _.sum(lineSeries[1].data)
        trendAndAvg.repeatNumber = formatNumber(_.sum(lineSeries[0].data) - _.sum(lineSeries[1].data))
        let temps = res.data.data
        if (temps.length) {
          trendAndAvg.avgTimesNumber = formatNumber(_.sumBy(res.data.data, 'avgFrequencyVisits') / temps.length)
        } else {
          trendAndAvg.avgTimesNumber = 0.0
        }

        // trendAndAvg.avgTimesNumber = Math.round(formatNumber(_.sumBy(res.data.data,'avgFrequencyVisits'))/data.length)
        trendAndAvg.trendTable = res.data.data.map(function (m) {
          let obj = {}
          obj.name = moment(m.date_time).format('YYYY-MM-DD')
          obj.begin = m.visits ? m.visits.toLocaleString() : ' '
          obj.end = m.unique_visits ? m.unique_visits.toLocaleString() : ' '
          return obj
        })
        trendAndAvg.trendColumn = ['日期', 'TotalEnterUnit', 'EffectEnterUnit']

        var avgSeries = []
        var obj3 = {}
        obj3.name = this.$t('平均到访频次')
        obj3.data = []
        if(xaxisCategories != undefined){
          xaxisCategories.forEach((element,index) => {
            if(data[index]){
              obj3.data.push(data[index].avgFrequencyVisits)
            }else{
              obj3.data.push(0)
            }
          });
        }else{
          obj3.data = data.map(function (m) {
           return m.avgFrequencyVisits
          })
        }
       
        trendAndAvg.avgLineSeries = avgSeries
        trendAndAvg.avgLineOption = _.cloneDeep(lineO)
        //  trendAndAvg.avgLineOption.yaxis.tickAmount=2,
        if(this.$refs.selectData.queryParams.compareType==='not'&&
          this.$refs.selectData.queryParams.date1Array[0]===this.$refs.selectData.queryParams.date1Array[1]
        ){
          var div = document.getElementById('tendencyLine2')
          var width
          if (div) width = div.offsetWidth
          var number = (width / 2).toFixed(2) - 50
          trendAndAvg.avgLineOption.xaxis.labels.offsetX = number
        }
        trendAndAvg.avgLineOption.yaxis.labels.formatter = (value) => {
          return Number(value).toFixed(1)
        }
        avgSeries.push(obj3)

        var avgColumnSeries = _.cloneDeep(avgSeries)
        avgColumnSeries.forEach(function (m) {
          m.type = 'column'
        })
        trendAndAvg.avgBarOption = _.cloneDeep(barO)
      
        if (trendAndAvg.avgBarOption.xaxis.categories.length < 2) {
          trendAndAvg.avgBarOption.plotOptions.bar.columnWidth = '10%'
        } else if(trendAndAvg.avgBarOption.xaxis.categories.length < 5){
          trendAndAvg.avgBarOption.plotOptions.bar.columnWidth = '25%'
        }else if(trendAndAvg.avgBarOption.xaxis.categories.length < 10){
          trendAndAvg.avgBarOption.plotOptions.bar.columnWidth = '55%'
        }else if(trendAndAvg.avgBarOption.xaxis.categories.length < 15){
          trendAndAvg.avgBarOption.plotOptions.bar.columnWidth = '65%'
        }else {
          trendAndAvg.avgBarOption.plotOptions.bar.columnWidth = '80%'
        }
        trendAndAvg.avgBarOption.yaxis.labels.formatter = (value) => {
          return Number(value).toFixed(1)
        }
        trendAndAvg.avgBarSeries = avgColumnSeries
        trendAndAvg.avgTable = res.data.data.map(function (m) {
          let obj = {}
          obj.begin = moment(m.date_time).format('YYYY-MM-DD')
          obj.end = m.avgFrequencyVisits ? m.avgFrequencyVisits : ' '
          return obj
        })
        trendAndAvg.avgColumn = ['日期', '平均到访频次']
      }
      return trendAndAvg
    },
    /*
    *@method 处理圆环图表数据
    *@param {obj} resCircle 圆环所需的请求数据
    */
    initCircle (resCircle) {
      var that = this
      if (resCircle.status == 200) {
        that.chartColumns = [{ 'key': 'name', 'title': this.$t('类型'), 'align': 'center' }, { 'key': 'enter', 'title': this.$t('fn.EnterUnit',[this.$t('人')]), 'align': 'center' }]
        var resCircleData = resCircle.data.data.arrival_distribution
        var circleSeries = []
        var chartTable = []
        var count = 0
        for (let j in resCircleData) {
          count++
          let obj = {}
          if (count == 5) {
            obj.name = this.$t(j + '次及以上')
          } else {
            obj.name =  this.$t('fn.times',[this.$t(j)])
          }
          obj.enter = resCircleData[j]
          chartTable.push(obj)
          circleSeries.push(resCircleData[j])
        }
        that.chartTable = chartTable
        that.circleSeries = circleSeries
      }
    },
    /*
    *@method 查询
    *@param {obj} value 查询控件封装的数据
    */
    async paramsPrepare (value) {
      var that = this
      this.showCharts = false
      if (value.entitys.length == 0 && this.isNumber > 0) {
        this.$alert({ content:'请选择实体' })
        return false
      }
      this.isNumber = this.isNumber + 1
     
      var bzid = value.entitys[0] && value.entitys[0].id
      if (value.compareType == 'not') { // 无对比
        that.$store.commit('setRequestNumber', 2)
        this.isTime = false
        this.pieType = 'pie'
        this.chartOptions = storeOption1
        this.chartOptions.labels=[this.$t('fn.times',[1]), this.$t('fn.times',[2]), this.$t('fn.times',[3]), this.$t('fn.times',[4]), this.$t('5次及以上')]
    
        var startTime = value.date1Array[0]
        var endTime = value.date1Array[1]
        var range = value.date1Array.join(',')
        var initRes = []
        let innerRange = this.gotInnerRange(value.date1Array)
        // 请求数据
        getEffective(bzid, startTime, endTime, innerRange).then(res => {
          initRes.push(res)
          getEntityFlow({ range, bzid }).then(ress => {
            initRes.push(ress)
            var trendAndAvg = that.initTrend(initRes[0])
            that.trendAndAvg = trendAndAvg
            that.effective.number = that.trendAndAvg.effectiveNumbser
            that.repeat.number = that.trendAndAvg.repeatNumber
            that.avgTimes.number = that.trendAndAvg.avgTimesNumber.toFixed(1)
            that.initCircle(initRes[1])
            that.showCharts = true
          })
        })
      } else if (['time','onYear','onChain'].includes(value.compareType)) { // 时间对比
        that.$store.commit('setRequestNumber', 4)
        this.isTime = true
        this.pieType = 'bar'

        var startTime1 = value.date1Array[0]
        var endTime1 = value.date1Array[1]
        var starTime2 = value.date2Array[0]
        var endTime2 = value.date2Array[1]
        range = value.date1Array.join(',')
        let innerOne = this.gotInnerRange(value.date1Array)
        let innerTwo = this.gotInnerRange(value.date2Array)
        let innerRange
        if (innerOne == 'Month' || innerTwo == 'Month') innerRange = 'Month'
        else innerRange = 'Date'
        initRes = await Promise.all([
          getEffective(bzid, startTime1, endTime1, innerRange),
          getEffective(bzid, starTime2, endTime2, innerRange),
          getEntityFlow({ range, bzid })
        ])
        range = value.date2Array.join(',')
        var ress = await Promise.all([
          getEntityFlow({ range, bzid })
        ])
        initRes.push(ress[0])
        let type = innerRange == 'Month' ? 'Month' : 'day'
        var diff1 = moment(value.date1Array[1]).diff(moment(value.date1Array[0]), type)
        var diff2 = moment(value.date2Array[1]).diff(moment(value.date2Array[0]), type)
        var diff = diff1 > diff2 ? diff1 : diff2
        diff++
        diff++
        var xaxisCategories = []
        for (let i = 1; i < diff; i++) {
          xaxisCategories.push(innerRange === 'Month' ?this.$t('fn.第_月',[i]):this.$t('fn.第_天',[i]))
        }
        var trendAndAvg = that.initTrend(initRes[0], xaxisCategories)
        var trendAndAvg2 = that.initTrend(initRes[1], xaxisCategories)
       
        var name1,name2,label = value.entitys[0].label,time1 = value.date1Array,time2=value.date2Array
        name1 = time1[0] === time1[1]? time1[0] :time1.join(' - ')
        name2 = time2[0] === time2[1]? time2[0] :time2.join(' - ')
        // var name1 = value.entitys[0].label + ' ' + value.date1Array.join(' - ') + '有效客流'

        trendAndAvg.trendLineSeries[0].name = name1
        trendAndAvg.trendLineSeries[0].data = trendAndAvg.trendLineSeries[1].data
        trendAndAvg.trendLineSeries[1].name = name2
        trendAndAvg.trendLineSeries[1].data = trendAndAvg2.trendLineSeries[1].data
        trendAndAvg.trendBarSeries = trendAndAvg.trendLineSeries
        trendAndAvg.trendColumn = ['日期', name1, name2]
        var trendTable = []
        xaxisCategories.forEach(function (m, index) {
          let obj = {}
          obj.name = m
          obj.begin = trendAndAvg.trendLineSeries[0].data[index] ? trendAndAvg.trendLineSeries[0].data[index].toLocaleString() : ' '
          obj.end = trendAndAvg.trendLineSeries[1].data[index] ? trendAndAvg.trendLineSeries[1].data[index].toLocaleString() : ' '
          trendTable.push(obj)
        })
        trendAndAvg.trendTable = trendTable
        trendAndAvg.avgLineSeries[0].name = name1
        trendAndAvg.avgLineSeries[1] = _.cloneDeep(trendAndAvg.avgLineSeries[0])
        trendAndAvg.avgLineSeries[1].name = name2
        trendAndAvg.avgLineSeries[1].data = trendAndAvg2.avgLineSeries[0].data
        trendAndAvg.avgBarSeries = _.cloneDeep(trendAndAvg.avgLineSeries)
        trendAndAvg.avgBarSeries.forEach(function (m) {
          m.type = 'column'
        })
        trendAndAvg.avgColumn = ['日期', name1, name2]
        var avgTable = []
        xaxisCategories.forEach(function (m, index) {
          let obj = {}
          obj.name = m
          obj.begin = trendAndAvg.avgLineSeries[0].data[index] ? trendAndAvg.avgLineSeries[0].data[index] : ' '
          obj.end = trendAndAvg.avgLineSeries[1].data[index] ? trendAndAvg.avgLineSeries[1].data[index] : ' '
          avgTable.push(obj)
        })
        trendAndAvg.avgTable = avgTable
        that.trendAndAvg = trendAndAvg

      
        that.effective.time1 = name1
        that.effective.time2 = name2
        that.repeat.time1 = name1
        that.repeat.time2 = name2
        that.avgTimes.time1 = name1
        that.avgTimes.time2 = name2

        that.effective.precent = trendAndAvg.effectiveNumbser

        if (trendAndAvg.effectiveNumbser >= trendAndAvg2.effectiveNumbser) {
          that.isUp1 = false
          if (trendAndAvg.effectiveNumbser == trendAndAvg2.effectiveNumbser) {
            that.effective.addPrecent = '0%'
          } else if (trendAndAvg2.effectiveNumbser == 0) {//eslint-disable-line
            that.effective.addPrecent = '-100%'
          } else if (trendAndAvg.effectiveNumbser == 0) { //eslint-disable-line
            that.effective.addPrecent = '100%'
          } else {
            var a = Math.round(trendAndAvg2.effectiveNumbser / trendAndAvg.effectiveNumbser * 100)
            that.effective.addPrecent = (100 - a) + '%'
          }
        } else {
          that.isUp1 = true
          if (trendAndAvg2.effectiveNumbser == 0) { //eslint-disable-line
            that.effective.addPrecent = '-100%'
          } else if (trendAndAvg.effectiveNumbser == 0) { //eslint-disable-line
            that.effective.addPrecent = '100%'
          } else {
            that.effective.addPrecent = (Math.round(trendAndAvg2.effectiveNumbser / trendAndAvg.effectiveNumbser * 100) - 100) + '%'
          }
        }
        if (trendAndAvg.repeatNumber >= trendAndAvg2.repeatNumber) {
          that.isUp2 = false
          if (trendAndAvg.repeatNumber == trendAndAvg2.repeatNumber) {
            that.repeat.addPrecent = '0%'
          } else if (trendAndAvg2.repeatNumber == 0) {
            that.repeat.addPrecent = '-100%'
          } else if (trendAndAvg.repeatNumber == 0) {
            that.repeat.addPrecent = '100%'
          } else {
            that.repeat.addPrecent = (100 - Math.round(trendAndAvg2.repeatNumber / trendAndAvg.repeatNumber * 100)) + '%'
          }
        } else {
          that.isUp2 = true
          if (trendAndAvg2.repeatNumber == 0) {
            that.repeat.addPrecent = '-100%'
          } else if (trendAndAvg.repeatNumber == 0) {
            that.repeat.addPrecent = '100%'
          } else {
            that.repeat.addPrecent = (Math.round(trendAndAvg2.repeatNumber / trendAndAvg.repeatNumber * 100) - 100) + '%'
          }
        }
        if (trendAndAvg.avgTimesNumber >= trendAndAvg2.avgTimesNumber) {
          that.isUp3 = false
          if (trendAndAvg.avgTimesNumber == trendAndAvg2.avgTimesNumber) {
            that.avgTimes.addPrecent = '0%'
          } else if (trendAndAvg2.avgTimesNumber == 0) {
            that.avgTimes.addPrecent = '-100%'
          } else if (trendAndAvg.avgTimesNumber == 0) {
            that.avgTimes.addPrecent = '100%'
          } else {
            that.avgTimes.addPrecent = (100 - Math.round(trendAndAvg2.avgTimesNumber / trendAndAvg.avgTimesNumber * 100)) + '%'
          }
        } else {
          that.isUp3 = true
          if (trendAndAvg2.avgTimesNumber == 0) {
            that.avgTimes.addPrecent = '-100%'
          } else if (trendAndAvg.avgTimesNumber == 0) {
            that.avgTimes.addPrecent = '100%'
          } else {
            that.avgTimes.addPrecent = (Math.round(trendAndAvg2.avgTimesNumber / trendAndAvg.avgTimesNumber * 100) - 100) + '%'
          }
        }

        that.repeat.precent = trendAndAvg.repeatNumber
        that.avgTimes.precent = trendAndAvg.avgTimesNumber.toFixed(1)

        var resCircleData = [0, 0, 0, 0, 0]
        var resCircleData1, resCircleData2

        if (initRes[2].status == 200) {
          var rcd1 = initRes[2].data.data.arrival_distribution
          resCircleData1 = []
          for (let k in rcd1) {
            resCircleData1.push(rcd1[k])
          }
        } else {
          resCircleData1 = _.cloneDeep(resCircleData)
        }
        if (initRes[3].status == 200) {
          var rcd2 = initRes[3].data.data.arrival_distribution
          resCircleData2 = []
          for (let k in rcd2) {
            resCircleData2.push(rcd2[k])
          }
        } else {
          resCircleData2 = _.cloneDeep(resCircleData)
        }
        that.chartColumns = [
          { 'key': 'name', 'title': this.$t('时间'), 'align': 'center' },
          { 'key': 'value1', 'title': this.$t('fn.times',[1]), 'align': 'center' },
          { 'key': 'value2', 'title':this.$t('fn.times',[2]), 'align': 'center' },
          { 'key': 'value3', 'title':this.$t('fn.times',[3]), 'align': 'center' },
          { 'key': 'value4', 'title':this.$t('fn.times',[4]), 'align': 'center' },
          { 'key': 'value5', 'title':this.$t('5次及以上'), 'align': 'center' }
        ]
        var chartTable = []
        var tableRow1 = {}
        tableRow1.name = name1
        tableRow1.value1 = resCircleData1[0]
        tableRow1.value2 = resCircleData1[1]
        tableRow1.value3 = resCircleData1[2]
        tableRow1.value4 = resCircleData1[3]
        tableRow1.value5 = resCircleData1[4]
        var tableRow2 = {}
        tableRow2.name = name2
        tableRow2.value1 = resCircleData2[0]
        tableRow2.value2 = resCircleData2[1]
        tableRow2.value3 = resCircleData2[2]
        tableRow2.value4 = resCircleData2[3]
        tableRow2.value5 = resCircleData2[4]
        chartTable.push(tableRow1)
        chartTable.push(tableRow2)
        that.chartTable = chartTable
        var circleNames = [this.$t('fn.times',[1]), this.$t('fn.times',[2]), this.$t('fn.times',[3]), this.$t('fn.times',[4]), this.$t('5次及以上')];
  
        var circleSeries = circleNames.map(function (m, index) {
          let obj = {}
          obj.name = m
          obj.data = [resCircleData1[index]?resCircleData1[index]:0, resCircleData2[index]?resCircleData2[index]:0]
          return obj
        })
        var chartOptions = _.cloneDeep(storeOption2)
        chartOptions.xaxis.categories = [name1, name2]
        this.chartOptions = chartOptions
        this.circleSeries = circleSeries
        console.log(circleSeries)
        this.showCharts = true
      }
    },
    /*
    *@method 处理横坐标函数
    *@param {arr} date 横坐标时间范围
    *@return {arr} innerRange  处理后的横坐标
    */
    gotInnerRange (date) {
      const [start, end] = date
      let startTime = moment(start)
      let endTime = moment(end)
      let diffDays = moment.duration(endTime.diff(startTime)).asDays()
      let innerRange = ''
      if (diffDays < 60) innerRange = 'Date'
      else innerRange = 'Month'
      return innerRange
    }
  },
}
</script>

<style lang="scss" scoped>
.effective {
  position: relative;
  .chartContent {
    display: flex;
    flex-wrap: wrap;
    margin-top:20px;
    .eff-box{
        width: 77.5%;
        margin-right: 20px;
    }
    // .charts {
    //   width: 100%;
    //   // height: 534px;
    // }
    .cardContent {
      width: 21%;
      .cards{
        box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
        border-radius: 6px;
      
      }
    }
    .cir-box{
      margin-top: 20px;
      width: 100%;
    }
    .circles {
      border-radius: 6px;
      background-color: #fff;
      width: 44.5%;
      display: inline-block;
      margin-right: 20px;
      box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
    }
  }
  .chartsTable .left-title .title{
    padding-top:0!important;
  }
}
</style>
