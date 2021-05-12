<template>
  <div>
    <flow-selector  @paramsPrepare="paramsPrepare"></flow-selector>
    <!-- enter -->
    <div v-if="isShowText" class="mt-6 z-50">
   
      <charts-list :data="computeChartData">
      
        <template slot-scope="{item}">
          <chart-tabs :xAxis="item.xAxis"
                      :labels="item.labels"
                      :series="item.series"
                      :type="item.type"
                      :tooltipUnit="tooltipUnit(item.name)"
                      :height="item.height"
                      :title="item.title"
                      :extraOptions="item.extraOptions"
                      :class="{lineChart:item.type[enterChartIndex]==='line'}"
                      :istotal='!item.title?true:false'
                      @tableSwitchover="val=>{enterChartIndex = val}"
                      @tableChage='enterTableChage'
                      :chartWidth='entityChartWidth(item)'>
            <template v-if="item.footfallSelect">
              <div class="flex justify-between items-center mr-10">
                <span class="whitespace-no-wrap mx-4 text-sm">数据指标:</span>
                <vs-select autocomplete
                           multiple
                           v-model="footfallType"
                           id="chartSelect"
                           >
                  <vs-select-item v-for="(item,index) in selectList "
                                  :text="item.name"
                                  :key="index"
                                  :value="item.value" />
                </vs-select>
              </div>
            </template>
            <export-menu slot="export"
                         @onchange="enterExportBiztop(item)"></export-menu>
          </chart-tabs>
        </template>
      </charts-list>
      <div v-if="footfallType.length !== 2"
           class="bg-white box-card"  style="padding:25px;margin-top:20px">
        <!-- 详细数据 -->
        <i-table :columns="eoData.detail.columns"
                 :data="eoData.detail.data">
          <template slot="head">
            <span class="text-xl table-header pb-3">客流量详细数据信息</span>
          </template>
        </i-table>
      </div>
    </div>
    <!-- ocucpancy -->
    <div v-if="occuCanshow &&isShowText">
      <div class="bg-white box-card  mt-6" style="position:relative;z-index:201;">
        <chart-tabs :xAxis="occuData.xAxis"
                    :extraOptions="occpuancyOptions"
                    :series="occuData.series"
                    title="集客量趋势"
                    :class="{lineChart:occuChartIndex==0}"
                    tooltipUnit="人次"
                    @tableSwitchover="val=>{occuChartIndex = val}"
                    :istotal='false'
                    @tableChage='occupancyTableChage'>
          <export-menu slot="export"
                       @onchange="occupancyExportBiztop"></export-menu>
        </chart-tabs>

      </div>
      <div class="bg-white box-card" style="padding:25px;margin-top:20px">
        <!-- 详细数据 -->
        <i-table :columns="occuData.detail.columns"
                 :data="occuData.detail.data">
          <template slot="head">
            <span class="text-xl table-header pb-3">集客量详细数据信息</span>
          </template>
        </i-table>
      </div>
    </div>
  </div>
</template>
<script>
import FlowSelector from '_c/flow-selector/entity-flow-selector'
import { postEntitysCompare, exportEx } from '@/api/home.js'
import seriesDict from '@/views/home/seriesDict.js'
import { dateCompare } from '@/api/analysis'
import _ from 'lodash'
import { gotInnerRange, formatXaxis,downloadEx } from '@/libs/util'
import ChartsList from './components/ChartsList.vue'
import moment from 'moment'
import chartTabs from '_c/common/CopyChartsTabs.vue'
import iTable from './components/iTable.vue'
import exportMenu from '@/views/operation/components/ExportMenu.vue'

