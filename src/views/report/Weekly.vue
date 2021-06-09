<template>
<div class="report-center">
  <!-- 选择日期 查看 下载 -->
  <div style="width: 100%; margin-bottom: 21px">
    <div class="day-report-date">
        <Row  class="week-select-date">
          <Col span="12">
            <DatePicker
              type="date"
              @on-change="selectTimeDate"
              @on-open-change = selectDate
              :editable="false"
              :options="options3"
              placeholder="选择日期"
              style="width: 230px"
              :format="weekShowText"
              v-model="selectDateTime"
            >
            </DatePicker>
          </Col>
        </Row>
        <div class="report-query" v-on:click="reportQuery">提取</div>
        <div class="icon-download" v-on:click="uploadReport" title="下载报告">
          <icons type="daoru" color="#2a7dc1" :size = 20 ></icons>
        </div>
        <div style="clear: both"></div>
    </div>
  </div>
  <!-- pdf 内容 -->
  <div class="pdf-text-box" v-bind:class="{pdfAction:showPDF}">
    <div id="pdfDom">
      <report-day-cover ref="coverData" :pageNumber="paginationNumber" :reportType="reportT"  key="surface " ></report-day-cover>
      <report-week-one  ref="cover_one_data" key="first" :computedData="eeoComputedRes"></report-week-one>
      <report-week-two  ref="cover_two_data" key="second"></report-week-two>
      <report-week-six  ref="cover_six_data" key="third"></report-week-six>
      <report-week-three
        :key='index' v-for="(list,index) in floorListData"
        :dataValue="list"
        :floorNumber="index"
        :pageNumber='4+index'
      ></report-week-three>
      <div v-if="isShopArea">
        <report-day-list-four ref="areaList" ></report-day-list-four>
        <report-day-list-format ref='formatList' :key="FIndex" v-for="(format,FIndex) in formatList" ></report-day-list-format>
      </div>
       <report-day-cover-back key="last"></report-day-cover-back >
    </div>
  </div>
</div>
</template>
<script>
import reportDayCover from '@/components/report/report_day_cover'
import reportDayCoverBack from '@/components/report/report_day_back_cover'

import reportWeekOne from '@/components/week-report/report_week_one'
import reportWeekTwo from '@/components/week-report/report_week_two'
import reportWeekThree from '@/components/week-report/report_week_three'
import reportWeekSix from '@/components/week-report/report_week_six'
import reportDayListFour from '@/components/report/report_day_list_four'
import reportDayListFormat from '@/components/report/report_day_list_format'

import { getGroupOrganization, postHistorycompute, getanalysiseeo } from '@/api/home'
import { monthlyCameraList, eeoComputed, getReportArea, getReportFormat } from '@/api/report'

