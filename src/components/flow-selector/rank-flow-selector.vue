<template>
	<div class="selector-container bg-white box-card">
		<div class="flex-center">
			<i-date-picker class="w-select" :value='queryParams.date1Array' :dType="1" @selectDate="dateSelect"></i-date-picker>
			<Select v-model="compareType" class="w-select m-l-20" @on-change="compareTypeChange">
				<Option v-for="item in typeOptionsCom"
								:value="item.value"
								:key="item.value">{{ item.label }}
				</Option>
			</Select>
		</div>
		<div class="flex-center raido-group" v-show="compareType === 'entity'">
			<vs-radio v-model="entityType" :vs-value="item.value" :key="item.value"  v-for="item in entityOptions" class="mr-4">{{$t(item.label)}}</vs-radio>
		</div>
		<div class="flex-center mt-20">
			<Select v-model="queryParams.bussinessType" :max-tag-count="1" multiple class="w-select"
							v-show="compareType === 'businessType'">
				<Option v-for="item in bussinessTypeOptions"
								:value="item.id"
								:key="item.id">{{ item.name }}
				</Option>
			</Select>
			<el-cascader
					v-show=" compareType === 'entity'&& entityType === 'store'"
					class="w-select"
					v-model="storeCascadeData"
					collapse-tags
					:props="{ multiple: true,expandTrigger:'hover',label:'name',value:'id' }"
					:options="storeCascadeOpiton"
			>
			</el-cascader>
			<el-cascader
					v-show="compareType === 'entity'&& entityType === 'gate'"
					class="w-select"
					v-model="gateCascadeData"
					collapse-tags
					:props="{ multiple: true,expandTrigger:'hover',label:'name',value:'id' }"
					:options="gateCascadeOpiton"
			>
			</el-cascader>
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
			<Select v-model="queryParams.selectList"
							:max-tag-count="1" multiple class="w-select"
							v-show=" compareType === 'entity'&& !['store','gate','bussiness'].includes(entityType) ">
				<Option v-for="item in selectOptions"
						:value="item.id"
						:key="item.id">{{ item.name }}</Option>
			</Select>
			<Button size="large" type="primary" class="m-l-20" @click="handleClick">{{ $t('query') }}</Button>
			<Button size="large" @click="resetClick" class="m-l-20">{{ $t('reset') }}</Button>
		</div>
	</div>
</template>
<script>
  import Moment from 'moment'
  import selectMixin from '@/mixin/selectMixin.js'
  const yesterday = Moment(new Date()).add(-1, 'day').format('YYYY-MM-DD')
	export default {
	  name:'rankFlowSelector',
      mixins: [selectMixin],
	  data(){
	    return{

          compareType:'entity',
					typeOptionsCom:[
            {
              value: 'entity',
              label: this.$t('entityComp')
            },
            {
							value: 'businessType',
							label: this.$t('bussComp')
						}
					]
		}
	  },
	  methods:{
        resetClick () {
          this.queryParams.date1Array = [yesterday,yesterday];
          this.entityType = 'floor';
          this.compareTypeChange('entity')
        },
	  },
      watch:{
        '$store.state.home.headerAction':{
          handler(){
            this.getStoreCascadeOpiton();
            this.bussinessTreeReq().then(res=>{
              this.getSelectOption(res); //获取实体选择时多选下拉框
              this.compareTypeChange('entity')
              this.handleClick()
            })
          },
          immediate:true
        },
      },
    created () {
      //获取所有业态
      this.getBussinessDict()
      this.getIndustry()
    }
	}
</script>
