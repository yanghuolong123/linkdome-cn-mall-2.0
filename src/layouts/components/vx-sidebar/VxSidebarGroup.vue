<!-- =========================================================================================
	File Name: VxSidebarGroup.vue
	Description: Sidebar Group Component. Extends vuesax framework's 'vs-sidebar-group' component
	Component Name: VxSidebarGroup
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    :class="[{'vs-sidebar-group-open' : openItems}, {'vs-sidebar-group-active': open}, {'disabled-item pointer-events-none': group.isDisabled}]"
    class="vs-sidebar-group"
    @mouseover="mouseover"
    @mouseout="mouseout">
    <div @click="clickGroup" class="group-header w-full">
      <span class="flex items-center w-full">
        <feather-icon
          :icon="group.icon || 'CircleIcon'"
          :svgClasses="{ 'w-3 h-3' : groupIndex % 1 != 0 }"
          v-if="group.icon || (this.groupIndex > Math.floor(this.groupIndex))"
        />
        <span v-show="!sidebarItemsMin" class="truncate mr-3" :title="$t(group.i18n) || group.name ">{{ $t(group.i18n) || group.name }}</span>
        <vs-chip
          class="ml-auto mr-4"
          :color="group.tagColor"
          v-if="group.tag && !sidebarItemsMin">
          {{ group.tag }}
        </vs-chip>
      </span>
      <feather-icon
        icon="ChevronRightIcon"
        svg-classes="w-4 h-4"
        :class="[{'rotate90' : openItems}, 'feather-grp-header-arrow']"
        v-show="!sidebarItemsMin"
      />
      <span class="vs-sidebar--tooltip">{{ $t(group.i18n) || group.name }}</span>
    </div>
    <ul ref="items" :style="styleItems" class="vs-sidebar-group-items">
      <li v-for="(groupItem, index) in group.submenu" :key="index" v-on:click='openNew(index)'>
        <vx-sidebar-group
          v-if="groupItem.submenu"
          :group="groupItem"
          :groupIndex="Number(`${groupIndex}.${index}`)"
          :open="isGroupActive(groupItem)"
          :openHover="openHover"
        />
        <vx-sidebar-item
          v-else
          :index="groupIndex + '.' + index"
          :to="routerFilter(groupItem.url)"
          :icon="itemIcon(groupIndex + '.' + index)"
          icon-small
          :target="groupItem.target">
          <span class="truncate" :title="$t(groupItem.i18n) || groupItem.name">{{ $t(groupItem.i18n) || groupItem.name }}</span>
          <vs-chip
            v-if="groupItem.tag"
            class="ml-auto"
            :color="groupItem.tagColor"
          >{{ groupItem.tag }}</vs-chip>
        </vx-sidebar-item>
      </li>
    </ul>

    <div class="selectShopping" v-if="isSelect">
      <div class="select-bg"></div>
      <div class="select-text">
        <div class="select-close"  v-on:click="selectClose">
           <Icon type="md-close" />
        </div>
        <h2 class="select-title">{{$t('chooseShoppingMall')}}</h2>
        <div>
          <p>{{$t('fn.select',[$t('shopmall')])}}</p>
          <ul>
            <li :key="index" v-for="(item,index) in shopingList">
               <vs-radio v-model="shopingModel" vs-name="shopingModel" :vs-value="item.value">{{item.text}}</vs-radio>
            </li>
          </ul>
          <div class="select-foort flex-center">
            <div class="button" @click='selectSubmint'>{{$t('save')}}</div>
            <div class="button" @click="selectClose">{{$t('cancel')}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VxSidebarItem from './VxSidebarItem.vue'
import config from '@/config/index';
export default {
  name: 'vx-sidebar-group',
  props: {
    openHover: {
      default: false,
      type: Boolean
    },
    open: {
      default: false,
      type: Boolean
    },
    group: {
      type: Object
    },
    groupIndex: {
      type: Number
    },
    shopingList: {
      type: Array,
      default: []
    }
  },
  data: () => ({
    maxHeight: '0px',
    openItems: false,
    routerUrl: '',
    urlName: '',
    isSelect: false,
    shopingModel: '',
    adminName:'',
  }),
  computed: {
    routerFilter (url) {
      return function (url) {
        if (!this.headerType) {
          return config.noPropertyPages.includes(url) ? url : ''
        } else {
          return url
        }
      }
    },
    sidebarItemsMin () {
      return this.$store.state.sidebarItemsMin
    },
    headerType () {
      return this.$store.state.home.headerAction != 0
    },
    styleItems () {
      return { maxHeight: this.maxHeight }
    },
    itemIcon () {
      return (index) => {
        if (!((index.match(/\./g) || []).length > 1)) return 'CircleIcon'
      }
    },
    isGroupActive () {
      return (sidebarItem) => {
        const path = this.$route.name
        let open = false
        let func = function (sidebarItem) {
          if (sidebarItem.submenu) {
            sidebarItem.submenu.forEach((item) => {
              if (path == item.url) {
                open = true
              } else if (item.submenu) {
                func(item)
              }
            })
          }
        }
        func(sidebarItem)
        return open
      }
    }
  },
  watch: {
    maxHeight () {
      this.openItems = this.maxHeight != '0px'
    },
    // OPEN AND CLOSES DROPDOWN MENU ON SIDEBAR COLLAPSE AND DEFAULT VIEW
    '$store.state.sidebarItemsMin' (val) {
      let scrollHeight = this.$refs.items.scrollHeight
      if (!val && this.open) {
        this.maxHeight = `${scrollHeight}px`
        setTimeout(() => {
          this.maxHeight = 'none'
        }, 300)
      } else {
        this.maxHeight = `${scrollHeight}px`
        setTimeout(() => {
          this.maxHeight = '0px'
        }, 50)
      }
      if (val && this.open) {
        this.maxHeight = `${scrollHeight}px`
        setTimeout(() => {
          this.maxHeight = '0px'
        }, 250)
      }
    },
    shopingList: {
      handler (newval) {
        if (newval && newval.length) {
          this.shopingModel = newval[0].value
        }
      },
      immediate:true
    }
  },
  methods: {
    clickGroup () {
      if (!this.openHover) {
        let thisScrollHeight = this.$refs.items.scrollHeight
        if (this.maxHeight == '0px') {
          this.maxHeight = `${thisScrollHeight}px`
          setTimeout(() => {
            this.maxHeight = 'none'
          }, 300)
        } else {
          this.maxHeight = `${thisScrollHeight}px`
          setTimeout(() => {
            this.maxHeight = `${0}px`
          }, 50)
        }
      }
    },
    mouseover () {
      if (this.openHover) {
        let scrollHeight = this.$refs.items.scrollHeight
        this.maxHeight = `${scrollHeight}px`
      }
    },
    mouseout () {
      if (this.openHover) {
        let scrollHeight = 0
        this.maxHeight = `${scrollHeight}px`
      }
    },
    openNew (index) {
      let name = this.group.submenu[index].name
      if (config.noPropertyPages.includes(name)) {
        // this.$router.push({ name: name })
        this.adminName = name
      } else {
        if (!this.headerType) {
          this.isSelect = true
          this.urlName = name
        }
      }
    },
    selectClose () {
      this.$router.push({ name: this.adminName })
      this.isSelect = false
    },
    selectSubmint () {
      console.log('----===============----');
      this.$store.commit('headerAction', this.shopingModel)
      let find = _.find(this.shopingList, ['value', this.shopingModel])
      // find = find && find.text ? find.text : ''
      this.$store.commit('headerData', find)
      this.$router.push({ name: this.urlName })
      this.isSelect = false
    }
  },
  components: {
    VxSidebarItem
  },
  mounted () {
     this.openItems = this.open
    this.maxHeight = this.open?'':'0px'
    // this.$nextTick(() => { this.clickGroup() })
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/components/vxSidebarGroup.scss";
</style>
<style lang="scss">
  .selectShopping{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right:0;
    z-index: 9999;
    .select-bg{
      width: 100%;
      height: 100%;
      background:rgba(170,170,170,1);
      opacity:0.48;
    }
    .select-close{
      width: 34px;
      text-align: center;
      height: 34px;
      line-height: 34px;
      box-shadow:0px 2px 17px 1px rgba(153,158,159,0.25);
      border-radius: 6px;
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #fff;
      cursor: pointer;
      transition: all .23s ease .1s;
      i{
        font-size: 20px;
      }
      &:hover{
        transform: translate(5px,-5px);
        box-shadow: 0 0 0 0 rgba(0,0,0,.1)
      }
    }
    .select-text{
      position: absolute;
      left: 50%;
      margin-left: -174px;
      z-index: 10;
      top: 160px;
      width: 360px;
      height: auto;
      border-radius: 6px;
      box-shadow:1px 1px 10px 0px rgba(166,168,169,0.44);
      background-color: #fff;
      .select-title{
        width: 100%;
        height: 69px;
        line-height: 69px;
        background-color: rgba(238,238,238,1);
        color: #3E3E3E;
        font-size: 20px;
        font-weight: bold;
        padding-left: 35px;
      }
      div{
        padding-bottom: 20px;
        p{
          color: #3E3E3E;
          font-size: 16px;
          padding-left: 40px;
          text-align: left;
          margin: 20px 0;
        }
        ul{
          width: auto;
          padding:0 40px;
          li{
            margin-bottom: 10px;
            width: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            height: 22.5px;
            .vs-radio--label{
              margin-left: 20px;
              font-size: 12px;
              color: #222222;
            }
           .vs-radio--circle{
             box-shadow: none;
            }
          }
        }
      }
      .select-foort{
        text-align: center;
        margin-top: 10px;
        padding-bottom: 10px;
        justify-content: center;
        .button{
          width: 76px;
          height:30px;
          line-height:30px;
          font-size: 12px;
          color: #fff;
          border-radius:6px;
          cursor: pointer;
          &:nth-child(1){
            background-color: #37b5ed;
            margin-right: 15px;
          }
          &:nth-child(2){
            background-color: #959595;
          }
        }
      }

    }
  }
</style>
