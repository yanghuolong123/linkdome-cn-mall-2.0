
<template>
    <div class="reportOneText">
        <div class="report-floor-date">
            <p class="floor-date-left">
                报告日期: {{coverDateTime}}
            </p>
            <p class="floor-date-right">
                生成日期: {{coverNewDate}}
            </p>
        </div>
        <div class="report-floor-title">
            <h1>用AI表达世界，用数字改变生活</h1>
        </div>
        <img class="center-img" :src="BgUrl" alt="">
        <div class="report-floor-bottom-text">
            <img class="floor-logo" :src="logo" alt="">
            <p class="floor-name">凌图科技有限公司</p>
            <div class="floor-text-left">
                <p>网站: www.linkdome.cn</p>
                <p>邮箱: support@linkdome.cn</p>
                <p>电话: +86-029-89553939</p>
                <p>地址: 陕西省西安市雁塔区旺座曲江A座23层</p>
            </div>
            <!-- <div class="floor-text-right">
                <div class="qr-code-left">
                    <img :src="siteImg" alt="">
                    <p>官方网站</p>
                </div>
                <div class="qr-code-right">
                    <img :src="publicImg" alt="">
                    <p>微信公众号</p>
                </div>
            </div> -->
            <div style="clear: both"></div>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'report-day-list-cover',
  data () {
    return {
      logo: require('@/assets/images/fixation_img/logo/logo.webp'),
      BgUrl: require('@/assets/images/fixation_img/bg/image_backcover_mape.jpg'),
      publicImg: require('@/assets/images/fixation_img/bg/image_backcover_right.webp'),
      siteImg: require('@/assets/images/fixation_img/bg/image_backcover_left.webp'),
      coverNewDate: moment(new Date()).format('YYYY-MM-DD HH:mm')
    }
  },
  computed: {
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
        padding: 100px 50px;
        .report-floor-date{
            width: 100%;
            height: auto;
            overflow: hidden;
            p{
                font-size: 18px;
                color: #a1a7ad;
            }
            .floor-date-left{
                float: left;
            }
            .floor-date-right{
                float: right;
            }
        }
        .report-floor-title{
            width: 100%;
            height: auto;
            text-align: center;
            color: #a0a7ad;
            margin-top: 200px;
            h1{
                font-size: 36px;
                font-weight: normal;
                letter-spacing: 5px;
            }
            p{
                font-size: 16px;
                margin-top: 40px;
            }
        }
        .center-img{
            display: block;
            width: 800px;
            height: auto;
            margin:100px auto;

        }
        .report-floor-bottom-text{
            width: 900px;
            height: auto;
            margin: 0 auto;
            .floor-logo{
                display: block;
                height: 110px;
                width: auto;
            }
            .floor-name{
                margin-top: 30px;
                font-size: 24px;
                color: #8e9194;
                letter-spacing: 3px;
            }
            .floor-text-left{
                float: left;
                width: auto;
                p{
                    font-size: 18px;
                    color: #9c9c9c;
                    margin-top: 35px;
                }
            }
            .floor-text-right{
                width: 400px;
                float: right;
                overflow: hidden;
                .qr-code-left,.qr-code-right{
                    display: inline-block;
                    width: 185px;
                    margin-top: 12px;
                    img{
                        display: block;
                        width: 100%;
                        height: auto;
                    }
                    p{
                        font-size: 16px;
                        color: #787878;
                        text-align: center;
                        margin-top: 25px;
                    }
                }
                .qr-code-left{
                    float: left;
                }
                .qr-code-right{
                    float: right;
                }

            }
        }
    }

</style>
