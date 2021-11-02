<template>
  <div class="box" v-show="show">
    <div class="imgInfo">
      <p>{{ info.title }} &nbsp; ({{ info.time }})</p>
      <i @click="show = false" class="el-icon-circle-close icon"></i>
      <img :src="info.image_path" alt="此处应有图片" />
    </div>
  </div>
</template>

<script>
export default {
  name: "BigImg",
  props: ["info"],
  data() {
    return {
      show: false,
    };
  },
  watch: {
    info() {
      this.show = true;
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
