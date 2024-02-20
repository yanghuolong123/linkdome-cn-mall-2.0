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
import addDoorway from './components/addDoorway'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
export default {
  components: {
    addDoorway,
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
      titleName: 'basicInfo'
    }
  },
  props: {
    storeInfo: {
      type: Object,
      required: true
    },
    userLvl: {
      type: String,
      default: 'admin'
    }
  },
  computed: {
    tableName(){
      return [ 'name','entityType', 'description', 'operate']
    },
    tableList () {
      var arr = []
      if (this.storeInfo) {
        var obj = this.storeInfo
        obj.description = obj.description ? obj.description : ' '
        obj.zones = obj.zones
        obj.area = obj.area_size
        obj.modal5 = obj.business_type_id
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
      this.$emit('delStore', value.data)
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
