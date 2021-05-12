<template>
  <div class="homemenubox">
    <Menu mode="horizontal" :active-name="activeMeun" @on-select="handleSelect">
      <!-- 如果只有一个则只显示一个购物商场，左侧名字隐藏 v-if控制 -->
      <div class="menuname">
        <page-sub-title v-if="submenulist.length" :titleText="menuname"></page-sub-title>
      </div>
      <div>
        <MenuItem name="company">集团公司</MenuItem>
        <Submenu class="shoppingAction" name="shop" transfer v-if="submenulist.length">
          <template slot="title">购物中心</template>
          <MenuItem
            v-for="(item,index) in submenulist"
            :key="`shop-${index}`"
            :name="`${item}`"
          >{{menulist[item].name}}</MenuItem>
        </Submenu>
      </div>
    </Menu>
  </div>
</template>
<script>
export default {
  name: 'homeMenu',
  props: {
    menulist: {
      type: Object,
      default: () => ([])
    },
    activeMeun: {
      type: String
    }
  },
  data () {
    return {
      menuname: ''
    }
  },
  computed: {
    submenulist () {
      let tmlarr = Object.keys(this.menulist)
      if (tmlarr.length > 1) {
        let propertys = tmlarr.filter(e => { return e !== 'company' })
        return propertys
      } else {
        return []
      }
    }
  },
  watch: {
    menulist (newval, oldval) {
      this.menuname = this.menulist['company'] ? this.menulist['company'].name : this.menulist[Object.keys(this.menulist)[0]].name
    }
  },
  methods: {
    handleSelect (name) {
      if (this.submenulist.length) {
        // 当有子菜单时候去更新数据
        this.$emit('on-select', name)
        this.menuname = this.menulist[name].name
      }
    }
  }
}
</script>
<style>
.shoppingAction .ivu-select-dropdown {
  right: 2px !important;
  left: auto !important;
}
</style>
<style lang="stylus" scoped>
.homemenubox /deep/
    >ul
        background-color transparent
        display flex
        justify-content space-between
        align-items center
        li
            font-size 24px
        &:after
            display none
        .menuname
            display inline-block
            >h4
              margin-bottom 0px
        >li
            float right
            padding 0 30px
            .ivu-select-dropdown
              max-height 350px
              max-width 500px
          max-width 800px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          .subTitle
            margin-bottom 0
    .ivu-select-dropdown
        max-width 400px
        max-height 500px
</style>
