<template>
<div>
  <Layout class="forgotpasswordbox">
    <header-Bar></header-Bar>
    <Content class="content">
      <steps :current="current"></steps>
      <Form
        ref="formValidate"
        :model="formData"
        id="formCobox"
        :rules="ruleValidate"
        @keydown.enter.native="handleSubmit"
        v-if="!isresetSuccess"
        class="reserForm"
      >
        <FormItem prop="newPassword" label="密码">
          <Input
            v-model="formData.newPassword"
            size="large"
            autofocus
            placeholder="请输入修改的密码"
            type="password"
          />
        </FormItem>
        <FormItem prop="aginPassword" label="请确认修改后的密码" style="margin-top:20px;">
          <Input
            v-model="formData.aginPassword"
            size="large"
            autofocus
            placeholder="请再次输入修改的密码"
            type="password"
          />
        </FormItem>
        <FormItem>
          <Row type="flex" justify="space-between" class="footButton">
            <i-col :sm="8" :xs="24">
              <Button type="primary" size="large" class="commitButton" @click="handleSubmit" :loading="loading">
                <span v-if="!loading">提交</span>
                <span v-else>发送中...</span>
              </Button>
            </i-col>
            <Button size="large" class="resetButtom" @click="resetForm">{{ $t('重置') }}</Button>
          </Row>
        </FormItem>
      </Form>
      <template v-else>
        <div class="success">
          <p>
            <Icon type="md-checkmark-circle" :size="50" color="#40ddd4"/>
          </p>
          <p>密码修改成功</p>
          <p>您的密码已经找回并修改成功</p>
          <Button type="primary" size="large" @click="backLogin">返回登录页</Button>
        </div>
      </template>
    </Content>
  </Layout>
  <alert
    v-if="isAlert"
    @closeAlert ='closeAlert'
    @alertConfirm ='alertConfirm'
    :alertText='alertText'
  ></alert>
</div>

</template>
<script>
import headerBar from '_c/password/headerbar.vue'
import steps from '_c/password/steps.vue'
import alert from '@/components/alert.vue'
import { resetPassword } from '@/api/user'
import { getParams } from '@/libs/util'
import md5 from 'md5'
export default {
  name: 'forgotPassword',
  components: {
    headerBar,
    steps,
    alert
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于 6 位'))
      } else {
        if (this.formData.newPassword !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('aginPassword')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      formData: {
        newPassword: '',
        aginPassword: ''
      },
      ruleValidate: {
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        aginPassword: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      },
      loading: false,
      userInfo: null,
      current: 2,
      isresetSuccess: false
    }
  },
  mounted () {
    let url = decodeURIComponent(window.location.href)
    try {
      this.userInfo = getParams(url)
    } catch (error) {
    //   this.$router.push('/login')
    }
  },
  methods: {
    handleSubmit () {
      var that = this
      this.$refs.formValidate.validate(valid => {
        if (valid && this.userInfo) {
          this.loading = true
          let params = this.userInfo
          params.passwd1 = md5(this.formData.newPassword)
          params.passwd2 = md5(this.formData.aginPassword)
          resetPassword(params).then(res => {
            this.loading = false
            if (res.data.code === 200) {
              this.current = 3
              this.isresetSuccess = true
            } else if (res.data.code === 304 || res.data.code === 307) {
              // alert('没有此用户')
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '重置密码'
              that.alertText.text = '没有此用户'
              that.alertText.confirm = false
            } else {
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '重置密码'
              that.alertText.text = '修改失败'
              that.alertText.confirm = false
              // alert('修改失败')
            }
          }).catch(err => {
            this.loading = false
            if (!err.response)alert('请求超时')
            else if (err.response.status === 500) alert('服务器错误，请稍后重试')
          })
        }
      })
    },
    resetForm () {
      this.$refs.formValidate.resetFields()
    },
    backLogin () {
      this.$router.push('/login')
    },
    closeAlert () {
      this.isAlert = false
    },
    alertConfirm (valuer) {
      this.isAlert = false
    }
  }
}
</script>
<style scope lang="scss">
.forgotpasswordbox{
  .reserForm{
    width: 500px;
    margin: 50px auto;
    .footButton{
      margin-top: 10px;
    }
    .commitButton{
      width: 90px;
      height: 36px;
    }
    .resetButtom{
      width: 90px;
      height: 36px;
      background-color: #bcbcbc;
      color:#fff;
      font-size: 14px;
      &:hover{
        border: 1px solid #bcbcbc;
      }
    }
  }
  .success{
    width: 500px;
    margin: 40px auto;
    text-align: center;
    p{
      &:nth-child(2){
        margin-top: 10px;
        color: #40DDD4;
        font-size: 19px;
      }
      &:nth-child(3){
        margin-top: 10px;
        color: #87898B;
        font-size: 14px;
      }
    }
    button{
      margin-top: 30px;
    }
  }

}
</style>
