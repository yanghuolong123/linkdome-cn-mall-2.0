
<template>
	<div class="enter-list" style="padding: 0 80px;
		margin-top: 8px;
		margin-bottom: 30px;">
		<title-name :listTitle='listTitle'></title-name>
		<div class="list-text" style="margin-top: 16px;" v-if="data">
			<div class="text-left" style="	height: 260px;
				border: 3px dashed #7ecef4;
				border-radius: 8px;
				padding:48px 0;">
				<div class="left-tetx">
					<div class="left-icon" style="	width: 90px;
						height: 90px;
						border-radius: 12px;">
						<img style="		width: 50px;
							margin: 20px;" :src="enterIcon" alt="">
					</div>

					<h4 style="font-size: 28px;
						margin-top: 14px;">累计客流</h4>
					<p style="	font-size: 26px;">{{data.enter}}</p>
					<!-- <div class="left-gender">
						<span>男性:70%</span>
						<span>女性:30%</span>
					</div> -->
				</div>
			</div>
			<div class="text-right" style="	height:260px;
				border: 3px dashed #7ecef4;
				border-radius: 8px;
				padding: 22px;">
				<div class="right-top">
					<div class="right-top-icon" style="width: 90px;
						height: 90px;
							border-radius: 12px;">
						<img style="margin: 20px;
							width: 50px;
							height: 50px;" :src="peakIcon" alt="">
					</div>
					<div class="right-top-number" style="	margin-left: 18px;">
						<h4 style="	font-size: 28px;">客流峰值</h4>
						<p style="font-size: 26px;">{{data.enterPeak}}</p>
						<span style="font-size: 16px;">{{data.enterTime}}</span>
					</div>
					<div class="right-top-icon" style="margin-left:10%;width: 90px;
						height: 90px;
							border-radius: 12px;">
						<img style="margin: 20px;
							width: 50px;
							height: 50px;" :src="flowIcon" alt="">
					</div>
					<div class="right-top-number" style="	margin-left: 18px;">
						<h4 style="	font-size: 28px;">集客量峰值</h4>
						<p style="font-size: 26px;">{{data.occupancyPeak}}</p>
						<span style="font-size: 16px;">{{data.occupancyTime}}</span>
					</div>
				</div>
				<div class="right-line" style="	margin: 16px 0;
					height: 2px;"></div>
				<div class="right-bottom">
					<div class="right-bottom-icon" style="width: 90px;
						height: 90px;
						border-radius: 12px;">
						<img style="margin: 20px;
							width: 50px;
							height: 50px;" :src="averageIcon" alt="">
					</div>
					<div class="right-bottom-number" style="	margin-left: 18px;">
						<h4 style="font-size: 28px;">平均客流量</h4>
						<p style="	font-size: 26px;">{{data.average}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import titleName from './report_title_name'
export default {
  name: 'report-enter',
  props: {
	  listTitle: {
      type: Object
	  },
	  data: {
      type: Object
	  }
  },
  components: {
    titleName
  },
  data () {
    return {
      enterIcon: require('@/assets/images/fixation_img/rest/enter.png'),
	  averageIcon: require('@/assets/images/fixation_img/rest/average.png'),
	  flowIcon: require('@/assets/images/fixation_img/rest/flow.png'),
	  peakIcon: require('@/assets/images/fixation_img/rest/peak.png')
    }
  },
  watch: {
		data:{
			handler(newval){
				console.log(newval)
			},
			immediate:true
		}
  },
  computed: {
  },
  methods: {

  },
  created () {

  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
    .enter-list {
		width: 100%;
		height: auto;
		.list-text{
			width: 100%;
			height: auto;
			overflow: hidden;
			
			.text-left{
				width: 20%;
				float: left;
			
				background: #207ece;
			
				.left-tetx{
					width: 80%;
					height: 100%;
					margin:  0 auto;
					.left-icon{
					
						background-color: #fff;
						margin: 0 auto;
						img{
							float: left;
							display: block;
							height: auto;
						
						}
					}
					h4{
						
						color: #fff;
						
						text-align: center;
					}
					p{
						width: 100%;
					
						color: #35e9df;
						text-align: center;
					}
					.left-gender{
						width: 100%;
						height: auto;
						span{
							display: inline-block;
							width: 100%;
							text-align: center;
							font-size: 16px;
							color: #eeebeb;
						}
					}
				}
			}
			.text-right{
				width:70%;
				float: right;
				background: #207ece;
				.right-top{
					width: 100%;
					height: auto;
					overflow: hidden;
					.right-top-icon{
						
						background-color: #fff;
					
						float: left;
						img{
							display: block;
							
						}
					}
					.right-top-number{
						float: left;
					
						text-align: left;
						h4{
						
							color: #fff;
						}
						p{
							width: 100%;
							
							color: #35e9df;
						}
						span{
							display: inline-block;
							
							color: #f1f0f0;
						}
					}
				}
				.right-line{
					width: 100%;
					background-color: #fff;
					opacity: 0.5;
				
				}
				.right-bottom{
					width: 100%;
					height: auto;
					text-align: left;
					.right-bottom-icon{
						
						background-color: #fff;
					
						float: left;
						img{
							display: block;
							
						}
					}
					.right-bottom-number{
						float: left;
					
						h4{
							
							color: #fff;
						}
						p{
							width: 100%;
						
							color: #35e9df;
						}
					}

				}
			}
		}
    }

</style>
