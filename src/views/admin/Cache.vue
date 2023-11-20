<template>
	<div>
		<Button type="primary" @click="updateCache">{{$t('更新后台数据缓存')}}</Button>
		<Button v-if="headerData.show_add_count" type="primary" class="m-l-20" @click="dataRecord">{{$t('补录实体配置')}}</Button>
	</div>
</template>
<script>
	import {updateCache} from '../../api/home'
	import {mapState} from 'vuex'
  export default {
	  computed:{
      ...mapState({
        headerData:state => state.home.headerData,
      }),
		},
	  methods:{
      dataRecord(){
        this.$router.push({
					name:'Record'
				})
			},
      updateCache(){
        updateCache().then(res=>{
					if(res.data.code === 200){
					  this.$message.success(this.$t('fn.successTo',[this.$t('更新')]))
					}else {
					  this.$message.error(res.data.message)
					}
        })
			}
		}
	}
</script>
