<template>
	<div>
		<Button type="primary" @click="updateCache">更新后台数据缓存</Button>
		<Button type="primary" class="m-l-20" @click="dataRecord">补录实体配置</Button>
	</div>
</template>
<script>
	import {updateCache} from '../../api/home'

  export default {
	  methods:{
      dataRecord(){
        this.$router.push({
					name:'Record'
				})
			},
      updateCache(){
        updateCache().then(res=>{
					if(res.data.code === 200){
					  this.$message.success('更新成功')
					}else {
					  this.$message.error(res.data.message)
					}
        })
			}
		}
	}
</script>
