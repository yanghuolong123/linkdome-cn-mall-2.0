<template>
<div class="alert-text">
    <div class="alert-bg" v-on:click="closeAlert"></div>
    <div class="alert-center">
        <div class="alert-close" v-on:click="closeAlert">
            <Icon type="md-close" />
        </div>
        <header><span v-if="alertText.title">{{alertText.title}}</span> </header>
        <div class="alert-center-text">
            <span v-if="alertText.text">{{alertText.text}}</span>
        </div>
        <div class="line"></div>
        <div class="flooter">
            <button :style={backgroundColor:alertText.bg} v-on:click="alertConfirm">
                <span>确定</span>
            </button>
        </div>
    </div>
</div>
</template>

<script>
export default {
  props: {
    alertText: {
      type: Object
    }
  },
  data () {
    return {}
  },
  components: {
  },
  methods: {
    closeAlert () {
      this.$emit('closeAlert')
    },
    alertConfirm () {
      this.$emit('alertConfirm', this.alertText.confirm)
    }
  }
}
</script>
<style lang="scss" scope>
.alert-text{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    transition: all .2s;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    .alert-bg{
        width: 100%;
        background: rgba(0,0,0,.4);
        transition: all .25s ease;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        z-index: 10;
    }

    .alert-center{
        transition: all .2s;
        z-index: 100;
        width: calc(100% - 20px);
        margin: 10px;
        max-width: 400px;
        border-radius: 6px;
        box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
        background: #fff;
        animation: rebound .3s;
        position: relative;
         .alert-close{
            position: absolute;
            right: -5px;
            top: -5px;
            background: #fff;
            width: 33px;
            height: 33px;
            box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
            border-radius: 5px;
            text-align: center;
            line-height: 33px;
            cursor: pointer;
            z-index: 10;
            transition: all .23s ease .1s;
            &:hover{
                transform: translate(5px,-5px);
                box-shadow: 0 0 0 0 rgba(0,0,0,.1)
            }
            i{
                font-size: 20px;
            }
        }
        header{
            display: inline-block;
            padding: .8rem;
            -webkit-transition: all .23s ease .1s;
            transition: all .23s ease .1s;
            padding: 8px;
            padding-left: 12px;
            font-size: 1.2rem;
            margin: 0;
            width: 100%;
            position: relative;
            overflow: hidden;
            border-radius: 5px 5px 0 0;
            background-color: #f8f8f8;
        }
        .alert-center-text{
            padding: 1rem;
            font-size: 1rem;
        }
        .line{
            width: 100%;
            height: 1px;
            background-color: rgba(0,0,0,.05);
        }
        .flooter{
            display: inline-block;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 1rem;
            button{
                display: inline-block;
                padding: .75rem 2rem;
                font-size: 1rem;
                color: #fff;
                border: 0;
                border-radius: 6px;
                cursor: pointer;
                &:hover{
                    box-shadow: 0 8px 25px -8px #00A0E9;
                }
            }
        }
    }

}
</style>
