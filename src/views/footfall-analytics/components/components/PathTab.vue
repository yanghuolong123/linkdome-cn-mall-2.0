<template>
    <div class="pathTab flex-center">
      <div class="circle">
          <icons type="zoulu"  color="#857AEF" style="cursor:pointer" v-if="!parking"></icons>
          <p class="parking" v-if="parking">P</p>
      </div>
      <div class="right flex-column">
        <p class="title">{{ $t(title) }}</p>
        <p class="number">{{numbers}}</p>
      </div>

    </div>
</template>

<script>
export default {
  name: 'pathTab',
  props: {
    title: {
      type: String,
      default: ' 0 '
    },
    numbers: {
      type: Number,
      default: 0
    },
    right: {
      type: String,
      default: '24%'
    },
    parking: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  watch: {
  }
}
</script>
<style lang="stylus" scoped>
.pathTab{
  height:140px;
  position relative
  background-color:#fff;
  border-radius:.5rem;
  padding 2rem
  .title{
    color:#2B2A2A;
    font-size:1rem;
    font-weight:bold;
    top: 44px;
  }
  .number{
    color:#3E3C3C;
    font-size:1rem;
      margin-top:10px;
  }
.right{
  padding-left 30px
}
  .circle{
    width: 50px
    height:50px;
      line-height 50px
    border-radius: 50%;
    background-color: #eae8fd;
      text-align:center;
      flex:none;
    .parking{
        font-size: 28px;
        color:#857AEF;
        font-weight: 800;
    }
     /deep/ .iconzoulu{
          font-size 40px!important
      }
  }
}
</style>
