<template>
  <div v-if="showData">
    <shopping-dashboard v-if="headerType"></shopping-dashboard>
    <group-dashboard v-else></group-dashboard>
  </div>
</template>
<script>
import shoppingDashboard from './dashboard-module/shoppingDashboard.vue'
import groupDashboard from './dashboard-module/groupDashboard.vue'
export default {
  name: 'dashboardHome',
  components: {
    shoppingDashboard,
    groupDashboard
  },
  data () {
    return {
      showData: false
    }
  },
  created () {
    var menuList = JSON.parse(window.localStorage.getItem('menulist'))
    var Dashboard = _.find(menuList, ['name', 'Dashboard']).subpagesList
    var GroupCompany = _.find(Dashboard, ['name', 'GroupCompany']).id + ''
    var Shopping = _.find(Dashboard, ['name', 'Shopping']).id + ''
    var showCompany
    var showShoping
    _.indexOf(this.$store.state.user.access, GroupCompany) > -1 ? showCompany = true : showCompany = false
    _.indexOf(this.$store.state.user.access, Shopping) > -1 ? showShoping = true : showShoping = false
    let names = this.$store.state.user.shopUserName
    if (!showCompany && !showShoping) {
      this.$router.push(names)
      this.showData = false
    } else {
      this.showData = true
    }
  },
  computed: {
    headerType () {
      let type
      if (this.$store.state.user.role_id == 1 || this.$store.state.user.role_id == 2) {
        if (this.$store.state.home.headerAction == 0) {
          type = false
        } else {
          type = true
        }
      } else {
        let menuList = JSON.parse(window.localStorage.getItem('menulist'))
        let GroupCompany = _.find(menuList, ['name', 'Dashboard']).subpagesList
        GroupCompany = _.find(GroupCompany, ['name', 'GroupCompany']).id + ''
        let showCompany = _.indexOf(this.$store.state.user.access, GroupCompany) > -1
        if (showCompany) {
          type = false
        } else {
          type = true
          let role_property = this.$store.state.user.checklist
          this.$store.commit('headerAction', role_property[0])
        }
      }
      return type
    }
  },
  mounted () {
  },
  activated () { }, // 进入页面就触发 可用于初始化页面数据等
  watch: {},
  methods: {},
  deactivated () { } // 离开页面使用时调用
}
</script>
