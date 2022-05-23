<template>
  <div v-if="showData">
    <shopping-dashboard v-if="headerType" />
    <group-dashboard v-else />
  </div>
</template>
<script>
import shoppingDashboard from "@/views/dashboard-module/shoppingDashboard.vue";
import groupDashboard from "@/views/dashboard-module/groupDashboard.vue";
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
    console.log("---");
    var menuList = JSON.parse(window.localStorage.getItem("menulist"));
    var Dashboard = _.find(menuList, ["name", "Dashboard"]).subpagesList;
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
    headerType() {
      let type;
      // if (
      //   this.$store.state.user.role_id == 1 ||
      //   this.$store.state.user.role_id == 2
      // ) {
      if (this.$store.state.home.headerAction == 0) {
        type = false;
      } else {
        type = true;
      }
      // } else {
      //   let menuList = JSON.parse(window.localStorage.getItem("menulist"));
      //   let GroupCompany = _.find(menuList, ["name", "Dashboard"]).subpagesList;
      //   console.log(GroupCompany);
      //   GroupCompany = _.find(GroupCompany, ["name", "GroupCompany"]).id + "";
      //   let showCompany =
      //     _.indexOf(this.$store.state.user.access, GroupCompany) > -1;
      //   if (showCompany) {
      //     type = false;
      //   } else {
      //     type = true;
      //     let role_property = this.$store.state.user.checklist;
      //     this.$store.commit("headerAction", role_property[0]);
      //   }
      //   console.log(
      //     this.$store.state.home.headerAction,
      //     type,
      //     this.$store.state.user.access,
      //     GroupCompany,
      //     _.indexOf(this.$store.state.user.access, GroupCompany)
      //   );
      // }
      return type;
    },
  },
};
</script>
