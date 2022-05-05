
<template>
    <div class="report-flooter" style=" bottom: 45px;
         padding: 0 80px;">
       <!-- <img style=" width: 318px;
            height: 108px;" :src="logo" alt=""> -->
       <p style=" right: 80px;
            font-size: 28px;">
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
      logo: require('@/assets/images/fixation_img/logo/logo.png')

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

        position: absolute;
        left: 0;

        img{

            float: left;
        }
        p{
            position: absolute;
            bottom: 0;

            color: #515355;

        }
    }

</style>
