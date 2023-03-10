<template>
	<modal ref="modal"
				 :width="500"
				 :title="$t(editDoorWayTitle)"
				 @onOk="handleSubmit('formData')"
				 @onCancel="closeEdit">
		<Form :model="formData" label-position="right" :label-width="100" ref="formData" :rules="ruleInline">
			<FormItem :label="$t('出入口名称')" prop="name">
				<Input type="text" v-model="formData.name"  :placeholder="$t('fn.请输入', [$t('出入口名称')])"></Input>
			</FormItem>
			<FormItem :label="$t('出入口关联')" prop="gate_id" v-if="userLvl==='admin'">
				<Select v-model="formData.gate_id">
					<Option v-for="item in gateList" :value="item.value" :key="item.value">{{item.label}}</Option>
				</Select>
			</FormItem>
			<FormItem :label="$t('出入口类型')" prop="gate_type">
				<Select v-model="formData.gate_type">
					<Option v-for="item in gateTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
				</Select>
			</FormItem>
			<FormItem :label="$t('描述')" prop="description" :label-width="100">
				<Input type="textarea" v-model="formData.description" :rows="4"></Input>
			</FormItem>
		</Form>
	</modal>
</template>

<script>
  import _ from 'lodash'
  import Modal from '_c/common/Modal.vue'
  import {
    addGate,
    updateFloorGate,
    createEntity,
    updateEntity
  } from '@/api/manager.js'
  import { mapState } from 'vuex'

  export default {
    props: {
      editDoorWayTitle: {
        type: String,
        default: '添加出入口'
      },
      entityInfo: {
        type: Object,
        required: true,
        default:()=>{}
      },
      gateList: {
        type: Array,
        default: []
      },
      userLvl: {
        type: String,
        default: 'admin'
      },
    },
    inject: ['getGateTypeList'],
    data () {
      return {
        isModify: false,
        formData: {
          name: '',
          gate_id: '',
          description: '',
          gate_type: ''
        },
        ruleInline: {
          name: [{
            required: true,
            message:this.$t('fn.请输入',[this.$t('出入口名称')]),
            trigger: 'blur'
          },],
          gate_id: [{
            required: true,
            message: this.$t('请选择'),
            trigger: 'change',
            type: 'number'
          }],
          gate_type: [{
            required: true,
            message: this.$t('请选择'),
            trigger: 'change',
            type: 'number'
          }],
        },
      }

    },
    computed: {
      gateTypeList () {
        return this.getGateTypeList() || []
      },
      ...mapState({
        propertyId: state => state.home.headerAction,
      }),
    },
    components:{Modal},
    methods: {
      /* 校验表单
			*@method handleSubmit
			*@param {String} name 表单的ref值
			*@return null
			*/
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addDoorWay()
          } else {
            this.$refs.modal.resetOkButton()
          }
        })
      },
      closeEdit () {
        this.$refs.formData.resetFields()
        this.$refs.modal.closeModal()
      },
      addDoorWay () {
        var that = this
        let data = _.cloneDeep(this.formData)
        data.zoneIds = [this.formData.gate_id]
        data.parent_id = this.entityInfo.id
        data.type_id = 502//502 出入口
        data.type_name = 'gate'
        data.property_id = this.propertyId
				data.zone_id = this.formData.gate_id
        if (!this.isModify) {
          createEntity(data).then(res=>{
            this.$refs.modal.resetOkButton()
            if (res.data.code === 200) {
              data.id = res.data.data.id
              that.closeEdit()
              this.$message.success(this.$t('fn.successTo', [this.$t('添加出入口')]))
              that.$emit('addTypeData', data)
            }
					})

        } else {
          that.gate_id = that.formData.gate_id
					updateEntity(data.id,data).then(res=>{
            this.$refs.modal.resetOkButton()
            if (res.data.code === 200) {
              that.closeEdit()
              this.$message.success(this.$t('fn.successTo', [this.$t('编辑出入口')]))
              that.$emit('updateTypeData', data)
            }
					})

        }
      },
    }
  }
</script>
