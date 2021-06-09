
<template>
    <div>
      <div v-if="isSuggestText" class="report-suggest">
        <h2> <img class="icon" :src="suggestIcon" alt=""> <span>报告建议</span> </h2>
        <textarea  v-model="suggestContent"></textarea>
        <div class="suggest-button">
            <button v-on:click="suggestSubmit">确定</button>
            <button v-on:click="suggestReset">清空</button>
        </div>
        <img :src="suggestStore" class="store" v-on:click='suggestHide' alt="">
      </div>
      <div class="suggest-img" v-else>
        <img  :src="suggestUnfold"  v-on:click='suggestShow'  alt="">
      </div>

    </div>
</template>
<script>
import { newReportSuggestPost } from '@/api/report'
export default {
  name: 'report-suggest',
  props: {
    suggestText: {
      type: String,
      default: ''
    },
    propertyId: {
      type: Number
    },
    date: {
      type: String
    }
  },
  data () {
    return {
      suggestIcon: require('@/assets/images/fixation_img/rest/varied.png'),
      suggestUnfold: require('@/assets/images/fixation_img/rest/suggest-unfold.png'),
      suggestStore: require('@/assets/images/fixation_img/rest/suggest-store.png'),
      suggestContent: '',
      isSuggestText: true
    }
  },
  watch: {
    suggestText () {
      this.suggestContent = this.suggestText
    },
    suggestContent () {

    }
  },
  computed: {
  },
  created () {

  },
  mounted () {
    this.suggestContent = this.suggestText
  },
  methods: {
    suggestSubmit () {
      newReportSuggestPost({ property_id: this.propertyId, date: this.date, property_suggest: this.suggestContent }).then(res => {
        alert('编辑成功')
        this.$emit('suggestSubmit', this.suggestContent)
      })
    },
    suggestReset () {
      this.suggestText = ''
    },
    suggestHide () {
      this.isSuggestText = false
    },
    suggestShow () {
      this.isSuggestText = true
    }
  }

}
</script>
<style scoped lang="less">
.suggest-img{
  position: fixed;
  right: 50px;
  top: 260px;
  width: 80px;
  height: auto;
  padding: 19px;
  background-color: #fff;
  z-index: 99;
  box-shadow: 0px 5px 13px 10px rgba(215,220,223,0.5);
  img{
    display: block;
    width: 100%;
    height: auto;
    opacity: 0.9;
    cursor: pointer;
    &:hover{
      opacity: 1;
    }
  }
}
  .report-suggest{
      position: fixed;
      right: 50px;
      top: 100px;
      width: 316px;
      height: auto;
      background-color: #fff;
      padding: 9px;
      z-index: 99;
      box-shadow: 0px 2px 8px 8px rgba(215,220,223,0.5);

      h2{
        width: 100%;
        height: 56px;
        line-height: 56px;
        background-color: #1361A8;
        color: #fff;
        font-size: 20px;
        padding-left: 34px;
        .icon{
          display: inline-block;
          width: 14px;
          height: auto;
          margin-right: 8px;
        }
      }
      textarea{
        display: block;
        resize: none;
        width: 100%;
        height:332px;
        background-color: #1361A8;
        opacity: 0.61;
        color: #fff;
        font-size: 16px;
        padding: 30px;
      }
      .suggest-button{
        display: block;
        width: 100%;
        height: 40px;
        margin-top: 10px;
        button{
          width: 80px;
          height: 29px;
          line-height: 29px;
          text-align: center;
          color: #186CB8;
          font-size: 16px;
          border-radius: 4px;
          box-shadow: 0px 4px 5px 5px rgba(51,131,202,0.55);
          border: none;
          background-color: #fff;
          float: left;
          cursor: pointer;
          &:hover{
            color: #fff;
            background-color:#186CB8 ;
          }
          &:nth-child(2){
            float: right;
            background-color: #D4E7F8;
            color: #3B8CD6;
            box-shadow:none;
            &:hover{
              color: #fff;
              background-color:#81b2df ;
            }
          }
        }
      }
      .store{
        display: block;
        width: 26px;
        height: auto;
        margin: 0px auto 13px auto;
        cursor: pointer;
        opacity: 0.9;
        &:hover{
          opacity: 1;
        }
      }
    }
</style>
