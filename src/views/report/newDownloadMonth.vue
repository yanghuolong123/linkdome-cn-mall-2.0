<template>
<div class="report-center">
  <div class="pdf-text-box">
    <div id="pdfDom" v-if="showPDF" style=" width: 1200px;">
      <!-- 封面 -->
      <report-cover :pageTotal='`${14+allHeatMap.length}`' :suggestText='suggestText' titleName='凌图智慧月报' ></report-cover>
      <!-- 总览 -->
      <report-one title='客流总览'  :enterData='enterData' :listTitle='oneListData' ></report-one>
      <report-remark title='客流总览'  page='2' :remarkData='enterData[3]'></report-remark>
      <!-- 客流趋势 -->
      <report-chart :chartHeight='600' :clickData='clickData' title='客流趋势' :listTitle='trendTitle' page='3'  :dataList=trendChartData></report-chart>
      <report-ratio-table
        title="客流分析"
        page='4'
        :listTitle='analyseTitle'
        :tableColumn='ratioTableColumn'
        :tableData ='ratioTableData'
       ></report-ratio-table>
      <!-- 出入口 -->
      <report-chart :chartHeight='600' :clickData='clickData' title='出入口客流' page='5' :listTitle='gate10Title' :dataList='gateTop10'></report-chart>
      <report-month-table title='出入口客流' page='6' :listTitle='gateFloorTitle' :tableData='gateTableData'
                          :tableColumn='gateTableColumn'></report-month-table>
      <!-- 楼层 出入口 -->
      <report-chart-multi title='出入口客流' page='7' :listTitle='gateFloorTitle' :dataList='floorGateChartData'></report-chart-multi>
      <!-- 店铺 -->
      <report-chart :chartHeight='600' :clickData='clickData' title='店铺客流' page='8' :listTitle='shop10Title' :dataList='shop10Data'></report-chart>
      <!-- 楼层 店铺 -->
      <report-chart-multi title='店铺客流' page='9'  :listTitle='floorShopTitle' :dataList='floorShopChartData'></report-chart-multi>
      <!-- 业态 店铺 -->
      <report-chart-multi title='店铺客流' page='10'  :listTitle='shopcAtivitiesTitle' :dataList='formatShopChartData'></report-chart-multi>
      <!-- 热力图 -->
      <report-heat-map
        :key="'heatMap'+index"
        v-for="(item,index) in allHeatMap"
        title='热力图'
        :page='`${11+index}`'
        :listTitle='item.title'
        :dataList=item.data
        :chartHeight='600'
      ></report-heat-map>
      <!-- 店铺关联 有序-->
      <report-table title='店铺关联' :listTitle='orderlyTitle' :tableData='orderlyData' :page='`${11+allHeatMap.length}`'></report-table>
      <!-- 店铺关联 无序-->
      <report-table title='店铺关联' :listTitle='disorderTitle' :tableData='disorderData' :page='`${12+allHeatMap.length}`'></report-table>
      <!-- 停留时间 业态-->
      <report-chart :chartHeight='600' :clickData='clickData' :isRemark='false' title='停留时间' :page='`${13+allHeatMap.length}`'  :listTitle='dwellTitle' :dataList='dwellChartData' chartType='dwell'></report-chart>
      <!-- 停留时间 业态下的商铺-->
      <report-chart-multi chartType='dwell' title='停留时间' :page='`${14+allHeatMap.length}`'  :listTitle='formatDwellStoreTitle' :dataList='allDwellFormatStore'></report-chart-multi>
      <report-back-cover></report-back-cover>
    </div>
  </div>
