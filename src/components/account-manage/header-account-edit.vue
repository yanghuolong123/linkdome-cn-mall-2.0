<template>
    <div class="header-account-edit">
         <div class="account-edit-bg" v-on:click="closeEdit"></div>
         <div class="account-edit-text" :style="{marginTop:marginTops+'px'}">
                <div class="edit-title">
                    {{$t('editUser')}}
                </div>
                <div class="edit-close" v-on:click="closeEdit">
                    <Icon type="md-close" />
                </div>
                <div class="edit-text">
                    <div class="edit-left">
                        <div class="imgDiv">
                            <img :src="uploadImg" class="uploadImg">
                        </div>
                        <uploadImg @changeImg="changeImg"></uploadImg>
                    </div>
                    <div class="model-right">
                        <div class="edit-right-title">{{ $t('detailInfo') }}</div>
                        <Form ref="formInline" :model="userForm" :rules="ruleInline" inline>
                            <div class="flex">
                                <div class="half">
                                    <FormItem prop="username" :label="$t('accountName')">
                                        <Input :disabled="true" :maxlength="45" :placeholder="$t('fn.inputHolder',[$t('accountName')])" v-model="userForm.username"></Input>
                                    </FormItem>
                                </div>
                                <div class="half">
                                    <FormItem prop="realname"  :label="$t('userName')">
                                        <Input v-model="userForm.realname" :maxlength="128" :placeholder="$t('fn.inputHolder',[$t('userName')])"/>
                                    </FormItem>
                                </div>
                            </div>
                            <div class="flex password">
                                <div class="half">
                                <FormItem prop="password" :label="$t('Psw')">
                                    <Input v-model="userForm.password" type="password" placeholder/>
                                </FormItem>
                                </div>
                                <div class="half">
                                <FormItem prop="password2" :label="$t('confirmPsw')">
                                    <Input v-model="userForm.password2" type="password" placeholder/>
                                </FormItem>
                                </div>
                            </div>
                            <div class="flex" v-if="showLvl">
                              <div class="flex left">
                              <div class="more" v-if="showRolePermission">
                                <FormItem prop="role"  :label="$t('role')">
                                <Select v-model="userForm.role" :disabled="disabledRole">
                                        <Option
                                    v-for="item in roleList"
                                        :value="item.value"
                                        :key="item.value"
                                        >{{ $t(item.label) }}</Option>
                                    </Select>
                                    </FormItem>
                                </div>
                                <div class="more">
                                    <FormItem prop="sex" :label="$t('gender')">
                                    <Select v-model="userForm.sex">
                                        <Option
                                        v-for="item in sexList"
                                        :value="item.value"
                                        :key="item.value"
                                        >{{ $t(item.label) }}</Option>
                                    </Select>
                                    </FormItem>
                                </div>
                                <div class="more">
                                    <FormItem prop="mobile" :label="$t('phoneNumber')">
                                    <Input v-model="userForm.mobile" placeholder/>
                                    </FormItem>
                                </div>
                                <div class="more">
                                    <FormItem prop="email" :label="$t('mail')">
                                    <Input v-model="userForm.email" type="email" placeholder/>
                                    </FormItem>
                                </div>
                                </div>
                                <div class="flex right">
                                <div class="more"  v-if="showRolePermission">
                                  <FormItem prop="bzidList"  :label="$t('entityPerms')" style="position:relative">
                                    <el-cascader
                                    v-model="userForm.bzidList"
                                    :disabled="disabledRole"
                                    size="mini"
                                    collapse-tags
                                    :options="organization"
                                    :props="{ multiple: true, checkStrictly: false }"
                                    clearable></el-cascader>
                                  </FormItem>
                                </div>
                                </div>
                            </div>
                            <div class="flex" v-if="!showLvl">
                                <div class="half">
                                <FormItem prop="sex" :label="$t('gender')">
                                    <Select v-model="userForm.sex">
                                    <Option
                                        v-for="item in sexList"
                                        :value="item.value"
                                        :key="item.value"
                                    >{{ $t(item.label) }}</Option>
                                    </Select>
                                </FormItem>
                                </div>
                                <div class="half">
                                <FormItem prop="mobile" :label="$t('phoneNumber')">
                                    <Input v-model="userForm.mobile" placeholder/>
                                </FormItem>
                                </div>
                            </div>
                            <div class="flex" v-if="!showLvl">
                                <div class="more">
                                <FormItem prop="email" :label="$t('mail')" >
                                    <Input v-model="userForm.email" type="email" placeholder/>
                                </FormItem>
                                </div>
                            </div>
                            <div class="flex">
                                <div class="control">
                                <FormItem>
                                    <Button  @click="handleSubmit('formInline')">{{$t('submit')}}</Button>
                                    <Button class="buttonCel" @click.native="closeEdit">{{$t('cancel')}}</Button>
                                </FormItem>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
