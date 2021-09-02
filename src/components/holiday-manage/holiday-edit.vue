<template>
	<modal ref="modal"  :loading="true" :title="$t(msgTitle)" @onOk="handleSubmit" @onCancel="closeEdit">
		<Form class="edit-form" ref="formInline" :model="datas" :rules="ruleInline"
					:label-width="80">
			<FormItem prop="name" :label="$t('名称')">
				<Input v-model="datas.name"></Input>
			</FormItem>
			<FormItem prop="begin" :label="$t('开始日期')">
				<DatePicker v-model="datas.begin" format="yyyy-MM-dd" :editable="false" type="date"
										:placeholder="$t('holder.选择日期')" @on-change="beginDateDidChange"></DatePicker>
			</FormItem>
			<FormItem prop="end" :label="$t('结束日期')">
				<DatePicker v-model="datas.end" format="yyyy-MM-dd" type="date" :editable="false"
										:placeholder="$t('holder.选择日期')" @on-change="endDateDidChange"></DatePicker>
			</FormItem>
			<FormItem prop="property" :label="$t('活动归属')" class="belongs" v-show="showBelong">
				<Select v-model="datas.property">
					<Option v-for="item in propertyList" :value="item.value" :key="item.value">{{item.label}}</Option>
				</Select>
			</FormItem>
			<FormItem prop="target_enter" :label="$t('目标客流')">
				<Input v-model="datas.target_enter" type="number"></Input>
			</FormItem>
			<FormItem prop="description" :label="$t('描述')">
				<Input type="textarea" v-model="datas.description"></Input>
			</FormItem>
		</Form>
	</modal>
</template>

<script>
  import Modal from '_c/common/Modal.vue'
  import { validName, validRemark } from '@/libs/util'
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
      const validateProperty = (rule, value, callback) => {
        if (value === undefined || value === '') {
          callback(new Error(this.$t('holder.请选择')))
        } else {
          callback()
        }
      }
      const validate = (rule, value, callback) => {
        if (value === undefined || value === '' || value === 'NaN-NaN-NaN') {
          callback(new Error(this.$t('holder.请选择')))
        } else {
          callback()
        }
      }
      return {
        propertyList: [],
        isUpdate: false,
        msgTitle: '添加活动',
        showBelong: false,
        datas: {
          name: '',
          begin: '',
          end: '',
          target_enter: '',
          description: '',
          property: ''
        },
        ruleInline: {
          name: [{ required: true, validator: validName, trigger: 'blur' }],
          begin: [{ required: true, validator: validate, trigger: 'change' }],
          end: [{ required: true, validator: this.validateEndTime, trigger: 'change' }],
          property: [{ required: true, validator: validateProperty, trigger: 'change' }],
          description: [
            { required: false, validator: validRemark, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      validateEndTime (rule, value, callback) {
        if (value === '') {
          callback(new Error(this.$t('请选择结束时间')))
        } else if (moment(value).isBefore(this.datas.begin)) {
          callback(new Error(this.$t('结束时间应晚于开始时间')))
        } else {
          callback()
        }
      },
      formatDate (date) {
        var nDate = new Date(date)
        var year = nDate.getFullYear()
        var month = Number(nDate.getMonth() + 1) >= 10 ? (nDate.getMonth() + 1) : '0' + (nDate.getMonth() + 1)
        var day = Number(nDate.getDate()) >= 10 ? nDate.getDate() : '0' + (nDate.getDate())
        return year + '-' + month + '-' + day
      },
      handleSubmit () {
        var beginString = this.formatDate(this.datas.begin)
        beginString = beginString.indexOf('NaN') > -1 ? '' : beginString
        this.datas.begin = beginString
        var endString = this.formatDate(this.datas.end)
        endString = endString.indexOf('NaN') > -1 ? '' : endString
        this.datas.end = endString
        this.$refs.modal.loading = true
        this.$refs.formInline.validate((valid) => {
          if (valid) {
            this.mok(this.datas)
          } else {
            this.$refs.modal.resetOkButton()
          }
        })
      },
      endDateDidChange (fdate, pdate) {
        this.datas.end = fdate
      },
      beginDateDidChange (fdate, pdate) {
        this.datas.begin = fdate
      },
      closeEdit () {
        this.$refs.formInline.resetFields()
        this.$refs.modal.closeModal()
      },
      mok (row) {
        var toBeEdit = row
        toBeEdit.end = toBeEdit.end + ' 23:59:59'
        toBeEdit.property_id = toBeEdit.property
        if (this.isUpdate) {
          updateActiveDays(toBeEdit).then(res => {
            if (res.data.message.length > 0) {
              this.$message.warning(this.$t('活动名称已存在,请修改'))
              this.$refs.modal.resetOkButton()
            } else {
              this.closeEdit()
              this.$message.success(this.$t('fn.successTo', [this.$t('编辑活动')]))
              this.$emit('initData', 21, false)
            }
          })
        }
        if (!this.isUpdate) {
          var toBeEdit = _.cloneDeep(this.datas)
          toBeEdit.property_id = toBeEdit.property
          toBeEdit.type_id = 21
          toBeEdit.date = this.selectyear
          addActiveDays(toBeEdit).then(res => {
            if (res.data.message.length > 0) {
              this.$message.warning(this.$t('活动名称已存在,请修改'))
              this.$refs.modal.resetOkButton()
            } else {
              this.closeEdit()
              this.$message.success(this.$t('fn.successTo', [this.$t('添加活动')]))
              this.$emit('initData', 21, false)
            }
          })
        }
      }
    }
  }
</script>
