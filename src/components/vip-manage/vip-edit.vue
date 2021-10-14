<template>
    <div class="vip-edit">
        <div class="vip-edit-bg" v-on:click="closeEdit"></div>
        <div class="vip-edit-text" :style="{height:mHeight,marginTop:marginTop,}">
            <div class="edit-title"> {{editTitle}} </div>
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
              <div class="modal-right">
                <p class="m-title">详细信息</p>

                <Form ref="formInline" :model="form" :rules="ruleInline" inline>
                  <div class="flex">
                    <div class="half">
                      <FormItem prop="formName" label="姓名">
                        <Input v-model="form.formName"/>
                      </FormItem>
                    </div>
                    <div class="half">
                      <FormItem prop="formTel" label="手机号">
                        <Input v-model="form.formTel" placeholder/>
                      </FormItem>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="half">
                      <FormItem prop="formAge" label="年龄">
                        <Select v-model="form.formAge">
                          <Option
                            v-for="item in ageList"
                            :value="item.value"
                            :key="item.value"
                          >{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                    </div>
                    <div class="half">
                      <FormItem prop="formSex" label="性别">
                        <Select v-model="form.formSex">
                          <Option
                            v-for="item in sexList"
                            :value="item.value"
                            :key="item.value"
                          >{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="half" v-show="modify&&type=='VIP'">
                      <FormItem prop="formTimes" label="到店次数">
                        <Input :disabled="true" v-model="form.formTimes"/>
                      </FormItem>
                    </div>
                  </div>
                  <div class="flex" >
                    <div class="all" v-show="modify&&type=='VIP'">
                      <div class="getMore">
                            <Button  @click="getMore">查看更多</Button>
                      </div>
                      <FormItem prop="formRecord" label="到店记录">
                        <Input :disabled="true" v-model="form.formRecord" :rows="5" type="textarea"/>
                      </FormItem>
                    </div>
                  </div>
                 <!-- <div class="flex">
                    <div class="all">
                      <FormItem prop="formRemark" label="人员归属">
                        <Select v-model="form.affiliation" style="width:217.5px;">
                          <Option
                            v-for="item in comprotList"
                            :value="item.value"
                            :key="item.value"
                          >{{ item.text }}</Option>
                        </Select>
                      </FormItem>
                    </div>
                  </div> -->
                  <div class="flex">
                    <div class="all">
                      <FormItem prop="formRemark" label="备注">
                        <Input type="textarea" v-model="form.formRemark" placeholder/>
                      </FormItem>
                    </div>
                  </div>
                  <div class="flex">
                      <div class="control">
                          <FormItem>
                              <Button  @click="handleSubmit('formInline')">提交</Button>
                              <Button class="buttonCel" @click.native="closeEdit">取消</Button>
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
import Moment from 'moment'
import { validateTel } from '@/libs/util'
import uploadImg from '_c/common/uploadImg.vue'
import { addCustomer, updateCustomer, getComingData } from '@/api/custom.js'
import { getGroupOrganization } from '@/api/home.js'
export default {
  props: {
  },
  components: {
    uploadImg
  },
  data () {
    const validUserName = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('姓名不能为空'))
      } else if (value.length < 2) {
        callback(new Error('姓名长度不得小于2个字符'))
      } else if (value.length > 10) {
        callback(new Error('姓名长度不得大于10个字符'))
      } else {
        callback()
      }
    }
    const validSelect = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    const validAffiliation = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    return {
      comprotList: [],
      type: 'VIP',
      mHeight: '450px',
      marginTop: '-225px',
      editTitle: '',
      alertText: {
        title: '',
        text: '',
        bg: '#00A0E9',
        confirm: false
      },
      checklists: [],
      uploadImg: require('@/assets/images/fixation_img/rest/who.png'),
      whoImg: 'https://deepnorthdev.blob.core.windows.net/dev-public/China_Product_Dashboard_20190326/77984862cb7ef61a8107039b967a3ec2.png',
      /* 添加修改表单 */
      form: {
        formImg: '',
        formName: '',
        formTel: '',
        formAge: '',
        formSex: '',
        formTimes: '',
        formRecord: '',
        formRemark: '',
        affiliation: ''
      },
      /* form valid rule */
      ruleInline: {
        formName: [{ required: true, validator: validUserName, trigger: 'blur' }],
        formTel: [{ required: false, validator: validateTel, trigger: 'blur' }],
        formSex: [{ required: true, validator: validSelect, trigger: 'change' }],
        affiliation: [{ required: true, validator: validAffiliation, trigger: 'change' }]
      },
      ageList: [],
      sexList: [{ value: 1, label: '男' }, { value: 0, label: '女' }],
      timesList: [{ value: '1', label: '1次' }, { value: '2', label: '2次' }, { value: '3', label: '3次' }, { value: '4', label: '4次' }, { value: '5', label: '5次及以上' }],
      modify: ''
    }
  },
  computed: {

  },
  watch: {
    modify (newVal, oldVal) {
      if (newVal) {
        this.mHeight = this.type == 'VIP' ? '680px' : '450px'
        this.marginTop = this.type == 'VIP' ? '-340px' : '-225px'
        this.editTitle = this.type == 'VIP' ? '编辑VIP客户' : '编辑店员'
      } else {
        this.mHeight = '450px'
        this.marginTop = '-225px'
        this.editTitle = this.type == 'VIP' ? '添加VIP客户' : '添加店员'
      }
    }
  },
  mounted () {
    let that = this
    var ageList = []
    for (let i = 15; i < 100; i++) {
      let data = {}
      data['label'] = i + '岁'
      data['value'] = i
      ageList.push(data)
    }
    let admin = this.$store.state.user.role_id
    let allBzid = this.$store.state.user.bzid
    this.ageList = ageList
    getGroupOrganization().then(res => {
      if (res.data.code == 200) {
        this.comprotList = []
        let data = res.data.data
        if (data.property.length != 0) {
          data.property.map(list => {
            if (list.property_id && list.bzid) {
              let l = {
                text: list.name,
                value: list.property_id
              }
              this.comprotList.push(l)
            }
          })
        }
        if (admin > 3) {
          let currList = []
          this.comprotList.map(list => {
            allBzid.map(val => {
              if (da.value == val) currList.push(da)
            })
          })
          this.comprotList = currList
        }
      }
    })
  },
  methods: {
    closeEdit () {
      this.$emit('closeEdit')
    },
    getMore () {
      var range = Moment(new Date()).year() + '-01-01,' + Moment(new Date()).year() + '-12-31'
      var id = this.form.customer_object_id
      var that = this
      getComingData(id, range).then(function (res) {
        var data = res.data.data
        var formRecord = ''
        data.forEach(function (m) {
          formRecord += m.coming_time + '\n'
        })
        that.form.formRecord = formRecord
      })
    },
    changeImg (img) {
      this.form.formImg = img
      this.uploadImg = img
    },
    handleSubmit (name) {
      var that = this
      that.$refs[name].validate((valid) => {
        if (valid) {
          that.addVIP()
        }
      })
    },
    /* 编辑VIP顾客信息
    *@method edit
    *@param {object} row VIP顾客对象
    *@return null
    */
    edit (row) {
      this.modify = true
      this.showMessage = true
      this.form.formImg = row.photo
      this.uploadImg = row.photo
      this.oldImg = _.cloneDeep(row.img)
      this.form.formName = row.name
      this.form.formTel = row.mobile
      this.form.formAge = row.age
      if (Boolean(row.gender) && row.gender != ' ') {
        this.form.formSex = row.gender == '男' ? 1 : 0
      } else {
        this.form.formSex = ' '
      }
      this.form.formTimes = row.times
      this.form.formRecord = row.record.join('')
      this.form.formRemark = row.remark
      this.form.id = row.id
      this.form.customer_object_id = row.customer_object_id
    },
    /* 添加VIP客户
    *@method addVIP
    *@return null
    */
    addVIP () {
      let avatar = this.form.formImg ? this.form.formImg : this.whoImg
      let name = this.form.formName
      let age = this.form.formAge
      let mobile = this.form.formTel
      let ismale = ''
      if (this.form.formSex != ' ') {
        ismale = this.form.formSex == '1' ? 1 : 0
      }
      let type = this.type == 'VIP' ? 1 : 3
      let feature = ''
      let remark = this.form.formRemark
      let mendianid = ''
      var that = this
      if (!that.modify) {
        addCustomer({ avatar, name, age, mobile, ismale, type, feature, remark, mendianid }).then(res => {
          if (res.data.code == 200) {
            that.alertText.title = that.type == 'VIP' ? '添加VIP客户' : '添加店员'
            that.alertText.text = that.type == 'VIP' ? '添加VIP客户成功' : '添加店员成功'
            that.alertText.confirm = false
            that.alertText.show = false
            that.$emit('alertMessage', true, that.alertText)
          } else {
            that.alertText.title = that.type == 'VIP' ? '添加VIP客户' : '添加店员'
            that.alertText.text = res.data.message
            that.alertText.confirm = false
            that.alertText.show = true
            that.$emit('alertMessage', true, that.alertText)
          }
        })
      } else {
        let id = that.form.id
        updateCustomer({ avatar, name, age, mobile, ismale, type, feature, remark, mendianid, id }).then(res => {
          if (res.data.code == 200) {
            that.alertText.title = that.type == 'VIP' ? '编辑VIP客户' : '编辑店员'
            that.alertText.text = that.type == 'VIP' ? '编辑VIP客户成功' : '编辑店员成功'
            that.alertText.confirm = false
            that.alertText.show = false
            that.$emit('alertMessage', true, that.alertText)
          }
        })
      }
    }
  }

}
</script>

