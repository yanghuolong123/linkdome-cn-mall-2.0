<template>
    <div class="custom-legend-box">
        <ul class="text-black" v-if="data.length">
            <li v-for="(item,index) in data" :key="index" :style="data.length==2?'margin-bottom:36px':''">
                <p class="flex justify-between">
                    <span class="flex items-center">
                        <icons :size="20" :type="item.icon" :color="item.color"></icons>
                        <span class="font-medium ml-2">{{item.title}}</span>
                    </span>
                    <span style="margin-left:30px;line-height:30px;" class="text-grey-darker">{{Number(item.value).toLocaleString()}}{{unit}} </span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'customLegend',
    props: {
      unit:{
        type:String
      },
      data: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
<style lang="less" scoped>
  .custom-legend-box{
    width: 100%;
    text-align: center;
    ul{
      display: inline-block;
      width: auto;
      height: auto;
      li{
        margin-bottom: 10px;
        span{
          font-size: 1rem;
        }
      }
    }
  }
</style>
