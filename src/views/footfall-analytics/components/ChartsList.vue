<template>
  <div class="chart-list">
    <div
      class="item box-card bg-white"
      v-for="(item,index) in data"
      :key="index"
      :class="{times:item.name==='arrival_distribution'}"
    >
      <slot :item="item"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'chartList',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style scoped lang="stylus">
@import ('./chartList.styl')
</style>
