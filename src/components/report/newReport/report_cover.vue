
<template>
    <div class="reportOneText">
        <div class="report-text">
            <img :src="property.img" class="property-logo" alt="">
            <h1>{{titleName}}<span v-if="reportType === 'week'">{{headerDate.time}}</span></h1>
            <h3>{{property.text}}</h3>
            <h4>{{titleText}}</h4>
            <div class="suggest-content" v-if="isText">
                <p>报告建议</p>
                <textarea disabled  class="suggest-text" v-model="textareaText" ></textarea>
            </div>
        </div>
        <div class="footer">
            <img :src="logo" alt="">
            <div class="footer-right">
                {{coverNewDate}} <span>共{{pageTotal}}页</span>
            </div>
        </div>
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
    },
    pageTotal: {
      type: String
    },
    suggestText: {
      type: String
    },
    titleName: {
      type: String
    }

  },
  name: 'report-cover',
  data () {
    return {
      logo: require('@/assets/images/fixation_img/logo/cologo2.webp'),
      coverNewDate: moment(new Date()).format('YYYY.MM.DD'),
      textareaText: ''
    }
  },
  computed: {
    isText () {
      if (this.suggestText === '') {
        return false
      } else {
        return true
      }
    },
    property () {
      return this.$store.state.home.headerData
    },
    headerDate () {
      return this.$store.state.report.reportHeader
    },
    titleText () {
      if (this.reportType === 'week') {
        return this.headerDate.year + '年第' + this.headerDate.period + '周数据统计'
      } else if (this.reportType === 'daily') {
        return this.headerDate.year + '.' + this.headerDate.time + '数据统计'
      } else if (this.reportType === 'monthly') {
        return this.headerDate.year + '年' + this.headerDate.time + '月数据统计'
      }
    }
  },
  methods: {

  },
  watch: {
    suggestText () {
      this.textareaText = this.suggestText
    }
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
        background: url('../../../assets/images/fixation_img/bg/image_cover_background.png') no-repeat;
        background-size: 100% 100%;
        .report-text{
            width: 100%;
            height: 100%;
            padding: 86px 80px ;
            position: relative;
        }
        .property-logo{
            width: 346px;
            height: auto;
            display: block;
        }
        h1{
            font-size: 76px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 104px;
            color: #ffffff;
            span{
              margin-left: 20px;
              font-size: 32px;
            }
        }
        h3{
            margin-top: 140px;
            font-weight: bold;
            letter-spacing: 2px;
            font-size: 120px;
            color: #ffffff;

        }
        h4{
            margin-top: 40px;
            font-size: 88px;
            letter-spacing: 2px;
            font-weight: bold;
            color: #ffffff;

        }
        .suggest-content{
            width: 100%;
            height: auto;
            padding: 32px 34px;
            background: #1361a8;
            opacity: 0.6;
            margin-top: 30px;
            position: relative;
            p{
                font-size: 40px;
                color: #fff;
            }
            .suggest-text{
                display: inline-block;
                width: 975px;
                height: 445px;
                font-size: 32px;
                resize: none;
                color: #fff;
                margin-top: 24px;
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
        .footer{
            position: absolute;
            left: 0;
            bottom: 86px;
            padding: 0 80px;
            width: 100%;
            img{
                display: block;
                width: 346px;
                height: auto;
                float: left;
            }
            .footer-right{
                width: auto;
                float:right;
                border-bottom:18px solid #35e9df;
                font-size: 36px;
                color: #ffffff;
                padding-bottom: 22px;
                span{
                    display: inline-block;
                    margin-left: 20px;
                }
            }
        }
    }

</style>
