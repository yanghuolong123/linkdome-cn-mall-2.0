<!-- =========================================================================================
	File Name: VxSidebar.vue
	Description: Sidebar Component
	Component Name: VxSidebar
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="parentx">
    <vs-sidebar
      ref="mainSidebar"
      :parent="parent"
      :hiddenBackground="true"
      :reduce="reduce"
      default-index="-1"
      class="sidebarx main-menu-sidebar items-no-padding"
      v-model="isSidebarActive"
      :click-not-close="clickNotClose"
      :reduce-not-rebound="reduceNotRebound"
    >
      <div @mouseenter="sidebarMouseEntered" @mouseleave="sidebarMouseLeave">
        <div class="header-sidebar-main flex items-center justify-between" slot="header">
          <div class="logo" :style="{backgroundImage:`url(${logoImg?logoImg:logo})`}"></div>
          <div>

            <template v-if="showCloseButton">
              <feather-icon
                icon="XIcon"
                class="m-0 cursor-pointer"
                @click="$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)"
              ></feather-icon>
            </template>

            <template v-else-if="!showCloseButton && !sidebarItemsMin">
              <!-- <feather-icon
                icon="ArrowLeftIcon"
                class="mr-0 cursor-pointer"
                svg-classes="stroke-current"
                v-show="!reduce"
                @click="toggleReduce(true)"
              ></feather-icon> -->
              <span
                icon="ArrowLeftIcon"
                class="mr-0 cursor-pointer"
                svg-classes="stroke-current"
                v-show="!reduce"
                @click="toggleReduce(true)"
              >
                <icons type="icon_huabanfuben" style="color:#37b5ed;font-size:24px;"></icons>
              </span>

              <span
                icon="CircleIcon"
                class="mr-0 cursor-pointer"
                svg-classes="stroke-current"
                v-show="reduce"
                @click="toggleReduce(false)"
              >
                <icons type="icon_fuben" style="color:#37b5ed;font-size:24px;"></icons>
              </span>
              <!-- <feather-icon
                icon="CircleIcon"
                class="mr-0 cursor-pointer"
                svg-classes="stroke-current"
                v-show="reduce"
                @click="toggleReduce(false)"
              ></feather-icon> -->
            </template>
          </div>
        </div>
        <div class="shadow-bottom" v-show="showShadowBottom"></div>
        <VuePerfectScrollbar
          ref="mainSidebarPs"
          class="scroll-area--main-sidebar pt-2"
          :settings="settings"
          @ps-scroll-y="psSectionScroll"
        >
          <template v-for="(sidebarItem, index) in sidebarItems">
            <!-- GROUP ITEM HEADER -->
            <span
              :key="`header-${index}`"
              v-if="sidebarItem.header && !sidebarItemsMin"
              class="navigation-header truncate"
              style="font-weight:bold"
            >{{ $t(sidebarItem.i18n) || sidebarItem.header }}</span>
            <template v-else-if="!sidebarItem.header">
              <!-- IF IT'S SINGLE ITEM -->
              <vx-sidebar-item
                ref="sidebarLink"
                :key="`sidebarItem-${index}`"
                v-if="!sidebarItem.submenu"
                :index="index"
                :to="sidebarItem.slug != 'external' ? sidebarItem.url : ''"
                :href="sidebarItem.slug == 'external' ? sidebarItem.url : ''"
                :icon="sidebarItem.icon"
                :target="sidebarItem.target"
                :isDisabled="sidebarItem.isDisabled"
              >
                <span
                  v-show="!sidebarItemsMin"
                  class="truncate"
                  style="font-weight:bold"
                >{{ $t(sidebarItem.i18n) || sidebarItem.name }}</span>
                <vs-chip
                  class="ml-auto"
                  :color="sidebarItem.tagColor"
                  v-if="sidebarItem.tag && (isMouseEnter || !reduce)"
                >{{ sidebarItem.tag }}</vs-chip>
              </vx-sidebar-item>

              <!-- IF HAVE SUBMENU / DROPDOWN -->
              <template v-else>
                <vx-sidebar-group
                  ref="sidebarGrp"
                  @closeOthers="closeOthers"
                  :keyId="`group-${index}`"
                  :openHover="openGroupHover"
                  :activeKey="activeKey"
                  :group="sidebarItem"
                  :shopingList="shopingList"
                  :groupIndex="index"
                  :open="isGroupActive(sidebarItem)"
                ></vx-sidebar-group>
              </template>
            </template>
          </template>
        </VuePerfectScrollbar>
      </div>
    </vs-sidebar>
  </div>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VxSidebarGroup from './VxSidebarGroup.vue'
