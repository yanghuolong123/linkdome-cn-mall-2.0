
<template>
    <div class="report-remark">
        <p><img :src="img" alt=""> 凌图智慧点评</p>
        <ul>
            <li :key="index" v-for="(item,index) in dataList">{{item}}</li>
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
        padding: 10px 28px;
        background-color: #1361a8;
        opacity: 0.6;
        margin: 0 80px;
        max-height:385px;
        overflow: hidden;
        p{
            font-size: 40px;
            color: #fff;
            img{
                display: inline-block;
                width: 28px;
            }
        }
        ul{
            width: 100%;
            height: auto;
            margin-top: 15px;
            padding-left: 35px;
            li{
                width: 100%;
                height: auto;
                font-size: 26px;
                color: #fff;
                list-style-type:disc;
            }
        }
    }

</style>
