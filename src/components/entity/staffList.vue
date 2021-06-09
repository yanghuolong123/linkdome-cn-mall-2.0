<template>
  <div class="staff-center" style="position:relative">
    <div v-if="hasCover == 1" style="position:absolute;left:0;top:0;background:rgba(0, 0, 0, .3);z-index:999;width:100%;height:100%"></div>
      <div class="stall-seach-header">
        <div class="staff-seach-text">
            <input type='text' class='vie-model-text'  v-model="searchName" placeholder='姓名'>
            <input type='text' class='vie-model-text' v-model="searchTel" placeholder='手机号'>
            <div class='button' @click="initData(0)">查询</div>
        </div>
        <div class="stall-header-right">
            <span class="stall-add" title="添加" @click="addVIP">
              <Icon type="md-add" />
            </span>
            <span class="stall-add" title="删除" @click="delMoreVIP">
              <Icon type="md-remove" />
            </span>
            <span class="stall-add" title="上传">
             <Icon type="md-arrow-up" />
            </span>
            <Dropdown trigger="click"  @on-click="changeExport">
              <span class="vip-add" >
                <Icon type="md-arrow-down" />
              </span>
              <DropdownMenu slot="list">
                  <DropdownItem :name=1>当前</DropdownItem>
                  <DropdownItem :name=2>全部</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </div>
      </div>

    <table-multiple-selected
      :tableName='tableName'
      :tableList='tableData'
      :titleName='titleName'
      @tableData='editVIP'
      @removeData='delVIP'
      @tableSelect="tableSelect"
      :isMultiple='true'
    >
    </table-multiple-selected>
    <div class="paginations" v-if="showPaginations">
      <vs-pagination  :total="total" v-model="current" goto ></vs-pagination>
    </div>
    <VIPEdit
      v-if="showVipEdit"
      ref="vipEdit"
      @alertMessage="alertMessage"
      @closeEdit="closeEdit">
    </VIPEdit>
    <alert
      v-if="isAlert"
      @closeAlert ='closeAlert'
      @alertConfirm ='alertConfirm'
      :alertText='alertText'
    ></alert>
  </div>

</template>

