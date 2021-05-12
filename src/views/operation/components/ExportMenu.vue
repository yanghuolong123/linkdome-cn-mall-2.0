<template>
  <li title='下载'>
    <span class="navitemIcon"
          @click="handleClik('current')">
      <icons type="daoru"
             :size="20"
             color="#9D9D9DFF"></icons>
    </span>
  </li>
</template>

<script>
export default {
  name: 'exportMenu',
  data () {
    return {
      menus: [
        {
          key: 'current',
          name: '导出当前'
        },
        {
          key: 'all',
          name: '导出所有'
        }
      ]
    }
  },
  methods: {
    handleClik (val) {
      this.$emit('onchange', val)
    }
  }
}
</script>
<style lang="stylus">
.navitemIcon
  cursor pointer
.my-dropdown-item-export
  >a
    white-space nowrap
li
  list-style none
</style>
