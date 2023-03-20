<template>
	<div class="drainage-map">
		<h1>{{ $t('引流图') }}
			<Tooltip :content="$t('passages.tootipText4')" placement="right" theme="light" transfer max-width="500">
				<icons type="wenhao"/>
			</Tooltip>
		</h1>
		<div class="drainage-map-text" :style="{margin:mapMargin}">
			<div class="drainage-map-left">
				<div class="drainage-map-left-top">
					<item-card :item="item" :icon="accessImg" v-for="(item,index) in dataList.direct"></item-card>
				</div>
				<div class="drainage-map-left-bottom">
					<item-card :item="item" :icon="shopImg" v-for="(item,index) in dataList.radiation"></item-card>
				</div>
			</div>
			<div class="drainage-map-center">
				<img class="drainage-map-center-bg" :src="centerImg" alt="">
				<div class="drainage-map-center-text">
					<div class="flex-column info">
						<img :src="shopImg">
						<p class="drainage-shop-name">{{presentData.name}}</p>
						<p class="">{{presentData.enter.toLocaleString()}}人次</p>
					</div>
				</div>
				<div class="text-location" v-for="item in centerData">
					<p>{{item.enter}}{{$t('人次')}}</p>
					<p>{{ $t(item.text) }}：{{ item.value }}%</p>
					<p>
						{{ $t('环比') }}
						<Icon type="md-arrow-dropdown" v-if="item.action"/>
						<Icon type="md-arrow-dropup" v-else/>
						<span v-bind:class="{ clolorAction: item.action }">{{item.link}}%</span>
					</p>
				</div>
			</div>
			<div class="drainage-map-right">
				<div class="drainage-map-left-top">
					<item-card :item="item" :reverse="true" :icon="shopImg" v-for="(item,index) in dataList.indirect"></item-card>
				</div>
				<div class="drainage-map-left-bottom">
					<item-card :item="item" :reverse="true" :icon="accessImg" v-for="(item,index) in dataList.departure"></item-card>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
  import { mapState } from 'vuex'
	import itemCard from './item'
  export default {
    name: 'drainage-map',
    props: {
      dataList: {
        type: Object,
        default: {}
      },
      presentData: {
        type: Object,
        default: {}
      },
      centerData: {
        type: Array,
        default: []
      },
      mapHeight: {
        type: String,
        default: '800px'
      },
      mapMargin: {
        type: String,
        default: '50px auto 0 auto'
      },
      margin: {
        type: String,
        default: '-50px'
      }
    },
		components:{itemCard},
    computed: {
      ...mapState({
        headerData: state => state.home.headerData,
      })
    },
    data () {
      return {
        listData: {
          direct: [],
          indirect: [],
          radiation: [],
          departure: [],
        },
        centerImg: require('@/assets/images/fixation_img/bg/draniage_center.png'),
        shopImg: require('@/assets/images/fixation_img/rest/shop.png'),
        accessImg: require('@/assets/images/fixation_img/rest/access.png'),
      }
    },

  }
</script>

<style lang="less" scoped>
	.drainage-map {
		width: 100%;
		height: auto;
		box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
		border-radius: .5rem;
		background-color: #fff;

		
		h1 {
			font-size: 24px;
			color: #3e3c3c;
			padding: 27px 19px 0;
			font-weight: 400;
		}
		
		.drainage-map-text {
			width: 95%;
			height: 800px;
			padding-bottom: 50px;
			
			.drainage-map-left, .drainage-map-center, .drainage-map-right {
				float: left;
				height: 100%;
				position: relative;
				
				.drainage-map-left-bottom, .drainage-map-left-top {
					position: absolute;
					left: 0;
					height: 45%;
					width: 100%;
					background-color: #F3F3F3;
					border-radius: 5px;
					box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
					overflow-y: scroll;
				}
				
				.drainage-map-left-top {
					top: 0;
				}
				
				.drainage-map-left-bottom {
					bottom: 0;
				}
			}
			
			.drainage-map-left, .drainage-map-right {
				width: 30%;
			}
			
			.drainage-map-center {
				width: 40%;
				position: relative;
				
				.drainage-map-center-bg {
					display: block;
					width: 100%;
					height: 440px;
					position: absolute;
					top: 160px;
				}
				
				.text-location {
					position: absolute;
					
					&:nth-child(3) {
						left: 3%;
						top: 80px;
					}
					
					&:nth-child(4) {
						right: 3%;
						top: 80px;
						
						p {
							text-align: right;
						}
					}
					
					&:nth-child(5) {
						left: 3%;
						bottom: 60px;
						
					}
					
					&:nth-child(6) {
						right: 3%;
						bottom: 60px;
						
						p {
							text-align: right;
						}
					}
					
					p {
						font-size: 16px;
						color: #3b3a3a;
						
						&:nth-child(2) {
							font-size: 14px;
							color: #8e9696;
							margin: 10px 0;
							
						}
						
						span {
							color: #26b465;
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
					}
					
				}
				
				.drainage-map-center-text {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					.info{
						justify-content: center;
						align-items: center;
						font-size: 16px;
					}
					div {
						position: absolute;
						left: 50%;
						top: 50%;
						margin: -50px;
						width: 100px;
						height: 100px;
						
						img {
							display: block;
							height: 100px;
							background-color: #fff;
							border-radius: 50%;
						}
					}
					
					.drainage-shop-name {
						margin-top: 10px;
						font-size: 18px;
						text-align: center;
						width: 100%;
						color: #666;
						font-weight: 600;
					}
				}
			}
		}
	}
</style>
