<template>
	<div class="go-shop">
		<div class="selector-container bg-white box-card">
			<!-- <h1>店铺TOP10排行分析</h1> -->
			<div class="flex-center">
				<DatePicker
						class="w-select"
						type="daterange"
						v-model="crossDate"
						placement="bottom-end"
						:options="disabledDate"
						placeholder="选择日期"
				></DatePicker>
				<vs-select
						class="w-select m-l-20"
						autocomplete
						v-model="activities"
						placeholder="选择排队名"
						style="width:14.375rem;"
						multiple
				>
					<vs-select-item
							:value="item.value"
							:text="item.text"
							:key="index"
							v-for="(item,index) in activitiesType"
					/>
				</vs-select>
				<vs-select
					class="w-select m-l-20"
					autocomplete
					v-model="dataType"
					placeholder="选择数据指标"
					style="width:14.375rem;"
				>
					<vs-select-item
						value="0"
						text="排队长度"
					/>
					<vs-select-item
						value="1"
						text="平均等待时间"
					/>
				</vs-select>
				<Button size="large" class="m-l-20" type="primary" @click="paramsPrepare">查询</Button>
				<Button size="large" class="m-l-20" @click="resetData">重置</Button>
			
			</div>
		</div>
		<div class="go-shop-chart-list">
			<div class="go-shop-time-icon">
				<span>结账排队分析</span>
				<p class="flex-center">
            <span :key="index" v-for="(icon,index) in iconList" v-on:click="iconClick(icon.value)">
              <icons
					  :title="iconTitle[icon.type]"
					  :type="icon.type"
					  :size="20"
					  :color="iconIndex === icon.value ? iconColor :'#9D9D9DFF'"
			  ></icons>
            </span>
				</p>
			</div>
			<div v-if="isData" class="noData">暂无数据</div>
			<vue-apex-charts
					v-bind:class="{ lineAction: iconIndex == 0 }"
					class="shop-line"
					ref="graphLine"
					height='95%'
					width="100%"
					type="line"
					v-if="isList"
					:options="graphData.chartOptions"
					:series="graphData.series"
			></vue-apex-charts>
			<table-default
					v-bind:class="{ tableAction: iconIndex ==1}"
					class="shop-table"
					:tableTitle='goTitle'
					:tableName='goName'
					:tableList='goTableList'
			></table-default>
		</div>
	</div>
