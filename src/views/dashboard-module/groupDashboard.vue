<template>
  <div>
    <!-- 实时数据区域 -->
    <real-time-data 
			@interValChange="intervalClick"
			@refresh="updateRealTimezone"
		>
			<template slot="map">
				<map-carousel 
					:center="center"
					:zooms="zooms"
					:markers="markers"
					:shopData="shopData"
					:gateData="gateData"
					:window="window"
					:timingValue='$store.state.home.intervalTime'
					:id="currentMenuName"
					@markClick="selectMenuByName"
				></map-carousel>
      </template>

      <template slot="dashboard">
        <right-data 
					@isRightImg='isRightImg'
					:rightShoppingList='rightShoppingList'
					ref="dashBoard"
				></right-data>
      </template>

			<template slot="cards" v-if="isKipShow == false" class="">
				<indicator-cards
					:indicatorList="kpiData"
					:propertyId="currentPropertyId"
					ref="currentKpi"
					textName='group-current'
					class='group-right-list groupStyle'
					:moveWidth='0.024'
				>
					<template slot-scope="{item}">
						<singleCard :isShowText='true' :item="item" :innerRange="innerRange"></singleCard>
					</template>
				</indicator-cards>
			</template>

    </real-time-data>
    <!-- 历史数据区域 -->
    <template>
      <!-- 历史数据指标 -->
      <div class="overflow-hidden -mx-3 px-3 py-2">
        <indicator-cards
          :indicatorList="historyIndicators"
          :propertyId="currentPropertyId"
          ref="historyKpi"
          indicatorType="historyIndicator"
          textName='group-histrry'
          scaleCards
          :defaultCountsOfCards="4"
					:moveWidth='0.013'
        >
					<template slot="title">
						<span class="text-xl text-black font-medium hidden sm:block" style="padding-left:18px;">
							{{ $t('historicalDataQuery') }}
							<Tooltip 
								:content="tootipText"
								placement="right"
								theme="light"
								transfer
								max-width="500">
								<icons type="wenhao" />
							</Tooltip>
						</span>
					</template>
					<template slot="dateSelector">
						<i-date-picker 
							@selectDate="selectDate"
							:value="historyDate"
							class="mr-8 history-date-picker"
						></i-date-picker>
					</template>
          <template slot-scope="{item}">
            <!-- 历史数据 卡片 列表  -->
            <!-- 平均客流量 客流峰值 总客流 集客量峰值 销售额 有效客流 -->
            <singleCard 
							:isShowText='false'
							:item="item"
							:innerRange="innerRange"
							:isLiveData="false"
						></singleCard>
          </template>
        </indicator-cards>
      </div>
      <!-- 趋势对比 -->
      <group-trend 
				style="margin-top:20px"
				:time1="outRange"
				:innerRange="innerRange"
				:companyId="companyId"
				:indicatorData="trendIndicators"
			></group-trend>
      <!-- 排行占比 -->
      <ranking-group 
				:time1="outRange"
				:propertyId="currentPropertyId"
				:indicatorData="rankingIndicators"
				:defaultBizIndicator='rankingDataShowType'
				:defaultShopIndicator='rankingDataShowType'
			></ranking-group>
      <!-- 顾客类型数据 -->
      <group-age-gender :outRange='outRange'></group-age-gender>
    </template>
  </div>
</template>
<script>
import {
  realTimeData,
  mapCarousel,
  indicatorCards,
  CustomerAnalytics
} from '../home'

