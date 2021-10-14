<!-- =========================================================================================
销售分析排行占比分析,同时watch propertyId 和 time1,time2 请求数据，三个watch 在初始化的时候，同时触发，
使用防抖函数，避免同时触发
bussinessType:业态类型，缩写bizType
salesTarget:销售指标
footFall:客流
========================================================================================== -->
<template>
  <div class="mt-6 p-6 bg-white box-card">
    <div class="ranking-selector-box flex items-center">
      <span class="mr-3">{{$t(selectTitle)}}</span>
      <vs-select v-model="bussinessType" autocomplete :placeholder="$t(请选择)" :noDataText="$t(暂无数据)">
        <vs-select-item
          v-for="item in withAllOptions"
          :value="item.value"
          :key="item.value"
          :text="item.text"
        />
      </vs-select>
    </div>
    <div class="ranking-box mt-3" v-if="bizTopData.length">
      <div>
        <chart-tabs
          v-model="exportType"
          :xAxis="bizChartData.xAxis"
          :series="bizChartData.series"
          :type="chartTypes"
          :extraOptions="bizExtraOptions"
          :istotal='istotal'
          title="业态排行"
          key="bizTop">
          <vs-select
            autocomplete
            v-model="bizIndicator"
            class="chartSelector"
            v-if="indicatorSelector"s>
            <vs-select-item
              v-for="(item,index) in indicators "
              :text="$t(item.name)"
              :key="index"
              :value="item.value"
            />
          </vs-select>
          <export-menu slot="export" @onchange="exportBiztop"></export-menu>
        </chart-tabs>
      </div>
      <div>
        <chart-tabs
          v-model="exportType"
          :xAxis="topShopData.xAxis"
          :series="topShopData.series"
          :type="chartTypes"
          :extraOptions="extraOptions"
          :title="rightTypeTitle"
          :isHome='true'
          :istotal='istotal'
          key="shopTop"
        >
          <export-menu slot="export" @onchange="exportShoptop"></export-menu>
          <vs-select
            autocomplete
            v-model="shopIndicator"
            class="chartSelector"
            v-if="indicatorSelector"
          >
            <vs-select-item
              v-for="(item,index) in indicators"
              :text="$t(item.name)"
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
  getDrainageShop,
  getShopTopFootFall,
  getShopTopDrainage,
  getBizTopFootFall,
  exportBizXls,
  exportShopXls,
  flowexcel,
  flowstoreexcel
} from '@/api/home.js'
import { getBussinessDict } from '@/api/home'
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
      showData: false,
      exportEx: 1,
      bussinessType: 'all',
      readySelector: null,
      bizIndicator: '',
      shopIndicator: '',
      bizTopData: [],
      shopTopData: [],
      allBizTopData: [],
      chartTypes: ['bar'],
      bizTypeOfSelect: 'all',
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
      exportType: ''
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
        this.bizTypeOfSelect = val// 将选择器数据同步给用户在图表上选择
      }
    },
    bzid: {
      handler: function (val, oldVal) {
        if (val) this.getTopData()
      }
    },
    // 监听业态变化
    '$store.state.home.isGetDict' () {
      if (this.$store.state.home.isGetDict == true) this.getDict()
    }
  },
  created () {
    this.readySelector = this.getDictOfBussiness()
    this.bizIndicator = this.defaultBizIndicator
    this.shopIndicator = this.defaultShopIndicator
  },
  activated () {

  },
  computed: {
    rightTypeTitle () {
      let type
      if (this.$store.state.home.headerAction == 0) {
        type = '购物中心排行'
      } else {
        type = '商铺排行'
      }
      return type
    },
    bussinessTypes () {
      const sourceData = this.$store.state.home.bussinessDict
      return Object.keys(sourceData).map(e => ({ text: sourceData[e], value: Number(e) }))
    },
    withAllOptions () {
      const allType = { text: this.$t('所有业态'), value: 'all' }
      return [allType, ...this.bussinessTypes]
    },
    indicators () {
      return Object.keys(this.indicatorData).map(e => ({ value: e, name: this.indicatorData[e].name }))
    },
    currentBizIdx () {
      return _.findIndex(this.bussinessTypes, (e) => e.value === this.bussinessType)
    },
    bizInxOfSelect () {
      return _.findIndex(this.bussinessTypes, (e) => e.value === this.bizTypeOfSelect)
    },
    bizChartData () {
      const bizIdx = this.currentBizIdx
      const bizSalesIdx = Object.keys(this.indicatorData).indexOf(this.bizIndicator)
      const currentSalesTypeData = this.bizTopData[bizSalesIdx].data.data
      let tml = {}
      if (bizIdx < 0) tml = currentSalesTypeData
      else {
        Object.keys(currentSalesTypeData).forEach(e => {
          tml[e] = {}
          tml[e][this.bussinessType] = currentSalesTypeData[e].find(e => e.id === Number(this.bussinessType))
        })
      }
      let that = this
      return {
        xAxis: {
          name: '名称',
          key: 'bussiness',
          data: Object.values(Object.values(tml)[0]).map(e => e.name)
        },
        // series: Object.keys(tml).map(e => ({
        //   name: `${this.indicatorData[this.bizIndicator].name} ${e.split(',').join(' - ')}`,
        //   key: `data_${e}`,
        //   data: Object.values(tml[e]).map(o => o.data)
        // })),
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
      let source = null
      const shopSalesIdx = Object.keys(this.indicatorData).indexOf(this.shopIndicator)
      let bizIndex = this.currentBizIdx === this.bizInxOfSelect ? this.currentBizIdx : this.bizInxOfSelect
      if (bizIndex < 0) {
        // 全部业态
        source = this.allBizTopData[shopSalesIdx].data.data
      } else {
        source = this.shopTopData[shopSalesIdx][bizIndex].data.data
      }
      // 因为客流返回的数据结构是数据，需要分别处理,数组本身已排序，不需要再次排序
      // 如果是对象 需要对 source 排序,
      var sortedObj = Array.isArray(Object.values(source)[0]) ? source : this.sortdObj(source)
      let kes = Object.keys(sortedObj)[0]
      let objs = sortedObj[kes]
      var newArr = []
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
    getTopData: _.debounce(async function () {
      /*
       *  ======================================================
          销售店铺排名getTopShop
          time1 string Y  2019-05-19,2019-05-22
          type string Y  'SaleAmount' => '销售额', 'SquaerMetre' => '坪效', 'CloseRate' => '成交率', 'RepeatPurchaseRate' => '复购率', 'UnitPrice' => '客单价',
          property_id string N  购物中心id, 不传为全部购物中心
          industry_id int N  业态id,不传为全部业态
          time2 int N  2019-05-19,2019-05-22
          ========================================================================================================================================================================
          销售业态排名getTopBussinessType
          time1 string Y  2019-05-19,2019-05-22
          property_id string N  购物中心id, 不传为全部购物中心
          type string Y  'SaleAmount' => '销售额', 'SquaerMetre' => '坪效', 'CloseRate' => '成交率', 'RepeatPurchaseRate' => '复购率', 'UnitPrice' => '客单价',
          time2 string N  2019-05-19,2019-05-22
          ==================================================================================================================
       */
      let companyId = this.$store.state.user.companyId
      await this.readySelector// 等待选择器数据准备ok
      let bizTypesTopReqs = []
      let topShopOfAllBizType = []// 各销售指标，对应的全部业态店铺排名
      let topShopOfBizType = []// 每种业态下各种销售指标店铺排名
      const { propertyId } = this
      Object.keys(this.indicatorData).forEach(salesType => {
        let bizParams // 定义参数
        // 判断是否是集团
        if (this.$store.state.home.headerAction != 0) {
          bizParams = {
            time1: this.time1,
            type: salesType,
            property_id: propertyId,
            bzid: this.bzid && this.bzid.toString()
          }
        } else {
          bizParams = {
            time1: this.time1,
            type: salesType,
            company_id: companyId,
            bzid: this.bzid && this.bzid.toString()
          }
        }
        let hasFootfall = ['enter', 'occupancy'].includes(salesType)

        let salesTypesReqs = this.bussinessTypes.map(bizType => { // 所有销售类型且每一种包含所有业态的请求组合
          let topShopParam // 定义参数
          // 判断是否是集团
          if (this.$store.state.home.headerAction != 0) {
            topShopParam = {
              time1: this.time1,
              type: salesType,
              property_id: propertyId,
              industry_id: bizType.value,
              bzid: this.bzid && this.bzid.toString()
            }
          } else {
            topShopParam = {
              time1: this.time1,
              type: salesType,
              company_id: companyId,
              industry_id: bizType.value,
              bzid: this.bzid && this.bzid.toString()
            }
          }

          if (this.time2) topShopParam.time2 = this.time2
          if (hasFootfall) {
            if (this.isDrainage) {
              // 实体引流 业态排行
              let obj = {}
              obj.time1 = this.time1
              obj.from_bzids = this.bzid && this.bzid.toString()
              obj.to_bzids = this.drainageId
              obj.industry_id = bizType.value
              return getDrainageShop(obj)
            } else {
              return getShopTopFootFall(topShopParam)
            }
          } else {
            return getTopShop(topShopParam)
          }
          // return hasFootfall ? getShopTopFootFall(topShopParam) : getTopShop(topShopParam)
        })

        if (this.time2) bizParams.time2 = this.time2
        let shopUrl
        if (hasFootfall) {
          if (this.isDrainage) {
            // 实体引流 业态排行
            let obj = {}
            obj.time1 = this.time1
            obj.from_bzids = this.bzid && this.bzid.toString()
            obj.to_bzids = this.drainageId
            shopUrl = getDrainageShop(obj)
          } else {
            shopUrl = getShopTopFootFall(bizParams)
          }
        } else {
          shopUrl = getTopShop(bizParams)
        }
        topShopOfAllBizType.push(shopUrl)
        // topShopOfAllBizType.push(hasFootfall ? getShopTopFootFall(bizParams) : getTopShop(bizParams))
        topShopOfBizType.push(salesTypesReqs)// 销售店铺排名
        let url
        if (hasFootfall) {
          if (this.isDrainage) {
            let obj = {}
            obj.time1 = this.time1
            obj.from_bzids = this.bzid && this.bzid.toString()
            obj.to_bzids = this.drainageId
            url = getShopTopDrainage(obj)
          } else {
            url = getBizTopFootFall(bizParams)
          }
        } else {
          url = getTopBussinessType(bizParams)
        }
        bizTypesTopReqs.push(url)
      })
      Promise.all([bizTypesTopReqs, topShopOfAllBizType, ...topShopOfBizType].map(innerPromises => {
        return Promise.all(innerPromises)
      })).then(res => {
        [this.bizTopData, this.allBizTopData, ...this.shopTopData] = res
      }).catch(err => {
        console.log(err)
      })
    }, 100),
    handleChartPointSelect (e) {
      this.bussinessType = this.bizChartData.source[e.dataPointIndex]
      this.bizTypeOfSelect = this.bizChartData.source[e.dataPointIndex]
    },
    sortdObj (obj) {
      // 2019-06-26 修改，对两个时间的各项求和在排序
      /**
       *  @description 对api 返回的对象进行排序，如{a:{xxx:val,xxx2:val},b:{xxx:val,xxx2:val}},
       *  @returns {a:[{xxx,val},{xxx2,val}],b:[{xxx,val},{xxx2,val}]}
       */
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
      // const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
      // window.open(url)
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
      // this.$vs.loading.close()
      // this.$store.commit('loadingState', false)
    },
    exportBiztop (type) {
      // if (this.$store.state.home.loadingState == false) {
      //   this.$store.commit('loadingState', true)
      //   this.$vs.loading()
      // }
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
        } else {
          exportShopXls({
            time1: this.time1,
            time2: this.time2,
            property_id: this.propertyId,
            type: this.shopIndicator,
            bzid: this.bzid && this.bzid.toString(),
            industry_id: this.bussinessType === 'all' ? null : this.bussinessType })
            .then(res => {
              this.exportEx = 2
              this.dowloadXlsx(res)
            })
        }
      } else {

      }
    },
    // 请求业态数据传入store
    getDict () {
      getBussinessDict().then(res => {
        this.$store.commit('saveBussinessType', res.data.data)
        this.$store.commit('isGetDict', false)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
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