</template>
<script>
  import TableDefault from '@/views/ui-elements/table/TableDefault.vue'
  import VueApexCharts from 'vue-apexcharts'
  import { activitiesList, goShopTen } from '@/api/analysis'
  import { getQueueList , getQueueAnalysis } from '@/api/passenger.js'
  import { exportEx } from '@/api/home.js'
  import { disabledDate,downloadEx } from '@/libs/util.js'
  import moment from 'moment'
  import NP from 'number-precision'
  import _ from 'lodash'

  export default {
    name: 'goShop',
    components: {
      TableDefault,
      VueApexCharts

    },
    data () {
      return {
        multiple:true,
        isList: false,
        isData: true,
				dataType:0,
        activities: [],
        activitiesType: [],
        crossDate: [],
        crossDateTwo: [],
        selectType: 0,
        iconList: [
          {
            type: '62',
            color: '#9D9D9DFF',
            value: 0
          },
          {
            type: 'biaoge-copy',
            color: '#9D9D9DFF',
            value: 1
          },
          {
            type: 'daoru',
            color: '#9D9D9DFF',
            value: 2
          }
        ],
        iconTitle: {
          'zhexiantu': '折线图',
          '62': '柱状图',
          'biaoge-copy': '详细数据',
          'xiangxia': '查看全部实体排行',
          'ditu': '出入口客流',
          'fenxi': '饼状图',
          'chakan': '查看所有',
          'daoru': '下载'
        },
        iconIndex: 0,
        iconColor: 'rgb(34, 128, 215)',
        goTitle: '',
        goName: [],
        goTableList: [],
        graphData: {
          chartOptions: {
            chart: {
              type: 'line',
              toolbar: {
                show: false,
                tools: {
                  download: false
                }
              }
            },
            dataLabels: {
              enabled: false
            },
            colors: ['#33B3ED', '#2BD9CF', '#94E2FF', '#FBAB40', '#8D82F0', '#E8585A'],
            stroke: {
              width: 2,
            
            },
            xaxis: {
              categories: []
            },
            yaxis: {
              title: {
                text: '人数'
              },
              labels: {
                show: true,
                formatter: (value) => {
                  return value
                }
              }
            },
            fill: {
              opacity: 1

            },
            legend:{
              data:[],
              height:30
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val
                }
              }
            }
          },
          series: []
        },
        loadingData: {
          time1: '',
          time2: '',
          id: ''
        },
        disabledDate: ''

      }
    },
    watch: {
      '$store.state.home.headerAction' () {
        this.resetData()
        let routerName = this.$router.currentRoute.name
        if (routerName === 'GoShop') {
          this.activitiesDataList()
        }
      }
    },
    created () {
      this.disabledDate = disabledDate
    },
    mounted () {
      this.activitiesDataList()
      var date = new Date()
      date = date.setDate(date.getDate() - 1)
      var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
      this.crossDate = dateTime
      this.crossDateTwo = dateTime
    },
    methods: {
      // 获取业态
      activitiesDataList () {
        var that = this
        that.activitiesType = []
        let propertyId = this.$store.state.home.headerAction
        getQueueList({property_id: propertyId }).then(res => {
          _.forEach(res.data.data, function (item) {
            var obj = {}
            obj.text = item.name
            obj.value = item.id
            that.activitiesType.push(obj)
          })
          //that.paramsPrepare()
        })
				
				console.log(that.activitiesType)
      },
      gotInnerRange (date) {
        const [start, end] = date
        let startTime = moment(start)
        let endTime = moment(end)
        let diffDays = moment.duration(endTime.diff(startTime)).asDays()
        let innerRange = ''
        if(diffDays == 0) innerRange = "Hour"
        if (diffDays < 60 && diffDays > 0) innerRange = 'Date'
        if(diffDays > 60 ) innerRange = 'Month'
        return innerRange
      },
      // 点击查询
      paramsPrepare () {
        var that = this
        var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD') + ',' +
          moment(that.crossDate[1]).format('YYYY-MM-DD')
        var time2
        if (that.selectType === 0) {
          time2 = ''
        } else {
          time2 = moment(that.crossDateTwo[0]).format('YYYY-MM-DD') + ',' +
            moment(that.crossDateTwo[1]).format('YYYY-MM-DD')
        }
        var id = that.activities === 0 ? '' : that.activities
        that.loadingData.time1 = time1
        that.loadingData.time2 = time2
        that.loadingData.id = id
        let propertyId = this.$store.state.home.headerAction
				let type = this.gotInnerRange(that.crossDate)
        console.log(this.dataType)
				let dataTypeEle = this.dataType
        getQueueAnalysis({ time1: time1, property_id: propertyId,queue_id:this.activities.join(","),type:type }).then(res => {
          that.isList = true
          that.graphData.chartOptions.xaxis.categories = []
          that.graphData.series = []
          that.goTableList = []
          that.isData = false
          that.goName = []
          let sortarr = []
          that.goName.push('时间')
					let data = res.data.data;
          let xArray = []
          let xDataArray = []
          let legend =  data.map((d)=>{
            return  d.name
          })
          for(let i = 0 ; i < this.activities.length; i++){
            let txArray = []
            let txDataArray = []
            _.mapKeys(data[i].list.time1 ,(value,key)=>{
              if(type == "Hour") {
                txArray.push(key.split(' ')[1])
              }else {
                txArray.push(key)
              }
              if(dataTypeEle == 0){
                txDataArray.push(value.queue_len)
							}else{
                txDataArray.push(value.avg_waittime)
							}
             
              return key
            } )
            xArray = txArray;
            xDataArray.push({
              name: data[i].name,
              data : txDataArray
            })
          }
          console.log(xArray)
          that.graphData.chartOptions.xaxis.categories = xArray
          that.graphData.chartOptions.legend.data = legend
          that.graphData.series = xDataArray
					let yTitle = dataTypeEle == 0 ? "人数":"平均等待时长(秒)"
          that.$refs.graphLine.updateOptions({
            xaxis: { categories: that.graphData.chartOptions.xaxis.categories },
					  yaxis:{
              title:{ text: yTitle}
						}
          })
        })
      },
      // 重置数据
      resetData () {
        var date = new Date()
        date = date.setDate(date.getDate() - 1)
        var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
        this.crossDate = dateTime
        this.selectType = 0
        this.activities = this.activitiesType[0].value
      },
      // 点击图标
      iconClick (index) {
        if (index === 2) {
          var time1 = this.loadingData.time1
          if (time1 != '') {
             let columns = [], data = []
             this.goName.forEach((list,index)=>{
               if(index===0){
                 columns.push({ title: '时间', key: 'date' })
               }else{
                  columns.push({ title: list, key: 'type'+index })
               }
             })
             this.goTableList.forEach((list,index)=>{
                 let obj = {}
                 columns.forEach((value,vIndex)=>{
                    if(vIndex===0){
                        obj[value.key] = list.name
                    }else{
                       obj[value.key]=  list.percentList[vIndex-1]
                    }
                  })
                  data.push(obj)
             })
            downloadEx(exportEx,'进店率TOP10排行分析',[columns,data])
          }
        } else {
          this.iconIndex = index
        }
      },
    }
  }
</script>
<style lang="less" scoped>
	.go-shop {
		width: 100%;
		height: auto;
		
		.go-shop-chart-list {
			background-color: #fff;
			box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
			border-radius: .5rem;
			position: relative;
			height: 470px;
			overflow: hidden;
			padding-bottom: 50px;
			margin-top: 20px;
			.noData {
				width: 100%;
				height: 100%;
				line-height: 100%;
				font-size: 24px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.go-shop-time-icon {
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				overflow: hidden;
				z-index: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 20px;
				font-size: 18px;
				
				.flex-center {
					margin-top: 20px;
					float: right;
					margin-right: 50px;
					
					span {
						
						cursor: pointer;
					}
					
					span + span {
						margin-left: 10px;
					}
				}
				
				span:nth-child(1) {
					font-size: 18px;
				}
			}
			
			.shop-line {
				margin-top: 50px;
			}
			
			.shop-line, .shop-table {
				transition: none !important;
				transform: translateY(100%);
			}
			
			.shop-table {
				height: 100%;
				box-shadow: none;
				overflow: auto;
			}
			
			.lineAction {
				transform: translateY(0%) !important;
			}
			
			.tableAction {
				transform: translateY(-100%) !important;
			}
		}
	}
</style>
