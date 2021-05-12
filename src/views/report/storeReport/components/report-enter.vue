
<template>
	<div class="enter-list" style="padding: 0 80px;
		margin-top: 8px;
		margin-bottom: 30px;">
		<title-name :listTitle='listTitle'></title-name>
		<div class="list-text flex-center" v-if="data">
			<div class="text-left">
				<div class="left-tetx">
					<div class="left-icon">
						<img :src="enterIcon" alt="">
					</div>
					
					<h4 style="font-size: 28px;
					margin-top: 14px;">累计客流</h4>
					<p style="	font-size: 26px;">{{data.enter}}</p>

				</div>
				<div class="left-gender flex-column">
					<span>男性:{{data.male}}%</span>
					<span>女性:{{data.female}}%</span>
				</div>
			</div>
			<div class="text-right flex-column">
				<div class="right flex-start">
					<div class="right-bottom-icon">
						<img :src="peakIcon">
					</div>
					<div class="right-bottom-number">
						<h4 >客流峰值</h4>
						<p>{{data.enterPeak}}</p>
						<span class="time">{{data.enterTime}}</span>
					</div>
				</div>

				<div class="right flex-start">
					<div class="right-bottom-icon">
						<img :src="averageIcon" alt="">
					</div>
					<div class="right-bottom-number">
						<h4 >平均客流量</h4>
						<p >{{data.average}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
  import titleName from '@/components/report-public/report_title_name'
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
  }
</script>
<style scoped lang="less">
	.dashed-border{
		border: 3Px dashed #7ecef4;
		border-radius: 8Px;
	}
	.enter-list {
		width: 100%;
		height: auto;
		.list-text{
			width: 100%;
			margin-top: 16Px;
			.text-left:extend(.dashed-border){
				width: 35%;
				display: flex;
				align-items: start;
				background: #207ece;
				height: 260Px;
				padding:48Px 0;
				.left-tetx{
					width: 50%;
					height: 100%;
					margin:  0 auto;
					.left-icon{
						width: 90Px;
						height: 90Px;
						border-radius: 12Px;
						background-color: #fff;
						margin: 0 auto;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							width: 50Px;
							height: 50Px;
							
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

				}
				.left-gender{
					flex: 1;
					font-size: 20Px;
					span{
						color: #eeebeb;
					}
					span+span{
						margin-top: 20Px;
					}
				}
			}
			.text-right:extend(.dashed-border){
				height:260Px;
				padding: 22Px;
				margin-left: 20Px;
				flex: 1;
				background: #207ece;
				justify-content: space-between;
				.right{
					width: 100%;
					height: auto;
					.right-bottom-icon{
						width: 90Px;
						height: 90Px;
						border-radius: 12Px;
						background-color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							width: 50Px;
							height: 50Px;
							
						}
					}
					.right-bottom-number{
						margin-left: 18Px;
						text-align: left;
						h4{
							font-size: 28Px;
							color: #fff;
						}
						p{
							font-size: 26Px;
							color: #35e9df;
						}
						.time{
							font-size: 16Px;
							color: #f1f0f0;
						}
					}
					
				}
			}
		}
	}

</style>
