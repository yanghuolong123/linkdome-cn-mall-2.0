
<template>
    <div class="report-header" style=" padding: 76px 80px 0 80px;
        height: 184px;">
        <!-- <img class="header-logo" style="  width: 318px;" :src="logo" alt=""> -->
        <div class="header-right">
            <p class="text" style="font-size: 24px;
                 line-height: 108px;">
                 {{saveHeaderData}}
                 </p>
            <div style="width: 100px; height: 108px;margin-left: 30px;line-height: 108px;">
              <p style="  height: 108px;line-height: 93px;font-size: 36px;">
                {{year}}
              </p>
              <span style="bottom: 43px; width:100px; height: 12px;"></span>
            </div>
        </div>
    </div>
</template>
<script>

export default {
  name: 'report-header',
  props: {

  },
  data () {
    return {
      saveHeaderData:''
    }
  },
  watch: {

  },
  computed: {
    logo () {
      return this.$store.state.home.headerData.img
    },
    type(){
     return this.$store.state.report.reportHeaderType
    },
    year () {
      switch(this.type){
        case 'day':
          return this.$store.state.report.dayReportHeader.year
        case 'week':
           return this.$store.state.report.weekReportHeader.year
        case 'month':
           return this.$store.state.report.monthReportHeader.year;
        case 'customize':
          return this.$store.state.report.customizeReportHeader.year
      }
    },
    headerData () {
      let header
      switch(this.type){
        case 'day':
          header = this.$store.state.report.dayReportHeader
          this.saveHeaderData = header.year + '.' + header.time + ' ' + header.week
          break
        case 'week':
          header = this.$store.state.report.weekReportHeader
          this.saveHeaderData =  header.year + '年第' + header.period + '周\xa0\xa0' + header.time
          break
        case 'month':
          header = this.$store.state.report.monthReportHeader
          this.saveHeaderData =  header.year + '年' + header.time + '月'
          break
      }
    }
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
    .report-header {
        width: 100%;
        .header-logo{
            display: block;
            height: 100%;
            float: left;
        }
        .header-right{
            float: right;
            .text{
               color: #3b3b3b;
               height: 100%;
               float: left;
            }
            div{
                float: left;
                position: relative;
                z-index: 1;

                p{
                    width: 100%;
                    text-align: center;
                    color: #2081d4;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                }
                span{
                    display: inline-block;
                    background-color: #35e9df;
                    position: absolute;
                    right: 0;
                }
            }
        }
    }

</style>
