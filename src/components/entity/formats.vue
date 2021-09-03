<template>
  <div class="formats-center">
    <div class="formats-table">
      <div class="formats-header">
        <span class="formats-add" :title="$t('添加')" @click="addFormats">
          <Icon type="md-add"/>
        </span>
            <span class="formats-add" :title="$t('删除')" @click="deleteMultiple">
          <Icon type="md-remove"/>
        </span>
      </div>
      <table-multiple-selected
        class="formatsList"
        :tableName='tableName'
        :tableList='tableData'
        :titleName='titleName'
        @tableData='editData'
        @removeData='deleteData'
        @tableSelect="tableSelect"
        :isMultiple='true'
        :titleTip="tipContentCom"
      ></table-multiple-selected>
    </div>
    <Modal ref="modal" :width="700" :loading="true" :title="$t(formTitle)" @onOk="handleSubmit" @onCancel="closeAddAndEdit">
      <Form ref="formInline" :model="form" :rules="ruleInline"
            :label-width="80">
        <FormItem prop="formatsName" :label="$t('名称')">
          <Input v-model="form.formatsName" maxlength="10"></Input>
        </FormItem>
        <FormItem :label="$t('关联商铺')+$t('punctuation.colon') ">
          <Transfer
            class="transfer"
            :data="transferData"
            :target-keys="targetKeys"
            :titles="transferTitle"
            filterable
            :filter-method="filterMethod"
            @on-change="handleTransChange"
          ></Transfer>
        </FormItem>
      </Form>
    </Modal>
  </div>

</template>

<script>
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import _ from 'lodash'
import Modal from '_c/common/Modal.vue'
import {
  getFormateData,
  addFormateData,
  updateFormateData,
  deleteFormateData,
  getStoreByDefaultEntity,
  saveFormateRelatedStore
} from '@/api/formats.js'

