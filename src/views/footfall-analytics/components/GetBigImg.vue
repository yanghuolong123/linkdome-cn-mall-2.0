<template>
  <div class="box" v-show="show">
    <div class="imgInfo">
      <p>
        {{ infoList[indexImg][keyName.title] }} &nbsp; ({{
          keyName.time2
            ? infoList[indexImg][keyName.time1] +
              "-" +
              infoList[indexImg][keyName.time2]
            : infoList[indexImg][keyName.time1]
        }})
      </p>
      <i @click="show = false" class="el-icon-circle-close icon"></i>
      <img :src="infoList[indexImg][keyName.image_path]" alt="此处应有图片" />
      <i @click="getPrevious" class="el-icon-arrow-left left change"></i>
      <i @click="getNext" class="el-icon-arrow-right right change"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "BigImg",
  props: ["info", "index", "keyName"],
  data() {
    return {
      infoList: [{}],
      show: false,
      indexImg: 0,
    };
  },
  watch: {
    index() {
      this.indexImg = Number(this.index.split("-")[0]);
      console.log(this.indexImg);
    },
    info() {
      this.infoList = this.info;
      this.show = true;
    },
  },
  methods: {
    getPrevious() {
      if (this.indexImg != 0) {
        this.indexImg--;
      }
    },
    getNext() {
      if (this.indexImg != this.info.length - 1) {
        this.indexImg++;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 999;
  .imgInfo {
    width: 37.5rem;
    height: 24.375rem;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 0.625rem;
    .change {
      width: 25px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #eee;
      color: #999;
      font-size: 20px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.8;
    }
    .left {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      left: 0.5625rem;
    }
    .right {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      right: 0.5625rem;
    }
    p {
      line-height: 2.5rem;
      margin-bottom: 0.3125rem;
    }
    .icon {
      font-size: 1.5rem;
      position: absolute;
      top: 1.125rem;
      right: 0.625rem;
      z-index: 9999;
    }
    img {
      width: 36.25rem;
      height: 20.4375rem;
    }
  }
}
</style>
