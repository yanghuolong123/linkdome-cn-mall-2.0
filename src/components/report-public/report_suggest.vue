
<template>
    <div>
      <div v-if="isSuggestText" class="report-suggest" style=" right: 50px;
      top: 100px;
      width: 316px;
          padding: 9px;
      z-index: 99;
      box-shadow: 0px 2px 8px 8px rgba(215,220,223,0.5);">
        <h2 style=" height: 56px;
        line-height: 56px;
          font-size: 20px;
        padding-left: 34px;"> <img class="icon" style="   width: 14px;
          margin-right: 8px;" :src="suggestIcon" alt=""> <span>报告建议</span> </h2>
        <textarea style="  height:332px;
        font-size: 16px;
        padding: 30px;"  v-model="suggestContent"></textarea>
        <div class="suggest-button" style="   height: 40px;
        margin-top: 10px;">
            <button style=" width: 80px;
          height: 29px;
          line-height: 29px;
           font-size: 16px;
          border-radius: 4px;
          box-shadow: 0px 4px 5px 5px rgba(51,131,202,0.55);" v-on:click="suggestSubmit">确定</button>
            <button style=" width: 80px;
          height: 29px;
          line-height: 29px;
           font-size: 16px;
          border-radius: 4px;
          box-shadow: 0px 4px 5px 5px rgba(51,131,202,0.55);" v-on:click="suggestReset">清空</button>
        </div>
        <img :src="suggestStore" class="store" style="  width: 26px;
          margin: 0px auto 13px auto;" v-on:click='suggestHide' alt="">
      </div>
      <div class="suggest-img" style="  right: 50px;
  top: 260px;
  width: 80px;
   box-shadow: 0px 5px 13px 10px rgba(215,220,223,0.5);
     padding: 19px;" v-else>
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
      isSuggestText: false
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

  height: auto;

  background-color: #fff;
  z-index: 99;
 
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
      height: auto;
      background-color: #fff;
      h2{
        width: 100%;
        background-color: #1361A8;
        color: #fff;
      
        .icon{
          display: inline-block;
          height: auto;
        
        }
      }
      textarea{
        display: block;
        resize: none;
        width: 100%;
        background-color: #1361A8;
        opacity: 0.61;
        color: #fff;
        
      }
      .suggest-button{
        display: block;
        width: 100%;
        button{
         
          text-align: center;
          color: #186CB8;
         
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
      
        height: auto;
      
        cursor: pointer;
        opacity: 0.9;
        &:hover{
          opacity: 1;
        }
      }
    }
</style>
