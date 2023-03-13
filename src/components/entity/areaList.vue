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
                :tableList="subTable('area')"
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
            :tableList="subTable('gate')"
            :titleName='inletTitle'
            :userLvl="userLvl"
            @tableData='editDoorWay'
            @removeData='delDoorWay'
        >
        </table-multiple-selected>
        <addDoorway
            ref="addDoorway"
            @addTypeData="addTypeData"
            :tree="tree"
            @updateTypeData="updateTypeData"
            :userLvl="userLvl"
            :gateList="gateList"
            :entityInfo="entityInfo"
            :editDoorWayTitle="editDoorWayTitle"
        >
        </addDoorway>
        <addArea
            ref="addArea"
            @addTypeData="addTypeData"
            @updateTypeData="updateTypeData"
            :userLvl="userLvl"
            :tree="tree"
            :zoneList="zoneList"
            :entityInfo="entityInfo"
            :editAreaTitle="editAreaTitle"
        >
        </addArea>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { zones, deleteData,delEntity } from '@/api/manager.js'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import addDoorway from '_c/entity/components/addDoorway.vue'
import addArea from '_c/entity/components/addArea.vue'
import {deepFind,findParentNodes} from '@/libs/util'
import { mapState } from 'vuex'
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
        tableNameCommon:['名称','实体类型', '描述', '操作']
    }
  },
  props: {
    entityInfo: {
      type: Object,
      default: ()=>{}
    },
    userLvl: {
      type: String,
      default: 'admin'
    },
    tree:{
      type:Array,
      default:()=>[]
    }
  },
  computed: {
    ...mapState({
      propertyId: state => state.home.headerAction,
    }),
      tableName(){
          if(this.userLvl === 'admin' && this.entityInfo.type_name === 'floor'){
              return ['名称', '实体类型','描述','图片配置', '操作']
          }else {
              return ['名称', '实体类型','描述', '操作']
          }
      },
    subTable(){
     return function (typeName) {
       let arr = [];
       const node = deepFind(this.tree,o=>{
         return o.id === this.entityInfo.id
       })
       if(node && node.children){
         arr = node.children.filter(o=>{
           return o.type_name === typeName
         })
         arr.forEach((o,index)=>{
           o.description = o.description?o.description:' ';
           o.operation = true;
           o.zone = o.zoneIds;
           o.gate = o.zoneIds;
           o.index = index
         })
       }
       return arr
     }
    },
    floorTable () {
      let arr = []
      let obj = this.entityInfo
      if (obj) {
        obj.description = obj.description ? obj.description : ' '
        obj.operation = true
        obj.imgConfig = this.userLvl === 'admin' && this.entityInfo.type_name === 'floor'
        arr.push(obj)
      }
      return arr
    }
  },
  methods: {
    getZones () {
      zones(this.propertyId).then((res) => {
        this.gateList = this.zoneList = this.addValuesToEle2(res.data.data)
      })
    },
    adDoorway () {
      this.$refs.addDoorway.formData.parentNode = findParentNodes(this.entityInfo.id,this.tree,true)
      this.$refs.addDoorway.isModify = false
      this.$refs.addDoorway.showModal()
    },
    addArea () {
      this.$refs.addArea.formData.parentNode = findParentNodes(this.entityInfo.id,this.tree,true)
      this.$refs.addArea.isModify = false
      this.$refs.addArea.showModal()
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
      let node = deepFind(this.tree,o=>{
        return o.id ===data.parent_id
      })
      if(Array.isArray(node.children)){
        node.children.push(data)
      }else {
        this.$set(node,'children', [data])
      }
      this.$emit('refresh')
    },
    updateTypeData (data) {
      //更新数据
      let node = deepFind(this.tree,o=>{
        return o.id ===data.id
      })
      node = Object.assign(node,data)
    },
    editDoorWay (value) {
      console.log(value)
      this.editDoorWayTitle = '编辑出入口'
      var data = _.cloneDeep(value.data)
      data.gate_id = data.gate[0]
      this.$refs.addDoorway.formData = data
      this.$refs.addDoorway.formData.parentNode = findParentNodes(value.data.id,this.tree)
  
      this.$refs.addDoorway.isModify = true
      this.$refs.addDoorway.showModal()
  
    },
    editArea (value) {
      var data = _.cloneDeep(value.data)
      this.editAreaTitle = '编辑区域'
      this.$refs.addArea.formData = data
      this.$refs.addArea.isModify = true
      this.$refs.addArea.formData.parentNode = findParentNodes(value.data.id,this.tree)
      this.$refs.addArea.showModal()
    },
    delArea (value) {
      this.$alert({
        content: this.$t('确认删除此区域信息'),
        cancel () {
        },
        confirm: () => {
          deleteData(value.data.id).then((res)=> {
            if (res.data.code == 200) {
              const floor = deepFind(this.tree,o=>{
                return o.id === this.entityInfo.id
              })
              const index = floor.children.findIndex(o=>{
                return o.id === value.id
              })
              floor.children.splice(index,1)

              this.$message.success(this.$t('删除成功'))
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
              const floor = deepFind(this.tree,o=>{
                return o.id === this.entityInfo.id
              })
              const index = floor.children.findIndex(o=>{
                return o.id === value.id
              })
              floor.children.splice(index,1)
              this.$message.success(this.$t('删除成功'))
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
