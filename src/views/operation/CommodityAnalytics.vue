<template>
	<div class="sales-new">
		<!-- 商品分析 -->
		<hot-item ref="hot_item"></hot-item>
	</div>
</template>

<script>
import hotItem from './newSales/hotItem.vue'
export default {
  name: 'salseNew',
  components: {
    hotItem
  },
  data () {
	   return {

	   }
  }

}
</script>
<style lang="less">
	.comparison{
		border: 1px solid #009FE9;
		color: #009FE9;
	}
	.floor-chart{
		&:nth-child(1){
			.tab-con{
				margin-top: 60px;
			}
		}
	}
</style>
<style lang="less" scoped>
	.sales-new{
		padding-bottom: 50px;
	}
</style>
