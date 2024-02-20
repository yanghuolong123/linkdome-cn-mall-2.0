<template>
	<div class="reportOneText" style=" width: 1200px; height: 1682px;">
		<img src="../../../assets/images/fixation_img/logo/white-logo.png" class="property-logo" style=" width: 276px;" alt="">
		<img class="earth" src="../../../assets/images/fixation_img/bg/earth.png" alt="">
		<div class="report-text" style=" bottom: 110px; padding: 0 82px;">
			<h2 style="
                font-size: 36px;
                width: 360px;
                margin: 0 auto ;
                white-space:nowrap;
            ">{{$t('report.linkdome')}}</h2>
			<p style="
                font-size: 26px;
                width: 360px;
                margin-top: 48px;
                margin: 48px auto 0 auto;
            "> {{$t('report.web')}}：www.linkdome.cn </p>
			<p style="
                font-size: 26px;
                width: 360px;
                margin-top: 48px;
                margin: 48px auto 0 auto;
                white-space:nowrap;
            "> {{$t('mail')}}：support@linkdome.cn</p>
			<p
				style="
                font-size: 26px;
                width: 360px;
                margin-top: 48px;
                margin: 48px auto 0 auto;
            "> {{$t('report.tel')}}：4006699330</p>
			<p style="
                width:360px;
                text-align: center;
                font-size: 26px;
                margin: 48px auto 0 auto;
                white-space:nowrap;
            " v-if="language!=='en-US'"> {{$t('report.addr')}}：陕西省西安市雁塔区旺座曲江A座23层</p>
			<span style="
                margin-top:180px;
                padding-bottom: 10px;
                font-size: 30px;
                border-bottom: 10px solid #fff;
            ">{{$t('report.reprotDate')}}:
            {{reportDate}}
            </span>
			<span style="
                margin-top:180px;
                padding-bottom: 10px;
                font-size: 30px;
                border-bottom: 10px solid #35E9DF;
            ">{{$t('report.genDate')}}: {{newDate}}</span>
		</div>
	</div>
</template>
<script>
  import moment from 'moment'
  import { mapState } from 'vuex'

  export default {
    props: {},
    name: 'report-back_cover',
    data () {
      return {
        newDate: moment(new Date()).format('YYYY.MM.DD')
      }
    },
    computed: {
		...mapState({
			language: (state) => state.language,//en-US
		}),
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
      },
      property () {
        return this.$store.state.home.headerData
      },
    }
  }
</script>
<style scoped lang="less">
	.reportOneText {
		display: inline-block;
		overflow: hidden;
		position: relative;
		background: url('../../../assets/images/fixation_img/bg/image_cover_background.png') no-repeat;
		background-size: 100% 100%;
		padding: 86Px 80Px;
		.earth{
			position: absolute;
			top: 34%;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 750Px;
		}
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
