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
            @tableData='editFloor'
            @removeData='delFloor'
        >
        </table-multiple-selected>
        <!-- 区域 -->
        <div class="areas">
          <div class="stall-header-right">
              <span class="stall-add" v-if="userLvl=='admin'" title="添加" @click="addArea">
                <Icon type="md-add" />
              </span>
          </div>
          <div class="left-floor">
            <table-multiple-selected
                :tableName='tableName'
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
      <!-- <div class="left-floor">
        <table-multiple-selected
            :tableName='tableName'
            :tableList='lineUpTable'
            :titleName='lineUpTitle'
        >
        </table-multiple-selected>
      </div> -->
    </div>

    <div class="area-list-right">
        <div class="stall-header-right">
            <span class="stall-add" v-if="userLvl=='admin'" title="添加" @click="adDoorway">
              <Icon type="md-add" />
            </span>
        </div>
      <!-- 出入口 -->
        <table-multiple-selected
            :tableName='tableName'
            :tableList='inletTable'
            :titleName='inletTitle'
            :userLvl="userLvl"
            @tableData='editDoorWay'
            @removeData='delDoorWay'
        >
        </table-multiple-selected>
        <addDoorway v-if="showDoorway"
            ref="addDoorway"
            @closeEdit="closeEdit"
            @addTypeData="addTypeData"
            @updateTypeData="updateTypeData"
            @alertMessage="alertMessage"
            :userLvl="userLvl"
            :gateList="gateList"
            :floorInfo="floorInfo"
            :parent_id="parent_id"
            :editDoorWayTitle="editDoorWayTitle"
        >
        </addDoorway>
        <addArea v-if="showArea"
            ref="addArea"
            @closeEdit="closeEdit"
            @addTypeData="addTypeData"
            @updateTypeData="updateTypeData"
            @alertMessage="alertMessage"
            :userLvl="userLvl"
            :zoneList="zoneList"
            :floorInfo="floorInfo"
            :parent_id="parent_id"
            :editAreaTitle="editAreaTitle"
        >
        </addArea>
    </div>
    <alert
      v-if="isAlert"
      @closeAlert ='closeAlert'
      @alertConfirm ='alertConfirm'
      :alertText='alertText'
    ></alert>
  </div>
</template>

<script>
import _ from 'lodash'
import { zones, deleteData } from '@/api/manager.js'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import addDoorway from '_c/entity/components/addDoorway.vue'
import addArea from '_c/entity/components/addArea.vue'
import alert from '@/components/alert.vue'
import { setTimeout } from 'timers'

export default {
  components: {
    TableMultipleSelected,
    addDoorway,
    addArea,
    alert
  },
  data () {
    return {
      theDoorWay: '', // 当前选中的出入口
      theArea: '',
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      editDoorWayTitle: '添加出入口',
      editAreaTitle: '添加区域',
      tableName: ['名称', '描述', '操作'],
      floorTitle: '基本信息',
      areaTitle: '区域信息',
      lineUpTitle: '排队信息',
      lineUpTable: [],
      inletTitle: '出入口信息',
      showAddCompany: false,
      showDoorway: false,
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
      gateList: []
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
    alertMessage (value, alertText) {
      this.isAlert = value
      this.alertText = alertText
    },
    adDoorway () {
      this.showDoorway = true
      var that = this
      setTimeout(() => {
        if (that.$refs.addDoorway) that.$refs.addDoorway.isModify = false
      }, 200)
    },
    addArea () {
      this.showArea = true
      var that = this
      setTimeout(() => {
        if (that.$refs.addArea) that.$refs.addArea.isModify = false
      }, 200)
    },
    closeEdit () {
      this.showDoorway = false
      this.showArea = false
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
      var that = this
      this.showDoorway = true
      var data = _.cloneDeep(value.data)
      data.description = data.describe
      var gate = _.find(that.gateList, ['id', data.id])
      this.editDoorWayTitle = '编辑出入口'
      setTimeout(function () {
        if (that.$refs.addDoorway) {
          that.$refs.addDoorway.formData = data
          that.$refs.addDoorway.isModify = true
        }
      }, 200)
    },
    editArea (value) {
      var that = this
      this.showArea = true
      var data = _.cloneDeep(value.data)
      data.description = data.describe
      this.editAreaTitle = '编辑区域'
      setTimeout(function () {
        if (that.$refs.addArea) {
          that.$refs.addArea.formData = data
          that.$refs.addArea.isModify = true
        }
      }, 200)
    },
    delArea (value) {
      this.delType = 'area'
      let alertText = {}
      alertText.title = '删除区域'
      alertText.text = '确认删除此区域信息？'
      alertText.bg = '#00A0E9'
      alertText.confirm = true
      this.alertText = alertText
      this.isAlert = true
      this.theArea = value.data
    },
    delDoorWay (value) {
      this.delType = 'gate'
      let alertText = {}
      alertText.title = '删除出入口'
      alertText.text = '确认删除此出入口信息？'
      alertText.bg = '#00A0E9'
      alertText.confirm = true
      this.alertText = alertText
      this.isAlert = true
      this.theDoorWay = value.data
    },
    editFloor (value) {
      this.$emit('editFloor', value.data)
    },
    delFloor (value) {
      let alertText = {}
      alertText.title = '删除楼层'
      alertText.text = '确认删除此楼层信息？'
      alertText.bg = '#00A0E9'
      alertText.confirm = true
      this.$emit('delFloor', true, alertText, value.data)
    },
    closeAlert () {
      this.isAlert = false
    },
    alertConfirm (value) {
      var that = this
      if (value === true) {
        that.isAlert = false
        if (this.delType == 'gate') {
          var id = that.theDoorWay.id
          var form = 'gate'
          var index = that.theDoorWay.index
          deleteData(id, form).then(function (res) {
            if (res.data.code == 200) {
              that.floorInfo[1].gate = _.remove(that.floorInfo[1].gate, function (o, i) {
                return i != index
              })
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '删除出入口'
              that.alertText.text = '删除出入口成功'
              that.alertText.confirm = false
              that.$emit('changeDoorway')
            }
          })
        } else if (this.delType == 'area') {
          var id = that.theArea.id
          deleteData(id).then(function (res) {
            if (res.data.code == 200) {
              that.floorInfo[1].area = _.remove(that.floorInfo[1].area, function (o, i) {
                return o.id != id
              })
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '删除区域'
              that.alertText.text = '删除区域成功'
              that.alertText.confirm = false
              that.$emit('changeDoorway')
            }
          })
        }
      } else {
        this.isAlert = false
      }
    }
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
      // box-shadow:0px 2px 9px 1px rgba(175,175,176,0.25);
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
    // box-shadow:0px 2px 9px 1px rgba(175,175,176,0.25);
    border-radius:6px;
    margin-top: 30px;
  }
  .stall-header-right{
    position: absolute;
    top: 14px;
    right: 20px;
    z-index: 999;
    margin-top: 3.5px;
        span{
            display: inline-block;
            float: left;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            text-align: center;
            line-height: 19px;
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
