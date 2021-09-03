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
        <FormItem prop="newPassword" :label="$t('密码')">
          <Input
            v-model="formData.newPassword"
            size="large"
            autofocus
            :placeholder="$t('请输入修改的密码')"
            type="password"
          />
        </FormItem>
        <FormItem prop="aginPassword" :label="$t('请确认修改后的密码')" style="margin-top:20px;">
          <Input
            v-model="formData.aginPassword"
            size="large"
            autofocus
            :placeholder="$t('请再次输入修改的密码')"
            type="password"
          />
        </FormItem>
        <FormItem>
          <Row type="flex" justify="space-between" class="footButton">
            <i-col :sm="8" :xs="24">
              <Button type="primary" size="large" class="commitButton" @click="handleSubmit" :loading="loading">
                <span v-if="!loading">{{$t('提交')}}</span>
                <span v-else>{{$t('发送中')}}</span>
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
          <p>{{$t('密码修改成功')}}</p>
          <p>{{$t('密码已找回')}}</p>
          <Button type="primary" size="large" @click="backLogin">{{$t('返回登录页')}}</Button>
        </div>
      </template>
    </Content>
  </Layout>
</div>

</template>
<script>
import headerBar from '_c/password/headerbar.vue'
import steps from '_c/password/steps.vue'
import { resetPassword } from '@/api/user'
import { getParams } from '@/libs/util'
import md5 from 'md5'
export default {
  name: 'forgotPassword',
  components: {
    headerBar,
    steps,
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('密码不能为空')))
      } else if (value.length < 6) {
        callback(new Error(this.$t('密码长度不得小于6个字符')))
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
        callback(new Error(this.$t('请再次输入修改的密码')))
      } else if (value !== this.formData.newPassword) {
        callback(new Error(this.$t('两次密码不一致!')))
      } else {
        callback()
      }
    }
    return {
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
              this.$message.warning(this.$t('没有此用户'))
            } else {
              this.$message.error(this.$t('修改失败'))
            }
          }).catch(err => {
            this.loading = false
            if (!err.response)this.$message.error(this.$t('error.timeout'))
            else if (err.response.status === 500)this.$message.error(this.$t('error.serverError'))
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
