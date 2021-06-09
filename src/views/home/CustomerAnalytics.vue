<template>
  <div class="custom-count-box" ref="customcon" style="margin-top:20px">
    <div class="item item-age box-card bg-white" v-for="(item,index) in data" :key="index">
      <slot :item="item"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CustomerAnalytics',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="stylus" scope>
son-row-flex(direction)
  >.tab-box
    .chart-tab-box
      flex-direction direction
.custom-count-box
    display grid
    grid-template-columns repeat(6,minmax(10px,1fr))
    // grid-template-areas 'age age gender gender new-old new-old'\
    //                     'vip vip vip visit visit visit'
    grid-template-areas 'visit  visit visit new-old new-old  new-old'\
                        'age age age gender gender gender '
    grid-auto-rows auto
    grid-gap 20px
    // @media (max-width: 992px)
    //   grid-template-columns repeat(2,minmax(10px,1fr))
    //   grid-template-areas 'age gender'\
    //                       'new-old new-old'\
    //                       //  'vip visit'
    //                       'visit visit'
    //   >div:nth-child(4),div:nth-child(5)
    //     son-row-flex(column!important)
    // @media (max-width: 768px)
    //   grid-template-columns minmax(10px,1fr)
    //   grid-template-areas 'age'\
    //                       'gender'\
    //                       'new-old'\
    //                       // 'vip'\
    //                       'visit'
    >div:nth-child(1)
        grid-area age
    >div:nth-child(2)
        grid-area gender
    >div:nth-child(3)
        grid-area new-old
    // >div:nth-child(4)
    //     grid-area vip
    //     son-row-flex(row)
    >div:nth-child(4)
        grid-area visit
        son-row-flex(row)
</style>
