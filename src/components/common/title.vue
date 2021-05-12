<template>
    <h4 class="subTitle">{{titleText}}</h4>
</template>
<script>
export default {
  name: 'subTitle',
  props: {
    titleText: {
      type: String,
      default: '分析',
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.subTitle
    font-size 24px
    color rgba(64,150,229,1)
    font-weight normal
    border-left 2px solid  currentColor
    line-height 1
    padding-left 34px
    margin-bottom 30px
</style>
