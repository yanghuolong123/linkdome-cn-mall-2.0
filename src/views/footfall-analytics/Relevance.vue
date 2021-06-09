<template>
  <div class="relevance">
    <div class="relevance-picker"  >
        <div class="relevance-date-picker">
          <DatePicker
            type="daterange"
            v-model="relevanceDate"
            placement="bottom-end"
            placeholder="选择日期"
           :options="disabledDate"
            style='width:100%;'
          ></DatePicker>
        </div>
        <div style="display: flex;align-items: center">
            <div class="cascade" v-if="isSelected">
                <el-cascader v-model="relevanceValue"
                             class="cascade-dom"
                             collapse-tags
                             popper-class="relevance-cascade-dom"
                             :props="{ multiple: true,expandTrigger:'hover'}"
                             :options="relevanceList">
                </el-cascader>
            </div>
            <div class="cascade" v-else></div>
            <div class="relevance-query" v-on:click="relevanceDataClick">查询 </div>
            <div class="relevance-reset" v-on:click="resetData">重置 </div>
        </div>
    </div>
    <div class="relevance-container">
      <relevance-tab v-model="drainageType" ref="relecanceTotle" :tabs="tabsList"></relevance-tab>
      <vs-row style="margin:20px 0;padding:0 10px">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8">
          <div class="relevance-graph">
            <h3 v-show="isData == true"> 暂无数据</h3>
            <h3 v-show="isTotalData == true">
              实体客流无关联
              <!-- <div></div>
              <p>转化率为0</p> -->

            </h3>
            <!-- <h1>关联关系
              <Tooltip  :content="tootipText"  placement="right" theme="light" transfer max-width="400">
                <icons type="wenhao"/>
              </Tooltip>
            </h1> -->
            <!-- <vs-select
              placeholder="选择关联"
              autocomplete
              class="chartSelect"
              v-model="chartSelectModel"
            >
              <vs-select-item
              :value="item.value"
              :text="item.text"
              :key="index"
              v-for="(item,index) in selectChartType"
              />
            </vs-select> -->

            <div class="relevance-svg">
              <div class="relevance-left">
                <dependencywheel
                v-bind:class="{dependencywheelAction:drainageType==0}"
                class="relevanceChart"
                ref='graph'
                v-show="isData == false&&isTotalData==false"
                >
                </dependencywheel>
                <div id="d3Chart"
                v-bind:class="{d3ChartChartaAction:drainageType==1}"
                class="relevanceChart"
                v-show="isData == false&&isTotalData==false"
                style="margin:-15px 0 0 -15px"
                ></div>
              </div>
              <ul class='d3NameList'>
                <li :key="index" v-for="(item,index) in d3NameList">
                  <span :style="{backgroundColor:item.color}"></span>
                  <p>{{item.name}}</p>
                </li>
              </ul>
            </div>
          </div>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center"  vs-w="4">
          <div v-if="isStoreData" class="storeData">
            <div class="storeClose" v-on:click="showStore">
              <icons type="zhuanchu" :size='22'   color="rgb(34, 128, 215)"></icons>
            </div>
            <ul>
              <li :key="index" v-for="(item,index) in storeDataList">
                <h3>{{item.name}}</h3>
                <div class="list">
                  <div class="list-data" :key="index" v-for="(list,index) in item.list">
                    <div class="list-icon">
                      <icons type="dianpu-copy" :size='28'   color="rgb(249, 161, 67)"></icons>
                    </div>
                    <div class="list-number">
                      <p>
                        <span>{{item.source}}</span>
                        <span class="img-connectors"></span>
                        <span>{{item.target}}</span>
                      </p>
                      <p>{{list.number}}</p>
                    </div>
                  </div>
                  <div style="clear:both"></div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="relevanceTOP3">
            <h3>关联度TOP3：</h3>
            <h4 v-if="isData == true">
              <ul>
                <li>暂无数据</li>
                <li>暂无数据</li>
                <li>暂无数据</li>
              </ul>
            </h4>
            <ul v-else>
              <li :key="index" v-for="(item,index) in relevanceTOP3List">
                <div class="li-icon">
                  <icons type="dianpu-copy" :size='28'   color="rgb(249, 161, 67)"></icons>
                </div>
                <div class="li-data">
                  <p>
                    <span>{{item.name}}</span>
                    <span class="img-connector" v-if='drainageType==0'></span>
                    <span class="img-connectors" v-else></span>
                    <span>{{item.type}}</span>
                  </p>
                  <p>{{item.number}}%</p>
                </div>
              </li>
            </ul>
          </div>
        </vs-col>
      </vs-row>
      <vs-row style='padding:0 10px;'>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
          <div class="relevance-table">
            <!-- 关联度排行 -->
            <table-default :tableTitle='relevanceTitle' :tableName='tableName'  :tableList='relevanceSeniority'></table-default>
          </div>
        </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
          <div class="relevance-table">
            <!-- 转化量排行 -->
            <table-default :tableTitle='changeTitle' :tableName='changeTableName'  :tableList='changeTableList'></table-default>
          </div>
        </vs-col>
      </vs-row>
    </div>
     <div class="chart-text" :style='{left:svgLeft+"px",top:svgTop+"px",opacity:svgOpacity}'>
        {{chareSvg}} </br> {{chareSvgTwo}}
      </div>
  </div>
