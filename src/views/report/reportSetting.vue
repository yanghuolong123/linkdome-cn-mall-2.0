<template>
	<div>
			<CheckboxGroups v-for ="item in dataList" :checkData="item" ></CheckboxGroups>
		<Button type="primary" @click="handleSave">{{ $t('保存') }}</Button>
	
	</div>
</template>
<script>
  import CheckboxGroups from '@/components/role/CheckboxGroups.vue'
	import {getReportSettingItem,getReportSetting,reportSetting} from '@/api/report'
	import {mapState} from 'vuex'
  export default{
    components: {
      CheckboxGroups,
    },
		data(){
      return{
        settingData:[],
        setting:{}
			}
		},
		computed:{
      ...mapState({
        propertyId: (state) => state.home.headerAction,
      }),
      dataList(){
        let origin = [{
          cname:'数据对比',
					id:100,
          enable:this.setting.show_last_year===1?1:0,
          subpagesList:[
						{
						  cname:'同比',
							id:99,
              enable:this.setting.show_last_year===1?1:0
						}
					]
				},{
          cname:'数据模块',
					id:98,
					enable:this.settingData.some(o=>{return o.enable===1})?1:0,
          subpagesList:[
						...this.settingData
					]
				}
				]
				return origin
			}
		},
		methods:{
      handleSave(){
				let items = [];
        this.settingData.forEach(o=>{
          if(o.enable === 1){
            items.push(o.id)
					}
				})
				const data = {
          property_id:this.propertyId,
          show_last_year:this.dataList[0].enable,
          items:items.toString()
				}
        reportSetting(data).then(()=>{
          this.$message.success('保存成功')
				}).catch(err=>{
          console.log(err)
        })
      },
      getSetting(){
        getReportSetting({property_id:this.propertyId}).then(res=>{
					res = res.data.data;
          this.setting = res;
          const items = res.items && res.items.split(',')
          this.settingData.forEach(o=>{
            this.$set(o,'enable',items && items.includes(String(o.id))?1:0)
					})
        
        })
			},
      getData(){
        getReportSettingItem().then(res=>{
					res = res.data.data;
          this.settingData = res.map(o=>{
            return{
              cname:o.name,
							id:o.id
						}
					})
					this.getSetting()
        })
			}
		},
		created () {
      this.getData()
    }
  }
</script>
