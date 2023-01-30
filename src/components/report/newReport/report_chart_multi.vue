
<template>
	<div class="reportOneText" style="
      width: 1200px;
      height: 1682px;"
	>
		<div class="report-list" style="padding-bottom: 150px;">
			<report-header></report-header>
			<report-title :title='title'></report-title>
			<div class="chart-center" style="padding:  0 80px;" >
				<title-name :listTitle='listTitle'></title-name>
				<Row :gutter="20" >
					<Col :span="item.span" :key="index" v-for="(item,index) in dataList">
						<div class="report-chart-list" style="
                          margin-top: 12px;
                          border: 4px dashed #4edbda;
                          border-radius:8px;"
								 :style="{height:item.height+'px'}" v-if="isChart" >
							<vue-highcharts
								style="width: 100%;height:100%;"
								:options="item.option"
							></vue-highcharts>
						</div>
					</Col>
				</Row>
			</div>
			<report-flooter :size='page'></report-flooter>
		</div>
		<img :src="flooterBg" class="report-bg" alt="">
	</div>
</template>
<script>
  import reportHeader from '@/components/report-public/report_header'
  import reportTitle from '@/components/report-public/report_title'
  import titleName from '@/components/report-public/report_title_name'
  import reportFlooter from '@/components/report-public/report_flooter'
  import VueHighcharts from 'vue2-highcharts'
  import Bus from '@/libs/bus.js'

  export default {
    name: 'report-month-chart-multi',
    props: {
      title: {
        type: String
      },
      dataList: {
        type: Array
      },
      page: {
        type: String
      },
      listTitle: {
        type: Object
      },
      stacking: {
        type: String,
        default: null
      }
    },
    components: {
      reportHeader,
      reportTitle,
      titleName,
      reportFlooter,
      VueHighcharts
    },
    data () {
      return {
        isChart: true,
        flooterBg: require('@/assets/images/fixation_img/bg/list_bg.png')
      }
    },
    mounted () {
      Bus.$on('chartData', () => {
        this.chartDataList()
      })
    },
    methods: {
      chartDataList () {
        this.isChart = false
        this.$nextTick(() => {
          this.isChart = true
        })
      }
    },

  }
</script>
<style lang="less">
	.highcharts-axis-labels{
		span{
			display: inline-block;
			max-width: 80px;
			overflow: hidden;
			text-overflow:ellipsis!important;
			white-space: nowrap;
		}
	}
</style>
<style scoped lang="less">
	.reportOneText {
		display: inline-block;
		overflow: hidden;
		background-color: #eff5fa;
		position: relative;
		.report-list{
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			.chart-center{
				.report-chart-list{
					background-color: #fff;
				}
			}
		}
		.report-bg{
			display: block;
			width: 100%;
			height: auto;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
</style>
