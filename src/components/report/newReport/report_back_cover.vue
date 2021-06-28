<template>
	<div class="reportOneText" style=" width: 1200px; height: 1682px;">
		<div class="report-text" style=" bottom: 110px; padding: 0 82px;">

			<span style="
                margin-top:150px;
                padding-bottom: 10px;
                font-size: 36px;
                border-bottom: 10px solid #fff;
            ">报告日期:
            {{reportDate}}
            </span>
			<span style="
                margin-top:150px;
                padding-bottom: 10px;
                font-size: 36px;
                border-bottom: 10px solid #35E9DF;
            ">生成日期: {{newDate}}</span>
		</div>
	</div>
</template>
<script>
  import moment from 'moment'

  export default {
    props: {},
    name: 'report-back_cover',
    data () {
      return {
        newDate: moment(new Date()).format('YYYY.MM.DD')
      }
    },
    computed: {
      reportDate () {
        let type = this.$store.state.report.reportHeaderType
        switch (type) {
          case 'day':
            return this.$store.state.report.dayReportHeader.reportDate
          case 'week':
            return this.$store.state.report.weekReportHeader.reportDate
          case 'month':
            return this.$store.state.report.monthReportHeader.reportDate
          case 'customize':
            return this.$store.state.report.customizeReportHeader.reportDate
        }
      }
    }
  }
</script>
<style scoped lang="less">
	.reportOneText {
		display: inline-block;
		overflow: hidden;
		position: relative;
		background: url('../../../assets/images/fixation_img/bg/image_back_cover_background.png') no-repeat;
		background-size: 100% 100%;
		
		.report-text {
			width: 100%;
			height: auto;
			position: absolute;
			left: 0;
			
			h2 {
				color: #fff;
				width: 100%;
				height: auto;
				text-align: center;
			}
			
			p {
				color: #fff;
				height: auto;
			}
			
			span {
				color: #fff;
				font-weight: bold;
				float: left;
				
				&:last-child {
					float: right;
				}
			}
		}
		
		.property-bg {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
</style>
