<template>
    <div class="tabitem">
        <slot></slot>
    </div>
</template>
<script>
export default {
  name: 'TabItem',
  mounted () {
    this.$nextTick(() => {
      this.updateNav()
    })
  },
  methods: {
    updateNav () {
      this.$parent.updateNav()
    }
  },
  destroyed () {
    this.$nextTick(() => {
      this.updateNav()
    })
  }
}
</script>
<style lang="stylus" scoped>
.tabitem
  width 100%!important
  height 100%!important
</style>
