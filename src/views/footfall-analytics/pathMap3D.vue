<template>
	<div class="path3d">
		<div class="selector-container bg-white box-card">
			<div class="flex-center">
				<DatePicker
					type="date"
					v-model="drainageDate"
					:placeholder="$t('holder.Date')"
					:options="disabledDate"
					format="yyyy-MM-dd"
					class="w-select"
				></DatePicker>
				<Select v-model="mapIndex" class="m-l-20 w-select">
					<Option v-for="(item,index) in mapInfo" :value="index" :key="item.id">{{ $t(item.type) }}</Option>
				</Select>
				<Button size="large" class="m-l-20" type="primary" @click="searchData">{{ $t('query') }}</Button>
				<Button size="large" class="m-l-20" @click="reset">{{ $t('reset') }}</Button>
			</div>

		</div>
		<div class="new-path-center m-t-20" v-show="mapInfo.length">
			<div id="fengMap" v-if="isFengMap"></div>
			<div class="shield"></div>
		</div>
		<div class="new-path-center flex-column m-t-20 no-data" v-show="!mapInfo.length">
			{{$t('holder.NoData')}}
		</div>
		<div class="maps">
			<pathTab :title="$t(title1)" :numbers="number1"></pathTab>
			<img v-if="$store.state.language==='en-US'" :src="pathColorEn" alt="">
			<img v-else :src="pathColor" alt="">
		</div>
	</div>
</template>
<script>
  import pathTab from './components/components/PathTab.vue'
  import { openMap } from '@/libs/fengMap.js'
  import { disabledDate } from '@/libs/util.js'
  import { Path3D, getFengmapId } from '@/api/analysis'
  import moment from 'moment'
  import _ from 'lodash'

  export default {
    name: 'path3D',
    components: {
      pathTab
    },
    data () {
      return {
        pathColor: require('@/assets/images/fixation_img/rest/path.png'),
        pathColorEn: require('@/assets/images/fixation_img/rest/path_en.png'),
        isFengMap: true,
        drainageDate: '',
        disabledDate: '',
        mapIndex: -1,
        floorId: 1,
        floorNumber: [],
        title1: 'wanderDepthWithUnit',
        number1: 0,
        allLine: [],
        mapInfo: []
      }
    },
    computed: {
      mapOptions () {
        const map = this.mapInfo[this.mapIndex]
        if (!map) return null
        return {
          container: '',
          focusAlphaMode: false,
          appName: map.app_name,
          key: map.app_key,
          mapId: map.fmap_id
        }
      }
    },
    watch: {
      drainageDate (val) {
        this.outRange = moment(val).format('YYYY-MM-DD')
      },
      floorId () {
        this.number1 = _.filter(this.floorNumber, (o) => {
          return o.id === this.floorId
        })[0].number
      }
    },
    created () {
      // 初始化时间
      this.disabledDate = disabledDate
      this.drainageDate = moment().add('-1', 'days').format('YYYY-MM-DD')
      this.outRange = moment().add('-1', 'days').format('YYYY-MM-DD')
    },
    mounted () {
      // let allData = this.allLine, option = this.mapOptions
      // this.$store.commit('UPDATE_LOADING_STATUS', true)
      // openMap(this, allData, option)
      this.queryMapId().then(() => {
        this.searchData()
      })

    },
    methods: {
      queryMapId () {
        return new Promise((resolve, reject) => {
          getFengmapId({ property_id: this.$store.state.home.headerAction }).then(res => {
            this.mapInfo = res.data.data
            if (this.mapInfo.length) {
              this.mapIndex = 0
            } else {
              this.$store.commit('UPDATE_LOADING_STATUS', false)
              this.$message.warning(this.$t('error.noMapConfig'))
              reject()
            }
            resolve()
          }).catch(err => {
            reject()
          })
        })
      },
      searchData () {
        this.isFengMap = false
        let property_id = this.$store.state.home.headerAction
        Path3D({ time: this.outRange, property_id: property_id,type:this.mapInfo[this.mapIndex].type }).then(res => {
          this.$store.commit('UPDATE_LOADING_STATUS', true)
          if (res.data.code === 200) {
            this.isFengMap = true
            let data = res.data.data
            this.number1 = data[0].depthOfWandering
            let allData = []
            data.map((list, index) => {
              this.floorNumber.push({
                floor: list.floor_index,
                number: list.depthOfWandering,
								id:index+1
              })
							//过滤无效数据
              list.paths = list.paths.filter(p => {
                return p.enter > 0 && p.path.every(m => {
                  return m.x && m.y
                })
              })
							//按客流量排序
              // list.paths = _.sortBy(list.paths,function (m) {
							// 	return m.enter
              // }).reverse()
              console.log(list.paths)
              const front = Math.floor(list.paths.length/3);
              const back = list.paths.length - front
              list.paths.map((val, i) => {
                let arr = []
                val.path.map(d => {
                  let obj = {}
                  obj.x = Number(d.x)
									obj.enter = val.enter
                  obj.y = Number(d.y)
                  obj.id = index + 1
                  if (i <= front) {
                    obj.colorType = 'front'
                  } else if (i > back) {
                    obj.colorType = 'back'
                  } else {
                    obj.colorType = 'mid'
                  }
                  arr.push(obj)
                })
                allData.push(arr)

              })
            })
            allData.forEach(o=>{
              o.forEach(m=>{
              	if(m.x === 	13027706.896595905){
                  console.log(o)
                }
							})
						})
            console.log(allData)
            allData.reverse()
            setTimeout(() => {
              openMap(this, allData, this.mapOptions)
            })
          }
        })
      },
      reset () {
        this.drainageDate = moment().add('-1', 'days').format('YYYY-MM-DD')
        this.outRange = moment().add('-1', 'days').format('YYYY-MM-DD')
      }
    }
  }