</div>
</template>
<script>
import reportOne from '@/components/report/newReport/report_one'
import reportCover from '@/components/report/newReport/report_cover'
import reportRatioTable from '@/components/report/newReport/report_ratio_table'
import reportChart from '@/components/report/newReport/report_chart'
import reportSuggest from '@/components/report-public/report_suggest'
import reportChartMulti from '@/components/report/newReport/report_chart_multi'
import reportBackCover from '@/components/report/newReport/report_back_cover'
import reportHeatMap from '@/components/report/newReport/report_heat_map'
import reportTable from '@/components/report/newReport/report_table'
import reportRemark from '@/components/report/newReport/report_remark'
  import reportMonthTable from '@/components/report/newReport/new_report_month_table'
  import {mapState} from 'vuex'
  // api
import { getanalysiseeo, getGroupOrganization } from '@/api/home'
import {
  newReportEnter,
  newReportSuggest,
  newReportMonthRemark,
  newReportGate,
  monthlyCameraList,
  newReportShop,
} from '@/api/report'

import {
  newReportFloorStore,
  newReportFormatStore,
  newReportHeatMap,
  newReportOrderly,
  newReportDisorder,
  newReportDwellStore,
  newReportDwellFormat,
  newReportMonthlyGate
} from '@/api/new_report'

