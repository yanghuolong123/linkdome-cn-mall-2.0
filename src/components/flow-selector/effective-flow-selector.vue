<template>
	<div class="selector-container bg-white box-card">
		<div class="flex-center">
			<i-date-picker class="w-select" :value='queryParams.date1Array' :dType="1"
						   @selectDate="dateSelect"></i-date-picker>
			<Select v-model="compareType" class="w-select m-l-20" @on-change="compareTypeChange">
				<Option v-for="item in typeOptions"
						:value="item.value"
						:key="item.value">{{ item.label }}
				</Option>
			</Select>
			<i-date-picker :disabled="['onYear','onChain'].includes(compareType)"
						   class="w-select m-l-20"
						   v-show="['time','onYear','onChain'].includes(compareType)"
						   :dType="2"
						   :value='queryParams.date2Array'
						   @selectDate="dateSelect"></i-date-picker>
		</div>
		<div class="flex-center mt-20">
			<el-cascader
					v-model="entityCascaderData"
					collapse-tags
					class="w-select "
					:props="cascadeProps"
					:options="entityCascaderOption"
			>
			</el-cascader>
			<Button size="large" type="primary" class="m-l-20" @click="handleClick">查询</Button>
			<Button size="large" @click="resetClick" class="m-l-20">重置</Button>
		</div>
	</div>
</template>
<script>
  import Moment from 'moment'
  import selectMixin from '@/mixin/selectMixin.js'
  import {formatEntityData,deepFind} from '@/libs/util'
  const yesterday = Moment(new Date()).add(-1, 'day').format('YYYY-MM-DD')

  export default {
    name: 'effectiveFlowSelector',
    mixins: [selectMixin],
	data(){
      return{
        typeOptions: [
          {
            value: 'not',
            label: '无对比'
          }, {
            value: 'time',
            label: '自定义时间对比'
          },
          {
            value: 'onYear',
            label: '同比'
          },
          {
            value: 'onChain',
            label: '环比'
          }
        ],
        cascadeProps:{
          multiple: false,
          checkStrictly: true,
          expandTrigger:'hover'
        },
	  }
	},
	methods:{
      resetClick () {
        this.queryParams.date1Array = [Moment(yesterday).add(-6,'d').format('YYYY-MM-DD'),yesterday];
        this.entityCascaderData = []
        this.compareType = 'not';
        this.setEntityCascaderDataDefaultValue()
      },
      handleBussinessTreeData(data){
        const cascadeAuthData = _.cloneDeep(data).filter(o => { return o.property_id === this.$store.state.home.headerAction })
        this.entityCascaderOption = _.compact(formatEntityData(cascadeAuthData, this.$store.state.user.role_id, this.$store.state.user.checklist))
        this.handleEntityPrivilege()
        //给级联设置默认值
        this.setEntityCascaderDataDefaultValue()
        this.handleClick()
      },
      setEntityCascaderDataDefaultValue(){
        if(this.$store.state.user.role_id<3){
          this.entityCascaderData = this.entityCascaderOption[0].cascadeValue
        }else {
          const node = deepFind(this.entityCascaderOption,o=>{
            return o.disabled===false
          },'children')
          if(node){
            this.entityCascaderData = node.cascadeValue
          }
        }
      },
	},
	created(){
	  this.queryParams.date1Array[0] = Moment(yesterday).add(-6,'d').format('YYYY-MM-DD')
	},
    watch:{
      '$store.state.home.headerAction':{
        handler(){
          this.getStoreCascadeOpiton();
          this.bussinessTreeReq().then(res=>{
            this.handleBussinessTreeData(res)
          }).catch(err=>{
            console.log(err)
          })
        },
        immediate:true
      },
    }
  }
</script>
