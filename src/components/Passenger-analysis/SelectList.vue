<template>
    <div class="cd-1">
        <div class="tx" v-on:click="showList">{{showText}}</div>
        <!-- <div class="query" v-on:click="queryData">查询</div> -->
        <div class="list" v-if="showSelect"
             v-bind:class="{actionSelect:showSelect}"
        >
            <div class="list-title">
                <p>购物中心</p>
                <p>楼层</p>
                <p>商铺</p>
                <p>区域 / 出入口 / 排队处</p>
            </div>
            <div class="group">
                <ul>
                    <li v-for="(item,index) in list1"
                        v-on:mouseover="mouseoveList(index)"
                        v-on:mouseout="mouseoutList(index)"

                    >
                        <input type="checkbox"  v-model="item.ifBox"   v-on:click="selectName(index)">
                        <Icon v-if="item.children && item.children.length > 0"  type="ios-arrow-forward" />
                        <span>
                            {{item.name}}
                            <div v-if="item.ifShow" class="shoppingList"
                                 v-bind:class="{listWidth:!item.children}"
                            >
                                <div class="shoppingListText" v-for="(children,shopIndex) in item.children"
                                 v-on:mouseover="mouseoveShopping(index,shopIndex)"
                                 v-on:mouseout="mouseoutShopping(index,shopIndex)"
                                >
                                    <input type="checkbox" v-model="children.ifBox"   v-on:click="shoppingName(index,shopIndex)">
                                    <Icon v-if="children.children && children.children.length > 0" type="ios-arrow-forward"  />
                                    <span>
                                        {{children.name}}
                                         <div class="shoppingList" style="top: -1px;" v-if="children.ifShow"
                                              v-bind:class="{listWidth:!children.children}"
                                         >
                                            <div class="shoppingListText" v-for="(children,floorIndex) in children.children"
                                            v-on:mouseover="mouseoveFloor(index,shopIndex,floorIndex)"
                                            v-on:mouseout="mouseoutFloor(index,shopIndex,floorIndex)"
                                            >
                                               <input  type="checkbox" v-model="children.ifBox"   v-on:click="floorName(index,shopIndex,floorIndex)">
                                               <Icon v-if="children.gate && children.gate.length > 0" type="ios-arrow-forward" />
                                               <span>
                                                   {{children.name}}
                                                   <div class="shoppingList" style="top: -1px;" v-if="children.ifShow"
                                                         v-bind:class="{listWidth:!children.gate}"
                                                    >
                                                   <div class="shoppingListText" v-for="(gate,inIndex) in children.gate"

                                                   >
                                                       <input  type="checkbox" v-model="gate.ifBox"   v-on:click="inAndOutName(index,shopIndex,floorIndex,inIndex)">
                                                       <span>{{gate.name}}</span>
                                                   </div>
                                               </div>
                                               </span>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import { getBussinessTree } from '@/api/passenger.js'