<style scoped lang="scss">
    .vip-edit{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 66666;
        .vip-edit-bg{
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: 0.3;
        }
        .vip-edit-text{
            position: absolute;
            left: 50%;
            top:50%;
            margin-left: -414px;
            width: 828px;
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
            padding-top: 10px;
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
          .modal-right {
            width: 65%;
            padding-right:5%;
            .m-title {
              font-size: 18px;
              line-height: 40px;
              height: 40px;
            }
            .flex {
              display: flex;
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
                width: 98%;
                margin-right: 2%;
              }
              .all {
                width: 100%;
                position: relative;
                .getMore{
                    position: absolute;
                    right: 21px;
                    top: 10px;
                    cursor: pointer;
                    z-index: 99999;
                }
              }

              .control{
                  position: relative;
                  width: 52%;
                  left: 33%;
                  top: 18px;
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
              .ivu-form-item{
                width:96%;
              }
            }
          }
    }
  }
  .ivu-form .ivu-form-item-label{
    width: 100%;
    font-size:12px;
    font-family:SourceHanSansCN-Regular;
    font-weight:400;
    color:rgba(153,149,149,1);
    text-align: left;
    margin-top: 15px;
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
.ivu-input,.ivu-select-single .ivu-select-selection,.ivu-select{
  font-family: "source_han_sans_cn", "Roboto", sans-serif;
    border:1px solid rgba(215,223,227,1);
    box-shadow:1px 2px 10px 0px rgba(193,193,193,0.2);
    border-radius:8px;
}
// .vip-edit .vip-edit-text .edit-text .model-right .flex .half{
//     width: 45%;
// }
// .vip-edit .vip-edit-text .edit-text .model-right .left{
//     width: 47%;
// }
.ivu-form-item{
    margin-bottom: 0;
}

</style>
