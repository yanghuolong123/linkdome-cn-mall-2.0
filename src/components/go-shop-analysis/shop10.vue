<template>
	<div class="go-shop">
		<div class="selector-container bg-white box-card">
			<div class="flex-center">
				<DatePicker
          class="w-select"
          type="daterange"
          v-model="crossDate"
          placement="bottom-end"
          :options="disabledDate"
          :placeholder="$t('选择日期')"
				></DatePicker>
				<vs-select
          class="w-select m-l-20"
          autocomplete
          v-model="activities"
          :placeholder="$t('选择业态')"
          style="width:14.375rem;">
					<vs-select-item
            :value="item.value"
            :text="item.text"
            :key="index"
            v-for="(item,index) in activitiesType"
					/>
				</vs-select>
				<Button size="large" class="m-l-20" type="primary" @click="paramsPrepare">{{ $t('查询') }}</Button>
				<Button size="large" class="m-l-20" @click="resetData">{{ $t('重置') }}</Button>
			</div>
		</div>
		<chart-box ref="top10" chartId="top10Chart" class="common-card chart m-t-20" @toolClick="top10ToolClick"
							 :chart="top10Chart" :toolList="top10ToolList"></chart-box>

	</div>
</template>
<script>
  import { activitiesList, goShopTen } from '@/api/analysis'
  import { disabledDate } from '@/libs/util.js'
  import moment from 'moment'
  import _ from 'lodash'
  import ChartBox from '_c/common/Chart-box'
  import { config as barConfig } from '@/config/echarts-config/bar-chart'
	import {mapState} from 'vuex'
  import NP from 'number-precision'
  export default {
    name: 'goShop',
    components: {
      ChartBox
    },
		computed:{
      ...mapState({
        headerData:state => state.home.headerData,
			})
		},
    data () {
      return {
        activities: 0,
        activitiesType: [],
        crossDate: [],
        disabledDate: '',
        top10ToolList:[
					{
            icon: '62',
            value: 'bar',
            name: '进店率TOP10排行分析'
					},{
            icon: 'biaoge-copy',
            value: 'table',
            name: '进店率TOP10排行分析'
          }, {
            icon: 'daoru',
            value: 'download',
            name: '进店率TOP10排行分析'
          }
				],
        top10Chart:{
          barChart: null,
				},
				top10Option:{
          barOption:null,
          tableOption:null
				}

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
    },
    methods: {
      // 获取业态
      activitiesDataList () {
        var that = this
        that.activitiesType = []
        var objD = {
          text: this.$t('所有业态'),
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
        var time1 = moment(this.crossDate[0]).format('YYYY-MM-DD') + ',' +
          moment(this.crossDate[1]).format('YYYY-MM-DD')
        var id = this.activities === 0 ? '' : this.activities
        let propertyId = this.$store.state.home.headerAction
        goShopTen({ time1: time1,  industry_id: id, property_id: propertyId }).then(res => {
          res = res.data.data;
					let options = {
            legend:{
              show:false,
						},
            xAxis: [],
            series: [],
					}
					const data = Object.values(res)[0]
					options.xAxis = data.map(o=>{
					  return o.name
					})
          data.forEach(o=>{
            if(o.to>o.from){
              o.from = o.to
						}
            o.value = NP.times(o.rate, 100)
            o.data = [ this.headerData.show_actual_val?NP.times(o.rate, 100)+`%(进店人次:${o.to},过店人次:${o.from})`:NP.times(o.rate, 100)+'%'];
					})
          options.series = [
						{
						  name:this.$t('进店率'),
							data:this.headerData.show_actual_val?data:data.map(o=>{return o.value})
						}
					]
          this.top10Option.barOption = this.setBarOption(options)
          this.top10Option.tableOption  = {
            legend:{
              data:options.xAxis
						},
            xAxis:{
              data:[time1.replace(',',' - ')]
						},
            series:data
					}
          this.top10ToolClick(this.$refs.top10.currentChart)

        })
      },
      setBarOption (options) {
        let barConfigCopy = _.cloneDeep(barConfig)
        const obj = {
          type: 'bar',
          barGap: '0%',
          barMaxWidth:80,
          itemStyle: {
            normal: {
              //柱形图圆角
              barBorderRadius: [80, 80, 0, 0],
            },
          },
        }
        let copyOption = _.cloneDeep(options)
        copyOption.series.forEach(o => {
          Object.assign(o, obj)
        })
        barConfigCopy.xAxis.data = copyOption.xAxis
        Object.assign(barConfigCopy.legend, copyOption.legend)
        barConfigCopy.series = copyOption.series
          barConfigCopy.tooltip.formatter = (params)=>{
            params = params[0]
            if(this.headerData.show_actual_val){
              if(params.data.to > params.data.from){//进店人数大于过点人数时，让他们相当 并等于更大的值
                params.data.from = params.data.to
              }
              return `${params.marker}${params.data.name}<br><span>${this.$t('进店率')}:${params.data.value}%</span><br><span style="line-height: 18px">进店人次: ${params.data.to}</span><br><span style="line-height: 18px">过店人次: ${params.data.from}</span>`
						}else {
              return `${params.name}<br>${params.marker}${this.$t('进店率')}:${params.data}%`
						}
          }

        return barConfigCopy
      },
      top10ToolClick(chartName){
        switch (chartName) {
          case 'table':
            this.$nextTick(() => {
              this.$refs.top10.initTable(this.top10Option.tableOption)
            })
            break

          case 'bar':
            this.$nextTick(() => {
              this.$refs.top10.initBarChart(this.top10Option.barOption)
            })
            break
        }
			},
      // 重置数据
      resetData () {
        var date = new Date()
        date = date.setDate(date.getDate() - 1)
        var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
        this.crossDate = dateTime
        this.activities = this.activitiesType[0].value
      },
    }
  }
</script>
<style lang="less" scoped>
	.go-shop {
		width: 100%;
		height: auto;
		.chart{
			height: 470px;
		}
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
