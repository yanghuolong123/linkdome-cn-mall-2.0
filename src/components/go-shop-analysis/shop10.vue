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
						placeholder="选择业态"
						style="width:14.375rem;"
				>
					<vs-select-item
							:value="item.value"
							:text="item.text"
							:key="index"
							v-for="(item,index) in activitiesType"
					/>
				</vs-select>
				<Button size="large" class="m-l-20" type="primary" @click="paramsPrepare">查询</Button>
				<Button size="large" class="m-l-20" @click="resetData">重置</Button>
			
			</div>
		</div>
		<div class="go-shop-chart-list">
			<div class="go-shop-time-icon">
				<span>进店率TOP10排行分析</span>
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
					type="bar"
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
        isList: false,
        isData: true,
        activities: 0,
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
              toolbar: {
                show: false,
                tools: {
                  download: false
                }
              },
              events: {}
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '45%',
                endingShape: 'rounded'
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
              categories: []
            },
            yaxis: {
              title: {
                text: '百分比（%）'
              },
              labels: {
                show: true,
                formatter: (value) => {
                  return parseInt(value) + '%'
                }
              }
            },
            fill: {
              opacity: 1

            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val + '%'
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
        var objD = {
          text: '所有业态',
          value: 0
        }
        that.activitiesType.push(objD)
        let propertyId = this.$store.state.home.headerAction
        activitiesList({ entity: 52, property_id: propertyId }).then(res => {
          _.forIn(res.data.data, function (val, key) {
            var obj = {}
            obj.text = val
            obj.value = key
            that.activitiesType.push(obj)
          })
          this.paramsPrepare()
        })
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
        goShopTen({ time1: time1, time2: time2, industry_id: id, property_id: propertyId }).then(res => {
          that.isList = true
          that.graphData.chartOptions.xaxis.categories = []
          that.graphData.series = []
          that.goTableList = []
          that.isData = false
          that.goName = []
          let sortarr = []
          that.goName.push('时间')
          var data = res.data.data
          var name = Object.keys(data)
          name.forEach(e => {
            let keyVal = Object.entries(data[e])
            let sortedData = keyVal.sort((a, b) => b[1] - a[1])
            sortarr.push(sortedData)
          })
          sortarr[0].map(function (d) {
            that.graphData.chartOptions.xaxis.categories.push(d[0])
            that.goName.push(d[0]+' ( % ) ')
          })

          sortarr.map(function (list, index) {
            var obj = {}
            obj.name = name[index].replace(/,/g, ' - ')
            obj.data = []

            var tableObj = {}
            let newTime = name[index].replace(/,/g, ' - ').split(' - ')
            if(newTime[0]===newTime[1]){
              tableObj.name = newTime[0]
            }else{
              tableObj.name = name[index].replace(/,/g, ' - ')
            }
            tableObj.percentList = []

            list.map(function (v) {
              obj.data.push(NP.times(v[1], 100))
              v[1] === 0 ? tableObj.percentList.push('0') : tableObj.percentList.push(NP.times(v[1], 100))
            })
            that.graphData.series.push(obj)
            that.goTableList.push(tableObj)
          })
          if (that.$refs.graphLine) {
            that.$refs.graphLine.updateOptions({
              xaxis: { categories: that.graphData.chartOptions.xaxis.categories }
            })
            if (that.graphData.chartOptions.xaxis.categories.length < 2) {
              that.graphData.chartOptions.plotOptions.bar.columnWidth = '10%'
            } else if (that.graphData.chartOptions.xaxis.categories.length < 5) {
              that.graphData.chartOptions.plotOptions.bar.columnWidth = '25%'
            } else if (that.graphData.chartOptions.xaxis.categories.length < 10) {
              that.graphData.chartOptions.plotOptions.bar.columnWidth = '55%'
            } else if (that.graphData.chartOptions.xaxis.categories.length < 15) {
              that.graphData.chartOptions.plotOptions.bar.columnWidth = '65%'
            } else {
              that.graphData.chartOptions.plotOptions.bar.columnWidth = '80%'
            }
            that.$refs.graphLine.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
          }
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
