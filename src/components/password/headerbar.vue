<template>
  <Header>
    <Row>
      <i-col :sm="6" :xs="0">&nbsp;</i-col>
      <i-col :sm="12" :xs="24" id="headCon">
        <div id="logo">
          <img :src="logosrc" alt>
          <span>找回密码</span>
        </div>
        <router-link to="/login">登录</router-link>
      </i-col>
      <i-col :sm="6" :xs="0">&nbsp;</i-col>
    </Row>
  </Header>
</template>

<script>
export default {
  name: 'forgetHeader',
  data () {
    return {
      logosrc: require('@/assets/images/fixation_img/logo/cologo2.webp')
    }
  }
}
</script>

<style lang="stylus" scope>
.forgotpasswordbox
  overflow hidden
  .ivu-layout-header
    background-color #4096e5
    height auto
    line-height normal
    #headCon
      display flex
      justify-content space-between
      flex-wrap wrap
      line-height 62px
      font-size 14px
      &,a
        color #ffffff
      #logo
        img
          height 40px
          vertical-align -12px
        span
          border-left 2px solid #ffffff
          line-height 1
          margin-left 1.5vw
          padding-left 10px
</style>