import { getToken } from '@/libs/util'
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
export default {
  name: 'report-week',
  components: {
    reportDayCover,
    reportWeekOne,
    reportWeekTwo,
    reportWeekThree,
    reportWeekSix,
    reportDayCoverBack,
    reportDayListFour,
    reportDayListFormat
  },
  data () {
    return {
      isShopArea: false,
      paginationNumber: '',
      reportT: '周报',
      selectDateTime: '',
      weekShowText: '',
      floorListData: [],
      showPDF: false,
      newDate: '',
      newDateEnd: '',
      companyId: '',
      bzId: [],
      property_name: '',
      options3: {
        disabledDate (date) {
          var week = moment().locale('zh').format('d')
          if (Number(week) == 0) week = 7
          return date && date.valueOf() > Date.now() - 86400000 * (Number(week))
        }
      },
      eeoComputedRes: [],
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
      if (routerName === 'WeekReport') { this.parameterData() }
    }
  },

  activated () {
    this.parameterData()
  },
  mounted () {
  },
  methods: {
    parameterData () { // 查找对应的 购物中心 id
      var that = this
      that.showPDF = false
      getGroupOrganization().then(function (res) {
        that.companyId = res.data.data.company_id
        that.bzId = []
        res.data.data.property.forEach(function (e) {
          if (e.property_id === that.propertyid) {
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
      if (that.newDate == '') {
        alert('请选择时间')
        return false
      }
      try {
        window.TDAPP.onEvent('周报分析页面', '数据查询', {
          时间段: that.newDate
        })
      } catch (error) {
        console.log('周报分析页面-数据查询-埋点error:' + error)
      }
      that.showPDF = false
      let propertyId = this.propertyid
      var bzid = []
      _.forEach(that.bzId, function (value) { bzid.push(value.bzid) })
      Promise.all([
        postHistorycompute({ companyId: that.companyId, timeRange: that.newDate }),
        getanalysiseeo({ bzid: bzid.toString(), type: 'enter', range: that.newDate, innerRange: '1day' }),
        getanalysiseeo({ bzid: bzid.toString(), type: 'enter', range: that.newDateEnd, innerRange: '1day' }),
        eeoComputed({ timeRange: that.newDate, propertyid: propertyId }),
        // 本周
        monthlyCameraList(propertyId, that.newDate),
        // 上周
        monthlyCameraList(propertyId, that.newDateEnd),
        // 区域
        getReportArea({ property_id: propertyId, time: that.newDate, type: 'Date' }),
        // 业态 商铺
        getReportFormat({ property_id: propertyId, time: that.newDate, type: 'Date' })
      ]).then(function (res) {
        // 第一页
        var dataOne = res[0].data.data
        that.$refs.cover_one_data.occupancyList(dataOne)
        // 第二页
        var dataTwo = res[1].data.data
        var dataThree = res[2].data.data
        that.eeoComputedRes = res[3].data.data
        that.$refs.cover_one_data.dataList(dataTwo, dataThree)

        /* 楼层数据 */
        var sixData = res[4].data.data
        let gateData = Object.values(sixData)
        that.floorListData = gateData

        let lastWeekData = res[5].data.data// 传递上周数据
        that.$refs.cover_two_data.tableList(gateData, Object.values(lastWeekData))
        that.$refs.cover_six_data.dataList(gateData)
        // 区域数据
        that.areaDataList(res[6].data.data)
        // 业态 商铺 数据
        that.formatData(res[7].data.data)
        // 计算总共页数
        var size
        if (that.isShopArea) {
          size = that.floorListData.length + 4 + that.formatList.length
        } else {
          size = that.floorListData.length + 3
        }
        that.paginationNumber = '共' + size + '页'
        that.showPDF = true
      })
    },
    uploadReport () {
      var that = this
      if (that.selectDateTime === '') { alert('请选择时间'); return false }

      let date = moment(this.selectDateTime).format('YYYY/MM/DD')
      let token = getToken()
      let pdfUrl = window.location.href.split('/#/')[0]
      let ht = pdfUrl.split('://')[0]
      let objName = (pdfUrl.split('://')[1]).split('.')[0]
      let url = pdfUrl + '/#/downloadWeekPdf?propertyId=' + this.propertyid + '&date=' + date + '&token=' + token
      this.$vs.loading()

      // 发送 POST 请求
      axios.post(ht + '://pdfcenter.linkdome.cn/pdf/execute', { filename: this.newDate, project: objName, url: url }, { responseType: 'blob' })
        .then((response) => {
          this.$vs.loading.close()
          var blob = new Blob([response.data])
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = this.newDate + '周报.pdf' // 下载后文件名
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
        window.TDAPP.onEvent('周报分析页面', '下载', {})
      } catch (error) {
        console.log('周报分析页面-下载-埋点error:' + error)
      }
    },
    areaDataList (data) {
      let allData = []
      data.forEach(val => {
        if (allData.length < 20) allData.push(this.fromatsDataDispose(val))
      })
      let size = 4 + this.floorListData.length
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
          DataName.pageNumber = 5 + this.floorListData.length + index
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
    },
    // 获取选择那一周
    selectTimeDate (value) {
      var that = this
      if (value.length == 23) {
        that.newDate = ''
        that.weekShowText = ''
        that.selectDateTime = ''
        return false
      }
      var week_start = moment(value).startOf('isoweek').format('YYYY-MM-DD')
      var week_end = moment(value).endOf('isoweek').format('YYYY-MM-DD')
      that.newDate = week_start + ',' + week_end
      that.weekShowText = (week_start) + ' - ' + (week_end)

      var Last_week_date = moment(week_start).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      var last_week_start = moment(Last_week_date).startOf('isoweek').format('YYYY-MM-DD')
      var last_week_end = moment(Last_week_date).endOf('isoweek').format('YYYY-MM-DD')
      that.newDateEnd = last_week_start + ',' + last_week_end

      that.$store.commit('coverDateTime', that.weekShowText)
      var weekHeaderText = moment(week_start).format('MM-DD') + ' - ' + moment(week_end).format('MM-DD')
      that.$store.commit('companyDateTime', weekHeaderText)
      var year = moment(value).format('YYYY')
      this.$store.commit('reportYear', year)
    },
    selectDate (value) { if (value == true) this.weekShowText = '' }
  },
  created () {}

}
</script>
<style lang="less">
    .week-select-date{
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
    .day-report-date{
        margin-top: 9px;
        padding: 20px 0 20px 30px;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
        position: relative;
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
    .week-select-date{
        float: left;
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
        margin-left: 30px;
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
        min-width: 1200px;
        .reportOneText{
          float: left;
          width: 100%;
          height: auto;
          padding-bottom: 150px;
        }
    }
</style>
