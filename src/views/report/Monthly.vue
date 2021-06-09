<template>
    <div class="report-center">
        <div style="width: 100%; margin-bottom: 21px">
            <div class="month-report-date">
                <Row style="float: left">
                    <Col span="12">
                      <DatePicker
                        type="month"
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
        <div
          class="pdf-text-box"
          v-bind:class="{pdfAction:showPDF}"
        >
          <div id="pdfDom" >
              <report-day-cover ref="coverData" :pageNumber="paginationNumber" :reportType="reportT" ></report-day-cover>
              <report-monthly-one  ref="cover_one_data"></report-monthly-one>
              <!-- <report-monthly-sequential ref = 'cover_sequential_data'></report-monthly-sequential> -->
              <!-- <report-monthly-two  ref="cover_two_data"></report-monthly-two> -->
              <report-monthly-three
                :key='index' v-for="(list,index) in floorListData"
                :dataValue="list" :pageNumber='index'
                :floorNumber='index'
              >
              </report-monthly-three>
              <report-monthly-seven
                v-for="(item,index) in holiyData" :key="index"
                :res ="item" :holiyDayInfo="allholidays[index]"
                :pageNumber='floorListData.length+index+3'
              >
              </report-monthly-seven>
              <div v-if="isShopArea" id="pdfArea">
                <report-day-list-four ref="areaList" ></report-day-list-four>
                <report-day-list-format  ref='formatList'
                  :key="FIndex" v-for="(format,FIndex) in formatList"
                >
                </report-day-list-format>
              </div>
               <report-day-cover-back></report-day-cover-back>
          </div>
        </div>
    </div>
</template>
<script>
/* 页面引入 */
import reportDayCover from '@/components/report/report_day_cover'
import reportDayCoverBack from '@/components/report/report_day_back_cover'
import reportMonthlyOne from '@/components/monthly-report/report_monthly_one'
import reportMonthlyTwo from '@/components/monthly-report/report_monthly_two'
import reportMonthlyThree from '@/components/monthly-report/report_monthly_three'
import reportMonthlySeven from '@/components/monthly-report/report_monthly_seven'

import reportDayListFour from '@/components/report/report_day_list_four'
import reportDayListFormat from '@/components/report/report_day_list_format'

// import reportMonthlySequential from '@/components/monthly-report/report_monthly_sequential'

/* api 接口 */
import { getGroupOrganization, postHistorycompute, getanalysiseeo } from '@/api/home'
import {
  monthlyCameraList,
  getReportArea,
  getReportFormat
  // monthlySequential
} from '@/api/report'

