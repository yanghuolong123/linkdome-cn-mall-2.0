<template>
  <div class="vip-center" style="position:relative">
  <div v-if="hasCover == 1"  style="position:absolute;left:0;top:0;background:rgba(0, 0, 0, .3);z-index:999;width:100%;height:100%"></div>
      <div class="vip-seach-header">
        <div class="vip-seach-text">
            <Col style="display: inline-block;float:left;width:14%;margin-right:20px;">
              <DatePicker
              type="daterange"
              v-model="selectDates"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 100%"
              ></DatePicker>
            </Col>
            <input type='text' class='vie-model-text'  v-model="searchName" placeholder='姓名'>
            <input type='text' class='vie-model-text' v-model="searchTel" placeholder='手机号'>
            <vs-select class="selectExample" autocomplete placeholder='到店次数'  v-model="searchTimes">
               <vs-select-item :key="index" :value="item.value"  :text="item.text" v-for="(item,index) in timesList" />
            </vs-select>
            <vs-select class="selectExample" autocomplete placeholder='性别'  v-model="searchSex">
               <vs-select-item :key="index" :value="item.value"  :text="item.text" v-for="(item,index) in sexList" />
            </vs-select>
            <div class='button' @click="initData(0)">查询</div>
            <div class='button reset' style="" @click="reset">重置</div>
        </div>
        <div class="vip-header-right">
            <span class="vip-add" @click="addVIP">
              <Icon type="md-add" />
            </span>
            <span class="vip-add" @click="delMoreVIP">
              <Icon type="md-remove" />
            </span>
            <span class="vip-add" >
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
         <div style="clear:both"></div>
      </div>

    <table-multiple-selected
        ref="tableData"
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
import Moment from 'moment'
export default {
  components: {
    TableMultipleSelected,
    VIPEdit,
    alert
  },
  data () {
    return {
      uploadImg: require('@/assets/images/fixation_img/rest/who.webp'),
      showPaginations: false,
      totalCount: 0,
      total: 0,
      current: 0,
      theVIP: '',
      delMore: false,
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      /* 查询条件 */
      searchName: '',
      searchTel: '',
      searchSex: ' ',
      searchTimes: '',
      selectDates: '',
      showVipEdit: false,
      select1: 1,
      pageSize: 5,
      timesList: [
        { text: '1次', value: 1 },
        { text: '2次', value: 2 },
        { text: '3次', value: 3 },
        { text: '4次', value: 4 },
        { text: '5次及以上', value: 5 }
      ],
      sexList: [
        { text: '男', value: '1' },
        { text: '女', value: '0' }
      ],
      searchText: '',
      titleName: '基本信息',
      tableName: [
        '头像', '姓名', '年龄', '性别', '手机号', '到访次数', '最后一次到访', '操作'
      ],
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
        document.getElementsByClassName('vs-pagination--input-goto')[1].value = that.current
      }, 10)
    }
  },
  computed: {
  },
  mounted () {
    this.initData(0)
  },
  methods: {
    reset () {
      this.searchName = ''
      this.searchTel = ''
      this.searchSex = ''
      this.searchTimes = ''
      this.selectDates = []
    },
    changeExport (value) {
      let token = getToken()
      let page = this.current
      let limit = value == 1 ? 5 : 5000
      let name = this.searchName
      let tel = this.searchTel
      let range = this.selectDates.join('-').length > 3 ? Moment(this.selectDates[0]).format('YYYY-MM-DD') + '-' + Moment(this.selectDates[1]).format('YYYY-MM-DD') : ''
      let times = this.searchTimes
      let isNew = ''
      let sex = this.searchSex
      let type = 1
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
      }, 200)
    },
    editVIP (value) {
      this.showVipEdit = true
      var that = this
      setTimeout(function () {
        that.$refs.vipEdit.edit(value.data)
      }, 200)
    },
    delVIP (value) {
      this.alertStart('删除VIP客户', '确认删除此IP客户信息？', true)
      this.theVIP = value.data
      this.delMore = false
    },
    deleteVIP (id, index) {
      var that = this
      delCustomer({ id }).then(res => {
        if (res.data.code == 200) {
          if (!that.delMore) {
            that.alertStart('删除VIP客户', '删除VIP客户成功', false)
            if ((that.totalCount % 5) == 1) {
              --that.current
            }
            that.initData(1)
          } else {
            if (index == that.selected.length - 1) {
              that.alertStart('删除VIP客户', '删除VIP客户成功', false)
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
      this.delMore = true
      if (this.selected.length) {
        this.alertStart('删除VIP客户', '确认删除选中的VIP客户信息？', true)
      } else {
        this.alertStart('删除VIP客户', '请至少选中1条信息', false)
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
    /* 初始化加载VIP顾客数据
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
      let range = this.selectDates.join('-').length > 3 ? Moment(this.selectDates[0]).format('YYYY-MM-DD') + '-' + Moment(this.selectDates[1]).format('YYYY-MM-DD') : ''
      // let range = ''
      let times = this.searchTimes
      let isNew = ''
      let sex = this.searchSex
      let type = 1
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
            e.custom.ismale += ''
            if (e.custom.ismale == '1') {
              temp['gender'] = '男'
            } else if (e.custom.ismale == '0') {
              temp['gender'] = '女'
            } else {
              temp['gender'] = ' '
            }
            temp['isVip'] = e.custom.type == 1 ? '是' : '否'
            temp['times'] = e.custom.daodiancishu + '次'
            temp['remark'] = e.custom.remark
            var time = ' '
            if (e.coming.length > 0) {
              time = e.coming[e.coming.length - 1].time == undefined ? '' : e.coming[0].time
            }
            let record = e.coming.map(function (x) {
              // return x.time + ' ' + x.store + '\n'
              return x.time + ' ' + '\n'
            })
            temp['lastTime'] = time
            temp['record'] = record
            temp.customer_object_id = e.custom.customer_object_id
            temp.operation = true
            ndata.push(temp)
          })
          that.tableData = ndata
        } else if (res.data.code == 308) {
          that.tableData = []
          that.total = 0
        } else {
          alert(res.data.message)
        }
      })
        .catch(function (err) {
          alert(err)
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
.vip-center{
    margin-top:20px;
    .vip-seach-header{
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 9px 1px rgba(175,175,176,0.25);
      border-radius:6px;
      margin-bottom:20px;
      padding: 35px 20px;
      position:relative;
      .vip-seach-text{
        float:left;
        width:100%;
        padding-right:176px;
          .vie-model-text{
              width: 14%;
              float: left;
              border: none;
              height: 50px;
              font-size: 14px;
              border:1px solid rgba(204,204,204,1);
              border-radius:6px;
              padding-left:10px;
              margin-right:20px;
          }
          .ivu-input{
              height:50px;
              font-family: "source_han_sans_cn", "Roboto", sans-serif;
          }
          .button{
            font-family: "source_han_sans_cn", "Roboto", sans-serif;
            margin-top: 8px;
            background-color: #37b5ed;
            width: 84px;
            height: 42px;
            font-size: 1rem;
            text-align: center;
            display: inline-block;
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
          .reset{
            margin-left:20px;
            background-color:#fff;
            color:#37b5ed;
            border: 1px solid #37b5ed;
          }
          .selectExample{
            width:14%;
            margin-right:20px;
            float: left;
            clear: none;
            input{
                height:50px;
            }
          }
      }
      .vip-header-right{
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
    .ivu-select-dropdown{
        z-index:100009;
        left: 0px!important;
    }
    .ivu-dropdown .ivu-select-dropdown {
        z-index: 100009;
        left: 96px !important;
        top: 49px!important;
     }
    .vx-card {
        height: 480px;
    }
    .ivu-dropdown-menu {
      min-width: 64px;
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
    .paginations{
        position: relative;
        text-align: center;
        top: -50px;
    }
    .ivu-input {
      font-size: 14px;
    }
}

</style>
<style>
  .vs-select--item {
    height:22px;
  }
</style>
