<template>
  <div class="report-center">
    <div class="pdf-text-box">
      <div id="pdfDom">
        <!-- 首页 -->
        <report-day-cover  ref="coverData" :pageNumber="paginationNumber" :reportType="reportT" ></report-day-cover>
        <!-- 第一页 -->
        <report-day-list-three  ref="coverThreeData"></report-day-list-three>
        <!-- 第二页 -->
        <report-day-list-four :key="index" v-for="(item,index) in fourListData" ref="coverFourData"></report-day-list-four>
        <!-- 出入口数据 -->
        <!-- <report-day-list-six  ref="coverSixData"></report-day-list-six> -->
        <!-- 区域 商铺 -->
        <div v-if="isShopArea">
          <report-day-list-four  ref="areaList" ></report-day-list-four>
          <report-day-list-format   ref='formatList' :key="FIndex" v-for="(format,FIndex) in formatList" ></report-day-list-format>
        </div>
        <report-day-cover-back></report-day-cover-back>

      </div>
    </div>
  </div>
</template>
<script>
import reportDayCover from '@/components/report/report_day_cover'
import reportDayListThree from '@/components/report/report_day_list_three'
import reportDayListFour from '@/components/report/report_day_list_four'
import reportDayListSix from '@/components/report/report_day_list_six'
import reportDayListFormat from '@/components/report/report_day_list_format'
import reportDayCoverBack from '@/components/report/report_day_back_cover'

