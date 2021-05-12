<template>
    <Card :dis-hover="true" class="heatImgbox">
        <p slot="title">热度图图示</p>
        <Row :gutter="16">
                <Col span="24">
                    <span>场景一</span>
                    <div v-if="heatType == 0">
                      <img class="pathImg" src="../../assets/images/pathflow.png" alt="">
                    </div>
                     <div v-if="heatType == 1">
                      <img src="../../assets/images/heatmap.jpg" alt="">
                    </div>
                </Col>
                <!-- <Col span="12">
                   <span>场景一</span>
                   <div>
                      <img src="../../assets/images/heatmap.jpg" alt="">
                   </div>
                </Col> -->
        </Row>
    </Card>
</template>
<script>
export default {
    props:{
        heatType : Number
    }
}
</script>
<style lang="stylus" scoped>
.heatImgbox /deep/
    .ivu-card-head
        padding 20px
        p 
            font-weight normal
            font-size 20px
            color #b2b2b2
    .box-con
        display flex
        justify-content space-between
   .pathImg{
       width  80%
       height 80%
   }     
</style>