export default {
  components: {
    TableMultipleSelected,
    Modal
  },
  props: {
    propertyId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      titleName: '业态列表',
      formTitle: '添加业态',
      tableName: ['名称', '操作'],
      tableData: [],
      selected: [],
      originFormatsName: '', // 编辑时原始业态名称
      currentData: '',
      editAndAddType: 'add',
      tipContent: "",
      targetKeys: [], // 穿梭框右边的key数组
      transferData: [], // 穿梭框数据
      transferTitle: [this.$t('othersBussinessParttern'), this.$t('当前业态')],
      form:{
        formatsName:''
      },
      ruleInline:{
        formatsName: [{ required: true, message: this.$t('fn._不能为空',[this.$t('业态名称')]), trigger: 'blur' },{
          required: true,
          message: this.$t('fn.cantLessThan',[this.$t('业态名称'),2]),
          trigger: 'blur',
          max: 10,
          min: 2
        } ],
      }
    }
  },
  watch: {
    propertyId () {
      this.dataList()
    }
  },
  computed: {
    othersId () { // ‘其他’业态的id
      const data = this.tableData.find(o => {
        return o.name === '其他'
      })
      return data ? data.id : ''
    },
    tipContentCom() {
      this.tipContent = this.$t('passages.tipContent1')
      return this.tipContent
    }
  },
  mounted () {
    this.dataList()
  },
  methods: {
    dataList () {
      let id = this.propertyId
      getFormateData(id).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data
          this.tableData = []
          data.map(list => {
            let obj = {
              name: list.name,
              operation: true,
              id: list.id
            }
            this.tableData.push(obj)
          })
        }
      })
    },
    handleSubmit () {
      this.$refs.formInline.validate(valid=>{
        if(valid){
          let leftRestData = this.transferData.filter(o => {
            return !this.targetKeys.includes(o.key)
          })
          leftRestData = leftRestData.map(o => { return o.key })
          const leftData = {// 穿梭框左侧其他业态数据
            bz_ids: leftRestData.toString(),
            business_type_id: this.othersId
          }
          const rightData = {// 穿梭框右侧目标业态数据
            bz_ids: this.targetKeys.toString(),
            business_type_id: this.currentData.id
          }
          if (this.editAndAddType === 'add') {
            addFormateData({ property_id: this.propertyId, name: this.form.formatsName }).then(res => {
              this.$refs.modal.resetOkButton()
              if (res.data.code === 200) {
                rightData.business_type_id = res.data.data
                Promise.all([saveFormateRelatedStore(leftData), saveFormateRelatedStore(rightData)]).then(() => {
                  this.handleSubmitSuc('添加')
                })
              } else if (res.data.code === 308) {
                this.$message.warning(this.$t('业态名称重复'))
                this.form.formatsName = ''
              }
            })
          } else {
            // 用户没有修改业态名时不调用update接口，否则会验重
            if (this.originFormatsName === this.form.formatsName) {
              Promise.all([saveFormateRelatedStore(leftData), saveFormateRelatedStore(rightData)]).then(() => {
                this.$refs.modal.resetOkButton()
                this.handleSubmitSuc('编辑')
              })
            } else {
              updateFormateData({ id: this.currentData.id, name: this.form.formatsName }).then(res => {
                this.$refs.modal.resetOkButton()
                if (res.data.code === 200) {
                  Promise.all([saveFormateRelatedStore(leftData), saveFormateRelatedStore(rightData)]).then(() => {
                    this.handleSubmitSuc('编辑')
                  })
                } else if (res.data.code === 308) {
                  this.$message.warning(this.$t('业态名称重复'))
                  this.form.formatsName = ''
                }
              })
            }
          }
        }else {
          this.$refs.modal.resetOkButton()
        }
      })

    },
    handleSubmitSuc (status) {
      this.$message.success(this.$t('fn.successTo', [this.$t(`${status}业态`)]))
      this.dataList()
      this.$store.commit('isGetDict', true)
      this.form.formatsName = '';
      this.closeAddAndEdit()
    },
    addFormats () {
      this.formTitle = this.$t('添加业态')
      this.$refs.modal.showModal()
      this.form.formatsName = ''
      this.editAndAddType = 'add'
      this.getTransferData()
    },
    editData (value) {
      this.formTitle = this.$t('编辑业态')
      if (value.data.name === '其他') {
        this.$message.warning(this.$t('notices.editOtherBusinessPattern'))
        return
      }
      this.editAndAddType = 'edit'
      this.currentData = value.data
      this.originFormatsName = value.data.name
      this.form.formatsName = value.data.name
      this.getTransferData(value.data.name);
      this.$refs.modal.showModal()
    },
    deleteData (value) {
      if (value.data.name === '其他') {
        this.$message.warning(this.$t('notices.deleteOtherBusinessPattern'))
      } else {
        this.$alert({
          content: this.$t('fn.askConfirm', [this.$t('删除', [value.data.name])]),
          cancel () {
          },
          confirm: () => {
            deleteFormateData(value.data.id, this.propertyId).then(res => {
              if (res.data.code == 200) {
                this.$message.success(this.$t('删除成功'))
                this.dataList()
                this.$store.commit('isGetDict', true)
              }
            })
          }
        })

      }
    },
    tableSelect (value) {
      this.selected = value
    },
    closeAddAndEdit () {
      this.$refs.formInline.resetFields()
      this.$refs.modal.closeModal()
    },
    deleteMultiple () {
      console.log(this.selected)
      if (!this.selected.length) {
        this.$message.warning(this.$t('notices.notChoosePatter'))
      } else {
        if (_.find(this.selected, (v) => v.name === '其他')) {
          this.$message.warning(this.$t('notices.deleteOtherBusinessPattern'))
        } else {
          this.$alert({
            content: this.$t('notices.confirmDeleteAllPattern'),
            cancel () {
            },
            confirm: () => {
              let curLe = this.selected.length
              this.selected.forEach(list => {
                deleteFormateData(list.id, this.propertyId).then(res => {
                  if (res.data.code === 200) {
                    this.selected.splice(0, this.selected.length)
                    curLe--;
                    if (!curLe) {
                      this.$message.success(this.$t('删除成功'))
                      this.dataList()
                      this.$store.commit('isGetDict', true)
                    }
                  }
                })
              })
            }
          })
        }
      }
    },
    filterMethod (data, query) {
      return data.label && data.label.indexOf(query) > -1
    },
    handleTransChange (newTargetKeys) {
      this.targetKeys = newTargetKeys
    },
    // 穿梭框数据（业态为name的所有商铺）
    async getTransferData (name) {
      function formatMockData (res) {
        let arr = []
        if (res.code === 200 && Array.isArray(res.data)) {
          for (let i = 0, node; node = res.data[i++];) {
            arr.push({
              key: node.id,
              label: node.name
            })
          }
        }
        return arr
      }
      this.targetKeys = []
      const params1 = {
        bt_name: '其他',
        property_id: this.propertyId
      }
      let res1 = await getStoreByDefaultEntity(params1)
      this.transferData = formatMockData(res1.data)
      // 获取右侧目标数据
      if (name) {
        const params2 = {
          bt_name: name,
          property_id: this.propertyId
        }
        let res2 = await getStoreByDefaultEntity(params2)
        this.transferData = this.transferData.concat(formatMockData(res2.data))
        this.targetKeys = formatMockData(res2.data).map(o => { return o.key })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.formats-center {
  margin-top: 20px;
  position: relative;
  .formats-table{
    .formats-header{
      position: absolute;
      top:26px;
      right:20px;
      z-index:1;
      span {
        float: left;
        display: flex;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: 16px;
        color: #fff;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #00A0E9;
        &:nth-child(1) {
            background-color: #2BD9CF;
        }
        &:nth-child(2) {
            margin-left: 20px;
            background-color: #FEB33D;
        }
      }
    }
  }
}

</style>
