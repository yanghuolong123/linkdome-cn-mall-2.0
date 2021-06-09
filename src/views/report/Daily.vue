<template>
  <div class="report-center">
    <div style="margin-bottom: 21px">
      <div class="day-report-date">
        <Row style="float: left">
          <Col span="12">
            <DatePicker
              type="date"
              @on-change="selectTimeDate"
              :editable="false"
              :options="options3"
              placeholder="选择日期"
              style="width: 230px"
              v-model="selectDateTime"
            >
            </DatePicker>
          </Col>
        </Row>
        <div class="report-query" v-on:click="reportQuery">查询</div>
        <div class="icon-download" v-on:click="uploadReport" title="下载报告">
			    <icons type="daoru" color="#2a7dc1" :size = 20 ></icons>
        </div>
        <div style="clear: both"></div>
      </div>
    </div>
    <div class="pdf-text-box" v-bind:class="{pdfAction:showPDF}">
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
          <!-- <report-day-list-format   ref='formatList' :key="FIndex" v-for="(format,FIndex) in formatList" ></report-day-list-format> -->
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
import { reportCompare, fetchCompany, fetchEntity, getReportArea, getReportFormat } from '@/api/report'

import { getToken } from '@/libs/util'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'report-day',

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
      selectDateTime: '',
      showPDF: false,
      newDate: '',
      newTime: '',
      companyId: '',
      bzId: [],
      enterListData: '',
      property_name: '',
      options3: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000
        }
      },
      formatList: [],
      fourListData: []
    }
  },
  computed: {
    propertyId () {
      return this.$store.state.home.headerAction
    }
  },
  watch: {
    '$store.state.home.headerAction' () {
      this.selectDateTime = ''
      this.showPDF = false
      let routerName = this.$router.currentRoute.name
      if (routerName === 'Report') { this.parameterData() }
    }
  },

  activated () {
    this.parameterData()
  },
  mounted () {
  },
  methods: {
    handleParameterData (data) {
      this.companyId = data.company_id
      data.property.forEach((e) => {
        if (Number(e.property_id) === Number(this.propertyId)) {
          this.$store.commit('companyName', e.name)
          this.$store.commit('headerData', { text: e.name, value: e.property_id, img: e.map_url })
          var obj = {}
          obj.bzid = e.bzid
          obj.property_id = e.property_id
          obj.name = e.name
          this.bzId.push(obj)
        }
      })
    },
    parameterData () { // 查找对应的 购物中心 id
      this.showPDF = false
      this.bzId = []
      const organizationData = this.$store.state.home.organizationData
      if (organizationData && organizationData.property) {
        this.handleParameterData(organizationData)
      } else {
        getGroupOrganization().then(res => {
          res = res.data.data
          this.$store.commit('saveOrganizationData', res)
          this.handleParameterData(res)
        })
      }
    },
    reportQuery () { // 点击查询
      var that = this
      if (that.newDate == '') { alert('请选择时间'); return false }
      try {
        window.TDAPP.onEvent('日报分析页面', '数据查询', {
          时间段: that.newDate
        })
      } catch (error) {
        console.log('日报分析页面-数据查询-埋点error:' + error)
      }
      var bzid = []
      that.showPDF = false
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
        that.showPDF = true

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

        let size = 1 + that.fourListData.length
        that.paginationNumber = '共' + size + '页'
      })
    },
    // 下载pdf
    uploadReport () {
      if (this.newTime === '') { alert('请选择时间'); return false }
      let pdfUrl = window.location.href.split('/#/')[0]
      let date = this.newTime
      let token = getToken()
      let objName = (pdfUrl.split('://')[1]).split('.')[0]
      let ht = pdfUrl.split('://')[0]
      let url = pdfUrl + '/#/downloadDayPdf?propertyId=' + this.propertyId + '&date=' + date + '&token=' + token
      this.$vs.loading()
      axios.post(ht + '://pdfcenter.linkdome.cn/pdf/execute', { filename: date, project: objName, url: url }, { responseType: 'blob' })
        .then((response) => {
          this.$vs.loading.close()
          var blob = new Blob([response.data])
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = date + '日报.pdf' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        })
        .catch(function (error) {
          console.log(error)
        })
      try {
        window.TDAPP.onEvent('日报分析页面', '下载', {})
      } catch (error) {
        console.log('日报分析页面-下载-埋点error:' + error)
      }
    },
    selectTimeDate (value) {
      if (value == '') { this.newDate = ''; return false }
      var year = moment(value).format('YYYY')
      var seWeek = moment(value).format('dddd')
      var HH = moment(value).format('MM-DD')
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
      var dateTime = HH + '  ' + week
      var coverTime = value + '  ' + week
      this.$store.commit('coverDateTime', coverTime)
      this.$store.commit('companyDateTime', dateTime)
      this.$store.commit('reportYear', year)
      this.newDate = value + ',' + value
      this.newTime = value
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
      console.log(data)
      if (this.isShopArea) this.$refs.areaList.dataList(DataName, allData)
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
          this.$refs.formatList[index].dataList(DataName, list.toTen, list.afterTen)
        })
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
<style lang='less'>
.ivu-spin-fix .ivu-spin-main{
  margin-left: -24px;
  margin-top: -24px;
}
.day-report-date{
  .ivu-input{
    width: 230px;
    height: 43px;
    font-size: 16px;
    border: 1px solid rgba(0, 0, 0, .2);
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }
  .ivu-input-suffix{
    i{
      height: 43px;
      line-height: 43px;
    }
  }

}
</style>
<style lang="less" scoped>

