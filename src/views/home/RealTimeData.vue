<template>
  <div class="mapbox">
    <div class="info-seting-zone">
      <p class="time-box">
        <span class="text-xl text-black font-medium">
          今日实时数据
          <Tooltip :content="tootipText" placement="right" theme="light" transfer max-width="500">
            <icons type="wenhao"/>
          </Tooltip>
        </span>
        <span class="font-number hidden md:inline">{{date}}</span>
        <span class="font-number hidden md:inline">{{time}}</span>
      </p>
      <p class="text-right user-seting">
        <a href @click.prevent="handleRefresh">
          <icons type="shuaxin" :size="24"></icons>
        </a>
        <vs-dropdown class="hidden md:inline ml-8">
          <span class="text-sm setingtext">{{$store.state.home.intervalTime}}刷新一次</span>
          <icons type="arrow_down" color="#626262" class="mx-4"></icons>
          <vs-dropdown-menu>
            <vs-dropdown-item
              class="my-dropdown-item"
              v-for="item in interVal"
              :key="item"
              :name="item"
              @click="clickInterVal(item)"
            >{{item}}</vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </p>
    </div>
    <div class="data-zone">
      <div class="mapCarousel">
        <slot name="map"></slot>
      </div>
      <div>
        <slot name="dashboard"></slot>
      </div>
      <div class="kpi-card-box">
        <slot name="cards"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import Moment from 'moment'
export default {
  name: 'realTimeData',
  data () {
    return {
      interVal: ['30秒', '5分钟', '10分钟', '20分钟', '30分钟'],
      date: '',
      time: ''
    }
  },
  computed: {
    tootipText () {
      return this.$store.state.home.headerAction === 0 ? '平均客流量：所有购物中心实时累计客流之和除以购物中心个数\n客流峰值：所有购物中心当中客流峰值的最大值\n集客量峰值：所有购物中心当中集客量峰值的最大值\n今日集客量：所有购物中心集客量之和' : '今日平均客流量：累计客流量除以营业小时数\n今日客流峰值：从开始营业时间到目前时刻客流最大值\n今日集客量峰值：从开始营业时间到目前时刻购物中心中驻留人数的最大值和时间点\n今日集客量：从开始营业时间到目前时刻的进入总客流与离开总客流之差'
    }
  },
  mounted () {
    setInterval(() => {
      this.formatTime()
    }, 1000)
  },
  methods: {
    clickInterVal (val) {
      this.$store.commit('saveIntervalTime', val)
      this.$emit('interValChange', val)
    },
    formatTime () {
      let date = Moment().format('YYYY-MM-DD HH:mm:ss').split(' ')
      this.date = date[0]
      this.time = date[1]
    },
    handleRefresh () {
      this.$emit('refresh')
    }
  }
}
</script>
<style lang="stylus">
.my-dropdown-item
  >a
    white-space nowrap
</style>
<style lang="stylus" scoped>
.info-seting-zone
  display grid
  grid-template-columns 1.2fr 1fr
  padding 0 8px;
  .user-seting
    color #666E75
    margin-bottom 24px;
    >a
      display inline-block
      vertical-align middle
      &:hover
       >i
        color #33B3ED!important
    >button
      font-family: "source_han_sans_cn", "Roboto", sans-serif !important;
  .time-box
      font-weight normal
      line-height 36px
      display grid
      grid-template-columns repeat(auto-fit,minmax(100px,max-content))
      grid-gap 1.5rem
      font-size 1.15rem
      >span
        color:rgba(35,69,95,1);
.data-zone
  display grid
  grid-template-columns 1fr 1.1fr
  grid-template-rows auto auto
  grid-column-gap 29px
  // @media (max-width 1200px) {
  //   grid-template-columns  1fr
  //   grid-template-rows 400px auto auto
  // }
  .mapCarousel
    grid-row 1/3
    padding-left 1px
  >div
    // overflow hidden
    padding  0;
</style>
