
<template>
    <div class="report-remark" style=" padding: 10px 28px;
        margin: 0 80px;
        max-height:420px;">
        <p style=" font-size: 40px;"><img style=" width: 28px;" :src="img" alt=""> 凌图智慧点评</p>
        <ul style="  margin-top: 15px;
            padding-left: 35px;">
            <li :style="liStyle" :key="index" v-for="(item,index) in dataList">{{item}}</li>
        </ul>
    </div>
</template>
<script>

export default {
  name: 'report-remark',
  props: {
    dataList: {
      typr: Array
    }
  },
  data () {
    return {
      img: require('@/assets/images/fixation_img/rest/varied.png')

    }
  },
  watch: {

  },
  computed: {
      liStyle(){
        const len = this.dataList.length;
        if(len<5){
            return {fontSize:'26px'}
        }else {
            return {fontSize:'24px'}
        }
      }
  },
  methods: {

  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
    .report-remark {
        display: block;
        background-color: #1361a8;
        opacity: 0.6;
        overflow: hidden;
        p{
            color: #fff;
            img{
                display: inline-block;
            }
        }
        ul{
            width: 100%;
            height: auto;
            li{
                width: 100%;
                height: auto;
                color: #fff;
                list-style-type:disc;
            }
        }
    }

</style>