<script>
import { getToken } from '@/libs/util'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import VIPEdit from '_c/vip-manage/vip-edit.vue'
import alert from '@/components/alert.vue'
import { getCustomer, delCustomer, exportExcel } from '@/api/custom.js'
import { setTimeout } from 'timers'
export default {
  components: {
    TableMultipleSelected,
    alert,
    VIPEdit
  },
  data () {
    return {
      theClerk: '',
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      searchName: '',
      searchTel: '',
      totalCount: 0,
      total: 0,
      pageSize: 5,
      current: 0,
      showVipEdit: false,
      showPaginations: false,
      titleName: '工作人员列表',
      tableName: ['头像', '姓名', '年龄', '性别', '手机号', '操作'],
      tableData: [],
      selected: [],
      baseurl: process.env.NODE_ENV === 'production' ? '/api/v1/' : 'http://192.168.3.36:8099/api/v1/'
    }
  },
  watch: {
    total () {
      this.showPaginations = this.total > 0
    },
    current () {
      var that = this
      this.initData(1)
      setTimeout(() => {
        document.getElementsByClassName('vs-pagination--input-goto')[0].value = that.current
      }, 10)
    }
  },
  computed: {
  },
  mounted () {
    this.initData(0)
  },
  methods: {
    changeExport (value) {
      let token = getToken()
      let page = this.current
      let limit = value == 1 ? 5 : 5000
      let name = this.searchName
      let tel = this.searchTel
      let range = ''
      let times = ''
      let isNew = ''
      let sex = ''
      let type = 3
      window.open(this.baseurl + 'excel?page=' + page + '&limit=' + limit + '&name=' + name + '&tel=' + tel + '&range=' + range +
      '&times=' + times + '&isNew=' + isNew + '&sex=' + sex + '&type=' + type + '&token=' + token)
    },
    exportExcel () {
      exportExcel().then(res => {
      })
    },
    closeEdit () {
      this.showVipEdit = false
    },
    addVIP () {
      this.showVipEdit = true
      var that = this
      setTimeout(function () {
        that.$refs.vipEdit.modify = false
        that.$refs.vipEdit.type = 'clerk'
      }, 200)
    },
    editVIP (value) {
      this.showVipEdit = true
      var that = this
      setTimeout(function () {
        that.$refs.vipEdit.modify = false
        that.$refs.vipEdit.edit(value.data)
        that.$refs.vipEdit.type = 'clerk'
      }, 200)
    },
    delVIP (value) {
      this.alertStart('删除店员', '确认删除此店员信息？', true)
      this.theVIP = value.data
      this.delMore = false
    },
    deleteVIP (id, index) {
      var that = this
      delCustomer({ id }).then(res => {
        if (res.data.code == 200) {
          if (!that.delMore) {
            that.alertStart('删除店员', '删除店员成功', false)
            if ((that.totalCount % 5) == 1) {
              --that.current
            }
            that.initData(1)
          } else {
            if (index == that.selected.length - 1) {
              that.alertStart('删除店员', '删除店员成功', false)
              that.initData(0)
              that.$store.tableData.selected = []
            }
          }
        }
      })
    },
    tableSelect (value) {
      this.selected = value
    },
    delMoreVIP () {
      var that = this
      this.delMore = true
      var selected = this.selected
      if (selected.length) {
        that.alertStart('删除店员', '确认删除选中的店员信息？', true)
      } else {
        that.alertStart('删除店员', '请至少选中1条信息', false)
      }
    },
    closeAlert () {
      this.isAlert = false
    },
    alertMessage (value, alertText) {
      this.showVipEdit = alertText.show
      this.isAlert = value
      this.alertText = alertText
      this.initData(1)
    },
    alertConfirm (value) {
      var that = this
      if (value === true) {
        that.isAlert = false
        if (that.delMore) {
          var selected = this.selected
          selected.forEach(function (m, index) {
            that.deleteVIP(m.id, index)
          })
        } else {
          var id = that.theVIP.id
          that.deleteVIP(id, 0)
        }
      } else {
        this.isAlert = false
      }
    },
    /* 初始化加载店员数据
    *@method initData
    *@param {int} initType 0:查询第一页的数据;1:查询当前页码的数据
    *@return null
    */
    initData (initType) {
      if (initType == 0) {
        this.current = 1
      }
      let page = this.current
      let limit = this.pageSize
      let name = this.searchName
      let tel = this.searchTel
      let range = ''
      let times = ''
      let isNew = ''
      let sex = ''
      let type = 3
      var that = this
      getCustomer({ page, limit, name, tel, range, times, isNew, sex, type }).then(res => {
        if (res.data.code == 200) {
          var data = res.data.data
          var ndata = []
          that.totalCount = data.count
          that.total = Math.ceil(data.count / 5)
          data.list.forEach(function (e) {
            let temp = {}
            if (e.custom.avatar == undefined || e.custom.avatar == null) {
              e.custom.avatar = ''
            }
            temp['photo'] = e.custom.avatar ? e.custom.avatar : that.uploadImg
            temp['name'] = e.custom.name
            temp['id'] = e.custom.id
            temp['age'] = e.custom.age ? e.custom.age : ' '
            temp['mobile'] = e.custom.mobile
            temp['gender'] = e.custom.ismale == 1 ? '男' : '女'
            temp['isVip'] = e.custom.type == 1 ? '是' : '否'
            temp['time'] = e.coming.length + '次'
            temp['remark'] = e.custom.remark
            var time = ' '
            if (e.coming.length > 0) {
              time = e.coming[e.coming.length - 1].time == undefined ? '' : e.coming[0].time
            }
            let record = e.coming.map(function (x) {
              return x.time.replace(',', '') + ' ' + x.store + '\n'
            })
            temp['lastTimes'] = time
            temp['record'] = record
            temp.operation = true
            ndata.push(temp)
          })
          that.tableData = ndata
        } else if (res.data.code == 308) {
          that.tableData = []
        }
      })
        .catch(function (err) {
          console.log(err)
        })
    },
    alertStart (title, text, confirm) {
      this.isAlert = true
      this.alertText = {
        bg: '#00A0E9',
        title: title,
        text: text,
        confirm: confirm
      }
    }
  }

}
</script>
<style scope lang="scss">
.staff-center{
    margin-top:30px;
    .stall-seach-header{
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 9px 1px rgba(175,175,176,0.25);
      border-radius:6px;
      margin-bottom:20px;
      padding: 35px 20px;
      overflow:hidden;
      .staff-seach-text{
        float:left;
          input{

              width: 250px;
              float: left;
              border: none;
              height: 50px;
              font-size: 14px;
              border:1px solid rgba(204,204,204,1);
              border-radius:6px;
              padding-left:10px;
              margin-right:20px;
          }
          .button{
            margin-top: 8px;
            background-color: #37b5ed;
            width: 84px;
            height: 42px;
            font-size: 1rem;
            text-align: center;
            float: left;
            -webkit-transition: all .2s ease;
            transition: all .2s ease;
            padding: 10px;
            border: 0;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            color: #fff;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            &:hover{
              box-shadow: 0 8px 25px -8px #00a0e9;
            }
          }
      }
      .stall-header-right{
          position:absolute;
          right:20px;
          top:43px;
        span{
            display: inline-block;
            float: left;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            text-align: center;
            line-height: 19px;
            font-size: 16px;
            color: #fff;
            margin-left: 20px;
            cursor: pointer;
            margin-top: 9px;
            background-color: #00A0E9;
            &:nth-child(1){
              margin-top: 9px;
              background-color: #2BD9CF;
            }
            &:nth-child(2){
              margin-top: 9px;
              background-color: #FEB33D;
            }
        }
      }
    }
    .ivu-dropdown .ivu-select-dropdown {
        z-index: 100009;
        left: 133px !important;
        top: 49px!important;
        width:64px;
     }
     .ivu-dropdown-menu {
          min-width: 64px;
      }
    .vx-card {
      height:480px;
    }
    .paginations{
        position: relative;
        text-align: center;
        top: -50px;
    }
     .vx-card .vx-card__collapsible-content {
        img{
            width: 38px;
            height: 38px;
            border-radius: 50%;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
        }
    }
}

</style>
