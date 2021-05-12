
<template>
	<div class="reportOneText" style=" width: 1200px;height: 1682px;">
		<div class="report-list" style="padding-bottom: 180px;">
			<report-header></report-header>
			<report-title :title="title"></report-title>
			<div class="name">{{enterData.name}}</div>
			<div class="content">
				<title-name :listTitle='listTitle'></title-name>
				<div class="card flex-center">
					<div class="left">
						<img src="@/assets/images/fixation_img/rest/dwell-icon.png"/>
					</div>
					<div class="right flex-column">
						<span>平均停留时间</span>
						<span>{{Object.values(enterData.list)[0] | formatDwell}}</span>
						<span>{{enterData.daily_start.substring(0,5)}}—{{enterData.daily_end.substring(0,5)}}</span>
					</div>
				</div>
			</div>
			
			<report-flooter :size='page'></report-flooter>
		</div>
		<img :src="flooterBg" class="report-bg" alt="">
	
	</div>
</template>
<script>
  import reportHeader from '@/components/report-public/report_header'
  import reportTitle from '@/components/report-public/report_title'
  import reportFlooter from '@/components/report-public/report_flooter'
  import titleName from '@/components/report-public/report_title_name'
  export default {
    name: 'report-week-one',
    props: {
      title: {
        type: String
      },
      listTitle: {
        type: Object
      },
      page: {
        type: String
      },
      enterData: {
        type: Object
      },
    },
    components: {
      reportHeader,
      titleName,
      reportTitle,
      reportFlooter
    },
	filters:{
      formatDwell(val){
        const h = parseInt(val/60)>9?parseInt(val/60):'0'+parseInt(val/60);
        const m = val%60>9?val%60:'0'+val%60
		return `${h}分${m}秒`
	  }
	},
    data () {
      return {
        flooterBg: require('@/assets/images/fixation_img/bg/list_bg.png')

      }
    },
    methods: {
    },
    computed: {
      reportType(){
        return this.$store.state.report.reportHeaderType
      }
    }
  }
</script>
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
			.name {
				padding: 20Px 80Px;
				font-size: 50Px;
				font-weight: bold;
			}
			.content{
				padding: 0Px 80Px;
				.card{
					padding: 70Px;
					margin-top: 30Px;
					background-color: #207ECE;
					border: 3Px dashed #7ecef4;
					border-radius: 8Px;
					.left{
						width: 140Px;
						height: 140Px;
						border-radius: 12Px;
						background-color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 2Px solid #4EDBDA;
						img{
							width: 72Px;
							height: 72Px;
						}
					}
					.right{
						height: 140Px;
						margin-left: 20Px;
						color: #fff;
						font-size: 28Px;
						span:nth-child(2){
							font-size: 44Px;
							line-height: 48Px;
							color: #35E9DF;
						}
						span:last-child{
							font-size: 24Px;
						}
					}
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