export default {
  name: 'select-list',
  components: {
  },
  data () {
    return {
      listTest: [],
      showSelect: false,
      list1: [
        {
          name: '购物中心1',
          id: 1,
          ifBox: false,
          ifShow: false,
          children: [
            {
              name: '楼层1',
              ifBox: false,
              ifShow: false,
              id: 12,
              children: [
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店1',
                  id: 22,
                  gate: [
                    {
                      ifBox: false,
                      id: 102,
                      name: '出入100'

                    },
                    {
                      ifBox: false,
                      id: 103,
                      name: '出入200'
                    },
                    {
                      ifBox: false,
                      id: 104,
                      name: '出入300'
                    }
                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  id: 33,
                  name: '店2',
                  gate: [
                    {
                      ifBox: false,
                      id: 111,
                      name: '出入101'
                    },
                    {
                      ifBox: false,
                      id: 112,
                      name: '出入202'
                    },
                    {
                      ifBox: false,
                      id: 113,
                      name: '出入303'
                    }

                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店3',
                  id: 44,
                  gate: [
                    {
                      ifBox: false,
                      id: 118,
                      name: '出入1010'
                    },
                    {
                      ifBox: false,
                      id: 116,
                      name: '出入2020'
                    },
                    {
                      ifBox: false,
                      id: 119,
                      name: '出入3030'
                    }

                  ]
                }
              ]
            },
            {
              name: '楼层2',
              ifShow: false,
              ifBox: false,
              id: 13,
              children: [
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店1',
                  id: 432,
                  gate: [
                    {
                      ifBox: false,
                      id: 42378,
                      name: '出入100'
                    },
                    {
                      ifBox: false,
                      id: 2313,
                      name: '出入200'
                    },
                    {
                      ifBox: false,
                      id: 531,
                      name: '出入300'
                    }
                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  id: 4848,
                  name: '店2',
                  gate: [
                    {
                      ifBox: false,
                      id: 622,
                      name: '出入101'
                    },
                    {
                      ifBox: false,
                      id: 8631,
                      name: '出入202'
                    },
                    {
                      ifBox: false,
                      id: 6328,
                      name: '出入303'
                    }

                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  id: 52131,
                  name: '店3',
                  gate: [
                    {
                      ifBox: false,
                      id: 7283,
                      name: '出入1010'
                    },
                    {
                      ifBox: false,
                      id: 886,
                      name: '出入2020'
                    },
                    {
                      ifBox: false,
                      id: 1143,
                      name: '出入3030'
                    }

                  ]
                }
              ]
            },
            {
              name: '楼层3',
              ifShow: false,
              ifBox: false,
              id: 14,
              children: [
                {
                  ifBox: false,
                  ifShow: false,
                  id: 862,
                  name: '店1',
                  gate: [
                    {
                      ifBox: false,
                      id: 9632,
                      name: '出入100'
                    },
                    {
                      ifBox: false,
                      id: 2586,
                      name: '出入200'
                    },
                    {
                      ifBox: false,
                      id: 3648,
                      name: '出入300'
                    }
                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  id: 756,
                  name: '店2',
                  gate: [
                    {
                      ifBox: false,
                      id: 9654,
                      name: '出入101'
                    },
                    {
                      ifBox: false,
                      id: 87642,
                      name: '出入202'
                    },
                    {
                      ifBox: false,
                      id: 72131,
                      name: '出入303'
                    }

                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店3',
                  id: 832154,
                  gate: [
                    {
                      ifBox: false,
                      id: 96348,
                      name: '出入1010'
                    },
                    {
                      ifBox: false,
                      id: 7422,
                      name: '出入2020'
                    },
                    {
                      ifBox: false,
                      id: 1235,
                      name: '出入3030'
                    }

                  ]
                }
              ]
            }
          ]
        },
        {
          name: '购物中心2',
          id: 2,
          ifBox: false,
          ifShow: false,
          children: [
            {
              name: '楼层111',
              ifBox: false,
              id: 79512,
              ifShow: false,
              children: [
                {
                  ifBox: false,
                  ifShow: false,
                  id: 8126,
                  name: '店987',
                  gate: [
                    {
                      ifBox: false,
                      id: 845326,
                      name: '出入963'
                    },
                    {
                      ifBox: false,
                      id: 7412,
                      name: '出入369'
                    },
                    {
                      ifBox: false,
                      id: 123586,
                      name: '出入852'
                    }
                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店1669',
                  id: 81235,
                  gate: [
                    {
                      ifBox: false,
                      id: 624,
                      name: '出入101'
                    },
                    {
                      ifBox: false,
                      id: 3324,
                      name: '出入202'
                    },
                    {
                      ifBox: false,
                      id: 441,
                      name: '出入303'
                    }

                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店3',
                  id: 6446,
                  gate: [
                    {
                      ifBox: false,
                      id: 666,
                      name: '出入1010'
                    },
                    {
                      ifBox: false,
                      id: 668,
                      name: '出入2020'
                    },
                    {
                      ifBox: false,
                      id: 336,
                      name: '出入3030'
                    }

                  ]
                }
              ]
            },
            {
              name: '楼层222',
              ifShow: false,
              id: 8237,
              ifBox: false,
              children: [
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店1',
                  id: 552,
                  gate: [
                    {
                      ifBox: false,
                      id: 255,
                      name: '出入100'
                    },
                    {
                      ifBox: false,
                      id: 36455,
                      name: '出入200'
                    },
                    {
                      ifBox: false,
                      id: 785421,
                      name: '出入300'
                    }
                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店2',
                  id: 962,
                  gate: [
                    {
                      ifBox: false,
                      id: 998,
                      name: '出入101'
                    },
                    {
                      ifBox: false,
                      id: 987,
                      name: '出入202'
                    },
                    {
                      ifBox: false,
                      id: 952,
                      name: '出入303'
                    }

                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店3',
                  id: 814,
                  gate: [
                    {
                      ifBox: false,
                      id: 836,
                      name: '出入1010'
                    },
                    {
                      ifBox: false,
                      id: 8001,
                      name: '出入2020'
                    },
                    {
                      ifBox: false,
                      id: 8011,
                      name: '出入3030'
                    }

                  ]
                }
              ]
            },
            {
              name: '楼层333',
              ifShow: false,
              id: 412,
              ifBox: false,
              children: [
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店1',
                  id: 63,
                  gate: [
                    {
                      ifBox: false,
                      id: 968,
                      name: '出入100'
                    },
                    {
                      ifBox: false,
                      id: 343,
                      name: '出入200'
                    },
                    {
                      id: 252,
                      ifBox: false,
                      name: '出入300'
                    }
                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店2',
                  id: 121,
                  gate: [
                    {
                      ifBox: false,
                      id: 223,
                      name: '出入101'
                    },
                    {
                      ifBox: false,
                      id: 332,
                      name: '出入202'
                    },
                    {
                      ifBox: false,
                      id: 515,
                      name: '出入303'
                    }

                  ]
                },
                {
                  ifBox: false,
                  ifShow: false,
                  name: '店3',
                  id: 8587,
                  gate: [
                    {
                      ifBox: false,
                      id: 4321,
                      name: '出入1010'
                    },
                    {
                      ifBox: false,
                      id: 15963,
                      name: '出入2020'
                    },
                    {
                      ifBox: false,
                      id: 75321,
                      name: '出入3030'
                    }

                  ]
                }
              ]
            }
          ]
        },
        {
          name: '购物中心1',
          id: 3,
          ifBox: false,
          ifShow: false
        }
      ]
    }
  },
  computed: {
    showText () {
      var text = []
      this.listTest.forEach(function (e) {
        text.push(e.name)
      })
      return text.join(' , ')
    }
  },
  created () {
    this.refreshData()
  },
  methods: {
    refreshData (data) {
    //   this.list1 = data
      getBussinessTree({ id: 1, entity: 52 }).then(res => {
        this.handleListData(res.data.data)
      }).catch(err => {
        console.log(err)
      })
    },
    showList () {
      this.showSelect = !this.showSelect
    },
    selectName (index) {
      var that = this
      if (that.list1[index].ifBox == false) {
        that.list1[index].ifBox = true
        var obj = {}
        obj.name = that.list1[index].name
        obj.id = that.list1[index].id
        that.listTest.push(obj)
      } else {
        that.list1[index].ifBox = false
        that.listTest = _.remove(that.listTest, function (n) {
          return n.id != that.list1[index].id
        })
      }
    },
    handleListData (data) {
      data.forEach(e => {
        e.ifBox = false
        e.ifShow = false
        if (e.children) {
          this.handleListData(e.children)
        }
      })
      this.list1 = data
    },
    shoppingName (index1, index2) {
      var that = this
      if (that.list1[index1].children[index2].ifBox == false) {
        that.list1[index1].children[index2].ifBox = true
        var obj = {}
        obj.name = that.list1[index1].children[index2].name
        obj.id = that.list1[index1].children[index2].id
        that.listTest.push(obj)
      } else {
        that.list1[index1].children[index2].ifBox = false
        that.listTest = _.remove(that.listTest, function (n) {
          return n.id != that.list1[index1].children[index2].id
        })
      }
    },
    floorName (index1, index2, index3) {
      var that = this
      if (that.list1[index1].children[index2].children[index3].ifBox == false) {
        that.list1[index1].children[index2].children[index3].ifBox = true
        var obj = {}
        obj.name = that.list1[index1].children[index2].children[index3].name
        obj.id = that.list1[index1].children[index2].children[index3].id
        that.listTest.push(obj)
      } else {
        that.list1[index1].children[index2].children[index3].ifBox = false
        that.listTest = _.remove(that.listTest, function (n) {
          return n.id != that.list1[index1].children[index2].children[index3].id
        })
      }
    },
    inAndOutName (index1, index2, index3, index4) {
      var that = this
      if (that.list1[index1].children[index2].children[index3].gate[index4].ifBox == false) {
        that.list1[index1].children[index2].children[index3].gate[index4].ifBox = true
        var obj = {}
        obj.name = that.list1[index1].children[index2].children[index3].gate[index4].name
        obj.id = that.list1[index1].children[index2].children[index3].gate[index4].id
        that.listTest.push(obj)
      } else {
        that.list1[index1].children[index2].children[index3].gate[index4].ifBox = false
        that.listTest = _.remove(that.listTest, function (n) {
          return n.id != that.list1[index1].children[index2].children[index3].gate[index4].id
        })
      }
    },
    mouseoveList (index) {
      this.list1[index].ifShow = true
    },
    mouseoutList (index) {
      this.list1[index].ifShow = false
    },
    mouseoveShopping (index1, index2) {
      this.list1[index1].children[index2].ifShow = true
    },
    mouseoutShopping (index1, index2) {
      this.list1[index1].children[index2].ifShow = false
    },
    mouseoveFloor (index1, index2, index3) {
      this.list1[index1].children[index2].children[index3].ifShow = true
    },
    mouseoutFloor (index1, index2, index3) {
      this.list1[index1].children[index2].children[index3].ifShow = false
    },
    queryData () {
      this.showSelect = false
      this.$emit(queryData, this.listTest)
    }
  },
  watch: {
    listTest (newdata, olddata) {
      this.$emit('onChange', newdata)
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-select-selection{
  height: 42px!important;
}
.cd-1{
    display: inline-block;
    position: relative;
    width: 100%;
    .tx{
        width: 300px;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        border:1px solid #D7DFE3;
        border-radius:5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        padding: 0 10px;
        font-size: 14px;
        color: #666;
        float: left;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;

    }
    .query{
        float: left;
        width: 107px;
        height: 46px;
        text-align: center;
        line-height: 46px;
        background-color: #2280D7;
        color: #fff;
        font-size: 16px;
        border:none;
        border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        cursor: pointer;
        margin-left: 30px;
        box-shadow:0px 4px 23px 3px rgba(125,175,221,0.5);
    }

    .list{
        position: absolute;
        left: 0;
        top:40px;
        // width: 600px;
        height: 300px;
        overflow: auto;
        z-index: 99;
        background-color: #fff;
        border-radius: 6px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        box-shadow: 0px 12px 27px 0px rgba(163,190,215,0.5);
        animation: myfirst 0.8s;
        -moz-animation: myfirst 0.8s;	/* Firefox */
        -webkit-animation: myfirst 0.8s;	/* Safari 和 Chrome */
        -o-animation: myfirst 0.8s;
        .list-title{
            overflow: hidden;
            padding: 5px 0;
            display: flex;
            p{
                // float: left;
                height: 22px;
                line-height: 22px;
                color: #7D7878;
                width: 150px;
                text-align: center;
                border-right: 1px solid rgba(215,223,227,1);
                &:last-child{
                    border-right: none;
                }
            }
        }
        .group{
            width: 150px;
            height: auto;
            ul{
                border:1px solid rgba(215,223,227,1);
                border-bottom: none;
                li{
                    list-style: none;
                    width: 100%;
                    height: 35px;
                    background-color: #fff;
                    border-bottom: 1px solid rgba(215,223,227,1);
                    cursor: pointer;
                    padding: 0 10px;
                    font-size: 14px;
                    color: #8E8C8C;
                    input{
                        width: 15px;
                        height: 15px;
                        float: left;
                        margin-top: 10px;
                        margin-right: 10px;
                        cursor: pointer;
                    }
                    span{
                        display: inline-block;
                        line-height: 35px;
                        float: left;
                        width: 89px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        color: #8E8C8C;
                        &:hover{
                            color: #2BD9CF;
                        }
                    }
                    i{
                        float: right;
                        margin-top: 12px;
                        color: #666E75;
                    }
                    .shoppingList{
                        position: absolute;
                        left: 150px;
                        top:32px;
                        width: 150px;
                        background-color: #fff;
                        border:1px solid rgba(215,223,227,1);
                        border-bottom: none;
                        border-left: none;
                        animation: listAnimation 0.8s;
                        -moz-animation: listAnimation 0.8s;	/* Firefox */
                        -webkit-animation: listAnimation 0.8s;	/* Safari 和 Chrome */
                        -o-animation: listAnimation 0.8s;
                        .shoppingListText{
                            width: 150px;
                            height: 35px;
                            padding: 0 10px;
                            border-bottom: 1px solid rgba(215,223,227,1);
                            span{
                                color: #8E8C8C;
                                &:hover{
                                    color:#2BD9CF ;
                                }
                            }
                        }
                    }
                    .listWidth{
                        width: 0 !important;
                        animation: showWidth 0s;
                        -moz-animation: showWidth 0.8s;	/* Firefox */
                        -webkit-animation: showWidth 0.8s;	/* Safari 和 Chrome */
                        -o-animation: showWidth 0.8s;
                    }
                }
            }
        }
    }
    @keyframes myfirst
    {
        0% {opacity: 0.6;height: 0px;overflow: hidden}
        100% {opacity: 1;height:300px;overflow: auto}
    }
    @keyframes listAnimation {
        0% {opacity: 0.6;width: 0px;overflow: hidden}
        100% {opacity: 1;width: 150px;overflow: hidden}
    }
    @keyframes showWidth{
        0% {opacity: 0;width: 0px;overflow: hidden}
        100% {opacity: 0;width: 0px;overflow: hidden}
    }
}
</style>
