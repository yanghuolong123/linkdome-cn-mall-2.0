<!-- =========================================================================================
	File Name: main.vue
	Description: Main layout
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    class="layout--main"
    :class="[navbarClasses, footerClasses, { 'app-page': isAppPage }]"
  >
    <vx-sidebar
      :sidebarItems="menuList"
      title="DeepNorth"
      parent=".layout--main"
    />
    <!-- 
      :logo="require('@/assets/images/fixation_img/logo/logo.png')" -->
    <div
      id="content-area"
      :class="[contentAreaClass, { 'show-overlay': bodyOverlay }]"
    >
      <div id="content-overlay"></div>
      <div id="vipDiv" v-if="showVip == true"></div>
      <div id="vipRecordDiv" v-show="showVip == true">
        <vipRecord ref="vipRecord" @closeVIPRecord="closeVIPRecord"></vipRecord>
      </div>
      <div class="content-wrapper">
        <the-navbar
          @showVips="showVips"
          :navbarColor="navbarColor"
          :class="[
            { 'text-white': isNavbarDark && !isThemeDark },
            { 'text-base': !isNavbarDark && isThemeDark },
          ]"
        />

        <div class="router-view">
          <div
            class="router-content"
            :class="{ 'mt-0': navbarType == 'hidden' }"
          >
            <transition :name="routerTransition">
              <div
                class="router-header flex flex-wrap items-center"
                v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
                style="margin:0 0 22px 12px"
              >
                <div
                  class="content-area__heading"
                  :class="{
                    'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light':
                      $route.meta.breadcrumb,
                  }"
                >
                  <h2 class="mb-1">{{ $t(routeTitle) }}</h2>
                </div>
                <vx-breadcrumb
                  class="ml-4 md:block hidden"
                  v-if="$route.meta.breadcrumb"
                />
              </div>
            </transition>
            <div class="content-area__content">
              <transition :name="routerTransition" mode="out-in">
                <keep-alive :exclude="cachePage">
                  <router-view
                    @changeRouteTitle="changeRouteTitle"
                  ></router-view>
                </keep-alive>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VxSidebar from "@/layouts/components/vx-sidebar/VxSidebar.vue";
import TheCustomizer from "../components/customizer/TheCustomizer.vue";
import TheNavbar from "../components/TheNavbar.vue";
import TheFooter from "../components/TheFooter.vue";
import vipRecord from "_c/vip-record/vip-record.vue";
import themeConfig from "@/../themeConfig.js";
import sidebarItems from "@/layouts/components/vx-sidebar/sidebarItems.js";

export default {
  data() {
    return {
      showVip: false,
      navbarType: themeConfig.navbarType || "floating",
      navbarColor: themeConfig.navbarColor || "#fff",
      footerType: themeConfig.footerType || "static",
      routerTransition: themeConfig.routerTransition || "none",
      isNavbarDark: false,
      routeTitle: this.$route.meta.pageTitle,
      sidebarItems: sidebarItems,
      disableCustomizer: themeConfig.disableCustomizer,
      windowWidth: window.innerWidth, // width of windows
      totalNoRead: 0,
    };
  },
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle;
    },
    isThemeDark(val) {
      if (this.navbarColor == "#fff" && val) {
        this.updateNavbarColor("#10163a");
      } else {
        this.updateNavbarColor("#fff");
      }
    },
    "$store.state.loadingStatus"(newVal) {
      if (newVal) {
        this.$vs.loading({
          container: ".content-wrapper",
          scale: 0.5,
        });
      } else {
        try {
          this.$vs.loading.close(".content-wrapper > .con-vs-loading");
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  computed: {
    isAppPage() {
      if (this.$route.path.includes("/apps/")) return true;
      else return false;
    },
    isThemeDark() {
      return this.$store.state.theme === "dark";
    },
    sidebarWidth() {
      return this.$store.state.sidebarWidth;
    },
    bodyOverlay() {
      return this.$store.state.bodyOverlay;
    },
    contentAreaClass() {
      if (this.sidebarWidth == "default") return "content-area-default";
      else if (this.sidebarWidth == "reduced") return "content-area-reduced";
      else if (this.sidebarWidth) return "content-area-full";
    },
    navbarClasses() {
      return {
        "navbar-hidden": this.navbarType == "hidden",
        "navbar-sticky": this.navbarType == "sticky",
        "navbar-static": this.navbarType == "static",
        "navbar-floating": this.navbarType == "floating",
      };
    },
    footerClasses() {
      return {
        "footer-hidden": this.footerType == "hidden",
        "footer-sticky": this.footerType == "sticky",
        "footer-static": this.footerType == "static",
      };
    },
    menuList() {
      return this.$store.getters.menuList;
    },
    cachePage() {
      return this.filterCacheList(this.menuList);
    },
  },
  methods: {
    filterCacheList(arr) {
      let tml = [];
      arr.forEach((item) => {
        if (item.meta && item.meta.notCache) {
          tml.push(item.name);
        }
        if (item.submenu && item.submenu.length > 1) {
          let submenuCache = this.filterCacheList(item.submenu);
          tml.push(...submenuCache);
        }
      });
      return tml;
    },
    changeRouteTitle(title) {
      this.routeTitle = title;
    },
    updateNavbar(val) {
      this.navbarType = val;
    },
    updateNavbarColor(val) {
      this.navbarColor = val;
      if (val == "#fff") this.isNavbarDark = false;
      else this.isNavbarDark = true;
    },
    updateFooter(val) {
      this.footerType = val;
    },
    updateRouterTransition(val) {
      this.routerTransition = val;
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
        this.$store.dispatch("updateSidebarWidth", "no-sidebar");
      } else if (this.windowWidth < 1200) {
        this.$store.dispatch("updateSidebarWidth", "reduced");
      } else {
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
      }
    },
    closeVIPRecord() {
      this.showVip = false;
    },
    showVips(value) {
      this.showVip = value;
    },
  },
  created() {
    this.setSidebarWidth();
    if (this.navbarColor == "#fff" && this.isThemeDark) {
      this.updateNavbarColor("#10163a");
    } else {
      this.updateNavbarColor(this.navbarColor);
    }
  },
  components: {
    VxSidebar,
    TheNavbar,
    TheFooter,
    TheCustomizer,
    vipRecord,
  },
};
</script>
<style lang="scss" scope>
.main-menu-sidebar .scroll-area--main-sidebar {
  padding-bottom: 20px;
}
.main-menu-sidebar .vs-sidebar--item a {
  margin: 13px 0;
}
.vs-sidebar {
  width: 223px;
}

#vipDiv {
  width: 100%;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: #000;
  opacity: 0.3;
}
#vipRecordDiv {
  .edit-close {
    position: absolute;
    right: -10px;
    top: -6px;
  }
  z-index: 9999999;
  position: absolute;
  left: 15.5%;
  width: 77%;
  top: 118px;
  border-radius: 6px 6px 0px 0px;
  .title {
    padding-left: 30px;
    color: rgb(102, 102, 102);
    background-color: rgb(242, 242, 242);
    height: 48px;
    line-height: 48px;
    font-size: 18px;
    border-radius: 6px 6px 0px 0px;
  }
}
.content-wrapper {
  .router-view {
    padding: 22px;
  }
}
</style>
