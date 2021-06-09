
<template>
    <div class="reportOneText">
        <div class="report-text">
            <h2>凌图科技（西安）有限公司</h2>
            <p>网址：www.linkdome.cn </p>
            <p>邮箱：support@linkdome.cn</p>
            <p>邮箱：4006699330</p>
            <p style="width:100%;text-align: center;">地址：陕西省西安市雁塔区旺座曲江A座23层</p>
            <span>报告日期: {{reportDate}}</span>
            <span>生成日期: {{newDate}}</span>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {

  },
  name: 'report-back_cover',
  data () {
    return {
      newDate: moment(new Date()).format('YYYY.MM.DD')
    }
  },
  computed: {
    reportDate () {
      return this.$store.state.report.reportHeader.reportDate
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
    .reportOneText{
        display: inline-block;
        width: 1200px;
        height: 1682px;
        overflow: hidden;
        position: relative;
        background: url('../../../assets/images/fixation_img/bg/image_back_cover_background.png') no-repeat;
        background-size: 100% 100%;
        .report-text{
            width: 100%;
            height: auto;
            position: absolute;
            left: 0;
            bottom: 110px;
            padding: 0 82px;
            h2{
                font-size: 36px;
                color: #fff;
                width: 100%;
                height: auto;
                text-align: center;
            }
            p{
                font-size: 26px;
                color: #fff;
                width: 350px;
                height: auto;
                margin-top: 48px;
                margin: 48px auto 0 auto;
            }
            span{
                font-size: 36px;
                color: #fff;
                font-weight: bold;
                float: left;
                margin-top:150px;
                border-bottom: 10px solid #fff;
                padding-bottom: 10px;
                &:last-child{
                    float: right;
                    border-bottom: 18px solid #35E9DF;
                }
            }
        }
        .property-bg{
            width: 100%;
            height: 100%;
            display: block;
        }
    }

</style>
