<template>
	<modal ref="modal" :width="600"  :title="$t(msgTitle)" @onOk="handleSubmit" @onCancel="closeEdit">
		<Form class="edit-form" ref="formInline" :model="datas" :rules="ruleInline"
					:label-width="80">
			<FormItem prop="name" :label="$t('name')">
				<Input v-model="datas.name"></Input>
			</FormItem>
			<FormItem prop="date" :label="$t('actDate')">
				<DatePicker  style="width: 100%" :value="datas.date" format="yyyy-MM-dd" :editable="false" type="daterange"
										:placeholder="$t('holder.Date')" @on-change="dateDidChange"></DatePicker>
			</FormItem>
<!--			<FormItem prop="end" :label="$t('结束日期')">-->
<!--				<DatePicker v-model="datas.end" format="yyyy-MM-dd" type="date" :editable="false"-->
<!--										:placeholder="$t('holder.Date')" @on-change="endDateDidChange"></DatePicker>-->
<!--			</FormItem>-->
			<FormItem prop="property_id" :label="$t('actBelong')" class="belongs" :disabled="isUpdate" v-show="showBelong">
				<Select v-model="datas.property_id">
					<Option v-for="item in propertyList" :value="item.value" :key="item.value">{{item.label}}</Option>
				</Select>
			</FormItem>
			<FormItem :label="$t('targetEnter')">
				<RadioGroup v-model="targetType" @on-change="targetTypeChange">
					<Radio :label="$t('totalTarget')"  :disabled="!datas.date.length"></Radio>
					<Radio :label="$t('dailyTarget')"  :disabled="!datas.date.length"></Radio>
				</RadioGroup>
			</FormItem>
			<FormItem prop="target_total" style="margin-top: -20px" :label-width="80" v-show="targetType===$t('totalTarget')">
				<Input v-model="datas.target_total" type="number"></Input>
			</FormItem>
			<FormItem prop="target_day" style="margin-top: -30px" :label-width="80" v-show="targetType===$t('dailyTarget')">
				<div class="flex-wrap box">
					<FormItem :prop="`target_daily_${i}`" :label-width="0" class="inner-input" v-for="(date,i) in dateList">
						<Input type="number" v-model="datas[`target_daily_${i}`]">
							<span slot="prepend">{{date}}</span>
						</Input>
					</FormItem>
				</div>
			</FormItem>
			<FormItem prop="description" :label="$t('description')">
				<Input type="textarea" :maxlength="50" v-model="datas.description"></Input>
			</FormItem>
		</Form>
	</modal>
</template>

<script>
  import Modal from '_c/common/Modal.vue'
  import { validName } from '@/libs/util'
  import { addActiveDays, updateActiveDays } from '@/api/manager.js'
  import moment from 'moment'

  export default {
    name: 'editHoliday',
    props: {
      editData: Object
    },
    components: {
      Modal
    },

    computed: {
      ruleInline () {
        let rules = {
          name: [{ required: true, validator: validName, trigger: 'blur' }],
          date: [{ required: true, message:this.$t('fn.select', [this.$t('actDate')]),trigger: 'change',type:'array' }],
          property_id: [{ required: this.showBelong, message:this.$t('fn.select', [this.$t('actBelong')]), trigger: 'change',type:'number' }],
          target_total: [{ required: true, trigger: 'blur',message:this.$t("fn.require", [this.$t("targetEnter")]),}],
        }
        if (this.targetType === this.$t('totalTarget')) {
          return rules
        } else {
          let ruleCopy = _.cloneDeep(rules);
          ruleCopy.target_total[0].required = false;
         	const days = moment(this.datas.date[1]).diff(this.datas.date[0], 'day')
					for (let i = 0;i<=days;i++){
					  ruleCopy[`target_daily_${i}`] = [{ required: true, trigger: 'blur',message:this.$t("fn.require", [this.$t('目标')]) }]
					}
          return ruleCopy
        }
      },

    },
    created () {
      let propertyList = []
      let data = this.$store.state.home.organizationData.property
      let rold_id = this.$store.state.user.role_id
      if (rold_id < 3) {
        data.map(function (m) {
          let obj = {}
          obj.name = m.name
          obj.label = m.name
          obj.value = m.property_id
          obj.id = m.property_id
          propertyList.push(obj)
        })
      } else {
        let checkilist = this.$store.state.user.checklist
        data.map(function (m) {
          if (checkilist.indexOf(m.property_id) > -1) {
            let obj = {}
            obj.name = m.name
            obj.label = m.name
            obj.value = m.property_id
            obj.id = m.property_id
            propertyList.push(obj)
          }
        })
      }
      this.propertyList = propertyList
    },
    data () {

      return {
        propertyList: [],
        isUpdate: false,
        msgTitle:this.$t("fn.add",[this.$t('activity')]),
        showBelong: false,
        targetType: this.$t('totalTarget'),
        value1: 1,
        dateList: [],
        datas: {
          name: '',
          date:[],
          target_total: '',
          description: '',
          property_id: ''
        },
      }
    },
    methods: {
      targetTypeChange(value){
				if(value === this.$t('dailyTarget')){
				  const startDate = this.datas.date[0]
          const days = moment(this.datas.date[1]).diff(startDate, 'day')
					this.dateList = [];
          for(let i = 0;i<=days;i++){
            const date = moment(startDate).add(i,'days').format('MM-DD')
						this.dateList.push(date)
						this.$set(this.datas,`target_daily_${i}`,'')
					}
				}
      },
      handleSubmit () {
        this.$refs.formInline.validate((valid) => {
          if (valid) {
            this.mok(this.datas)
          } else {
            this.$refs.modal.resetOkButton()
          }
        })
      },
      dateDidChange(date){
        this.datas.date = date
				if(this.targetType === this.$t('dailyTarget')){
          this.targetTypeChange(this.targetType)
				}

			},
      closeEdit () {
        this.targetType = this.$t('totalTarget')
				this.$nextTick(()=>{
          this.$refs.formInline.resetFields()
          this.$refs.modal.closeModal()

        })
      },
      mok (row) {
        const data = {
          ...row,
          type_id:21,
          start_date:row.date[0],
          end_date:row.date[1],
          target_type:this.targetType === this.$t('totalTarget')?1:2,
			property_id:row.property_id?row.property_id:row.property
        }
        if(this.targetType === this.$t('totalTarget')){
          data.target_enter = row.target_total
          data.target_type = 1
				}else {
          data.target_type = 2;
          data.target_enter = []
          for(let key in row){
            if(key.indexOf('target_daily_')>-1){
              data.target_enter.push(row[key])
						}
					}
          data.target_enter = data.target_enter.toString()
				}
        if (this.isUpdate){
          updateActiveDays(data,data.id).then(res=>{
            this.closeEdit()
            this.$emit('refresh')
            this.$message.success(this.$t('fn.successTo', [this.$t("fn.edit",[this.$t('activity')])]))
            this.$refs.modal.resetOkButton()
          }).catch(err=>{
            this.$refs.modal.resetOkButton()
					})
				}else {
          addActiveDays(data).then(res=>{
            this.closeEdit()
            this.$message.success(this.$t('fn.successTo', [this.$t("fn.add",[this.$t('activity')])]))
            this.$emit('refresh')
            this.$refs.modal.resetOkButton()
          }).catch(err=>{
            this.$refs.modal.resetOkButton()
          })
				}
      }
    }
  }
</script>
<style>
	.inner-input {
		width: 30%;
		margin: 22px 5px;
	}
	.box{
		max-height: 300px;
		overflow-y: scroll;
	}
</style>
