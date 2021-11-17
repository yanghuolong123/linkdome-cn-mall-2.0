<template>
  <div class="box">
    <viewer
      @inited="inited"
      :images="infoList"
      class="camera-img"
      ref="viewer"
      :index="indexImg"
    >
      <div class="box" v-for="(item, index) in infoList" :key="index">
        <img :src="item[keyName.image_path]" :alt="imgAlt(item)" />
      </div>
    </viewer>
  </div>
</template>

<script>
export default {
  name: "BigImg",
  props: ["info", "index", "keyName"],
  data() {
    return {
      infoList: [{}],
      indexImg: 0,
    };
  },
  watch: {
    index() {
      this.indexImg = Number(this.index.split("-")[0]);
    },
    info(val) {
      this.infoList = val;
      this.viewershow();
    },
  },
  computed: {
    imgAlt() {
      return function(obj) {
        return this.keyName.time2
          ? obj[this.keyName.title] +
              " ( " +
              obj[this.keyName.time1] +
              " - " +
              obj[this.keyName.time2] +
              " ) "
          : obj[this.keyName.title] + " ( " + obj[this.keyName.time1] + " ) ";
      };
    },
  },
  methods: {
    viewershow() {
      this.$viewer.show();
    },
    inited(viewer) {
      this.$viewer = viewer;
      this.$viewer.index = this.indexImg;
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  display: none;
}
</style>
