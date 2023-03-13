<template>
	<modal ref="modal"
				 :width="500"
				 :title="isModify?$t('编辑出入口'):$t('添加出入口')"
				 @onOk="handleSubmit('formData')"
				 @onCancel="closeEdit">
		<Form :model="formData" label-position="right" :label-width="100" ref="formData" :rules="ruleInline">
			<FormItem :label="$t('出入口名称')" prop="name">
				<Input type="text" v-model="formData.name"  :placeholder="$t('fn.请输入', [$t('出入口名称')])"></Input>
			</FormItem>
			<FormItem :label="$t('父节点')" prop="parentNode" v-if="userLvl==='admin'">
				<el-cascader
					v-model="formData.parentNode"
					:placeholder="$t('fn._', [$t('holder.请选择'), $t('父节点')])"
					class="w-select "
					style="width: 100%"
					:props="cascadeProps"
					:options="parentNodeCascade"
				>
				</el-cascader>
			</FormItem>
			<FormItem :label="$t('出入口关联')" prop="gate_id" v-if="userLvl==='admin'">
				<Select v-model="formData.gate_id">
					<Option v-for="item in gateList" :value="item.id" :key="item.id">{{item.name}}</Option>
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
  import i18n from "@/i18n/i18n";
  import {
    createEntity,
    updateEntity
  } from '@/api/manager.js'
  import { mapState } from 'vuex'
  import {deepTraversal} from '@/libs/util'
  export default {
    props: {
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
			tree:{
        type: Array,
        default: []
			}
    },
    inject: ['getGateTypeList'],
    data () {
      const validSelect = (rule, value, callback) => {
        if (value === "" || (rule.field == "zoneIds" && !value[0])) {
          callback(new Error(i18n.t("fn.请选择", [i18n.t(rule.tips)])));
        } else {
          callback();
        }
      };
      return {
        isModify: false,
        cascadeProps:{
          checkStrictly: true,
          expandTrigger:'hover',
          value:'id',
          label:'name'
        },
        formData: {
          name: '',
          gate_id: '',
          description: '',
          gate_type: '',
          parentNode:[]
        },
        ruleInline: {
          name: [{
            required: true,
            message:this.$t('fn.请输入',[this.$t('出入口名称')]),
            trigger: 'blur'
          },],
          parentNode: [
            {
              required: true,
              tips: "父节点",
              validator: validSelect,
              trigger: "change",
            },
          ],
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
      parentNodeCascade(){
        //出入口只能挂在楼层和其他下面
        let tree = _.cloneDeep(this.tree);
        deepTraversal(tree,'children',t=>{
          if(['mall','gate','area','store'].includes(t.type_name)){
            t.disabled = 'disabled'
          }
        })
        return tree
      },
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
        data.parent_id = this.formData.parentNode[this.formData.parentNode.length-1]
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
            }else {
              this.$message.error(res.data.msg)
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
            }else {
              this.$message.error(res.data.msg)
            }
					})

        }
      },
      showModal(){
        this.$refs.modal.showModal();
			},
    }
  }
</script>
