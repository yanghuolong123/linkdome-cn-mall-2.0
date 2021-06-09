<template>
  <div class="map-carousel-box box-card">
    <!-- <el-amap
      v-if="id ==='company'"
      class="amap-box"
      vid="map"
      :center="center"
      :zooms="zooms"
      ref="map"
      key="mymap"
    >
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :events="marker.events"
        :icon="marker.icon"
        :position="marker.position"
      ></el-amap-marker>
      <el-amap-info-window
        v-if="window"
        :position="window.position"
        :visible="window.visible"
        :offset="window.offset"
      >
        <div class="mapslot" v-on:click="handleclick(window.zoneId)">
          <p>{{window.name}}</p>
          <p>
            <span></span>
            <template v-if="window.isexist">
              实时客流:{{window.passengerFlow.number}}
              <br>
              {{window.passengerFlow.timeRange}}
            </template>
            <template v-else>暂无数据</template>
          </p>
        </div>
      </el-amap-info-window>
    </el-amap> -->
    <div v-if="id ==='company'" class="amap-box">
      <img src="@/assets/images/fixation_img/bg/map.webp" alt="">
        <div  class="company-property"
      :key="index" v-for="(item,index) in markers"
      :style="{left:item.position[0],top:item.position[1]}"
      >
        <div class="property-list"  v-if='item.isText'>
          <img  :src="item.img?item.img:floorImage" alt="">
          <div class="list-right">
            <p>{{item.name}}</p>
            <p class="enter">实时客流: {{Number(item.enter).toLocaleString()}}</p>
          </div>
        </div>

        <img class="map-icon"
          v-on:mouseover="showData(index,'show')"
          v-on:mouseout="showData(index,'hide')"
          v-on:click="handleclick(item.id)"
          src="@/assets/images/fixation_img/rest/map-icon.webp" alt=""
        >
        </div>
    </div>
    <div v-if="id!=='company'" style="width:100%;height:100%">
      <template v-if=" mapCarousel && mapCarousel.length > 0 ">
        <div v-for="(item,index) in mapCarousel" :key="index" class="carousel">
          <img :src="item.map_url ? item.map_url :floorImage" alt="">
            <div
              class="positions"
              style="position:absolute"
              v-for="(pos,posindex) in item.gate"
              :key="posindex"
              :style="{top:`${pos.position_y*100}%`,left:`${pos.position_x*100}%`}"
            >
              {{pos.name}}
              <br>
              实时客流:{{pos.enter ? pos.enter.toLocaleString() : 0}}
            </div>
        </div>
        <!-- <Carousel v-model="value1" class="carousel" radius-dot ref="careousel" :height="548">
          <CarouselItem v-for="(item,index) in mapCarousel" :key="index">
            <template>
              <div
                class="carouselItem"
                :style="{background:`url(${item.map_url ? item.map_url :floorImage})`}"
              >
                <div
                  class="positions"
                  style="position:absolute"
                  v-for="(pos,posindex) in item.gate"
                  :key="posindex"
                  :style="{top:`${pos.position_y*100}%`,left:`${pos.position_x*100}%`}"
                >
                  {{pos.name}}
                  <br>
                  实时客流:{{pos.enter ? pos.enter.toLocaleString() : 0}}
                </div>
              </div>
            </template>
          </CarouselItem>
        </Carousel> -->
      </template>
      <template v-else>
        <p class="noData">暂无数据</p>
      </template>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { homeImgGaet } from '@/api/home.js'
