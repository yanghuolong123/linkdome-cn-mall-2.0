<template>
  <div class="sales">
    <flow-selector @paramsPrepare="paramsPrepare"></flow-selector>

    <div class="px-3 -mx-3 overflow-hidden" style="padding-bottom:20px">
      <!-- 销售列表 -->
      <indicator-cards
        :operate="false"
        :indicatorList="indicatorData"
        :defaultCountsOfCards="5"
        scaleCards
      >
        <template slot-scope="{item}">
          <singleCard :item="item" :isLiveData="false" :multiDate="Boolean(outrange2)"></singleCard>
        </template>
      </indicator-cards>
    </div>
    <!-- 趋势分析 -->
    <Trend
      :time1="outrange"
      :time2="outrange2"
      :propertyId='propertyId'
      :innerRange="innerRange"
      :indicatorData="indicators"
      :istotal='true'
    ></Trend>
    <!-- 排行分析 -->
    <Ranking :time1="outrange" :istotal='false' :time2="outrange2" :propertyId="propertyId"></Ranking>
  </div>
</template>

<script>
  import singleCard from '@/views/home/components/singleCard.vue'
import indicatorCards from '@/views/home/components/IndicatorCards.vue'
import mixins from './salseMixin.js'
import Trend from '@/views/home/Trend.vue'
import Ranking from './components/RankingGroup.vue'
import { gotInnerRange} from '@/libs/util'
import salesDict from '@/views/home/components/salesIndicatorDict.js'
  import FlowSelector from '_c/flow-selector/sale-flow-selector'
  export default {
  name: 'salse',
  mixins: [mixins],
  components: {
    indicatorCards,
    FlowSelector,
    Ranking,
    Trend,
    singleCard,
  },
  data () {
    return {
      entitys: [],
      indicatorData: [],
      outrange: '',
      outrange2: '',
      innerRange: '',
    }
  },
  computed: {

    propertyId () {
      return  this.$store.state.home.headerAction
    },
    indicators () {
      let enterIndicator = {
        name:this.$t('fx.enter'),
        yaxis: {
          title: {
            text:  `${this.$t('fx.enter')}(${this.$t('person')})`
          },
          labels: {
            formatter (value) {
              return value ? value.toLocaleString() : ''
            }
          }
        }
      }
      let cloneSalseDict = _.cloneDeep(salesDict)
      delete cloneSalseDict.SaleAmount
      delete cloneSalseDict.UnitPrice
      return { ...{ enter: enterIndicator }, ...cloneSalseDict }
    }
  },
  methods: {
    async paramsPrepare (val) {
      if (this.$store.state.home.headerAction && val.entitys.length == 0) {
        this.$alert({ content:'请选择实体' })
        return false
      }
      this.entitys = val.entitys
      let innerRange1 = gotInnerRange(val.date1Array)
      if (['time','onYear','onChain'].includes(val.compareType)) {
        this.outrange2 = val.date2Array.toString()
        this.outrange = val.date1Array.toString()
        let innerRange2 = gotInnerRange(val.date2Array)
        if (innerRange1 === innerRange2) this.innerRange = innerRange1// 相同取其一
        else this.innerRange = _.maxBy([innerRange1, innerRange2], (o) => o.length) // innerrang 取值 1h,1day,1month,可以取长度最大的那个
      } else {
        this.innerRange = innerRange1
        this.outrange = val.date1Array.toString()
        this.outrange2 = null
      }

      let salesParams = {
        time1: this.outrange,
        time2: this.outrange2,
        isCompare: 0,
        propertyId: this.propertyId
      }
      const res = await this.getSalesData(salesParams)
      this.indicatorData = res
    }
  },

}
</script>
<style lang="less" scoped>
  .sales{
    .bottomcard{
      margin-top:0;
    }
  }
</style>
