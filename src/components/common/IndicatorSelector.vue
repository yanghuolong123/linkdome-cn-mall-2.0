<template>
  <div class="flex justify-between items-center mr-10">
    <span class="whitespace-no-wrap mx-4 text-sm">数据指标:</span>
    <vs-select autocomplete :multiple="multiple" v-model="typeArr" class="chartSelector" :max-selected="2" key="chartSelector">
      <vs-select-item v-for="(item,index) in selectList " :text="item.name" :key="index" :value="item.value"/>
    </vs-select>
  </div>
</template>
<script>
export default {
  name: 'indicatorSelectort',
  props: {
    selectList: {
      type: Array,
      default: () => [
        {
          value: 'enter',
          name: '入客流'
        },
        {
          value: 'exit',
          name: '出客流'
        },
        {
          value: 'areaEffect',
          name: '坪效'
        },
        {
          value: 'buyRate',
          name: '成交率'
        },
        {
          value: 'rebuyRate',
          name: '复购率'
        }
      ]
    },
    multiple: {
      type: Boolean,
      default: true
    },
    defaultValue: {
      type: String,
      default: 'enter'
    },
    maxSelected: {
      type: Number,
      default: 2
    }
  },
  created () {
    if (this.defaultValue) this.typeArr = [this.defaultValue]
  },
  data () {
    return {
      typeArr: ['enter']
    }
  },
  watch: {
    typeArr (newval, oldval) {
      if (!Array.isArray(newval)) newval = Array.of(newval)
      this.$emit('input', newval)
    },
    multiple (val) {
      if (!val) this.typeArr = this.defaultValue
      else this.typeArr = [this.defaultValue]
    }
  }
}
</script>
<style lang="stylus">
.chartSelector /deep/
  width 150px
  .input-select.vs-select--input
    padding 5px
</style>