import { mapMutations } from 'vuex'
export default {
  name: 'mapAndCarousel',
  props: {
    shopData: {
      type: Object
    },
    gateData: {
      type: Object
    },
    markers: {
      type: Array
    },
    center: {
      type: Array
    },
    zooms: {
      type: Array
    },
    timingValue: {
      type: String
    },

    window: {
      type: null
    },
    id: {
      type: null
    }
  },
  data () {
    return {
      mapIcon: 'circle',
      current: 0,
      value1: 0,
      floorImage: require('@/assets/images/user_data_img/home_floor.webp'),
      showEnter: false,
      intervalId: '',
      mapCarousel: []
    }
  },
  computed: {
    iconColor () {
      return this.id === 'company' ? '#fff' : '#ffb22b'
    }
  },
  watch: {
    '$store.state.reduceButton' () { // iviev carouse 不能监听元素尺寸变化，所以需要在左侧菜单缩小的时候，手动触发 resize 事件
      setTimeout(() => {
        this.$refs.careousel.handleResize()// 等待动画执行完毕
      }, 500)
    },
    '$store.state.home.headerAction' () {
      this.propertImgGate()
    },
    timingValue () {
      this.intervalClick(this.timingValue)
    }
  },
  mounted () {
    this.propertImgGate()
  },
  activated () {
    this.intervalClick('5分钟')
  },
  deactivated () {
    this.intervalId && clearInterval(this.intervalId)
  },
  methods: {
    ...mapMutations([
      'savePropertMap'
    ]),
    propertImgGate () {
      homeImgGaet().then(res => {
        if (res.data.code == 200) {
          this.mapCarousel = []
          let data = res.data.data.property
          if (data) {
            data.forEach(e => {
              if (e.id && e.id === this.$store.state.home.headerAction) {
                let obj = {}
                obj.id = e.id
                obj.name = e.name
                obj.map_url = e.map_url
                obj.gate = e.gate
                this.mapCarousel.push(obj)
              }
            })
          } else {
            let obj = {}
            obj.map_url = ''
            this.mapCarousel.push(obj)
          }
        }
      })
    },
    intervalClick (val) {
      clearInterval(this.intervalId)
      let time
      if (val == '30秒') {
        time = 1000 * 30
      } else if (val == '5分钟') {
        time = 1000 * 60 * 5
      } else if (val == '10分钟') {
        time = 1000 * 60 * 10
      } else if (val == '20分钟') {
        time = 1000 * 60 * 20
      } else if (val == '30分钟') {
        time = 1000 * 60 * 30
      }
      this.intervalId = setInterval(() => {
        this.propertImgGate()
      }, time)
    },
    handleclick (name) {
      let find = _.find(this.markers, val => { return name == val.id })
      let id = find.propertyId
      this.$store.commit('headerAction', id)
      this.$emit('markClick', name)
      try {
        window.TDAPP.onEvent('集团页面', '地图标记点', { '购物中心名称': find.name })
      } catch (error) {
        console.log(eventName + '集团页面-地图标记点-埋点error:' + error)
      }
    },
    showData (index, type) {
      if (type == 'show') {
        this.markers[index].isText = true
        this.showEnter = true
      } else {
        this.markers[index].isText = false
        this.showEnter = false
      }
    }
  }
}
</script>
<style lang="less" scope="scoped">
 .carousel{
    position: relative;
    height: 100%;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
    .positions{
      background-color: #3a96e8;
      opacity :0.9;
      -webkit-box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
      -moz-box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
      box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
      padding: 2px 5px;
      color: #fff;
    }
  }
.amap-box{
  height: 100%;
  position: relative;
  img{
    display: block;
    width: 100%;
    height: 100%;
  }
  .company-property{
    display: inline-block;
    position: absolute;
    .map-icon{
      width: 20px;
      height: auto;
      cursor: pointer;
    }
    .map-icon-second{
       position: absolute;
       left:10px;
       top:-541px;
     }
    .property-list{
      display: block;
      width: 280px;
      height: 90px;
      background-color: #fff;
      border: 1px solid #fba940;
      border-radius: 4px;
      position: absolute;
      left: -130px;
      top: -93px;
      z-index: 41001;
      img{
        display: block;
        width: 50%;
        height: 100%;
        float: left;
      }
      .list-right{
        display: block;
        width: 50%;
        height: 100%;
        padding: 25px 20px;
        float: left;
        border-left: 1px solid #fba940;
        p{
          font-size: 12px;
          color: #333;
        }
        .enter{
          margin-top: 5px;
          color: #222;
        }
      }
    }
  }

  .map-position{
    position: absolute;
    top:20px;
    left:25px;
    width: 280px;
    border-radius: 25px;
    box-shadow: 0px 2px 9px 1px rgba(175, 175, 176, 0.25);
    background-color: #fff;
    padding:15px 20px;
    p{
      span:nth-child(2){
        font-weight: 700;
        font-size: 12px;
        margin:0 15px;
      }
      span:nth-child(3){
        font-size:14px;
        font-weight: 700;
      }
    }
  }
}
</style>
<style lang="stylus" scoped>
.map-carousel-box
  height 100%
  border-radius 6px
  padding 6px
.noData
  text-align: center
  line-height: 100%
.carousel /deep/
  .carouselItem
    height: 100%
    position relative
    background-repeat no-repeat
    background-size: 100% 100%!important
    border-radius 6px
    .positions
      background-color #3a96e8
      opacity 0.9
      -webkit-box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
      -moz-box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
      box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
      padding 2px 5px
      color #fff
  .ivu-carousel-arrow
    border-radius 0px
    height 69px
    width 41px
    &.left
      left:0
    &.right
      right 0
    >i
      font-size 30px
  .ivu-carousel-arrow-hover
    display none
</style>
