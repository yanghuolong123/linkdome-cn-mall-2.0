<template>
  <div class="pathTrend" >
    <div class="noData" v-if="floorList.length<=0">
      <p>暂无数据</p>
    </div>
    <div class="floorImg"  v-else>
      <div class="pathContent" id="pathContent" >
        <div v-if="showPath" class="drainageDiv" :style="{width:imgWidth+'px',height:imgWidth/scale+'px'}">

          <div class="titles" @click="dataList(item.id)" v-for="(item,index) in svgLists" :key="'x1-'+index" :title="item.name"
            :style="{left:item.x1+'px',top:item.y1+'px'}">
            </div>
          <div class="titles" @click="dataList(svgLists[index+1].id)" v-for="(item,index) in svgLists" :key="'x2-'+index" :title="item.name2"
            :style="{left:item.x2+'px',top:item.y2+'px'}"></div>
        </div>
        <div v-if="showPath" class="svgs" v-for="(item,index) in svgLists" :key=index
          :style="{width:imgWidth+'px',height:imgWidth/scale*svgHeight+'px'}">
          <svg :width='imgWidth' :height='Number(imgWidth/scale*svgHeight)' version="1.1">
            <defs>
              <filter id="f1" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceGraphic" dx="10" dy="10" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
              </filter>
            </defs>
            <path fill="transparent" :stroke-dasharray="item.dasharray" filter="url(#f1)" :stroke-linecap="item.lineCap"
              :stroke="item.color" :stroke-width="item.width"  :d="item.d"></path>
            <g stroke="#389ECF" stroke-width="3" fill="#389ECF">
              <circle :cx="item.x1+10" :cy="item.y1+10" r="3" />
              <circle :cx="item.x2+10" :cy="item.y2+10" r="3" />
            </g>
            <!-- <path fill="transparent" :stroke="item.color"  :stroke-width="item.width" :d="item.d"></path> -->
          </svg>
          <svg  width="16" height="16" class="ball" :style="{transform:item.transform,offsetPath:item.path,animation:item.animation}"  viewBox="0 0 1024 1024" version="1.5">
              <path d="M 521.813 874.862 s 85.7783 -0.571021 85.77 -45.2698 L 607.456 199.988 c 0 -46.4123 -100.506 -53.0938 -100.506 -53.0938 s 136.923 -5.54963 151.473 45.633 c 14.7673 51.9001 67.1772 107.457 112.135 155.205 c 97.1147 103.133 228.052 159.266 228.052 159.266 s -116.378 70.1674 -215.041 159.309 a 618.749 618.749 0 0 0 -129.944 170.21 c -23.8016 47.6745 -131.81 38.3431 -131.81 38.3431 Z" fill="#2bd9cf" p-id="3058"></path>
              <path d="M 611.191 377.294 l 110.296 134.806 l -107.844 122.55 l -590.693 -120.099 Z" fill="#2bd9cf" p-id="3059"></path>
          </svg>
        </div>
        <div v-show="item.isShow" style="float:left"  v-for="(item,index) in floorLists" :key="'floorList-'+index"
          :style="{width:imgWidth+'px',height:imgWidth/scale+'px'}">
          <img :src="item.map_url" v-show="item.isOnload" style="width:100%;height:100%;">
        </div>
      </div>
    </div>

    <div v-if="showDrainage"  class="path-drainage">
      <div class="drainage-edit-bg"></div>
      <div class="drainage">
          <!-- 引流图片 -->
          <div class="alert-close" v-on:click="closeDrainage">
            <Icon type="md-close" />
          </div>
          <drainage-map :dataList='drainageMapList' :centerData='centerDataList' :presentData='presentData'
          :mapHeight="mapHeight" :mapMargin="mapMargin"  :margin="margin"
          ></drainage-map>
      </div>
    </div>

    <alert v-if="isAlert" @closeAlert='closeAlert' @alertConfirm='closeAlert' :alertText='alertText'></alert>
  </div>
</template>
<script>
import drainageMap from '@/components/drainage/drainageMap'
import pathTab from './components/components/PathTab.vue'
import { formatNode } from '@/libs/drawline.js'
import Ranking from '@/views/operation/components/RankingAnalytics.vue'
import { PathMovingData, drainageData } from '@/api/analysis'
import alert from '@/components/alert.vue'

import { formatEntityData } from '@/libs/util.js'

