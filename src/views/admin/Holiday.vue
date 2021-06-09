<template>
    <div class="holiday">
        <div class="headerSelect">
<!--          <div class="account-add-remove" title="添加">-->
<!--                <span class="account-add" @click="addData">-->
<!--                    <Icon type="md-add" />-->
<!--                </span>-->
<!--            </div>-->
            <vs-select class="selectExample"  autocomplete v-model="selectYear">
                <vs-select-item :key="index" :value="item.value" :text="item.key" v-for="(item,index) in years" />
            </vs-select>
        </div>
        <div class="holidayTable">
            <TableMultipleSelected class="tables" :titleName="titleName" :tableName='tableName' :tableList="showHolidays" >

            </TableMultipleSelected>
            <div class="paginations">
                <vs-pagination  :total="holidayTotal" v-model="currentx" goto ></vs-pagination>
            </div>
        </div>
        <div class="holidayTable">
             <div class="account-add-remove" >
                <span class="account-add" @click="addData" title="添加">
                    <Icon type="md-add" />
                </span>
                <span class="account-add" title="删除" @click="deleteMultiple">
                    <Icon type="md-remove" />
                </span>
            </div>
            <TableMultipleSelected class="tables" @tableData='tableData' @removeData='removeData'  @tableSelect="tableSelect"
                :isMultiple='true' :titleName = "titleName2" :tableName='tableName2' :tableList="showEvents" >
            </TableMultipleSelected>
            <div class="paginations">
                <vs-pagination  :total="eventTotal" v-model="currentActive" goto ></vs-pagination>
            </div>
        </div>
        <holidayEdit
            ref = "editActive"
            v-if="isEdit"
            @initData="initData"
            @closeEdit="closeEdit"
            @editData="editData"
            @showAlert="showAlert"
        ></holidayEdit>
        <alert
            v-if="isAlert"
            @closeAlert ="closeAlert"
            @alertConfirm ="alertConfirm"
            :alertText="alertText"
        ></alert>
    </div>
</template>