import { validateTel, validateSelectMore } from '@/libs/util'
import uploadImg from '_c/common/uploadImg.vue'
import md5 from 'md5'
import { updateUserData, getbusinessDate } from '@/api/manager.js'
import _ from 'lodash'
import { Cascader } from 'element-ui'
import { getRolesList } from '@/api/custom.js'
export default {
  name: 'headerAccount',
  props: {
    editData: Object
  },
  components: {
    uploadImg
  },
  data () {
    // 验证密码
    const validatePass = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error(this.$t('fn.cantBeEmpty',[this.$t('password')])))
      } else if (value.length < 6) {
        callback(new Error(this.$t('fn.strMinLength',[this.$t('6')])))
      } else if (value.length > 255) {
        callback(new Error(this.$t('fn.strMaxLength',[this.$t('255')])))
      } else {
        callback()
      }
    }
    // 验证用户名
    const validUserName = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error(this.$t("fn.cantBeEmpty",[this.$t('accountName')])))
      } else if (value.length < 2) {
        callback(new Error(this.$t('fn.strMinLength',[this.$t('2')])))
      } else if (value.length > 10) {
        callback(new Error(this.$t('fn.strMaxLength',[this.$t('10')])))
      } else {
        callback()
      }
    }
    // 验证用户姓名
    const validRealName = (rule, value, callback) => {
      if (value === undefined || value === '' || value === null) {
        callback()
      } else if (value.length < 2) {
        callback(new Error(this.$t('fn.strMinLength',[this.$t('2')])))
      } else if (value.length > 10) {
        callback(new Error(this.$t('fn.strMaxLength',[this.$t('10')])))
      } else {
        callback()
      }
    }
    // 验证确认密码
    const validatePassCheck = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error(this.$t('fn.cantBeEmpty',[this.$t('password')])))
      } else if (value.length < 6) {
        callback(new Error(this.$t('fn.strMinLength',[this.$t('6')])))
      } else if (value.length > 255) {
        callback(new Error(this.$t('fn.strMaxLength',[this.$t('50')])))
      } else if (value !== this.userForm.password) {
        callback(new Error(this.$t('pswInconsistent')))
      } else {
        callback()
      }
    }
    return {
      roleList: [],
      organization: [],
      disabledRole: false,
      showRolePermission: true,
      checklists: [],
      marginTop: 0,
      uploadImg: require('@/assets/images/fixation_img/rest/who.png'),
      userForm: {
        avatar: require('@/assets/images/fixation_img/rest/who.png'),
        username: '',
        realname: '',
        mobile: '',
        checklist: '',
        age: '',
        sex: '',
        lvl: '',
        role: '',
        email: '',
        password: '',
        password2: '',
        userid: ''
      },
      ruleInline: {
        username: [{ required: true, validator: validUserName, trigger: 'blur' }],
        realname: [{ required: false, validator: validRealName, trigger: 'blur' }],
        mobile: [{ required: false, validator: validateTel, trigger: 'blur' }],
        checklist: [{ required: true, validator: validateSelectMore, trigger: 'change' }],
        lvl: [{ required: true, validator: validateSelectMore, trigger: 'change' }],
        email: [{ required: true, message:  this.$t("fn.cantBeEmpty",[this.$t('mail')]), trigger: 'blur' },
          { type: 'email', message:this.$t('emailFormatError'), trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        password2: [{ required: true, validator: validatePassCheck, trigger: 'blur' }]
      },
      sexList: [{ 'label': 'male', 'value': 1 }, { 'label': 'female', 'value': 0 }],
      showLvl: true
    }
  },
  computed: {
    marginTops () {
      return this.marginTop
    }
  },
  mounted () {
    this.initOrganization()
    this.initRoleList()
    let that = this
    let userType = that.$store.state.user.role_id < 3 ? 'admin' : ''

    if (userType == 'admin') {
      that.disabledRole = true
      that.showLvl = true
      that.marginTop = -330
    } else {
      that.disabledRole = false
      that.showLvl = false
      that.marginTop = -250
    }
    this.userForm = _.cloneDeep(this.editData)
    this.userForm.role = this.userForm.role_id
    this.userForm.password = '******'
    this.userForm.password2 = '******'
    this.userForm.username = this.userForm.userName
    this.userForm.realname = this.userForm.realName

  },
  methods: {
    initOrganization () {
      var that = this
      getbusinessDate(52).then(function (res) {
        if (res.data.code == 200) {
          let userRoleId = that.$store.state.user.role_id

          let data = res.data.data
          let organization = data.map(function (m) {
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
              })
            }
            return m
          })
          if (userRoleId < 3) {
            that.organization = organization
            that.userForm.bzidList = organization.map(function (m) {
              return m.id
            })
          } else {
            let temp = []
            let role_property = that.$store.state.user.checklist
            if (role_property.length) {
              let tem = role_property.split(',')
              tem.map(function (m) {
                return Number(m)
              })
              tem.forEach(function (m) {
                temp.push(_.find(organization, ['value', m]))
              })
              that.organization = temp
            } else {
              that.organization = _.find(organization, ['value', role_property])
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
          if (role_id < 3) {
            let obj = {}
            obj.name = '集团管理员'
            obj.label = '集团管理员'
            obj.value = 2
            obj.id = 2
            that.roleList.unshift(obj)
          }
          if (role_id == 1) {
            let obj = {}
            obj.name = '超级管理员'
            obj.label = '超级管理员'
            obj.value = 1
            obj.id = 1
            that.roleList.unshift(obj)
          }
        }
      })
    },
    closeEdit () {
      this.$emit('closeEdit')
    },
    changeImg (img) {
      this.userForm.avatar = img
      this.uploadImg = img
    },
    handleSubmit (name) {
      var that = this
      that.$refs[name].validate((valid) => {
        if (valid) that.updataUser()
      })
    },
    updataUser () {
      var that = this
      var user = {}
      user.lvl = this.userForm.lvl
      user.username = this.userForm.username
      user.password = this.userForm.password === '******' ? '' : md5(this.userForm.password)
      user.checklist = this.userForm.checklist.join(',')
      if (user.checklist.indexOf('all') > -1) {
        var checklists = _.cloneDeep(that.checklists)
        checklists.shift()
        let checklist = checklists.map( (m, index)=> {
          return m.value
        })
        user.checklist = checklist.join(',')
      }
      user.realname = this.userForm.realname
      user.sex = this.userForm.sex
      user.mobile = this.userForm.mobile
      user.email = this.userForm.email
      user.avatar = this.userForm.avatar
      user.id = that.userForm.userId
      updateUserData(user)
        .then(res => {
          if (res.data.code === 200) {
            if (user.avatar === require('@/assets/images/fixation_img/rest/who.png')) user.avatar = ''
            that.$store.commit('setAvator', user.avatar)
            user.checklist = user.checklist.split(',')
            user.checklist.forEach( (e, index)=> {
              user.checklist[index] = Number(e)
            })
            that.$store.commit('setchecklist', user.checklist)
            that.$store.commit('setemail', user.email)
            that.$store.commit('setrealName', user.realname)
            that.$store.commit('setmobile', user.mobile)
            that.$store.commit('setSex', user.sex)
            user.lvl === 22 ? that.$store.commit('setlvl', 'admin') : that.$store.commit('setlvl', 'normal')
            this.$message.success(this.$t('fn.successTo', [this.$t('editUser')]))
            that.$emit('closeEdit')
          } else if (res.data.code === 307) {
            this.$message.warning(this.$t('emailOccupy'))
          }
        })
    }
  }

}
</script>

