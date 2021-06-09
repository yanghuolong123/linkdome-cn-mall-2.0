<template>
<div class="report-center">
  <div class="pdf-text-box">
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

import moment from 'moment'
import { setToken } from '@/libs/util'
import _ from 'lodash'
import axios from 'axios'
export default {
  name: 'download-report-week',
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
      reportDateName: '',
      paginationNumber: '',
      reportT: '周报',
      weekShowText: '',
      floorListData: [],
      newDate: '',
      newDateEnd: '',
      companyId: '',
      bzId: [],
      property_name: '',
      eeoComputedRes: [],
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
      getGroupOrganization().then((res) => {
        that.companyId = res.data.data.company_id
        that.bzId = []
        res.data.data.property.forEach((e) => {
          if (Number(e.property_id) == Number(that.propertyid)) {
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
        this.reportQuery()
      })
    },
    reportQuery () { // 点击查询
      var that = this
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
        let ht = window.location.href.split('://')[0]
        setTimeout(() => {
          axios.get(ht + '://pdfcenter.linkdome.cn/pdf/finish', {
            params: {
              filename: that.newDate
            }
          })
            .then(function (response) {
            })
        }, 10000)
      })
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
      var week_start = moment(value).startOf('isoweek').format('YYYY-MM-DD')
      var week_end = moment(value).endOf('isoweek').format('YYYY-MM-DD')
      that.newDate = week_start + ',' + week_end
      that.weekShowText = (week_start) + ' - ' + (week_end)

      that.reportDateName = moment(value).startOf('isoweek').format('YYYY/MM/DD') + '--' + moment(value).endOf('isoweek').format('YYYY/MM/DD')

      var Last_week_date = moment(week_start).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      var last_week_start = moment(Last_week_date).startOf('isoweek').format('YYYY-MM-DD')
      var last_week_end = moment(Last_week_date).endOf('isoweek').format('YYYY-MM-DD')
      that.newDateEnd = last_week_start + ',' + last_week_end

      that.$store.commit('coverDateTime', that.weekShowText)
      var weekHeaderText = moment(week_start).format('MM-DD') + ' - ' + moment(week_end).format('MM-DD')
      that.$store.commit('companyDateTime', weekHeaderText)
      var year = moment(value).format('YYYY')
      this.$store.commit('reportYear', year)
    }

  },
  created () {}

}
</script>
<style lang="less" scoped>
    #pdfDom{
        background-color: #fff;
        margin: 0 auto;
        overflow: hidden;
        width: 1200px;
         .reportOneText{
          float: left;
        }
    }
</style>
