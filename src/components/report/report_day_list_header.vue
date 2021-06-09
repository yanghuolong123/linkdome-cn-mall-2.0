
<template>
    <div class="report-header">
        <img class="report-header-left-img" :src="companyLogo" alt="">
        <!-- <div class="report-header-name">{{companyName}}</div> -->
        <div class="report-header-line"></div>
        <div class="report-header-date">
            <p>{{headerYear}}</p>
            <span>{{headerDateTime}}</span>
        </div>
        <img class="report-header-right-img" :src="logo" alt="">
    </div>
</template>
<script>

export default {
  name: 'report-day-one',
  props: {

  },
  data () {
    return {
      logo: require('@/assets/images/fixation_img/logo/logo.webp')
    }
  },
  watch: {

  },
  computed: {
    companyLogo () {
      return this.$store.state.home.headerData.img
    },
    companyName () {
      return this.$store.state.report.companyName
    },
    headerYear () {
      return this.$store.state.report.reportYear
    },
    headerDateTime () {
      return this.$store.state.report.companyDateTime
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
        height: 108px;
        border-bottom: 4px solid #3699ff;
        padding-bottom: 20px;
        position: relative;
        .report-header-left-img{
            width: auto;
            height: 54px;
            float: left;
            margin-top: 18px;
        }
        .report-header-name{
            display: inline-block;
            float: left;
            font-size: 24px;
            color: #585858;
            margin: 23px 0px 23px 20px;
        }
        .report-header-line{
            float: left;
            width: 2px;
            height: 75px;
            background-color: #99abb4;
            margin: 0 15px;

        }
        .report-header-date{
            float: left;
            p{
                font-size: 33px;
                color: #3b3b3b;
            }
            span{
                font-size: 22px;
                color: #888888;
            }
        }
        .report-header-right-img{
           position: absolute;
            right: 0;
            top:0;
            display: block;
            width: auto;
            height: 86px;

        }
    }

</style>
