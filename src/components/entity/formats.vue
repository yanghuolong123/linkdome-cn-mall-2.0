<template>
  <div class="formats-center" style="position:relative">
    <div class="add-edit-formats" v-if="isAddAndEdit">
      <div class="add-edit-bg"></div>
      <div class="add-edit-text">
        <h4>{{ formTitle }}</h4>
        <div class="add-edit-close" v-on:click="closeAddAndEdit">
          <Icon type="md-close"/>
        </div>
        <div class="form-data">
          <div class="form-item">
            <span>{{ $t('名称')+$t('punctuation.colon') }}</span>
            <Input :placeholder="$t('holder.请输入业态名称')" v-model="formatsName" style="width: 210px"></Input>
          </div>
          <div class="form-item">
            <span>{{ $t('关联商铺')+$t('punctuation.colon') }}</span>
            <Transfer
              class="transfer"
              :data="transferData"
              :target-keys="targetKeys"
              :titles="transferTitle"
              filterable
              :filter-method="filterMethod"
              @on-change="handleTransChange"
            ></Transfer>
          </div>
          <div class="add-edit-buttom">
            <Button @click="handleSubmit">{{ $t('提交') }}</Button>
            <Button class="buttonCel" @click.native="closeAddAndEdit">{{ $t('取消') }}</Button>
          </div>
        </div>
      </div>

    </div>
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
    <alert
      v-if="isAlert"
      @closeAlert='closeAlert'
      @alertConfirm='alertConfirm'
      :alertText='alertText'
    ></alert>
  </div>

</template>

