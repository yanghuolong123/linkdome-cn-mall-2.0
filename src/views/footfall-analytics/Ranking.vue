<template>
  <div style="position:relative">
    <!--客流数据指标-->
      <flow-selector :maxEntity="false" @paramsPrepare="paramsPrepare"></flow-selector>
        <home-ranking
        ref='ranking'
        :orderName='orderName'
        :chartType="chartType"
        ></home-ranking>
  </div>
</template>
<script>
import homeRanking from '@/views/home/Ranking.vue'
import FlowSelector from '_c/flow-selector/rank-flow-selector'
export default {
  name: 'rate_page',
  components: {
    homeRanking,
    FlowSelector
  },
  data () {
    return {
      homeName: 'ranking',
      orderName: 'PassengerFlow',
      chartType: 'pie',
    }
  },
  methods: {
      paramsPrepare (val) {
        this.$nextTick(() => { this.$refs.ranking.entitysCompareReq(val.date1Array, val.entitys,val.compareType) })
    }
  },

}
</script>
<style lang="less" scoped>
.rate_analysis_title {
  width: 100%;
  height: auto;
  span {
    display: inline-block;
    height: 36px;
    border-left: 2px solid rgba(0, 160, 233, 1);
    font-size: 24px;
    line-height: 36px;
    color: #4096e5;
    padding-left: 20px;
    margin-bottom: 40px;
  }
}
.rate_analysis {
  margin-top: 20px;
  padding: 0 20px 20px;
  background-color: #fff;
  border-radius: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border: 1px solid #d7dfe3;
  > p {
    font-size: 20px;
    color: #919191;
    text-align: left !important;
    font-family: SourceHanSansCN-Regular;
    line-height: 96px;
    padding-left: 56px;
    border-bottom: 1px solid rgba(215, 223, 227, 1);
  }
}
.bottomRow {
  margin-top: 16px;
  height: 40px;
}
.selectorbox{
  border-radius: 6px;
  box-shadow: 0 0 9px 0 rgba(166,168,169,.4);
}
</style>
<style lang="stylus" scoped>
.selectorbox ::v-deep
  .ivu-card-bordered
    border none
  .ivu-card-body
    padding 20px
    padding-top 0px
</style>
