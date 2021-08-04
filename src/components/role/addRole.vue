<template>
<div class="addRole">
  <div class="dialogs-edit">
    <div class="dialogs-edit-bg"></div>
    <div class="dialogs-edit-text" :style="{height:heights,marginTop:marginTops}">
      <div class="edit-title">
        {{$t(editRoleTitle)}}
      </div>
      <div class="edit-close" v-on:click="closeEdit">
          <Icon type="md-close" />
        </div>
      <div class="edit-text">
        <Form :model="formData" label-position="right" :label-width="92" ref="formData" :rules="ruleInline">
          <FormItem :label="$t('角色名称')" prop="name">
            <Input type ="text" v-model="formData.name" :placeholder="$t('holder.请输入角色')"></Input>
          </FormItem>
          <FormItem :label="$t('角色归属于')" prop="property" >
            <i-select v-model="formData.property" @on-change="getItemValue" :placeholder="$t('holder.请选择')">
              <i-option v-for="item in propertyLists" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>
          </FormItem>
          <FormItem :label="$t('角色描述')" prop="description" :label-width="92">
            <Input  type="textarea" v-model="formData.description" :rows="4"></Input>
          </FormItem>
        </Form>
        <div class="control">
          <Button  @click="handleSubmit('formData')">{{$t('提交')}}</Button>
          <Button class="buttonCel" @click.native="closeEdit">{{$t('取消')}}</Button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import { getGroupOrganization } from '@/api/home.js'
import { addRoles, updateRoles } from '@/api/custom.js'

export default {
  props: {
    roleList: {
      type: [Array, Object],
      default: []
    },
    menuListData: {
      type: [Array, Object],
      default: []
    }
  },
  data () {
    return {
      editRoleTitle: '添加角色',
      propertyList: [],
      height: '360px',
      marginTop: '-180px',
      gate: 'gate',
      isModify: false,
      id: '',
      formData: {
        name: '',
        property: 0,
        description: ''
      },
      ruleInline: {
        name: [{
          required: true,
          message: '请输入长度为2-8的角色名称',
          trigger: 'blur',
          max: 8,
          min: 2
        } ],
        property: [{
          required: true,
          message: '至少选择一项'

        }]
      }
    }
  },
  created () {
      const organizationData = this.$store.state.home.organizationData;
      if(organizationData && organizationData.property){
          this.handleGroupOrganizationData(organizationData.property)
      }else{
          getGroupOrganization().then((resd)=> {
              if (resd.data.code == 200) {
                  this.handleGroupOrganizationData(resd.data.data.property)
              }
          })
      }

  },
  computed: {
    propertyLists () {
      return this.propertyList
    },
    marginTops () {
      if (this.userLvl == 'common_admin') {
        return '-154px'
      } else {
        return '-180px'
      }
    },
    heights () {
      if (this.userLvl == 'common_admin') {
        return '308px'
      } else {
        return '400px'
      }
    }
  },
  methods: {
    handleGroupOrganizationData(data){
      const checkilist = this.$store.state.user.checklist
      const role_id = this.$store.state.user.role_id
      let propertyList = []
      data.map((m) => {
        let obj = {}
        obj.name = m.name
        obj.label = m.name
        obj.value = m.property_id
        obj.id = m.property_id
        if (role_id < 3) {
          propertyList.push(obj)
        } else if (checkilist.indexOf(m.property_id) > -1) {
          propertyList.push(obj)
        }
      })
      this.propertyList = propertyList
    },
    /* 校验表单
    *@method handleSubmit
    *@param {String} name 表单的ref值
    *@return null
    */
    handleSubmit (name) {
      var that = this
      that.$refs[name].validate((valid) => {
        if (valid) {
          that.addRole()
        }
      })
    },
    closeEdit () {
      this.$emit('closeEdit')
    },
    getItemValue (val) {
      this.formData.zone = val
    },
    addRole () {
      var that = this
      var data = {}
      data.name = that.formData.name
      data.property_id = that.formData.property
      data.describ = that.formData.description
      data.metric_privilege = ''
      if (!that.isModify) {
        data.pages_privilege = ''
        addRoles(data).then(function (res) {
          if (res.data.code == 200) {
            that.closeEdit()
            var alertText = {}
            alertText.bg = '#00A0E9'
            alertText.title = that.editTitle
            alertText.text = '添加角色成功'
            alertText.confirm = false
            that.$emit('alertMessage', alertText)
          }
        })
      } else {
        let data = _.find(this.roleList, ['id', this.id])
        data.name = that.formData.name
        data.property_id = that.formData.property
        data.describ = that.formData.description
        let pages_privilege = []
        that.menuListData.forEach(function (m) {
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
        data.id = that.id
        updateRoles(data).then(function (res) {
          if (res.data.code == 200) {
            that.closeEdit()
            var alertText = {}
            alertText.bg = '#00A0E9'
            alertText.title = that.editTitle
            alertText.text = '编辑角色成功'
            alertText.confirm = false
            that.$emit('alertMessage', alertText)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.addRole{
  .dialogs-edit{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 66666;
    .dialogs-edit-bg{
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.3;
    }
    .dialogs-edit-text{
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -250px;
      width: 500px;
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
        width: 80%;
        margin-left: 10%;
        padding-top: 20px;
        position: relative;
        .control{
          position: relative;
          width: 52%;
          left: 33%;
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
    }
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
  .ivu-form-item {
    margin-bottom: 24px;
  }
}
</style>
