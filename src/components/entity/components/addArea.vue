<template>
	<modal ref="modal"
				 :width="500"
				 :title="isModify?$t('editArea'):$t('addArea')"
				 @onOk="handleSubmit('formData')"
				 @onCancel="closeEdit">
		<Form :model="formData" label-position="right"
					:label-width="85"
					ref="formData" :rules="ruleInline">
			<FormItem :label="$t('fn.name',[$t('area')])" prop="name">
				<Input type="text" v-model="formData.name" :placeholder="$t('fn.inputHolder', [$t('fn.name',[$t('area')])])"></Input>
			</FormItem>
			<FormItem :label="$t('parentNode')" prop="parentNode" v-if="userLvl==='admin'">
				<el-cascader
					v-model="formData.parentNode"
					:placeholder="$t('fn._', [$t('holder.Select'), $t('parentNode')])"
					class="w-select "
					style="width: 100%"
					:props="cascadeProps"
					:options="parentNodeCascade"
				>
				</el-cascader>
			</FormItem>
			<FormItem :label="$t('areaAsso')" prop="zone" v-if="userLvl=='admin'">
				<Select v-model="formData.zone" multiple>
					<Option v-for="item in zoneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem :label="$t('description')" prop="description" :label-width="85">
				<Input type="textarea" v-model="formData.description" :rows="4"></Input>
			</FormItem>
		</Form>
	</modal>
</template>

<script>
  import _ from 'lodash'
  import Modal from '_c/common/Modal.vue'
  import {deepTraversal} from '@/libs/util'
  import i18n from "@/i18n/i18n";
  import {
    createEntity,
    updateEntity
  } from '@/api/manager.js'
  import { mapState } from 'vuex'

  export default {
    props: {
      editAreaTitle: {
        type: String,
        default: '添加区域'
      },
      zoneList: {
        type: Array,
        required: true
      },
      entityInfo: {
        type: Object,
        required: true
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
    data () {
      const validSelect = (rule, value, callback) => {
        if (value === "" || (rule.field == "zoneIds" && !value[0])) {
          callback(new Error(i18n.t("fn.select", [i18n.t(rule.tips)])));
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
          zone: [],
          description: '',
          parentNode:[]
        },
        ruleInline: {
          name: [{
            required: true,
            message: this.$t('fn.inputHolder', [this.$t('fn.name',[this.$t('area')])]),
            trigger: 'blur'
          },],
          parentNode: [
            {
              required: true,
              tips: "parentNode",
              validator: validSelect,
              trigger: "change",
            },
          ],
          zone: [{
            required: true,
            message: this.$t('holder.Select'),
            trigger: 'change',
            type: 'array'
          }],
        }
      }

    },
    computed: {
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
    methods: {
      showModal(){
        this.$refs.modal.showModal();
      },
      /* 校验表单
			*@method handleSubmit
			*@param {String} name 表单的ref值
			*@return null
			*/
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addArea()
          } else {
            this.$refs.modal.resetOkButton()
          }
        })
      },
      closeEdit () {
        this.$refs.formData.resetFields()
        this.$refs.modal.closeModal()
      },

      addArea () {
        var that = this
        var data = _.cloneDeep(this.formData)
        data.zone_id = data.zone.toString()
        data.parent_id = this.entityInfo.id
        data.type_id = 54//54 区域
        data.type_name = 'area'
        data.property_id = this.propertyId
        if (!this.isModify) {
          createEntity(data).then(res => {
            this.$refs.modal.resetOkButton()
            if (res.data.code === 200) {
              data.id = res.data.data.id
              data.zoneIds = data.zone
              that.closeEdit()
              this.$message.success(this.$t('fn.successTo', [this.$t('addArea')]))
              that.$emit('addTypeData', data)
            }else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
					updateEntity(data.id,data).then(res=>{
            this.$refs.modal.resetOkButton()
						if(res.data.code === 200){
              that.closeEdit()
              this.$message.success(this.$t('fn.successTo', [this.$t('editArea')]))
              that.$emit('updateTypeData', data)
						}else {
              this.$message.error(res.data.msg)
            }
					})
        }
      },
    },
    components: { Modal }
  }
</script>

<style lang="less" scoped>
	.addArea {
		.dialogs-edit {
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 66666;

			.dialogs-edit-bg {
				width: 100%;
				height: 100%;
				background-color: #000;
				opacity: 0.3;
			}

			.dialogs-edit-text {
				position: absolute;
				left: 50%;
				top: 50%;
				margin-left: -250px;
				width: 500px;
				background-color: #fff;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(215, 223, 227, 1);
				box-shadow: 1px 2px 10px 0px rgba(193, 193, 193, 0.2);
				border-radius: 8px;

				.edit-title {
					width: 100%;
					height: 53px;
					line-height: 53px;
					padding-left: 20px;
					background: rgba(242, 242, 242, 1);
					font-size: 18px;
					font-family: PingFangSC-Medium;
					font-weight: 500;
					color: rgba(91, 89, 89, 1)
				}

				.edit-text {
					width: 80%;
					margin-left: 10%;
					padding-top: 20px;
					position: relative;

					.control {
						position: relative;
						width: 52%;
						left: 33%;

						.ivu-btn {
							width: 90px;
							color: #fff;
							outline: none;

							&:nth-child(1) {
								margin-right: 20px;
								background-color: #00a0e9;

								&:hover {
									border: px solid #00a0e9;
								}
							}

							&:nth-child(2) {
								background-color: #fff;
								color: #515a6e;

								&:hover {
									color: #57a3f3;
								}
							}
						}
					}
				}
			}
		}

		.edit-close {
			position: absolute;
			right: -5px;
			top: -5px;
			background: #fff;
			width: 33px;
			height: 33px;
			box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
			border-radius: 5px;
			text-align: center;
			line-height: 33px;
			cursor: pointer;
			transition: all .23s ease .1s;

			&:hover {
				transform: translate(5px, -5px);
				box-shadow: 0 0 0 0 rgba(0, 0, 0, .1)
			}

			i {
				font-size: 20px;
			}
		}

		.ivu-form-item {
			margin-bottom: 24px;
		}
	}
</style>
