<template>
    <div class="vipRecord-edit">
        <div class="vipRecord-edit-bg" ></div>
        <div class="vipRecord-edit-text" id="editText">
            <div class="edit-title">
                {{editTitle}}
            </div>
              <div class="edit-close" v-on:click="closeEdit">
                    <Icon type="md-close" />
                </div>
            <div class="edit-text" >
              <div class="left-img">
                  <div class="oldFace">
                    <img :src="imgOldFace">
                    <p>人脸静态库</p>
                  </div>
                  <div class="newFace">
                    <img :src="imgNewFace">
                    <p>实时采集图</p>
                  </div>
                  <p class="precent" v-if="showPaginations">相似度{{precent}}%</p>
              </div>
              <div class="right-table">
                  <div class="vip-search">
                      <div class="vip-search-text">
                          <Icon size='24' type="ios-search" />
                          <input type="text" v-model="keyword" placeholder="搜索">
                          <Button  @click="init(false)">{{ $t('查询') }}</Button>
                      </div>
                      <div class="control">
                        <Button :disabled="noData" class="clear" @click="clearAll">清空列表</Button>
                        <Button :disabled="noData||allRead" class="read" @click="readAll">全部已读</Button>
                      </div>
                  </div>
                <table-multiple-selected
                    ref="tableData"
                    :titleName ="titleName"
                    :tableName='tableName'
                    :tableList='tableList'
                    @tableSelect="tableSelect"
                >
                </table-multiple-selected>
                <div class="records">共{{totalCount}}条记录  {{VIPNoReadNumber}}条未读</div>
                <div class="paginations" v-if="showPaginations">
                    <vs-pagination  :total="total" v-model="current" goto ></vs-pagination>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { clearAllVipRecord, readVipRecord, getVipRecord } from '@/api/custom.js'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import { log } from 'util'
import { mapState } from 'vuex'