import moment from 'moment'
import NP from 'number-precision'
import _ from 'lodash'
export default {
  name: 'goShop',
  components: {
    Ranking,
    pathTab,
    alert,
    drainageMap
  },
  data () {
    return {
      showDrainage: false,
      showFloor: true,
      showPath: false,
      selectDate: '',
      startValue: [],
      endValue: [],
      startList: [],
      endList: [],
      selectPath: -1,
      pathList: [{ 'value': -1, 'label': '全部路径' }],
      allMoveData: [],
      floorList: [],
      partFloorList: [],
      scale: '',
      imgWidth: '',
      svgList: [],
      floorAllClass: ' floorAllClass',
      currentPropertyId: '',
      isAlert: false,
      svgHeight: 0,
      title1: '游逛深度（个）',
      title2: '平均停留时间',
      number1: '  ',
      number2: '  ',
      isParking: true,
      right: '18%',
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      tree: [],
      floor_id: '',
      colors: ['#ec1313', '#e8585a', '#feb33d', '#86ef40', '#2bd9cf', '#33b3ed', '#7367f0', '#6343eb', '#ababab', '#000'],
      imageOnload: 0,
      drainageMapList: {},
      centerDataList: [],
      presentData: {},
      mapHeight: '650px',
      mapMargin: '20px auto 0 auto',
      margin: '12px 0px 0px -36px'
    }
  },
  watch: {
    '$store.state.home.headerAction' () {
      this.currentPropertyId = this.$store.state.home.headerAction
      this.tree = _.find(_.cloneDeep(this.$store.state.home.bussinessTree), ['property_id', this.currentPropertyId])
      this.reset()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'PathTrend') {
        this.init()
      }
    },
    imageOnload (newValue, OldValue) {
      this.dealWithSearchData(this.allMoveData, -1)
      if (newValue == this.floorList.length) {
      }
    }
  },
  computed: {
    floorLists () {
      let count = 0
      this.floorList.forEach(m => {
        if (m.isShow) {
          count++
        }
      })
      this.svgHeight = count
      return this.floorList
    },
    svgLists () {
      let count = 0
      this.floorList.forEach(m => {
        if (m.isShow) {
          count++
        }
      })
      this.svgHeight = count
      return this.svgList
    }
  },
  created () {
    this.currentPropertyId = this.$store.state.home.headerAction
    // this.searchData()
  },
  mounted () {
    this.init()

    // window.onresize = () => {
    //   console.log(111)

    //   return () => {
    //     let content = document.getElementsByClassName('pathContent')[0]
    //     if (content) {
    //       that.imgWidth = (content.clientWidth) - 20
    //       that.dealWithSearchData(that.allMoveData, -1)
    //     }
    //   }
    // }
  },
  methods: {
    init () {
      var that = this
      // 初始化处理选择框和楼层
      let storeList = []
      let trees = _.find((this.$store.state.home.bussinessTree), ['property_id', this.currentPropertyId])
      trees = formatEntityData([trees], this.$store.state.user.role_id, this.$store.state.user.checklist)
      var tree = _.cloneDeep(trees)
      tree[0].children = []
      trees[0].children.forEach(function (m, index) {
        if (m.children) {
          tree[0].children.push(m)
        }
      })
      this.tree = tree[0]
      let floorList = this.tree.children.map(m => {
        m.className = ''
        m.floorIndezName = Number(m.zone_index) > 0 ? 'F' + m.zone_index : 'B' + Number(m.zone_index) * -1
        return m
      })
      // 楼层排序
      floorList = _.orderBy(floorList, ['zone_index'], 'desc')
      this.imageOnload = 0
      let isOnloadFirst = 0
      floorList.forEach((m, index) => {
        if (m.gate) {
          m.gate.forEach((k, indexs) => {
            storeList.push(that.formatStoreOption(k, m))
          })
        }
        if (m.children) {
          m.children.forEach((k, indexs) => {
            storeList.push(that.formatStoreOption(k, m))
          })
        }
        // 图片加载
        var images = new Image()
        images.src = m.map_url
        m.isShow = true
        m.isOnload = false
        images.onload = function () {
          that.imageOnload++
          if (isOnloadFirst == 0) {
            that.scale = images.width / images.height
            that.imgWidth = (document.getElementById('pathContent').clientWidth) - 40
          }
          isOnloadFirst++
          m.isShow = true
          m.isOnload = true
          console.log('楼层' + m.name + '加载成功')
        }
        images.onerror = function () {
          that.imageOnload++
          console.log('楼层' + m.name + '加载失败')
          m.isShow = false
        }
        images.onerror = function () {
          that.imageOnload++
          console.log('楼层' + m.name + '加载报错')
          m.isShow = false
        }
      })
      this.floorList = floorList
      // this.allZoneList()
    },
    // 格式化级联数据
    formatCascadeAuthData (data) {
      this.startList = _.compact(formatEntityData(data, this.$store.state.user.role_id, this.$store.state.user.checklist))
      this.startList = this.startList[0] && this.startList[0].children
      // 去掉没有商铺的楼层
      for (let i = 0; i < this.startList.length; i++) {
        if (!this.startList[i].children || !this.startList[i].children.length) {
          this.startList.splice(i, 1)
          i--
        }
      }
      this.endList = _.cloneDeep(this.startList)
    },
    /*
    *@method 格式化商铺Option
    *@param {obj} k 商铺或者出入口
    *@param {obj} m 楼层
    */
    formatStoreOption (k, m) {
      let obj = {}
      obj.id = k.id
      obj.value = k.id
      obj.name = k.name
      obj.label = k.name
      obj.text = k.name
      obj.zone_index = m.zone_index
      obj.action = false
      return obj
    },
    async search (date) {
      this.selectDate = date
      await this.searchData(date)
      this.dealWithSearchData(this.allMoveData, -1)
    },
    /* 查询 */
    async searchData (date) {
      var that = this
      let [time, property_id, start, end, floor_id] = [date, this.currentPropertyId, '', '', '']
      await PathMovingData({ time, property_id, start, end, floor_id }).then(res => {
        if (res.data.code == 200) {
          that.allMoveData = _.cloneDeep(res.data.data)
        }
      })
    },
    /*
    *@method 处理查询后的数据
    *@param {arr} nodes 查询后的点的原始数据
    *@param {arr} pathIndex 路径数的索引 -1为全部路径
    */
    dealWithSearchData (nodes, pathIndex) {
      var that = this
      that.dealWithNode(nodes)
      var positions = []
      var svgList = []
      let pathList = [{ 'value': -1, 'label': '全部路径' }]
      nodes.forEach(function (m, index) {
        let clickNodes = []
        let position = []
        if (index < 10) {
          let tempPath = {}
          tempPath.value = index
          tempPath.label = '第' + (index + 1) + '条'
          pathList.push(tempPath)
        }
        // 如果选择路径
        if (pathIndex == -1 || pathIndex == index) {
          m.forEach(function (e, indexe) {
            var filterNodes = 1
            var obj = {}
            obj.x = Math.floor(e.x * that.imgWidth)
            var theFloorIndex
            if (!that.showFloor) {
              theFloorIndex = _.findIndex(that.partFloorList, ['zone_index', e.zone_index])
            } else {
              let floorList = []
              that.floorList.forEach(m => {
                if (m.isShow) {
                  floorList.push(m)
                }
              })
              theFloorIndex = _.findIndex(floorList, ['zone_index', e.zone_index])
            }
            obj.y = Math.floor((e.y + theFloorIndex) * that.imgWidth / that.scale)
            obj.enter = m.enter
            obj.name = e.name
            obj.id = e.id
            obj.zone_index = e.zone_index
            if (!e.x && !e.y) {
              filterNodes = 0
            }
            if (indexe == 0 || indexe == 1) {
              clickNodes.push(obj)
            } else {
              clickNodes.shift()
              clickNodes.push(obj)
            }
            if (indexe > 0 && filterNodes > 0) {
              let tempNode = _.cloneDeep(clickNodes)
              let controlNode = formatNode(clickNodes[0].x, clickNodes[0].y, clickNodes[1].x, clickNodes[1].y, 100)// 获取控制点
              tempNode.splice(1, 0, controlNode)
              if (controlNode.x < 0 || controlNode.y < 0) {
                return false
              }
              position.push(tempNode)
            }
          })
          positions.push(position)
        }
      })
      // 处理后的点的数组
      positions.forEach(function (k, indexk) {
        k.forEach(function (m, index) {
          let obj = {}
          obj.width = 2
          obj.id = m[0].id
          obj.name = m[0].name
          obj.name2 = m[2].name
          obj.color = that.colors[indexk]
          obj.x1 = m[0].x - 10
          obj.y1 = m[0].y - 10
          obj.x2 = m[2].x - 10
          obj.y2 = m[2].y - 10
          obj.dasharray = m[0].zone_index == m[2].zone_index ? '' : '5,5'
          obj.lineCap = m[0].zone_index == m[2].zone_index ? 'round' : ''
          obj.d = 'M' + m[0].x + ' ' + m[0].y + 'Q ' + m[1].x + ' ' + m[1].y + ',' + m[2].x + ' ' + m[2].y
          obj.path = "path('" + 'M' + m[0].x + ' ' + m[0].y + 'Q ' + m[1].x + ' ' + m[1].y + ',' + m[2].x + ' ' + m[2].y + "')"
          obj.animation = 'red-ball ' + (0 + 3) * 2 + 's linear  infinite'
          if ((m[0].x > m[2].x && m[0].y > m[2].y) || m[0].x > m[2].x && m[0].y < m[2].y) {
            obj.transform = 'rotateX(180deg)'
          } else {
            obj.transform = 'rotateX(0deg)'
          }
          svgList.push(obj)
        })
      })
      that.pathList = pathList
      that.svgList = svgList
      that.showPath = true
    },
    /*
    *@method 处理坐标点
    *@param {Array} nodes 坐标点集合
    */
    dealWithNode (nodes) {
      let allNodeList = []
      nodes.forEach((k, index) => {
        let topNode = []
        if (k.length > 1) {
          k.forEach((m, index) => {
            let temp = []
            m.x = m.position_x
            m.y = m.position_y
            if (index == 0) {
              temp.push(m)
            } else if (index == 1) {
              temp.push(m)
              topNode.push(temp)
            } else {
              temp.shift()
              temp.push(m)
              topNode.push(temp)
            }
          })
          allNodeList.push(topNode)
        }
      })
      return allNodeList
    },
    /*
    *@method 弹出框
    *@param {obj} text 弹出框文字
    */
    alert (text) {
      this.isAlert = true
      this.alertText.bg = '#00A0E9'
      this.alertText.title = '路径动向分析'
      this.alertText.text = text
      this.alertText.confirm = false
    },
    /* 关闭提示框 */
    closeAlert () {
      this.isAlert = false
    },
    /*
    *@method 切换路径
    *@param {int} indexs 全部路径为-1
    */
    changePath (value) {
      if (value == -1) {
        this.floorList.forEach(m => { m.isShow = true })
      } else {
        let thePath = this.allMoveData[value]
        thePath = thePath.map(function (m) {
          return m.zone_index
        })
        thePath = _.uniq(thePath)
        this.floorList.forEach(m => {
          m.isShow = thePath.indexOf(m.zone_index) > -1
        })
      }
      this.dealWithSearchData(this.allMoveData, value)
    },
    /*
    *@method 切换楼层
    *@param {int} indexs 楼层index,总览为all
    */
    async changeFloor (indexs) {
      var that = this
      that.showPath = false
      setTimeout(async function () {
        that.floorList.forEach((m, index) => {
          if (indexs == 'all') {
            m.className = ' '
            m.isShow = true
            that.floorAllClass = ' floorAllClass'
            that.floor_id = ''
          } else {
            that.floorAllClass = ' '
            that.floor_id = that.floorList[indexs].id
            if (indexs == index) {
              m.className = ' selectFloor'
              m.isShow = true
            } else {
              m.className = ' '
              m.isShow = false
            }
          }
        })
        that.$nextTick(async () => {
          that.getFloorData()
          if (document.getElementsByClassName('pathContent')[0]) {
            that.imgWidth = (document.getElementsByClassName('pathContent')[0].clientWidth) - 20
            await that.searchData()
            that.dealWithSearchData(that.allMoveData, -1)
          }
        })
      }, 300)
    },

    /* 关闭引流图 */
    closeDrainage () {
      this.showDrainage = false
    },
    /*
    *@method 引流图查询数据
    *@param {int} id 商铺的bzid
    */
    dataList (id) {
      var that = this
      let time = moment(this.selectDate).format('YYYY-MM-DD') + ',' + moment(this.selectDate).format('YYYY-MM-DD')
      drainageData({ time: time, bzid: id }).then(res => {
        let data = res.data.data
        that.allData = data
        that.presentData.name = data.entity.name
        that.presentData.img = data.entity.icon
        that.graphList(data)
        that.centerList(data)
        that.showDrainage = true
      })
    },
    /*
    *@method  处理引流数据
    *@param {obj} data 查询的总数据
    */
    graphList (data) {
      let listObj = {}
      listObj.direct = [] // 直接引入
      listObj.radiation = [] // 间接引入
      listObj.indirect = [] // 辐射店铺占比
      listObj.departure = [] // 离场客流占比
      //  直接引入列表
      data.inGate.gates.map(function (e, index) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        if (listObj.direct.length < 5) listObj.direct.push(obj)
      })
      // 间接引入 列表
      data.inStore.stores.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        if (listObj.radiation.length < 5) listObj.radiation.push(obj)
      })
      // 辐射店铺 列表
      data.outStore.stores.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        if (listObj.indirect.length < 5) listObj.indirect.push(obj)
      })
      //  离场客流 列表
      data.outGate.gates.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        if (listObj.departure.length < 5) listObj.departure.push(obj)
      })
      this.drainageMapList = listObj
    },
    /*
    *@method  处理中心数据
    *@param {obj} data 查询的总数据
    */
    centerList (data) {
      this.centerDataList = []
      let arr = []
      // 直接引入占比
      var direct = {}
      direct.value = NP.times(data.inGate.rate.ratio, 100)
      var size = Number(data.inGate.rate.crCompare)
      if (size > 0 || size == 0) direct.action = false
      else direct.action = true
      direct.text = '出入口引入占比'
      direct.link = NP.times(data.inGate.rate.crCompare, 100)
      arr.push(direct)
      // 辐射店铺占比
      var indirect = {}
      indirect.value = NP.times(data.outStore.rate.ratio, 100)
      var sizeI = Number(data.outStore.rate.crCompare)
      if (sizeI > 0 || sizeI == 0) indirect.action = false
      else indirect.action = true
      indirect.text = '辐射店铺占比'
      indirect.link = NP.times(data.outStore.rate.crCompare, 100)
      arr.push(indirect)

      // 间接引入占比
      var radiation = {}
      radiation.value = NP.times(data.inStore.rate.ratio, 100)
      var sizeR = Number(data.inStore.rate.crCompare)
      if (sizeR > 0 || sizeR == 0) radiation.action = false
      else radiation.action = true
      radiation.text = '店铺引入占比'
      radiation.link = NP.times(data.inStore.rate.crCompare, 100)
      arr.push(radiation)

      // 离场客流占比
      var departure = {}
      departure.value = NP.times(data.outGate.rate.ratio, 100)
      var sizeD = Number(data.outGate.rate.crCompare)
      if (sizeD > 0 || sizeD == 0) departure.action = false
      else departure.action = true
      departure.text = '离场客流占比'
      departure.link = NP.times(data.outGate.rate.crCompare, 100)
      arr.push(departure)
      this.centerDataList = arr
    }
  }
}