</template>
<script>
import relevanceTab from './components/components/RelevanceTab'
import dependencywheel from '@/components/charts/dependency.vue'
import TableDefault from '../ui-elements/table/TableDefault.vue'
import { getBussinessTree, getBussinessCommon } from '@/api/passenger.js'
import { relevanceData, directionData } from '@/api/analysis'
import moment from 'moment'
import _ from 'lodash'
import { disabledDate } from '@/libs/util.js'
import { d3Chaer, formatCascadeAuthData, tableDataList, svgChord } from '@/libs/relevance.js'

export default {
  name: 'relevance',
  components: {
    dependencywheel,
    TableDefault,
    relevanceTab
  },
  data () {
    return {
      isSelected: false,
      drainageType: '',
      tabsList: [
        {
          value: 0,
          label: '关联关系无序图',
          tootipText: '无序图：两个实体的客流关联程度，不具有方向性'
        },
        {
          value: 1,
          label: '关联关系有序图',
          tootipText: '有序图：从一个实体到另外一个实体的客流关联程度，具有方向性'
        }],
      // tootipText: '有序图： 从一个实体到另外一个实体的客流关联程度，具有方向性\n无序图：两个实体的客流关联程度，不具有方向性',
      allTotalData: 0,
      selectAll: 0,
      isTotalData: false,
      isData: true,
      chareSvg: '',
      chareSvgTwo: '',
      svgLeft: 0,
      svgTop: 0,
      svgOpacity: 0,
      relevanceValue: [],
      relevanceList: [],
      relevanceTitle: '关联度排行',
      changeTitle: '转化量排行',
      sourceTitle: '来源排行',
      tableName: ['来源实体', '目的实体', '关联度'],
      // 转换量
      changeTableName: ['来源实体', '目的实体', '转换量'],
      changeTableList: [],
      disorderChangeTable: [],
      orderlyChangeTable: [],

      relevanceSeniority: [],
      orderlyRelevancyRanking: [],
      disorderRelevancyRanking: [],
      sourceSeniority: [],
      relevanceDate: [],
      listData: [],
      d3NameList: [],
      disabledDate: '',
      relevanceTOP3List: [],
      isStoreData: false,
      storeDataList: []
    }
  },
  watch: {
    'relevanceList' (newval, old) {
    },
    '$store.state.home.headerAction' () {
      this.resetData()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'Relevance') {
        this.allZoneList()
        this.drainageType = 0
      }
    },
    'drainageType' () {
      this.isStoreData = false
      if (this.drainageType == 0) {
        // 转化量
        this.changeTableList = this.disorderChangeTable
        // 关联度
        this.relevanceSeniority = this.disorderRelevancyRanking
        this.tableName = ['实体名称', '实体名称', '关联度']
        this.changeTableName = ['实体名称', '实体名称', '转换量']
      } else {
        // 转化量
        this.changeTableList = this.orderlyChangeTable
        // 关联度
        this.relevanceSeniority = this.orderlyRelevancyRanking
        this.tableName = ['来源实体', '目的实体', '关联度']
        this.changeTableName = ['来源实体', '目的实体', '转换量']
      }
      // 来源前3排行
      this.relevanceTOP3List = _.take(this.relevanceSeniority, 3).map(list => {
        return {
          name: list.name,
          type: list.type,
          number: list.percent
        }
      })

      try {
        let type = this.drainageType == 0 ? '无序图' : '有序图'
        window.TDAPP.onEvent('店铺关联页面', type + '选择', { })
      } catch (error) {
        console.log('店铺关联页面-' + type + '选择' + '埋点error:' + error)
      }
    }
  },
  created () {
    this.disabledDate = disabledDate
  },
  mounted () {
    var date = new Date()
    date = date.setDate(date.getDate() - 1)
    var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
    this.relevanceDate = dateTime
    this.allZoneList()
    d3Chaer(this, [], [], [])
  },
  methods: {
    // 所有店铺 区域 列表
    allZoneList () {
      this.isSelected = false
      let propertyId = this.$store.state.home.headerAction
      getBussinessTree({ entity: 52, without: 502 }).then(res => {
        const cascadeAuthData = res.data.data.filter(o => { return o.property_id === propertyId })// 找到当前购物中心的treeData
        formatCascadeAuthData(this, cascadeAuthData)
        this.isSelected = true
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击查询
    relevanceDataClick () {
      this.listData = []
      let time = moment(this.relevanceDate[0]).format('YYYY-MM-DD') + ',' +
      moment(this.relevanceDate[1]).format('YYYY-MM-DD')
      if (this.relevanceValue.length <= 1) {
        alert('请选择最少两个实体')
        return false
      }
      let ListId = _.clone(this.relevanceValue)
      let bzid = ListId.map(o => { return o[1] }).join(',')
      this.$refs.relecanceTotle.flowType = 0
      Promise.all([
        relevanceData({ bzid, time }),
        directionData({ time, bzid })
      ]).then(res => {
        this.relevanceSeniority = []
        this.changeTableList = []
        this.d3NameList = []
        // 无序
        let data1 = res[0].data.data
        this.isData = false
        tableDataList(this, data1)
        // 有序
        var data2 = res[1].data.data
        svgChord(this, data2)
      }).catch(err => {
        console.log(err)
      })

      try {
        let arr = []
        this.relevanceValue.map(item => {
          this.relevanceList.map(list => {
            if (list.id == item[0]) {
              list.children.map(val => {
                if (val.id == item[1]) {
                  arr.push(list.label + '/' + val.label)
                }
              })
            }
          })
        })
        window.TDAPP.onEvent('店铺关联页面', '数据查询', { '时间段': time, '实体选择': arr.join(',') })
      } catch (error) {
        console.log('店铺关联页面-' + '数据查询' + '埋点error:' + error)
      }
    },
    // 重置选择
    resetData () {
      var date = new Date()
      date = date.setDate(date.getDate() - 1)
      var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
      this.relevanceDate = dateTime
      this.relevanceValue = []

      try {
        window.TDAPP.onEvent('店铺关联页面', '重置', {})
      } catch (error) {
        console.log('店铺关联页面-' + '重置-埋点error:' + error)
      }
    },
    showStore () {
      this.isStoreData = false
    }
  }
}
</script>
<style lang="less">
.relevance{
  .ivu-date-picker .ivu-select-dropdown{
    z-index:90000
  }
}
.relevance-cascade-dom /deep/ .el-scrollbar:nth-child(1) .is-disabled {
    /*display: none;*/
}
.relevance-date-picker{
  .ivu-date-picker{
    input{
      height: 43px;
      font-size: 14px;
      border: 1px solid rgba(0,0,0,.2);
    }
    i{
      height: 43px;
      line-height: 43px;
    }
  }
}
.chart-text{
  position: fixed;
  background-color: rgba(0,0,0,.5);
  width: auto;
  height: auto;
  padding: 10px 15px;
  color: #fff;
  font-size: 14px;
  border-radius:5px;
  opacity: 0;
}
.cascade{
  .el-cascader__tags {
    top: 10px;
    transform: translateY(0%);
  }
}

.relevance-table{
    width: 100%;
    height:640px;
  .vx-card{
    height: 100%;
    .vs-con-loading__container{
      height: 587px!important;
      overflow: auto!important;
    }
  }
}

</style>
<style lang="less" scoped>
  .vs-col{
    padding: 0;
    padding-right: 20px;
    &:nth-child(2){
      padding-right: 0;
      padding-left: 0px;
    }
  }
  .relevance /deep/ .el-input__inner{
    border: none;
  }
  .relevance{
    width: 100%;
    height: auto;
    .relevance-picker{
      padding: 18px 16px 18px 30px;
      border: 1px solid #dcdee2;
      border-color: #e8eaec;
      background-color: #fff;
      overflow: hidden;
      box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
      border-radius: 6px;
      .cascade{
          width: 230px;
          height: 43px;
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, .2);
          .cascade-dom{
              width: 100%;
              background-color: #fff;
              /*height: 43px;*/
              overflow: hidden;
              border: 0;

              input {
                  border: none;
                  font-size: 1rem;
                  background-color: #fff;
              }
          }
      }
      .relevance-date-picker{
          width:230px;
          margin-bottom: 20px;

      }
      .ivu-date-picker{
          margin-top: 5px;
          input{
              height: 43px;
          }

      }
      .selectExample{
          width: 230px;
          float: left;
      }
      .relevance-query{
        display:inline-block;
        padding: .75rem 2rem;
        border-radius: 6px;
        background: rgba(55,181,237,1)!important;
        border: 1px solid rgba(55,181,237,1);
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        margin-left: 30px;
        &:hover{
          box-shadow: 0 8px 25px -8px rgba(55,181,237,1);
          color: #fff;
        }
      }
      .relevance-reset{
        display:inline-block;
        padding: .75rem 2rem;
        border-radius: 6px;
        background: #fff;
        border: 1px solid rgba(55,181,237,1);
        color: rgba(55,181,237,1);
        font-size: 1rem;
        cursor: pointer;
        margin-left: 30px;
        &:hover{
          box-shadow: 0 8px 25px -8px rgba(55,181,237,1);
        }
      }
    }
    .relevance-graph{
        width: 100%;
        position: relative;
        height: 100%;
        overflow: hidden;
        box-shadow: 0px 0px 8px 1px rgba(166, 167, 167, .3);
        border-radius: 6px;
        background-color: #fff;
        .relevanxe-icon{
          display: inline-block;
          position: absolute;
          right: 20px;
          top: 1.5rem;
          span{
            cursor: pointer;
            margin-left: 10px;
          }
        }
        h1{
            font-size: 18px;
            width: 100%;
            padding-left: 19px;
            padding-top: 27px;

        }
        h3{
            position: absolute;
            left: 0;
            top: 280px;
            text-align: center;
            width: 100%;
            font-size: 24px;
            color: #515a6e;
            font-weight: 400;
            div{
              width: 200px;
              height: 200px;
              background-color: hsla(0,0%,92.2%,.85);
              border-radius: 50%;
              position: absolute;
              left: 50%;
              top: 50%;
              margin-top: -100px;
              margin-left: -100px;
            }
            p{
              position: absolute;
              left: 0;
              width: 100%;
              text-align: center;
            }
        }

    }
    .relevance-table-list{
      width: 100%;
      height: 587px;
      overflow: auto;
    }

    .relevanceTOP3{
      position: relative;
      width: 100%;
      height: auto;
      h3{
        font-size: 24px;
        color: #000;
        padding-top:10px;
      }
      h4{
        ul{
          width: 100%;
          height: auto;
          li{
            display: block;
            width: 100%;
            height: 134px;
            text-align: center;
            padding: 0;
            font-size: 24px;
            color: #515a6e;
            font-weight: 400;
            background-color: #fff;
            box-shadow: 0px 0px 8px 1px rgba(166, 167, 167, .3);
            border-radius: 6px;
            line-height: 134px;
          }
        }
      }
      ul{
        display: block;
        width: 100%;
        height: auto;
        margin-top: 20px;
        li{
          display: flex;
          width: 100%;
          height: auto;
          background-color: #fff;
          margin-bottom: 20px;
          padding: 30px 50px;
          overflow: hidden;
          border-radius: 6px;
          box-shadow: 0 0 9px 0 rgba(166,168,169,.4);
          .li-icon{
            width: 60px;
            height: 60px;
            background-color:rgba(249, 161, 67,.3);
            border-radius: 50%;
            text-align: center;
            line-height: 60px;
            margin-top: 10px;
          }
          .li-data{
            margin-left: 10%;
            p{
              font-size: 18px;
              color: #2b2a2a;
              font-weight: bold;
              &:nth-child(2){
                margin-top: 20px;
                color: #3e3c3c;
                font-weight: 400;
              }
            }
          }
        }
      }
    }
    .storeData{
      width: 100%;
      height: auto;
      position: relative;
      .storeClose{
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
      }
      ul{
        display: block;
        margin-top: 35px;
        li{
          display: block;
          margin-bottom: 30px;
          h3{
            font-size: 22px;
            color: #000;
            margin-bottom: 20px;
          }
          .list{
            width:100%;
            height: auto;

            .list-data{
              display: flex;
              width: 48%;
              float: left;
              border-radius: 6px;
              background-color: #fff;
              border: 1px solid rgb(233, 233, 233);
              box-shadow: 0 0 9px 0 rgba(166,168,169,.4);
              padding: 20px 30px;
              &:nth-child(2){
                float:right;
              }
              .list-icon{
                width: 40px;
                height: 40px;
                background-color:rgba(249, 161, 67,.3);
                border-radius: 50%;
                text-align: center;
                line-height: 40px;
                margin-top: 10px;
              }
              .list-number{
                margin-left: 15%;
                p{
                  font-size: 16px;
                  color: #2b2a2a;
                  font-weight: bold;
                  &:nth-child(2){
                    margin-top: 10px;
                    color: #3e3c3c;
                    font-weight: 400;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .relevance-svg{
      margin-top:10px;
      position: relative;
      width: 100%;
      height: 600px;
      .relevance-left{
        width: 560px;
        height: auto;
        margin-left: 10%;
      }
      // text-align: center;
      .d3NameList{
        position: absolute;
        right: 10px;
        top:80px;
        width: 25%;
        height: 500px;
        overflow: auto;
        li{
          min-width: fit-content;
          float: left;
          height: auto;
          overflow: hidden;
          margin-bottom: 20px;
          margin-right: 10px;
          white-space : nowrap ;
          span{
            display: inline-block;
            float: left;
            width:15px;
            height:15px;
            border-radius: 50%;
            margin-right: 5px;

          }
          p{
            position: relative;
            display: inline-block;
            float: left;
            font-size: 12px;
            color: #666;
          }
        }
      }
  }
  .chartSelect{
    position: absolute;
    right: 19px;
    top: 27px;
    width: 200px;
    z-index: 60;
  }
  .relevanceChart{
  transform: translateY(100%)
  }
  .dependencywheelAction{
  transform: translateY(0%)
  }
  .d3ChartChartaAction{
  transform: translateY(-95%)
  }
  .img-connector{
    display: inline-block;
    width: 25px;
    height: 25px;
    margin:0 5px -5px;
    background: url('../../assets/images/pages/qiehuan.webp');
    background-size: 100% 100%;
  }
   .img-connectors{
    display: inline-block;
    width: 25px;
    height: 25px;
    margin:0 5px -5px;
    background: url('../../assets/images/pages/single.webp');
    background-size: 100% 100%;
  }
  .relevance-container{
    margin:20px 0;
    box-shadow: 0 0 17px 1px rgba(166,167,167,.28);
    border-radius: 6px;
    background: #f5f5f7;
    padding-bottom:20px;
  }
</style>
