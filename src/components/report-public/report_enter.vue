
<template>
	<div class="enter-list">
		<title-name :listTitle='listTitle'></title-name>
		<div class="list-text" v-if="data">
			<div class="text-left">
				<div class="left-tetx">
					<div class="left-icon">
						<img :src="enterIcon" alt="">
					</div>

					<h4>累计客流</h4>
					<p>{{data.enter}}</p>
					<!-- <div class="left-gender">
						<span>男性:70%</span>
						<span>女性:30%</span>
					</div> -->
				</div>
			</div>
			<div class="text-right">
				<div class="right-top">
					<div class="right-top-icon">
						<img :src="peakIcon" alt="">
					</div>
					<div class="right-top-number">
						<h4>客流峰值</h4>
						<p>{{data.enterPeak}}</p>
						<span>{{data.enterTime}}</span>
					</div>
					<div class="right-top-icon" style="margin-left:10%">
						<img :src="flowIcon" alt="">
					</div>
					<div class="right-top-number">
						<h4>集客量峰值</h4>
						<p>{{data.occupancyPeak}}</p>
						<span>{{data.occupancyTime}}</span>
					</div>
				</div>
				<div class="right-line"></div>
				<div class="right-bottom">
					<div class="right-bottom-icon">
						<img :src="averageIcon" alt="">
					</div>
					<div class="right-bottom-number">
						<h4>平均客流量</h4>
						<p>{{data.average}}</p>
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
		padding: 0 80px;
		margin-top: 8px;
		margin-bottom: 30px;
		.list-title{
			width: 100%;
			padding-left: 20px;
			p{
				display: inline-block;
				font-size: 28px;
				color: #515355;
			}
			span{
				display: inline-block;
				font-size: 22px;
				color: #515355;
				opacity: 0.8;
				margin-left: 22px;
			}
		}
		.list-line{
			width: 100%;
			height: 2px;
			background-color: #99abb4;
			position: relative;
			span{
				display: inline-block;
				background-color: #fff;
				width: 18px;
				height: 18px;
				border-radius: 50%;
				border: 2px solid #99abb4;
				position: absolute;
				&:nth-child(1){
					left: 0;
					top: -9px;
				}
				&:nth-child(2){
					right: 0;
					top: -9px;
				}
			}
		}
		.list-text{
			width: 100%;
			height: auto;
			overflow: hidden;
			margin-top: 16px;
			.text-left{
				width: 20%;
				float: left;
				height: 260px;
				background: #207ece;
				border: 3px dashed #7ecef4;
				border-radius: 8px;
				padding:48px 0;
				.left-tetx{
					width: 80%;
					height: 100%;
					margin:  0 auto;
					.left-icon{
						width: 90px;
						height: 90px;
						border-radius: 12px;
						background-color: #fff;
						margin: 0 auto;
						img{
							float: left;
							display: block;
							width: 50px;
							height: auto;
							margin: 20px;
						}
					}
					h4{
						font-size: 28px;
						color: #fff;
						margin-top: 14px;
						text-align: center;
					}
					p{
						width: 100%;
						font-size: 26px;
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
				height:260px;
				background: #207ece;
				border: 3px dashed #7ecef4;
				border-radius: 8px;
				padding: 22px;
				.right-top{
					width: 100%;
					height: auto;
					overflow: hidden;
					.right-top-icon{
						width: 90px;
						height: 90px;
						background-color: #fff;
						border-radius: 12px;
						float: left;
						img{
							display: block;
							margin: 20px;
							width: 50px;
							height: 50px;
						}
					}
					.right-top-number{
						float: left;
						margin-left: 18px;
						text-align: left;
						h4{
							font-size: 28px;
							color: #fff;
						}
						p{
							width: 100%;
							font-size: 26px;
							color: #35e9df;
						}
						span{
							display: inline-block;
							font-size: 16px;
							color: #f1f0f0;
						}
					}
				}
				.right-line{
					width: 100%;
					height: 2px;
					background-color: #fff;
					opacity: 0.5;
					margin: 16px 0;
				}
				.right-bottom{
					width: 100%;
					height: auto;
					text-align: left;
					.right-bottom-icon{
						width: 90px;
						height: 90px;
						background-color: #fff;
						border-radius: 12px;
						float: left;
						img{
							display: block;
							margin: 20px;
							width: 50px;
							height: 50px;
						}
					}
					.right-bottom-number{
						float: left;
						margin-left: 18px;
						h4{
							font-size: 28px;
							color: #fff;
						}
						p{
							width: 100%;
							font-size: 26px;
							color: #35e9df;
						}
					}

				}
			}
		}
    }

</style>
