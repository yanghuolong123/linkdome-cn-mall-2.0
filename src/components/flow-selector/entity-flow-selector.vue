<template>
	<div class="selector-container common-card">
		<div class="flex-center">
			<i-date-picker class="w-select" :value='queryParams.date1Array' :dType="1"
						   @selectDate="dateSelect"></i-date-picker>
			<Select v-model="compareType" class="w-select m-l-20" @on-change="compareTypeChange">
				<Option v-for="item in typeOptionsCom"
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
		<div class="flex-center raido-group" v-show="compareType === 'entity'">
			<vs-radio v-model="entityType" :vs-value="item.value" :key="item.value" v-for="item in entityOptions"
					  class="mr-4">{{item.label}}
			</vs-radio>
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
					v-show="compareType === 'entity'&& entityType === 'store'"
					class="w-select"
					:placeholder=" $t('holder.请选择') "
					v-model="storeCascadeData"
					filterable
					collapse-tags
					:props="{ multiple: true,expandTrigger:'hover',label:'name',value:'id' }"
					:options="storeCascadeOpiton"
			>
			</el-cascader>
			<el-cascader
					v-show="compareType === 'entity'&& entityType === 'gate'"
					:placeholder=" $t('holder.请选择') "
					class="w-select"
					v-model="gateCascadeData"
					collapse-tags
					:props="{ multiple: true,expandTrigger:'hover',label:'name',value:'id' }"
					:options="gateCascadeOpiton"
			>
			</el-cascader>
			<el-cascader
				v-show="compareType === 'entity'&& entityType === 'bussiness'"
				:placeholder=" $t('holder.请选择') "
				class="w-select"
				v-model="busiCascadeData"
				collapse-tags
				:props="{ multiple: true,expandTrigger:'hover',label:'name',value:'id' }"
				:options="bussinessCascadeOpiton"
			>
			</el-cascader>
			<el-cascader
					v-show="compareType !== 'entity'&&compareType !== 'businessType'"
					:placeholder=" $t('holder.请选择') "
					v-model="entityCascaderData"
					collapse-tags
					class="w-select "
					:props="cascadeProps"
					:options="entityCascaderOption"
			>
			</el-cascader>
			<Select v-model="queryParams.selectList" :max-tag-count="1" multiple class="w-select"
					v-show="compareType === 'entity'&& !['store','gate','bussiness'].includes(entityType) ">
				<Option v-for="item in selectOptions"
						:value="item.id"
						:key="item.id">{{ item.name }}
				</Option>
			</Select>
			<Select v-model="queryParams.range" placeholder="查询粒度" class="w-select m-l-20" :disabled="!(isSingleDay && !(multiQuta&&multiEntity) &&headerData.show_counting_demension)">
				<Option v-for="item in rangeList"
								:value="item.value"
								:key="item.value">{{ item.label }}
				</Option>
			</Select>
			<Button size="large" type="primary" class="m-l-20" @click="handleClick">{{ $t('查询') }}</Button>
			<Button size="large" @click="resetClick" class="m-l-20">{{ $t('重置') }}</Button>
		</div>
	</div>
</template>
<script>
  import { getCompareDate } from '@/libs/util'
  import selectMixin from '@/mixin/selectMixin.js'
  import { getBussinessDict } from '@/api/home'
  import Moment from 'moment'
  import { deepTraversal,findParentNodes } from '../../libs/util'
	import {mapState} from 'vuex'
  export default {
    name: 'flowSelector',
    mixins: [selectMixin],
    data () {
      return {
        bussinessTypeOptions: [],//业态
        rangeList:[
					{
					  label:'5分钟',
						value:'5m'
					},{
            label:'10分钟',
            value:'10m'
          },{
            label:'15分钟',
            value:'15m'
          },{
            label:'30分钟',
            value:'30m'
          },{
            label:'1小时',
						value:'Hour'
					}
				]
      }
    },
    computed: {
      ...mapState({
        headerData:state => state.home.headerData,
      }),
      typeOptionsCom() {
        this.typeOptions.splice(2, 0, {
          value: 'businessType',
          label: this.$t('业态对比')
        })
        return this.typeOptions
      },
			isSingleDay(){
				return this.queryParams.date1Array[0] === this.queryParams.date1Array[1] && this.queryParams.date2Array[0] === this.queryParams.date2Array[1]
			},
			multiEntity(){
        let flag = false;
        if(this.compareType === 'entity'){
          if (this.entityType === 'store'){
            flag = this.storeCascadeData.length>1
					}else if (this.entityType === 'gate'){
            flag = this.gateCascadeData.length>1
          }else if (this.entityType === 'bussiness'){
            flag = this.busiCascadeData.length>1
          }else {
            flag = this.queryParams.selectList.length>1
					}
				}else if(this.compareType === 'businessType'){
          flag = this.queryParams.bussinessType.length >1
				}else {
          flag = this.entityCascaderData.length>1
				}
    return flag
			}
    },
    methods: {
      resetClick () {
        const yesterday = Moment(new Date()).add(-1, 'day').format('YYYY-MM-DD')
        this.queryParams.date1Array = [yesterday,yesterday];
        this.queryParams.range = 'Hour'
        this.compareType = 'not';
        this.setEntityCascaderDataDefaultValue()
      },
      getBussinessDict () {
        getBussinessDict({ property_id: this.$store.state.home.headerAction }).then(res => {
          res = res.data.data
          this.bussinessTypeOptions = [{
            id: -1,
            name: '全部业态'
          }]
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
      paramsPrepare (params) {
        this.$emit('paramsPrepare', params)
      },
      compareTypeChange (val) {
        switch (val) {
          case 'time':
            // 自定义时间
            this.queryParams.date2Array = [
              Moment().format('YYYY-MM-DD'),
              Moment().format('YYYY-MM-DD')
            ]
            break
          case 'onYear':
          case 'onChain':
            this.queryParams.date2Array = getCompareDate(this.queryParams.date1Array,val)
            break;
          case 'not':
            this.queryParams.date2Array = []
            break
          case 'entity':
            this.queryParams.selectList = this.selectOptions.map(o => {
              return o.id
            })
            break
		  case 'businessType':
            this.queryParams.bussinessType = this.bussinessTypeOptions.map(o => {
              return o.id
            })
			break
        }
      },
      handleBussinessTreeData (data) {
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
    watch: {
      'isSingleDay':{
        handler(newval, oldval){
          if(!newval){
            this.queryParams.range = ''
					}else {
            this.queryParams.range = 'Hour'
					}
				}
			},
      'queryParams.bussinessType': {
        handler (newval, oldval) {
          if (_.differenceWith(newval, oldval)[0] === -1) {
            this.queryParams.bussinessType = this.bussinessTypeOptions.map(o => {
              return o.id
            })
          }
          if (_.differenceWith(oldval, newval)[0] === -1) {
            this.queryParams.bussinessType = []
          }
          if (this.queryParams.bussinessType.length === 1 && this.queryParams.bussinessType[0] === -1) {
            this.queryParams.bussinessType = []
          }
        },
        deep: true
      },
      '$store.state.home.headerAction': {
        handler () {
          this.getStoreCascadeOpiton()
          this.bussinessTreeReq().then(res => {
            this.getSelectOption(res) //获取实体选择时多选下拉框
            this.handleBussinessTreeData(res)
          }).catch(err => {
            console.log(err)
          })
        },
        immediate: true,
      },
    },
    created () {
      this.queryParams.range = 'Hour'
      //获取所有业态
      this.getBussinessDict()
      this.getIndustry()
    }
  }
</script>
