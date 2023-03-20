<template>
	<div class="item flex-between" :class="{reverse:reverse}">
		<div class="left flex-column">
			<div class="flex-center">
				<span>{{ $t('fn.客流占比', [item.value]) }}</span>
				<span class="thin m-l-8" v-if="headerData.show_actual_val">({{item.enter}}人次)</span>
			</div>
			<div class="flex-center">
				<span class="thin"> {{ $t('环比') }}</span>
				<Icon type="md-arrow-dropdown" v-if="item.action"/>
				<Icon type="md-arrow-dropup" v-else/>
				<span v-bind:class="{ clolorAction: item.action }">{{item.link}}%</span>
			</div>
		</div>
		<div class="right flex-center" :class="{reverse:reverse}">
			<span>{{item.name}}</span>
			<img :src="icon" alt="">
		</div>
	</div>
</template>
<script>
  import { mapState } from 'vuex'
	export default {
    computed: {
      ...mapState({
        headerData: state => state.home.headerData,
      })
    },
	  props:{
	    item:{
	      type:Object,
				default:{}
			},
			icon:{
	      type:String,
				default:''
			},
			reverse:{
	      type:Boolean,
				default:false
			}
		}
	}
</script>
<style lang="less" scoped>
	.reverse {
		flex-direction: row-reverse;
		
		img {
			margin-right: 20px !important;
			margin-left: 0 !important;
			
		}
	}
	.m-l-8{
		margin-left: 8px;
	}
	.item {
		padding: 10px 20px;

		&:not(:last-child) {
			border-bottom: 1px solid #d2d2d2;
		}
		
		.thin {
			color: #929292;
		}
		
		.clolorAction {
			color: #f64f61;
		}
		
		.ivu-icon-md-arrow-dropup {
			font-size: 18px;
			color: #26b465;
		}
		
		.ivu-icon-md-arrow-dropdown {
			font-size: 18px;
			color: #f64f61;
		}
		
		img {
			height: 45px;
			border-radius: 50%;
			margin-left: 20px;
		}
		
	}
</style>
