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
        <div class="common-card m-t-20">
            <table-multiple-selected
                    class=" tables"
                    :tableName='tableName'
                    :tableList='tableData'
                    :titleName='titleName'
                    @statusChange="statusChange"
                    @tableData='editData'
                    @removeData='deleteData'
                    @tableSelect="tableSelect"
                    :isMultiple='true'
            ></table-multiple-selected>
            <div class="paginations">
                <vs-pagination
                        :total="eventTotal"
                        v-model="currentActive"
                        goto
                ></vs-pagination>
            </div>
        </div>

        <add-record ref="record" :treeData="treeData" @refresh="caseDidChange"></add-record>
    </div>
</template>
<script>
  import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
  import Modal from '_c/common/Modal.vue'
  import { getBzoneTree } from '@/api/home.js'
  import { getRecordList, delRecordData, updateRecord } from '@/api/manager.js'
  import { findParentNodes, deepTraversal } from '@/libs/util'

  import addRecord from '_c/entity/components/addRecord.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'Record',
    components: {
      TableMultipleSelected,
      Modal,
      addRecord
    },
    computed: {
      ...mapState({
        propertyId: state => state.home.headerAction,

      }),
    },
    data () {
      return {
        tableName: ['实体名称', '客流补录增幅', '执行日期', '执行时间', '状态', '操作'],
        titleName: '补录实体列表',
        tableData: [],
        treeData: [],
        defaultValue: [],
        eventTotal: 1,
        currentActive: 1,
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
    methods: {
      reset () {
        this.defaultValue = []
        this.caseDidChange()
      },
      deleteData (value) {
        this.$alert({
          content: '确定要删除这条数据吗？',
          cancel () {
          },
          confirm: () => {
            delRecordData({ id: value.data.id }).then(res => {
              if (res.data.code === 200) {
                this.$message.success('删除成功')
                this.caseDidChange()
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        })
      },
      caseDidChange (value = this.defaultValue) {
        getRecordList({ bzid: value[value.length - 1] }).then(res => {
          this.eventAllData = res.data.data.list
          this.eventAllData.forEach(o => {
            if (!o.exec_time) {
              o.exec_time = ' '
            }
            if (!o.exec_date) {
              o.exec_date = ' '
            }
          })
          this.eventTotal = Math.ceil(this.eventAllData.length / 5)
          this.eventAllData.forEach(o => {
            o.operation = true
            o.status_num = o.status
            o.begin = o.start_time
            o.end = o.end_time
            delete o.status
          })
          this.tableData = _.cloneDeep(this.eventAllData).splice(0, 5)
          this.currentActive = 1
        }).catch(err => {
          this.eventTotal = 1
        })
      },
      addClick () {
        this.$refs.record.isModify = false
        this.$refs.record.showModal()
      },
      statusChange (value) {
        updateRecord(value.data.id, { status: value.value }).then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功')
          } else {
            this.$message.error(res.data.msg)
          }
        })

      },
      deleteClick () {
        if (!this.selected.length) {
          this.$message.warning('请选择要删除的数据')
        } else {
          this.$alert({
            content: '确定要删除这些数据吗？',
            cancel () {
            },
            confirm: () => {
              const ids = this.selected.map(o => {
                return o.id
              })
              delRecordData({ id: ids.toString() }).then(res => {
                if (res.data.code === 200) {
                  this.$message.success('删除成功')
                  this.caseDidChange()
                } else {
                  this.$message.error(res.data.msg)
                }

              }).catch(err => {
                console.log(err)
              })
            }
          })
        }
      },
      tableSelect (value) {
        this.selected = value
      },
      getTree () {
        getBzoneTree({ property_id: this.propertyId }).then(res => {
          this.treeData = res.data.data
          deepTraversal(this.treeData, 'children', o => {
            this.$set(o, 'disabled', false)
            const parentNodes = findParentNodes(o.id, this.treeData, true)
            this.$set(o, 'cascadeValue', parentNodes)
          })
          this.caseDidChange()
        })
      },
      editData (value) {
        this.$refs.record.isModify = true
        let arr = []
        value.data.bzid.split(',').forEach(o => {
          arr.push(findParentNodes(Number(o), this.treeData, true))
        })
        this.$refs.record.formData.node = arr
        this.$refs.record.formData.ratio = value.data.ratio
        this.$refs.record.formData.status = value.data.status_num
        this.$refs.record.formData.id = value.data.id
        this.$refs.record.formData.date = value.data.exec_date.split(',')
        this.$refs.record.formData.hourtime = value.data.exec_time.split(',')
        this.$refs.record.showModal()

      }
    },
    watch: {
      currentActive (val) {
        // 监听活动表格页码
        var data = _.cloneDeep(this.eventAllData)
        this.tableData = data.splice((this.currentActive - 1) * 5, 5)
        this.$nextTick(() => {
          document.getElementsByClassName(
            'vs-pagination--input-goto'
          )[2].value = val
        })
      },
    },
    mounted () {
      this.getTree()
    }
  }
</script>
<style scoped lang="less">
    .paginations {
        position: relative;
        bottom: 6px;
        margin-top: 20px;
    }

    .tables {
        height: 430px;
        box-shadow: none;
        background: none;
    }

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
