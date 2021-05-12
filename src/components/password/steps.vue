<template>
  <Header>
    <div class="orderco">
      <template v-for="(item,index) in list">
        <div :key="index">
          <span :class="{actived:index < current}">{{index + 1}}</span>
          <p>{{item.title}}</p>
        </div>
        <span :key="`line_${index}`" v-if="index < list.length - 1"></span>
      </template>
    </div>
  </Header>
</template>

<script>
export default {
  name: 'steps',
  props: {
    current: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      list: [
        {
          title: '填写邮箱'
        },
        {
          title: '重置密码'
        },
        {
          title: '完成'
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scope>
  .ivu-layout-content
    height calc(100vh - 64px)
    background-color #fff
    .ivu-layout-header
        background-color #f5f5f5
        display flex
        justify-content center
        padding 10px
        .orderco
            display flex
            justify-content space-between
            flex-basis 500px
            >div
                text-align center
                position relative
                >span
                    width 24px
                    height 24px
                    line-height 24px
                    color #ffffff
                    display inline-block
                    border-radius 50%
                    background-color #dadada
                    margin-bottom 2px
            .actived
                background-color #4096e5
            >span
                display inline-flex
                height 2px
                background-color #4096e5
                width 30%
                margin-top 12px
</style>
