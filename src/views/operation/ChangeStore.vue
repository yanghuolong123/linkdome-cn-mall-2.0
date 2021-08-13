<!--调铺效果分析-->
<template>
	<div class="shop-portrait">
    <div class="selector-container common-card" style="margin-bottom:20px">
       <div class="flex-center">
         	维度:&nbsp;&nbsp;
          <Select v-model="type" @on-change="typeChange"  style="width:100px;" >
            <Option v-for="(item,index) in typeOptions"
                :value="item.value"
                :key="index">{{ item.name }}</Option>
          </Select>
          <Select v-model="entity"  style="width:150px;margin:0 20px;">
            <Option v-for="(item,index) in entityOpitons"
                :value="item.id"
                :key="index">{{ type==='store'?item.shop_name:item.location_name }}</Option>
          </Select>
          调铺时间:&nbsp;&nbsp;
          <Select v-model="currentDate" @on-change="dateChange"  style="width:200px;margin:0 20px;" >
            <Option v-for="(item,index) in dateOptions"
                :value="item.location_change_time"
                :key="index">{{ item.location_change_time }}</Option>
          </Select> 
        </div>   
    </div>
		<div class="box-card bg-white flex-box">
			<div class="card" >
				<span class="flex-box"><span class="color" style="background-color: #009FE9"></span> 调铺前{{displayName}}</span>
				<div class="flex-box entity-info" v-if="cardList[1]" >
					<span>{{cardList[1]&&cardList[1].name}}</span>
					<span v-if="type!=='store'">开业时间点:{{cardList[1].openDate}}</span>
				</div>
				<span>调铺前数据指标时间段</span>
				<DatePicker v-if="cardList[1]"
						:options="dateRangeBefore"
						:value="cardList[1]&&cardList[1].timeRange"
						@on-change="(val)=>{timeRangeChange(1,val)}"
						type="daterange"
						style="width: 200px"></DatePicker>

			</div>
			<div class="card">
				<span class="flex-box"><span class="color" style="background-color: #2BD9CF"></span> 调铺后{{displayName}}</span>
				<div class="flex-box entity-info" v-if="cardList[0]">
					<span>{{cardList[0]&&cardList[0].name}}</span>
					<span v-if="type!=='store'">开业时间点:{{cardList[0].openDate}}</span>
				</div>
				<span>调铺后数据指标时间段</span>
				<DatePicker v-if="cardList[0]" :value="cardList[0]&&cardList[0].timeRange"
							:options="dateRangeAfter"
							@on-change="(val)=>{timeRangeChange(0,val)}"
							type="daterange" style="width: 200px"></DatePicker>
			</div>
      <Select v-model="saleMultipleSelected" :max-tag-count="1" multiple style="width:220px">
				<Option v-for="(item,index) in radarOptions"
						:value="item.value"
						:key="index">{{ item.name }}</Option>
			</Select>
      <Button size="large" type="primary" class="m-l-20"  @click="handleSearch" >{{ $t('查询') }}</Button>
		</div>
		<div class="box-card bg-white detail" v-if="showCharts">
			<div class="chart-box">
				<vue-apex-charts
						ref="radarChart"
						type="radar"
						height="480"
						class="apex-chart"
						:options="radarChart.chartOptions"
						:series="radarChart.series"
				/>
			</div>
			<div class="chart-box">
				<vs-select autocomplete
						   @change="formatSaleLineChartData(saleLineOriginData)"
						   v-model="saleSelected">
					<vs-select-item :value="item.value" :text="$t(item.name)" :key="index"
									v-for="(item,index) in saleOptions"/>
				</vs-select>
				<vue-apex-charts
						type="line"
						height="400"
						ref="lineChart"
						class="apex-chart"
						:options="lineOptions"
						:series="lineSeries"
				>
				</vue-apex-charts>
			</div>

		</div>
	</div>
