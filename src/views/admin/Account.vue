<template>
    <div class="account-center">
        <div class="flex mb-4 account-text">
            <div class="w-full bg-grid-color-secondary">
                <div class="account-text-right">
                    <div class="account-seach">
                      <div class="data-picker">
                        <div class="account-seach-text">
                            <!-- <Icon size='24' type="ios-search" /> -->
                            <input type="text" v-model="searchText" placeholder="请输入用户名">
                        </div>
                        <div class="account-seach-text" style="margin-left:10px;">
                            <input type="text" v-model="searchRole" placeholder="请输入角色">
                        </div>
                        <div class="account-add-remove">
                            <span class="account-add" title="添加" @click="addData">
                                <Icon type="md-add" />
                            </span>
                            <span  title="删除" @click="allRemoveData">
                                <Icon type="md-remove" />
                            </span>
                        </div>
                      </div>
                    </div>
                    <div class="account-table">
                        <table-multiple-selected
                            @tableData='tableData'
                            @removeData='removeData'
                            @tableSelect ='tableSelect'
                            :tableName='tableName'
                            :tableList='filterUser'
                            :titleName='titleName'
                            :isMultiple='true'
                        >
                        </table-multiple-selected>
                    </div>
                </div>
            </div>
        </div>
         <account-edit
            v-if="isEdit"
            @closeEdit ='closeEdit'
            @editData ='editData'
            :editData ='dataList'
            :roleList="roleList"
            :organization="organization"
          ></account-edit>

          <alert
            v-if="isAlert"
            @closeAlert ='closeAlert'
            @alertConfirm ='alertConfirm'
            :alertText='alertText'
           ></alert>
    </div>
</template>

<script>
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import alert from '@/components/alert.vue'
import accountEdit from '@/components/account-manage/account-edit.vue'
import photoImg from '@/assets/images/fixation_img/rest/who.webp'
import { getUserData, deleteUserData, getbusinessDate } from '@/api/manager.js'
import { getRolesList } from '@/api/custom.js'
import _ from 'lodash'

export default {
  components: {
    TableMultipleSelected,
    accountEdit,
    alert

  },
  data () {
    return {
      removeType: 0,
      accountText: '',
      isAlert: false,
      tableIdList: [],
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      isEdit: false,
      userLvl: '',
      searchText: '',
      searchRole: '',
      dataList: {},
      colorAlert: '#00a0e9',
      titleName: '用户信息列表',
      tableName: [
        '头像', '用户名', '姓名', '角色', '性别', '手机号', '邮箱', '操作'
      ],
      tableList: [],
      userId: '',
      roleList: [],
      organization: []
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    filterUser () {
      var that = this
      return this.tableList.filter(function (u, index, array) {
        return u.account.toLowerCase().includes(that.searchText.toLowerCase()) && u.rank.includes(that.searchRole)
      })
    }
  },
  created () {
    this.initRoleList()
    this.initOrganization()
  },
  mounted () {
    this.initData()
  },
  methods: {
    initOrganization () {
      var that = this
      getbusinessDate(52).then(function (res) {
        if (res.data.code == 200) {
          let userRoleId = that.$store.state.user.role_id

          let data = res.data.data
          let organization = data.map(function (m, index) {
            m.value = m.id
            m.label = m.name
            if (m.children) {
              m.children.forEach(function (e) {
                e.value = e.id
                e.label = e.name
                if (e.children) {
                  e.children.forEach(function (k) {
                    k.value = k.id
                    k.label = k.name
                  })
                }
                if (e.gate) {
                  e.gate.forEach(function (k) {
                    let kk = {}
                    kk.id = k.id
                    kk.value = k.id
                    kk.label = k.name
                    kk.name = k.name
                    if (!(e.children)) {
                      e.children = []
                    }
                    e.children.push(kk)
                  })
                }
                if (e.area) {
                  e.area.forEach(function (k) {
                    let kk = {}
                    kk.id = k.id
                    kk.value = k.id
                    kk.label = k.name
                    kk.name = k.name
                    if (!e.children) {
                      e.children = []
                    }
                    e.children.push(kk)
                  })
                }
              })
            }
            return m
          })
          if (userRoleId < 3) {
            that.organization = organization
          } else {
            let temp = []
            let role_property = that.$store.state.user.checklist
            if (role_property.length) {
              let tem = role_property
              if (role_property.indexOf(',') > -1) {
                tem = role_property.split(',')
              }
              tem.map(function (m) {
                return Number(m)
              })
              tem.forEach(function (m) {
                temp.push(_.find(organization, ['property_id', m]))
              })
              that.organization = temp
            } else {
              that.organization = _.find(organization, ['property_id', role_property])
            }
          }
        }
      })
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
          let role_id = that.$store.state.user.role_id
          // if(role_id<4){
          //   that.roleList.unshift({"name":"购物中心管理员","label":"购物中心管理员","value":3,"id":3})
          // }
          if (role_id < 3) {
            that.roleList.unshift({ 'name': '集团管理员', 'label': '集团管理员', 'value': 2, 'id': 2 })
          }
          if (role_id < 2) {
            that.roleList.unshift({ 'name': '超级管理员', 'label': '超级管理员', 'value': 1, 'id': 1 })
          }
        }
      })
    },
    initData () {
      var that = this
      getUserData().then(function (res) {
        if (res.data.code === 200) {
          that.tableList = []
          _.forEach(res.data.data, function (item) {
            var list = {}
            list.id = item.userid
            list.photo = (!_.isNull(item.avatar)) ? item.avatar : photoImg
            list.account = item.username
            if (_.isNull(item.realname)) list.name = ' '
            else list.name = item.realname
            list.rank = item.roles_name
            list.roles_id = item.roles_id
            if (item.sex != null) {
              item.sex === 1 ? list.gender = '男' : list.gender = '女'
            } else {
              list.gender = ' '
            }
            if (_.isNull(item.mobile)) list.mobile = ' '
            else list.mobile = item.mobile
            list.email = item.email
            list.operation = true
            list.checklist = item.checklist
            list.role = item.roles_id
            list.bzidList = item.business_zone_privilege ? JSON.parse(item.business_zone_privilege) : ''
            list.password = ''
            that.tableList.push(list)
          })
        }
      })
    },
    editData () {
      this.initData()
      this.isEdit = false
    },
    addData () {
      this.isEdit = true
      this.dataList = {
        data: '',
        type: 'add'
      }
    },
    tableData (value) {
      this.isEdit = true
      this.dataList = _.cloneDeep(value)
    },
    closeEdit () { this.isEdit = false },
    closeAlert () { this.isAlert = false },
    alertConfirm (valuer) {
      var that = this, id
      if (valuer === true) {
        that.isAlert = false
        id = this.removeType === 0 ? this.accountText.data.id : this.tableIdList.join(',')
        deleteUserData(id).then(function (res) {
          if (res.data.code === 200) {
            that.alertStart('删除用户', '删除成功', false)
            that.initData()
          }
        })
      } else {
        this.isAlert = false
      }
    },
    tableSelect (value) {
      var that = this
      that.tableIdList = []
      value.forEach(function (e) {
        that.tableIdList.push(e.id)
      })
    },
    allRemoveData () {
      this.removeType = 1
      this.alertStart('删除用户', '确认删除选中用户信息？', true)
    },
    removeData (value) {
      this.removeType = 0
      this.alertStart('删除用户', '确认删除此用户信息？', true)
      this.accountText = value
    },
    alertStart (title, text, confirm) {
      this.alertText = {
        title: title,
        text: text,
        bg: '#00A0E9',
        confirm: confirm
      }
      this.isAlert = true
    }
  }
}
</script>

