<template>
  <div class="report-center">
    <div class="pdf-text-box">
      <div id="pdfDom" v-if="showPDF" style="width: 1200px;">
        <!-- 封面 -->
        <report-cover
        :suggestText='suggestText'
        titleName='凌图智慧周报'
        :pageTotal='`${13+allHeatMap.length}`'
        ></report-cover>
        <!-- 总览 -->
        <report-one title='客流总览' :enterData='enterData' :listTitle='oneListData'></report-one>
        <!--客流趋势  -->
        <report-chart :chartHeight='600' :clickData='clickData' title='客流趋势' page='2' :listTitle='trendTitle'  :dataList=trendChartData></report-chart>
        <report-ratio-table
          title='客流趋势'
          page='3'
          :listTitle='trendTitle'
          :tableColumn='ratioTableColumn'
          :tableData ='ratioTableData'
        ></report-ratio-table>
        <!-- 出入口 -->
        <report-chart :chartHeight='600' :clickData='clickData' title='出入口客流' page='4' :listTitle='gateTitle' :dataList='gateChartData'></report-chart>
        <!-- 出入口表格 -->
        <report-week-five
          title='出入口客流'
          :listTitle="gateTableTitle"
          :tableColumn='tableColumn'
          :tableData='tableData'
        ></report-week-five>
        <report-gate-table title='出入口客流' page='6'
                           :listTitle='gateTitle'
                           :tableColumn='gateTableColumn'
                           :tableData='gateTableData'
        ></report-gate-table>
        <!-- 店铺 -->
        <report-chart :chartHeight='600' :clickData='clickData' title='店铺客流' page='7' :listTitle='shopTitle' :dataList='shopChartData'></report-chart>
        <!-- 楼层下的商铺 -->
        <report-chart-multi title='店铺客流' page='8'  :listTitle='floorStoreTitle' :dataList='allFloorStore'></report-chart-multi>
        <!-- 业态下的商铺 -->
        <report-chart-multi title='店铺客流' page='9'  :listTitle='formatStoreTitle' :dataList='allFormatStore'></report-chart-multi>
        <!-- 热力图 -->
        <report-heat-map
        :key="'heatMap'+index"
        v-for="(item,index) in allHeatMap"
        title='热力图'
        :page='`${10+index}`'
        :listTitle='item.title'
        :dataList=item.data
         :isRemark='false'
         :chartHeight='600'
        ></report-heat-map>
        <!-- 店铺关联 有序-->
        <report-table title='店铺关联' :listTitle='orderlyTitle' :tableData='orderlyData' :page='`${10+allHeatMap.length}`'></report-table>
        <!-- 店铺关联 无序-->
        <report-table title='店铺关联' :listTitle='disorderTitle' :tableData='disorderData' :page='`${11+allHeatMap.length}`'></report-table>
        <!-- 停留时间 业态-->
        <report-chart :chartHeight='600' :clickData='clickData' title='停留时间' :isRemark='false' :page='`${12+allHeatMap.length}`'  :listTitle='dwellTitle' :dataList='dwellChartData' chartType='dwell'></report-chart>
        <!-- 停留时间 业态下的商铺-->
        <report-chart-multi chartType='dwell' title='停留时间' :page='`${13+allHeatMap.length}`'  :listTitle='formatDwellStoreTitle' :dataList='allDwellFormatStore'></report-chart-multi>
        <report-back-cover></report-back-cover>
      </div>

    </div>
  </div>
