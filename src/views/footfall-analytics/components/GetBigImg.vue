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
        <img
          v-if="keyName.time2"
          :src="item[keyName.image_path]"
          :alt="
            item[keyName.title] +
              ' ( ' +
              item[keyName.time1] +
              ' - ' +
              item[keyName.time2] +
              ' ) '
          "
        />
        <img
          v-else
          :src="item[keyName.image_path]"
          :alt="item[keyName.title] + ' ( ' + item[keyName.time1] + ' ) '"
        />
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
  methods: {
    viewershow() {
      this.$viewer.show();
    },
    inited(viewer) {
      this.$viewer = viewer;
      this.$viewer.index = this.indexImg;
    },
    getPrevious() {
      if (this.indexImg != 0) this.indexImg--;
    },
    getNext() {
      if (this.indexImg != this.info.length - 1) this.indexImg++;
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  display: none;
}
</style>
