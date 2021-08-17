<template>
<div class="holidayEdit">
  <div class="account-edit">
    <div class="account-edit-bg" v-on:click="closeEdit"></div>
    <div class="account-edit-text">
      <div class="edit-title">
        {{ $t(msgTitle) }}
      </div>
        <div class="edit-close" v-on:click="closeEdit">
          <Icon type="md-close" />
        </div>
      <div class="edit-text">
        <Form  ref="formInline" :model="datas" :rules="ruleInline" label-position="right" inline :label-width="80">
          <FormItem prop="name" :label="$t('名称')">
            <Input v-model="datas.name"></Input>
          </FormItem>
          <FormItem prop="begin" :label="$t('开始日期')">
            <DatePicker v-model="datas.begin" format="yyyy-MM-dd" :editable="false" type="date" :placeholder="$t('holder.选择日期')" @on-change="beginDateDidChange"></DatePicker>
          </FormItem>
          <FormItem prop="end" :label="$t('结束日期')">
            <DatePicker v-model="datas.end" format="yyyy-MM-dd" type="date" :editable="false" :placeholder="$t('holder.选择日期')"  @on-change="endDateDidChange"></DatePicker>
          </FormItem>
          <FormItem prop="property" :label="$t('活动归属')"  class="belongs" v-show = "showBelong">
            <Select v-model="datas.property" >
              <Option v-for="item in propertyList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="target_enter" :label="$t('目标客流')">
             <Input v-model="datas.target_enter" type="number" ></Input>
          </FormItem>
          <FormItem prop="description" :label="$t('描述')" >
            <Input type="textarea" v-model="datas.description" ></Input>
          </FormItem>
          <FormItem style="margin-bottom:0px;margin-left:20px;">
            <Button type="primary" @click="handleSubmit('formInline')">{{ $t('保存') }}</Button>
            <Button class="buttonCel"  v-on:click="closeEdit">{{ $t('取消') }}</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <alert
      v-if="isAlert"
      @closeAlert ='closeAlert'
      @alertConfirm ='alertConfirm'
      :alertText='alertText'
    ></alert>
  </div>
</div>
</template>

