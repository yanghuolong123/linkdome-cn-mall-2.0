<!-- =========================================================================================
销售分析排行占比分析,同时watch propertyId 和 time1,time2 请求数据，三个watch 在初始化的时候，同时触发，
使用防抖函数，避免同时触发
bussinessType:业态类型，缩写bizType
salesTarget:销售指标
footFall:客流
========================================================================================== -->
<template>
  <div class="p-6 bg-white box-card" style="margin-top:20px">
    <div class="ranking-selector-box flex items-center">
      <span class="mr-3">{{selectTitle}}</span>
      <vs-select v-model="bussinessType" autocomplete placeholder="请选择" noDataText="暂无数据">
        <vs-select-item
          v-for="item in withAllOptions"
          :value="item.value"
          :key="item.value"
          :text="item.text"
        />
      </vs-select>
    </div>
    <div class="ranking-box mt-3" v-if="isText"  >

      <div v-if="bizChartData!=false">
        <chart-tabs
          v-model="exportType"
          :xAxis="bizChartData.xAxis"
          :series="bizChartData.series"
          :tooltipUnit="tooltipUnit(bizIndicator)"
          :type="chartTypes"
          :extraOptions="bizExtraOptions"
          :istotal='istotal'
          :title="titleText.left"
          key="bizTop"
        >
          <span class="mx-4 text-sm" style="line-height:37px">数据指标:</span>
          <vs-select
            autocomplete
            v-model="bizIndicator"
            class="chartSelector"
            v-if="indicatorSelector"
          >
            <vs-select-item
              v-for="(item,index) in indicators "
              :text="item.name"
              :key="index"
              :value="item.value"
            />
          </vs-select>
          <export-menu slot="export" @onchange="exportBiztop"></export-menu>
        </chart-tabs>
      </div>
      <div v-if="topShopData!=false">
        <chart-tabs
          v-model="exportType"
          :xAxis="topShopData.xAxis"
          :series="topShopData.series"
          :tooltipUnit="tooltipUnit(shopIndicator)"
          :type="chartTypes"
          :extraOptions="extraOptions"
          :title="titleText.right"
          :isHome='true'
          :istotal='istotal'
          @getShopTableCoumn="getShopTableCoumn"
          @getShopTableData="getShopTableData"

          key="shopTop"
        >
          <export-menu slot="export" @onchange="exportShoptop"></export-menu>
          <span class="mx-4 text-sm"  style="line-height:37px">数据指标:</span>
          <vs-select
            autocomplete
            v-model="shopIndicator"
            class="chartSelector"
            v-if="indicatorSelector"
          >
            <vs-select-item
              v-for="(item,index) in indicators"
              :text="item.name"
              :key="index"
              :value="item.value"
            />
          </vs-select>

        </chart-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import chartTabs from '_c/common/CopyChartsTabs.vue'
