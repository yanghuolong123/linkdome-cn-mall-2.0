<template>
  <div class="cards" :style="{margin:margin}">

    <template v-if="!isTime">
      <div class="left">
        <div class="circles" :style="{backgroundColor:item.bg,}">
          <icons :type="item.icon" :size='28'  :color="item.color" class="icons"></icons>
        </div>
      </div>
      <div class="right">
        <p class="title">{{ $t(item.title) }}</p>
        <p class="number">{{Number(item.total1).toLocaleString()}}</p>
      </div>
    </template>

    <template v-else>
      <div class="header">
        <div class="left">
          <div class="circles" :style="{backgroundColor:item.bg,}">
            <icons :type="item.icon" :size='28'  :color="item.color" class="icons"></icons>
          </div>
        </div>
        <div class="right">
          <p class="title">{{ $t(item.title) }}</p>
        </div>
      </div>
      <div class="compares">
        <div class="left">
          <p class="time1">{{item.time1}}</p>
          <p class="time2">{{item.time2}}</p>
        </div>
        <div class="right">
          <p class="precent">{{Number(item.total1).toLocaleString()}}</p>
          <div class="iconss" v-bind:class="{up:isUp}">
            <icons type="xiala" color="#EC7172" ></icons>
            <p class="addPrecent">{{item.addPrecent}}</p>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: {
        icon: 'daofang',
        title: '平均到访次数',
        number: '266.333',
        bg: '#EAE8FD',
        color: '',
        time1: '2019-07-01 2019-08-08',
        time2: '2019-07-01 2019-08-08',
        precent: '80%',
        addPrecent: '15%'
      }
    },
    margin: {
      type: String,
      default: ''
    },
    isTime: {
      type: Boolean,
      default: false
    },
    isUp: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="stylus" scoped>
.cards{
  background-color:#FFF;
  width:100%;
  position:relative;
  display: flex;
  height:193px;
  flex-wrap: wrap;
  border-radius:5%;
  .left{
    width:46%;
    .circles{
      width:60px;
      height:60px;
      border-radius:50%;
      position:relative;
        left:50%;
        top:50%;
        margin-top:-30px;
        margin-left:-30px;
      .icons{
        position:absolute;
        left:50%;
        top:50%;
        margin-top:-20px;
        margin-left:-14px;
      }
    }
  }
  .right{
    width:54%;
    .title{
        position: relative;
        top: 30%;
        left: 0%;
        font-size: 18px;
        color: #2B2A2A;
        font-weight: bold;
    }
    .number{
        position: relative;
        top: 46%;
        left: 0%;
        font-size: 18px;
        color: #3E3C3C;
        font-weight: 400;
    }
  }
  .header{
    width:100%;
    display: flex;
    position:relative;
    height:100px;
    .right{
      top: 38%;
    }

  }
  .compares{
    width: 100%;
    position: relative;
    // bottom: -4px;
    top:0%;
    display: flex;
    .left{
      width:70%
      padding-left: 20px;
      .time1{
        font-size:14px;
        color:#414040;
        font-weight:bold;
        height: 30px;
        margin-bottom:2px;
        // line-height: 6px;
      }
      .time2{
        font-size:14px;
        color:#626262;
        font-weight:400;
        height: 30px;
        // line-height: 6px;
      }
    }
    .right{
      width:30%;
      position:relative;
      top: -10%;
      .precent{
        color:#252424;
        font-size:24px;
        font-weight:400;
        margin-bottom: 4px;
      }
      .iconss{
        display:flex;
        .addPrecent{
          font-size:16px;
        }
      }
    }
  }
  .up{
    .iconxiala{
    transform: rotateX(180deg);
    color:#6DA787!important;
    }
    .addPrecent{
      color:#6DA787!important;
    }
  }
}

</style>