</template>
<script>
import reportCover from '@/components/report/newReport/report_cover'
import reportOne from '@/components/report/newReport/report_one'
import reportChart from '@/components/report/newReport/report_chart'
import reportHeatMap from '@/components/report/newReport/report_heat_map'
import reportRatioTable from '@/components/report/newReport/report_ratio_table'
import reportWeekFive from '@/components/report/newReport/new_report_week_five'
import reportBackCover from '@/components/report/newReport/report_back_cover'
import reportTable from '@/components/report/newReport/report_table'
import reportChartMulti from '@/components/report/newReport/report_chart_multi'
// 第三方
import moment from 'moment'
import _ from 'lodash'
import Bus from '@/libs/bus.js'
import { setToken } from '@/libs/util'
import axios from 'axios'
import mixins from './reportMixin.js'
import reportGateTable from '@/components/report/newReport/new_report_week_gateTable'
// api
import { newReportEnter, newReportSuggest, newReportGate, newReportShop } from '@/api/report'
import { getanalysiseeo, getGroupOrganization } from '@/api/home'
import {
  newReportFloorStore,
  newReportFormatStore,
  newReportHeatMap,
  newReportOrderly,
  newReportDisorder,
  newReportDwellStore,
  newReportDwellFormat,
  newReportGateLast
} from '@/api/new_report'
import {mapState} from 'vuex'
export default {
  name: 'new-download-report-week',
  mixins: [mixins],
  components: {
    reportCover,
    reportOne,
    reportChart,
    reportHeatMap,
    reportWeekFive,
    reportRatioTable,
    reportBackCover,
    reportChartMulti,
    reportTable,
    reportGateTable

  },
  data () {
    return {
      clickData : 0,
      showPDF:false,
      trendChartData: {
        option:{},
        remarkData: []
      },
      gateChartData: {
        option:{},
        remarkData: []
      },
      shopChartData: {
        option:{},
        remarkData: []
      },
      ratioTableColumn: {
        name1: ['时间', '入客流'],
        name2: ['同比分析', '环比分析'],
        name3: ['时间', '入客流', '增长率', '时间', '入客流', '增长率']
      },
      ratioTableData: [],
      tableColumn: ['出入口名称', '客流量', '客流峰值', '平均客流量/小时'],
      tableData: [],
      allFloorStore:[],
      allFormatStore:[],
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
        option:{},
        remarkData: []
      },
      allDwellFormatStore:[],
      gateTableColumn:[],
      gateTableData:[]
    }
  },
  computed: {
    ...mapState({
      pdfBaseUrl: state => state.report.pdfBaseUrl,
    }),
    oneListData () {
      return [
        {
          name: '本周客流总览',
          text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
        },
        {
          name: '上周客流总览',
          text: '客流周期:' +  this.saveHeaderData.yester
        }
      ]
    },
    trendTitle () {
      return {
        name: '本周客流趋势',
        text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
      }
    },
    gateTableTitle(){
      return {
        name: '本周出入口客流TOP10',
        text: '客流周期:' + this.saveHeaderData.year + '年第' + this.saveHeaderData.period + '周'
      }
    },
    gateTitle () {
      return {
        name: '本周出入口客流TOP10对比分析',
        text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
      }
    },
    shopTitle () {
      return {
        name: '本周店铺客流TOP10对比分析',
        text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
      }
    },
   floorStoreTitle(){
      return {
        name: '本周各楼层TOP10店铺客流分析',
        text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
      }
    },
    formatStoreTitle(){
      return {
        name: '本周各业态TOP10店铺客流分析',
        text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
      }
    },
    orderlyTitle () {
      return {
        relevancy:{
          name: '本周无序关联度TOP10',
          text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
        },
        inversion:{
          name: '本周无序转换量TOP10',
          text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
        }
      }
    },
    disorderTitle(){
      return {
        relevancy:{
          name: '本周有序关联度TOP10',
          text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
        },
        inversion:{
          name: '本周有序转换量TOP10',
          text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
        }
      }
    },
    dwellTitle(){
      return {
         name: '本周业态停留时间TOP10',
         text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
      }
    },
    formatDwellStoreTitle(){
      return {
         name: '本周业态中商铺停留时间TOP10',
         text: '客流周期:' +  this.saveHeaderData.year + '年第' +  this.saveHeaderData.period + '周'
      }
    },
    callData () {
      return this.$route.query.date
    },
    lastWeekDate () {
      var start = this.$route.query.date.split(',')[0]
      let yester = moment(moment(start).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let lastWeekStart = moment(yester).startOf('isoweek').format('YYYY-MM-DD')
      let lastWeekend = moment(yester).endOf('isoweek').format('YYYY-MM-DD')
      return lastWeekStart + ',' + lastWeekend
    },
    lastYearDate () {
      var start = this.$route.query.date.split(',')[0]
      var end = this.$route.query.date.split(',')[1]
      let lastStart = moment(start).add(-1, 'y').format('YYYY')
      let lastEnd = moment(end).add(-1, 'y').format('YYYY')
      let lastYearStart = lastStart + moment(start).startOf('isoweek').format('-MM-DD')
      let lastYearEnd = lastEnd + moment(end).endOf('isoweek').format('-MM-DD')
      return lastYearStart + ',' + lastYearEnd
    }

  },
  mounted () {
    let token = this.$route.query.token
    setToken(token, 1)
    this.parameterData()
  },
  methods: {
    headerDate () {
      var start = this.$route.query.date.split(',')[0]
      var end = this.$route.query.date.split(',')[1]
      let yester = moment(moment(start).subtract(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD')
      let headerDate = {
        year: moment(start).format('YYYY'),
        period: moment(start).format('WW'),
        time: moment(start).format('MM.DD') + ' - ' + moment(end).format('MM.DD'),
        week: '',
        type: 'week',
        yester: moment(yester).format('YYYY') + '年第' + moment(yester).format('WW') + '周',
        reportDate: moment(start).startOf('isoweek').format('YYYY.MM.DD') + ' - ' + moment(start).endOf('isoweek').format('YYYY.MM.DD')
      }
      this.saveHeaderData = headerDate
      this.$store.commit('weekReportHeader', headerDate)
    },
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
        newReportSuggest({ property_id: this.propertyId, date: this.callData }),
        // 总客流
        newReportEnter({ property_id: this.propertyId, timeRange: this.callData,report_type:'week' }),
        // 本周客流
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.callData, innerRange: '1day' }),
        // 上周客流
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.lastWeekDate, innerRange: '1day' }),
        // 去年客流
        getanalysiseeo({ bzid: this.bzid, type: 'enter', range: this.lastYearDate, innerRange: '1day' }),
        // 出入口
        newReportGate({ timeRange1: this.callData, timeRange2: this.lastWeekDate, report_type: 'week', property_id: this.propertyId }),
        // 商铺
        newReportShop({ time1: this.callData, time2: this.lastWeekDate, report_type: 'week', property_id: this.propertyId }),
        // 楼层下的商铺
        newReportFloorStore({time:this.callData,property_id:this.propertyId}),
        // 业态下的商铺
        newReportFormatStore({time:this.callData,property_id:this.propertyId}),
        // 热力图
        newReportHeatMap({time:this.callData,property_id:this.propertyId}),
        // 关联度 有序
        newReportOrderly({time:this.callData,property_id:this.propertyId,sort_parameter:'rate',report_type:'week'}),
        newReportOrderly({time:this.callData,property_id:this.propertyId,sort_parameter:'value',report_type:'week'}),
        // 关联度 无序
        newReportDisorder({time:this.callData,property_id:this.propertyId,sort_parameter:'rate',report_type:'week'}),
        newReportDisorder({time:this.callData,property_id:this.propertyId,sort_parameter:'value',report_type:'week'}),
        // 停留时间 业态
        newReportDwellFormat({time:this.callData,property_id:this.propertyId,}),
        // 停留时间 业态下的商铺
        newReportDwellStore({time:this.callData,property_id:this.propertyId,}),
        newReportGateLast({ timeRange1: this.callData, property_id: this.propertyId })

      ]).then(res => {
        this.showPDF = true
        // 建议
        this.suggestText = res[0].data.data[0].property_suggest
        // 客流总览
        this.reportOneData(res[1].data.data)
        // 趋势数据
        this.trendDataList(res[2].data.data, res[3].data.data, res[4].data.data)
        // 出入口数据
        this.gateDataList(res[5].data.data)
        // 商铺数据
        this.shopDataList(res[6].data.data)
        // 楼层下的商铺
        this.floorDataList(res[7].data.data)
        // 业态下的商铺
        this.formatDataList(res[8].data.data)
        // 热力图
        this.heatMapData(res[9].data.data,'本周')
        // 关联度 有序
        this.relevanceTableData(res[10].data.data.matrixList,res[11].data.data.matrixList,'orderlyData')
        // 关联度 无序
        this.relevanceTableData(res[12].data.data,res[13].data.data,'disorderData')
        // 停留时间 业态
        this.dwellFormatData(res[14].data.data)
        // 停留时间 业态 商铺
        this.dwellFormatStoreData(res[15].data.data)
        this.gateTableDataList(res[16]);
        this.handleDownload()
        
      })
    },
    handleDownload(){
      if(!this.pdfBaseUrl){
        this.$message.warning('未获取到pdf_center服务器地址')
      }else {
        setTimeout(() => {
          axios.get(this.pdfBaseUrl+ '/pdf/finish', {
            params: { filename: this.callData }
          })
        }, 3000)
      }
    },
    gateTableDataList(data){
      data = data.data.data
      this.gateTableColumn = []
      let that = this
      for(let i=0;i<7;i++){
        let obj = {}
        obj.name = ''
        obj.time1 = '本期'+Object.keys(data[0].current[i])[0]
        obj.time2 = '同期'+Object.keys(data[0].contrast[i])[0]
        switch (i){
          case 0:
            obj.name = '星期一'
            break;
          case 1:
            obj.name = '星期二'
            break;
          case 2:
            obj.name = '星期三'
            break;
          case 3:
            obj.name = '星期四'
            break;
          case 4:
            obj.name = '星期五'
            break;
          case 5:
            obj.name = '星期六'
            break;
          case 6:
            obj.name = '星期日'
            break;
        }
        that.gateTableColumn.push(obj)
      }
      this.gateTableData = [];
      data.forEach(o=>{
        const currData = o.current.map(inner => {
          return Object.values(inner)
        }).flat()
        o.currTotal = _.sum(currData)
      })
      let to10 = _.sortBy(data,'currTotal').reverse().splice(0,10);
      to10.forEach(list=>{
        let obj = {}
        obj.current = []
        obj.period = []
        obj.ratio = []
        obj.name =  list.name
        list.current.map((e,index)=>{
          let currentEnter = Object.values(e)[0].toLocaleString()
          obj.current.push(currentEnter)
          let periodEnter = Object.values(list.contrast[index])[0].toLocaleString()
          obj.period.push(periodEnter)
          let ratio = this.sequential(Object.values(e)[0],Object.values(list.contrast[index])[0])
          obj.ratio.push(ratio+'%')
        })
        this.gateTableData.push(obj)
      })
      let total = { }
      total.current = []
      total.period = []
      total.ratio = []
      total.name = '合计'
      to10[0].current.forEach((list,index)=>{
        let arr = [] ,arr2 = []
        to10.forEach(val=>{
          arr.push(Object.values(val.current[index])[0])
          arr2.push(Object.values(val.contrast[index])[0])
        })
        total.current.push(_.sum(arr).toLocaleString())
        total.period.push(_.sum(arr2).toLocaleString())
        total.ratio.push(this.sequential(_.sum(arr),_.sum(arr2))+'%')
      })
      this.gateTableData.push(total)
    },
   trendDataList (enter, lastEnter, yearEnter) {
		 this.trendChartData.option = _.cloneDeep(this.enterOption)
      this.ratioTableData = []
      let smooth = {
        date: '',
        enter: '',
        ratio: ''
      }
      let maxHighest = {
        date: '',
        enter: '',
        ratio: ''
	  }
	  let [oneObj,twoObj]=[
		   {
            name: '本周客流',
            color: '#2081D4',
            type: 'column',
            data: []
          },
          {
            name: '上周客流',
            type: 'column',
            color: '#2BD9CF',
            data: []

          }
	  ]
      let size = 0
      let size2 = 999
      enter.forEach((list, index) => {
        let weekType = this.weekType(list.begin)
       	oneObj.data.push(list.enter)
        twoObj.data.push(lastEnter[index].enter)
        this.trendChartData.option.xAxis.categories.push(weekType)
        // 环比数据
        let lastWeekNumber = this.sequential(list.enter, lastEnter[index].enter)
        // 同比数据
        let yearNumber = this.sequential(list.enter, yearEnter[index].enter)
        // 环比的绝对值
        let absolute = Math.abs(lastWeekNumber)
        if (absolute < size2) {
          size2 = absolute
          smooth.date = moment(list.begin).format('YYYY年MM月DD号') + weekType
          smooth.enter = list.enter.toLocaleString()
          smooth.ratio = lastWeekNumber
        }
        if (absolute > size) {
          size = absolute
          maxHighest.date = moment(list.begin).format('YYYY年MM月DD号') + weekType
          maxHighest.enter = list.enter.toLocaleString()
          maxHighest.ratio = lastWeekNumber
        }
        this.ratioTableData.push({
          data: [
            moment(list.begin).format('YYYY-MM-DD') + ' ' + weekType,
            list.enter.toLocaleString() + '人次',
            moment(yearEnter[index].begin).format('YYYY-MM-DD'),
            yearEnter[index].enter.toLocaleString() + '人次',
            yearNumber + '%',
            moment(lastEnter[index].begin).format('YYYY-MM-DD'),
            lastEnter[index].enter.toLocaleString() + '人次',
            lastWeekNumber + '%'
          ]
        })
      })
      let cuT = _.sumBy(enter, (o) => { return o.enter })
      let laT = _.sumBy(lastEnter, (o) => { return o.enter })
	  let yeT = _.sumBy(yearEnter, (o) => { return o.enter })
	  this.trendChartData.option.series = [oneObj,twoObj]
      this.ratioTableData.push({
        data: [
          '合计',
          cuT.toLocaleString() + '人次',
          '-',
          yeT.toLocaleString() + '人次',
          this.sequential(cuT, yeT) + '%',
          '-',
          laT.toLocaleString() + '人次',
          this.sequential(cuT, laT) + '%'
        ]
      })
this.trendChartData.remarkData = []
      let type = smooth.ratio > 0 ? '增长' : '减少'
      let type2 = maxHighest.ratio > 0 ? '增长' : '减少'
      
      let text1 = '本周' + smooth.date + '客流' + type + '平稳，为' + smooth.enter + '人次，比上周环比' + type + Math.abs(smooth.ratio) + '%'
      let text2 =  '本周' + maxHighest.date + '客流' + type2 + '达到顶峰，为' + maxHighest.enter + '人次，比上周环比' + type2 + Math.abs(maxHighest.ratio) + '%'
      if(smooth.ratio !=='') this.trendChartData.remarkData.push(text1)
      if(maxHighest.ratio !=='') this.trendChartData.remarkData.push(text2)
    },
    gateDataList (gateData) {
      this.gateChartData.option = _.cloneDeep(this.enterOption)
      this.tableData = []
      let [ currentObj,yesterObj ]=[
        {
            name: '本周客流',
            color: '#2081D4',
            type: 'column',
            data: []
          },
          {
            name: '上周客流',
            type: 'column',
            color: '#2BD9CF',
            data: []
          }
      ]
      if (gateData.data) {
        gateData.data.forEach(list => {
          currentObj.data.push(list.enter)
          let yesterEnter = _.find(gateData.contrast, o => o.bzid === list.bzid).enter
          yesterObj.data.push(yesterEnter)
          this.gateChartData.option.xAxis.categories.push(list.name)
          this.tableData.push({
            name: list.name,
            enter: list.enter.toLocaleString(),
            peak: list.highest.number.toLocaleString(),
            time: moment(list.highest.begin).format('YYYY-MM-DD'),
            mean: list.avg.toLocaleString()
          })
        })
      }
      this.gateChartData.option.series=[currentObj,yesterObj]
      this.gateChartData.remarkData = gateData.comment?gateData.comment:[]
    },
    shopDataList (shopData) {
		this.shopChartData.option = _.cloneDeep(this.enterOption)
		let [currentObj, yesterObj] =  [
		  {
            name: '本周客流',
            color: '#2081D4',
            type: 'column',
            data: []
          },
          {
            name: '上周客流',
            type: 'column',
            color: '#2BD9CF',
            data: []

          }
		]
      if (shopData.current) {
        _.take(shopData.current, 10).forEach(list => {
         currentObj.data.push(list.data)
          if(shopData.contrast.length!==0){
            let yesterEnter = _.find(shopData.contrast, o => o.id === list.id).data
           yesterObj.data.push(yesterEnter)
          }else{
            yesterObj.data.push(0)
          }
          this.shopChartData.option.xAxis.categories.push(list.name)
        })
	  }
	  this.shopChartData.option.series = [ currentObj,yesterObj ]
      this.shopChartData.remarkData = shopData.comment?shopData.comment:[]
    },
    floorDataList(data){
      this.allFloorStore = []
      this.multiChartData(data, 'allFloorStore','chart')
    },
    formatDataList(data){
      this.allFormatStore = []
      this.multiChartData(data, 'allFormatStore','chart')
    },
    dwellFormatStoreData(data){
      this.allDwellFormatStore = []
      this.multiChartData(data, 'allDwellFormatStore','dwell')
      this.$nextTick(()=>{
        Bus.$emit('chartData')
        this.clickData = this.clickData+1
      })
    },
  }
}
</script>

<style lang="less" scoped>
#pdfDom{
    background-color: #fff;
    overflow: hidden;
    .reportOneText{
      float: left;
    }
}
</style>
