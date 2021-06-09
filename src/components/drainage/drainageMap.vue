<template>
  <div class="drainage-map">
      <h1>引流图
        <Tooltip  :content="tootipText"  placement="right" theme="light" transfer max-width="500">
            <icons type="wenhao"/>
        </Tooltip>
      </h1>
      <div class="drainage-map-text" :style="{height:mapHeight,margin:mapMargin}">
          <div class="drainage-map-left">
              <div class="drainage-map-left-top">
                  <ul>
                    <li  :key="index" v-for="(item,index) in dataList.direct">
                        <div class="drainage-enter">
                            <p>客流占比：{{item.value}}%</p>
                            <p>
                                环比
                                <Icon type="md-arrow-dropdown" v-if="item.action" />
                                <Icon type="md-arrow-dropup" v-else  />
                                <span v-bind:class="{ clolorAction: item.action }">{{item.link}}%</span>
                            </p>
                        </div>
                        <div class="drainage-name" style="padding-left:10%;">{{item.name}}</div>
                        <div class="drainage-img" >
                            <img :src="accessImg" alt="">
                        </div>
                    </li>
                  </ul>
              </div>
              <div class="drainage-map-left-bottom">
                    <ul>
                    <li :key="index" v-for="(item,index) in dataList.radiation">
                       <div class="drainage-enter">
                            <p>客流占比：{{item.value}}%</p>
                            <p>
                                环比
                                <Icon type="md-arrow-dropdown" v-if="item.action" />
                                <Icon type="md-arrow-dropup" v-else  />
                                <span v-bind:class="{ clolorAction: item.action }">{{item.link}}%</span>
                            </p>
                        </div>
                        <div class="drainage-name" style="padding-left:10%;">{{item.name}}</div>
                        <div class="drainage-img" >
                            <img :src="shopImg" alt="">
                        </div>
                    </li>
                  </ul>
              </div>
          </div>
          <div class="drainage-map-center">
              <img class="drainage-map-center-bg" :src="centerImg" alt="">
              <div class="drainage-map-center-text">
                  <img :src="shopImg" :style="{margin:margin}"alt="">
                  <p class="drainage-shop-name">{{presentData.name}}</p>
              </div>
              <div class="text-location" v-for="item in centerData" >
                  <p>{{item.text}}：{{item.value}}%</p>
                  <p>
                      环比
                    <Icon type="md-arrow-dropdown" v-if="item.action" />
                    <Icon type="md-arrow-dropup" v-else  />
                    <span v-bind:class="{ clolorAction: item.action }">{{item.link}}%</span>
                  </p>
              </div>
          </div>
          <div class="drainage-map-right">
              <div class="drainage-map-left-top">
                   <ul>
                    <li :key="index" v-for="(item,index) in dataList.indirect">
                        <div class="drainage-img" >
                            <img :src="shopImg" alt="">
                        </div>
                        <div class="drainage-name" style="padding-right:10%;">{{item.name}}</div>
                        <div class="drainage-enter">
                            <p>客流占比：{{item.value}}%</p>
                            <p>
                                环比
                                <Icon type="md-arrow-dropdown" v-if="item.action" />
                                <Icon type="md-arrow-dropup" v-else  />
                                <span v-bind:class="{ clolorAction: item.action }">{{item.link}}%</span>
                            </p>
                        </div>
                    </li>
                  </ul>
              </div>
              <div class="drainage-map-left-bottom">
                    <ul>
                    <li :key="index" v-for="(item,index) in dataList.departure">
                        <div class="drainage-img" >
                            <img :src="accessImg" alt="">
                        </div>
                        <div class="drainage-name" style="padding-right:10%;">{{item.name}}</div>
                        <div class="drainage-enter">
                            <p>客流占比：{{item.value}}%</p>
                            <p>
                                环比
                                <Icon type="md-arrow-dropdown" v-if="item.action" />
                                <Icon type="md-arrow-dropup" v-else  />
                                <span v-bind:class="{ clolorAction: item.action }">{{item.link}}%</span>
                            </p>
                        </div>
                    </li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
</template>
<script>

