<template>
	<modal ref="modal"
				 :width="500"
				 :title="isModify?'编辑补录增幅':'添加补录增幅'"
				 @onOk="handleSubmit('formData')"
				 @onCancel="closeEdit">
		<Form :model="formData" label-position="right"
					:label-width="85"
					class="form-data"
					ref="formData" :rules="ruleInline">
			<FormItem label="实体选择" prop="node">
				<el-cascader
					v-model="formData.node"
					class="w-select "
					style="width: 100%"
					:props="cascadeProps"
					:options="treeData"
				>
				</el-cascader>
			</FormItem>
			<FormItem label="补录增幅" prop="ratio" class="p-r">
				<Input type="number" v-model="formData.ratio" placeholder="请输入补录增幅"></Input>
				<span class="p-a percent">%</span>
			</FormItem>
			<FormItem :label="$t('状态')" prop="status">
				<Select v-model="formData.status">
					<Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</FormItem>
		</Form>
	</modal>
</template>
<script>
  import Modal from '_c/common/Modal.vue'
  import {createRecord ,updateRecord} from '@/api/manager.js'
  import i18n from "@/i18n/i18n";
  import { mapState } from 'vuex'

  export default {
    props:{
      treeData:{
        type:Array,
				default:()=>[]
			},
		},
		computed:{
      ...mapState({
        propertyId: state => state.home.headerAction,

      }),
		},
    components:{
      Modal
		},
    data(){
      const validSelect = (rule, value, callback) => {
        if (value === "" || (rule.field == "node" && !value[0])) {
          callback(new Error(i18n.t("fn.请选择", [i18n.t(rule.tips)])));
        } else {
          callback();
        }
      };
      const validRatio = (rule, value, callback) => {
        if (value === "") {
          callback(new Error('请输入补录增幅'));
        } else {
          callback();
        }
      };
      return{
        isModify:false,
        statusList:[
					{
					  name:'启用',
						id:1
					},{
            name:'禁用',
            id:0
					}
				],
        cascadeProps:{
          checkStrictly: true,
          expandTrigger:'hover',
          value:'id',
          label:'name'
        },
        formData:{
          ratio:'',
          node:[],
          status:1
				},
        ruleInline:{
          node: [
            {
              required: true,
              tips: "实体",
              validator: validSelect,
              trigger: "change",
            },
          ],
          ratio: [{
            required: true,
            message: '请输入补录增幅',
            validator: validRatio,
            trigger: 'blur',
          }],
				}
			}
		},
		methods:{
      showModal(){
        this.$refs.modal.showModal();
      },
      addRecord(){
        const data = {
          property_id:this.propertyId,
          bzid:this.formData.node[this.formData.node.length-1],
          ratio:this.formData.ratio,
          status:this.formData.status
        }
        if(this.isModify){
          updateRecord(this.formData.id,data).then(res=>{
            if(res.data.code === 200){
              this.$message.success('修改成功');
              this.$emit('refresh')
              this.closeEdit()
            }else {
              this.$message.error(res.data.msg)
              this.$refs.modal.resetOkButton()
            }
					})
				}else {
          createRecord(data).then(res=>{
            if(res.data.code === 200){
              this.$message.success('添加成功');
              this.$emit('refresh')
              this.closeEdit()
						}else {
              this.$message.error(res.data.msg)
              this.$refs.modal.resetOkButton()
						}
          
          }).catch(err=>{
            console.log(err)
          })
				}


			},
      handleSubmit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addRecord()
          } else {
            this.$refs.modal.resetOkButton()
          }
        })
			},
      closeEdit () {
        this.$refs.formData.resetFields()
        this.$refs.modal.closeModal()
      },
		}
	}
</script>
<style lang="less" scoped>
	.p-r{
		position: relative;
	}
	.percent{
		position: absolute;
		color: grey;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
	}
	
	/* 关键样式 */
	.form-data /deep/ input::-webkit-outer-spin-button,
	.form-data /deep/ input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
</style>
