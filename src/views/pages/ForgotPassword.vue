<template>
<div>
    <Layout class="forgotpasswordbox">
      <header-Bar></header-Bar>
    <Content class="content">
      <steps :current="1"></steps>
      <Form
        ref="formValidate"
        :model="formData"
        :rules="ruleValidate"
        id="formCobox"
        @keydown.enter.native="handleSubmit"
        @submit.native.prevent
      >
        <FormItem prop="UserMailAddress" class="forgot-label" label="邮箱">
          <Input
            v-model="formData.UserMailAddress"
            size="large"
            autofocus
            placeholder="请输入注册时的邮箱"
            type="email"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" size='large' @click="handleSubmit" :loading="loading">
            <span v-if="!loading">提交</span>
            <span v-else>发送中...</span>
          </Button>
        </FormItem>
      </Form>
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
import { userCheck } from '@/api/user'
export default {
  name: 'forgotPassword',
  components: {
    headerBar,
    steps,
    alert
  },
  data () {
    return {
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      formData: {
        UserMailAddress: ''
      },
      ruleValidate: {
        UserMailAddress: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '不正确的邮箱地址', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleSubmit () {
      var that = this
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          // 调用api
          this.loading = true
          userCheck({ email: this.formData.UserMailAddress }).then(res => {
            this.loading = false
            if (res.data.code === 304) {
              // alert('没有此用户')
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '忘记密码'
              that.alertText.text = '没有此用户'
              that.alertText.confirm = false
            } else {
              // setTimeout(() => {
              //   alert('发送成功')
              // }, 100)
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '忘记密码'
              that.alertText.text = '发送成功'
              that.alertText.confirm = true
            }
            // this.$router.push('/resetPassword')
          }).catch(err => {
            if (err.response.status === 500) alert('服务器错误，请稍后重试')
            this.loading = false
          })
        } else {

        }
      })
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
#formCobox{
	width: 500px;
	height: auto;
	margin: 30px auto;
	.ivu-input-wrapper{
		width: 100%;
	}
	.ivu-form-item{
		margin-bottom: 0;
	}
	.ivu-form-item-label{
		font-size:12px;
		font-family:SourceHanSansCN-Regular;
		font-weight:400;
		color:rgba(56,57,58,1);
	}
	.ivu-input{
		margin-top: 10px;
		font-size: 12px;
		border:1px solid rgba(185,187,189,1);
		border-radius:2px;
    height: 38px;
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
	}
	.ivu-btn-primary{
		margin-top: 30px;
		width:90px;
		height:30px;
		background:rgba(64,150,229,1);
		box-shadow:0px 4px 12px 0px rgba(64,150,229,0.38);
		border-radius:2px;
		padding: 0;
		span{
			display: inline-block;
			font-size:12px;
			font-family:SourceHanSansCN-Regular;
			font-weight:400;
			color:rgba(255,255,255,1);
		}
	}
}
</style>
