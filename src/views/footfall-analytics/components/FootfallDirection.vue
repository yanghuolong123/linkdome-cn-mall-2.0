<!-- =========================================================================================
实体引力分析图表组件
========================================================================================== -->
<template>
  <div class="direction-chart-container mt-6">
    <drainage-tab v-model="drainageType" :tabs="tabsList"></drainage-tab>
    <div class="p-3 chart-container" v-if="chartData">
      <div class="trend-container">
        <div class="left-chart-box">
          <chartTabs :xAxis="chartData.xAxis" :extraOptions="occpuancyOptions" title='趋势图' :series="chartData.series"></chartTabs>
        </div>
        <div class="right-card-box">
          <div v-for="(item,index) in cardData" :key="index">
            <span class="my-icon-box" :style="{backgroundColor:`${convertColor(item.color)}`}"><icons :type="item.icon" :color="item.color" :size="24"></icons></span>
            <div class="leading-loose">
              <p class="text-lg font-medium">{{item.name}}</p>
              <p>{{item.number}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="ranking-container">
        <Rank
          :time1="formatDate.toString()"
          defaultBizIndicator="enter"
          defaultShopIndicator="enter"
          :indicatorSelector="false"
          :indicatorData="rankIndicator"
          :bzid="rankBzid"
          :isDrainage='true'
          :drainageId = 'bzid'
          :typeName='drainageName'
          :drainageApi='apiDifference'
        ></Rank>
      </div>
      <div class="mt-6" v-show="drainageType==='from'">
        <age-gender :time1="formatDate.toString()" :bzid="bzid"></age-gender>
      </div>
    </div>
  </div>
</template>
<script>
import { getEntityDrainage } from '@/api/analysis'
import drainageTab from './components/DrainageTab'
import Rank from '@/views/operation/components/RankingDrainage.vue'
import ageGender from './AgeGenderChart.vue'
import chartTabs from '@/components/common/CopyChartsTabs.vue'
import { getFootfallTrend } from '@/api/passenger'
import { gotInnerRange } from '@/libs/util'
import hexToRgba from 'hex-to-rgba'
import moment from 'moment'

export default {
  name: 'FootfallDirection',
  props: {
    bzid: {
      type: Number,
      required: true
    },
    fromGates: {
      type: Object,
      default: () => ({})
    },
    fromStores: {
      type: Object,
      default: () => ({})
    },
    toGates: {
      type: Object,
      default: () => ({})
    },
    toStores: {
      type: Object,
      default: () => ({})
    },
    time: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  components: {
    Rank,
    chartTabs,
    drainageTab,
    ageGender
  },
  watch: {
    fromGates: {
      deep: true,
      handler (val, oldVal) {
        if (val) {
          this.selectTime = this.time
          this.getTrendData()
        }
      }
    }
  },
  computed: {
    fromGateIds () {
      return this.fromGates.gates.map(e => e.bzid)
    },
    fromStoreIds () {
      return this.fromStores.stores.map(e => e.bzid)
    },
    toGateIds () {
      return this.toGates.gates.map(e => e.bzid)
    },
    toStoreIds () {
      return this.toStores.stores.map(e => e.bzid)
    },
    innerRange () {
      return gotInnerRange(this.formatDate)
    },
    convertInnerRange () {
      // 由于之前的innerrang 约定为 1hour 1day 1month ,新的innerrang 约定为 Hour Date Month,需要抓换
      if (this.innerRange === '1h') return 'Hour'
      if (this.innerRange === '1day') return 'Date'
      if (this.innerRange === '1month') return 'Month'
    },
    formatDate () {
      return this.selectTime.map(e => moment(e).format('YYYY-MM-DD'))
    },
    chartData () {
      if (!this.trendRes.length) return null
      const [fromGate, fromStore, toGate, toStore] = this.trendRes
      const { innerRange } = this
      const allRes = { fromGate, fromStore, toGate, toStore }

      let series = []
      let xAxis = {
        name: '时间',
        key: 'time',
        data: []
      }
      Object.keys(this.entityType).forEach(e => {
        if (!(this.drainageType === 'to' && e === 'Gate')) { // 目的客流量不需要gate
          let resData = allRes[`${this.drainageType}${e}`].data.data
          xAxis.data = []
          resData.map(list => {
            xAxis.data.push(list.date)
          })
          let obj = {}
          obj.name = this.drainageType === 'to' ? '目的流量' : `${this.entityType[e]}${this.direction[this.drainageType]}`
          obj.key = ''
          obj.data = []
          resData.map(data => {
            obj.key = `${e}_${data.date}`
            obj.data.push(data.value)
          })
          series.push(obj)
        }
      })

      let total = _.sum(series[0] && series[0].data)
      let yObj = {}
      if (total == 0) {
        yObj = {
          title: {
            text: '',
            style: {
              fontSize: '13px'
            }
          },
          labels: {
            formatter (value) {
              value = value > 0 ? Number(value).toLocaleString() : 0
              return value
            }
          }
        }
      } else {
        yObj = {
          title: {
            text: '',
            style: {
              fontSize: '13px'
            }
          },
          labels: {
            formatter (value) {
              value = value > 0 ? Number(value).toLocaleString() : 0
              return value
            }
          },
          min: 0
        }
      }
      this.occpuancyOptions.yaxis = []
      this.occpuancyOptions.yaxis.push(yObj)
      return { series, xAxis }
    },
    cardData () {
      // 直接来源个数
      // 间接来源个数 | 辐射店铺个数
      // 导入总客流人数 | 辐射总客流
      const { chartData } = this
      let sumFootFall = _.sumBy(chartData.series, o => _.sum(o.data))
      let countOfIndirect = this[`${this.drainageType}StoreIds`].length
      let coutOfdiret = this[`${this.drainageType}GateIds`].length
      let footfallName = {
        from: '导入',
        to: '辐射'
      }
      let tml = [
        {
          number: sumFootFall,
          name: `${footfallName[this.drainageType]}总客流`,
          icon: 'daoruzongkeliu',
          color: '#857AEF'
        }
      ]

      if (this.drainageType === 'from') {
        return [...tml, ...[
          {
            number: coutOfdiret,
            name: '出入口个数',
            icon: 'danyilaiyuan',
            color: '#2BD9CF'

          },
          {
            number: countOfIndirect,
            name: '店铺个数',
            icon: 'jianjielaiyuan',
            color: '#33B3ED'
          }]
        ]
      } else {
        return [...tml, ...[
          {
            number: countOfIndirect,
            name: '辐射店铺个数',
            icon: 'danyilaiyuan',
            color: '#857AEF'
          }
        ]]
      }
    },
    rankBzid () {
      return this[`${this.drainageType}StoreIds`]
    }
  },
  data () {
    return {
      occpuancyOptions: {
        yaxis: []
      },
      drainageType: '',
      apiDifference: '',
      drainageName: 'drainage',
      indicators: {
        enter: {
          name: '入客流',
          yaxis: {
            title: {
              text: '客流量（人）'
            },
            labels: {
              formatter (value) {
                return value ? value.toLocaleString() : ''
              }
            }
          }
        }
      },
      tabsList: [
        {
          value: 'from',
          label: '来源流量分析',
          tootipText: '1. 趋势图：分别展示了出入口和商铺转化客流趋势\n2. 导入总客流：来自出入口和商铺的客流之和\n3. 出入口个数： 出入口实体的总个数\n4. 店铺个数：店铺实体的总个数'
        },
        {
          value: 'to',
          label: '目的流量分析',
          tootipText: '1. 趋势图：展示了所选实体到其他商铺转化客流趋势\n2. 辐射总客流：所选商铺辐射到其他店铺的客流之和\n3. 辐射店铺个数：所选店铺辐射其他店铺的总个数'
        }
      ],
      trendRes: [],
      rankIndicator: {
        enter: { name: '入客流' }
      },
      canshow: false,
      direction: {
        from: '来源',
        to: '目的'
      },
      entityType: {
        Gate: '出入口',
        Store: '商铺'
      },
      selectTime: ''// 上级组件选择时间会立即传递到子组件，触发watch,此时用户并没有点击查询按钮，因此，在该组件watch到id的变化在改变该时间，达到同时传递时间和id 的目的
    }
  },
  methods: {
    async getTrendData () {
      //   客流趋势
      let reqs = []
      let { formatDate: time1, entityType } = this
      let dateType = this.gotInnerRange(time1)
      this.tabsList.forEach(e => {
        Object.keys(entityType).forEach(type => {
          let params = {
            time1: time1.toString(),
            range: dateType,
            from_bzids: e.value == 'from' ? this[`${e.value}${type}Ids`].toString() : this.bzid,
            to_bzids: e.value == 'from' ? this.bzid : this[`${e.value}${type}Ids`].toString()
          }
          this.apiDifference = params
          reqs.push(getEntityDrainage(params))
        })
      })
      this.trendRes = await Promise.all(reqs).catch(err => console.log(err))

      this.canshow = true
    },
    convertColor (color) {
      return hexToRgba(color, 0.2)
    },
    gotInnerRange (date) {
      const [start, end] = date
      let startTime = moment(start)
      let endTime = moment(end)
      let diffDays = moment.duration(endTime.diff(startTime)).asDays()
      let innerRange = ''
      if (diffDays < 60) innerRange = 'Date'
      else innerRange = 'Month'
      return innerRange
    }
  }
}
</script>

<style lang="stylus" scope>
@import './footfallDirection.styl'
</style>