<script>
import { validName, validRemark } from '@/libs/util'
import {  addActiveDays, updateActiveDays } from '@/api/manager.js'
import moment from 'moment'
import alert from '@/components/alert.vue'
export default {
  name: 'editHoliday',
  props: {
    editData: Object
  },
  components: {
  alert
  },
  created () {
  let propertyList = []
  let data = this.$store.state.home.organizationData.property
  let rold_id = this.$store.state.user.role_id
  if (rold_id < 3) {
    data.map(function (m) {
    let obj = {}
    obj.name = m.name
    obj.label = m.name
    obj.value = m.property_id
    obj.id = m.property_id
    propertyList.push(obj)
    })
  } else {
    let checkilist = this.$store.state.user.checklist
    data.map(function (m) {
    if (checkilist.indexOf(m.property_id) > -1) {
      let obj = {}
      obj.name = m.name
      obj.label = m.name
      obj.value = m.property_id
      obj.id = m.property_id
      propertyList.push(obj)
    }
    })
  }
  this.propertyList = propertyList
  },
  mounted () {
  },
  data () {
  const validateProperty = (rule, value, callback) => {
    if (value === undefined || value === '') {
    callback(new Error(this.$t('holder.请选择')))
    } else {
    callback()
    }
  }
  const validate = (rule, value, callback) => {
    if (value === undefined || value === '' || value === 'NaN-NaN-NaN') {
    callback(new Error(this.$t('holder.请选择')))
    } else {
    callback()
    }
  }
  return {
    propertyList: [],
    isUpdate: false,
    isAlert: false,
    alertText: {
    title: '',
    text: '',
    bg: '',
    confirm: false
    },
    activePrompt: true,
    showEdit: false,
    msgTitle: '添加活动',
    color: 'primary',
    showBelong: false,
    datas: {
    name: '',
    begin: '',
    end: '',
    target_enter: '',
    description: '',
    property: ''
    },
    ruleInline: {
    name: [{ required: true, validator: validName, trigger: 'blur' }],
    begin: [{ required: true, validator: validate, trigger: 'change' }],
    end: [{ required: true, validator: this.validateEndTime, trigger: 'change' }],
    property: [{ required: true, validator: validateProperty, trigger: 'change' }],
    description: [
      { required: false, validator: validRemark, trigger: 'blur' }
    ]
    }
  }
  },
  computed: {
  },
  methods: {
    validateEndTime(rule, value, callback){
      if (value === '') {
        callback(new Error(this.$t('请选择结束时间')));
      } else if (moment(value).isBefore(this.datas.begin)) {
        callback(new Error(this.$t('结束时间应晚于开始时间')));
      } else {
        callback();
      }
    },
  formatDate (date) {
    var nDate = new Date(date)
    var year = nDate.getFullYear()
    var month = Number(nDate.getMonth() + 1) >= 10 ? (nDate.getMonth() + 1) : '0' + (nDate.getMonth() + 1)
    var day = Number(nDate.getDate()) >= 10 ? nDate.getDate() : '0' + (nDate.getDate())
    return year + '-' + month + '-' + day
  },
  handleSubmit (name) {
    var beginString = this.formatDate(this.datas.begin)
    beginString = beginString.indexOf('NaN') > -1 ? '' : beginString
    this.datas.begin = beginString
    var endString = this.formatDate(this.datas.end)
    endString = endString.indexOf('NaN') > -1 ? '' : endString
    this.datas.end = endString
    this.$refs[name].validate((valid) => {
    if (valid) {
      this.mok(this.datas)
    }
    })
  },
  cancel () {
    this.showEdit = false
  },
  endDateDidChange (fdate, pdate) {
    this.datas.end = fdate
  },
  beginDateDidChange (fdate, pdate) {
    this.datas.begin = fdate
  },
  alertConfirm (valuer) {
    if (valuer) {
      this.$emit('editData')
    } else {
      this.isAlert = false
    }
  },
  closeEdit () {
    this.$emit('closeEdit')
  },
  mok (row) {
    var toBeEdit = row
    toBeEdit.end = toBeEdit.end + ' 23:59:59'
    toBeEdit.property_id = toBeEdit.property
    if (this.isUpdate) {
    updateActiveDays(toBeEdit).then(res=> {
      if (res.data.message.length > 0) {
        this.isAlert = true
        this.alertText.bg = '#00A0E9'
        this.alertText.title = '编辑活动'
        this.alertText.text = '活动名称已存在,请修改'
        this.alertText.confirm = false
      } else {
        this.$emit('closeEdit')
        this.$emit('showAlert', true, '#00A0E9', '编辑活动', '修改活动成功', false)
        this.$emit('initData', 21, false)
      }
    })
    }
    if (!this.isUpdate) {
    var toBeEdit = _.cloneDeep(this.datas)
    toBeEdit.property_id = toBeEdit.property
    toBeEdit.type_id = 21
    toBeEdit.date = this.selectyear
    addActiveDays(toBeEdit).then(res=> {
      if (res.data.message.length > 0) {
        this.isAlert = true
        this.alertText.bg = '#00A0E9'
        this.alertText.title = this.$ts('添加活动')
        this.alertText.text = this.$ts('活动名称已存在,请修改')
        this.alertText.confirm = false
      } else {
        this.$emit('closeEdit')
        this.$emit('showAlert', true, '#00A0E9', this.$ts('添加活动'), this.$ts('添加活动'), false)
        this.$emit('initData', 21, false)
      }
    })
    }
  }
  }
}
</script>
<style scope lang="scss">
.holidayEdit{
  .account-edit{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 66666;
    .account-edit-bg{
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.3;
    }
    .account-edit-text{
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -220px;
        margin-top: -243px;
        width: 440px;
        background-color: #fff;
        background: white;
        border: 1px solid #d7dfe3;
        -webkit-box-shadow: 1px 2px 10px 0px rgba(193, 193, 193, .2);
        box-shadow: 1px 2px 10px 0px rgba(193, 193, 193, .2);
        border-radius: 8px;
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
        padding: 24px 0;
        width: 100%;
        /deep/.ivu-form-item-content{
          width: 218px!important;
        }
        /deep/.ivu-input{
          width: 218px!important;
        }

  }
    }
}
.belongs .ivu-form-item-content {
  height: 36px;
}
.ivu-form .ivu-form-item-label{
  width: 100%;
  font-size:12px;
  font-family:SourceHanSansCN-Regular;
  font-weight:400;
  color:rgba(153,149,149,1);
  text-align: left;
  margin-top: 0px;
}
.ivu-input,.ivu-select-single .ivu-select-selection,.ivu-select{
  width: 100%;
  border:1px solid rgba(215,223,227,1);
  box-shadow:1px 2px 10px 0px rgba(193,193,193,0.2);
  border-radius:8px;
  float: left;
  font-family: "source_han_sans_cn", "Roboto", sans-serif;
}
// .ivu-select{
//     width: 158px;
// }
.account-edit .account-edit-text .edit-text .model-right .flex .half{
  width: 45%;
}
.account-edit .account-edit-text .edit-text .model-right .left{
  width: 47%;
}
.ivu-form-item{
  margin-bottom: 20px;
}
.account-edit-text{
  .ivu-form-item-error-tip{
  top: 110%;
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
form{
  padding-left: 74px;
}
.ivu-form-item-content{
  // line-height: 58px;
}
.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type.ivu-date-picker-editor {
  width: 100%;
}
.buttonCel{
  margin-left:20px;
}

}
</style>
