<template>
	<div>
		<Button type="primary" @click="updateCache">{{$t('updateBackCache')}}</Button>
		<Button v-if="headerData.show_add_count" type="primary" class="m-l-20" @click="dataRecord">{{$t('suplyEntityCofig')}}</Button>
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
					  this.$message.success(this.$t('fn.successTo',[this.$t('update')]))
					}else {
					  this.$message.error(res.data.message)
					}
        })
			}
		}
	}
</script>
