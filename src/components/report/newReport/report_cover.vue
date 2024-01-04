<template>
    <div class="reportOneText" style="width: 1200px;height: 1682px;">
        <div class="report-text" style="padding: 86px 80px;">
            <img :src="property.img" class="property-logo" style=" width: 276px;" alt="">
            <h1 style="margin-top: 104px;font-size: 76px;letter-spacing: 2px;">
                {{titleName}}
            </h1>
            <span style="font-size: 32px;" v-if="reportType === 'week'">
                {{weekTime}}
              </span>
            <h3 style=" margin-top: 140px;
            letter-spacing: 2px;
            font-size: 120px;">{{property.text}}</h3>
            <h4 style=" margin-top: 40px;font-size: 88px; letter-spacing: 1px;white-space: pre">{{titleText}}</h4>
            <!--			<div class="suggest-content" style=" padding: 32px 34px;margin-top: 30px;" v-if="suggestText">-->
            <!--				<p style="font-size: 40px;">报告建议</p>-->
            <!--				<textarea disabled class="suggest-text" style=" width: 975px;-->
            <!--                height: 445px;-->
            <!--                font-size: 32px;-->
            <!--                margin-top: 24px;" v-model="textareaText"></textarea>-->
            <!--			</div>-->
        </div>
        <div class="footer" style="  bottom: 86px;
            padding: 0 80px;">
            <img style="width: 276px;" :src="logo" alt="">
            <div class="footer-right" style=" border-bottom:12px solid #35e9df;
                font-size: 36px;
                color: #ffffff;
                padding-bottom: 7px;">
                <span v-if="language==='en-US'" style=" margin-left: 20px;">Total {{pageTotal}}</span>
                <span v-else style=" margin-left: 20px;">共{{pageTotal}}页</span>
            </div>
        </div>
    </div>
</template>
<script>
  import moment from 'moment'
  import { mapState } from 'vuex'

  export default {
    props: {
      pageNumber: {
        type: String,
        default: ''
      },
      pageTotal: {
        type: String
      },
      suggestText: {
        type: String,
        defaul: ''
      },
      titleName: {
        type: String
      }

    },
    name: 'report-cover',
    data () {
      return {
        logo: require('@/assets/images/fixation_img/logo/white-logo.png'),
        coverNewDate: moment(new Date()).format('YYYY.MM.DD'),
        textareaText: '',
        weekTime: '',
      }
    },
    activated () {
    },
    computed: {
      isText () {
        if (this.suggestText === '' || this.suggestText === null) {
          return false
        } else {
          return true
        }
      },
      ...mapState({
        reportType: (state) => state.report.reportHeaderType,
        property: (state) => state.home.headerData,
        language: (state) => state.language,//en-US
      }),
      titleText () {
        let headerDate
        switch (this.reportType) {
          case 'day':
            headerDate = this.$store.state.report.dayReportHeader
            const month = Number(headerDate.time.split('.')[0]) + '月'
            const date = headerDate.time.split('.')[1]
            return this.language === 'en-US' ? `Data statistics on\n${this.$t(month)} ${date},${headerDate.year}` : headerDate.year + '.' + headerDate.time + this.$t('report.数据统计')
          case 'week':
            headerDate = this.$store.state.report.weekReportHeader
            this.weekTime = headerDate.time
            return this.language === 'en-US' ? `Data statistics for\n${headerDate.period}th week of ${headerDate.year}` : (headerDate.year + '年第' + headerDate.period + '周数据统计')
          case 'month':
            headerDate = this.$store.state.report.monthReportHeader
            return this.language === 'en-US' ? `Data statistics for\n${this.$t(headerDate.time + '月')} ${headerDate.year}` : headerDate.year + '年' + headerDate.time + '月数据统计'
          case 'customize':
            headerDate = this.$store.state.report.customizeReportHeader
            return this.language === 'en-US' ? `Data statistics for\n${headerDate.time}` : headerDate.time + this.$t('report.数据统计')
        }
      }
    },
    watch: {
      suggestText () {
        this.textareaText = this.suggestText
      },
    },
  }
</script>
<style scoped lang="less">
    .reportOneText {
        display: inline-block;
        overflow: hidden;
        position: relative;
        background: url('../../../assets/images/fixation_img/bg/image_cover_background.png') no-repeat;
        background-size: 100% 100%;

        .report-text {
            width: 100%;
            height: 100%;
            position: relative;
            font-weight: bold;
            color: #ffffff;
        }

        .property-logo {
            height: auto;
            display: block;
        }

        h1, h3, h4 {
            font-weight: bold;
            color: #ffffff;
        }

        .suggest-content {
            width: 100%;
            height: auto;
            background: #1361a8;
            opacity: 0.6;
            position: relative;

            p {
                color: #fff;
            }

            .suggest-text {
                display: inline-block;
                resize: none;
                color: #fff;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 9;
                background-color: rgba(255, 255, 255, 0);
                overflow: hidden;
                border: none;
            }
        }

        .footer {
            position: absolute;
            left: 0;

            width: 100%;

            img {
                display: block;

                height: auto;
                float: left;
            }

            .footer-right {
                width: auto;
                float: right;

                span {
                    display: inline-block;
                }
            }
        }
    }

</style>