import { setToken } from '@/libs/util'
import axios from 'axios'
import _ from 'lodash'
import Bus from '@/libs/bus.js'
import moment from 'moment'
import mixins from './reportMixin.js'
export default {
  name: 'report-week',
  mixins: [mixins],
  components: {
    reportCover,
    reportMonthTable,
    reportOne,
    reportChart,
    reportRatioTable,
    reportSuggest,
    reportChartMulti,
    reportBackCover,
    reportHeatMap,
    reportTable,
    reportRemark

  },
  data () {
    return {
      clickData:0,
      showPDF:false,
      lastYear:'',
      // 日期
      trendChartData: {
        option:{},
        remarkData: []
      },
      gateTop10: {
        option:{},
        remarkData: []
      },
      floorGateChartData: [],
      shop10Data: {
        option:{},
        remarkData: []
      },
      floorShopChartData: [],
      formatShopChartData: [],
      ratioTableColumn: {
        name1: ['时间', '客流量'],
        name2: ['客流峰值'],
        name3: ['时间', '客流峰值']
      },
      ratioTableData: [],
      allHeatMap:[],
      orderlyData:{
         relevancy:{
          column: ['实体名称','实体名称','关联度'],
          table:[]
        },
        inversion:{
          column: ['实体名称','实体名称','转换量'],
          table:[]
        }
      },
      disorderData:{
         relevancy:{
          column: ['实体名称','实体名称','关联度'],
          table:[]
        },
        inversion:{
          column: ['实体名称','实体名称','转换量'],
          table:[]
        }
      },
      dwellChartData:{
        seriesData: [
          {
            name: '本日客流',
            color: '#2081d4',
            type: 'column',
            data: []
          },
          {
            name: '昨日客流',
            type: 'column',
            color: '#2BD9CF',
            data: []

          }
        ],
        xAxisData: [],
        remarkData: []
      },
      allDwellFormatStore:[],
      gateTableColumn: [],
      gateTableData:[],
    }
  },
  computed: {
    ...mapState({
      pdfBaseUrl: state => state.report.pdfBaseUrl,
    }),
    oneListData () {
      return [
        {
          name: '本月客流总览',
          text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
        },
        {
          name: '上月客流总览',
          text: '客流时间:' + this.saveHeaderData.yester
        },
        {
          name: '去年同月客流总览',
          text: '客流时间:' + moment(this.saveHeaderData.year).add(-1, 'y').format('YYYY')+ '年' + this.saveHeaderData.time + '月'
        }
      ]
    },
    trendTitle () {
      return {
        name: '本月客流趋势',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    analyseTitle () {
      return {
        name: '本月每周客流分析',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    gate10Title () {
      return {
        name: '本月出入口客流TOP10对比分析',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    gateFloorTitle () {
      return {
        name: '本月各楼层TOP10出入口客流分析',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    shop10Title () {
      return {
        name: '本月店铺客流TOP10对比分析',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    floorShopTitle () {
      return {
        name: '本月各楼层TOP10店铺客流分析',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    shopcAtivitiesTitle () {
      return {
        name: '本月各业态Top10店铺客流分析',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    orderlyTitle () {
      return {
        relevancy:{
          name: '本月无序关联度TOP10',
          text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
        },
        inversion:{
          name: '本月无序转换量TOP10',
          text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
        }
      }
    },
    disorderTitle(){
      return {
        relevancy:{
          name: '本月有序关联度TOP10',
          text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
        },
        inversion:{
          name: '本月有序转换量TOP10',
          text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
        }
      }
    },
    dwellTitle(){
       return {
        name: '本月业态停留时间TOP10',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    formatDwellStoreTitle(){
       return {
        name: '本月业态中商铺停留时间TOP10',
        text: '客流时间:' + this.saveHeaderData.year + '年' + this.saveHeaderData.time + '月'
      }
    },
    // 本月开始与结束的时间
    selectDate () {
      return this.$route.query.date
    },
    // 上个月开始与结束的时间
    lastMonthDate () {
      var startTime = this.$route.query.date.split(',')[0]
      let yester = moment(moment(startTime).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let yesterStart = moment(yester).startOf('month')
      let yesterEnd = moment(yester).endOf('month')
      return moment(yesterStart).format('YYYY-MM-DD') + ',' + moment(yesterEnd).format('YYYY-MM-DD')
    }
  },
  mounted () {
    let token = this.$route.query.token
    setToken(token, 1)
    this.parameterData()
  },
  methods: {
    parameterData () { // 查找对应的 购物中心 id
      getGroupOrganization().then(res => {
        let propertyId = Number(this.$route.query.propertyId)
        let property = _.filter(res.data.data.property, o => { return o.property_id === propertyId })[0]
        this.$store.commit('saveOrganizationData', res.data.data)
        this.$store.commit('headerData', { text: property.name, value: property.property_id, img: property.map_url })
        this.$store.commit('headerAction', property.property_id)
        setTimeout(() => {
          this.reportQuery()
        }, 1000)
      })
    },
    reportQuery () {
      this.headerDate()
      this.showPDF = false
      Promise.all([
        // 建议
        newReportSuggest({ property_id: this.propertyId, date: this.selectDate }),
        newReportEnter({ property_id: this.propertyId, timeRange: this.selectDate,report_type:'month' }),
        newReportEnter({ property_id: this.propertyId, timeRange: this.lastYear,report_type:'month' }),
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.selectDate, innerRange: '1day' }),
        newReportMonthRemark({ property_id: this.propertyId, timeRange: this.selectDate }),
        newReportGate({ property_id: this.propertyId, timeRange1: this.selectDate, timeRange2: this.lastMonthDate, report_type: 'month' }),
        monthlyCameraList(this.propertyId, this.selectDate),
        newReportShop({ time1: this.selectDate, time2: this.lastMonthDate, report_type: 'month', property_id: this.propertyId }),
        newReportFloorStore({ property_id: this.propertyId, time: this.selectDate }),
        newReportFormatStore({ property_id: this.propertyId, time: this.selectDate }),
          // 热力图
        newReportHeatMap({ time:this.selectDate,property_id:this.propertyId }),
        // 关联度 有序
        newReportOrderly({time:this.selectDate,property_id:this.propertyId,sort_parameter:'rate',report_type:'month'}),
        newReportOrderly({time:this.selectDate,property_id:this.propertyId,sort_parameter:'value',report_type:'month'}),
        // 关联度 无序
        newReportDisorder({time:this.selectDate,property_id:this.propertyId,sort_parameter:'rate',report_type:'month'}),
        newReportDisorder({time:this.selectDate,property_id:this.propertyId,sort_parameter:'value',report_type:'month'}),
        // 停留时间 业态
        newReportDwellFormat({time:this.selectDate,property_id:this.propertyId,}),
        // 停留时间 业态下的商铺
        newReportDwellStore({time:this.selectDate,property_id:this.propertyId,}),
        newReportMonthlyGate({
          property_id: this.propertyId,
          year: this.saveHeaderData.year,
          month: this.saveHeaderData.time
        })
      ]).then(res => {
        this.showPDF = true
        this.suggestText = res[0].data.data[0].property_suggest
        this.reportOneData(res[1].data.data,res[2].data.data)
        this.trendDataList(res[3].data.data, res[4].data.data)
        this.trendTableData(res[3].data.data)
        this.gateDataList(res[5].data.data)
        this.floorGateData(res[6].data.data)
        this.shopDataList(res[7].data.data)
        this.floorShopDataList(res[8].data.data)
        this.formatShopDataList(res[9].data.data)
        this.heatMapData(res[10].data.data,'本月')
        // // 关联度 有序
        this.relevanceTableData(res[11].data.data.matrixList,res[12].data.data.matrixList,'orderlyData')
        // // 关联度 无序
        this.relevanceTableData(res[13].data.data,res[14].data.data,'disorderData')
        // 停留时间 业态
        this.dwellFormatData(res[15].data.data)
        // 停留时间 业态 商铺
        this.dwellFormatStoreData(res[16].data.data)
        this.gateFlowTop10(res[17].data.data)
      })
    },
    //各楼层TOP10出入口客流
    gateFlowTop10 (data) {
      this.gateTableColumn = [];
      this.gateTableData = [];
      const total = {
        name:'合计',
        enter:[]
      }
      data.forEach((o, index) => {
        this.gateTableColumn.push({
          name: `第${index + 1}周`,
          time1: `${o.curent_start_time} - ${o.current_end_time}`,
          time2: `${o.last_start_time} - ${o.last_end_time}`
        });
        //排序取top10
        o.list = _.sortBy(o.list,'current_num').reverse().splice(0,10);
        o.list.forEach((gate,gIndex)=>{
          if(this.gateTableData[gIndex]){
            this.gateTableData[gIndex].enter.push({
              curr:gate.current_num.toLocaleString(),
              period:gate.last_num.toLocaleString(),
              ratio:(gate.ratio*100).toFix(2)+'%'
            })
          }else {
            this.gateTableData[gIndex] = {
              name:gate.name,
              enter:[{
                curr:gate.current_num.toLocaleString(),
                period:gate.last_num.toLocaleString(),
                ratio:(gate.ratio*100).toFix(2)+'%'
              }]
            }
          }
        })
        const totalCurr = _.sum(o.list.map(l=>{ return l.current_num }));
        const totalLast = _.sum(o.list.map(l=>{ return l.last_num }));
        total.enter.push({
          curr:totalCurr.toLocaleString(),
          period:totalLast.toLocaleString(),
          ratio:totalLast?((((totalCurr-totalLast)/totalLast)*100).toFix(2)+'%'):'0%'
        })
      
      })
      this.gateTableData.push(total)
    },
    trendDataList (data, remarkData) {
      this.trendChartData.option = _.cloneDeep(this.enterOption)
      let [enterObj,trendObj,averageObj] = [
          {
              name: '每日客流',
              type: 'column',
              color: '#00A0E9',
              data: []
          },
          {
              name: '本月客流趋势',
              type: 'spline',
              color: '#4EDBDA',
              marker: {
                enabled: false
              },
              dataLabels: {
                enabled: true,
                allowOverlap: true, // 允许数据标签重叠
                formatter () {
                  return this.y.toLocaleString()
                }
              },
              data: [],
              tooltip: {
                valueSuffix: ''
              }
          },
          {
              name: '平均客流',
              type: 'spline',
              color: '#FEB33D',
              marker: {
                enabled: false
              },
              data: [],
              tooltip: {
                valueSuffix: ''
              }
          }
	    ]
      let totalNumber = Number((_.sumBy(data, 'enter') / data.length).toFixed(0))
      data.forEach((list, index) => {
        enterObj.data.push(list.enter)
        trendObj.data.push(list.enter)
        averageObj.data.push(totalNumber)
        this.trendChartData.option.xAxis.categories.push(moment(list.begin).format('YYYY-MM-DD'))
      })
      this.trendChartData.option.series=[enterObj,trendObj,averageObj]
      this.trendChartData.remarkData = remarkData.comment?remarkData.comment:[]
    },
    trendTableData (data) {
      this.ratioTableData = []
      // let maxEnter = _.maxBy(data, o => { return o.enter })
      let totalEnter = _.sumBy(data, o => { return o.enter })
      let newArr = [[], [], [], [], [], []]
      let week = moment(data[0].begin).locale('zh').format('d')
      for (var i = 0; i <= (7 - Number(week)); i++) {
        var obj = {}
        obj.time = moment(data[i].begin).format('YYYY-MM-DD')
        obj.enter = data[i].enter
        newArr[0].push(obj)
      }
      var le1 = newArr[0].length
      newArr[1] = this.weekLists(data, le1)

      var le2 = newArr[0].length + newArr[1].length
      newArr[2] = this.weekLists(data, le2)

      var le3 = newArr[0].length + newArr[1].length + newArr[2].length
      newArr[3] = this.weekLists(data, le3)

      var le4 = newArr[0].length + newArr[1].length + newArr[2].length + newArr[3].length
      newArr[4] = this.weekLists(data, le4)

      var le5 = newArr[0].length + newArr[1].length + newArr[2].length + newArr[3].length + newArr[4].length
      newArr[5] = this.weekLists(data, le5)
      for (let i = 0; i < newArr.length; i++) {
        this.processingTableData(newArr[i])
      }
      let total = {
        data: [
          '本月合计',
          totalEnter.toLocaleString() + '人次'
          // moment(maxEnter.begin).format('YYYY-MM-DD'),
          // maxEnter.enter.toLocaleString() + '人次'
        ]
      }
      this.ratioTableData.push(total)
    },
    gateDataList (data) {
      this.gateTop10.option = _.cloneDeep(this.enterOption)
      let [oneObj,twoObj]=  [
        {
            name: '本月客流',
            type: 'column',
            color: '#2081D4',
            data: []
          },
          {
            name: '上月客流',
            type: 'column',
            color: '#2BD9CF',
            data: []
          }
      ]
      data.data.forEach((list, index) => {
        oneObj.data.push(list.enter)
        let last = _.filter(data.contrast, (o) => { return o.bzid === list.bzid })[0]
        twoObj.data.push(last ? last.enter : 0)
        this.gateTop10.option.xAxis.categories.push(list.name)
      })
      this.gateTop10.option.series=[oneObj,twoObj]
      this.gateTop10.remarkData = data.comment?data.comment:[]
    },
    shopDataList (data) {
      this.shop10Data.option = _.cloneDeep(this.enterOption)
      let [oneObj,twoObj]=  [
        {
            name: '本月客流',
            type: 'column',
            color: '#2081D4',
            data: []
          },
          {
            name: '上月客流',
            type: 'column',
            color: '#2BD9CF',
            data: []
          }
      ]
      _.take(data.current, 10).forEach(list => {
        oneObj.data.push(list.data)
        if(data.contrast.length!==0){
            let last = _.filter(data.contrast, (o) => { return o.id === list.id })[0]
            twoObj.data.push(last ? last.data : 0)
          }else{
            twoObj.data.push(0)
          }
         this.shop10Data.option.xAxis.categories.push(list.name)
      })
      this.shop10Data.option.series=[oneObj,twoObj]
      this.shop10Data.remarkData = data.comment?data.comment:[]
    },
    floorGateData (data) {
      this.floorGateChartData = []
      this.shopDataDispose(data, 'floorGateChartData')
    },
    headerDate () {
      var startTime = this.$route.query.date.split(',')[0]
      var year = moment(startTime).format('YYYY')
      var MM = moment(startTime).format('M')
      let yester = moment(moment(startTime).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let headerDate = {
        year: year,
        period: '',
        time: MM,
        week: '',
        type: 'monthly',
        yester: moment(yester).format('YYYY') + '年' + moment(yester).format('M') + '月',
        reportDate: moment(startTime).format('YYYY.MM')
      }
      this.saveHeaderData = headerDate
      this.$store.commit('monthReportHeader', headerDate)

      let lastYear =  moment(year).add(-1, 'y').format('YYYY')+'-'+MM
      let Start = moment(lastYear).startOf('month')
      let End = moment(lastYear).endOf('month')
      this.lastYear = moment(Start).format('YYYY-MM-DD') + ',' + moment(End).format('YYYY-MM-DD')
    },
    weekLists (data, index) {
      var arr = []
      for (var i = index; i < 7 + index; i++) {
        if (i >= data.length) break
        var obj = {}
        obj.time = moment(data[i].begin).format('YYYY-MM-DD')
        obj.enter = data[i].enter
        arr.push(obj)
      }
      return arr
    },
    processingTableData (data) {
      if (data.length === 0) return false
      let obj = {
        data: [
          moment(data[0].time).format('YYYY-MM-DD') + ' - ' + moment(data[data.length - 1].time).format('YYYY-MM-DD'),
          _.sumBy(data, 'enter').toLocaleString() + '人次'
        ]
      }
      let numberObj = {
        time: '',
        enter: 0
      }
      data.forEach(list => {
        if (list.enter > numberObj.enter) {
          numberObj.time = list.time
          numberObj.enter = list.enter
        }
      })
      obj.data.push(numberObj.time, numberObj.enter.toLocaleString() + '人次')
      this.ratioTableData.push(obj)
    },
    shopDataDispose (data, type) {
      let colorArr = ['#745AEF', '#EE690B', '#4EDBDA', '#2081D4']
      let nameList = Object.keys(data)
      nameList.forEach((list, index) => {
        let listObj = {
          option: _.cloneDeep(this.enterOption)
        }
        listObj.option.xAxis.categories = []
        listObj.option.series = [
          {
            name: list,
            type: 'bar',
            color: index > 4 ? colorArr[index - 4] : colorArr[index],
            data: []
          }
        ]
        let dataType = data[list].shop ? data[list].shop : data[list].gate
        let shop = _.take(_.orderBy(dataType, 'enter', 'desc'), 10)
        shop.forEach(value => {
          listObj.option.series[0].data.push(value.enter)
          listObj.option.xAxis.categories.push(value.name)
        })
        this.switchHeight(nameList,listObj)
        this[type].push(listObj)
      })
    },
    floorShopDataList (data) {
      this.floorShopChartData = []
      this.multiChartData(data, 'floorShopChartData','chart')
    },
    formatShopDataList (data) {
      this.formatShopChartData = []
      this.multiChartData(data, 'formatShopChartData','chart')
    },
    dwellFormatStoreData(data){
      this.allDwellFormatStore = []
      this.multiChartData(data, 'allDwellFormatStore','dwell')
      this.$nextTick(()=>{
        Bus.$emit('chartData')
        this.clickData=this.clickData+1;
        if(!this.pdfBaseUrl){
          this.$message.warning('未获取到pdf_center服务器地址')
        }else {
          setTimeout(() => {
            axios.get(this.pdfBaseUrl+'/pdf/finish', {
              params: { filename: this.selectDate }
            })
          }, 8000)
        }
      })
    },
  }
}
</script>
<style lang="less">
    .month-report-date{
      .ivu-input{
        height: 43px;
        font-size: 16px;
        border: 1px solid rgba(0, 0, 0, .2);
        font-family: "source_han_sans_cn", "Roboto", sans-serif;
      }
    }
</style>
<style lang="less" scoped>
   #pdfDom{
    background-color: #fff;
    overflow: hidden;
    .reportOneText{
      float: left;
    }
}
</style>
