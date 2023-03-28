<template>
	<div class="record-container">
		<div class="common-card flex-between">
			<div class="flex-center">
				<el-cascader
					:options="treeData"
					:props="cascadeProps"
					v-model="defaultValue"
					@change="caseDidChange"
					class="cascader"
				>
				</el-cascader>
				<Button size="large" class="m-l-20" @click="reset" type="primary">重置</Button>
			</div>
		
			<div class="icon-area flex-center">
				<span
					:title="$t('添加')"
					@click="addClick"
				>
					<Icon type="md-add"/>
				</span>
				<span class="formats-add" :title="$t('删除')" @click="deleteClick">
          <Icon type="md-remove"/>
        </span>
			</div>
		</div>
		<table-multiple-selected
			class="m-t-20"
			:tableName='tableName'
			:tableList='tableData'
			:titleName='titleName'
			@statusChange="statusChange"
			@tableData='editData'
			@removeData='deleteData'
			@tableSelect="tableSelect"
			:isMultiple='true'
		></table-multiple-selected>
		<add-record ref="record" :treeData="treeData" @refresh="caseDidChange"></add-record>
	</div>
</template>
<script>
  import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
  import Modal from '_c/common/Modal.vue'
  import { getBzoneTree } from '@/api/home.js'
  import { getRecordList,delRecordData,updateRecord } from '@/api/manager.js'
  import { findParentNodes } from '@/libs/util'

  import addRecord from '_c/entity/components/addRecord.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'Record',
    components: {
      TableMultipleSelected,
      Modal,
      addRecord
    },
		computed:{
      ...mapState({
        propertyId: state => state.home.headerAction,

      }),
		},
    data () {
      return {
        tableName:['实体名称','客流补录增幅','状态','操作'],
        titleName:'补录实体列表',
        tableData:[],
        treeData: [],
        defaultValue: [],
        selected: [],
        cascadeProps: {
          multiple: false,
          checkStrictly: true,
          expandTrigger: 'hover',
          value: 'id',
          label: 'name'
        },
			}
    },
		methods:{
      reset(){
        this.defaultValue = []
				this.caseDidChange()
			},
      deleteData(value){
        this.$alert({
          content: '确定要删除这条数据吗？',
          cancel () {
          },
          confirm: () => {
            delRecordData({id:value.data.id}).then(res=>{
             	if(res.data.code === 200){
                this.$message.success('删除成功')
                this.caseDidChange()
							}else {
             	  this.$message.error(res.data.msg)
							}
            }).catch(err=>{
              console.log(err)
            })
          }
        })
			},
      caseDidChange(value = this.defaultValue){
        getRecordList({bzid:value[value.length-1]}).then(res=>{
					this.tableData = res.data.data.list
          this.tableData.forEach(o=>{
					  o.operation = true
						o.status_num = o.status;
					  delete o.status
					})
        })
      },
      addClick(){
      	this.$refs.record.showModal()
			},
      statusChange(value){
        updateRecord(value.data.id,{status:value.value}).then(res=>{
          if(res.data.code===200){
            this.$message.success('修改成功')
					}else {
            this.$message.error(res.data.msg)
					}
				})
				
      },
      deleteClick(){
        if (!this.selected.length) {
          this.$message.warning('请选择要删除的数据')
        }else {
          this.$alert({
            content: '确定要删除这些数据吗？',
            cancel () {
            },
            confirm: () => {
							const ids = this.selected.map(o=>{
							  return o.id
							})
							delRecordData({id:ids.toString()}).then(res=>{
							  if(res.data.code === 200){
                  this.$message.success('删除成功')
                  this.caseDidChange()
								}else {
							    this.$message.error(res.data.msg)
								}
							
							}).catch(err=>{
                console.log(err)
              })
            }
          })
				}
      },
      tableSelect(value){
        this.selected = value
			},
      getTree(){
        getBzoneTree({ property_id: this.propertyId }).then(res=>{
          this.treeData = res.data.data;
					this.caseDidChange()
        })
			},
      editData(value){
        this.$refs.record.isModify = true;
        this.$refs.record.formData.node = findParentNodes(value.data.bzid,this.treeData,true)
        this.$refs.record.formData.ratio = value.data.ratio;
        this.$refs.record.formData.status = value.data.status_num;
        this.$refs.record.formData.id = value.data.id;
        this.$refs.record.showModal()
				
      }
		},
		mounted () {
      this.getTree()
    }
  }
</script>
<style scoped lang="less">
	.icon-area {
		> * {
			width: 24px;
			height: 24px;
			line-height: 24px;
			border-radius: 50%;
			font-size: 16px;
			text-align: center;
			color: #fff;
			
			&:hover {
				cursor: pointer;
			}
			
			&:nth-child(1) {
				background-color: #2bd9cf;
			}
			
			&:nth-child(2) {
				background-color: #feb33d;
				margin-left: 20px;
			}
		}
	}
</style>
