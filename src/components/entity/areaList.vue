<template>
  <div class="area-list">
    <div class="area-list-left">
      <div class="left-floor">
        <!-- 楼层 -->
        <table-multiple-selected
            :tableName='tableName'
            :tableList='floorTable'
            :titleName='floorTitle'
            :userLvl="userLvl"
            @imgConfig="imgConfig"
            @tableData='editFloor'
            @removeData='delFloor'
        >
        </table-multiple-selected>
        <!-- 区域 -->
        <div class="areas">
          <div class="stall-header-right">
              <span class="stall-add" v-if="userLvl=='admin'" :title="$t('添加')" @click="addArea">
                <Icon type="md-add" />
              </span>
          </div>
          <div class="left-floor">
            <table-multiple-selected
                :tableName='tableNameCommon'
                :tableList='areaTable'
                :titleName='areaTitle'
                :userLvl="userLvl"
                @tableData='editArea'
                @removeData='delArea'
            >
            </table-multiple-selected>
          </div>
        </div>
      </div>
    </div>

    <div class="area-list-right">
        <div class="stall-header-right">
            <span class="stall-add" v-if="userLvl=='admin'" :title="$t('添加')" @click="adDoorway">
              <Icon type="md-add" />
            </span>
        </div>
      <!-- 出入口 -->
        <table-multiple-selected
            :tableName='tableNameCommon'
            :tableList='inletTable'
            :titleName='inletTitle'
            :userLvl="userLvl"
            @tableData='editDoorWay'
            @removeData='delDoorWay'
        >
        </table-multiple-selected>
        <addDoorway
            ref="addDoorway"
            @addTypeData="addTypeData"
            @updateTypeData="updateTypeData"
            :userLvl="userLvl"
            :gateList="gateList"
            :floorInfo="floorInfo"
            :parent_id="parent_id"
            :editDoorWayTitle="editDoorWayTitle"
        >
        </addDoorway>
        <addArea
            ref="addArea"
            @addTypeData="addTypeData"
            @updateTypeData="updateTypeData"
            :userLvl="userLvl"
            :zoneList="zoneList"
            :floorInfo="floorInfo"
            :parent_id="parent_id"
            :editAreaTitle="editAreaTitle"
        >
        </addArea>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { zones, deleteData } from '@/api/manager.js'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import addDoorway from '_c/entity/components/addDoorway.vue'
import addArea from '_c/entity/components/addArea.vue'

