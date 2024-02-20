<template>
	<div class="pathTrend">
		<div class="path-picker flex-center">
			<DatePicker
				type="date"
				v-model="drainageDate"
				:placeholder="$t('holder.Date')"
				class="select-date"
				:options="disabledDate"
				format="yyyy-MM-dd"
			></DatePicker>

			<Select v-model="floor" class="selectExample selectFloor" :placeholder="$t('holder.select')">
				<Option v-for="item in floorList" :value="item.id" :key="item.id">{{ item.name }}</Option>
			</Select>
			<Button size="large" type="primary" class="m-l-20" @click="searchData">{{ $t('query') }}</Button>

		</div>
		<!-- 中间内容 -->
		<div class="flexs">
			<new-path ref="newPath" v-if="isNewPath"></new-path>
			<div class="paths"  v-else >
				<div class="header">
					<p class="title">{{$t('pathTrendChart')}}</p>
					<p class="icons">
						<icons :type="leftIcon"   :color="mainColor" :size=24  :title="titlePath" style="cursor:pointer;" @click.native="changePath"></icons>
					</p>
				</div>
				<div class="svgs" :width="canvasWidth" :height="canvasHeight" v-for="item in svgLists" v-if="showPath">
					<svg :width="canvasWidth" :height="canvasHeight" version="1.1">
						<path fill="transparent" :stroke="item.color" :stroke-width="item.width" :d="item.d" class="path"></path>
					</svg>
					<svg :width="canvasWidth"  :height="canvasHeight"  width="16" height="16" class="ball" :style="{transform:item.transform,offsetPath:item.path,animation:item.animation}"  viewBox="0 0 1024 1024" version="1.1">
						<path d="M 521.813 874.862 s 85.7783 -0.571021 85.77 -45.2698 L 607.456 199.988 c 0 -46.4123 -100.506 -53.0938 -100.506 -53.0938 s 136.923 -5.54963 151.473 45.633 c 14.7673 51.9001 67.1772 107.457 112.135 155.205 c 97.1147 103.133 228.052 159.266 228.052 159.266 s -116.378 70.1674 -215.041 159.309 a 618.749 618.749 0 0 0 -129.944 170.21 c -23.8016 47.6745 -131.81 38.3431 -131.81 38.3431 Z" fill="#2bd9cf" p-id="3058"></path>
						<path d="M 611.191 377.294 l 110.296 134.806 l -107.844 122.55 l -590.693 -120.099 Z" fill="#2bd9cf" p-id="3059"></path>
					</svg>
				</div>
				<div class="canvas">
					<canvas id="canvasCircle" :height="canvasHeight" :width="canvasWidth"></canvas>
					<img  class="imgs" v-if="map" :src="map">
					<div class="noData" v-else>{{ $t('holder.NoData') }}</div>
					<div class="colorBar">
						<p class="maxNumber">{{maxNumber}}</p>
						<p class="minNumber">0</p>
						<img :src="colorBar" width="20">
					</div>
					<div  v-for="item in titleLists" class="titleList" :title="item.name" :style="{left:(item.x-10)+'px',top:(item.y-10)+'px'}"></div>
				</div>
			</div>

			<div class="maps">
				<pathTab title="游逛深度（个）" :numbers="number1"></pathTab>
			</div>
		</div>

	</div>
