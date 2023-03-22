<template>
  <div v-if="showData">
    <shopping-dashboard v-if="headerType" />
    <group-dashboard v-else />
  </div>
</template>
<script>
import shoppingDashboard from "@/views/dashboard-module/shoppingDashboard.vue";
import groupDashboard from "@/views/dashboard-module/groupDashboard.vue";
import { mapState } from 'vuex'
export default {
  name: "dashboardHome",
  components: {
    shoppingDashboard,
    groupDashboard,
  },
  data() {
    return {
      showData: false,
    };
  },
  created() {
    var Dashboard = _.find(this.menuList, ["name", "Dashboard"]).subpagesList;
    var GroupCompany = _.find(Dashboard, ["name", "GroupCompany"]).id + "";
    var Shopping = _.find(Dashboard, ["name", "Shopping"]).id + "";
    var showCompany;
    var showShoping;
    _.indexOf(this.$store.state.user.access, GroupCompany) > -1
      ? (showCompany = true)
      : (showCompany = false);
    _.indexOf(this.$store.state.user.access, Shopping) > -1
      ? (showShoping = true)
      : (showShoping = false);
    let names = this.$store.state.user.shopUserName;
    console.log(names);
    if (!showCompany && !showShoping) {
      this.$router.push(names);
      this.showData = false;
    } else {
      this.showData = true;
    }
  },
  computed: {
    ...mapState({
      menuList:state => state.home.menuList,
    }),
    headerType() {
      let type;
      if (this.$store.state.home.headerAction == 0) {
        type = false;
      } else {
        type = true;
      }

      return type;
    },
  },
};
</script>