export default {
  name: 'drainage-map',
  props: {
    dataList: {
      type: Object,
      default: {}
    },
    presentData: {
      type: Object,
      default: {}
    },
    centerData: {
      type: Array,
      default: []
    },
    mapHeight: {
      type: String,
      default: '800px'
    },
    mapMargin: {
      type: String,
      default: '50px auto 0 auto'
    },
    margin: {
      type: String,
      default: '-50px'
    }
  },
  components: {

  },
  data () {
    return {
      listData: {
        direct: [],
        indirect: [],
        radiation: [],
        departure: []
      },
      centerList: [
        {
          value: 36,
          text: '出入口引入占比',
          action: false,
          link: 10
        },
        {
          value: 36,
          text: '辐射店铺占比',
          action: true,
          link: 10
        },
        {
          value: 36,
          text: '店铺引入占比',
          action: true,
          link: 10
        },
        {
          value: 36,
          text: '离场客流占比',
          action: false,
          link: 10
        }
      ],
      centerImg: require('@/assets/images/fixation_img/bg/draniage_center.webp'),
      shopImg: require('@/assets/images/fixation_img/rest/shop.webp'),
      accessImg: require('@/assets/images/fixation_img/rest/access.webp'),
      tootipText: '该引流图包括出入口引入客流、店铺引入客流、辐射店铺客流和离场客流，其中：\n出入口引入客流：从出入口直接进入所选店铺的转化客流\n店铺引入客流：从其他店铺到所选店铺的转化客流\n辐射店铺客流：从所选店铺到其他店铺转化客流\n离场客流：从所选店铺直接离开购物中心的客流'
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.drainage-map{
    width: 100%;
    height: auto;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
    border-radius: .5rem;
    background-color: #fff;
    h1{
        font-size: 24px;
        color: #3e3c3c;
        padding:27px 19px 0;
        font-weight: 400;
    }
    .drainage-map-text{
        width: 95%;
        padding-bottom: 50px;
        .drainage-map-left,.drainage-map-center,.drainage-map-right{
            float: left;
            height: 100%;
            position: relative;

            .drainage-map-left-bottom,.drainage-map-left-top{
                position: absolute;
                left: 0;
                height: 45%;
                width: 100%;
                box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
                ul{
                    width: 100%;
                    height: 100%;
                    background-color: #F3F3F3;
                       border-radius: 5px;
                    li{
                        width: 100%;
                        height: 20%;
                        padding: 0 8%;
                        border-bottom: 1px solid #d2d2d2;
                        position: relative;
                        &:last-child{
                            border-bottom: none;
                        }
                        div{

                          &:nth-child(1){
                            position: absolute;
                            left: 20px;
                            top:12px;
                          }
                           &:nth-child(2){
                            width: 100%;
                            text-align: center;
                          }
                           &:nth-child(3){
                           position: absolute;
                           right: 20px;
                           top: 11px;
                          }
                        }
                        .drainage-enter{
                            p{
                                display: block;
                                width: 100%;
                                text-align: right;
                                color: #3b3a3a;
                                &:nth-child(2){
                                    color: #929292;
                                    margin-top: 5px;
                                }
                                span{
                                    color: #26b465;
                                }
                                .clolorAction{
                                    color: #f64f61;
                                }
                                .ivu-icon-md-arrow-dropup{
                                    font-size: 18px;
                                    color: #26b465;
                                }
                                .ivu-icon-md-arrow-dropdown{
                                    font-size: 18px;
                                    color: #f64f61;
                                }
                            }
                        }
                        .drainage-name{
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            color: #3b3a3a;
                        }
                        .drainage-img{
                            img{
                                display: block;
                                height: 45px;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
            .drainage-map-left-top{
                top: 0;
            }
             .drainage-map-left-bottom{
                bottom: 0;
            }
        }
         .drainage-map-left, .drainage-map-right{
            width: 30%;
         }
        .drainage-map-center{
            width: 40%;
            position: relative;
            .drainage-map-center-bg{
                display: block;
                width: 100%;
                height:440px;
                position: absolute;
                top: 160px;
            }
            .text-location{
                position: absolute;
                &:nth-child(3){
                    left: 3%;
                    top: 100px;
                }
                &:nth-child(4){
                    right: 3%;
                    top: 100px;
                    p{
                        text-align: right;
                    }
                }
                &:nth-child(5){
                    left: 3%;
                    bottom: 90px;

                }
                &:nth-child(6){
                    right: 3%;
                    bottom: 90px;
                    p{
                        text-align: right;
                    }
                }
                p{
                    font-size: 16px;
                    color: #3b3a3a;
                    &:nth-child(2){
                        font-size: 14px;
                        color: #8e9696;
                        margin-top: 5px;

                    }
                    span{
                        color: #26b465;
                    }
                    .clolorAction{
                        color: #f64f61;
                    }
                   .ivu-icon-md-arrow-dropup{
                        font-size: 18px;
                        color: #26b465;
                    }
                    .ivu-icon-md-arrow-dropdown{
                        font-size: 18px;
                        color: #f64f61;
                    }
                }

            }
            .drainage-map-center-text{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                img{
                    display: block;
                    height: 100px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    margin-left: -50px;
                    background-color: #fff;
                    border-radius: 50%;
                }
                .drainage-shop-name{
                    margin-top: 440px;
                    font-size: 18px;
                    text-align: center;
                    width: 100%;
                    color: #666;
                    font-weight: 600;
                }
            }
        }
    }
}
</style>
