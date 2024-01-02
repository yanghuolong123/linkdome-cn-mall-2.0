<template>
	<div class="reportOneText" style="width: 1200px;height:1682px;">
		<div class="report-list" style=" padding-bottom: 110px;">
			<report-header></report-header>
			<report-title :title='title'></report-title>
			<div class="report-chart" style=" padding: 0 80px;
                  margin: 50px 0 30px 0;">
				<title-name :listTitle='listTitle'></title-name>
				<div class="report-heat-map"
						 style=" border: 4px dashed #4edbda;
                      border-radius: 8px;
                      margin-top: 12px;"

				>
					<div class="heatMap" ref="heatMap">
						<div class="colorNumber">
							<img :src="colorBar" alt="">
							<p>
								<span>{{maxValue}}</span>
							</p>

						</div>
						<!--热力分布图-->
						<heatmapjs-vue id="heat-grid" :max="maxValue" :min="minValue" :options='mapOptions' :data="heatMapDataList"></heatmapjs-vue>
						<img  @load="initChart" :src="mapUrl" v-if="mapUrl" id="mapImg"/>
						<div class="noData" v-else>{{ $t('holder.暂无数据') }}</div>
					</div>
				</div>
			</div>
			<report-remark v-if="isRemark" :dataList ='dataList.remarkData' ></report-remark>
			<report-flooter :size='page'></report-flooter>
		</div>
		<img :src="flooterBg" class="report-bg" alt="">
	</div>
</template>
<script>
  import reportHeader from '@/components/report-public/report_header'
  import reportTitle from '@/components/report-public/report_title'
  import reportRemark from '@/components/report-public/report_remark'
  import reportFlooter from '@/components/report-public/report_flooter'


  import titleName from '@/components/report-public/report_title_name'
  import Bus from '@/libs/bus.js'

  export default {
    name: 'report-week-one',
    props: {
      title: {
        type: String
      },
      dataList: {
        type: Object
      },
      page: {
        type: String
      },
      mapUrl: {
        type: String
      },
      listTitle: {
        type: Object
      },
      isRemark: {
        type: Boolean,
        default: true
      },
      chartHeight:{
        type:Number,
        default:0
      },
    },
    components: {
      reportHeader,
      reportTitle,
      reportRemark,
      reportFlooter,
      titleName,
    },
    data () {
      return {
        mapOptions: {
          gradient: {
            '.9': '#ec1313',
            '.8': '#e8585a',
            '.66': '#feb33d',
            '.5': '#86ef40',
            '.42': '#2bd9cf',
            '.28': '#33b3ed',
            '.15': '#7367f0'
          },
          radius: ''
        },
        heatMapDataList:[],
        maxValue: 0,
        minValue:0,
        colorBar: require('@/assets/images/fixation_img/rest/colorBar.png'),
        flooterBg: require('@/assets/images/fixation_img/bg/list_bg.png')
      }
    },
    watch:{
      clickData(){
        this.initChart()
      }
    },
    mounted () {
      Bus.$on('chartData', () => {
        this.initChart()
      })
    },
    methods: {
      initChart(){
        if(!this.$refs.heatMap) return
        const data = this.dataList.list
        const width = this.$refs.heatMap.offsetWidth
        const height = this.$refs.heatMap.offsetHeight
        if(data.length){
          this.maxValue = Math.max.apply(Math,data.map(item => {
            return item.enter_num
          }))
          let listData = data.map(o => {
            return {
              x: Math.round(width * o.x_num),
              y: Math.round(height * o.y_num),
              value: o.enter_num,
              radius: Number(width * 0.09)
            }
          })
          //排序后递减，以防热力不明显
          listData = listData.sort((a,b)=>{
            return Number(b.value)-Number(a.value)
          })
          if(listData.length * 20 < this.maxValue){
            listData.forEach((o,i)=>{
              o.value = this.maxValue - (i*20)
            })
          }else {
            listData.forEach((o,i)=>{
              o.value = listData.length * 20 - (i*20)
            })
          }
          this.minValue = listData[listData.length-1].value
          this.heatMapDataList = listData;
          if (!this.maxValue) this.heatMapDataList = []
        }else{
          this.maxValue = 0
          this.heatMapDataList = []
        }
      },
    }

  }
</script>
<style scoped lang="less">
	.report-chart {
		width: 100%;
		.report-heat-map{
			width: 100%;
			height: auto;
			.heatMap {
				position: relative;
				z-index: 1;
				.colorNumber{
					position: absolute;
					left: 0;
					top: 0;
					z-index: 10;
					overflow: hidden;
					img{
						display: block;
						width: auto;
						height: auto;
						float: left;
					}
					p{
						float: left;
						height: 130px;
						position: relative;
						margin-left: 5px;
						span{
							font-size: 14px;
							color: #fff;
							&:nth-child(2){
								position: absolute;
								left: 0;
								bottom: 0;
							}
						}
					}
				}
				#heat-grid{
					position: absolute!important;
					left: 0;
					bottom: 0;
					right: 0;
					top: 0;
					opacity: .8;
					z-index: 1;
					width: 100%;
					height: 100%;
					background-color:rgba(65,62,223,.4) ;
				}

				.noData {
					position: relative;
					left: 0;
					top: 0;
					width: 100%;
					height: 568px;
					line-height: 568px;
					font-size: 32px;
					background-color: #fff;
					z-index: 1;
					text-align: center;
				}


				#mapImg {
					width: 100%;
					height: 670px;
				}

				.gateDataList {
					position: absolute;
					z-index: 1;

					img {
						width: 30px;
						height: 30px;
						cursor: pointer;
					}

					.gateDataText {
						position: absolute;
						background-color: #fff;
						border-radius: 5px;
						box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
						padding-bottom: 10px;
						width: 160px;
						left: -65px;

						p {
							font-size: 14px;
							color: #333;
							line-height: 30px;
							background-color: rgba(0, 0, 0, .04);
							padding: 0 10px;
							height: 30px;
							width: 100%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						span {
							display: inline-block;
							width: 100%;
							font-size: 14px;
							margin-top: 5px;
							color: #333;
							padding: 0 10px;
						}
					}

				}
			}
		}
	}
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
