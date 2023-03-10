<template>
	<Modal
			:title="title"
			class-name="cn-modal"
			ref="modal"
			:loading="loading"
			:mask-closable="false"
			@on-ok="handleOk"
			@on-cancel="onCancel"
			:width="width"
			:footer-hide="footerHide"
			v-model="modalShow"
			>
		<slot></slot>
	</Modal>
</template>
<script>
  export default {
    name:'primaryModal',
    props:{
      title:{
        type:String,
        default:''
      },
      footerHide:{
        type:Boolean,
        default:false
      },
      width:{
        type:Number,
        default:520
      },
    },
    data(){
      return{
        modalShow:false,
        loading:true
      }
    },
    methods:{
      //对话框校验失败，取消loading状态
      resetOkButton() {
        this.loading = false;
        setTimeout(() => {
          this.$nextTick(() => {
            this.loading = true;
          });
        }, 100);
      },
      handleOk(){
        this.$emit('onOk')
      },
      onCancel(){
        this.$emit('onCancel')
      },
			closeModal(){
        this.modalShow = false
			},
      showModal() {
        this.modalShow = true
      }
    }
  }
</script>
<style scoped lang="less">

</style>
<style>
	.cn-modal{
		/*z-index: 111111!important;*/
		/*top: 50%;*/
		/*left: 50%;*/
		/*transform: translate(-50%,-50%);*/
	}
	.ivu-modal-mask{
		/*z-index: 111111!important;*/
	}
	.ivu-modal-header {
		background-color: #f2f2f2;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
	}
	.ivu-modal-close{
		top: -8px!important;
		right: -15px!important;
		background-color: white;
		border-radius: 6px;
		box-shadow:0px 2px 17px 1px rgba(153,158,159,0.25);
	}
	.ivu-modal-body{
		padding: 30px 50px!important;
	}
	.ivu-modal-header-inner{
		font-weight: normal;
	}
</style>