<script>
import Moment from 'moment'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import alert from '@/components/alert.vue'
import holidayEdit from '@/components/holiday-manage/holiday-edit.vue'
import { getActiveDays, addActiveDays, updateActiveDays, deleteActiveDays } from '@/api/manager.js'
import { yearList } from '@/libs/util.js'
export default {
  components: {
    TableMultipleSelected,
    holidayEdit,
    alert
  },
  data () {
    return {
      titleName: '节假日活动管理',
      tableName: ['节假日名称', '开始时间', '结束时间', '持续时间'],
      titleName2: '活动管理',
      tableName2: ['节假日名称', '活动归属', '目标客流', '开始时间', '结束时间', '持续时间', '操作'],
      showHolidays: [],
      showEvents: [],
      holidayAllData: [],
      eventAllData: [],
      selectYear: new Date().getFullYear(),
      holidayTotal: 1,
      eventTotal: 1,
      currentx: 1,
      currentActive: 1,
      years: [],
      isEdit: false,
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      id: '',
      currentPropertyId: '',
      selected: [],
      deleteSelect: 'multiple'
    }
  },
  watch: {
    '$store.state.home.headerAction' () { // 监听是否切换购物中心
      this.currentPropertyId = this.$store.state.home.headerAction
      this.initData(21, true)// 刷新节假日活动数据
    },
    currentx (val) { // 监听节假日表格页码
      var data = _.cloneDeep(this.holidayAllData)
      this.showHolidays = data.splice((this.currentx - 1) * 5, 5)
      this.$nextTick(() => {
        document.getElementsByClassName('vs-pagination--input-goto')[1].value = val
      })
    },
    currentActive (val) { // 监听活动表格页码
      var data = _.cloneDeep(this.eventAllData)
      this.showEvents = data.splice((this.currentActive - 1) * 5, 5)
      this.$nextTick(() => {
        document.getElementsByClassName('vs-pagination--input-goto')[2].value = val
      })
    },
    selectYear: {// 切换年份
      handler (newVal, oldVal) {
        if (newVal) {
          this.initData(20, true)
          this.initData(21, true)
        }
      },
      immediate: false
    }
  },
  mounted () {
    this.currentPropertyId = this.$store.state.home.headerAction
    this.years = yearList()
    // this.selectYear = Moment().year()
    this.initData(20, true)
    this.initData(21, true)
  },
  methods: {
    // 编辑活动
    editData () {
      this.isEdit = false
    },
    // 新增活动
    addData () {
      this.isEdit = true
      var data = {
        name: '',
        begin: '',
        end: '',
        description: ''
      }
      var that = this
      var checklist = that.$store.state.user.checklist
      this.$nextTick(() => {
        that.$refs.editActive.isAlert = false
        that.$refs.editActive.datas = data
        that.$refs.editActive.isUpdate = false
        that.$refs.editActive.msgTitle = '添加活动'

        if (that.$store.state.user.role_id < 3) {
          that.$refs.editActive.showBelong = true
        } else {
          that.$refs.editActive.showBelong = checklist.length > 1
          if (!that.$refs.editActive.showBelong) {
            that.$refs.editActive.datas.property = Number(that.$store.state.home.headerAction)
          }
        }
      })
    },
    closeEdit () {
      this.isEdit = false
    },
    closeAlert () {
      this.isAlert = false
    },
    showAlert (show, color, title, text, confirm) {
      var that = this
      that.isAlert = show
      that.alertText.bg = color
      that.alertText.title = title
      that.alertText.text = text
      that.alertText.confirm = confirm
    },
    tableData (value) {
      this.isEdit = true
      var that = this
      var checklist = that.$store.state.user.checklist
      this.$nextTick(() => {
        that.$refs.editActive.isAlert = false
        that.$refs.editActive.datas = _.cloneDeep(value.data)
        that.$refs.editActive.datas.property = that.$refs.editActive.datas.property_id
        that.$refs.editActive.isUpdate = true
        that.$refs.editActive.msgTitle = '编辑活动'

        if (that.$store.state.user.role_id < 3) {
          that.$refs.editActive.showBelong = true
        } else {
          that.$refs.editActive.showBelong = checklist.length > 1
        }
      })
    },
    alertConfirm (value) {
      var that = this
      if (value == true) {
        that.isAlert = false
        if (this.deleteSelect == 'single') {
          var id = this.id
          deleteActiveDays(id).then(function (res) {
            if (res.data.code === 200) {
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '删除活动管理'
              that.alertText.text = '删除成功'
              that.alertText.confirm = false
              that.initData(21, false)
            } else {
              alert(res.data.message)
            }
          })
        } else {
          let curLe = this.selected.length
          this.selected.forEach(list => {
            deleteActiveDays(list.id).then(res => {
              if (res.data.code == 200) {
                this.selected.splice(0, this.selected.length)
                curLe--
                if (curLe == 0) {
                  this.isAlert = true
                  this.alertList('删除活动管理', '删除成功', '#00A0E9', false)
                  this.initData(21, false)
                }
              }
            })
          })
        }
      } else {
        this.isAlert = false
      }
    },
    removeData (value) {
      this.id = value.data.id
      this.alertText.title = '删除活动'
      this.alertText.text = '确认删除此活动信息？'
      this.alertText.bg = '#00A0E9'
      this.alertText.confirm = true
      this.isAlert = true
      this.accountText = value
      this.deleteSelect = 'single'
    },
    tableSelect (value) {
      this.selected = value
    },
    deleteMultiple () {
      if (this.selected.length == 0) {
        this.isAlert = true
        this.alertList('删除活动管理', '删除活动管理请选择最少一个！', '#00A0E9', false)
      } else {
        this.isAlert = true
        this.alertList('删除活动管理', '确定要删除所选中的活动管理？', '#00A0E9', true)
        this.deleteSelect = 'multiple'
      }
    },
    alertList (title, text, bg, confirm) {
      this.alertText.title = title
      this.alertText.text = text
      this.alertText.bg = bg
      this.alertText.confirm = confirm
    },
    initData (type, isInit) {
      // if (this.$store.state.home.loadingState == false) {
      //     this.$store.commit('loadingState', true)
      //     this.$vs.loading()
      // }
      var that = this
      if (type === 20) {
        getActiveDays(that.selectYear, 20).then(function (res) {
          if (res.data.code === 200) {
            that.loading = false
            let data = res.data.data
            that.holidayAllData = _.cloneDeep(data)
            data.forEach(e => { e.duration = `${e.duration}天` })
            that.holidayTotal = Math.ceil(data.length / 5)
            that.holidays = _.clone(data)
            if (isInit) {
              that.showHolidays = data.splice(0, 5)
              that.currentx = 1
            } else {
              that.showHolidays = data.splice((that.currentx - 1) * 5, 5)
            }
          } else {
            that.showHolidays = []
            that.holidayTotal = 1
          }
          // this.$vs.loading.close()
          // this.$store.commit('loadingState', false)
        }).catch(err => {
          // this.$vs.loading.close()
          // this.$store.commit('loadingState', false)
        })
      } else if (type === 21) {
        // 查询所有购物中心的活动
        let list = []
        // 0是集团
        getActiveDays(that.selectYear, 21, 0).then(res => {
          res = res.data.data
          res.forEach(b => {
            b.operation = true
            b.duration = `${b.duration}天`
            b.enterGoal = b.property_name || ' '
            if (b.target_enter == 0) b.saleGoal = 0
            else b.saleGoal = b.target_enter || ' '
            list.push(b)
          })
          this.eventAllData = _.cloneDeep(list)
          this.eventTotal = Math.ceil(this.eventAllData.length / 5)
          if (isInit) {
            this.showEvents = list.splice(0, 5)
            this.currentActive = 1
          } else {
            this.showEvents = list.splice((this.currentActive - 1) * 5, 5)
            if (this.eventAllData.length > 0 && this.showEvents.length === 0) {
              this.currentActive--
              this.showEvents = list.splice((this.currentActive - 1) * 5, 5)
            }
          }
          // this.$vs.loading.close()
          // this.$store.commit('loadingState', false)
        }).catch(err => {
          that.showEvents = []
          that.eventTotal = 1
          // this.$vs.loading.close()
          // this.$store.commit('loadingState', false)
        })
      }
    }
  }
}
</script>
<style lang="scss" scope>
.holiday{
  .headerSelect{
    position: relative;
    margin-top: -40px;
    .con-select{
      position: relative;
      left: 91%;
      top: -17px;
      width: 74px;
      input{
        background-color: rgba(93, 144, 255, 0.0);
      }
    }
  }
  .tables{
    height: 430px;
    box-shadow: none;
    background: none
  }
  .account-add-remove{
      z-index: 10003;
      position: absolute;
      top:5px;
      right: 20px;
      .account-add{
          margin-top: 16px!important;
      }
      span{
          display: inline-block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          text-align: center;
          line-height: 19px;
          font-size: 16px;
          color: #fff;
          margin-left: 20px;
          cursor: pointer;
          i{
            margin-top:3px;
          }
          &:nth-child(1){
              margin-top: 9px;
              background-color: #2BD9CF;
          }
          &:nth-child(2){
              margin-top: 9px;
              background-color: #FEB33D!important;
          }
      }
  }
  .holidayTable{
    position: relative;
    background-color: #fff;
    border-radius: 6px;
    margin-bottom: 20px;
  }
  .paginations{
    position: relative;
    bottom: 6px;
  }

  .router-view {
    padding-bottom: 0px;
  }
  .ivu-form-item-error-tip {
    position: absolute;
    top: 95%;
    left: 0;
    line-height: 1;
    padding-top: 0px;
    color: #ed4014;
  }
}
</style>
