<template>
<div class="groupList">
    <!-- 第三层 商铺 页面 -->
      <div class="lefts">
        <table-multiple-selected
            :tableName='tableName'
            :tableList='tableList'
            :titleName='titleName'
            :userLvl="userLvl"
            @tableData='editStore'
            @removeData='delStore'
        >
        </table-multiple-selected>
      </div>
</div>
</template>

<script>
import _ from 'lodash'
import { deleteData } from '@/api/manager.js'

import addDoorway from './components/addDoorway'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import editFloorinfor from './components/editFloorinfor'
export default {
  components: {
    addDoorway,
    editFloorinfor,
    TableMultipleSelected
  },

  data () {
    return {
      showEdit: false,
      addStoredoorway: false,
      showDoorway: false,
      parent_id: [],
      zonelist: [],
      tem: {},
      dataIndex: 0,
      tableName: [ '名称', '描述', '操作'],
      titleName: '基本信息'
    }
  },
  props: {
    storeInfo: {
      type: Array,
      required: true
    },
    userLvl: {
      type: String,
      default: 'admin'
    }
  },
  computed: {
    tableList () {
      var arr = []
      if (this.storeInfo[2]) {
        var element = this.storeInfo[2]
        var obj = {}
        obj.name = element.name
        obj.label = element.label
        obj.id = element.id
        obj.value = element.value
        obj.itype = element.itype
        obj.parent_id = element.parent_id
        obj.describe = element.description ? element.description : ' '
        obj.zones = element.zones
        obj.area = element.area_size
        obj.modal5 = element.business_type_id
        obj.operation = true
        arr.push(obj)
      } else {
        arr = []
      }
      return arr
    }
  },
  methods: {
    editStore (value) {
      this.$emit('editStore', value.data)
    },
    delStore (value) {
      let alertText = {}
      alertText.title = '删除商铺'
      alertText.text = '确认删除此商铺信息？'
      alertText.bg = '#00A0E9'
      alertText.confirm = true
      this.$emit('delStore', true, alertText, value.data)
    }
  }
}
</script>

<style lang="less" scoped>
.groupList {
    width: 100%;
    height: auto;
    background-color: #FFF;
    border-radius: 8px;
    // border: 1px solid #D7DFE3;
    margin-top: 20px;
    display: flex;
    .lefts{
      width:50%;
    }
    .vx-card{
      box-shadow:none;
    }
}
</style>
