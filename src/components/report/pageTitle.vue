<template>
  <h4 class="pagesubtitle">
      <span>{{typeName}}</span>
      <span>{{companyName}}</span>
      <span></span>
  </h4>
</template>

<script>
export default {
  props: {
    companyName: {
      type: String,
      default: ''
    },
    typeName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scope>
    .pagesubtitle
        line-height 80px
        border-bottom 2px solid #b7c4ca
        font-size 27px
        font-weight normal
        display flex
        justify-content flex-start
        color #363636
        >span
            flex 1
            &:nth-child(1)
                color #1190d5
            &:nth-child(2)
                text-align center

</style>
