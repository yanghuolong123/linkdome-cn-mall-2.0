<template>
    <div class="report-center">
        <div class="pdf-text-box">
          <div id="pdfDom" >
              <report-day-cover ref="coverData" :pageNumber="paginationNumber" :reportType="reportT" ></report-day-cover>
              <report-monthly-one  ref="cover_one_data"></report-monthly-one>
              <!-- <report-monthly-sequential ref = 'cover_sequential_data'></report-monthly-sequential> -->
              <!-- <report-monthly-two  ref="cover_two_data"></report-monthly-two> -->
              <report-monthly-three
              :key='index' v-for="(list,index) in floorListData"
              :dataValue="list" :pageNumber='index'
              :floorNumber='index'
              ></report-monthly-three>
              <report-monthly-seven
              v-for="(item,index) in holiyData" :key="index"
              :res ="item" :holiyDayInfo="allholidays[index]"
              :pageNumber='floorListData.length+index+4'
              ></report-monthly-seven>
              <div v-if="isShopArea" id="pdfArea">
                <report-day-list-four ref="areaList" ></report-day-list-four>
                <report-day-list-format  ref='formatList'
                :key="FIndex" v-for="(format,FIndex) in formatList"
                ></report-day-list-format>
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

import reportMonthlySequential from '@/components/monthly-report/report_monthly_sequential'

/* api 接口 */
import { getGroupOrganization, postHistorycompute, getanalysiseeo } from '@/api/home'
import {
  monthlyCameraList,
  getReportArea,
  getReportFormat
  // monthlySequential
} from '@/api/report'
import reportMixins from '@/components/monthly-report/reportMixin'
import { setToken } from '@/libs/util'
import moment from 'moment'
import _ from 'lodash'
import axios from 'axios'
export default {
  name: 'download-report-month',
  mixins: [reportMixins],
  components: {
    reportDayCover,
    reportMonthlyOne,
    reportMonthlyTwo,
    reportMonthlyThree,
    reportMonthlySeven,
    reportDayCoverBack,
    reportDayListFour,
    reportDayListFormat,
    reportMonthlySequential
  },
  data () {
    return {
      isShopArea: false,
      paginationNumber: '',
      reportT: '月报',
      selectDateTime: '',
      floorListData: [],
      reportName: '',
      newDate: '',
      newTime: '',
      companyId: '',
      bzId: [],
      property_name: '',
      formatList: []
    }
  },
  computed: {
    propertyid () {
      return this.$route.query.propertyId
    }
  },
  mounted () {
    let token = this.$route.query.token
    setToken(token, 1)
    this.selectTimeDate(this.$route.query.date)
    this.parameterData()
  },
  methods: {
    parameterData () { // 查找对应的 购物中心 id
      var that = this
      getGroupOrganization().then(res => {
        that.bzId = []
        that.companyId = res.data.data.company_id
        res.data.data.property.forEach((e) => {
          if (e.property_id == this.propertyid) {
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
        that.reportQuery()
      })
    },
    reportQuery () { // 点击查询
      var that = this
      var bzid = []
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

        /* 节假日数据 */
        that.holiyData = res[3]

        /* 第二页 出入口数据 */
        var sixData = res[2].data.data
        // that.$refs.cover_two_data.tableList(sixData)
        that.floorListData = Object.values(sixData)

        // 区域数据
        that.areaDataList(res[4].data.data)
        // 业态商铺数据
        that.formatData(res[5].data.data)

        // 同环比数据
        // that.$refs.cover_sequential_data.occupancyList(dataOne)
        // that.$refs.cover_sequential_data.dataList(res[6].data.data)

        var size = that.holiyData.length + that.floorListData.length + 1
        that.paginationNumber = '共' + size + '页'
        let ht = window.location.href.split('://')[0]
        setTimeout(() => {
          axios.get(ht + '://pdfcenter.linkdome.cn/pdf/finish', {
            params: {
              filename: that.newTime
            }
          })
            .then(function (response) {
            })
        }, 12000)
      })
    },
    selectTimeDate (value) {
      var year = moment(value).format('YYYY')
      var MM = moment(value).format('M')
      this.$store.commit('coverDateTime', value)
      this.$store.commit('companyDateTime', MM + '月')
      this.$store.commit('reportYear', year)
      var startTime = moment(value).startOf('month')
      var endTime = moment(value).endOf('month')
      this.newDate = moment(startTime).format('YYYY-MM-DD') + ',' + moment(endTime).format('YYYY-MM-DD')
      this.newTime = value
    },
    areaDataList (data) {
      let allData = []
      data.forEach(val => {
        allData.push(this.fromatsDataDispose(val))
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
      setTimeout(() => {
        this.formatList.forEach((list, index) => {
          let DataName = {
            propertyName: this.property_name,
            titleType: '商铺区域分析',
            tableTitle: ['区域名称', '客流量', '客流量峰值'],
            formatName: list.name,
            pageNumber: 5 + this.floorListData.length + index
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
<style lang="less" scoped>
    #pdfDom{
        background-color: #fff;
        // margin: 0 auto;
        width: 1200px;
        overflow: hidden;
        .reportOneText{
          float: left;
        }
    }
</style>
