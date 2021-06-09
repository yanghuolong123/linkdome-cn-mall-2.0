
<template>
    <div class="report-list-title">
      	<div class="list-title">
            <p>{{listTitle.name}}</p>
			<span>{{listTitle.text}}</span>
        </div>
        <div class="list-line">
          <span></span>
          <span></span>
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
            padding-left: 20px;
            p{
                display: inline-block;
                font-size: 28px;
                color: #515355;
            }
            span{
                display: inline-block;
                font-size: 22px;
                color: #515355;
                opacity: 0.8;
                margin-left: 22px;
            }
        }
        .list-line{
            width: 100%;
            height: 2px;
            background-color: #99abb4;
            position: relative;
            span{
                display: inline-block;
                background-color: #fff;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                border: 2px solid #99abb4;
                position: absolute;
                &:nth-child(1){
                    left: 0;
                    top: -9px;
                }
                &:nth-child(2){
                    right: 0;
                    top: -9px;
                }
            }
        }
    }
</style>