<script>
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import alert from '@/components/alert.vue'
import _ from 'lodash'
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
    alert
  },
  props: {
    propertyId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      isAddAndEdit: false,
      isAlert: false,
      titleName: '业态列表',
      formTitle: '添加业态',
      tableName: ['名称', '操作'],
      tableData: [],
      selected: [],
      formatsName: '',
      originFormatsName: '', // 编辑时原始业态名称
      currentData: '',
      deleteSelect: 'multiple',
      editAndAddType: 'add',
      tipContent: "",
      targetKeys: [], // 穿梭框右边的key数组
      transferData: [], // 穿梭框数据
      transferTitle: ['“其他”业态', '当前业态']
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
          // this.$store.commit('saveBussinessType', data)
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
      if (this.formatsName == '') {
        this.isAlert = true
        if (this.editAndAddType == 'add') {
          this.alertList('添加业态', '业态名称不能为空，请填写名称', '#00A0E9', false)
        } else {
          this.alertList('编辑业态', '业态名称不能为空，请填写名称', '#00A0E9', false)
        }
        return false
      } else if (this.formatsName.length < 2 || this.formatsName.length > 10) {
        this.isAlert = true
        if (this.editAndAddType == 'add') {
          this.alertList('添加业态', '业态名称长度为2-10个字符，请填写名称', '#00A0E9', false)
        } else {
          this.alertList('编辑业态', '业态名称长度为2-10个字符，请填写名称', '#00A0E9', false)
        }
        return false
      }
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
        addFormateData({ property_id: this.propertyId, name: this.formatsName }).then(res => {
          if (res.data.code === 200) {
            rightData.business_type_id = res.data.data
            Promise.all([saveFormateRelatedStore(leftData), saveFormateRelatedStore(rightData)]).then(() => {
              this.handleSubmitSuc('添加')
            })
          } else if (res.data.code === 308) {
            this.isAlert = true
            this.alertList('添加业态', '名称重复，请重新填写', '#00A0E9', false)
            this.formatsName = ''
          }
        })
      } else {
        // 用户没有修改业态名时不调用update接口，否则会验重
        if (this.originFormatsName === this.formatsName) {
          Promise.all([saveFormateRelatedStore(leftData), saveFormateRelatedStore(rightData)]).then(() => {
            this.handleSubmitSuc('编辑')
          })
        } else {
          updateFormateData({ id: this.currentData.id, name: this.formatsName }).then(res => {
            if (res.data.code === 200) {
              Promise.all([saveFormateRelatedStore(leftData), saveFormateRelatedStore(rightData)]).then(() => {
                this.handleSubmitSuc('编辑')
              })
            } else if (res.data.code === 308) {
              this.isAlert = true
              this.alertList('编辑业态', '名称重复，请重新填写', '#00A0E9', false)
              this.formatsName = ''
            }
          })
        }
      }
    },
    handleSubmitSuc (status) {
      this.isAlert = true
      this.alertList(`${status}业态`, `${status}成功`, '#00A0E9', false)
      this.isAddAndEdit = false
      this.dataList()
      this.$store.commit('isGetDict', true)
      this.formatsName = ''
    },
    addFormats () {
      this.formTitle = this.$t('添加业态')
      this.formatsName = ''
      this.editAndAddType = 'add'
      this.isAddAndEdit = true
      this.getTransferData()
    },
    editData (value) {
      this.formTitle = this.$t('编辑业态')
      if (value.data.name === '其他') {
        this.isAlert = true
        this.alertList(this.$t('编辑业态'), this.$t('notices.editOtherBusinessPattern'), '#00A0E9', false)
        return false
      }
      this.formatsName = ''
      this.editAndAddType = 'edit'
      this.isAddAndEdit = true
      this.currentData = value.data
      this.originFormatsName = value.data.name
      this.formatsName = value.data.name
      this.getTransferData(value.data.name)
    },
    deleteData (value) {
      if (value.data.name === '其他') {
        this.isAlert = true
        this.alertList(this.$t('删除业态'), this.$t('notices.deleteOtherBusinessPattern'), '#00A0E9', false)
      } else {
        this.isAlert = true
        this.alertList(this.$t('删除业态'), this.$t('fn.askConfirm', [this.$t('删除', [value.data.name])]), '#00A0E9', true)
        this.currentData = value.data
        this.deleteSelect = 'single'
      }
    },
    tableSelect (value) {
      this.selected = value
    },
    closeAddAndEdit () {
      this.isAddAndEdit = false
    },
    closeAlert () {
      this.isAlert = false
    },
    alertConfirm (value) {
      if (value == false) {
        this.isAlert = false
      } else {
        this.isAlert = false
        if (this.deleteSelect == 'single') {
          deleteFormateData(this.currentData.id, this.propertyId).then(res => {
            if (res.data.code == 200) {
              this.isAlert = true
              this.alertList(this.$t('删除业态'), this.$t('删除成功'), '#00A0E9', false)
              this.dataList()
              this.$store.commit('isGetDict', true)
            }
          })
        } else {
          let curLe = this.selected.length
          this.selected.forEach(list => {
            deleteFormateData(list.id, this.propertyId).then(res => {
              if (res.data.code == 200) {
                this.selected.splice(0, this.selected.length)
                curLe--
                if (curLe == 0) {
                  this.isAlert = true
                  this.alertList(this.$t('删除业态'), this.$t('删除成功'), '#00A0E9', false)
                  this.dataList()
                  this.$store.commit('isGetDict', true)
                }
              }
            })
          })
        }
      }
    },
    deleteMultiple () {
      if (this.selected.length == 0) {
        this.isAlert = true
        this.alertList(this.$t('删除业态'), this.$t('notices.notChoosePatter'), '#00A0E9', false)
      } else {
        if (_.find(this.selected, (v) => v.name == '其他')) {
          this.isAlert = true
          this.alertList(this.$t('删除业态'), this.$t('notices.deleteOtherBusinessPattern'), '#00A0E9', false)
        } else {
          this.isAlert = true
          this.alertList(this.$t('删除业态'), this.$t('notices.confirmDeleteAllPattern'), '#00A0E9', true)
          this.deleteSelect = 'multiple'
        }
      }
    },
    alertList (title, text, bg, confirm) {
      this.alertText.title = title
      this.alertText.text = text
      this.alertText.bg = bg
      this.alertText.confirm = confirm
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
  .add-edit-formats {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 51005;
      .add-edit-bg {
          width: 100%;
          height: 100%;
          background-color: #000;
          opacity: 0.3;
      }
      .add-edit-text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border: 1px solid #d7dfe3;
        -webkit-box-shadow: 1px 2px 10px 0 hsla(0, 0%, 75.7%, .2);
        box-shadow: 1px 2px 10px 0 hsla(0, 0%, 75.7%, .2);
        border-radius: 8px;
        .add-edit-close {
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
        h4 {
          width: 100%;
          height: 53px;
          line-height: 53px;
          padding-left: 20px;
          background: #f2f2f2;
          font-size: 18px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: #5b5959;
        }

        .form-data {
          padding: 30px 40px;

          .form-item {
              display: flex;
              align-content: center;

              span {
                  width: 130px;
                  text-align: right;
                  line-height: 32px;
              }
          }
          .form-item + .form-item {
              margin-top: 30px;
          }
          .add-edit-buttom {
            margin-top: 30px;
            text-align: right;
            .ivu-btn {
              width: 90px;
              color: #fff;
              outline: none;
              &:nth-child(1) {
                margin-right: 20px;
                background-color: #00a0e9;
                &:hover {
                  border: 1px solid #00a0e9;
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
}

</style>
