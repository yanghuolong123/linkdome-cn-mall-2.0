<template>
  <div class="roles">
    <div class="left">
      <Menu :accordion="accordion" @on-open-change="changeOpenChange" style="z-index:1;">
        <Submenu name="1" v-if="showSuperAdmin" v-bind:class="{'ivu-menu-opened':theRoleId==1}">
          <template slot="title">
            <p>{{ $t('superAdmin') }}</p>
          </template>
        </Submenu>
        <Submenu name="2" v-if="showCompanyAdmin||showSuperAdmin" v-bind:class="{'ivu-menu-opened':theRoleId==2}">
          <template slot="title">
            {{ $t('groupAdmin') }}
          </template>
        </Submenu>
        <!-- <Submenu name="3" v-if="showShoppingAdmin" v-bind:class="{'ivu-menu-opened':theRoleId==3}">
          <template slot="title">
            购物中心管理员
          </template>
        </Submenu> -->
        <Submenu :name="(item.id)" v-for="(item,index) in roleList" v-bind:class="{'ivu-menu-opened':theRoleId==item.id}">
          <template slot="title">
            {{item.name}}
            <icons type="weibiaoti520" v-if="showSuperAdmin" @click.native="upldateRole(item.id)"></icons>
            <icons type="weibiaoti544" v-if="showSuperAdmin" @click.native="delRoleClick(item.id,index)"></icons>
          </template>
        </Submenu>
      </Menu>
      <Button type="primary" ghost v-if="showSuperAdmin" @click="openAddRole">{{ $t('fn.add',[$t('role')]) }}+</Button>
    </div>
    <div class="right">
      <Tabs :value="tabValue" :animated="false">
        <TabPane :label="$t('menuAuth')" name="menu">
          <CheckboxGroups v-for ="item in menuListDatas" :disabled="disabled" :checkData="item" @changeCheckData = "changeCheckData"></CheckboxGroups>
        </TabPane>
        <TabPane :label="$t('manageAuth')" name="manage">
          <CheckboxGroups v-for ="item in manageListDatas" :disabled="disabled" :checkData="item"></CheckboxGroups>
        </TabPane>
      </Tabs>
      <div class="controls" v-if="theRoleId>=3">
        <Button type="primary" @click="savePageConfig" v-if="showSuperAdmin">{{ $t('save') }}</Button>
        <Button @click="defaltSelect" v-if="showSuperAdmin">{{ $t('defaultSelect') }}</Button>
      </div>
    </div>
    <addRole  ref="addRole"
              :roleList="roleList"
              :menuListData="menuListData"
              @success="initRoleList"
              v-show="showAddRole"
              @closeEdit="closeEdit"></addRole>
  </div>
</template>