import { getGroupOrganization, postHistorycompute, getanalysiseeo } from '@/api/home'
import { setToken } from '@/libs/util'
import axios from 'axios'
import {
  reportCompare,
  fetchCompany,
  fetchEntity,
  getReportArea,
  getReportFormat
} from '@/api/report'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'download-report-day',

  components: {
    reportDayCover,
    reportDayListThree,
    reportDayListFour,
    reportDayListSix,
    reportDayListFormat,
    reportDayCoverBack

  },
  data () {
    return {
      isShopArea: false,
      paginationNumber: '',
      reportT: '日报',
      companyId: '',
      bzId: [],
      enterListData: '',
      property_name: '',
      formatList: [],
      fourListData: []
    }
  },
  computed: {
    propertyId () {
      return this.$route.query.propertyId
    },
    newDate () {
      return this.$route.query.date + ',' + this.$route.query.date
    },
    newTime () {
      var year = moment(this.$route.query.date).format('YYYY')
      var seWeek = moment(this.$route.query.date).format('dddd')
      var HH = moment(this.$route.query.date).format('MM-DD')
      var week
      switch (seWeek) {
        case 'Monday':
          week = '星期一'
          break
        case 'Tuesday':
          week = '星期二'
          break
        case 'Wednesday':
          week = '星期三'
          break
        case 'Thursday':
          week = '星期四'
          break
        case 'Friday':
          week = '星期五'
          break
        case 'Saturday':
          week = '星期六'
          break
        case 'Sunday':
          week = '星期日'
          break
      }
      var coverTime = this.$route.query.date + '  ' + week
      var dateTime = HH + '  ' + week
      this.$store.commit('reportYear', year)
      this.$store.commit('companyDateTime', dateTime)
      this.$store.commit('coverDateTime', coverTime)
      return this.$route.query.date
    }

  },
  watch: {
  },
  activated () {
  },
  mounted () {
    let token = this.$route.query.token
    setToken(token, 1)
    this.parameterData()
  },
  methods: {
    handleParameterData (data) {
      this.bzId = []
      this.companyId = data.company_id
      data.property.forEach((e) => {
        if (Number(e.property_id) === Number(this.propertyId)) {
          this.$store.commit('companyName', e.name)
          this.$store.commit('headerData', { text: e.name, value: e.property_id, img: e.map_url })
          this.bzId.push({
            bzid: e.bzid,
            property_id: e.property_id,
            name: e.name
          })
        }
      })
      this.reportQuery()
    },
    parameterData () { // 查找对应的 购物中心 id
      const organizationData = this.$store.state.home.organizationData
      if (organizationData && organizationData.property) {
        this.handleParameterData(organizationData)
      } else {
        getGroupOrganization().then(res => {
          this.$store.commit('saveOrganizationData', res.data.data)
          this.handleParameterData(res.data.data)
        })
      }
    },
    reportQuery () { // 点击查询
      var that = this
      var bzid = []
      _.forEach(that.bzId, function (value) {
        bzid.push(value.bzid)
      })
      let propertyId = this.propertyId

      Promise.all([
        postHistorycompute({ companyId: that.companyId, timeRange: that.newTime + ',' + that.newTime }),
        /* 第三页数据接口 */
        reportCompare(bzid.toString(), 'enter', that.newDate, '1h', 'store'),
        getanalysiseeo({ bzid: bzid.toString(), type: 'occupancy', range: that.newDate, innerRange: '1h' }),
        getanalysiseeo({ bzid: bzid.toString(), type: 'enter', range: that.newDate, innerRange: '1h' }),
        /* 第四页数据接口 */
        fetchCompany(that.newDate, 'enter,occupancy', that.bzId[0].bzid),
        /* 第六页数据接口 */
        fetchEntity(that.newDate, 'gate', propertyId),
        // 区域数据接口
        getReportArea({ property_id: propertyId, time: that.newDate, type: 'Hour' }),
        // 业态商铺接口
        getReportFormat({ property_id: propertyId, time: that.newDate, type: 'Hour' })

      ]).then(function (res) {
        that.enterListData = res[0].data.data.property
        /* 第三数据 */
        var threeEnterData = res[1].data.data
        var threeOccupancyData = res[2].data.data
        var threeTableData = res[3].data.data
        var threeAgeGender = []
        that.threeReportData(threeEnterData, threeOccupancyData, threeTableData, threeAgeGender)
        /* 第四页数据 */
        that.fourReportData(res[4].data.data)
        /* 第六页数据 */
        // that.sixReportData(res[5].data.data)
        if (that.isShopArea) {
          // 区域数据
          that.areaDataList(res[6].data.data)
          // 业态商铺数据
          that.formatData(res[7].data.data)
        }
        let ht = window.location.href.split('://')[0]
        let size = 1 + that.fourListData.length
        that.paginationNumber = '共' + size + '页'
        setTimeout(() => {
          axios.get(ht + '://pdfcenter.linkdome.cn/pdf/finish', {
            params: {
              filename: that.newTime
            }
          })
            .then(function (response) {
            })
        }, 3000)
      })
    },
    /* 第三页数据 */
    threeReportData (data1, data2, data3, data4) {
      var that = this
      var lineData = []
      var lineTime = []
      var oneEnterData = data1
      var titleData = [
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu1.webp'),
          name: '累计客流',
          action: true,
          data: 0,
          male: '0%',
          female: '0%'
        },
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu2.webp'),
          name: '客流峰值',
          data: 0,
          time: ''
        },
        // {
        //   img: require('@/assets/images/fixation_img/logo/837398fc2219715c1fb81436befe6e7.webp'),
        //   name: '集客量峰值',
        //   data: 0,
        //   time: ''
        // },
        {
          img: require('@/assets/images/fixation_img/logo/icon_report_menu4.webp'),
          name: '平均客流量',
          data: 0,
          time: '每小时'
        }
      ]

      var enterList = {}
      enterList.name = '客流量'
      enterList.data = []
      enterList.color = '#826bf1'
      oneEnterData.forEach(function (e) {
        lineTime.push(moment(e.begin).format('HH:mm'))
        enterList.data.push(e.compares[0].number)
      })
      lineData.push(enterList)
      // var oneOccupancyData = data2
      // var occupancyList = {}
      // occupancyList.name = '集客量'
      // occupancyList.data = []
      // occupancyList.color = '#1aaaeb'
      // oneOccupancyData.forEach(function (e) {
      //   var size = e.occupancy
      //   Number(size) < 0 ? size = 0 : size = Number(size)
      //   occupancyList.data.push(size)
      // })
      // lineData.push(occupancyList)

      var name = this.property_name
      var allEnterData = _.find(that.enterListData, function (o) { return o.property_id == that.propertyId })

      var totalData = []
      var femaleData = []
      var maleData = []

      data4.forEach(function (e) {
        totalData.push(e.famale + e.male)
        femaleData.push(e.famale)
        maleData.push(e.male)
      })

      var total = _.reduce(totalData, function (sum, n) { return sum + n }, 0)
      var female = _.reduce(femaleData, function (sum, n) { return sum + n }, 0)
      var male = _.reduce(maleData, function (sum, n) { return sum + n }, 0)

      if (total == 0) {
        titleData[0].male = '0%'
        titleData[0].female = '0%'
      } else {
        titleData[0].male = (male / total).toFixed(2) * 100 + '%'
        titleData[0].female = (female / total).toFixed(2) * 100 + '%'
      }
      titleData[0].data = allEnterData.enter.total.number.toLocaleString()
      if (allEnterData.enter.highest.number == null) {
        titleData[1].data = 0
        titleData[1].time = ''
      } else {
        titleData[1].data = allEnterData.enter.highest.number.toLocaleString()
        var time = allEnterData.enter.highest.timeRange.split('-')
        var date1 = time[2].split(' ')[1]
        var date2 = time[5].split(' ')[1]
        titleData[1].time = date1 + ' - ' + date2
      }
      // titleData[2].data = allEnterData.occupancy.highest.number.toLocaleString()
      // var occupancyTime = allEnterData.occupancy.highest.timeRange.split('-')
      // var occupancyDate1 = occupancyTime[2].split(' ')[1]
      // var occupancyData2 = occupancyTime[5].split(' ')[1]
      // titleData[2].time = occupancyDate1 + ' - ' + occupancyData2
      titleData[2].data = allEnterData.enter.avg.number
      var xAxisData = []
      var seriesData = []
      var seriesList = {}
      seriesList.name = '客流量'
      seriesList.color = '#745aef'
      seriesList.data = []

      var twoEnterRakingData = _.orderBy(data3, ['enter'], 'desc')
      twoEnterRakingData.forEach(function (e) {
        xAxisData.push(e.name)
        seriesList.data.push(e.enter)
      })
      seriesData.push(seriesList)
      that.$refs.coverThreeData.dataList(name, titleData, lineTime, lineData, xAxisData, seriesData)
    },
    /* 第四页数据 */
    fourReportData (data) {
      var allData = []
      var allDataTwo = []
      this.fourListData = []
      _.forEach(data, function (e) {
        var obj = {}
        obj.name = moment(e.begin).format('HH:mm') + '-' + moment(e.begin).format('HH') + ':59'
        obj.age = e.enter.toLocaleString() + '人'
        var size = Number(e.occupancy)
        size < 0 ? size = 0 : size = e.occupancy.toLocaleString()
        // obj.address = size + '人'
        if (allData.length < 20) allData.push(obj)
        else allDataTwo.push(obj)
      })
      this.fourListData.push(allData)
      if (allDataTwo.length > 0) this.fourListData.push(allDataTwo)
      let obj = {
        propertyName: this.property_name,
        titleType: '客流总览',
        tableName: '详细客流数据',
        tableTitle: ['时间', '客流量'],
        pageNumber: 0
      }
      setTimeout(() => {
        this.fourListData.map((val, index) => {
          obj.pageNumber = 2 + index
          this.$refs.coverFourData[index].dataList(obj, val)
        })
      })
    },
    /* 第六页数据 */
    sixReportData (data1) {
      var tableList = []
      var tableData = _.orderBy(data1, ['enter'], 'desc')
      _.forEach(tableData, function (e) {
        if (tableList.length < 10) {
          var obj = {}
          obj.name = e.name
          obj.age = e.enter.toLocaleString() + '人'
          obj.address = e.highest.number + '人 ' + ' ' +
          moment(e.highest.begin).format('HH:mm') + ' - ' + moment(e.highest.begin).format('HH') + ':59'
          // obj.date = Math.floor(e.enter / 15).toLocaleString() + '人'
          obj.date = e.avg.toLocaleString() + '人'
          tableList.push(obj)
        }
      })

      var rakingEnterData = []
      var rakingEnterTime = []
      var AccountedData = []
      var rakingList = {}
      rakingList.name = '客流量'
      rakingList.color = '#745aef'
      rakingList.data = []
      var listEnter = _.orderBy(data1, ['enter'], 'desc')
      _.forEach(listEnter, function (e, listIndex) {
        if (listIndex < 10) {
          rakingEnterTime.push(e.name)
          rakingList.data.push(e.enter)
          if (e.enter != 0) {
            var AccountedList = {}
            AccountedList.name = e.name
            AccountedList.y = e.enter
            AccountedData.push(AccountedList)
          }
        }
      })
      rakingEnterData.push(rakingList)
      var name = this.property_name
      var pageNumber = 2 + this.fourListData.length
      this.$refs.coverSixData.tableList(name, tableList, rakingEnterTime, rakingEnterData, _.shuffle(AccountedData), pageNumber)
    },
    // 区域数据
    areaDataList (data) {
      let allData = []
      data.forEach(val => {
        if (allData.length < 20) allData.push(this.fromatsDataDispose(val))
      })
      let DataName = {
        propertyName: this.property_name,
        titleType: '商铺区域分析',
        tableName: '区域客流排行',
        tableTitle: ['区域名称', '客流量', '客流量峰值'],
        pageNumber: 4
      }
      // this.$refs.areaList.dataList(DataName, allData)
    },
    // 业态数据
    formatData (data) {
      this.formatList = []
      data.forEach((list, index) => {
        let formatObj = {}
        formatObj.name = list.name
        formatObj.toTen = []
        formatObj.afterTen = []
        // 从大到小
        let to10 = _.orderBy(list.shops, ['visits'], ['desc'])
        // 从小到大
        let after10 = []
        if (list.shops.length > 10) after10 = _.reverse(to10)

        // 前10数据
        to10.forEach(val => {
          if (formatObj.toTen.length < 10) {
            formatObj.toTen.push(this.fromatsDataDispose(val))
          }
        })
        // 后10数据
        after10.forEach(val => {
          if (formatObj.afterTen.length < 10) {
            formatObj.afterTen.push(this.fromatsDataDispose(val))
          }
        })
        this.formatList.push(formatObj)
      })
      let DataName = {
        propertyName: this.property_name,
        titleType: '商铺区域分析',
        tableTitle: ['区域名称', '客流量', '客流量峰值'],
        formatName: '',
        pageNumber: 0
      }
      setTimeout(() => {
        this.formatList.forEach((list, index) => {
          DataName.formatName = list.name
          DataName.pageNumber = 5 + index
          this.$refs.formatList.dataList(DataName, list.toTen, list.afterTen)
        })
        //
      })
    },
    fromatsDataDispose (val) {
      let obj = {}
      let age
      let address
      if (val.visits == '-') age = '-'
      else {
        age = Number(val.visits) > 0 ? Number(val.visits) : 0
        age = age.toLocaleString() + '人'
      }
      if (val.peakVisit == '-') address = '-'
      else {
        let dateTime = val.peakTime.split(' ')
        let date = dateTime[0] + ' ' + dateTime[1]
        let hourDate = moment(date).format('HH')
        address = Number(val.peakVisit) > 0 ? Number(val.peakVisit) : 0
        address = address.toLocaleString() + '人' + ' ' + hourDate + ' : 00' + ' - ' + hourDate + ' : 59'
      }
      obj.name = val.name
      obj.age = age
      obj.address = address
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
#pdfDom{
    background-color: #fff;
    // margin: 0 auto;
    overflow: hidden;
    width: 1200px;
    .reportOneText{
      float: left;
    }
}
</style>
