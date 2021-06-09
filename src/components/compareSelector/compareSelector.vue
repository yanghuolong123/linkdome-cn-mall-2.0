<template>
  <Card class="selector" :dis-hover="true">
    <Row :gutter="40">
      <i-col :span="5">
        <DatePicker
          v-if="isGoal"
          type="year"
          @originDateDidChange="originDateDidChange"
          placeholder="Select year"
        ></DatePicker>
        <i-time-picker v-else="!isGoal" :dtype="0" @originDateDidChange="originDateDidChange"></i-time-picker>
      </i-col>
      <i-col :span="5">
        <i-selector @showCascader="showCascader" v-if="selectType !=='age'"></i-selector>
        <i-selector @showCascader="showCascader" v-else :selectList="ageSelectList"></i-selector>
      </i-col>
      <i-col :span="5" v-if="isShowCascader">
        <i-cascader v-if="!isMultiSelect" @cascaderChanging="cascaderChanging" :ctype="0"></i-cascader>
        <select-list v-else @onChange="cascaderChanging" :ctype="0"></select-list>
      </i-col>
      <i-col :span="5" v-if="showOtherDatePicker">
        <DatePicker
          v-if="isGoal"
          type="year"
          @otherDateDidChange="otherDateDidChange"
          placeholder="Select year"
        ></DatePicker>
        <i-time-picker v-else="!isGoal" :dtype="1" @otherDateDidChange="otherDateDidChange"></i-time-picker>
      </i-col>
    </Row>
    <Row :gutter="40">
      <i-col span="5">
        <i-cascader v-if="!isMultiSelect" @cascaderChanging="cascaderChanging" :ctype="1"></i-cascader>
        <select-list @onChange="cascaderChanging" v-else :ctype="1"></select-list>
      </i-col>
      <i-col span="2"  class="buttonbox">
        <Button @click="btnDidClick" type="primary">查询</Button>
      </i-col>
    </Row>
  </Card>
</template>
<script>
import { iTimePicker, iSelector, iCascader } from './components'
import selectList from '_c/Passenger-analysis/SelectList.vue'
import moment from 'moment'
export default {
  name: 'compareSelector',
  props: {
    isGoal: {
      type: Boolean,
      default: false
    },
    isMultiSelect: {
      type: Boolean,
      default: false
    },
    selectType: {
      type: String,
      default: 'normal'
    }
  },
  components: {
    iTimePicker,
    iSelector,
    iCascader,
    selectList
  },
  data () {
    return {
      isShowCascader: false,
      showOtherDatePicker: false,
      queryPrepareParams: {
        date1Array: [],
        date2Array: [],
        entity1: {},
        entity2: {},
        compareType: 'not'
      },
      ageSelectList: [
        {
          value: 'nocompare',
          label: '无对比',
          selected: 'selected'
        },
        {
          value: 'compare',
          label: '实体对比'
        }
      ]
    }
  },
  created () {
    let datenow = moment().format('YYYY-MM-DD')
    this.queryPrepareParams.date1Array = [datenow, datenow]
  },
  methods: {
    showCascader (model) {
      if (model === 'compare') {
        this.isShowCascader = true
        this.showOtherDatePicker = false
        this.queryPrepareParams.compareType = 'entity'
        this.queryPrepareParams.date2Array = []
      }
      if (model === 'nocompare') {
        this.isShowCascader = false
        this.showOtherDatePicker = false
        this.queryPrepareParams.compareType = 'not'
      }
      if (model === 'time') {
        this.isShowCascader = false
        this.showOtherDatePicker = true
        this.queryPrepareParams.compareType = 'time'
        this.queryPrepareParams.entity2 = {}
      }
    },
    originDateDidChange (dates) {
      this.queryPrepareParams.date1Array = dates
    },
    otherDateDidChange (dates) {
      this.queryPrepareParams.date2Array = dates
    },
    cascaderChanging (selectData, type) {
      if (type === 1) {
        this.queryPrepareParams.entity1 = selectData
      } else {
        this.queryPrepareParams.entity2 = selectData
      }
    },
    btnDidClick () {
      if (this.queryPrepareParams.compareType === 'time' && this.queryPrepareParams.date2Array.length === 0) {
        alert('对比时间为空')
        return
      }
      if (this.queryPrepareParams.compareType === 'entity' && (!_.has(this.queryPrepareParams.entity2, 'label') && !_.has(this.queryPrepareParams.entity2[0], 'name'))) {
        alert('另一个对比对象为空')
        return
      }
      if (this.queryPrepareParams.compareType === 'not' && (!_.has(this.queryPrepareParams.entity1, 'label') && !_.has(this.queryPrepareParams.entity1[0], 'name'))) {
        alert('实体信息为空，不能查询')
        return
      }
      this.$emit('paramsPrepare', this.queryPrepareParams)
    }
  }
}
</script>
<style lang="stylus" scoped>
.selector /deep/
    .ivu-card-body
        padding 20px
        >div:nth-child(1)
            margin-bottom 20px
.buttonbox /deep/
  .ivu-btn
    font-size 16px
</style>
