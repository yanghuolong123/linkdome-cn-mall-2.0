
<template>
    <div class="report-title">
      <p style="  font-size: 72px;
        padding-left: 45px;
        border-left:36px solid #2081d4;
        margin-top: 46px;">{{title}}</p>
    </div>
</template>
<script>

export default {
  name: 'report-title',
  props: {
    title: {
      type: String,
      defaults: '客流总览'
    }
  },
  data () {
    return {
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
    .report-title {
        width: 100%;
        color: #2081d4;
    }

</style>