</template>
<script>
import Moment from 'moment'
import {
  getPositonOpiton,
  getStoreOpiton,
  getShopChange,
  getShopChangeSaleTrend,
  getShopChangeByPosition
} from '@/api/operate'
import VueApexCharts from 'vue-apexcharts'

const colorList = ['#2BD9CF', '#009FE9']
export default {
  name: 'ChangeStore',
  data () {
    return {
      size:0,
      showCharts: false,
      entity: '',
      entityOpitons: [],
      currentDate: '',
      dateOptions: [],
      radarOriginData: [],
      saleLineOriginData: {}, // 临时存储所有指标的销售折线数据
      cardList: [
        {
          timeRange: []
        }, {
          timeRange: []
        }
      ],
      type: 'store',
      typeOptions: [
        {
          name: '店铺',
          value: 'store'
        }, {
          name: '位置',
          value: 'positon'
        }
      ],
      radarChart: {
        chartOptions: {
          chart: {
            toolbar: { show: false }
          },
          colors: colorList,
          legend: {
            show: false
          },
          plotOptions: {
            radar: {
              polygons: {
                strokeColors: '#e9e9e9',
                fill: {
                  colors: ['#f8f8f8', '#fff']
                }
              }
            }
          },
          tooltip: {
            
            y: {
              formatter: function (val, params) {
                return val
              }
            }
          },
          yaxis: {
            tickAmount: 5,
            max: 100,
            labels: {
              formatter: function (val, i) {
                return Math.round(val)
              },
            },
          },
          xaxis: {
            categories: []
          }
        },
        series: [{
          name: '',
          data: [0, 0, 0, 0, 0]
        }]
      },
      displayName: '位置',
      dateRangeBefore: {
        disabledDate (date) {

        }
      },
      dateRangeAfter: {
        disabledDate (date) {

        }
      },
      lineOptions: {
        xaxis: {
          categories: []
        },
        yaxis: [
          {
            title: {
              style: {
                fontSize: '13px'
              }
            },
            min: 0
          }
        ],
        chart: {
          toolbar: {
            show: false
          },
          fontFamily: 'source_han_sans_cn',
          zoom: {
            enabled: false
          }
        },
        noData: {
          text: '暂无数据',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: '14px'
          }
        },
        tooltip: {
          y: {
          },
          shared: true
        },
        stroke: {
          curve: 'straight',
          width: 2
        },
        colors: ['#00A0E9', 'rgb(231, 88, 91)', '#94e2ff', '#fbab40', '#8d82f0'],
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 5,
          hover: {
            sizeOffset: 2
          }
        }
      },
      lineSeries: [],
      saleSelected: '',
      saleMultipleSelected: [],
      radarOptions: [
        {
          name: '租金坪效',
          value: 'SquaerMetre',
          unit: '元/m²'
        }, {
          name: '销售额',
          value: 'SaleAmount',
          unit: '元'
        }, {
          name: '停留时间',
          value: 'Dwell',
          unit: 'min'
        }, {
          name: '成交率',
          value: 'CloseRate',
          unit: '%'
        }, {
          name: '客流量',
          value: 'Enter',
          unit: '人次'
        }
      ]
    }
  },
  components: {
    VueApexCharts
  },
  computed: {
    currentEntityInfo () {
      return this.entityOpitons.find(o => {
        return this.entity === o.id
      })
    },
    saleOptions () {
      return this.radarOptions.filter(o => {
        return this.saleMultipleSelected.includes(o.value)
      })
    },
	  currentSingleSale () {
      return this.saleOptions.find(o => {
        return o.value === this.saleSelected
      }) || {}
	  }
  },
  watch:{
    entity(){
      if (this.currentEntityInfo && this.currentEntityInfo.bzInfo) {
        this.dateOptions = this.currentEntityInfo.bzInfo
        this.currentDate = this.dateOptions[0].location_change_time
      }
      if (this.type === 'store') {
        this.getShopChangeByStore(this.entity)
      } else {
        this.getShopChangeByPosition(this.entity)
      }
    }
  },
  activated () {
    // this.showCharts = false
    // setTimeout(() => {
    //   this.showCharts = true
    // })
  },
  mounted(){
  },
  methods: {
    timeRangeChange (index, val) {
      this.$set(this.cardList[index], 'timeRange', val)
    },
    dateChange (val) {
      this.dateRangeBefore = {
        disabledDate (date) {
          return Moment(date).isAfter(Moment(val))
        }
      }
      this.dateRangeAfter = {
        disabledDate (date) {
          return Moment(date).isBefore(Moment(val))
        }
      }
      if (this.cardList.length != 0) {
        this.cardList[0].timeRange = [val, Moment(val).add(7, 'day').format('YYYY-MM-DD')]
        this.cardList[1].timeRange = [Moment(this.currentDate).add(-7, 'day').format('YYYY-MM-DD'), val]
      }
    },
    typeChange (e) {
      if (e === 'store') {
        this.getStoreOpitons()
      } else {
        this.getPositionOpitons()
      }
    },
    handleSearch () {
      this.saleSelected = this.saleOptions[0].value
      const radar = this.radarOptions.filter(o => {
        return this.saleMultipleSelected.includes(o.value)
      })
      const categories = radar.map(o => {
        return o.name
      })
      this.radarChart.series = []
      this.radarChart.chartOptions.xaxis.categories = categories
      if( this.$refs.radarChart){
        this.$refs.radarChart.updateOptions({
          xaxis: {
              categories
          }
        })
      }
      this.radarOriginData.forEach(o => {
        this.radarChart.series.push({
          name: this.type === 'store' ? o.location_name : o.shop_name,
          data: this.saleMultipleSelected.map(selected => {
            return o[selected]
          })
        })
      })
      if (!this.cardList[1] || !this.cardList[0]) {
         this.$alert({
              content:'没有调式的店铺请重新选择'
          })
        return false
      }
      // 折线图数据
      let reqList = []
      this.saleMultipleSelected.forEach(type => {
        const data = {
          type,
          bzid: `${this.cardList[1].bzid},${this.cardList[0].bzid}`,
          date1: this.cardList[1].timeRange.toString(),
          date2: this.cardList[0].timeRange.toString()
        }
        reqList.push(getShopChangeSaleTrend(data))
      })
      this.showCharts = false
      Promise.all(reqList).then(res => {
        let result = {}
        res.forEach((o, i) => {
          result[this.saleMultipleSelected[i]] = o.data.data
        })
        this.size = 1
        this.saleLineOriginData = result
        this.formatSaleLineChartData(result)
      })
    },
    formatSaleLineChartData (data) {
      if (!Object.keys(data).length) return
      this.showCharts = true
      const targetData = data[this.saleSelected]
      this.lineOptions.xaxis.categories = []
      const saleSelectedName = this.currentSingleSale.name
      let seriesData1 = {
        name: `${this.cardList[1].name} | ${this.cardList[1].timeRange[0]}- ${this.cardList[1].timeRange[1]} | ${saleSelectedName}`,
        key: 'bzid1',
        data: []
      }
      let seriesData2 = {
        name: `${this.cardList[0].name} | ${this.cardList[0].timeRange[0]}- ${this.cardList[0].timeRange[1]} | ${saleSelectedName}`,
        key: 'bzid2',
        data: []
      }
      this.lineSeries = [seriesData1, seriesData2]
      targetData.forEach((o, i) => {
        this.lineOptions.xaxis.categories.push(`第${i + 1}天`)
        _.forIn(o, (val, key) => {
            this.lineSeries.find(l => {
              return l.key === key
            }).data.push(this.currentSingleSale.value === 'Dwell' ? (val[this.saleSelected] / 60).toFixed(1) : val[this.saleSelected])
        })
      })
      setTimeout(() => {
        if(this.$refs.lineChart){
          this.$refs.lineChart.updateOptions({
              xaxis: {
                categories: this.lineOptions.xaxis.categories
              },
              tooltip: {
                y: {
                  formatter: (val) => {
                    if (!val && val != 0) return ''
                    return Number(val).toLocaleString() + this.currentSingleSale.unit
                  }
                }
              }
            })
          }
      });
    },
    getStoreOpitons () {
      return new Promise((resolve, reject) => {
        getStoreOpiton().then(res => {
          this.entityOpitons = res.data.data || []
          this.entity = res.data.data[0].id
          resolve(this.entity)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getPositionOpitons () {
      getPositonOpiton().then(res => {
        this.entityOpitons = res.data.data || []
        this.entity = res.data.data[0].id
      })
    },
    handleResult (data) {
      this.radarOriginData = data || []
      this.cardList = []
      this.series = []
      this.displayName = this.type === 'store' ? '位置' : '店铺'
      if (data) {
        data.forEach((o, i) => {
          const timeRange = [i ? Moment(this.currentDate).add(-7, 'day').format('YYYY-MM-DD') : this.currentDate, i ? this.currentDate : Moment(this.currentDate).add(7, 'day').format('YYYY-MM-DD')]
          this.cardList.push({
            name: this.type === 'store' ? o.location_name : o.shop_name,
            shopIndex: o.index,
            openDate: o.open_date || '',
            timeRange,
            bzid: o.bzid
          })
        })
      }
    },
    getShopChangeByStore (id) {
      getShopChange(id).then(res => {
        this.handleResult(res.data.data[this.currentDate])
        if(this.size ===0) this.handleSearch()
      })
    },
    getShopChangeByPosition (id) {
      getShopChangeByPosition(id).then(res => {
        this.handleResult(res.data.data[this.currentDate])
      })
    }
  },

  created () {
    this.getStoreOpitons().then(id => {
      this.getShopChangeByStore(id)
    })
	  // 雷达图默认全选
    this.saleMultipleSelected = this.radarOptions.map(o => {
      return o.value
    })
  }
}
</script>
<style lang="less" scoped>
	.flex-box {
		display: flex;
		align-items: center;
	}

	.switch-date {
		width: 120px;
	}

	.switch-date /deep/ .vs-select--input {
		border: 0;
		padding: 0 10px;

	}

	.shop-portrait {
		.box-card {
			display: flex;
			padding: 18px 30px;

			.selects {
				margin-right: 20px;
			}

			.handleSearch {
				height: 42px;
			}

			.date-picker {
				margin-right: 30px;

				/deep/ .ivu-input {
					width: 230px;
					height: 43px;
					font-size: 14px;
					border: 1px solid rgba(0, 0, 0, .2);
				}

				/deep/ .ivu-input-suffix {
					i {
						height: 43px;
						line-height: 43px;
					}
				}
			}

			&.bar-chart {
				margin-top: 20px;
				display: flex;
				flex-direction: column;
				align-items: center;

			}

			.card {
				display: flex;
				font-size: 14px;
				flex-direction: column;
				border-radius: 6px;
				box-shadow: 0px 0px 6px 0px rgba(120, 119, 117, 0.3);
				padding: 15px 20px;

				.entity-info {
					span:nth-child(1) {
						font-size: 17px;
						font-weight: bolder;
					}

					span:nth-child(2) {
						margin-left: 10px;
					}
				}

				.color {
					width: 10px;
					height: 10px;
					background-color: red;
					border-radius: 2px;
					margin: 0 5px;
				}

				> * + * {
					margin-top: 8px;
				}

			}

			.card {
				margin-right: 10px;
			}
		}

		.box-card + .box-card {
			margin-top: 20px;
		}

		.detail {
			display: flex;
			flex-direction: column;

			.chart-box {
				display: flex;
				flex-direction: column;
				margin-top: 30px;

				.apex-chart {
					width: 100%;
				}
			}

			.chart-box + .chart-box {
				align-items: flex-end;
			}

			.title {
				font-size: 16px;
			}
		}

	}

</style>
