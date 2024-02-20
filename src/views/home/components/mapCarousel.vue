<template>
  <div class="map-carousel-box box-card">
    <div v-if="id ==='company'" class="amap-box">
      <img src="@/assets/images/fixation_img/bg/map.png" alt=""/>
			<div  class="company-property"
				:key="index" v-for="(item,index) in markers"
				:style="{left:item.position[0],top:item.position[1]}"
				>
					<div class="property-list"  v-on:mouseout="showData(index,'hide')" v-on:mouseover="showData(index,'show')" v-show='item.isText'>
						<img  :src="item.img?item.img:floorImage" alt="">
						<div class="list-right">
							<p class="ellipsis-1">{{item.name}}</p>
							<p class="enter ellipsis-1" :title="$t('realTimePassengerFlow')+': '+Number(item.enter).toLocaleString()">{{$t('realTimePassengerFlow')+": "+Number(item.enter).toLocaleString()}}</p>
						</div>
					</div>
					<img class="map-icon"
						v-on:mouseover="showData(index,'show')"
						v-on:mouseout="showData(index,'hide')"
						v-on:click="handleclick(item.id)"
						src="@/assets/images/fixation_img/rest/map-icon.png" alt=""
					>
        </div>
      </div>
    <div v-if="id!=='company'" style="width:100%;height:100%;">
      <template>
        <div class="carousel" :style="{backgroundImage:`url(${mapCarousel.map_url?mapCarousel.map_url:''})`}" >
          <div
            class="positions"
            style="position:absolute"
            v-for="(pos,posindex) in mapCarousel.gate"
            :key="posindex"
            :style="{top:`${pos.position_y*100}%`,left:`${pos.position_x*100}%`}"
          >
            {{pos.name}}
            <br>
            {{$t('realTimePassengerFlow') + ":" + pos.enter ? pos.enter.toLocaleString() : 0}}
          </div>
        </div>
      </template>
      <!-- <template v-else>
        <p class="noData">{{ $t('holder.NoData') }}</p>
      </template> -->
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { homeImgGaet } from '@/api/home.js'
export default {
  name: 'mapAndCarousel',
  props: {
    markers: {
      type: Array
    },
    timingValue: {
      type: String
    },
    id: {
      type: null
    }
  },
  data () {
    return {
      showEnter: false,
      intervalId: '',
      mapCarousel: {}
    }
  },
  computed: {
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
    this.intervalClick(this.$store.state.home.intervalTime)
  },
  deactivated () {
    this.intervalId && clearInterval(this.intervalId)
  },
  methods: {

    propertImgGate () {
      homeImgGaet({property_id:this.$store.state.home.headerAction}).then(res => {
        if (res.data.code == 200) {
          this.mapCarousel = []
          let data = res.data.data.property
          if (data) {
            data.forEach(e => {
              if (e.id && e.id === this.$store.state.home.headerAction) {
                this.mapCarousel = {
                  id : e.id,
                  name : e.name,
                  map_url : e.map_url,
                  gate : e.gate
                }
              }
            })
          } else {
            this.mapCarousel = {
              map_url:require('@/assets/images/fixation_img/bg/home_floor.png'),
              gate:[],
              name:'',
            }
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
        if(this.$route.name !=='dashboardAnalytics') return false
        this.propertImgGate()
      }, time)
    },
    handleclick (name) {
      let find = _.find(this.markers, val => { return name == val.id })
      let id = find.propertyId
      this.$store.commit('headerAction', id)
      this.$emit('markClick', name)
    },
    showData (index, type) {
      if(type === 'show') {
        this.showEnter = true
        this.markers[index].isText = true
      }else {
        this.showEnter = false
        //此处为了处理当鼠标移动到图片上时，图片不消失
        setTimeout(()=>{
          if (!this.showEnter) {
            this.markers[index].isText = false
            this.showEnter = false
          }
        },100)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.carousel{
  position:relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  background-size: 100% 100%;
  min-height: 436px;
  .positions{
    background-color: #3a96e8;
    opacity: 0.9;
    -webkit-box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
    -moz-box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
    box-shadow: 0px 0px 6px 0px rgba(31,118,199,1);
    padding: 2px 5px;
    color :#fff;
  }

}
.amap-box{
  height: 100%;
  position: relative;
  >img{
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
      display: flex;
      align-items: center;
      height: 90px;
      background-color: #fff;
      border: 1px solid #fba940;
      border-radius: 4px;
      position: absolute;
      left: -130px;
      top: -93px;
      z-index: 41001;
      overflow: hidden;
      img{
        height: 100%;
      }
      .list-right{
        display: block;
        height: 100%;
        padding: 20px 10px;
        border-left: 1px solid #fba940;
        p{
          font-size: 12px;
          color: #333;
          word-break: keep-all;
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
.noData
  text-align: center
  line-height: 100%
.carousel ::v-deep
  .carouselItem
    height: 100%
    position relative
    background-repeat no-repeat
    background-size: 100% 100%!important
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
