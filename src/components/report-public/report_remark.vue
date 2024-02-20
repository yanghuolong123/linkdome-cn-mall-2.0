<template>
	<div class="report-remark" style=" padding: 10px 28px;
        margin: 0 60px;">
		<div class="flex-center title" style=" font-size: 36px;">
			<img style=" width: 28px;" :src="img" alt="">
			<span>{{$t('report.linkdomeReview')}}</span>
		</div>
		<ul style="  margin-top: 15px;
            padding-left: 35px;">
			<li style="font-size: 24px" :key="index" v-for="(item,index) in dataList">{{item}}</li>
		</ul>
	</div>
</template>
<script>

  export default {
    name: 'report-remark',
    props: {
      dataList: {
        typr: Array
      }
    },
    data () {
      return {
        img: require('@/assets/images/fixation_img/rest/varied.png')

      }
    },
    watch: {},

    methods: {},
    created () {

    },
    mounted () {

    }
  }
</script>
<style scoped lang="less">
	.report-remark {
		display: block;
		background-color: #1361a8;
		opacity: 0.6;
		overflow: hidden;

		.title {
			color: #fff;

			img {
				display: inline-block;
				margin-right: 10px;
			}
		}

		ul {
			width: 100%;
			height: auto;

			li {
				width: 100%;
				height: auto;
				color: #fff;
				list-style-type: disc;
			}
		}
	}

</style>