export default {
  props: {
  },
  components: {
    TableMultipleSelected
  },
  data () {
    return {
      number: 0,
      editTitle: '到店提示',
      imgNewFace: require('@/assets/images/pages/imgNewFace.png'),
      imgOldFace: require('@/assets/images/pages/imgOldFace.png'),
      newFace: require('@/assets/images/pages/imgNewFace.png'),
      oldFace: require('@/assets/images/pages/imgOldFace.png'),
      weidu: require('@/assets/images/pages/icon_point_weidu.png'),
      yidu: require('@/assets/images/pages/icon_point_yidu.png'),
      precent: '0',
      tableName: ['头像', '姓名', '年龄', '性别', '手机号', '到店次数', '最近到店记录', '状态'],
      tableList: [],
      allData: [],
      showPaginations: true,
      total: 0,
      totalCount: 0,
      current: 1,
      titleName: 'VIP顾客到店列表',
      limit: 10000,
      keyword: '',
      noData: true,
      allRead: true,
      allIds: '',
      VIPNoRead: '',
      VIPNoReadNumber: 0
    }
  },
  watch: {
    total () {
      // this.showPaginations = this.total>0?true:false;
      this.noData = !(this.total > 0)
    },
    current () {
      var that = this
      var allData = _.cloneDeep(this.allData)
      this.tableList = allData.splice((this.current - 1) * 4, 4)
      setTimeout(() => {
        document.getElementsByClassName('vs-pagination--input-goto')[0].value = that.current
      }, 10)
    },
    tableList () {
      if (!this.tableList.length) {
        this.imgOldFace = this.oldFace
        this.imgNewFace = this.newFace
        this.precent = '0'
      }
    }
  },
  computed: {
    ...mapState({
      menuList:state => state.home.menuList,
    }),
  },
  mounted () {
    let show = false
    if (this.$store.state.user.role_id < 4) {
      show = true
    } else {
      let temp = _.find(this.menulist, ['name', 'Dashboard']).subpagesList
      temp = _.find(temp, ['name', 'VIPRecode']).id + ''
      if (this.$store.state.user.access.indexOf(temp) > -1) {
        show = true
      } else {
        show = false
      }
    }
    if (show) {
      this.init(false)
    }
  },
  methods: {
    closeEdit () {
      this.$emit('closeVIPRecord')
    },
    tableSelect (data) {
      this.imgOldFace = data.imgOldFace
      this.imgNewFace = data.imgNewFace
      this.precent = data.precent
      var VIPNoRead = this.$store.state.user.VIPNoRead
      var userId = this.$store.state.user.userId
      var ids = data.du.split(',').map(Number)
      if (ids.indexOf(userId) == -1 && VIPNoRead > 0) {
        this.read(data.id + '')
        var index = _.findIndex(this.allData, ['id', data.id])
        this.allData[index].status = this.yidu
        --VIPNoRead
        this.VIPNoReadNumber--
        data.du += ',' + userId
      }
      this.$store.commit('setVIPNoRead', VIPNoRead)
      data.status = this.yidu
    },
    clearAll () {
      var that = this
      clearAllVipRecord().then(function (res) {
        that.tableList = []
        that.imgNewFace = _.cloneDeep(that.newFace)
        that.imgOldFace = _.cloneDeep(that.oldFace)
        that.total = 0
        that.precent = '0'
        that.totalCount = 0
        that.VIPNoReadNumber = 0
        that.allRead = true
        that.$store.commit('setVIPNoRead', '')
      })
    },
    readAll () {
      let id = this.allIds
      this.read(id)
      var that = this
      that.tableList.forEach(function (m) {
        m.status = that.yidu
        that.$store.commit('setVIPNoRead', '')
      })
      this.allData.forEach(function (m) {
        m.status = that.yidu
        that.allRead = true
      })
    },
    read (id) {
      readVipRecord({ id }).then(function (res) {
      })
    },
    init (type) {
      let keyword = this.keyword
      if (!type) {
        this.current = 1
        this.total = 1
      }
      let current = this.current
      let limit = this.limit
      var that = this
      var userId = that.$store.state.user.userId
      var allRead = true
      that.VIPNoRead = 0
      // getVipRecord(keyword, current, limit).then(function (res) {
      //   if (res.data.code == 200) {
      //     var count = 0
      //     var data = res.data.data
      //     that.total = Math.ceil((data.count) / 4)
      //     that.allIds = data.strID
      //     var ndata = _.cloneDeep(data.list)
      //     ndata.forEach(function (m, index) {
      //       m.photo = m.avatar
      //       m.age = m.age ? m.age : ' '
      //       m.precent = m.xianshidu ? Math.floor(m.xianshidu * 100) : 0
      //       if (m.ismale != '' && m.ismale != ' ') {
      //         m.gender = m.ismale == 1 ? '男' : '女'
      //       } else {
      //         m.gender = ' '
      //       }
      //       m.times = m.daodiancishu + '次'
      //       m.imgNewFace = m.shishicaijitu ? m.shishicaijitu : that.imgNewFace
      //       m.imgOldFace = m.avatar ? m.avatar : that.imgOldFace
      //       m.lastTime = m.coming_time + ' '
      //       let status = m.du.split(',').map(Number)
      //       if (status.indexOf(userId) > -1) {
      //         status = that.yidu
      //       } else {
      //         status = that.weidu
      //         that.VIPNoRead++
      //         allRead = false
      //       }
      //       m.status = status
      //     })
      //     that.allData = _.cloneDeep(ndata)
      //     that.tableList = ndata.splice((that.currentx - 1) * 4, 4)
      //     that.allRead = allRead
      //     that.totalCount = data.count
      //     that.VIPNoReadNumber = that.VIPNoRead
      //     if (keyword == '') {
      //       that.$store.commit('setVIPNoRead', that.VIPNoRead)
      //     }
      //   } else if (res.data.code = 308) {
      //     if (keyword == '') {
      //       that.$store.commit('setVIPNoRead', that.VIPNoRead)
      //     }
      //     that.tableList = []
      //     that.totalCount = 0
      //     that.total = 0
      //     that.VIPNoReadNumber = 0
      //     // that.$store.commit("setVIPNoRead","")
      //   }
      // })
    }
  }
}
</script>

