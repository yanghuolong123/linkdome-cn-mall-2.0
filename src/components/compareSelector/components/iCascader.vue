<template>
  <div class="treeCascader">
    <!-- {{selectItem}} -->
    <Cascader
      :data="businessTreeData"
      change-on-select
      @on-change="dataDidChange"
      trigger="hover"
      v-model="selectItem"
      transfer
    ></Cascader>
  </div>
</template>
<script>
import { getBussinessTree } from '@/api/passenger.js'
import _ from 'lodash'
export default {
  name: 'iCascader',
  created () {
    if (!this.$store.state.home.bussinessTree) this.fetchData()
    else {
      this.businessTreeData = this.addValuesToEle(_.cloneDeep(this.$store.state.home.bussinessTree))
      this.selectItem[0] = this.businessTreeData[0].id// 2019-02-25新增默认选中第一项
      this.dataDidChange(this.selectItem)
    }
  },
  props: {
    ctype: Number
  },
  data () {
    return {
      coSelect: true,
      selectItem: [],
      businessTreeData: []
    }
  },
  methods: {
    fetchData () {
      let that = this
      getBussinessTree({
        id: 1,
        entity: 52
      }).then(function (res) {
        if (res.data.code === 200) {
          that.businessTreeData = that.addValuesToEle(res.data.data)
          that.selectItem[0] = that.businessTreeData[0].id// 2019-02-25新增默认选中第一项
          that.dataDidChange(that.selectItem)
        }
      })
    },
    addValuesToEle (pArray) {
      let that = this
      return pArray.map(function (ele) {
        ele.value = ele.id
        ele.label = ele.name
        if (_.has(ele, 'children') && !_.isNull(ele.children)) {
          that.addValuesToEle(ele.children)
        }
        return ele
      })
    },
    dataDidChange (value, selectedData) {
      let ele = _.last(selectedData || value)
      this.$emit('cascaderChanging', ele, this.ctype)
    }

  }
}
</script>
<style>
.ivu-cascader-menu{
   max-width: 285px;
}
</style>

<style lang="stylus" scoped>
.treeCascader /deep/
  .ivu-input
    height 42px
    font-size 16px
    font-family "source_han_sans_cn", "Roboto", sans-serif
</style>