import { mapActions } from 'vuex'
import {
  getTopBussinessType,
  getTopShop,
  getShopTopFootFall,
  getBizTopFootFall,
  exportBizXls,
  exportShopXls,
  flowexcel,
  flowstoreexcel
} from '@/api/home.js'
import { getBussinessDict, exportEx } from '@/api/home'
import salesDict from '@/views/home/components/salesIndicatorDict.js'
import exportMenu from './ExportMenu.vue'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'rankingAnalytics',
  components: {
    chartTabs,
    exportMenu
  },
  props: {
    time1: {
      type: String,
      default: null
    },
    time2: {
      type: String,
      default: null
    },
    propertyId: {
      type: [String, Number],
      default: null
    },
    footfallIndicators: {
      type: Object,
      default: () => ({})
    },
    indicatorData: {
      type: Object,
      default: () => salesDict
    },
    selectTitle: {
      type: String,
      default: '排行分析'
    },
    defaultBizIndicator: {
      type: String,
      default: 'SaleAmount'
    },
    defaultShopIndicator: {
      type: String,
      default: 'SaleAmount'
    },
    indicatorSelector: {
      type: Boolean,
      default: true
    },
    bzid: {
      type: Array,
      default: null
    },
    drainageId: {
      type: Number,
      default: null
    },
    isDrainage: {
      type: Boolean,
      default: false
    },
    typeName: {
      type: String,
      default: ''
    },
    drainageApi: {
      type: Object,
      default: () => ({})
    },
    istotal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isText: true,
      bussinessDictList: [],
      showData: false,
      exportEx: 1,
      bussinessType: 'all',
      readySelector: null,
      bizIndicator: '',
      shopIndicator: '',
      bizTopData: '',
      shopTopData: [],
      allBizTopData: [],
      chartTypes: ['bar'],
      // bizTypeOfSelect: 'all',
      extraOptions: {
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        colors: ['#867bf0', '#fbab3e'],
        yaxis: {
          labels: {
            offsetX: 10
          }
        }
      },
      exportType: '',
	  ShopTableCoumn: '',
	  ShopTableData: '',
      cancelGetBizTopFootFallAjax: null,
      cancelGetTopShopAjax: null
    }
  },
  watch: {
    time1: {
      immediate: true,
      handler: function (val, oldVal) {
        this.getTopData()
      }
    },
    time2: {
      immediate: true,
      handler: function (val, oldVal) {
        this.getTopData()
      }
    },
    propertyId: {
      immediate: true,
      handler: function (val, oldVal) {
        this.getTopData()
      }
    },
    bussinessType: {
      handler: function (val, oldVal) {
        this.getTopData()
        this.bussinessType = val
        if (_.isArray(val)) {
          val.forEach((v) => {
            this.withAllOptions.forEach((l) => {
              if (v === l.value) this.bussinessType = v
            })
          })
        }

        if (window.location.href.indexOf('dashboard/analytics') > -1) {
          try {
            let find = _.find(this.withAllOptions, ['value', val])
            let name = find && find.text ? find.text : ''
            let eventName = this.$store.state.home.headerAction === 0 ? '集团页面' : '购物中心首页'

            window.TDAPP.onEvent(eventName, '业态排行业态选择', { '业态': name })
          } catch (error) {
            console.log(eventName + '-业态排行业态选择-埋点error:' + error)
          }
        }
      }
    },
    bzid: {
      handler: function (val, oldVal) {
        if (val) this.getTopData()
      }
    },
    // 监听业态变化
    bizIndicator () {
      this.businessDataList()
    },
    // 监听 购物中心 或者商铺类型变化
    shopIndicator () {
      this.shopAndStoreDataList()
    },
    '$store.state.home.headerAction' () {
      this.getDict()
    },
    // 监听业态变化
    '$store.state.home.isGetDict' () {
      if (this.$store.state.home.isGetDict == true) this.getDict()
    }
  },
  created () {
    this.readySelector = this.getDictOfBussiness()
  },
  activated () {
    this.isText = false
    setTimeout(() => { this.isText = true })
  },
  mounted () {
    this.bizIndicator = this.defaultBizIndicator
    this.shopIndicator = this.defaultShopIndicator
    this.getDict()
  },
  computed: {
    titleText () {
      let obj = {
        left: '',
        right: ''
      }

      if (this.$store.state.home.headerAction == 0) {
        obj.left = '集团业态排行'
        obj.right = '购物中心业态排行'
      } else {
        obj.left = '业态排行'
        obj.right = '商铺排行'
      }
      return obj
    },
    bussinessTypes () {
      return Object.keys(this.bussinessDictList).map(e => ({ text: this.bussinessDictList[e], value: Number(e) }))
    },
    withAllOptions () {
      const allType = { text: '所有业态', value: 'all' }
      return [allType, ...this.bussinessTypes]
    },
    indicators () {
      return Object.keys(this.indicatorData).map(e => ({ value: e, name: this.indicatorData[e].name }))
    },
    currentBizIdx () {
      return _.findIndex(this.bussinessTypes, (e) => e.value === this.bussinessType)
    },
    // bizInxOfSelect () {
    //   return _.findIndex(this.bussinessTypes, (e) => e.value === this.bizTypeOfSelect)
    // },
    bizChartData () {
      if (this.bizTopData == '') return false
      const currentSalesTypeData = this.bizTopData.data.data
      if (currentSalesTypeData.length == 0) return false
      const bizIdx = this.currentBizIdx
      let tml = {}
      if (bizIdx < 0) tml = currentSalesTypeData
      else {
        Object.keys(currentSalesTypeData).forEach(e => {
          tml[e] = {}
          tml[e][this.bussinessType] = _.find(currentSalesTypeData[e], (l) => {
            if (_.indexOf(l.id, this.bussinessType) !== -1) return l
          })
        })
      }
      let that = this
      return {
        xAxis: {
          name: '名称',
          key: 'bussiness',
          data: Object.values(Object.values(tml)[0]).map(e => e.name)
        },
        series: Object.keys(tml).map(function (e, index) {
          if (index < 10) {
            let obj = {
              name: `${that.indicatorData[that.bizIndicator].name} ${e.split(',').join(' - ')}`,
              key: `data_${e}`,
              data: Object.values(tml[e]).map(o => o.data)
            }
            return obj
          }
        }),
        source: Object.values(Object.values(tml)[0]).map(e => e.id)
      }
    },
    topShopData () {
      // 商铺排行和业态排行同时依赖当前用户选择的业态 this.currentBizIdx，
      // 但是用户可以在业态排行图表可以选择某条数据（相当于选择了一个业态），
      // 这时商铺排行的数据需要依赖这个，但是不能影响原来的业态排行
      let source
      let bizIndex = this.currentBizIdx
      if (bizIndex < 0) {
        // 全部业态
        if (this.allBizTopData.length == 0) return false
        source = this.allBizTopData[0].data.data
      } else {
        if (this.shopTopData.length == 0) return false
        if (this.shopTopData[0]) source = this.shopTopData[0].data.data
        else return false
      }
      // 因为客流返回的数据结构是数据，需要分别处理,数组本身已排序，不需要再次排序
      // 如果是对象 需要对 source 排序,
      var sortedObj = Array.isArray(Object.values(source)[0]) ? source : this.sortdObj(source)
      let kes = Object.keys(sortedObj)[0]
      let objs = sortedObj[kes]
      var newArr = []
      if (objs == undefined) return false
      objs.forEach(function (res, index) {
        if (index < 10) newArr.push(res)
      })
      return {
        xAxis: {
          name: '名称',
          key: 'shop',
          data: Object.values(sortedObj)[0].map(e => {
            if (_.isArray(e.name)) return e.name[0]
            else return e.name
          })
        },
        series: Object.keys(sortedObj).map(e => ({
          name: `${this.indicatorData[this.shopIndicator].name} ${e.split(',').join(' - ')}`,
          key: `data_${e}`,
          data: Object.values(sortedObj[e]).map(e => { return e.data })// 因为排序后的数据是数组，所以需要判断
        }))
      }
    },
    bizExtraOptions () {
      let eventOpt = {
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => { // 需要用箭头函数访问到Vue实例，传统函数 this 为图表实例
              this.handleChartPointSelect(config)
            }
          }
        },
        colors: ['#00a1ea', '#16dad2']
      }
      return { ..._.cloneDeep(this.extraOptions), ..._.cloneDeep(eventOpt) }
    }
  },
  methods: {
    ...mapActions(['getDictOfBussiness']),
    // 查找数据
    getTopData: _.debounce(async function () {
      await this.readySelector
      this.businessDataList()
      this.shopAndStoreDataList()
    }, 100),
    tooltipUnit (type) { // 业态排行tooltip显示的单位
      switch (type) {
        case 'enter':
          return '人次'
        case 'SquaerMetre':
          return '元/m²'
        case 'SaleAmount':
          return '元'
        case 'CloseRate':
          return '%'
        case 'UnitPrice':
          return '元'
      }
    },
    // 业态数据
    businessDataList () {
      let bizTypesTopReqs = []
      let bizParams = {
        time1: this.time1,
        type: this.bizIndicator,
        bzid: this.bzid && this.bzid.toString()
      }
      if (this.time2) bizParams.time2 = this.time2
      // 判断是集团还是购物中心
      let currentPropertyId = this.$store.state.home.headerAction
      if (currentPropertyId != 0) bizParams.property_id = currentPropertyId
      else bizParams.company_id = this.$store.state.user.companyId
      if (typeof this.cancelGetBizTopFootFallAjax === 'function') {
        this.cancelGetBizTopFootFallAjax()
      }
      this.bizIndicator == 'enter' ? bizTypesTopReqs = getBizTopFootFall(bizParams, this) : bizTypesTopReqs = getTopBussinessType(bizParams)
      bizTypesTopReqs.then(res => {
        this.bizTopData = res
      })
    },
    // 获取购物中心排行表格的表头
    getShopTableCoumn (value) {
      this.ShopTableCoumn = value
    },
    // 获取购物中心排行表格的数据
    getShopTableData (value) {
      this.ShopTableData = value
    },
    // 购物中心 商铺数据
    shopAndStoreDataList () {
      let topShopOfBizType = []
      let topShopOfAllBizType = []
      let currentPropertyId = this.$store.state.home.headerAction
      let typeId = _.find(this.bussinessTypes, bizType => { return bizType.value == this.bussinessType })
      if (typeId) {
        let topShopParam = {
          time1: this.time1,
          type: this.shopIndicator,
          industry_id: typeId.value,
          bzid: this.bzid && this.bzid.toString()
        }
        // 判断是集团还是购物中心
        if (currentPropertyId != 0) topShopParam.property_id = currentPropertyId
        else topShopParam.company_id = this.$store.state.user.companyId
        if (this.time2) topShopParam.time2 = this.time2

        let url = this.shopIndicator == 'enter' ? getShopTopFootFall(topShopParam, this) : getTopShop(topShopParam, this)
        topShopOfBizType.push(url)
      }
      if (typeof this.cancelGetTopShopAjax === 'function') {
        this.cancelGetTopShopAjax()
      }
      // 购物中心或者商铺 合计
      let shopParams = {
        time1: this.time1,
        type: this.shopIndicator,
        bzid: this.bzid && this.bzid.toString()
      }
      if (currentPropertyId != 0) shopParams.property_id = currentPropertyId
      else shopParams.company_id = this.$store.state.user.companyId
      if (this.time2) shopParams.time2 = this.time2
      let totalUrl = this.shopIndicator == 'enter' ? getShopTopFootFall(shopParams, this) : getTopShop(shopParams, this)
      topShopOfAllBizType.push(totalUrl)
      Promise.all([topShopOfAllBizType, topShopOfBizType].map(innerPromises => {
        return Promise.all(innerPromises)
      })).then(res => {
        [this.allBizTopData, this.shopTopData] = res
      }).catch(err => {
        console.log(err)
      })
    },
    handleChartPointSelect (e) {
      this.bussinessType = this.bizChartData.source[e.dataPointIndex]
      // this.bizTypeOfSelect = this.bizChartData.source[e.dataPointIndex]
    },
    sortdObj (obj) {
      // 2019-06-26 修改，对两个时间的各项求和在排序
      /**
       *  @description 对api 返回的对象进行排序，如{a:{xxx:val,xxx2:val},b:{xxx:val,xxx2:val}},
       *  @returns {a:[{xxx,val},{xxx2,val}],b:[{xxx,val},{xxx2,val}]}
       */
      if (obj.length == 0) return false
      const allVals = _.cloneDeep(Object.values(obj))
      const sumValsByKey = allVals.reduce((a, b) => {
        Object.keys(a).forEach(k => { a[k] = Number(a[k]) + Number(b[k]) })
        return a
      })
      const orderVals = Object.entries(sumValsByKey).sort((a, b) => b[1] - a[1])
      let sortedObj = {}

      Object.keys(_.cloneDeep(obj)).forEach(key => {
        const ele = obj[key]
        sortedObj[key] = orderVals.map(([k, v]) => {
          return { name: [k], data: ele[k] }
        })
      })
      return sortedObj
    },
    dowloadXlsx (res) {
      /**
       * @description 下载文件
       */
      let date = new Date()
      const blob = new Blob([res.data])
      var url = this.$router.currentRoute.name
      var titleName = ''
      if (url == 'drainage') {
        titleName = '实体引流分析'
      } else if (url == 'pathTrend') {
        titleName = '路径动向分析'
      } else if (url == 'sales') {
        titleName = '销售分析'
      }
      let name = ''
      this.exportEx == 1 ? name = '业态排行' : name = '商铺排行'
      let fileName = titleName + name + moment(date).format('YYYYMMDDHHmmss') + '.xls'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)// 释放URL 对象
      document.body.removeChild(elink)
    },
    exportBiztop (type) {
      if (type === 'current') {
        if (this.typeName == 'drainage') {
          flowexcel(this.drainageApi).then(res => {
            this.exportEx = 1
            this.dowloadXlsx(res)
          })
        } else {
          exportBizXls({
            time1: this.time1,
            time2: this.time2,
            property_id: this.propertyId,
            type: this.bizIndicator,
            bzid: this.bzid && this.bzid.toString()
          }).then(res => {
            if (window.location.href.indexOf('dashboard/analytics') > -1) {
              let eventName = this.$store.state.home.headerAction === 0 ? '集团页面' : '购物中心首页'
              try {
                window.TDAPP.onEvent(eventName, '业态排行下载', { })
              } catch (error) {
                console.log(eventName + '-业态排行下载-埋点error:' + error)
              }
            }

            this.exportEx = 1
            this.dowloadXlsx(res)
          })
        }
      } else {

      }
    },
    exportShoptop (type) {
      if (type === 'current') {
        if (this.typeName == 'drainage') {
          flowstoreexcel(this.drainageApi).then(res => {
            this.exportEx = 2
            this.dowloadXlsx(res)
          })
        } else if (window.location.href.indexOf('dashboard/analytics') > -1) {
          if (this.$store.state.home.headerAction === 0) {
            let data = [this.ShopTableCoumn, this.ShopTableData]
			      if (this.ShopTableData.length == 0) {
              alert('暂无数据可下载')
              return false
            }
            exportEx(data).then(res => {
              let date = new Date()
              const blob = new Blob([res.data])
              let name = '购物中心排行下载'
              let fileName = name + moment(date).format('YYYYMMDDHHmmss') + '.xls'
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href)// 释放URL 对象
              document.body.removeChild(elink)
            })

            try {
              window.TDAPP.onEvent('集团页面', '购物中心排行下载', { })
            } catch (error) {
              console.log('集团页面-购物中心排行下载-埋点error:' + error)
            }
          } else {
            exportShopXls({
              time1: this.time1,
              time2: this.time2,
              property_id: this.propertyId,
              type: this.shopIndicator,
              bzid: this.bzid && this.bzid.toString(),
              industry_id: this.bussinessType === 'all' ? null : this.bussinessType })
              .then(res => {
                try {
                  window.TDAPP.onEvent('购物中心首页', '商铺排行下载', { })
                } catch (error) {
                  console.log('购物中心首页-商铺排行下载-埋点error:' + error)
                }
                this.exportEx = 2
                this.dowloadXlsx(res)
              })
          }
        }
      } else {

      }
    },
    // 请求业态数据
    getDict () {
      let propertyId = this.$store.state.home.headerAction
      propertyId = propertyId == 0 ? '' : propertyId
      getBussinessDict({ property_id: propertyId }).then(res => {
        this.bussinessDictList = res.data.data
        this.$store.commit('isGetDict', false)
        this.getTopData()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less">
  .chartSelector {
    width: 40%;
    margin-right: 10px!important;
    input{
      height: 37px;
      line-height: 37px;
    }
  }
</style>
<style lang="stylus" scoped>
border-color = #e5e5e5
box-border(w,r)
    border w solid border-color
    border-radius r
.ranking-box
  display flex
  box-border 1px,8px
  justify-content space-between
  >div
    width 50%
    &:nth-child(1)
        border-right 1px solid border-color
  // @media (max-width:768px)
  //   flex-wrap wrap
  //   border none
  //   >div
  //     width 100%
  //     box-border 1px,8px
  //     &:nth-child(1)
  //       margin-bottom 1.25rem
</style>
