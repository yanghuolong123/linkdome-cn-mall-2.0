
<template>
    <div class="report-flooter">
       <img :src="logo" alt="">
       <p>
           第{{size}}页
       </p>
    </div>
</template>
<script>

export default {
  name: 'report-flooter',
  props: {
    size: {
      type: String
    }
  },
  data () {
    return {
      logo: require('@/assets/images/fixation_img/logo/logo.webp')

    }
  },
  watch: {

  },
  computed: {
  },
  methods: {

  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
    .report-flooter {
        width: 100%;
        padding: 0 80px;
        position: absolute;
        left: 0;
        bottom: 45px;
        img{
            width: 318px;
            height: 108px;
            float: left;
        }
        p{
            position: absolute;
            bottom: 0;
            right: 80px;
            font-size: 28px;
            color: #515355;

        }
    }

</style>
