<template>
	<div class="selector-container bg-white box-card">
		<div class="flex-center">
			<i-date-picker class="w-select" :value='queryParams.date1Array' :dType="1"
				@selectDate="dateSelect"
			></i-date-picker>
			<Select v-model="compareType" class="w-select m-l-20" @on-change="compareTypeChange">
				<Option v-for="item in typeOptions"
					:value="item.value"
					:key="item.value">
					{{ $t(item.label) }}
				</Option>
			</Select>
			<i-date-picker
				:disabled="['onYear','onChain'].includes(compareType)"
				class="w-select m-l-20"
				v-show="['time','onYear','onChain'].includes(compareType)"
				:dType="2"
				:value='queryParams.date2Array'
				@selectDate="dateSelect"
			></i-date-picker>
		</div>
		<div class="flex-center raido-group" v-show="compareType === 'entity'">
			<vs-radio v-model="entityType" :vs-value="item.value" :key="item.value" v-for="item in entityOptions" class="mr-4">
				{{ $t(item.label) }}
			</vs-radio>
		</div>
		<div class="flex-center mt-20">
			<el-cascader
				v-show="compareType === 'entity'&& entityType === 'store'"
				class="w-select"
				v-model="storeCascadeData"
				collapse-tags
				:props="cascadeProps"
				:options="storeCascadeOpiton"
			></el-cascader>
			<el-cascader
				v-show="compareType !== 'entity'"
				v-model="entityCascaderData"
				collapse-tags
				class="w-select "
				:props="cascadeProps"
				:options="entityCascaderOption"
			></el-cascader>
			<el-cascader
				v-show="compareType === 'entity'&& entityType === 'bussiness'"
				:placeholder=" $t('holder.Select') "
				class="w-select"
				v-model="busiCascadeData"
				collapse-tags
				:props="{ multiple: true,expandTrigger:'hover',label:'name',value:'id' }"
				:options="bussinessCascadeOpiton"
			>
			</el-cascader>
			<Select v-model="queryParams.selectList" :max-tag-count="1" multiple class="w-select"
					v-show="compareType === 'entity'&&!['store','gate','bussiness'].includes(entityType)">
				<Option v-for="item in selectOptions"
					:value="item.id"
					:key="item.id">
					{{ $t(item.name) }}
				</Option>
			</Select>
			<Select v-model="queryParams.enterType" class="w-select m-l-20">
				<Option v-for="item in customType"
					:value="item.value"
					:key="item.value">
					{{ $t(item.label) }}
				</Option>
			</Select>
			<Button size="large" type="primary" class="m-l-20" @click="handleClick">{{ $t('query') }}</Button>
			<Button size="large" @click="resetClick" class="m-l-20">{{ $t('reset') }}</Button>
		</div>
	</div>
</template>
<script>
  import selectMixin from '@/mixin/selectMixin.js'
  import { deepTraversal,findParentNodes,filterTreeByType } from '@/libs/util'

  export default {
	name: 'dwellTimeFlowSelector',
	mixins: [selectMixin],
	watch:{
		'$store.state.home.headerAction':{
			handler(){
				this.getStoreCascadeOpiton();
				this.bussinessTreeReq().then(res=>{
					this.getSelectOption(res); //获取实体选择时多选下拉框
					this.handleBussinessTreeData(res)
				}).catch(err=>{
					console.log(err)
				})
			},
			immediate:true
		},
	},
	data () {
		return {

		}
	},
		computed:{
	 		entityOptions(){
	 		  return [
          {
            label:'shopmall',
            value:'mall'
          },{
            label:'floor',
            value:'floor'
          }, {
            label:'store',
            value:'store'
          }, {
            label:'area',
            value:'area'
          },{
            label: this.$t('bussinessType'),
            value: 'bussiness',
            cascadeOption:this.bussinessCascadeOpiton,
            cascadeData:this.busiCascadeData
          },
        ]
			}
		},
	methods:{
      handleBussinessTreeData(data){
        deepTraversal(data,'children',o=>{
          this.$set(o,'disabled',false)
          const parentNodes = findParentNodes(o.id,data,true)
          this.$set(o,'cascadeValue',parentNodes)
        })
				//去掉出入口
        this.entityCascaderOption = filterTreeByType(data,['gate'])
        this.handleEntityPrivilege()
        //给级联设置默认值
        this.setEntityCascaderDataDefaultValue()
        this.handleClick()
        this.cascadeDataAddAll(this.entityCascaderOption)
      },
	},
		created () {
      this.getIndustry()
    }
  }
</script>
