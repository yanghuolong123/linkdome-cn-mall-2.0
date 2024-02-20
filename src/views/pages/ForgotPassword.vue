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
        <FormItem prop="UserMailAddress" class="forgot-label" :label="$t('mail')">
          <Input
            v-model="formData.UserMailAddress"
            size="large"
            autofocus
            :placeholder="$t('fn.inputHolder', [$t('mail')])"
            type="email"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" size='large' @click="handleSubmit" :loading="loading">
            <span v-if="!loading">{{$t('submit')}}</span>
            <span v-else>{{$t('sending')}}</span>
          </Button>
        </FormItem>
      </Form>
    </Content>
  </Layout>
</div>

</template>
<script>
import headerBar from '_c/password/headerbar.vue'
import steps from '_c/password/steps.vue'
import { userCheck } from '@/api/user'
export default {
  name: 'forgotPassword',
  components: {
    headerBar,
    steps,
  },
  data () {
    return {
      formData: {
        UserMailAddress: ''
      },
      ruleValidate: {
        UserMailAddress: [
          { required: true, message: this.$t('fn.cantBeEmpty',[this.$t('mail')]), trigger: 'blur' },
          { type: 'email', message: this.$t('IncorrectEmail'), trigger: 'blur' }
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
              this.$message.warning(this.$t('noUser'))
            } else {
              this.$message.success(this.$t('fn.successTo',[this.$t('send')]))
            }
          }).catch(err => {
            if (err.response.status === 500) this.$message.error(this.$t('error.serverError'))
            this.loading = false
          })
        } else {

        }
      })
    },
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