<script>
import CheckboxGroups from '@/components/role/CheckboxGroups.vue'
import addRole from '@/components/role/addRole.vue'
import { getMenuList, getRolesList, delRole, updateRoles } from '@/api/custom.js'
import _ from 'lodash'
export default {
  name: 'Role',
  components: {
    CheckboxGroups,
    addRole,
  },
  data () {
    return {
      accordion: true,
      showSuperAdmin: false,
      showCompanyAdmin: false,
      theRoleId: '',
      showAddRole: false,
      roleList: [],
      menuListData: [],
      allMenuData: [],
      tabValue: 'menu',
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      disabled: false,
      count: 0
    }
  },
  created () {
    var that = this

    getMenuList().then(res => {
      if (res.data.code == 200) {
        let menuListData = res.data.data.main
        menuListData.forEach(function (m) {
          m.enable = 0
          m.subpagesList.forEach(function (k) {
            k.enable = 0
          })
          let list = _.remove(m.subpagesList, val => { return val.name != 'VIPRecode' })
          m.subpagesList = _.remove(list, val => { return val.name != 'VipCustom' })
        })
        that.menuListData = menuListData
        that.allMenuData = _.cloneDeep(that.menuListData)
      }
    })
    this.initRoleList()
  },
  watch: {
  },
  computed: {
    menuListDatas () {
      let that = this
      return _.filter(this.menuListData, function (e) {
        if(that.$store.state.user.sale_feature!==1){
          e.subpagesList = _.filter(e.subpagesList,(s)=>{
            return s.id !==37 && s.id!==36 && s.id!==35 && s.id!==34
          })
          return e.name != 'Admin' && e.name != 'AddEditUser'
        }else{
          return e.name != 'Admin' && e.name != 'AddEditUser'
        }
      })
    },
    manageListDatas () {
      return _.filter(this.menuListData, function (e) {
        return e.name == 'Admin' || e.name == 'AddEditUser'
      })
    }
  },
  mounted () {
  },
  methods: {
    /*
    *@method 保存选择的菜单
    */
    savePageConfig () {
      var that = this
      let data = _.find(this.roleList, ['id', this.theRoleId])
      let pages_privilege = []
      this.menuListData.forEach(function (m) {
        if (m.enable == 1) {
          pages_privilege.push(m.id)
        }
        m.subpagesList.forEach(function (k) {
          if (k.enable == 1) {
            pages_privilege.push(k.id)
          }
        })
      })
      pages_privilege.sort()
      data.pages_privilege = pages_privilege.join(',')
      updateRoles(data).then( (res)=> {
        if (res.data.code == 200) {
          let role_id = that.$store.state.user.role_id
          if (role_id == data.id) {
            that.$store.commit('setAccess', data.pages_privilege)
          }
          this.$message.success(this.$t('fn.successTo',[this.$t('edit')]))
        }else {
          this.$message.error(this.$t('fn.failedTo',[this.$t('edit')]))
        }
      })
    },
    /*
    *@method 默认选择(读取该角色的default_pages_privilege并赋值)
    */
    defaltSelect () {
      let theRole = _.find(this.roleList, ['id', this.theRoleId])
      let pages = theRole.default_pages_privilege ? theRole.default_pages_privilege.split(',') : []
      let menuListData = _.cloneDeep(this.menuListData)
      menuListData = this.dealWithSelect(pages, menuListData)
      this.menuListData = menuListData
    },
    /*
    *@method 选择角色
    *@param {Array} value 选中的菜单name值
    */
    changeOpenChange (value) {
      if (!value.length) return false

      this.theRoleId = value[0]
      let menuListData = _.cloneDeep(this.menuListData)
      if (value[0] == '1' || value[0] == '2') {
        this.disabled = true
        menuListData.forEach(function (m) {
          m.enable = 1
          m.subpagesList.forEach(function (k) {
            k.enable = 1
          })
        })
        this.menuListData = menuListData
      } else {
        if (this.$store.state.user.role_id < 3) {
          this.disabled = false
        } else {
          this.disabled = true
        }
        let theRole = _.find(this.roleList, ['id', Number(value[0])])
        let pages = theRole.pages_privilege ? theRole.pages_privilege.split(',') : []

        menuListData = this.dealWithSelect(pages, menuListData)
        this.menuListData = menuListData
      }
    },
    /*
    *@method 处理选项
    *@param {Array} pages 默认选项
    *@param {Array} menuListData 菜单选项
    *@return {Array} menuListData
    */
    dealWithSelect (pages, menuListData) {
      menuListData.forEach( (m)=> {
        let findIndex = _.indexOf(pages, m.id + '')
        m.enable = findIndex > -1 ? 1 : 0
        m.subpagesList.forEach( (k)=> {
          let findIndex2 = _.indexOf(pages, k.id + '')
          k.enable = findIndex2 > -1 ? 1 : 0
        })
      })
      return menuListData
    },
    changeCheckData (value) {
      let childIndex = _.findIndex(this.menuListData, ['name', value.name])
      this.menuListData[childIndex] = value
    },
    initRoleList () {
      var that = this
      let property = this.$store.state.user.role_property
      let role_id = that.$store.state.user.role_id
      property = role_id < 3 ? '' : property
      getRolesList(property).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data
          that.roleList = data.map(function (m) {
            let obj = {}
            obj = m
            obj.name = m.name
            obj.label = m.name
            obj.value = m.id
            obj.id = m.id
            return obj
          })
          if (role_id == 1) {
            this.showSuperAdmin = true
            this.showCompanyAdmin = true
          } else if (role_id == 2) {
            this.showSuperAdmin = false
            this.showCompanyAdmin = true
          } else if (role_id == 3) {
            this.showSuperAdmin = false
            this.showCompanyAdmin = false
          } else {
            this.showSuperAdmin = false
            this.showCompanyAdmin = false
          }
          if (that.count == 0) {
            that.$nextTick(() => {
              setTimeout(() => {
                that.count++
                that.changeOpenChange([role_id])
              }, 500)
            })
          }
        }
      })
    },
    closeEdit () {
      this.showAddRole = false
    },
    openAddRole () {
      var that = this
      this.showAddRole = true
      this.$nextTick(() => {
        that.$refs.addRole.editRoleTitle = that.$t('fn.add',[that.$t('role')])
        that.$refs.addRole.isModify = false
      })
    },
    upldateRole (id) {
      var that = this
      let data = _.find(this.roleList, ['id', id])
      this.showAddRole = true
      this.$nextTick(() => {
        that.$refs.addRole.editRoleTitle = that.$t('fn.edit',[that.$t('role')])
        that.$refs.addRole.id = id
        that.$refs.addRole.isModify = true
        that.$refs.addRole.formData.name = data.name
        that.$refs.addRole.formData.property = data.property_id
        that.$refs.addRole.formData.description = data.describ
      })
    },
    delRoleClick (id,i) {
      this.theRoleId = id
      this.$alert({
        content:this.$t('delRoleConfirm'),
        cancel(){},
        confirm:()=>{
          this.delRole(id,i)
        },
      })
    },
    delRole(id,i){
      delRole(id).then(res => {
        if (res.data.code === 200) {
          this.$message.success(this.$t('fn.successTo',[this.$t('del')]))
          this.roleList.splice(i,1);
          this.changeOpenChange([this.$store.state.user.role_id])

        } else {
          this.$message.error(this.$t('fn.failedTo',[this.$t('del')]))
        }
      })
    },
  }
}
</script>
<style scoped lang="scss">
.roles{
  position:relative;
  display: flex;
  width:100%;
  height: 600px;
  flex-wrap: wrap;
  .left{
    width:12%;
    background-color: #fff;
    border-radius: 8px;
    height:auto;
    overflow-y:auto;
    display: block;
    text-align: center;
    ::v-deep .ivu-menu{
      padding-top:10px;
      text-align: left;
      margin-bottom: 20px;
      width: 100%!important;
      .ivu-menu-submenu.ivu-menu-opened,.ivu-menu-submenu:hover{
        background: -webkit-linear-gradient(left,rgb(55, 181, 237), rgba(55, 181, 237, 0.7));
        background: -o-linear-gradient(right,rgb(55, 181, 237), rgba(55, 181, 237, 0.7));
        background: -moz-linear-gradient(right,rgb(55, 181, 237), rgba(55, 181, 237, 0.7));
        background: linear-gradient(to right, rgb(55, 181, 237), rgba(55, 181, 237, 0.7));
        border-radius: 4px;
        color:#fff;
          ::v-deepi{
              font-size: 16px!important;
          }
      }
      .ivu-menu-submenu-title:hover{
        color:#fff;
      }
      li{
        font-size: 14px;
        position: relative;
        margin: 10px;
        .ivu-menu-submenu-title{
          p{
            display: inline-block;
          }
        }
        ul{
          display:none;
        }
        i.iconfont.iconweibiaoti520{
          position: absolute;
          right: 14px;
          cursor: pointer;
        }
        i.iconfont.iconweibiaoti544{
          position: absolute;
          right: 0px;
          cursor: pointer;
        }
        .iconfont{
          display: none;
        }
      }
      li:hover{
        .iconfont{
          display: inline-block;;
        }
        .iconweibiaoti520:hover{
          color: #00a0e9!important;
        }
        .iconweibiaoti544:hover{
          color: #00a0e9!important;
        }
      }
    }
  }
  .right{
    width:86%;
    padding:0px 20px;
    .controls{
      position:relative;
      float:right;
      button{
        margin-left:10px;
      }
    }
  }
  ::v-deep .ivu-icon-ios-arrow-down:before {
    content: "";
  }
}
</style>
