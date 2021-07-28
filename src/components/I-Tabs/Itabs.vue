<template>
  <div class="tab-box">
    <div class="tab-bar">
      <div class="tab-bar-left">
        <span v-if="!isNowTime">
          {{ $t(titleList[value]) }}
          <Tooltip
            v-if="titleList[0]=='新老顾客占比'"
            :content="tootipText"
            placement="bottom"
            theme="light"
            transfer
            max-width="600">
            <icons type="wenhao" />
          </Tooltip>
        </span>
        <template v-else>
          <span>{{date}}</span>
          <span>{{time}}</span>
        </template>
      </div>
      <div class="tab-bar-right">
        <slot name="select"></slot>
        <ul>
          <li
            v-for="(item,index) in navList"
            @click="handleClick(index,item)"
            :key="index"
            :title="iconTitle[item.icon] ? iconTitle[item.icon] : ''">
            <span class="navitemIcon">
              <icons
                :type="item.icon"
                :size="20"
                :color="currentIndex === index ? iconColor :'#9D9D9DFF'"
              >
              </icons>
            </span>
          </li>
          <slot name="export"></slot>
        </ul>
      </div>
    </div>
    <div class="tab-con"
      :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Moment from 'moment'
export default {
  name: 'tabs',
  props: {
    value: {
      type: Number,
      default: 0
    },
    iconColor: {
      type: String,
      default: '#2280D7'
    },
    isNowTime: {
      type: Boolean,
      default: false
    },
    exportXls: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tootipText: '新顾客：在所选时间段内仅来过1次的人数\n老顾客：在所选时间段内来过2次及以上的人数',
      navList: [],
      titleList: [],
      currentIndex: 0,
      iconTitle: {
        'zhexiantu': '折线图',
        '62': '柱状图',
        'biaoge-copy': '详细数据',
        'xiangxia': '查看全部实体排行',
        'ditu': '出入口客流',
        'fenxi': '饼状图',
        'chakan': '查看所有'
      },
      date: '',
      time: ''
    }
  },
  mounted () {
    if (this.isNowTime) {
      setInterval(() => {
        this.formatTime()
      }, 1000)
    }
  },
  computed: {
    contentStyle () {
      let style = {}
      style = { transform: `translateX(-${this.value}00%)` }
      return style
    }
  },
  methods: {
    getTabs () {
      return this.$children.filter(item => item.$options.name === 'TabItem')
    },
    updateNav () {
      this.navList = []
      this.titleList = []
      /**
       * 这里有一个bug,就是当用v-if toggle item 的时候，获得的组件顺序与真实dom顺序不一致，
       * 导致图标的顺序不一致
       * 原因是vue.$children，并不能保证组件的顺序
       * 暂时解决办法使用vue.$slots 获得item
       */
      // this.getTabs().forEach((tabitem, index) => {
      //   this.navList.push({
      //     label: tabitem.$attrs.label || '',
      //     icon: tabitem.$attrs.icon || '',
      //     name: tabitem.currentName || index
      //   })
      //   this.titleList.push(tabitem.$attrs.title || '')
      //   if (!tabitem.currentName) tabitem.currentName = index
      // })
      let vNodes = this.$slots.default.filter(e => { return e.data !== undefined })
      vNodes.forEach((tabitem, index) => {
        if (tabitem.data.attrs) {
          this.navList.push({
            label: tabitem.data.attrs.label || '',
            icon: tabitem.data.attrs.icon || '',
            name: index
          })
          this.titleList.push(tabitem.data.attrs.titles || '')
          this.handleClick(0)// 图标不选中的bug
        }
      })
    },
    handleClick (index, item) {
      this.currentIndex = index
      this.$emit('input', index)
      this.$emit('on-click', index, item)
    },
    formatTime () {
      let date = Moment().format('YYYY-MM-DD HH:mm:ss').split(' ')
      this.date = date[0]
      this.time = date[1]
    }
  }
}
</script>
<style lang="stylus" scoped>
.tab-box
  width 100%
  height 100%
  overflow hidden
  .tab-bar
    display flex
    padding 27px 10px 10px 19px
    flex-wrap wrap
    justify-content space-between
    position relative
    .tab-bar-left
        >span
          display inline-block
          font-size 18px
          color #3E3C3CFF
          padding-top 7px
          &:nth-child(2)
            margin-left 20px
    .tab-bar-right
      display flex
      flex-wrap wrap
      justify-content space-between
      >div
        margin-right 50px
      >ul
        padding-top 7px
        list-style none
        display flex
        >li
          list-style none
          margin 0 6px
          cursor pointer
          .active
            color blue
        .exportBtn
          &:hover
            i
              color #2280d7 !important
  .tab-con
    display flex
    >div
      flex-shrink 0
      width 100%
    .tabitem /deep/
      .ivu-table-wrapper
        border none
        .ivu-table:after
          display none
</style>
