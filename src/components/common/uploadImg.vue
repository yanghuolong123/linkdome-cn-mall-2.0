<template>
  <div>
      <Upload :action="baseurl+'uploadimg'"
        id="uploadUserImg"
        :headers="{Authorization:token}"
        :format="['jpg','jpeg','png']"
        :on-success="handleSuccess"
        :on-progress="handleProgress"
        :on-error="handleErrors"
        :on-format-error="formatType"
        :show-upload-list="false"
        name="file">
          <Button v-show ="showUpload" type="primary" :disabled="disabled" class="buttons">
            <Icon type="md-cloud-upload"  />
            <slot>{{$t('上传')}}</slot>
          </Button>
      </Upload>
      <!-- <div style="text-align:center;">
        <Button class="buttons"><icons :type="face":size="20"></icons>人脸采集</Button>
      </div> -->
  </div>
</template>

<script>
// import {upload} from "@/api/adminM.js"
import { getToken } from '@/libs/util'
export default {
  name: 'uploadImg',
  data () {
    return {
      showUpload: true,
      file: null,
      loadingStatus: false,
      upload: 'shangchuantouxiang',
      face: 'renliancaiji',
      token: 'Bearer ' + getToken(),
      baseurl: process.env.NODE_ENV === 'production' ? '/api/v1/' : ''

    }
  },
    props:{
        disabled:{
            type:Boolean,
            default:false
        }
    },
  computed: {

  },
  methods: {
    handleSuccess (res, file, data) { // 上传成功
      var img = res.data.url
      if (res.code == 200) {
        if (res.data.url.error != undefined && res.data.url.error.length > 0) {
          this.$vs.loading.close()
          // alert(res.data.url.error)
          this.$vs.dialog({
            color: this.colorAlert,
            title: `上传图片`,
            text: res.data.url.error,
            acceptText: '确定'
          })
        } else {
          this.$emit('changeImg', img)
          this.$vs.loading.close()
        }
      } else if (res.code == 502) {
        this.$vs.loading.close()
        // alert(res.message)
        this.$vs.dialog({
          color: this.colorAlert,
          title: `上传图片`,
          text: res.message,
          acceptText: '确定'
        })
      }
    },
    handleProgress (event, file, fileList) { // 上传中、
      this.$vs.loading()
    },
    handleErrors (error, file, fileList) { // 上传失败
      this.$vs.loading.close()
    },
    formatType (file) {
      // alert('请上传jpg、jpeg、png格式的头像')
      this.$vs.dialog({
        color: this.colorAlert,
        title: `上传图片`,
        text: '请上传jpg、jpeg、png格式的头像？',
        acceptText: '确定'
      })
    }
  }
}
</script>

<style scope lang="scss">
.ivu-upload{
  display: flex;
}
.ivu-upload-select {
    display: flex;
    flex-flow: column;
    text-align: center;
    margin: auto;
}
.buttons{
    /deep/i{
        font-size: 22px;
    }
  span{
    display: inline-block;
    width: 83px;
    .ivu-icon{
      float: left;
    }
    p{
      display: inline-block;
      float: left;
      margin-top:3px;
      margin-left: 10px;
    }

  }
}
</style>