import VxSidebarItem from './VxSidebarItem.vue'
import { getGroupOrganization } from '@/api/home.js'
export default {
  name: 'vx-sidebar',
  props: {
    sidebarItems: {
      type: Array,
      required: true
    },
    title: {
      type: String
    },
    logo: {
      type: String
    },
    parent: {
      type: String
    },
    openGroupHover: {
      type: Boolean,
      default: false
    },
    reduceNotRebound: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    shopingList: [],
    clickNotClose: false, // disable close sidebar on outside click
    reduce: false, // determines if sidebar is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    isMouseEnter: false,
    settings: { // perfectscrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true
    },
    windowWidth: window.innerWidth, // width of windows
    showShadowBottom: false,
    activeKey: ''
  }),
  computed: {
    isSidebarActive: {
      get () {
        return this.$store.state.isSidebarActive
      },
      set () {}
    },
    reduceSidebar () {
      return Boolean(this.reduce && this.reduceButton)
    },
    reduceButton: {
      get () {
        return this.$store.state.reduceButton
      },
      set (val) {
        this.$store.commit('TOGGLE_REDUCE_BUTTON', val)
      }
    },
    sidebarItemsMin () {
      return this.$store.state.sidebarItemsMin
    },
    logoImg () {
      return this.$store.state.home.headerImg
    },
    isGroupActive () {
      return (sidebarItem) => {
        const path = this.$route.name
        let open = false
        let func = function (sidebarItem) {
          if (sidebarItem.submenu) {
            sidebarItem.submenu.forEach((item) => {
              if (path == item.url) { open = true } else if (item.submenu) { func(item) }
            })
          }
        }
        func(sidebarItem)
        return open
      }
    }
  },
  watch: {
    reduce (val) {
      if (val == true) {
        this.$store.dispatch('updateSidebarWidth', 'reduced')
      } else {
        this.$store.dispatch('updateSidebarWidth', 'default')
      }

      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 100)
    },
    reduceButton () {
      this.setSidebarWidth()
    },
    '$route' () {
      if (this.isSidebarActive && this.showCloseButton) this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
    }
  },
  methods: {
    closeOthers (key) {
      this.activeKey = key
    },
    sidebarMouseEntered () {
      if (this.reduce) this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)
      this.isMouseEnter = true
    },
    sidebarMouseLeave () {
      if (this.reduce) {
        this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', true)
      }
      this.isMouseEnter = false
    },
    toggleReduce (val) {
      this.reduceButton = val
      this.setSidebarWidth()
    },
    handleWindowResize (event) {
      this.windowWidth = event.currentTarget.innerWidth
      this.setSidebarWidth()
    },
    setSidebarWidth () {
      if (this.windowWidth < 1200) {
        if (this.windowWidth < 992) this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'md')
        else this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'lg')

        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
        if (this.reduceButton) this.reduce = false
        // this.reduceButton = false;
        this.showCloseButton = true
        this.clickNotClose = false
        this.$store.dispatch('updateSidebarWidth', 'no-sidebar')
        this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)
      } else {
        this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'xl')
        if (this.reduceButton) this.reduce = true
        else this.reduce = false

        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
        if (this.reduceButton && !this.isMouseEnter) this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', true)
        else this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)

        this.clickNotClose = true
        this.showCloseButton = false
        if (this.reduceSidebar) { this.$store.dispatch('updateSidebarWidth', 'reduced') } else { this.$store.dispatch('updateSidebarWidth', 'default') }
      }
    },
    psSectionScroll () {
      if (this.$refs.mainSidebarPs.$el.scrollTop > 0) this.showShadowBottom = true
      else this.showShadowBottom = false
    }
  },
  components: {
    VxSidebarGroup,
    VxSidebarItem,
    VuePerfectScrollbar
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
    this.setSidebarWidth()
  },
  created () {
    this.shopingList = []
    if (this.$store.state.user.role_id < 3) {
      getGroupOrganization().then(res => {
        if (res.data.code == 200) {
          let data = res.data.data
          this.$store.commit('saveOrganizationData', data)
          if (data.property.length != 0) {
            data.property.map(list => {
              if (list.property_id && list.bzid) {
                let l = {
                  text: list.name,
                  value: list.property_id,
                  img: list.map_url
                }
                this.shopingList.push(l)
              }
            })
          }
        }
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleWindowResize)
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/components/vxSidebar.scss";
</style>
<style lang="less">
  .group-header{
    font-weight: bold;
  }
</style>