</template>
<script>
  import pathTab from './components/components/PathTab.vue'
  import {  formatNode, drawCircle, pathNodes } from '@/libs/drawline.js'

  import newPath from './pathTrend.vue'
  import { flowMoving,getTrailRoute } from '@/api/analysis'
  import { disabledDate } from '@/libs/util.js'
  import {getEntity} from '../../api/home'
  import moment from 'moment'
  import _ from 'lodash'
  export default {
    name: 'pathTrend',
    components: {
      pathTab,
      newPath
    },
    data () {
      return {
        isNewPath: false,
        maxNumber: '',
        mainPath: false,
        floor: '',
        colorBar: require('@/assets/images/fixation_img/rest/colorBar.png'),
        map: '',
        outRange: '',
        drainageDate: [],
        leftIcon: 'xianlu',
        rightIcon: 'zhuanchu',
        mainColor: '#A6A7A7',
        number1: 0,
        screenWidth: document.body.clientWidth,
				ismainColor:'#E8585A',
        colors: [ '#FEB33D', '#2BD9CF', '#33B3ED','#7367F0', '#7367F0'],
        allMoveData: [],
        canvasWidth: '',
        canvasHeight: '',
        titlePath: '切换主路径',
        titleList: [],
        positions: [],
        moveList: [],
        oneMoveList: [],
        svgList: [],
        showPath: false,
        count: 0,
        disabledDate: '',
        floorList:[]
      }
    },
    watch: {
      screenWidth: {
        handler (val, old) {
          this.screenWidth = val
          if (document.getElementsByClassName('canvas')[0]) {
            let width = document.getElementsByClassName('canvas')[0].offsetWidth
            let height = document.getElementsByClassName('canvas')[0].offsetHeight
            this.canvasWidth = width
            this.canvasHeight = height
            this.searchData()
          }
        }
      },
      drainageDate (val) {
        this.outRange = moment(val).format('YYYY-MM-DD')
      },
      '$store.state.home.headerAction' () {
        this.floor = ''
        let routerName = this.$router.currentRoute.name
        if (routerName === 'OldPath') {
          this.searchData()
        }
      }
    },
    computed: {
      titleLists () {
        return this.titleList
      },
      svgLists () {
        return this.svgList
      }
    },
    created () {
      // 初始化时间
      this.disabledDate = disabledDate
      this.drainageDate = moment(moment(new Date())).add('-1','day').format('YYYY-MM-DD')
      this.outRange = moment(moment(new Date())).add('-1','day').format('YYYY-MM-DD')
      this.getFloorlData().then(res=>{
        this.initFloorData()
      })

    },
    mounted () {
      const thats = this
      // 窗口适应
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          thats.screenWidth = window.screenWidth
          let content = document.getElementsByClassName('pathContent')[0]
          if (content) {
            thats.$refs.newPath.imgWidth = (content.clientWidth) - 20
            thats.$refs.newPath.dealWithSearchData(thats.$refs.newPath.allMoveData, -1)
          }
        })()
      }
    },
    methods: {
      getFloorlData(){
        return new Promise((resolve,reject)=>{
          getEntity(this.$store.state.home.headerAction,51).then(res=>{
            this.floorList = res.data.data || [];
            if(this.floorList && this.floorList.length)
              this.floor = this.floorList[0].id
            resolve()
          }).catch(()=>{
            reject()
          })
        })
      },
      /* 切换主/全路径 */
      changePath () {
        var that = this
        clearInterval(this.timer)
        this.mainPath = !this.mainPath
        this.mainColor = this.mainPath ? '#E8585A' : '#A6A7A7'
        this.titlePath = this.mainPath ? '切换全路径' : '切换主路径'
        this.svgList = []
        var canvas = document.getElementById('canvasCircle')
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.showPath = false
        that.drawLine()
      },
      /* 画路径 */
      drawLine () {
        var that = this
        // var length = this.mainPath ? 3 : 1000
        var titleList = []
        this.positions = []
        var paths = []
        if (this.allMoveData.paths) {
          this.allMoveData.paths.forEach(m=>{
            if (m.enter) {
              paths.push(m)
            }
          })
        }
        var maxNumber
        if (paths.length) {
          maxNumber = _.maxBy(paths, 'enter').enter
        } else {
          maxNumber = 0
        }
        this.maxNumber = Boolean(maxNumber) > 0 ? maxNumber : 0
				const mainCount = paths.filter(o=>{
				  return o.is_main === 1
				}).length
        var length = this.mainPath ? mainCount : 1000
				if(this.mainPath){
				  // 只显示主路径
          paths = _.sortBy(paths,'is_main').reverse()
        }
        paths.forEach(function (m, index) {
          if (index < length) {
            var clickNodes = []
            var filterNodes = 1
            m.path.forEach(function (e) {
              var obj = {}
              obj.x = Math.floor(e.x * that.canvasWidth)
              obj.y = Math.floor(e.y * that.canvasHeight)
              obj.enter = m.enter
							obj.isMain = m.is_main
              obj.name = e.name
              clickNodes.push(obj)
              titleList.push(obj)
              if (!e.x && !e.y) {
                filterNodes = 0
              }
            })
            if (filterNodes > 0) {
              let controlNode = formatNode(clickNodes[0].x, clickNodes[0].y, clickNodes[1].x, clickNodes[1].y, 100)
              clickNodes.splice(1, 0, controlNode)
              if (controlNode.x < 0 || controlNode.y < 0) {
                return false
              }
              that.positions.push(clickNodes)
            }
          }
        })
        titleList = _.uniqBy(titleList, 'name')
        this.titleList = titleList
        this.oneMoveList = pathNodes[0]
        var positions = that.positions
        var svgList = []
        positions.forEach(function (m, index) {
          let obj = {}
          if (maxNumber == 0) {
            obj.width = 0
          } else {
            obj.width = m[0].isMain === 1?5:Math.ceil((m[0].enter / maxNumber) * 10 / 2)
          }
          obj.color = m[0].isMain === 1?that.ismainColor:that.colors[5 - obj.width]
          obj.d = 'M' + m[0].x + ' ' + m[0].y + 'Q ' + m[1].x + ' ' + m[1].y + ',' + m[2].x + ' ' + m[2].y
          obj.path = "path('" + 'M' + m[0].x + ' ' + m[0].y + 'Q ' + m[1].x + ' ' + m[1].y + ',' + m[2].x + ' ' + m[2].y + "')"
          obj.animation = 'red-ball ' + (index + 3) * 2 + 's linear  infinite'
          if ((m[0].x > m[2].x && m[0].y > m[2].y) || m[0].x > m[2].x && m[0].y < m[2].y) {
            obj.transform = 'rotateX(180deg)'
          } else {
            obj.transform = 'rotateX(0deg)'
          }
          svgList.push(obj)

          // if (obj.width > 1) {
          //
          // }
        })
        svgList = _.uniq(svgList)
        that.svgList = svgList
        that.showPath = true
        let sumNumber = _.sumBy(this.allMoveData.paths, 'enter')
        if (sumNumber > 0) {
          var c = 2
          var ctxs = document.getElementById('canvasCircle').getContext('2d')
          this.timer = setInterval(function () {
            positions.forEach(function (m) {
              var arrs = []
              if (maxNumber > 0) {
                var width = Math.ceil((m[0].enter / maxNumber) * 10 / 2)
                var width1 = Math.ceil((m[0].enter / maxNumber) * 10 / 2)
                if (width > 1 && width1 > 1) {
                  arrs.push(m)
                }
              }
              arrs = _.uniq(arrs)
              arrs.forEach(function (ms) {
                drawCircle(ctxs, ms[0].x, ms[0].y, c)
                drawCircle(ctxs, ms[2].x, ms[2].y, c)
              })
            })
            c++
            c = c == 5 ? 2 : c
          }, 500)
        } else {
          clearInterval(this.timer)
          var canvas = document.getElementById('canvasCircle')
          var ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      },

      /** 查询方法 增加节流防止缩放出问题 */
      searchData () {
        this.mainPath = false
        this.mainColor = '#A6A7A7'
        if (this.floor === 0) {
          this.isNewPath = true
          setTimeout(() => {
            this.strollAbout()
            this.$refs.newPath.search(this.outRange)
          })
        } else {
          this.isNewPath = false
          this.initFloorData()
        }
      },
      initFloorData: _.throttle(function () {
        if (this.timer) {
          clearInterval(this.timer)
        }
        var canvas = document.getElementById('canvasCircle')

        if (canvas) {
          var ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        var that = this
        this.mainPath = false
        if (this.count == 0) {
          this.count++
        }
        // let admin = this.$store.state.user.role_id
        // let allBzid = this.$store.state.user.bzid
        let property_id = this.$store.state.home.headerAction

        setTimeout(() => {
          let canvasBox = document.getElementsByClassName('canvas')[0]
          if (canvasBox) {
            let width = canvasBox.offsetWidth
            let height = canvasBox.offsetHeight // 按照图片的比例计算高度
            // let height = width * 614 / 1171 // 按照图片的比例计算高度
            this.canvasWidth = width
            this.canvasHeight = height
          }
        });
        getTrailRoute({ time: this.outRange, floor_id: this.floor }).then(res => {
          that.allMoveData = _.cloneDeep(res.data.data)
          // if (admin > 3) {
          //   let currList = []
          //   that.allMoveData.map(list => {
          //     allBzid.map(val => {
          //       if (list.bzid == val) currList.push(list)
          //     })
          //   })
          //   that.allMoveData = currList
          // }
          // if (!that.floor) {
          //   that.floor = that.allMoveData[0].floor_index
          // }
          that.isNewPath = that.floor === 0 ? true : false
          // var moveData = _.find(that.allMoveData, ['floor_index', that.floor])
          var moveData = that.allMoveData
          if (!moveData) return false
          that.map = moveData ? moveData.map_url : ''
          that.number1 = moveData ? moveData.depthOfWandering : ''
          that.svgList = []
          var canvas = document.getElementById('canvasCircle')
          var ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          setTimeout(() => {
            that.drawLine()
          })
        })
      }, 1000),
      strollAbout () {
        let property_id = this.$store.state.home.headerAction
        flowMoving({ time: this.outRange, property_id: property_id }).then(res => {
          if (res.data.code === 200) {
            if (this.floor == 0) {
              let sumNumber = 0
              res.data.data.map(list => {
                sumNumber += list.depthOfWandering
              })
              sumNumber = sumNumber / res.data.data.length
              this.number1 = sumNumber.toFixed(0)
            }
          }
        })
      }
    },
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer)// 在vue实例销毁钱，清除我们的定时器
      }
    }

  }

