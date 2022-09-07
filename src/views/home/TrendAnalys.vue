<template>
	<div>
		<Chart-box class="common-card trend-chart"
							 :chart="trendChart"
							 ref="trendChart"
							 :weathers="weathers"
							 :showSummary="true"
							 @toolClick="updateChart"
							 :toolList="toolList" chartId="trend">
			<div class="flex-center quota">
				<span class="quota-label">{{ $t('fx.Data_indicators') }}</span>
				<el-select
					v-model="curretIndicator"
					multiple
					:multiple-limit="2"
					@change="indicatorChange"
				>
					<el-option
						v-for="item in indicatorList"
						:value="item.value"
						:label="$t(item.name)"
						:key="item.value"
					>{{ $t(item.name) }}
					</el-option
					>
				</el-select>
			</div>
		</Chart-box>
	</div>
</template>
<script>
  import { weatherTrend } from '@/api/entityNew'
  import ChartBox from '@/components/common/Chart-box'
  import config from '@/config/index'
  import { getSalesTrend } from '@/api/home'
  import { getFootfallTrend } from '@/api/passenger'
  import salesDict from './components/salesIndicatorDict'
  import { config as barConfig } from '@/config/echarts-config/bar-chart'
  import { config as lineConfig } from '@/config/echarts-config/line-chart'
  import { mapState } from 'vuex'
  import NP from 'number-precision'

  export default {
    name: 'TrendAnalys',
    props: {
      innerRange: {
        type: String,
        default: '1h',
      },
      indicatorData: {
        type: Object,
        default: () => salesDict,
      },
      date: {
        type: String,
        default: '',
      },
    },
    components: {
      ChartBox
    },
    data () {
      return {
        curretIndicator: ['enter'],
        trendChart: {
          barChart: null,
          lineChart: null,
        },
        responseData: {},
        currentChartType: 'line',
        options: {},
        weathers: [],
      }
    },
    computed: {
      ...mapState({
        propertyId: (state) => state.home.headerAction,
      }),
      toolList () {
        const nameArr = ['购物中心趋势分析', '购物中心趋势分析', '详细数据', '购物中心趋势分析']
        let tools = _.cloneDeep(config.toolList)
        tools.forEach((o, i) => {
          o.name = nameArr[i]
        })
        return tools
      },
      indicatorSource () {
        return {
          enter: {
            name: this.$t('客流量'),
            unit: '（人次）',
            yaxis: {
              title: {
                text: `${this.$t('客流量')}(${this.$t('人次')})`,
              },
              labels: {
                formatter (value) {
                  return value ? value.toLocaleString() : ''
                },
              },
            },
          },
          ...salesDict
        }
      },
      indicatorList () {
        return Object.keys(this.indicatorSource).map(o => {
          return {
            name: this.indicatorSource[o].name,
            value: o
          }
        })
      },
      convertInnerRange () {
        // 由于之前的innerrang 约定为 1hour 1day 1month ,新的innerrang 约定为 Hour Date Month,需要抓换
        if (this.innerRange === '1h') return 'Hour'
        if (this.innerRange === '1day') return 'Date'
        if (this.innerRange === '1month') return 'Month'
      },
    },
    methods: {
      async indicatorChange(val){
        if(val.length>1 && val.includes('enter')){
          await weatherTrend({
            time1: this.date,
            property_id: this.propertyId,
            type: 0,
          }).then(weather => {
            weather = weather.data.data
            this.weathers = weather ? Object.values(weather)[0][0].list : [];
            this.updateChart()
          })
				}
        if(val.length ===1 && val.includes('enter')){
          this.getTrendData()
				}
        this.updateChart()
			},
       updateChart (type = this.currentChartType) {
        this.currentChartType = type
        let opt
        if (type === 'line') {
          opt = _.cloneDeep(lineConfig)
          delete opt.dataZoom
        } else {
          opt = _.cloneDeep(barConfig)
        }
        let category = [], legend = [], series = [], yAxis = [], unit = [];
        this.curretIndicator.forEach((o, i) => {
          legend.push(this.indicatorSource[o].name)
          unit.push(this.indicatorSource[o].unit)
          if (!category.length) {
            //双指标时，客流接口返回hour数据，销售接口返回date数据，所以这里统一处理成date
            if (o === 'enter' && this.curretIndicator.length > 1) {
              category = []
            } else {
              if (o === 'enter' && this.curretIndicator.length === 1 && this.convertInnerRange === 'Hour') {
                category = Object.keys(this.responseData[o]).map(cate => {
                  return cate.substring(11, 16)
                })
              } else {
                category = Object.keys(this.responseData[o])
              }
            }
          }
        //双Y轴
          if (this.curretIndicator.length > 1) {
            const obj = {
              type: 'value',
              nameLocation: 'middle',
              nameGap: 50,
              name: this.indicatorSource[o].yaxis.title.text,
              min: 0,
              splitLine: {
                show: true
              },
              axisLabel: {
                show: true,
                formatter: (val) => {
                  return val > 999 ? (val / 1000).toFix(1) + 'k' : val
                }
              }
            }
            if (i > 0) {
              obj.max = Math.max(...Object.values(this.responseData[o]))
              obj.splitLine.show = false
            }
            yAxis.push(obj)
          }
          //单天多指标时，按date显示，客流需要累加
          if (this.convertInnerRange === 'Hour' && o === 'enter' && this.curretIndicator.length > 1) {
            series.push({
              name: this.indicatorSource[o].name,
              type,
              data: [_.sum(Object.values(this.responseData[o]))]
            })
          } else {
            series.push({
              name: this.indicatorSource[o].name,
              type,
              data: Object.values(this.responseData[o])
            })
          }

        })
        if (yAxis.length) {
          opt.yAxis = yAxis
        }
        opt.xAxis.data = category
        opt.legend.data = legend
        opt.legend.unit = unit
        opt.series = series
        if (type === 'table') {
          opt.xAxis.axisLabel = {
            show: false
          }
        }
        opt.tooltip.formatter = params => {
          const title = params[0].axisValueLabel + "<br>";
          let result = "";
          params.forEach((o,i) => {
            result +=
              o.marker +
              o.seriesName +
              "：" +
              o.value.toLocaleString() +
              unit[i].replace('（','').replace('）','') +
              "<br>";
          });
          return title + result
        }
        this.options = opt

        switch (type) {
          case 'table':
            this.$nextTick(() => {
              this.$refs.trendChart.initTable(this.options)
            })
            break
          case 'line':
            this.$nextTick(() => {
              this.updateLineChart()
            })
            break
          case 'bar':
            this.$nextTick(() => {
              this.updateBarChart()
            })
            break
        }
      },
      async getTrendData () {
        const reqs = Object.keys(this.indicatorSource).map(o => {
          const params = {
            time1: this.date,
            type: o,
            property_id: this.propertyId,
            range: this.convertInnerRange,
          }
          if (['enter', 'occupancy'].includes(o)) {
            return getFootfallTrend(params)
          } else {
            if (this.convertInnerRange === 'Hour') params.range = 'Date' // 销售数据 innerrange 没有Hour
            return getSalesTrend(params)
          }
        })
        await weatherTrend({
          time1: this.date,
          property_id: this.propertyId,
          type: (this.convertInnerRange === 'Hour' && this.curretIndicator.length===1)? 1 : 0,
        }).then(weather => {
          weather = weather.data.data
          this.weathers = weather ? Object.values(weather)[0][0].list : []
        })
        Promise.all(reqs).then(res => {
          Object.keys(this.indicatorSource).forEach((o, i) => {
            const {
              data: { data: indicatorRes },
            } = res[i]
            if (o === 'CloseRate') {
              for (let key in indicatorRes[this.date]) {
                indicatorRes[this.date][key] = NP.times(indicatorRes[this.date][key], 100)
              }
            }
            this.responseData[o] = indicatorRes[this.date]
          })
          this.updateChart()
        })
      },
      updateLineChart () {
        const that = this
        if (this.curretIndicator.includes('enter')) {
          this.options.xAxis.axisLabel = {
            show: true,
            formatter: (value, i) => {
              let weather
              if (that.weathers[i].type === 1) {
                weather = that.weathers[i].temperature + '℃'
              } else {
                weather = `${that.weathers[i].low_temperature}℃ - ${that.weathers[i].high_temperature}℃`
              }
              return value + '\n' + '{style' + i + '| }\n' + weather
            },
            rich: {}
          }
          this.options.xAxis.data.forEach((o, i) => {
            this.options.xAxis.axisLabel.rich[`style${i}`] = {
              width: 30,
              height: 30,
              backgroundColor: {
                image: that.weathers[i].weather_icon
              }
            }
          })
        }
        this.$refs.trendChart.initLineChart(_.cloneDeep(this.options))
      },
      updateBarChart () {
        const xLen = this.options.xAxis.data.length
        this.options.series.forEach(o => {
          o.barWidth = xLen > 2 ? '30%' : '150'
          o.itemStyle = {
            normal: {
              //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
              barBorderRadius: [80, 80, 0, 0]
            }
          }
        })
        this.$refs.trendChart.initBarChart(this.options)
      },

    },
    watch: {
      propertyId:{
        immediate: true,
        handler: function(val, oldVal) {
          if (val) this.getTrendData();
        },
			},
      date: {
        immediate: true,
        handler () {
          this.getTrendData()
        },
      }
    },
    mounted () {
    }
  }
</script>
<style scoped lang="less">
	.trend-chart {
		height: 540px;
	}
	
	.quota {
		font-size: 14px;
		margin-right: 50px;
		word-break: keep-all;
		white-space: nowrap;
		
		.quota-label {
			margin-right: 20px;
		}
	}
</style>
