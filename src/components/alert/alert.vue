<template>
	<transition name='fade'>
		<div class="alert-text" v-if="show">
			<div class="alert-bg" v-on:click="closeAlert"></div>
			<div class="alert-center">
				<div class="alert-close" v-on:click="closeAlert">
					<Icon type="md-close"/>
				</div>
				<header>{{ i18n.t(title) }}</header>
				<div class="alert-center-text">{{content}}</div>
				<div class="flooter">
					<Button type="text" @click="closeAlert" v-if="showCancel">{{i18n.t('cancel')}}</Button>
					<Button type="primary" class="m-l-20" :style="{'background-color':color}" @click="alertConfirm">{{i18n.t('Confrim')}}</Button>

				</div>
			</div>
		</div>
	</transition>
</template>

<script>
  import i18n from '@/i18n/i18n'
  export default {
    data () {
      return {
        content: '',
        title: 'Notice',
				color:'#37b5ed',
        show: false,
        showConfirm:true,
      }
    },
    computed:{
      showCancel(){
        return this.cancel
      },
      i18n(){
        return i18n
			}
    },
    methods: {
      closeAlert () {
        this.cancel && this.cancel();
        this.show = false
      },
      alertConfirm () {
        this.confirm && this.confirm();
        this.show = false
      }
    }
  }
</script>
<style lang="less" scoped>
	// 渐变过渡
	.fade-enter,
	.fade-leave-active {
		opacity: 0;
	}
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .35s;
	}
	.alert-text {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99999;
		transition: all .2s;
		display: flex;
		align-items: center;
		justify-content: center;

		.alert-bg {
			width: 100%;
			background: rgba(0, 0, 0, .4);
			transition: all .25s ease;
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			z-index: 10;

		}

		.alert-center {
			transition: all .2s;
			z-index: 11;
			width: calc(100% - 20px);
			max-width: 400px;
			border-radius: 6px;
			box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
			background: #fff;
			position: relative;

			.alert-close {
				position: absolute;
				right: -5px;
				top: -5px;
				background: #fff;
				width: 33px;
				height: 33px;
				box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
				border-radius: 5px;
				text-align: center;
				line-height: 33px;
				cursor: pointer;
				z-index: 10;

				&:hover {
					transform: translate(5px, -5px);
					box-shadow: 0 0 0 0 rgba(0, 0, 0, .1)
				}

				i {
					font-size: 20px;
				}
			}

			header {
				padding: 20px 20px 10px 20px;
				font-size: 16px;
				border-radius: 5px 5px 0 0;
				background-color: #f8f8f8;
			}

			.alert-center-text {
				padding: 20px;
				font-size: 14px;
				position: relative;
				&:after{
					position: absolute;
					content: '';
					left: 0;
					bottom: 0;
					width: 100%;
					height: 1px;
					background-color: rgba(0, 0, 0, .05);
				}
			}

			.flooter {
				text-align: right;
				padding: 10px 20px;
			}
		}

	}
</style>