<style scope lang="scss">
#content-overlay{
  background-color: #f5f5f5;
}
.account-center{
    .account-text{
        margin-top: 25px;
        .account-text-right{
            width: 100%;
            height: auto;
            .account-seach{
                width: 100%;
                height: 43px;
                .data-picker{
                    margin-bottom: 20px;
                    overflow: hidden;
                    background-color: #fff;
                    padding: 18px 30px;
                    -webkit-box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
                    box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
                    border-radius: 6px;
                }
                .account-seach-text{
                    width: 252px;
                    height: 100%;
                    border-radius: 6px;
                    border: 1px solid rgba(0,0,0,.2);
                    padding: 5px;
                    float: left;
                    background-color: #fff;
                    .ivu-icon{
                        float: left;
                    }
                    input{
                        display: inline-block;
                        width: 195px;
                        border: none;
                        height: 31px;
                        margin-left: 10px;
                        padding-left: 10px;
                        background-color: rgba(93, 144, 255, 0.0);
                    }
                }
                .account-add-remove{
                    float:right;
                    margin-right: 10px;
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
                        &:nth-child(1){
                          margin-top: 9px;
                          background-color: #2BD9CF;
                        }
                         &:nth-child(2){
                          margin-top: 9px;
                          background-color: #FEB33D;
                        }
                        i{
                          margin-top:3px;
                        }
                    }
                }
            }
            .account-table{
                margin-top:52px;
                background:rgba(255,255,255,1);
                box-shadow:0px 2px 9px 1px rgba(175,175,176,0.25);
                border-radius:6px;
                overflow: auto;
            }
        }
    }

    .vx-card .vx-card__collapsible-content {
        img{
            width: 38px;
            height: 38px;
            border-radius: 50%;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
        }
    }
    .vs-con-table .vs-con-tbody .vs-table--tbody-table .vs-table--thead th{
        &:nth-child(2){
            padding-left: 10px
        }
    }
    .vs-con-table .vs-con-tbody .vs-table--tbody-table .tr-table td{
        padding: 1rem 0;
        &:nth-child(2){
            padding-left: 10px
        }
        &:last-child{
            width: 130px;
            span{
              display: inline-table;
                span{
                    display: inline-block;
                    float: left;
                    border-radius: 50%;
                    text-align: center;

                    color:#C7C6C6;
                    margin-right: 20px;
                    .ivu-icon{
                        font-size: 19px;
                    }
                }
            }
        }

    }
}
</style>
