<template>
	<div class="selector-container bg-white box-card">
		<!-- <div class="flex-center">
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
		</div> -->
		<!-- <div class="flex-center raido-group" v-show="compareType === 'entity'">
			<vs-radio v-model="entityType" :vs-value="item.value" :key="item.value" v-for="item in entityOptions"
					  class="mr-4">{{item.label}}
			</vs-radio>
		</div> -->
		<div class="flex-center mt-20">
			<!-- <el-cascader
					v-show="compareType === 'entity'&& entityType === 'store'"
					class="w-select"
					v-model="storeCascadeData"
					collapse-tags
					:props="{ multiple: true,expandTrigger:'hover' }"
					:options="storeCascadeOpiton"
			>
			</el-cascader> -->
      <i-date-picker class="w-select" :value='queryParams.date1Array' :dType="1"
						   @selectDate="dateSelect"></i-date-picker>
			<el-cascader
					v-show="compareType !== 'entity'"
					v-model="entityCascaderData"
					collapse-tags
					class="w-select "
					:props="cascadeProps"
					:options="entityCascaderOption"
          style="margin-left:20px;"
			>
			</el-cascader>
			<!-- <Select v-model="queryParams.selectList" :max-tag-count="1" multiple class="w-select"
					v-show="compareType === 'entity'&& entityType !== 'store'">
				<Option v-for="item in selectOptions"
						:value="item.id"
						:key="item.id">{{ item.label }}
				</Option>
			</Select> -->
			<Button size="large" type="primary" class="m-l-20" @click="handleClick">查询</Button>
			<Button size="large" @click="resetClick" class="m-l-20">重置</Button>
		</div>
	</div>
</template>
<script>
  import selectMixin from '@/mixin/selectMixin.js'
  import { formatEntityData, getCascadeFstLeaf} from '@/libs/util'

  export default {
    name: 'saleFlowSelector',
    mixins: [selectMixin],
    data () {
      return {
        entityOptions: [
          {
            label: '购物中心',
            value: 'shop'
          }
        ],
        cascadeProps: {
          multiple: true,
          checkStrictly: true,
          expandTrigger: 'hover'
        },
      }
    },
    methods: {
      handleBussinessTreeData (data) {
        const cascadeAuthData = _.cloneDeep(data).filter(o => {
          return o.property_id === this.$store.state.home.headerAction
        })
        this.entityCascaderOption = _.compact(formatEntityData(cascadeAuthData, this.$store.state.user.role_id, this.$store.state.user.checklist))
        this.entityCascaderOption.forEach(list => {
          delete list.children
        })
        this.handleEntityPrivilege()
        //给级联设置默认值
        this.setEntityCascaderDataDefaultValue()
        this.handleClick()
      },
    },
    watch: {
      '$store.state.home.headerAction': {
        handler () {
          this.getStoreCascadeOpiton()
          this.bussinessTreeReq().then(res => {
            this.getSelectOption(res); //获取实体选择时多选下拉框
            this.handleBussinessTreeData(res)
          }).catch(err => {
            console.log(err)
          })
        },
        immediate: true
      },
    },
  }
</script>
