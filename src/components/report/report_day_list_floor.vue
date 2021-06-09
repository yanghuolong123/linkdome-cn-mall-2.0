
<template>
    <div class="reportOneFloor">
       <div></div>
        <p>
            报告日期 : {{coverDateTime}}
        </p>
    </div>
</template>
<script>
export default {
  name: 'report-day-list-cover',
  data () {
    return {

    }
  },
  computed: {

    coverDateTime () {
      return this.$store.state.report.coverDateTime
    }

  }
}
</script>
<style scoped lang="less">
    .reportOneFloor{
        height: auto;
        overflow: hidden;
        position: absolute;
        left: 50px;
        bottom: 100px;
        right: 130px;
        div{
            width: 60%;
            height: 4px;
            background-color: #3699ff;
            float: left;
            margin-top: 13px;
        }
        p{
            float: right;
            font-size: 20px;
            color: #a0a7ad;
        }
    }
</style>
