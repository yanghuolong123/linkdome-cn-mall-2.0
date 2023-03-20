<template>
	<div class="drainage-map">
		<h1>{{ $t('引流图') }}
			<Tooltip :content="$t('passages.tootipText4')" placement="right" theme="light" transfer max-width="500">
				<icons type="wenhao"/>
			</Tooltip>
		</h1>
		<div class="flex-center drainage-map-box">
			<div class="drainage-map-item">
				<item-card :item="item" :icon="accessImg" v-for="(item,index) in dataList.from"></item-card>
			</div>
			<div class="drainage-center flex-center p-r">
				<div class="left p-a flex-column">
					<span v-if="headerData.show_actual_val">{{dataList.shop&&dataList.shop.total_from.toLocaleString()}}人次</span>
				
					<div class="flex-center">
						<span class="thin">环比</span>
						<Icon type="md-arrow-dropdown" v-if="dataList.shop.from_action"/>
						<Icon type="md-arrow-dropup" v-else/>
						<span v-bind:class="{ clolorAction: dataList.shop.from_action }">{{dataList.shop.from_rate}}%</span>
					</div>
				</div>
				<div class="right p-a flex-column">
					<span v-if="headerData.show_actual_val">{{dataList.shop&&dataList.shop.total_to.toLocaleString()}}人次</span>
				
					<div class="flex-center">
						<span class="thin">环比</span>
						<Icon type="md-arrow-dropdown" v-if="dataList.shop.to_action"/>
						<Icon type="md-arrow-dropup" v-else/>
						<span v-bind:class="{ clolorAction: dataList.shop.to_action }">{{dataList.shop.to_rate}}%</span>
					</div>
				</div>
				<img class="arrow" :src="centerImg" alt="">
				<img class="shop" :src="shopImg" alt="">
				<img class="arrow" :src="centerImg" alt="">
				<div class="p-a shop-name flex-column">
					<b>{{dataList.shop&&dataList.shop.name}}</b>
					<span class="m-t-10" v-if="headerData.show_actual_val">{{dataList.shop&&dataList.shop.enter.toLocaleString()}}人次</span>
				</div>
			</div>
			<div class="drainage-map-item">
				<item-card :item="item" :reverse="true" :icon="accessImg" v-for="(item,index) in dataList.to"></item-card>
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
          departure: []
        },
        centerImg: require('@/assets/images/fixation_img/bg/draniage_center_1.png'),
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
		.drainage-map-box{
			padding: 50px;
		
			.drainage-map-item{
				width: 30%;
				flex: none;
				background-color: #F3F3F3;
				height: 330px;
				overflow-y: scroll;
			}
			.drainage-center{
				position: relative;
				font-size: 16px;
				flex: 1;
				.m-t-10{
					margin-top: 10px;
					
				}
				.left{
					left: 20px;
					bottom: 60px;
				}
				.right{
					right: 20px;
					bottom: 60px;
				}
				.shop{
					height: 100px;
				}
				.p-a{
					position: absolute;
				}
				.shop-name{
					left: 50%;
					transform: translateX(-50%);
					top: 110px;
					justify-content: center;
					align-items: center;
					b{
						font-size: 20px;
					}
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
			}
		}
		
		h1 {
			font-size: 24px;
			color: #3e3c3c;
			padding: 27px 19px 0;
			font-weight: 400;
		}
	}
</style>
