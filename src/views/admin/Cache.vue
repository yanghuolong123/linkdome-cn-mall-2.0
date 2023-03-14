<template>
	<div>
		<Button type="primary" @click="updateCache">更新后台数据缓存</Button>
	</div>
</template>
<script>
	import {updateCache} from '../../api/home'

  export default {
	  methods:{
      updateCache(){
        updateCache().then(res=>{
          console.log(res)
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
