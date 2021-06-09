<template>
  <div id="myselect">
    <Select
      v-model="model1"
      transfer
      style="height:40px"
      @on-change="handleChange(model1)"
    >
      <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
  </div>
</template>
<script>
export default {
  name: 'iselector',
  props: {
    selectList: {
      type: Array,
      default: () => [
        {
          value: 'nocompare',
          label: '无对比',
          selected: 'selected'
        },
        {
          value: 'compare',
          label: '实体对比'
        },
        {
          value: 'time',
          label: '时间对比'
        }
      ]
    }
  },
  data () {
    return {
      cityList: this.selectList,
      model1: 'nocompare'
    }
  },
  methods: {
    handleChange (model1) {
      this.$emit('showCascader', this.model1)
    }
  }
}
</script>
<style lang="stylus" scoped>
#myselect /deep/
  .ivu-select-selection
    height 40px
    .ivu-select-selected-value
      height 40px
      line-height 40px
      font-size 16px
</style>