.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 300px;
    position: relative;
    border: 1px solid #eee;
}

.pdf-text-box{
    background-color: #fff;
    height: 0;
    overflow: hidden;
}

.pdfAction{
    height: auto!important;
}
.day-report-type{
  display: inline-block;
  float: left;
  margin-top: 7px;
  p{
    display: inline-block;
    float: left;
    height: 45px;
    width: 120px;
    // background-color: #2d8cf0;
    text-align: center;
    font-size: 18px;
    color: #fff;
    line-height: 45px;
    margin-right: 30px;
    cursor: pointer;
    border-radius: 5px;
    &:last-child{
      margin-right: 0;
    }
    &:hover{
      background-color: #feb33d;
    }
  }
    .action{
        background-color: #9e9e9e !important;
    }
}
.title-name{
    font-size: 24px;
    color: #4096e5;
    font-weight: normal;
    border-left: 2px solid currentColor;
    line-height: 1;
    padding-left: 34px;
    margin-top: 15px;
    margin-left: 23px;
    float: left;
    position: relative;
}
.select-date-type{
    position: absolute;
    left: 100px;
    top:0;
    i{
        color: #4096E5!important;
    }
    .ivu-dropdown-menu{
      min-width: 55px!important;
    }
}
  .day-report-date{
    margin-top: 9px;
    padding: 20px 0 20px 30px;
    background-color: #fff;
    box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
    border-radius: 6px;
    .report-query{
      float: left;
      height: 43px;
      padding: .75rem 2rem;
      border-radius: 6px;
      background: #37b5ed!important;
      border: 1px solid #37b5ed;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      margin-left: 30px;
    }
  }
    .icon-download{
      width: 43px;
      height: 43px;
      border-radius: 50%;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      background-color: #fff;
      text-align: center;
      line-height: 43px;
      float: left;
      margin-left: 60px;
      box-shadow:0px 0px 9px 0px rgba(166, 168, 169, .4);
      cursor: pointer;
      &:before{
        content:none
      }
    }
    #pdfDom{
        background-color: #fff;
        margin: 0 auto;
        overflow: hidden;
        width: 80%;
        .reportOneText{
          float: left;
          width: 100%;
          height: auto;
          padding-bottom: 150px;
        }
    }
</style>