</script>
<style lang="less">
	.pathTrend{
		.path-picker{
			margin-bottom: 20px;
			overflow: hidden;
			background-color: #fff;
			box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
			padding: 18px 30px;
			border-radius: .5rem;
			.con-select{
				clear: none;
			}
			.ivu-input{
				width: 230px;
				height: 43px;
				border: 1px solid rgba(0, 0, 0, .2);
				font-size: 16px;
				font-family: "source_han_sans_cn", "Roboto", sans-serif;
			}
			.select-date{
				float: left;
				width: 230px;
			}
			.selectExample{
				float: left;
				width: 150px;
				margin-left: 30px;
			}
			.selectFloor{
				width: 150px;
			}
			.ivu-input-suffix {
				i{
					height: 43px;
					line-height: 43px;
				}
			}
			.ivu-date-picker .ivu-select-dropdown{
				z-index:90000
			}
		}
		.flexs{
			display: flex;
			.paths{
				border-radius: .5rem;
				background-color: #fff;
				position: relative;
				width: 80%;
				height: auto;
				padding-left: 30px;
				.svgs{
					position: absolute;
					svg {
						display: block;
						position: absolute;
						z-index: 3000
					}
				}
				.header{
					width:100%;
					position: relative;
					margin-bottom: 20px;
					.title{
						font-size: 18px;
						color: #3e3c3c;
						height: 40px;
						line-height: 62px;
					}
					.iconfont{
						margin: 0px 10px;
					}
					.icons{
						position: absolute;
						right: 30px;
						top: 8px;
					}
				}
				.canvas{
					position: relative;
					width: 100%;
					height: 650px;
					.titleList{
						position:absolute;
						z-index:3700;
						width:30px;
						height:30px;
						cursor:pointer;
					}
					.imgs{
						width: 100%;
						position: relative;
						z-index: 99;
						height:100%;
					}
					.noData{
						position: relative;
						left: 0;
						top: 0;
						width: 100%;
						height: 568px;
						line-height: 568px;
						font-size: 32px;
						background-color: #fff;
						z-index: 101;
						text-align: center;
					}
					#canvas{
						position: absolute;
						z-index: 999;
					}
					#canvasCircle{
						position: absolute;
						z-index: 3000;
					}
					.maxNumber{
						position: absolute;
						width: 34px !important;
						left: -50px;
						font-size: 14px;
						top: 0;
						z-index: 1020;
						text-align: right;
					}
					.minNumber{
						position: absolute;
						width: 34px !important;
						left: -50px;
						font-size: 14px;
						bottom: 0;
						z-index: 1020;
						text-align: right;
					}
					.colorBar{
						position: absolute;
						width: 34px !important;
						right: 2.3%;
						top: 38%;
						z-index: 999;
					}
				}
			}
			.maps{
				position: absolute;
				top: 258px;
				right: 20px;
				width: 18%;
				height: auto;
			}
		}

		.ball {
			width: 20px;
			height: 20px;
			border-radius: 50%;
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
		.path {
			stroke-dasharray: none!important;
			animation: none!important;
		}
		.ivu-select .ivu-select-dropdown {
			z-index: 99999;
		}
	}
</style>

<style>
	.cls-1 {
		fill: #2bd9cf;
		fill-rule: evenodd;
	}
</style>
