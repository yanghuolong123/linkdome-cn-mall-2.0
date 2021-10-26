<template>
  <div class="box">
    <div class="imgInfo">
      <p>{{ info.name }} ( {{ info.time1 + "-" + info.time1 }} )</p>
      <i @click="close" class="el-icon-circle-close icon"></i>
      <img :src="info.imgSrc" alt="此处应有图片" />
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
  methods: {
    close() {
      this.show = false;
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
  p {
    line-height: 50px;
  }
  .imgInfo {
    width: 600px;
    height: 383px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 10px;
    .icon {
      font-size: 24px;
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }
  }
}
</style>
