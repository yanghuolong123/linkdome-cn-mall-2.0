<template>
	<div class="mt-6 ranking-box">
		<div class="box-card bg-white">
			<chart-tabs :title="chartTitle[0]" :xAxis="barData.xAxis" :series="barData.series" :type="['bar']"
									horizonta></chart-tabs>
		</div>
		<div class="box-card bg-white">
			<div class="pieTitle">{{$t(chartTitle[1])}}</div>
			<div class="pieNoData" v-if="isNodata"></div>
			<vue-apex-charts
				ref='pieCharts'
				width='100%'
				height='400'
				type='pie'
				:options="pieOption"
				:series="pieData.series"
			></vue-apex-charts>
		</div>
	</div>
</template>
<script>
  import chartTabs from '_c/common/ChartTabs.vue'

  import VueApexCharts from 'vue-apexcharts'
  import _ from 'lodash'
  import NP from 'number-precision'

  let pieOption = {
    chart: {
      type: 'pie'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        // 判断是否是最后一个数据
        if (opt.seriesIndex == opt.w.globals.seriesPercent.length - 1) {
          let newData = []
          // 所有数据组成新的数据统一保留两位小数进行计算
          opt.w.globals.seriesPercent.map(item => {
            newData.push(Number(item[0].toFixed(2)))
          })
          // 除去数组中最后一个数据外的和保留两位小数
          let newTotal = Number(_.sum(_.initial(newData)).toFixed(2))
          // 计算出最后一个值
          let size = NP.minus(100, newTotal)
          return size + '%'
        } else {
          return val.toFixed(2) + '%'
        }
      }
    },
    labels: [],
    legend: {
      position: 'left',
      show: false
    },
    tooltip: {
      followCursor: true,
      y: {
        formatter: function (val) {
          return Number(val).toLocaleString()
        }
      }
    }
  }
  export default {
    name: 'home_ranking',
    components: {
      chartTabs,
      VueApexCharts
    },
    props: {
      barData: {
        type: Object,
        default: () => {
        }
      },
      pieData: {
        type: Object,
        default: () => {
        }
      },
      chartTitle: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {

        isNodata: false,
      }
    },

    watch: {

      propertyId (newval, oldval) {
      
      },

    },
    computed: {
      pieOption () {
        pieOption.labels = this.pieData.labels
        return pieOption
      },
    },
    methods: {

      handleCompareRes () {
        this.isNodata = Boolean(!_.sum(this.pieData.series))
        this.pieOption.legend.show = true
        this.$refs.pieCharts.updateOptions(this.pieOption)
      }
    }
  }
</script>
<style lang="less" scoped>
	.pieTitle {
		line-height: 30px;
		font-size: 18px;
		color: #3e3c3c;
		padding: 27px 0 18px 19px;
	}
	
	.pieNoData {
		width: 226px;
		height: 226px;
		background-color: rgba(235, 235, 235, .85);
		border-radius: 50%;
		position: absolute;
		left: 40%;
		top: 19%;
		z-index: 10;
	}
	
	.ranking-box {
		::v-deep .apexcharts-legend-series {
			margin-top: 10px !important;
		}
	}
</style>
<style lang="stylus" scoped>
	.ranking-box
		width 100%
		display grid
		grid-template-columns repeat(2, minmax(0, 1fr))
		grid-auto-rows auto
		grid-gap 20px
	
	// @media (max-width:768px) {
	//   grid-template-columns repeat(1,minmax(0,1fr))
	// }
</style>