<style scope lang="scss">
    .vipRecord-edit{

        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 66666;
        .vipRecord-edit-bg{
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: 0.3;
        }
        .vipRecord-edit-text{
            position: absolute;
            left: 16%;
            top:10%;
            width: 78%;
            background-color: #fff;
            background:rgba(255,255,255,1);
            border:1px solid rgba(215,223,227,1);
            box-shadow:1px 2px 10px 0px rgba(193,193,193,0.2);
            border-radius:8px;
            .edit-title{
                width: 100%;
                height: 53px;
                line-height: 53px;
                padding-left: 20px;
                background:rgba(242,242,242,1);
                font-size:18px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(91,89,89,1)
            }
          .edit-text{
              display: flex;
              padding-top: 10px;
              width: 100%;
              .left-img{
                width:30%;
                padding-top:20px;
                display: flex;
                flex-wrap: wrap;
                .oldFace,.newFace{
                  width:50%;
                  padding:0% 2%;
                  img{
                    width: 100%;
                    height:220px;
                    border-radius: 6px;
                  }
                  p{
                    text-align: center;
                  }
                }
                .newFace{
                  padding-left:2%;
                }
                .precent{
                  text-align: center;
                  line-height:60px;
                  height:60px;
                  width:100%;
                  color:#8D7AF8;
                  font-size: 36px;
                }
              }
              .right-table{
                width:70%;
                position: relative;
                .vip-search{
                    width: 96%;
                    height: 56px;
                    background-color: #fff;
                    box-shadow:0px 2px 9px 1px rgba(175,175,176,0.25);
                    border-radius:6px;
                    padding:10px;
                    margin-top:8px;
                    margin-bottom:5px;
                    margin-left:2%;
                    .vip-search-text{
                        width: 252px;
                        height: 100%;
                        border-radius: 6px;
                        border: 1px solid #dcdcdc;
                        padding: 5px;
                        float: left;
                        display: flex;
                        .ivu-icon{
                            float: left;
                        }
                        input{
                            display: inline-block;
                            width: 195px;
                            float: left;
                            border: none;
                            height: 24px;
                            margin-left: 10px;
                            border-left: 1px solid #f5f5f5;
                            padding-left: 10px;
                        }
                        button{
                            margin-left: 56px;
                            border: 1px solid #00a0e9;
                            color: #00a0e9;
                            height: 32px;
                            margin-top: -5px;
                        }
                    }
                    .control{
                        float:right;
                        margin-right: 10px;
                        button{
                            margin-left: 10px;
                            border: 1px solid #00a0e9;
                            color:#00a0e9;
                        }
                    }
                }
                .listName{
                  font-size: 18px;
                  padding-left: 34px;
                }
                .vx-card {
                  box-shadow: none;
                }
                .records{
                  position:absolute;
                  left: 20px;
                }
                .paginations{
                  position:relative;
                  margin-bottom:20px;
                  .vs-pagination--input-goto {
                      width: 46px;
                  }
                }
              }
            }
  }
  .edit-close{
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
    transition: all .23s ease .1s;
    &:hover{
      transform: translate(5px,-5px);
      box-shadow: 0 0 0 0 rgba(0,0,0,.1)
    }
    i{
      font-size: 20px;
    }
  }
  .vx-card .vx-card__collapsible-content img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  }
  .vx-card {
    min-height: 254px;
    .imgStatus {
    border-radius: 0%!important;
    height: 18px!important;
    width: 25px!important;
   }
}
</style>
