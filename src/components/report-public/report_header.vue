
<template>
    <div class="report-header">
        <img class="header-logo" :src="logo" alt="">
        <div class="header-right">
            <p class="text">{{headerData}}</p>
            <div><p>{{year}}</p> <span></span></div>
        </div>
    </div>
</template>
<script>

export default {
  name: 'report-header',
  props: {

  },
  data () {
    return {
    }
  },
  watch: {

  },
  computed: {
    logo () {
      return this.$store.state.home.headerData.img
    },
    year () {
      return this.$store.state.report.reportHeader.year
    },
    headerData () {
      let header = this.$store.state.report.reportHeader
      if (header.type === 'week') {
        return header.year + '年第' + header.period + '周\xa0\xa0' + header.time
      } else if (header.type === 'daily') {
        return header.year + '.' + header.time + ' ' + header.week
      } else {
        return header.year + '年' + header.time + '月'
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
    .report-header {
        width: 100%;
        padding: 76px 80px 0 80px;
        height: 184px;
        .header-logo{
            display: block;
            width: 318px;
            height: 100%;
            float: left;
        }
        .header-right{
            float: right;
            .text{
               font-size: 24px;
               color: #3b3b3b;
               height: 100%;
               line-height: 108px;
               float: left;
            }
            div{
                float: left;
                margin-left: 30px;
                position: relative;
                width: 100px;
                height: 108px;
                z-index: 1;
                line-height: 108px;
                p{
                    width: 100%;
                    text-align: center;
                    height: 108px;
                    line-height: 93px;
                    font-size: 36px;
                    color: #2081d4;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                span{
                    display: inline-block;
                    width:100px;
                    height: 12px;
                    background-color: #35e9df;
                    position: absolute;
                    right: 0;
                    bottom: 43px;
                }
            }
        }
    }

</style>
