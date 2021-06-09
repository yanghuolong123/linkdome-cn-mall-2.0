<template>
  <div style="position:relative">
    <!--客流数据指标-->
    <Card class="selectorbox">
      <flow-selector
        :isGate="true"
        :isArea='true'
        :isFloor='true'
        :isStore='true'
        :isShowTypeSelect="false"
        :compare="false"
        :footFall ="false"
        :isRanking ="true"
        :isReset='true'
        ref="selector"
        :routName="homeName"
        @on-change="handelChange"
      ></flow-selector>
    </Card>
    <!-- <div class="rate_analysis">
      <template> -->
        <home-ranking
        ref='ranking'
        :orderName='orderName'
        :chartType="chartType"
        ></home-ranking>
      <!-- </template>
    </div> -->
  </div>
</template>
<script>
import homeRanking from '@/views/home/Ranking.vue'
import iDatePicker from '_c/common/idatepicker.vue'
import selectList from '_c/Passenger-analysis/SelectList.vue'
import moment from 'moment'
import flowSelector from '_c/Passenger-analysis/flowSelector'
export default {
  name: 'rate_page',
  components: {
    homeRanking,
    iDatePicker,
    selectList,
    flowSelector
  },
  data () {
    return {
      homeName: 'ranking',
      orderName: '客流',
      chartType: 'pie',
      range: []
    }
  },
  mounted () {
    this.$refs.selector.compareType = 'entity' // 显示radio
    this.$refs.selector.entityType = 'floor' // 显示radio
    var date = new Date()
    date = date.setDate(date.getDate() - 1)
    var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
    this.range = dateTime
  },
  methods: {
    handelChange (val) {
      if (!val.date1Array.length) {
        alert('请选择日期')
        return
      }
      if (this.$store.state.home.headerAction && !val.entitys.length) {
        alert('请选择实体')
        return
      }
      val.entitys = _.remove(val.entitys, function (n) { return n.id != 0 })
      this.$nextTick(() => { this.$refs.ranking.entitysCompareReq(val.date1Array, val.entitys) })

      try {
        let date = val.date1Array[0] + ',' + val.date1Array[1]
        let value
        val.entitys.forEach(item => {
          value = item.belongsType ? item.belongsType : ''
        })
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '数据查询', { '时间段': date, '实体选择': value })
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '数据查询' + '埋点error:' + error)
      }
    }
  }
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
.selectorbox /deep/
  .ivu-card-bordered
    border none
  .ivu-card-body
    padding 20px
    padding-top 0px
</style>
