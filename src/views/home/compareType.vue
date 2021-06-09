<template>
  <div class="mt-6 cards-content px-3">
      <div v-for="item in cardsData" :key="item.id" >
        <singl-card  :item="item" :isLiveData="false" :innerRange="innerRange" :rangeName="timeName"></singl-card>
      </div>
  </div>
</template>
<script>
import singlCard from './components/singleCard.vue'
export default {
  name: 'compareType',
  props: {
    data: {
      type: Array
    },
    clickTimeName: {
      type: String
    },
    innerRange: {
      type: String
    }
  },
  components: {
    singlCard
  },
  computed: {
    timeName () {
      let checkObj = {
        t: '今日',
        l: '昨日',
        w: '上周',
        m: '上月',
        y: '今年'
      }
      let name = checkObj[this.clickTimeName]
      return name
    },
    cardsData () {
      return this.data
    }
  },
  filters: {
    dateformat (val, innerRange) {
      let start = val.slice(0, 16)
      if (innerRange === '1h') {
        let [,, start,,, end] = val.split('-')
        return `${start.slice(3)}-${end.slice(3)}`
      } else if (innerRange === '1day') {
        return `${start.split(' ')[0]}`
      } else {
        return `${start.slice(0, 7)}`
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.cards-content
  display flex
  justify-content space-between
  flex-wrap wrap
  >div /deep/
    width 24%
    margin-bottom 1.5rem
    @media (max-width 992px) {
      width 48%
    }
    @media (max-width 576px) {
      width 100%
    }
    >div
      height 200px
      padding 20px!important
      .iconBox
        transform scale(1.5) translateX(4px)
        margin-bottom 15px
      .type-name
        font-size 1.25rem!important
        line-height 2
      .number-con
        font-size 2.14rem!important
      .numberrate
        line-height 2
</style>