export default {
  name: 'footfallAnalytics',

  components: {
    FlowSelector,
    ChartsList,
    chartTabs,
    iTable,
    exportMenu
  },
  data () {
    return {
      enterChartIndex:0,
      occuChartIndex:0,
      isShowText:true,
      dateType: '',
      footFall: true,
      typeOfCustom: 0,
      isShowExit: true,
      selectType: '',
      entitys: [],
      bzids: [],
      occupancyId: [],
      innerRange: '',
      innerRange2: '',
      isDurationOneDay: false,
      range: '',
      range2: '',
      isDateCompare: false,
      occuCanshow: true,
      entitysType: {
        floor: '楼层',
        gate: '出入口',
        area: '区域',
        shop: '购物中心',
        store: '商铺'
      },
      footfallData: {},
      reqTypes: null,
      defaultData: {
        xAxis: {
          name: '',
          key: null,
          data: []
        },
        series: [
          {
            name: '客流量',
            key: null,
            data: []
          }
        ],
        detail: {
          columns: [],
          data: []
        }
      },
      chartsListData: [],
      
      selectList: [
        {
          value: 'enter',
          name: '入客流'
        },
        {
          value: 'exit',
          name: '出客流'
        }
      ],
      footfallType: ['enter'],
      occpuancyOptions: {
        yaxis: []
      },
      enterTableList: [],
      occupancyTableList: [],
      clientTabList: [],
      frequencyTabList: []
    }
  },
  watch: {

    footfallType () {
      if (this.footfallType.length == 0) this.footfallType = ['enter']
    }
  },
  computed: {

    eoData () {
      if (!Object.keys(this.footfallData).length) return this.defaultData
      if (this.footfallType.length === 2) return this.footfallData.all // 进出客流
      else if (this.footfallType[0] === 'enter') return this.footfallData.enter // 进客流
      else if (this.footfallType[0] === 'exit') return this.footfallData.exit // 出客流
      else {
        let newData = _.cloneDeep(this.footfallData.enter)
        newData.xAxis.data = []
        newData.sumArr = []
        newData.series.map(val => { val.data = [] })
        newData.detail = {
          data: [],
          columns: [
            {
              key: 'name',
              title: '实体名称'
            },
            {
              key: 'type',
              title: '实体类别'
            },
            {
              key: 'sum',
              title: '累计入客流量'
            },
            {
              key: 'highest',
              title: '入客流峰值',
              type: 'html'
            }
          ]
        }
        return this.footfallData.enter
      }
    },
    occuData () {
      var that = this
      if (!Object.keys(this.footfallData).length && this.occuCanshow) {
        return this.defaultData
      } else {
        this.footfallData.occupancy.series.map(function (list, index) {
          list.data.map(function (value, vIndex) {
            if (Number(value) < 0) that.footfallData.occupancy.series[index].data[vIndex] = 0
          })
        })
        let occupancyTotal = _.sum(this.footfallData.occupancy.series[0] && this.footfallData.occupancy.series[0].data)
        let yObj = {
          title: {
            text: '',
            style: {
              fontSize: '13px'
            }
          },
          labels: {
            formatter (value) {
              return _.round(value, 0).toLocaleString()
            }
          }
        }
        if (occupancyTotal != 0) yObj.min = 0
        this.occpuancyOptions.yaxis = []
        this.occpuancyOptions.yaxis.push(yObj)
        return this.footfallData.occupancy
      }
    },
    chartTypes () {
      if (this.bzids.length > 1 && this.footfallType.length === 2) return ['bar']
      else return ['line', 'bar']
    },

    computeChartData () {
      let extraOptions = {
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            radius: 0,
            distributed: false
          }
        },
        yaxis: []
      }
      let eoChartData = {
        xAxis: this.eoData.xAxis,
        series: this.eoData.series,
        footfallSelect: this.isShowExit,
        extraOptions,
        type: this.chartTypes,
        
      }
      let enterTotal = _.sum(eoChartData.series[0] && eoChartData.series[0].data)
      let yObj = {
        title: {
          text: '',
          style: {
            fontSize: '13px'
          }
        },
        labels: {
          formatter (value) {
            return _.round(value, 0).toLocaleString()
          }
        }
      }
      if (enterTotal != 0) yObj.min = 0
      extraOptions.yaxis.push(yObj)
      return [ ...[eoChartData]]
    }
  },
  mounted(){
  },
  methods: {
    tooltipUnit (name) {
      switch (name) {
        case 'SquaerMetre':
          return '元/m²'
        case 'UnitPrice':
        case 'SaleAmount':
          return '元'
        case 'CloseRate':
          return '%'
        case 'new_old_proportion':
        case 'arrival_distribution':
          return '人'
        default:
          return '人次'
      }
    },
    paramsPrepare (pparams) {
      /**
       * 构造{ bzid, type, range, innerRange }
       * type: enter/exit/occupancy(只有当 innerRange 为 1h 才会有)
       * 根据 params 调用请求
       */

      this.innerRange = gotInnerRange(pparams.date1Array)
      this.innerRange2 = gotInnerRange(pparams.date2Array)
      this.isShowExit = pparams.enterType === '0'
      this.typeOfCustom = pparams.enterType
      // 2019-03-18时间对比数据处理时候，需要用到当前的请求起始时间，因此存为全局
      this.entitys = pparams.entitys
      this.occupancyId = this.entitys.filter(e => e.itype !== 'gate').map(i => i.id)
      this.bzids = this.entitys.map(i => i.id)
      this.range = this.formatDay(pparams.date1Array[0]) + ',' + this.formatDay(pparams.date1Array[1])
      let paramsArr = null
      let reqPromises = null
      this.bzids = _.remove(this.bzids, function (n) { return n != 0 })
      this.selectType = pparams.compareType
      if (['time', 'onYear', 'onChain'].includes(pparams.compareType)) { // 时间对比
        let dateTypeOne = gotInnerRange(pparams.date1Array)
        let dateTypeTwo = gotInnerRange(pparams.date2Array)
        this.isDurationOneDay = this.innerRange === '1h' && this.innerRange2 === '1h'
        this.isDateCompare = true
        this.range2 = this.formatDay(pparams.date2Array[0]) + ',' + this.formatDay(pparams.date2Array[1])
        paramsArr = this.getDateCompareParams()
        reqPromises = paramsArr.map(e => dateCompare(e))
        if (dateTypeOne == '1month' || dateTypeTwo == '1month') this.dateType = '月'
        else this.dateType = '天'
      } else {
        this.isDurationOneDay = this.innerRange === '1h'
        this.isDateCompare = false
        paramsArr = this.getCompareParams()
        reqPromises = paramsArr.map(e => postEntitysCompare(e))
        // getEntityFlowBatch({ range1: this.range, bzid: this.bzids.toString() }).then(res => { this.handleTypeData(res) })
      }
      // 根据是否是一天并且实体类型过滤掉出入口后的数组有长度(出入口没有集客量)显示集客量
      Promise.all(reqPromises).then(res => {
        if (['time', 'onYear', 'onChain'].includes(pparams.compareType)) this.handleDateCompareRes(res)
        else this.handleRes(res)
      })
      this.occuCanshow = this.isDurationOneDay && this.occupancyId.length
      this.reqTypes = paramsArr.map(e => e.type)
    },
    // 格式化天
    formatDay (time) {
      return moment(time).format('YYYY-MM-DD')
    },
    getCompareParams () {
      let paramsArr = [this.initParams({})]
      if (this.isShowExit) paramsArr.push(this.initParams({ type: 'exit' }))// 如果是全部客流则添加出客流请求
      if (this.isDurationOneDay && this.occupancyId.length) paramsArr.push(this.initParams({ type: 'occupancy' }))
      return paramsArr
    },
    getDateCompareParams () {
      let paramsArr = []
      if (this.isDurationOneDay) {
        paramsArr.push(this.initdateReqParams({ innerRange: '1h' }))
        if (this.isShowExit) paramsArr.push(this.initdateReqParams({ type: 'exit', innerRange: '1h' }))
        if (this.occupancyId.length) paramsArr.push(this.initdateReqParams({ type: 'occupancy', innerRange: '1h' }))
      } else {
        paramsArr.push(this.initdateReqParams({}))
        if (this.isShowExit) paramsArr.push(this.initdateReqParams({ type: 'exit' }))
      }
      return paramsArr
    },
    initParams ({ type = 'enter' }) {
      let bzid = type === 'occupancy' ? this.occupancyId : this.bzids // 类型为 gate 无需occupancy
      return {
        range: this.range,
        innerRange: this.innerRange,
        bzid: bzid.toString(),
        type
      }
    },
    generateChartData (data, categories, chartType) {
      /**
       * @param {Arrya} data 由每各个Id和该Id不同时间段内的组成的集合
       * @param {Array} categories 横轴分类键值组合，当有两个时间多个实体时候需要用到
       * @param {String} chartType 是否为柱图
       */
      let tmlChartData = _.cloneDeep(this.filterInitChartData())// 根据当前选择的顾客类型过滤出图表的初始化数据
      let groupedObj = _.groupBy(data, 'name')
      let categoriesName = categories
        ? categories.length === 2 ? '名称'
          : categories[0] === 'time' ? '时间'
            : '实体'
        : '类型'

      let keys = Object.keys(groupedObj)
      for (let i = 0; i < keys.length; i++) {
        const g = keys[i]
        let idx = _.findIndex(tmlChartData, e => e.name === g)
        if (idx < 0) continue
        if (chartType && chartType === 'bar') {
          tmlChartData[idx].type = ['bar']
          tmlChartData[idx].extraOptions = {
            chart: {
              stacked: !!((g === 'arrival_distribution' || categories.length === 2))
            },
            plotOptions: {
              bar: {
                endingShape: (g === 'arrival_distribution' || categories.length === 2) ? 'flat' : 'rounded'
              }
            },
            legend: {
              show: true
            }
          }
          tmlChartData[idx].series = this.getSeries(groupedObj[g])
          tmlChartData[idx].xAxis = {
            name: categoriesName,
            key: categories.join('_'),
            data: groupedObj[g].map(item => {
              // return `${this.entitys.find(o => Number(o.id) === Number(item.id)).label} ${item.time}`
              let names = []
              categories.forEach(cate => {
                if (cate === 'id') names.push(`${this.entitys.find(o => Number(o.id) === Number(item.id)).label}`)
                if (cate === 'time') names.push(item[cate].split(',').join(' - '))
              })
              return names.join(' ')
            })
          }
        } else {
          tmlChartData[idx].labels = {
            name: categoriesName,
            key: 'id',
            data: groupedObj[g][0].labels.map(e => seriesDict[e].name),
            icons: groupedObj[g][0].labels.map(e => seriesDict[e].icon)
          }
          tmlChartData[idx].series = groupedObj[g][0].val
        }
      }
      return tmlChartData
    },
    filterInitChartData () {
      let result
      if (this.typeOfCustom === '0') result = this.sourceData.map(e => e)
      if (this.typeOfCustom === '1') result = this.sourceData.filter(e => e.name !== 'clerk_proportion')
      if (this.typeOfCustom === '2') result = this.sourceData.filter(e => e.name === 'enter')
      if (this.typeOfCustom === '3') result = this.sourceData.filter(e => ['vip_proportion', 'arrival_distribution', 'enter'].includes(e.name))
      if (this.typeOfCustom === '4') result = this.sourceData.filter(e => ['arrival_distribution', 'enter'].includes(e.name))
      return result
    },
    getSeries (arr) {
      let labels = arr[0].labels
      return labels.map((e, idx) => ({ name: seriesDict[e].name, key: e, data: arr.map(i => i.val[idx]) }))
    },
    initdateReqParams ({ type = 'enter' }) {
      let range1 = this.range.split(',')
      let range2 = this.range2.split(',')
      let bzid = type === 'occupancy' ? this.occupancyId : this.bzids // 类型为 gate 无需occupancy
      let innerRange
      let oneDate = gotInnerRange(range1)
      let twoDate = gotInnerRange(range2)
      if (oneDate == '1month' || twoDate == '1month') innerRange = '1month'
      else if (oneDate === '1h' && twoDate === '1h') {
        innerRange = '1h'
      } else { innerRange = '1day' }
      let dateOne = {
        begin: moment(range1[0]).format('YYYY-MM-DD'),
        end: moment(range1[1]).format('YYYY-MM-DD')
      }
      let dateTwo = {
        begin: moment(range2[0]).format('YYYY-MM-DD'),
        end: moment(range2[1]).format('YYYY-MM-DD')
      }
      let dateCompareParam = {
        date1: dateOne,
        date2: dateTwo,
        type: type,
        bzid: bzid.toString(),
        innerRange
      }
      return dateCompareParam
    },
    handleRes (data) {
      let chartObj = {}
      this.reqTypes.forEach((e, index) => { chartObj[e] = this.processData(data[index].data.data, e) })
      if (this.isShowExit) {
        let eoSeies = []
        let eoXaxis = []
        let enterObj = chartObj.enter
        let exitObj = chartObj.exit
        if (this.entitys.length === 1) {
          eoSeies = _.cloneDeep(enterObj.series)
          eoSeies.push(exitObj.series[0])
          eoXaxis = enterObj.xAxis
        } else {
          eoSeies.push({
            name: '入客流',
            key: 'enter',
            data: enterObj.sumArr
          })
          eoSeies.push({
            name: '出客流',
            key: 'exit',
            data: exitObj.sumArr
          })
          eoXaxis = {
            key: 'entity',
            name: '实体',
            data: enterObj.eoXaxis
          }
        }
        chartObj.all = {
          xAxis: eoXaxis,
          series: eoSeies
        }
      }
      this.footfallData = chartObj
    },
    processData (data, type) {
      let footFallTypeName = this.getFootFallName(type)
      let xAxis = []
      let compares = []
      let series = []
      let sumArr = []
      let eoXaxis = []
      let highestArr = []
      let detailTableObj = {}// 详细数据
      let detaiData = []// 详细数据
      data.forEach((e, index) => {
        let formatedDate = formatXaxis({ beginDate: e.begin, innerRange: this.innerRange })
        xAxis.push(formatedDate)
        if (this.isDurationOneDay && e) {
          // 2019-03-11新增需求，今日当前时间点以后的数据为null
          if (moment(e.end).isAfter(moment(), 'h')) e.compares.forEach(i => { i.number = null })// 各时间段内所有zid的enter同期数据
          compares.push(e.compares)
        } else compares.push(e.compares)
      })
      let zipcompares = _.zip(...compares)// 各zid内不同时间段内的enter数据
      zipcompares.forEach(e => {
        sumArr.push(_.sumBy(e, (o) => { return o ? o.number : 0 }))
        let maxValue =_.maxBy(e, (o) => { return o.number })?_.maxBy(e, (o) => { return o.number }).number:0
        let maxindex = _.findIndex(e, (o) => { return o.number === maxValue })
        let maxvalueDate = maxindex!==-1? `${data[maxindex].begin},${data[maxindex].end}`: `${data[0].begin},${data[0].end}`
        highestArr.push({
          number: maxValue,
          date: maxvalueDate
        })
      })
      data[0] && data[0].compares.forEach((c, index) => {
        let entityType = _.find(this.entitys, o => o.id === c.bzid).itype
        series.push({// 各zid 以name data(其各时间段的数据) 组成的数组
          name: `${c.name} ${footFallTypeName}`,
          key: `${c.bzid}_${type}`,
          data: zipcompares[index].map(z => { return z.number })// 当日期为今日时候数据显示到当前时间上个小时
        })
        eoXaxis.push(c.name)
        let size = highestArr[index].number > 0 ? highestArr[index].number : 0
        detaiData.push({
          name: c.name,
          sum: `${sumArr[index].toLocaleString()}人次`,
          type: this.entitysType[entityType] || '购物中心', // 实体类别
          highest: `${size.toLocaleString()}人次   ${this.highestDateFormat(highestArr[index].date)}`
        })

        detailTableObj.data = detaiData
        detailTableObj.columns = this.initColumns(type)
      })
      return {
        xAxis: {
          key: 'date',
          name: '时间',
          data: xAxis
        },
        series,
        eoXaxis,
        sumArr,
        detail: detailTableObj
      }
    },
    handleDateCompareRes (data) {
      let chartObj = {}
      this.reqTypes.forEach((e, index) => { chartObj[e] = this.datesEntityFind(data[index].data.data, e) })
      if (this.isShowExit) {
        let enterObj = _.cloneDeep(chartObj.enter)
        let exitObj = _.cloneDeep(chartObj.exit)
        let enterSeries = enterObj.series
        let exitSeries = exitObj.series
        enterSeries.forEach((e, index) => { enterSeries.splice((index) * 2 + 1, 0, exitSeries[index]) })
        chartObj.all = {
          xAxis: enterObj.xAxis,
          series: enterSeries
        }
      }

      this.footfallData = chartObj
    },
    datesEntityFind (resData, type, dateTyoe) {
      let footFallTypeName = this.getFootFallName(type)
      let bzids = type === 'occupancy' ? this.entitys.filter(e => e.itype !== 'gate') : this.entitys
      let isAllDateOneDay = this.isDurationOneDay
      let deArray = []
      let xAxisData = []
      let detailTableData = []
      let detailTableColumns = this.initColumns(type)
      let detailObj = {}
      let timeColumn = {
        title: '时间点',
        key: 'time'
      }

      detailTableColumns.splice(2, 0, timeColumn)// 时间对比中多了一项时间点
      _.forEach(bzids, (item, index) => {
        let pEle = {
          name: `${item.name}|${this.formatDate(this.range)}|${footFallTypeName}`,
          key: `${type}_${item.id}_${this.range}`,
          data: []
        }
        let dEle = {
          name: `${item.name}|${this.formatDate(this.range2)}|${footFallTypeName}`,
          key: `${type}_${item.id}_${this.range2}`,
          data: []
        }
        deArray.push(pEle)
        deArray.push(dEle)
      })
      let isShortDurtion = this.compareDurations(this.range, this.range2)
      _.forEach(resData, (element, i) => {
        let resultOfDate1 = this.createPointsData(element.date1, this.range, type, isShortDurtion)// 每个时间段内各zid组成的数组
        let resultOfDate2 = this.createPointsData(element.date2, this.range2, type, isShortDurtion)
        _.forEach(element.date1, (ele1, index) => { deArray[index * 2].data.push(resultOfDate1[index]) })// 时间1
        _.forEach(element.date2, (ele2, index) => { deArray[index * 2 + 1].data.push(resultOfDate2[index]) })// 时间2
        if (isAllDateOneDay) {
          let hour = resData[i].date1[0].belong.split(' ')[1]
          xAxisData.push(hour)
        } else {
          xAxisData.push(`第${i + 1}${this.dateType}`)
        }
      })
      deArray.forEach((d, index) => {
        let sum = _.sum(d.data)
        let maxValue = _.max(d.data) ? _.max(d.data) : 0
        let maxValueIndex = _.findIndex(d.data, (e) => { return maxValue === e })
        let entityType = this.entitysType[bzids[Math.floor(index / 2)].itype]
        entityType = entityType || '购物中心'
        detailTableData.push({
          name: d.name.split('|')[0],
          type: entityType,
          // time: isAllDateOneDay ? d.name.split('|')[1] : `${d.name.split('|')[1]} - ${d.name.split('|')[3]}`,
          time: d.name.split('|')[1],
          sum: `${sum.toLocaleString()} 人次`,
          highest: `${maxValue.toLocaleString() || 0}人次    ${this.highestDateFormat(resData[maxValueIndex][`date${index % 2 + 1}`][Math.floor(index / 2)].belong)}`
        })
      })

      detailObj.data = detailTableData
      detailObj.columns = detailTableColumns
      return {
        xAxis: {
          name: '时间',
          key: 'time',
          data: xAxisData
        },
        series: deArray,
        detail: detailObj
      }
    },
    formatDate (dateStr) {
      if (this.isDurationOneDay) return dateStr.split(',')[0]
      else return `${dateStr.split(',')[0]} - ${dateStr.split(',')[1]}`
    },
    getFootFallName (type) {
      let nameCollect = {
        enter: '入客流',
        exit: '出客流',
        occupancy: '集客量'
      }
      return nameCollect[type]
    },
    highestDateFormat (str) {
      // 判断当前是时间对比或者非时间对比
      let splitStrs = str.split(' ')
      if (this.isDateCompare) {
        if (this.isDurationOneDay) {
          return `${splitStrs[1]} - ${splitStrs[1].replace(/0*$/, '59')}`
        } else return splitStrs[0]
      } else {
        let dateWithHour = splitStrs[1].split(',')
        if (this.isDurationOneDay) return `${dateWithHour[0].slice(0, 5)} - ${splitStrs[2].slice(0, 5)}`
        else return splitStrs[0]
      }
    },
    initColumns (type) {
      let typeStr = '入'
      if (type === 'exit') typeStr = '出'
      if (type === 'occupancy') typeStr = '集'
      let common = [
        {
          title: '实体名称',
          key: 'name'
        },
        {
          title: '实体类别',
          key: 'type'
        },
        {
          title: `累计${typeStr}客流量`,
          key: 'sum'
        },
        {
          title: `${typeStr}客${type === 'occupancy' ? '量' : '流'}峰值`,
          key: 'highest',
          type: 'html'
        }
      ]
      if (type === 'occupancy') common.splice(2, 1)// 集客量不需要累计值
      return common
    },
    createPointsData (data, range, type, isShort) {
      /**
       * @data:{Array}
       * @isShort：当前range 是否是时间差小的那个时间
       * @type:enter,exit
       */
      let result = []
      if (this.isDurationOneDay) { // 两个单天
        if (moment(range.split(',')[1]).isSame(moment(), 'd')) {
          // 其中至少一个是今天
          data.forEach(e => { result.push(moment(e.belong).isAfter(moment()) ? 0 : e[type]) })
        } else data.forEach(e => { result.push(e[type]) })
      } else { // 至少一个多天，判断该 range 的时间差是较少的那个还是相等或者较多不做判断，少的需要判断push到该range end 为止
        if (isShort) {
          data.forEach((e, index) => {
            if (e[type]) {
              result.push(e[type])
            } else {
              result[index] = 0
            }
            // result.push(e[type])
            // if (moment(e.belong).isAfter(moment(range.split(',')[1]))) {
            //   result[index] = 0
            // }
          })
        } else {
          data.forEach(e => { result.push(e[type]) })
        }
      }
      return result
    },
    compareDurations (date1, date2) {
      let dateOne = date1.split(',')
      let dateTwo = date2.split(',')
      return moment(dateOne[1]).diff(dateOne[0], 'days') < moment(dateTwo[1]).diff(dateTwo[0], 'days')
    },
    getFrequencyData () {
      let arrs = this.computeChartData.filter(item => item.title === '到店次数')
      let columns = [], data = []
      if (this.selectType == 'not') {
        columns = [{ title: '类型', key: 'id' }, { title: '客流量', key: 'enter' }]
        data = arrs[0].series.map((m, i) => {
          let obj = {}
          obj.id = arrs[0].labels.data[i]
          obj.enter = arrs[0].series[i]
          return obj
        })
      } else {
        let nameType = this.selectType == 'time' ? '时间' : '实体'
        let titleList = arrs[0].series
        columns = [{ title: nameType, key: 'name' }]
        titleList.map(val => {
          columns.push({
            title: val.name,
            key: val.key
          })
        })
        arrs[0].xAxis.data.map((dataList, index) => {
          let obj = {}
          obj.name = dataList
          titleList.map(list => {
            obj[list.key] = list.data[index]
          })
          data.push(obj)
        })
      }
      this.frequencyTabList.push(columns)
      this.frequencyTabList.push(data)
      return this.frequencyTabList
    },
    enterTableChage (value) {
      if (value.type === '客流量趋势') {
        this.enterTableList = value.data
      } else if (value.type === '新老顾客占比') {
        this.clientTabList = value.data
      }
    },
    occupancyTableChage (value) {
      this.occupancyTableList = value.data
    },
    enterExportBiztop (type) {
      let value
      if (type.footfallSelect) {
        value = '客流量趋势'
      } else {
        value = type.title
      }

      if (type.title === '新老顾客占比') this.uploadList(this.clientTabList)
      if (type.title === '到店次数') this.uploadList(this.getFrequencyData())
      if (type.footfallSelect) this.uploadList(this.enterTableList)
    },
    occupancyExportBiztop () {
       downloadEx(exportEx,'实体客流分析集客量趋势',this.occupancyTableList)
    },
    uploadList (value) {
      if (this.selectType != 'time') {
        let time = this.range.split(',')
        // if (time[0] == time[1]) {
        //   value[1].map(list => {
        //     list.date = time[0] + '  ' + list.date
        //   })
        // }
      }
      downloadEx(exportEx,'实体客流分析客流量趋势',value)
    },
    entityChartWidth (item) {
      let width = '100%'
      if (item.xAxis && !item.footfallSelect) {
        let xSize = item.xAxis.data.length
        xSize <= 12 ? width = '100%' : width = xSize * 60
      }
      return width
    }
  },
}
</script>
<style lang="less" scoped>
  .lineChart{
    overflow: visible!important;
  }
.text-xl {
    font-size: 18px !important;
}
</style>
