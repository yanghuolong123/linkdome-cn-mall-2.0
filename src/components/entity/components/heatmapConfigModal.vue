<template>
	<h-modal  ref="modal" title="热力图配置"  :width="1350">
		<div class="modal-ctn flex-start">
			<div class="left" :style="{backgroundImage:`url(${imgSrc?imgSrc:placeholder})`}">
				<img class="po" src="/src/assets/images/fixation_img/rest/position.png" alt="">
			</div>
			<div class="right">
			
			</div>
			
		</div>
	</h-modal>
</template>
<script>
	import hModal from "_c/common/Modal.vue";
	export default {
	  name:'heatmapModal',
		components:{
      hModal
		},
		data(){
	 		return{
        placeholder:require('@/assets/images/fixation_img/bg/placeholder.jpg')
			}
		},
		props:{
      visible:{
        type:Boolean,
				default:false
			},
      imgSrc:{
        type:String
			}
		},
		methods:{
	    showModal(){
	      this.$refs.modal.showModal()
			}
		}
	}
</script>
<style lang="less" scoped>
	.modal-ctn{
		height: 500px;
		width: 100%;
		.left{
			width: 70%;
			height: 100%;
			background-size: 100% 100%;
			position: relative;
			.po{
				position: absolute;
				transform: translate(-100% -100%);
				width: 27px;
				height: 27px;
				top: 0;
				left: 0;
			}
		}
	}
</style>
