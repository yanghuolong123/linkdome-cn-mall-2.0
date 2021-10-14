<template>
    <div class="pathTab">
      <div class="circle">
          <icons type="zoulu" :size="40" color="#857AEF" style="cursor:pointer" v-if="!parking"></icons>
          <p class="parking" v-if="parking">P</p>
      </div>
      <div class="right">
        <p class="title">{{ $t(title) }}</p>
        <p class="number" :style="{right:right}">{{numbers}}</p>
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
  }
.right{
  padding-left 5rem
  margin-top 20px
}
  .circle{
    width: 3.125rem;
    height: 3.125rem;
    border-radius: 50%;
    background-color: #eae8fd;
    margin-top 20px
    float left
    .parking{
        font-size: 28px;
        left: 16px;
        top: 5px;
        color:#857AEF;
        font-weight: 800;
    }
    .iconfont{
      position: relative;
      left: 3px;
      top: -4px;
    }
  }
}
</style>