<style scope lang="scss">
    .header-account-edit{
        position: fixed;
        left: 260px;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 66666;
        .account-edit-bg{
            width: 100%;
            height: 100%;
        }
        .account-edit-text{
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -414px;
            width: 828px;
            padding-bottom: 80px;
            height: auto;
            background-color: #fff;
            background:rgba(255,255,255,1);
            border:1px solid rgba(215,223,227,1);
            box-shadow:1px 2px 10px 0px rgba(193,193,193,0.2);
            border-radius:8px;
            .edit-title{
                width: 100%;
                height: 53px;
                line-height: 53px;
                padding-left: 20px;
                background:rgba(242,242,242,1);
                font-size:18px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(91,89,89,1)
            }
            .edit-text{
               display: flex;
                padding-top: 24px;
                width: 100%;

                 .edit-left {
                width: 38%;
                .imgDiv {
                text-align: center;
                margin-top: 30px;
                margin-bottom: 20px;
                img {
                    width: 177px;
                    height: 177px;
                    border-radius: 50%;
                }
                }
            }
            .model-right {
                width: 62%;
                .edit-right-title{
                font-size:13px;
                font-family:SourceHanSansCN-Regular;
                font-weight:400;
                color:rgba(153,149,149,1);

            }

            .flex {
                display: flex;
                .ivu-form-item {
                    width: 100%;
                }
                p {
                    font-size: 18px;
                    height: 40px;
                    line-height: 40px;
                }
                .half {
                    width: 48%;
                    margin-right: 2%;
                }
                .three {
                    width: 31%;
                    margin-right: 2%;
                }
                .more {
                    width: 96%;
                    margin-right: 4%;
                }
                .control {
                    position: absolute;
                    bottom: 30px;
                    right: 30px;
                    text-align: right;
                    .ivu-btn{
                        width: 90px;
                        color: #fff;
                        outline: none;
                        &:nth-child(1){
                            margin-right: 20px;
                            background-color: #00a0e9;
                            &:hover{
                                border:px solid #00a0e9;
                            }
                        }
                        &:nth-child(2){
                            background-color: #fff;
                            color:#515a6e;
                            &:hover{
                               color: #57a3f3;
                            }
                        }
                    }
                }
            }
            .left {
            width: 50%;
            flex-flow: column;
            }
            .right {
            width: 50%;
                }
            }
        }
    }
}
.account-edit-text{
    .ivu-form .ivu-form-item-label{
        width: 100%;
        font-size:12px;
        font-family:SourceHanSansCN-Regular;
        font-weight:400;
        color:rgba(153,149,149,1);
        text-align: left;
        margin-top: 15px;
    }
    .ivu-input-wrapper{
        width: 158px;
    }
    .ivu-input,.ivu-select-single .ivu-select-selection,.ivu-select{
        border:1px solid rgba(215,223,227,1);
        box-shadow:1px 2px 10px 0px rgba(193,193,193,0.2);
        border-radius:8px;
        font-family: "source_han_sans_cn", "Roboto", sans-serif;
    }
    .ivu-select{
        width: 158px;
    }
    .account-edit .account-edit-text .edit-text .model-right .flex .half{
        width: 45%;
    }
    .account-edit .account-edit-text .edit-text .model-right .left{
        width: 47%;
    }
    .ivu-form-item{
        margin-bottom: 0;
    }
    .edit-close{
      position: absolute;
      right: -5px;
      top: -5px;
      background: #fff;
      width: 33px;
      height: 33px;
      box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
      border-radius: 5px;
      text-align: center;
      line-height: 33px;
      cursor: pointer;
      transition: all .23s ease .1s;
      &:hover{
          transform: translate(5px,-5px);
          box-shadow: 0 0 0 0 rgba(0,0,0,.1)
      }
      i{
        font-size: 20px;
      }
    }
}

</style>
