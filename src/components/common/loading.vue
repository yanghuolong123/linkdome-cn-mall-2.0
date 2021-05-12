<template>
    <div class="loadingMask">
        <img :src="loadingGif" alt="">
    </div>
</template>
<script>

export default {
    name:"loading",
    data(){
        return {
           loadingGif:require("@/assets/images/login2.gif")
        }
    }
}
</script>
<style lang="stylus" scoped>
.loadingMask 
    height 100%
    text-align center
    background-color rgba(230, 230, 230,.5)
    >img 
        margin-top 2px
</style>
