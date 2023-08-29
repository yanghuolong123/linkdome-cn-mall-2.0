<template>
    <div class="point box" @mouseover="maskShow = true" @mouseout="maskShow = false" :style="{width:width+'px',height:height+'px'}">
        <img  :src="url" alt="">
        <div class="mask " v-show="maskShow">
            <div class="flex-center">
                <Icon type="md-eye" title="预览" @click="preview"/>
                <Icon type="md-trash" title="删除" @click="delClick" class="m-l-20" />
            </div>

        </div>
        <Modal
                footer-hide
                v-model="modal"
                width="500"
                :title="$t('预览')"
               >
            <img class="pre-img" :src="url" alt="">
        </Modal>
    </div>
</template>
<script>
    export default {
      props:{
        url:{
          type:String,
          default:''
        },
        width:{
          type:String,
          default:'100'
        },
        height:{
          type:String,
          default:'100'
        }
      },
      data(){
        return{
          maskShow:false,
          modal:false
        }
      },
      methods:{
        preview(){
          this.modal = true
        },
        delClick(){
          this.$emit('delete')
        }
      }
    }
</script>
<style lang="less" scoped>
    .box{
        cursor: pointer;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        .mask{
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            color: #fff;
            font-size: 22px;
        }

    }
    .pre-img{
        width: 100%;
    }
</style>