import rightData from './grouphaderRight'
import {
  getCurrent,
  postHistorycompute,
  getEntityFlow,
} from '@/api/home.js'
import groupTrend from '@/views/group/groupTrend'
import groupAgeGender from '@/views/group/groupAgeGender'
import RankingGroup from '@/views/operation/components/RankingGroup.vue'
import singleCard from '@/views/home/components/singleCard.vue'
import CustomerCharts from '_c/common/CopyChartsTabs'
import { getBussinessTree } from '@/api/passenger'
import iDatePicker from '_c/common/idatepicker.vue'
import { mapMutations } from 'vuex'
import Moment from 'moment'
import _ from 'lodash'
import { gotInnerRange } from '@/libs/util'
import customerNameDict from '../home/seriesDict'
import salesMixin from '../operation/salseMixin'
import salesDict from '@/views/home/components/salesIndicatorDict.js'
import NP from 'number-precision'
export default {
  name: 'groupDashboard',
  mixins: [salesMixin],
  components: {
    realTimeData,
    mapCarousel,
    RankingGroup,
    indicatorCards,
    rightData,
    iDatePicker,
    CustomerAnalytics,
    singleCard,
    CustomerCharts,
    groupAgeGender,
    groupTrend
  },
  data () {
    return {
      historyDate:[Moment().add(-1, 'd').toDate(), Moment().add(-1, 'd').toDate()],//历史查询时间
      cancelGetGroupOrganizationAjax: null,
      cancelGetBussinessTreeAjax: null,
      cancelGetCurrentAjax: null,
      cancelGetSaleIndicatorsAjax: null,
      isKipShow: false,
      rightShoppingList: {
        currentDay: 0,
        currentMonthly: 0,
        monthlyGoal: 0,
        achievingRate: [0]
      },
      rankingDataShowType: 'enter',
      dayTotalEnter: 0,
      innerRange: '1h',
      outRange: '',
      clickTimeName: 'l',
      center: [108.948234, 34.223579],
      zooms: [0, 18],
      markers: [],
      dashboardData: {},
      window: '',
      enterArr: [],
      windows: [],
      shopData: null,
      gateData: null,
      // allPropetyGateData: null,
      monthTargetVal: 0,
      todayEnter: 0,
      monthEnter: 0,
      kpiData: [
        {
          data: 0,
          id: 'enteravg',
          name: this.$t('fn.average', [this.$t('customerTraffic')]),
          type: {
            icon: 'avg',
            color: '#1dd9d1'
          }
        },
        {
          data: {
            number: 0,
            property: '007',
            timeRange: '00:00-00:59'
          },
          id: 'enterhighest',
          name: this.$t('fn.peak', [this.$t('customerTraffic')]),
          type: {
            icon: 'highest',
            color: '#e8585a'
          }
        },
        {
          data: {
            number: 0,
            property: '007',
            timeRange: '00:00-00:59'
          },
          id: 'occupancyhighest',
          name: this.$t('fn.peak', [this.$t('occupancy')]),
          type: {
            icon: 'occu_highest',
            color: '#e8585a'
          }
        },
        {
          data: 0,
          id: 'occupancytotal',
          name: this.$t('occupancy'),
          type: {
            icon: 'liuliang',
            color: '#857aef'
          }
        }
      ],
      historyData: null,
      summarySalse: [],
      today: Moment().format('YYYY-MM-DD'),
      footFallTypeRes: {},
      zones: [],
      intervalId: '',
      initRes: [],
      changedMenuName: 'company',
      currentMenuName: '',
      currentPropertyId: null,
      customChecklist: {
        new_old_proportion: {
          name: '新老顾客占比',
          chartType: ['donut']
        },
        vip_proportion: {
          name: 'VIP顾客占比',
          chartType: ['radialBar']
        },
        arrival_distribution: {
          name: '到店次数',
          chartType: ['pie']
        },
        age_distribution: {
          name: '年龄分布',
          chartType: ['radar']
        },
        gender_propotion: {
          name: '性别分布',
          chartType: ['radialBar']
        }
      },
      canshow: false,
      kpiShowList: {}
    }
  },

  computed: {
    tootipText () {
      return this.$t('passages.tootipText3')
    },
    companyId () {
      return this.$store.state.user.companyId
    },
    
    historyIndicators () {
      var arr = [...this.historyKpiData, ...this.summarySalse]
      return arr // 合并数组 组成一个新的数组
    },
    historyNewKpi () {
      const { new_old_proportion, gender_propotion } = this.footFallTypeRes
      let manAndWomen = {
        id: 'entermanAndWomen',
        name: '性别人数',
        data: {
          name1: '女性',
          name2: '男性',
          data1: gender_propotion[0],
          data2: gender_propotion[1]
        },
        type: {
          icon: 'xingbie',
          color: '#E8585A'
        }
      }
      let newAndOld = {
        id: 'enternewAndOld',
        name: '新老顾客',
        data: {
          name1: '新顾客',
          name2: '老顾客',
          data1: new_old_proportion.newNum,
          data2: new_old_proportion.oldNum
        },
        type: {
          icon: 'xinlaoguke',
          color: '#857aef'
        }
      }
      return [manAndWomen, newAndOld]
    },
    rankingIndicators () {
      return { ...{ enter: { name: '入客流' } }, ...salesDict }
    },
    filterFootfallData () {
      if (!this.historyData) return null
      let currentData = null
      if (this.currentMenuName === 'company') {
        currentData = this.historyData.company
      } else {
        currentData = _.find(this.historyData.property, o => o.bzid === this.currentMenuName)
      }
      return currentData
    },
    historyKpiData () {
      if (!this.filterFootfallData) return []
      const { enter, occupancy, valid } = this.filterFootfallData
      let tmlEnterKPI = this.processKPIData(enter, 'enter')
      let tmlOccuKPI = _.dropRight(this.processKPIData(occupancy, 'occupancy'))// 删除集客量
      if (this.clickTimeName === 'y') return _.dropRight([...tmlEnterKPI, ...tmlOccuKPI])
      let validObj = {
        id: 'entervalid',
        name: this.$t('fn.effective', [this.$t('customerTraffic')]),
        data: Number(enter.unique) < 0 ? 0 : enter.unique,
        type: {
          icon: 'youxiaokeliu',
          color: '#2bd9cf'
        }
      }
      tmlOccuKPI.push(validObj)
      return [...tmlEnterKPI, ...tmlOccuKPI]
    },
    trendIndicators () {
      let footfallYaxis = {
        enter: {
          name: '客流量',
          yaxis: {
            title: {
              text: '客流量（人次）'
            },
            labels: {
              formatter (value) {
                return value ? value.toLocaleString() : ''
              }
            }
          }
        },
        occupancy: {
          name: this.$t('occupancy'),
          yaxis: {
            title: {
              text: '集客量（人次）'
            },
            labels: {
              formatter (value) {
                return value ? value.toLocaleString() : ''
              }
            }
          }
        }
      }
      return { ...footfallYaxis, ...salesDict }
    }
  },
  mounted () {
    this.initRequest()
  },
  activated () {
    this.historyDate = [Moment().add(-1, 'd').toDate(), Moment().add(-1, 'd').toDate()];
    this.innerRange = '1h'
    this.intervalClick(this.$store.state.home.intervalTime)
    this.initRequest()
  },
  watch: {
    outRange () {
      // 时间选择器触发，因为历史卡片数据每次请求的是所有购物中心的数据，所以只有当时间发生变化才会触发请求
      let footfallReq = this.getHistoryComputed()
      this.querHistory(footfallReq)
    }
  },
  methods: {
    ...mapMutations([
      'saveBusinessTree',
      'saveAllTargetData'
    ]),
    isRightImg (type) {
      this.isKipShow = type
    },
   
    updateMapZoneByName (name) {
      this.currentMenuName = name === 'company' ? name : Number(name)
      this.currentPropertyId = name === 'company' ? null : this.dashboardData[name].propertyId
      this.shopData = this.dashboardData[name].shopData ? this.dashboardData[name].shopData : null// 轮播图数据
      this.kpiData = _.cloneDeep(this.dashboardData[name].compute)
    },
    selectMenuByName (name) {
      // 菜单栏被拿掉，以下代码没用了，但是，需要手动触发更新函数
      // this.changedMenuName = `${name}`// 触发菜单栏更新
      // this.$refs.headMenu.handleSelect(name.toString())
      this.updateMapZoneByName(`${name}`)
    },
    mapDataInit (data) {
      let markerIcon = require('@/assets/images/pages/marker.png')
      const orgData = this.$store.state.home.organizationData
      let currentData = data[0].data.data
      let businessTreeData = data[1].data.data// 将businessTreeData 存入store,方便其他页面访问，避免重复请求
      this.saveBusinessTree(businessTreeData)

      let currentMonthIndex = new Date().getMonth() // 当月月份
      const self = this
      this.windows = []
      const windows = [] // mapwindows
      const markers = [] // mapmarkers
      let companyMonthTargetValue = 0
      const { name: companyName } = orgData // 集团name
      const { property: targetArr } = orgData // 各商场的目标数据
      const { property: currentArr } = currentData // 各商场的实时数据
      const { company: currentCompany } = currentData // 集团的实时数据
      let allTargetData = []
      let dashBoardObj = {}
      this.zones = []

      let groupData = this.rightShoppingList
      // 初始数据
      groupData.currentDay = 0
      groupData.currentMonthly = 0
      groupData.monthlyGoal = 0
      groupData.achievingRate = [0]
      // 计算集团当前数据
      if (currentArr && currentArr.length != 0) {
        currentArr.map(list => {
          groupData.currentDay = Number(list.enter.total) + Number(groupData.currentDay)
          groupData.currentMonthly = Number(list.enter.month.number) + Number(groupData.currentMonthly)
          groupData.monthlyGoal = Number(list.flow_target.toFixed(0)) + Number(groupData.monthlyGoal)
        })
        let size
        // 计算 客流达成率
        groupData.monthlyGoal == 0 ? size = 1 : size = NP.divide(groupData.currentMonthly, groupData.monthlyGoal).toFixed(2)
        size = NP.times(size, 100)
        groupData.achievingRate = [size]

        // 添加千分符
        groupData.currentDay = groupData.currentDay.toLocaleString()
        groupData.currentMonthly = groupData.currentMonthly.toLocaleString()
        groupData.monthlyGoal = groupData.monthlyGoal.toLocaleString()
      }
      try {
        for (let index = 0; index < targetArr.length; index++) {
          const ele = targetArr[index]
          if (_.isNull(ele.bzid)) continue
          let currentObj = _.find(currentArr, o => o.bzid === ele.bzid)// 根据bzid 到 currentData找到对应的实时数据
          let shopData = _.find(businessTreeData, o => o.id === ele.bzid)
          if (!currentObj || !shopData) continue
          this.zones.push(ele.bzid) // 将所有的bzid存起来
          let shopEnterCurrent = this.processKPIData(currentObj.enter, 'enter') // 实时客流分析数据
          let shopOccuCurrent = this.processKPIData(currentObj.occupancy, 'occupancy') // 实时集客量分析数据
          let shopCurrent = _.concat(shopEnterCurrent, shopOccuCurrent)

          let currentMap = { number: Number(currentObj.enter.current.number).toLocaleString() }

          windows.push({
            // 将所有的信息窗口存为一个数组
            position: [Number(ele.longitude), Number(ele.latitude)],
            visible: false,
            name: ele.name,
            zoneId: ele.bzid,
            passengerFlow: currentMap,
            isexist: currentObj.enter.isexist,
            offset: [0, -35]
          })
          var thats = this
          // 将所有的markers 存为一个数组
          markers.push({
            position: ['calc(' + Number(ele.longitude) * 100 + '% - 10px)', 'calc(' + Number(ele.latitude) * 100 + '% - 27px)'],
            icon: markerIcon,
            enter: currentObj.enter.total,
            isText: false,
            img: businessTreeData[index].map_url,
            events: {
              mouseover () {
                self.windows.forEach(window => { window.visible = false }) // 点击先关闭所有的窗口
                self.window = _.find(windows, o => o.zoneId === ele.bzid) // self.windows[index]  设置当前的窗口为点击索引的那个,由于可能存在空的zid 当前的index与windows 中index不匹配，采用find
                self.$nextTick(() => { self.window.visible = true }) // 打开当前索引的信息窗口
              },
              click () {
                thats.$store.commit('headerAction', ele.property_id)
                self.selectMenuByName(ele.bzid)
              }
            },
            propertyId: ele.property_id,
            name: ele.name,
            id: ele.bzid
          })
          let shopTargetValue = 0
          if (ele.goal_flow) {
            let year = (new Date()).getFullYear()
            ele.goal_flow.map(list => {
              if (list.year == year) {
                allTargetData.push({
                  id: ele.bzid,
                  data: ele.goal_flow,
                  marketData: ele.goal_sale
                })
                if (list.is_year === 'year') {
                  shopTargetValue = list.flow_year / 12 // 目标值为年
                  companyMonthTargetValue += shopTargetValue
                } else {
                  const { detail: { months: everyMonth } } = list
                  shopTargetValue = everyMonth[currentMonthIndex][Object.keys(everyMonth[currentMonthIndex])[0]] || 0
                  companyMonthTargetValue += shopTargetValue // 集团当月目标值等于各商场的当月目标值
                }
              }
            })
          }
          dashBoardObj[ele.bzid] = {
            compute: shopCurrent,
            name: ele.name,
            targetValue: shopTargetValue,
            shopData,
            todayEnter: currentObj ? currentObj.enter.total : 0,
            monthEnter: currentObj ? currentObj.enter.month.number : 0,
            propertyId: ele.property_id
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.saveAllTargetData(allTargetData)// 将目标数据存入store 中，方便目标管理页面使用
      this.windows = windows
      let companyTargetValue = companyMonthTargetValue
      let firstMenuName = ''
      this.changedMenuName = 'company'
      let companyKpi = [
        {
          id: 'enteravg',
          name: this.$t('fn.average', [this.$t('customerTraffic')]),
          data: currentCompany ? currentCompany.avg : 0,
          type: {
            icon: 'avg',
            color: '#1dd9d1'
          }
        },
        {
          id: 'enterhighest',
          name: this.$t('fn.peak', [this.$t('customerTraffic')]),
          data: {
            number: currentCompany ? Number(currentCompany.highest.number) < 0 ? 0 : currentCompany.highest.number : 0,
            timeRange: currentCompany ? currentCompany.highest.timeRange : '',
            property: currentCompany ? currentCompany.highest.property : ''
          },
          type: {
            icon: 'highest',
            color: '#e8585a'
          }
        },
        {
          id: 'occupancyhighest',
          name: this.$t('fn.peak', [this.$t('occupancy')]),
          data: {
            number: currentCompany ? Number(currentCompany.occupancy_highest.number) < 0 ? 0 : currentCompany.occupancy_highest.number : 0,
            timeRange: currentCompany ? currentCompany.occupancy_highest.timeRange : '',
            property: currentCompany ? currentCompany.occupancy_highest.property : ''
          },
          type: {
            icon: 'occu_highest',
            color: '#e8585a'
          }
        },
        {
          id: 'occupancytotal',
          name: this.$t('occupancy'),
          data: currentCompany ? Number(currentCompany.occupancy_total) < 0 ? 0 : currentCompany.occupancy_total : 0,
          type: {
            icon: 'liuliang',
            color: '#857aef'
          }
        }
      ]
      this.markers = markers
      dashBoardObj.company = {
        name: companyName,
        compute: companyKpi,
        targetValue: companyTargetValue,
        todayEnter: currentCompany ? currentCompany.total : 0,
        monthEnter: _.sumBy(currentArr, e => e.enter.month.number)
      }
      firstMenuName = 'company'
      this.dashboardData = dashBoardObj
      this.updateMapZoneByName(firstMenuName)
    },
    processKPIData (data, type) {
      let pic = ''
      // data.isexist ? pic = '今日' : pic = ''
      let checkNameObj = {
        enter: {
          avg: pic + this.$t('fn.average', [this.$t('customerTraffic')]),
          highest: pic + this.$t('fn.peak', [this.$t('customerTraffic')]),
          total: pic + this.$t('fn.total', [this.$t('customerTraffic')])
        },
        occupancy: {
          highest: pic + this.$t('fn.peak', [this.$t('occupancy')]),
          total: pic + this.$t('occupancy')

        }
      }
      let icontypes = {
        total: {
          icon: type === 'occupancy' ? 'liuliang' : 'enter_total',
          color: '#857aef'
        },
        avg: {
          icon: 'avg',
          color: '#1dd9d1'
        },
        highest: {
          icon: type === 'occupancy' ? 'occu_highest' : 'highest',
          color: '#e8585a'
        }
      }
      let tmlKPIarr = []
      let typeCheckname = checkNameObj[type]
      for (const key in typeCheckname) {
        if (typeCheckname.hasOwnProperty(key)) {
          const element = typeCheckname[key]
          let sizeData
          if (data[key]) {
            if (_.isNumber(data[key])) {
              if (Number(data[key]) < 0) sizeData = 0
              else sizeData = data[key]
            } else {
              if (Number(data[key].number) < 0) data[key].number = 0
              sizeData = data[key]
            }
          } else sizeData = 0

          tmlKPIarr.push({
            id: type + key,
            name: element,
            data: sizeData,
            type: icontypes[key]
          })
        }
      }
      return tmlKPIarr
    },
    selectDate (date, clickType) {
      if (date[0] == '' || this.outRange == date.toString()) return false
      // 日期选
      this.clickTimeName = clickType
      this.outRange = date.toString()
      this.innerRange = gotInnerRange(date)
      // 销售数据
    },
    initDateDuration () {
      let format = 'YYYY-MM-DD'
      let endtime = Moment().add(-1, 'days').format(format)
      let starttime = Moment().add(-1, 'days').format(format)
      let dateDuration = `${starttime},${endtime}`
      return dateDuration
    },
    getCustom () {
      // 请求客户数据
      let params = { range: this.outRange }
      if (this.currentMenuName === 'company') {
        params.bzid && delete params.bzid
      } else params.bzid = this.currentMenuName
      if (!params.bzid) return
      return getEntityFlow(params)
    },
    getHistoryComputed () {
      // 历史客流指标数据查询
      let params = { companyId: this.companyId, timeRange: this.outRange }
      return postHistorycompute(params)
    },
    intervalClick (val) {
      clearInterval(this.intervalId)
      let time
      if (val == '30秒') {
        time = 1000 * 30
      } else if (val == '5分钟') {
        time = 1000 * 60 * 5
      } else if (val == '10分钟') {
        time = 1000 * 60 * 10
      } else if (val == '20分钟') {
        time = 1000 * 60 * 20
      } else if (val == '30分钟') {
        time = 1000 * 60 * 30
      }
      this.intervalId = setInterval(() => {
        if(this.$route.name==='dashboardAnalytics'){
           this.updateRealTimezone()
        }else{
          return false
        }
       
      }, time)
    },
    updateRealTimezone () {
      let companyId = this.companyId // 公司id
      getCurrent({ time: this.today, companyId, offset: 60 }).then(res => {
				this.$set(this.initRes, 0, res)
				this.mapDataInit(this.initRes)
			}).catch(err => {
				console.log(err)
			})
    },
    async initRequest () {
      // in 1.0 version has 'company'
      this.outRange = this.initDateDuration()// get this month's date range
      let companyId = this.companyId // companyId

      // 取消多余http请求
      if (typeof this.cancelGetBussinessTreeAjax === 'function') {
        this.cancelGetBussinessTreeAjax()
      }
      if (typeof this.cancelGetCurrentAjax === 'function') {
        this.cancelGetCurrentAjax()
      }
      // request orgnization and instantData of company
      this.initRes = await Promise.all([
        getCurrent({ time: this.today, companyId, offset: 60 }, this),
        getBussinessTree({ entity: 52 }, this)
      ])
      let nowBzid = this.$store.state.user.bzid
      var resp = this.initRes[1]
      var areaList = []
      resp.data.data.forEach(function (m) {
        if (nowBzid.indexOf(m.id) > -1) {
          m.children.forEach(function (l) {
            if (l.area) {
              l.area.forEach(function (ele) {
                let obj = {}
                obj.id = ele.id
                obj.value = ele.id
                obj.key = ele.id
                obj.name = ele.name
                obj.text = ele.name
                obj.label = ele.name
                areaList.push(obj)
              })
            }
          })
        }
      })
      this.$store.commit('setAreaList', areaList)

      this.mapDataInit(this.initRes)// 实时区域初始化
      // 历史区域中，趋势对比，和排行占比，通过传入props watch 请求数据，卡片部分，客户数据则是在这个组件请求数据
      // 历史销售指标数据
      this.canshow = true
      let footfallReq = this.getHistoryComputed()
      this.querHistory(footfallReq)
    },
    async  querHistory (req) {
      let reqs = [
        this.getSalesData({ time1: this.outRange, company_id: this.companyId }),
        this.getCustom()
      ]
      if (req) reqs.push(req)
      let res = await Promise.all(reqs)
      const [salesData, customData, footFallData] = res
      this.summarySalse = salesData.filter(e => e.id == 'SaleAmount')
      if (customData) this.footFallTypeRes = customData.data.data
      if (footFallData) this.historyData = footFallData.data.data
    },
    updateHistoryRes (history, current) {
      for (const key in history.company.enter) {
        if (history.company.enter.hasOwnProperty(key)) {
          const element = history.company.enter[key]
          if (element.hasOwnProperty('lastRatio')) delete element.lastRatio
          if (element.hasOwnProperty('ringRatio')) delete element.ringRatio
          element.number = current.company[key].hasOwnProperty('number') ? current.company[key].number : current.company[key]
        }
      }
      history.property.forEach((element, index) => {
        for (const key in element) {
          if (element.hasOwnProperty(key)) {
            const e = element[key]
            if (key === 'enter' || key === 'occupancy') {
              for (const k in e) {
                if (e.hasOwnProperty(k)) {
                  const o = e[k]
                  if (o.hasOwnProperty('lastRatio')) delete o.lastRatio
                  if (o.hasOwnProperty('ringRatio')) delete o.ringRatio
                  o.number = current.property[index][key][k].hasOwnProperty('number') ? current.property[index][key][k].number : current.property[index][key][k]
                }
              }
            }
          }
        }
      })
    }
  },
  deactivated () {
    this.intervalId && clearInterval(this.intervalId)
  }
}
</script>
<style lang="stylus" scoped>
.group-right-list
  padding-bottom 9px
.history-date-picker
  min-width 236px
.groupStyle.bottomcard
  padding-bottom 9px!important
  margin-top 0!important
</style>
<style lang="less" scoped>

</style>
