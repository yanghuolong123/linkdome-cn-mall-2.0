<template>
  <div class="path3d">
    <div class="path-picker">
          <DatePicker
              type="date"
              v-model="drainageDate"
              placeholder="选择日期"
              :options="disabledDate"
              format="yyyy-MM-dd"
              style='width:230px;float:left;'
          ></DatePicker>
          <div class="drainage-submit" v-on:click="searchData">查询</div>
          <div class="drainage-submit drainage-reset" v-on:click="reset">重置</div>
    </div>
	<div class="new-path-center">
		<div id="fengMap" v-if="isFengMap"></div>
		<div class="shield"></div>
	</div>

	<div class="maps">
		<pathTab :title="title1" :numbers="number1"></pathTab>
	</div>
  </div>
</template>
<script>
import pathTab from './components/components/PathTab.vue'
import { openMap } from '@/libs/fengMap.js'
import { disabledDate } from '@/libs/util.js'
import { flowMoving } from '@/api/analysis'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'path3D',
  components: {
	  pathTab
  },
  data () {
    return {
      isFengMap: false,
      drainageDate: '',
	  disabledDate: '',
	  floorId: 1,
	  floorNumber: [],
	  title1: '游逛深度（个）',
	  number1: 0,
      mapOptions: {
        container: '',
        mapThemeURL: '../../../data/theme',
        focusAlphaMode: false,
        appName: '测试',
        key: 'f827ad77c64b5cf3a6b6fffe0d4a7b9b'
      },
      allLine: []
    }
  },
  computed: {

  },
  watch: {
    drainageDate (val) {
      this.outRange = moment(val).format('YYYY-MM-DD')
    },
    floorId () {
      this.number1 = _.filter(this.floorNumber, (o) => { return o.floor === this.floorId })[0].number
    }
  },
  created () {
    // 初始化时间
    this.disabledDate = disabledDate
    this.drainageDate = moment(moment(new Date())).format('YYYY-MM-DD')
    this.outRange = moment(moment(new Date())).format('YYYY-MM-DD')
  },
  mounted () {
    // let allData = this.allLine, option = this.mapOptions
    // this.$store.commit('UPDATE_LOADING_STATUS', true)
    // openMap(this, allData, option)
    this.searchData()
  },
  methods: {
    searchData () {
      this.isFengMap = false
      let property_id = this.$store.state.home.headerAction
      flowMoving({ time: this.outRange, property_id: property_id }).then(res => {
        this.$store.commit('UPDATE_LOADING_STATUS', true)
        if (res.data.code === 200) {
          this.isFengMap = true
		  let data = res.data.data
		  this.number1 = data[0].depthOfWandering
		   let allData = []
		  data.map((list, index) => {
            this.floorNumber.push({
              floor: list.floor_index,
              number: list.depthOfWandering
            })
            let patData = _.take(list.paths, 10)
            patData.map(val => {
              if (val.enter !== 0) {
				  let arr = []
				  val.path.map(d => {
					  arr.push({
						  x: d.x ? d.x : '',
						  y: d.y ? d.y : '',
						  id: index + 1
					  })
				  })
                allData.push(arr)
              }
            })
		  })
		  let option = this.mapOptions
		  setTimeout(() => { openMap(this, allData, option) })
        }
      })
    },
    reset () {

    }
  }
}
</script>

<style lang="less" scoped>
.path3d{
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
		.ivu-date-picker{
			margin-top: 5px;
		}
		.ivu-input{
			width: 230px;
			height: 43px;
			border: 1px solid rgba(0, 0, 0, .2);
			font-size: 16px;
			font-family: "source_han_sans_cn", "Roboto", sans-serif;
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
		.drainage-submit{
			display:inline-block;
			padding: 0.75rem 2rem;
			text-align:center;
			border-radius: 6px;
			background-color: #00A0E9;
			color: #fff;
			font-size: 1rem;
			margin-left:30px;
			cursor: pointer;
			&:hover{
				box-shadow: 0 8px 25px -8px #00A0E9;
			}
		}
		.drainage-reset{
			background: #fff !important;
			color: #37b5ed;
			border: 1px solid #37b5ed;
		}
	}
	.new-path-center{
		width: 80%;
		position: relative;
		height: 600px;
		overflow: hidden;
		#fengMap{
			width: 100%;
			height: 600px;
			border-radius: .5rem;
			background-color: #fff;
			position: relative;
		}
		.shield{
			width: 100%;
			height: 30px;
			background-color: #fff;
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}

 	.maps{
      position: absolute;
      top: 258px;
      right: 20px;
      width: 18%;
      height: auto;
      z-index: 999;
    }
}

</style>
