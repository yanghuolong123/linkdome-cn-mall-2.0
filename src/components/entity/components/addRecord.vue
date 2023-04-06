<template>
	<modal ref="modal"
				 :width="500"
				 :title="isModify?'编辑补录增幅':'添加补录增幅'"
				 @onOk="handleSubmit('formData')"
				 @onCancel="closeEdit">
		<Alert type="warning" show-icon>增幅优先级按照实体的层级越深优先级越高</Alert>
		<Form :model="formData" label-position="right"
					:label-width="85"
					class="form-data m-t-20"
					ref="formData" :rules="ruleInline">
			<FormItem label="类别选择" prop="type" v-show="!isModify">
				<Select v-model="formData.type">
					<Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem label="实体选择" prop="node">
				<el-cascader
					v-model="formData.node"
					:disabled="isModify||(!isModify&&!formData.type)"
					collapse-tags
					class="w-select "
					style="width: 100%"
					:props="cascadeProps"
					:options="filteredTree"
				>
				</el-cascader>
			</FormItem>
			<FormItem label="执行日期" prop="date" >
				<DatePicker :value="formData.date" format="yyyy-MM-dd" @on-change="dateChange" type="daterange" placement="bottom-end" style="width: 100%"></DatePicker>
			</FormItem>
			<FormItem label="执行时间" prop="hourtime">
				<TimePicker v-model="formData.hourtime" confirm type="timerange" placement="bottom-end" style="width: 100%"></TimePicker>
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
  import {filterTreeByType,findCascadeLastLevel,deepFind,getUnique,deepTraversal } from '@/libs/util'
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
			filteredTree(){
        let tree = _.cloneDeep(this.treeData)
				if(!this.isModify){
          switch (this.formData.type) {
            case 'mall':
              return filterTreeByType(tree,['floor','store','gate','area','other']);
            case 'floor':
              let floorTree = filterTreeByType(tree,['store','gate','area','other']);
              deepTraversal(floorTree,'children',t=>{
                if(t.type_name!=='floor'){
                  t.disabled = 'disabled'
                }
              })
              console.log(floorTree)
              return floorTree
            case 'store':
              const storeTree = filterTreeByType(tree,['gate','area','other']);
              deepTraversal(storeTree,'children',t=>{
                if(t.type_name!=='store'){
                  t.disabled = 'disabled'
                }
              })
              this.cascadeDataAddAll(storeTree)
              return storeTree
            case 'gate':
              const gateTree = filterTreeByType(tree,['area','store','other']);
              deepTraversal(gateTree,'children',t=>{
                if(t.type_name!=='gate'){
                  t.disabled = 'disabled'
                }
              })
              this.cascadeDataAddAll(gateTree)
              return gateTree
            case 'area':
              const areaTree = filterTreeByType(tree,['gate','store','other']);
              deepTraversal(areaTree,'children',t=>{
                if(t.type_name!=='area'){
                  t.disabled = 'disabled'
                }
              })
              this.cascadeDataAddAll(areaTree)
              return areaTree

          }
				}else {
				  return tree
				}

			}
		},
    components:{
      Modal
		},
    data(){

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
        typeList:[
					{
					  id:'mall',
						name:'购物中心'
					},{
            id:'floor',
            name:'楼层'
          },{
            id:'gate',
            name:'出入口'
          },{
            id:'area',
            name:'区域'
          },{
            id:'store',
            name:'店铺'
          },
				],
        cascadeProps:{
          checkStrictly: true,
          multiple: true,
          expandTrigger:'hover',
          value:'id',
          label:'name'
        },
        formData:{
          ratio:'',
          node:[],
          status:1,
					date:[],
          hourtime:[],
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
          date:[{  required: true, message: '请选择起始日期',trigger: 'change',type:'array'}],
          hourtime:[{  required: true, message: '请选择起始时间',trigger: 'change',type:'array'}],
				}
			}
		},
		methods:{
      dateChange(val){
        this.$set(this.formData,'date',val)
      },
      updateCascader (arr) {
        // 去重
        arr = getUnique(_.compact(arr))
        // 防止视图不更新
        this.formData.node = []
        this.formData.node = arr
      },
      cascadeDataAddAll (data) {
        findCascadeLastLevel(data, 'children', addAll)
        function addAll (levelNode) {
          const parent_id = levelNode[levelNode.length - 1].parent_id
          levelNode.unshift({
            id: 'all' + parent_id,
            name: i18n.t('全部')
          })
        }
      },
      showModal(){
        this.$refs.modal.showModal();
      },
      addRecord(){
        let node = [];
        this.formData.node.forEach(o=>{
          const lastId = o[o.length-1]
          if(lastId.toString().indexOf('all') === -1){
            node.push(lastId)
					}
				})
        let data = {
          property_id:this.propertyId,
          bzid:node.toString(),
          ratio:this.formData.ratio,
          status:this.formData.status,
          date:this.formData.date.toString(),
          time:this.formData.hourtime.toString(),
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
		},
		watch:{
      'formData.node': {//根据新旧值的差别来判断勾选了全部还是取消了全部
        handler (newval, oldval) {
          if (_.isEmpty(_.differenceWith(newval, oldval, _.isEqual))) {//取消节点
            const dif = _.differenceWith(oldval, newval, _.isEqual)
            if (dif.length > 1) return//dif大于一个节点，为数据的变化，页面是只会一个节点一个节点的勾选
            if (JSON.stringify(dif).indexOf('all') > -1) {//取消的是全部节点
              const pId = dif[0][dif[0].length - 1].substring(3)
              const node = deepFind(this.filteredTree, o => {
                return o.id === Number(pId)
              }, 'children')
              const valueList = node.children.map(o => {
                return JSON.stringify(o.cascadeValue)
              })
              //清除节点
              const cascaderSelectList = _.cloneDeep(this.formData.node)
              for (let i = 0; i < cascaderSelectList.length; i++) {
                if (valueList.includes(JSON.stringify(cascaderSelectList[i]))) {
                  cascaderSelectList.splice(i, 1)
                  i--
                }
              }
              //更新视图
              this.updateCascader(cascaderSelectList)
            }
          } else {
            const dif = _.differenceWith(newval, oldval, _.isEqual)
            if (JSON.stringify(dif).indexOf('all') > -1) {//勾选的是全部节点
              if (dif.length > 1) return
              const pId = dif[0][dif[0].length - 1].substring(3)

              const node = deepFind(this.filteredTree, o => {
                return o.id === Number(pId)
              }, 'children')
              //全选节点
              const cascaderSelectList = this.formData.node.concat(node.children.map(o => {
                return o.cascadeValue
              }))

              this.updateCascader(cascaderSelectList)
            }
          }
        }
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
