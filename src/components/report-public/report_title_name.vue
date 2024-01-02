
<template>
    <div class="report-list-title">
      	<div class="list-title" style=" padding-left: 20px;">
            <p style=" font-size: 28px;" v-if="listTitle">{{listTitle.name}}</p>
			<span style=" font-size: 22px;
                margin-left: 15px;" v-if="listTitle">{{listTitle.text}}</span>
        </div>
        <div class="list-line" style="  height: 2px;">
          <span style=" width: 18px;
                height: 18px;
                border-radius: 50%;
                left: 0;
                top: -9px;
                border: 2px solid #99abb4;"></span>
          <span style=" width: 18px;
                height: 18px;
                border-radius: 50%;
                 right: 0;
                top: -9px;
                border: 2px solid #99abb4;"></span>
        </div>
    </div>
</template>
<script>
export default {
  name: 'report-list-title',
  props: {
    listTitle: {
      type: Object
    }
  },
  components: {
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
    .report-list-title {
        width: 100%;
        .list-title{
		    width: 100%;
            p{
                display: inline-block;
                color: #515355;
            }
            span{
                display: inline-block;
                color: #515355;
                opacity: 0.8;

            }
        }
        .list-line{
            width: 100%;
            background-color: #99abb4;
            position: relative;
            span{
                display: inline-block;
                background-color: #fff;
                position: absolute;
            }
        }
    }
</style>