export default {
  components: {
    TableMultipleSelected,
    addDoorway,
    addArea,
  },
  data () {
    return {
      theDoorWay: '', // 当前选中的出入口
      theArea: '',
      editDoorWayTitle: '添加出入口',
      editAreaTitle: '添加区域',
      floorTitle: '基本信息',
      areaTitle: '区域信息',
      lineUpTitle: '排队信息',
      lineUpTable: [],
      inletTitle: '出入口信息',
      showAddCompany: false,
      showArea: false,
      delCompany: false,
      addAreas: false,
      addQueuings: false,
      zoneList: [],
      dataIndex: 0,
      tem: {
        description: '',
        name: '',
        bzid: '',
        type: ''
      },
      gateList: [],
        tableNameCommon:['名称', '描述', '操作']
    }
  },
  props: {
    floorInfo: {
      typy: Array,
      required: true
    },
    parent_id: {
      typy: Array,
      required: true
    },
    userLvl: {
      type: String,
      default: 'admin'
    }
  },
  computed: {
      tableName(){
          if(this.userLvl === 'admin'){
              return ['名称', '描述','图片配置', '操作']
          }else {
              return ['名称', '描述', '操作']
          }
      },
    inletTable: {
      get () {
        var arr = []
        if (this.floorInfo[1]) {
          if (this.floorInfo[1].gate) {
            this.floorInfo[1].gate.forEach((element, index) => {
              var obj = {}
              obj.name = element.name
              obj.index = index
              obj.id = element.id
              obj.gate = element.zones
              obj.gate_type_id = element.gate_type_id
              obj.describe = element.description ? element.description : ' '
              obj.operation = true
              arr.push(obj)
            })
          }
        }
        return arr
      }
    },
    areaTable: {
      get () {
        var arr = []
        if (this.floorInfo[1]) {
          if (this.floorInfo[1].area) {
            this.floorInfo[1].area.forEach((element, index) => {
              var obj = {}
              obj.name = element.name
              obj.index = index
              obj.id = element.id
              obj.zone = element.zones
              obj.describe = element.description ? element.description : ' '
              obj.operation = true
              arr.push(obj)
            })
          }
        }
        return arr
      }
    },
    floorTable () {
      var arr = []
      var obj = {}
      if (this.floorInfo[1]) {
        obj.name = this.floorInfo[1].name
        obj.id = this.floorInfo[1].id
        obj.zones = this.floorInfo[1].zones
        obj.parent_id = this.floorInfo[1].parent_id
        obj.zone_index = this.floorInfo[1].zone_index
        obj.describe = this.floorInfo[1].description ? this.floorInfo[1].description : ' '
        obj.operation = true
        obj.imgConfig = this.userLvl === 'admin'
        arr.push(obj)
      }
      return arr
    }
  },
  methods: {
    getZones () {
      let that = this
      let id = this.floorInfo[0].property_id
      zones(id).then(function (res) {
        if (res.data.code == 200) {
          that.zoneList = that.addValuesToEle2(res.data.data)
          that.gateList = that.addValuesToEle2(res.data.data)
        }
      })
    },
    adDoorway () {
      this.$refs.addDoorway.$refs.modal.showModal()
    },
    addArea () {
      this.$refs.addArea.$refs.modal.showModal()
    },
      imgConfig(){
          this.$emit('imgConfig')
      },
    /* 格式化选择器数据
    *@method addValuesToEle2
    *@param {obj} pArray 需要格式化的数据对象
    *@return null
    */
    addValuesToEle2 (pArray) {
      return pArray.map(function (ele) {
        ele.value = ele.id
        ele.label = ele.name
        return ele
      })
    },
    /* 获取出入口区域关联数据 */
    addTypeData (data) {
      var that = this
      var floorInfo
      switch (data.type) {
        case 'area':
          if (!that.floorInfo[1].area) that.floorInfo[1].area = []
          floorInfo = _.cloneDeep(that.floorInfo)
          floorInfo[1].area.push(data)
          that.floorInfo = floorInfo
          break
        case 'queue':
          that.floorInfo[1].queue.push(data)
          break
        case 'gate':
          if (!that.floorInfo[1].gate) that.floorInfo[1].gate = []
          floorInfo = _.cloneDeep(that.floorInfo)
          data.zones = [data.gate_id]
          floorInfo[1].gate.push(data)
          that.floorInfo = floorInfo
          break
      }
      this.$emit('changeDoorway')
    },
    updateTypeData (data) {
      var that = this
      var index, floorInfo
      switch (data.type) {
        case 'area':
          index = _.findIndex(that.floorInfo[1].area, ['id', data.id])
          that.floorInfo[1].area.splice(index, 1)
          floorInfo = _.cloneDeep(that.floorInfo)
          floorInfo[1].area.push(data)
          that.floorInfo = floorInfo
          break
        case 'queue':
          that.floorInfo[1].queue.push(data)
          break
        case 'gate':
          index = _.findIndex(that.floorInfo[1].gate, ['id', data.id])
          that.floorInfo[1].gate.splice(index, 1)
          floorInfo = _.cloneDeep(that.floorInfo)
          data.zones = [data.gate_id]
          floorInfo[1].gate.push(data)
          that.floorInfo = floorInfo
          break
      }
      this.$emit('changeDoorway')
    },
    editDoorWay (value) {
      this.$refs.addDoorway.$refs.modal.showModal();
      this.editDoorWayTitle = '编辑出入口'
      var data = _.cloneDeep(value.data)
      data.description = data.describe
      data.gate_id = data.gate[0]
      this.$refs.addDoorway.formData = data
      this.$refs.addDoorway.isModify = true
    },
    editArea (value) {
      this.$refs.addArea.$refs.modal.showModal()
      var data = _.cloneDeep(value.data)
      data.description = data.describe
      this.editAreaTitle = '编辑区域'
      this.$refs.addArea.formData = data
      this.$refs.addArea.isModify = true
    },
    delArea (value) {
      this.$alert({
        content: this.$t('确认删除此区域信息'),
        cancel () {
        },
        confirm: () => {
          deleteData(value.data.id).then((res)=> {
            if (res.data.code == 200) {
              this.floorInfo[1].area = _.remove(this.floorInfo[1].area, (o, i)=> {
                return o.id != value.data.id
              })
              this.$message.success(this.$t('删除成功'))
              this.$emit('changeDoorway')
            }
          })
        }
      })
    },
    delDoorWay (value) {
      this.$alert({
        content: this.$t('确认删除此出入口信息'),
        cancel () {
        },
        confirm: () => {
          deleteData(value.data.id,'gate').then((res)=> {
            if (res.data.code == 200) {
              this.floorInfo[1].gate = _.remove(this.floorInfo[1].gate,  (o, i)=> {
                return i != value.data.index
              })
              this.$message.success(this.$t('删除成功'))
              this.$emit('changeDoorway')
            }
          })
        }
      })
    },
    editFloor (value) {
      this.$emit('editFloor', value.data)
    },
    delFloor (value) {
      this.$emit('delFloor', value.data)
    },
  },
  mounted () {
    this.getZones()
  }
}
</script>

<style scoped lang="scss">
.area-list{
  overflow: hidden;
  .area-list-left{
    width: 49%;
    float: left;
    margin: 0px 0px 10px 3px;
    .left-floor{
      background:rgba(255,255,255,1);
      border-radius:6px;
      margin-top: 30px;
      .areas{
        position: relative;
        bottom: -7px;
      }
    }
  }
  .area-list-right{
    width: 49%;
    position:relative;
    margin: 0px 3px 10px 0px;
    float: right;
    background:rgba(255,255,255,1);
    border-radius:6px;
    margin-top: 30px;
  }
  .stall-header-right{
    position: absolute;
    top: 14px;
    right: 20px;
    z-index: 1;
    margin-top: 3.5px;
    span{
        float: left;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        text-align: center;
        font-size: 16px;
        color: #fff;
        margin-left: 20px;
        cursor: pointer;
        margin-top: 9px;
        
        background-color: #00A0E9;
        &:nth-child(1){
          margin-top: 9px;
          background-color: #2BD9CF;
        }
        &:nth-child(2){
          margin-top: 9px;
          background-color: #FEB33D;
        }
    }
  }

}
</style>
