
<template>
    <div class="reportOneText">
        <img class="oneImg" :src="BgUrl">
        <div class="one-text-left">
            <div class="one-left-title">
                <p>{{headerYear}}</p>
                <div class="line"></div>
                <span>{{reportType}}</span>
            </div>
            <div class="one-left-text">
                <div class="one-left-N">{{companyName}}</div>
                <div class="one-left-A">客流分析报告</div>
                <div class="one-left-T">报告时间: {{coverDateTime}}</div>
                <div class="one-left-D">生成日期: {{coverNewDate}}</div>
            </div>
        </div>
        <div class="one-text-right">
            <img :src="logoImg" alt="">
            <p>{{companyName}}</p>
        </div>
        <!-- <img class="one-logo" :src="logo" alt=""> -->
        <div class="page_number">{{pageNumber}}</div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    pageNumber: {
      type: String,
      default: ''
    },
    reportType: {
      type: String,
      default: ''
    }

  },
  name: 'report-day-list-cover',
  data () {
    return {
      BgUrl: require('@/assets/images/fixation_img/bg/image_cover_background.webp'),
      logo: require('@/assets/images/fixation_img/logo/logo.webp'),
      coverNewDate: moment(new Date()).format('YYYY-MM-DD HH:mm')
    }
  },
  computed: {
    companyName () {
      return this.$store.state.home.headerData.text
    },
    logoImg () {
      return this.$store.state.home.headerData.img
    },
    headerYear () {
      return this.$store.state.report.reportYear
    },
    coverDateTime () {
      return this.$store.state.report.coverDateTime
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
        background-color: #fff;
        position: relative;
        padding: 0 50px;
        .oneImg{
            width: 100%;
            height: auto;
            display: block;
            margin-top: 216px;
        }
        .one-text-left{
            width: 550px;
            height: auto;
            position: absolute;
            left: 50px;
            bottom: 20%;
            padding-left: 10px;
            .one-left-title{
                overflow: hidden;
                p{
                    font-size: 41px;
                    color: #1190d5;
                    font-weight: bold;
                    display: inline-block;
                    float: left;
                    padding: 0 10px;
                    letter-spacing: 5px;
                }
                .line{
                   width: 1px;
                    height: 32px;
                    float: left;
                    background-color: #1190d5;
                    margin: 12px 5px 0 5px;
                }
                span{
                    float: left;
                    color: #1190d5;
                    font-size: 14px;
                    margin-top: 28px;
                    margin-left: 5px;
                }
            }
            .one-left-text{
                margin-top: 60px;
                .one-left-N{
                    font-size: 32px;
                    letter-spacing: 5px;
                    color: #1190d5;
                }
                .one-left-A{
                    font-size: 30px;
                    color: #4babe9;
                    letter-spacing: 5px;
                    margin-top: 30px;
                }
                .one-left-E{
                    font-size: 22px;
                    color: #949ca3;
                    letter-spacing: 2px;
                    margin-top: 30px;
                }
                .one-left-T,.one-left-D{
                    font-size: 20px;
                    color: #747e88;
                    letter-spacing: 2px;
                    margin-top: 30px;
                }

            }
        }
        .one-text-right{
            width: 550px;
            height: auto;
            position: absolute;
            right: 50px;
            top:47%;
            img{
                display: block;
                width: 280px;
                height:auto;
                margin: 0 auto 30px auto;
            }
            p{
                font-size: 32px;
                color: #4d4d4d;
                letter-spacing: 5px;
                text-align: center;
            }
        }
        .one-logo{
            position: absolute;
            right: 180px;
            bottom:14%;
            height: 86px;

        }
        .page_number{
            position: absolute;
            right: 75px;
            bottom:250px;
            font-size: 20px;
            color: #fff;
        }
    }

</style>