</script>
<style lang="less">
.pathTrend{
  width: 100%;
  .path-picker{
    margin-bottom: 20px;
    overflow: hidden;
    background-color: #fff;
    padding: 18px 30px;
    box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
    border-radius: 6px;
    .path-date{
        margin-bottom: 20px;
        overflow: hidden;
        .con-select{
          clear: none;
        }
        .selectExample{
          float: left;
          width: 212px;
          margin-left: 30px;
        }
        .vs-select--input{
          height: 50px;
        }
        .ivu-input{
          width: 230px;
          height:43px;
          font-size: 16px;
          border: 1px solid rgba(0,0,0,.2);
          font-family: "source_han_sans_cn", "Roboto", sans-serif;
        }
        .ivu-input-suffix {
          i{
          height: 43px;
          width: 40px;
          line-height: 43px;
          }
        }
        .ivu-date-picker .ivu-select-dropdown{
          z-index:90000
        }
      }
    .path-select{
      display: inline-block;
      float: left;
      margin-left:30px;
      &:nth-child(2){
        margin-left: 0;
      }
      .con-select{
        width: 212px!important;
        margin-left:0px;
      }
      .vs-select--input{
        height: 50px;
      }
    }
    .path-submit{
      display: inline-block;
      padding: .75rem 2rem;
      border-radius: 6px;
      background: #37b5ed !important;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      margin-left: 30px;
      margin-top: 4px;
      &:hover{
      box-shadow: 0 8px 25px -8px #00a0e9;
      }
    }
    .path-reset{
      background: #fff !important;
      color: #37b5ed;
      border: 1px solid #37b5ed;
    }
  }
  .path-title{
    position: relative;
    width: 100%;
    background-color: #fff;
    border-radius: 6px;
    height: 60px;
    padding: 0px 19px;
    margin-bottom: 20px;
    p{
      font-size: 18px;
      line-height: 60px;
    }
    .path-select{
      width: 200px;
      position: absolute;
      right: 19px;
      top: 15px;
    }
  }
  .noData{
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    p{
      height: 368px;
      line-height: 368px;
      font-size: 32px;
    }
      background-color: #fff;
  }
  .pathContent{
    width: 75%;
    position: relative;
    margin-top: 80px;
    overflow: hidden;
    padding: 20px;
    box-sizing: content-box;
    img{
      display: block;
    }
    .svgs{
      position: absolute;
      z-index: 9999;
      .ball {
        width: 20px;
        height: 20px;
        position:absolute;
        left: 0px;
        // background-color: red;
        border-radius: 50%;
        // offset-path: path('M92 131 Q 279 48,393 159');
        offset-distance: 0%;
        animation: red-ball 3s linear  infinite;
      }
      @keyframes red-ball {
        from {
          offset-distance: 0%;
        }
        to {
          offset-distance: 100%;
        }
      }
    }
    .floors{
      position: fixed;
      z-index: 30301;
      border-radius:4px;
      width: 60px;
      box-shadow:0px 1px 25px 2px rgba(134,133,135,0.43);
      p{
        background:rgba(255,255,255,1);
        color:#939599;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        height: 40px;
        line-height: 40px;
      }
      p:nth-child(1){
        border-radius: 4px 4px 0px 0px;
      }
      p:nth-last-child(2){
        border-radius: 0px 0px 4px 4px;
      }
      p:nth-last-child(1){
        border-radius:4px;
      }
      p:hover{
        color: #4EBCEE;
      }
      .floorAll{
        font-size: 16px;
        color:#8E9195;
        margin-top:20px;
      }
    }
    .drainageDiv{
      position:absolute;
      left: 0;
      top: 0;
      z-index:30300;
      .titles{
        cursor:pointer;
        width:20px;
        height:20px;
        position:absolute;
        z-index:30300;
      }
    }
  }
  .path-drainage{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 66666;
  .drainage-edit-bg{
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.3;
  }
    .drainage{

    width: 70%;
    left: calc(~"15% + 115px");
    opacity: 0.9;
    top: 11%;
    position: fixed;
    z-index: 30005;
    display: flex;
    justify-content: center;
    align-items: center;
    .alert-close{
      position: absolute;
      right: -5px;
      top: -5px;
      background: #fff;
      width: 33px;
      height: 33px;
      -webkit-box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
      border-radius: 5px;
      text-align: center;
      line-height: 33px;
      cursor: pointer;
      z-index: 10;
      -webkit-transition: all .23s ease .1s;
      transition: all .23s ease .1s;
      &:hover{
                transform: translate(5px,-5px);
                box-shadow: 0 0 0 0 rgba(0,0,0,.1)
            }
      i{
          font-size: 20px;
      }

    }
  }
  }

  .floorImg{
    width: 100%;
  }
  .selectFloor,.floorAllClass{
    color: #4EBCEE!important ;
  }
  .ivu-select .ivu-select-dropdown {
    z-index: 30000;
}
}
.endAction{
  background-color: #f5f5f5;
  span{
    color: #888;
  }
}
.pathTrend .path-title .path-select {
    width: 200px;
    position: absolute;
    right: 19px;
    top: 15px;
    z-index: 40000;
}
.cascade{
    width: 230px;
    height: 43px;
    overflow: hidden;
    .cascade-dom{
        width: 100%;
        background-color: #fff;
        height: 43px;
        overflow: hidden;
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,.2);
        .el-cascader__tags {
            top: 10px;
            transform: translateY(0%);
        }
        input {
            border: none;
            font-size: 1rem;
            background-color: #fff;
            height: 43px!important;
        }
    }
}
.cascade+.cascade{
    margin-left: 30px;
}
.cascade-popper{
    z-index:30301!important;
}
.ivu-tooltip-light.ivu-tooltip-popper{
  z-index: 70000!important;
}
</style>