</script>

<style lang="less" scoped>
	/*@import "~fengmap/build/toolBarStyle.css";*/
	.path3d {
		.path-picker {
			margin-bottom: 20px;
			overflow: hidden;
			background-color: #fff;
			box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
			padding: 18px 30px;
			border-radius: .5rem;

			.con-select {
				clear: none;
			}

			.ivu-date-picker {
				margin-top: 5px;
			}

			.ivu-input {
				width: 230px;
				height: 43px;
				border: 1px solid rgba(0, 0, 0, .2);
				font-size: 16px;
				font-family: "source_han_sans_cn", "Roboto", sans-serif;
			}

			.selectExample {
				float: left;
				width: 150px;
				margin-left: 30px;
			}

			.selectFloor {
				width: 150px;
			}

			.ivu-input-suffix {
				i {
					height: 43px;
					line-height: 43px;
				}
			}

			.ivu-date-picker .ivu-select-dropdown {
				z-index: 90000
			}

			.drainage-submit {
				display: inline-block;
				padding: 0.75rem 2rem;
				text-align: center;
				border-radius: 6px;
				background-color: #00A0E9;
				color: #fff;
				font-size: 1rem;
				margin-left: 30px;
				cursor: pointer;

				&:hover {
					box-shadow: 0 8px 25px -8px #00A0E9;
				}
			}

			.drainage-reset {
				background: #fff !important;
				color: #37b5ed;
				border: 1px solid #37b5ed;
			}
		}

		.new-path-center {
			width: 80%;
			position: relative;
			height: 600px;
			overflow: hidden;

			&.no-data {
				background: #fff;
				justify-content: center;
				text-align: center;
				font-size: 30px;
			}

			#fengMap {
				width: 100%;
				height: 600px;
				border-radius: .5rem;
				background-color: #fff;
				position: relative;
			}

			.shield {
				width: 100%;
				height: 30px;
				background-color: #fff;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}

		.maps {
			position: absolute;
			top: 258px;
			right: 20px;
			width: 18%;
			height: auto;
			z-index: 999;

			img {
				display: block;
				margin-top: 30px;
				width: 100%;

				&:hover {
					border: 1px solid #23aeee !important;
					border-radius: 6px;
					box-shadow: 0px 0px 18px 0px rgba(160, 163, 164, .5) !important;
				}
			}
		}
	}

</style>