import moment from 'moment'
import _ from 'lodash'
import reportMixins from '@/components/monthly-report/reportMixin'
import { getToken } from '@/libs/util'
import axios from 'axios'
export default {
  name: 'report-month',
  mixins: [reportMixins],
  components: {
    reportDayCover,
    reportMonthlyOne,
    reportMonthlyTwo,
    reportMonthlyThree,
    reportMonthlySeven,
    reportDayCoverBack,
    reportDayListFour,
    reportDayListFormat
    // reportMonthlySequential
  },
  data () {
    return {
      isShopArea: false,
      paginationNumber: '',
      reportT: '月报',
      selectDateTime: '',
      floorListData: [],
      showPDF: false,
      newDate: '',
      newTime: '',
      companyId: '',
      bzId: [],
      property_name: '',
      options3: {
        disabledDate (date) {
          var curDate = new Date()
          /* 获取当前月份 */
          var curMonth = curDate.getMonth()
          /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
          curDate.setMonth(curMonth + 1)
          /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
          curDate.setDate(0)
          /* 返回当月的天数 */
          var size = curDate.getDate()
          return date && date.valueOf() > Date.now() - 86400000 * size
        }
      },
      formatList: []
    }
  },
  computed: {
    propertyid () {
      return this.$store.state.home.headerAction
    }
  },
  watch: {
    '$store.state.home.headerAction' () {
      this.selectDateTime = ''
      this.showPDF = false
      let routerName = this.$router.currentRoute.name
      if (routerName === 'MonthReport') { this.parameterData() }
    }
  },
  activated () {
    this.parameterData()
  },
  mounted () {},
  methods: {
    parameterData () { // 查找对应的 购物中心 id
      var that = this
      that.showPDF = false
      getGroupOrganization().then(res => {
        that.bzId = []
        that.companyId = res.data.data.company_id
        res.data.data.property.forEach((e) => {
          if (e.property_id === this.propertyid) {
            that.$store.commit('companyName', e.name)
            that.$store.commit('headerData', { text: e.name, value: e.property_id, img: e.map_url })
            that.property_name = e.name
            var obj = {}
            obj.bzid = e.bzid
            obj.property_id = e.property_id
            obj.name = e.name
            that.bzId.push(obj)
          }
        })
      })
    },
    reportQuery () { // 点击查询
      var that = this
      if (that.newDate === '') { alert('请选择时间'); return false }
      try {
        window.TDAPP.onEvent('月报分析页面', '数据查询', {
          时间段: that.newDate
        })
      } catch (error) {
        console.log('月报分析页面-数据查询-埋点error:' + error)
      }
      var bzid = []
      that.showPDF = false
      _.forEach(that.bzId, function (value) { bzid.push(value.bzid) })
      let propertyId = that.propertyid
      Promise.all([
        postHistorycompute({ companyId: that.companyId, timeRange: that.newDate }),
        getanalysiseeo({ bzid: bzid.toString(), type: 'enter', range: that.newDate, innerRange: '1day' }),
        monthlyCameraList(propertyId, that.newDate),
        /** 节假日数据接口 */
        that.fetchData(bzid.toString(), that.newTime),
        // 区域数据接口
        getReportArea({ property_id: propertyId, time: that.newDate, type: 'Month' }),
        // 业态商铺接口
        getReportFormat({ property_id: propertyId, time: that.newDate, type: 'Month' })
        // 同环比数据
        // monthlySequential({ companyId: that.companyId, timeRange: that.newDate })
      ]).then(function (res) {
        /* 第一页 客流总览 */
        var dataOne = res[0].data.data
        that.$refs.cover_one_data.occupancyList(dataOne)

        /* 第一页 客流趋势 */
        var dataTwo = res[1].data.data
        that.$refs.cover_one_data.dataList(dataTwo)

        /** 节假日数据 */
        that.holiyData = res[3]

        /* 第二页 出入口数据 */
        var sixData = res[2].data.data
        // that.$refs.cover_two_data.tableList(sixData)
        that.floorListData = Object.values(sixData)
        // 同环比数据
        // that.$refs.cover_sequential_data.occupancyList(dataOne)
        // that.$refs.cover_sequential_data.dataList(res[6].data.data)

        // 区域数据
        that.areaDataList(res[4].data.data)
        // 业态商铺数据
        that.formatData(res[5].data.data)

        var size = that.holiyData.length + that.floorListData.length + 1
        that.paginationNumber = '共' + size + '页'
        that.showPDF = true
      })
    },
    uploadReport () {
      console.log('下载最新代码')
      if (this.selectDateTime === '') { alert('请选择时间'); return false }
      let token = getToken()
      let pdfUrl = window.location.href.split('/#/')[0]
      let objName = (pdfUrl.split('://')[1]).split('.')[0]
      let ht = pdfUrl.split('://')[0]
      let url = pdfUrl + '/#/downloadMonthPdf?propertyId=' + this.propertyid + '&date=' + this.newTime + '&token=' + token
      this.$vs.loading()
      // 发送 POST 请求
      axios.post(ht + '://pdfcenter.linkdome.cn/pdf/execute', { filename: this.newTime, project: objName, url: url }, { responseType: 'blob' })
        .then((response) => {
          this.$vs.loading.close()
          var blob = new Blob([response.data])
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = this.newDate + '月报.pdf' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          // axios.get(ht + '://pdfcenter.linkdome.cn/pdf/delete')
          //   .then(res => {
          //     console.log('删除成功')
          //   })
        })
        .catch(function (error) {
          console.log(error)
        })
      try {
        window.TDAPP.onEvent('月报分析页面', '下载', {})
      } catch (error) {
        console.log('月报分析页面-下载-埋点error:' + error)
      }
    },
    selectTimeDate (value) {
      if (value == '') { this.newDate = ''; return false }
      var year = moment(value).format('YYYY')
      var MM = moment(value).format('M')
      var startTime = moment(value).startOf('month')
      var endTime = moment(value).endOf('month')
      this.$store.commit('coverDateTime', value)
      this.$store.commit('companyDateTime', MM + '月')
      this.$store.commit('reportYear', year)
      this.newDate = moment(startTime).format('YYYY-MM-DD') + ',' + moment(endTime).format('YYYY-MM-DD')
      this.newTime = value
    },
    areaDataList (data) {
      let allData = []
      data.forEach(val => {
        allData.push(this.fromatsDataDispose(val))
      })
      let size = 3 + this.floorListData.length
      let DataName = {
        propertyName: this.property_name,
        titleType: '商铺区域分析',
        tableName: '区域客流排行',
        tableTitle: ['区域名称', '客流量', '客流量峰值'],
        pageNumber: size
      }
      if (this.isShopArea) this.$refs.areaList.dataList(DataName, allData)
    },
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
        let after10
        if (list.shops.length > 10) after10 = _.reverse(to10)
        else after10 = []

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
        if (this.isShopArea) {
          this.formatList.push(formatObj)
        }
      })
      setTimeout(() => {
        this.formatList.forEach((list, index) => {
          let DataName = {
            propertyName: this.property_name,
            titleType: '商铺区域分析',
            tableTitle: ['区域名称', '客流量', '客流量峰值'],
            formatName: list.name,
            pageNumber: 4 + this.floorListData.length + index
          }
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
        address = Number(val.peakVisit) > 0 ? Number(val.peakVisit) : 0
        address = address.toLocaleString() + '人' + ' ' + val.peakTime
      }
      obj.name = val.name
      obj.age = age
      obj.address = address
      return obj
    }
  },
  created () {}

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
    .pdf-text-box{
        background-color: #fff;
        height: 0;
        overflow: hidden;
    }
    .pdfAction{
        height: auto!important;
    }
    .month-report-date{
      box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
      border-radius: 6px;
      margin-top: 9px;
      padding: 20px 0 20px 30px;
      background-color: #fff;
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
        &::before{
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
