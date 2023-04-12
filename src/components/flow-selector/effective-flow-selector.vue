<template>
	<div class="selector-container bg-white box-card">
		<div class="flex-center">
			<i-date-picker class="w-select" :value='queryParams.date1Array' :dType="1" @selectDate="dateSelect"></i-date-picker>
			<Select v-model="compareType" class="w-select m-l-20" @on-change="compareTypeChange">
				<Option v-for="item in typeOptionsCom" :value="item.value" :key="item.value">{{ item.label }}</Option>
			</Select>
			<i-date-picker :disabled="['onYear','onChain'].includes(compareType)"
						   class="w-select m-l-20"
						   v-show="['time','onYear','onChain'].includes(compareType)"
						   :dType="2"
						   :value='queryParams.date2Array'
						   @selectDate="dateSelect"></i-date-picker>
		</div>
		<div class="flex-center mt-20">
			<Select v-model="queryParams.bussinessType" class="w-select"
							v-show="compareType === 'businessType'">
				<Option v-for="item in bussinessTypeOptions"
								:value="item.id"
								:key="item.id">{{ item.name }}
				</Option>
			</Select>
			<el-cascader
					v-show="compareType !== 'businessType'"
					v-model="entityCascaderData"
					collapse-tags
					class="w-select "
					:props="cascadeProps"
					:options="entityCascaderOption"
			>
			</el-cascader>
			<Button size="large" type="primary" class="m-l-20" @click="handleClick">{{ $t('查询') }}</Button>
			<Button size="large" @click="resetClick" class="m-l-20">{{ $t('重置') }}</Button>
		</div>
	</div>
</template>
<script>
import Moment from 'moment'
import selectMixin from '@/mixin/selectMixin.js'
import { deepTraversal,findParentNodes,deepFind } from '../../libs/util'

import { getBussinessDict } from '@/api/home'
const yesterday = Moment(new Date()).add(-1, 'day').format('YYYY-MM-DD')

export default {
  name: 'effectiveFlowSelector',
  mixins: [selectMixin],
	data(){
      return{
        typeOptions: [],
        queryParams: {
          date1Array: [yesterday,yesterday],
          date2Array: [],
          bussinessType:'',
        },

	  }
	},
  computed: {
    typeOptionsCom() {
      this.typeOptions = [
        {
          value: 'not',
          label: this.$t('无对比')
        }, {
          value: 'businessType',
          label: this.$t('业态')
        },{
          value: 'time',
          label: this.$t('自定义时间对比')
        },
        {
          value: 'onYear',
          label: this.$t('同比')
        },
        {
          value: 'onChain',
          label: this.$t('环比')
        }
      ]
      return this.typeOptions
    },
  },
	methods: {
    getBussinessDict () {
      getBussinessDict({ property_id: this.$store.state.home.headerAction }).then(res => {
        res = res.data.data
        if (res) {
          for (let key in res) {
            this.bussinessTypeOptions.push({
              id: key,
              name: res[key]
            })
          }
        }
      })
    },
    resetClick () {
      this.queryParams.date1Array = [Moment(yesterday).add(-6,'d').format('YYYY-MM-DD'),yesterday];
      this.entityCascaderData = []
      this.compareType = 'not';
      this.setEntityCascaderDataDefaultValue()
    },
    handleBussinessTreeData(data){
      deepTraversal(data,'children',o=>{
        this.$set(o,'disabled',false)
        const parentNodes = findParentNodes(o.id,data,true)
        this.$set(o,'cascadeValue',parentNodes)
      })
      this.entityCascaderOption = data
    	 this.handleEntityPrivilege()
      //给级联设置默认值
      this.setEntityCascaderDataDefaultValue()
      this.handleClick()
      this.cascadeDataAddAll(this.entityCascaderOption)
    },

	},
	created(){
	  this.queryParams.date1Array[0] = Moment(yesterday).add(-6,'d').format('YYYY-MM-DD')
    //获取所有业态
    this.getBussinessDict()
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
