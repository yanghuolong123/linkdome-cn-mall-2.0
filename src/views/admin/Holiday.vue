<template>
  <div class="holiday">
    <div class="headerSelect">
      <vs-select class="selectExample" autocomplete v-model="selectYear">
        <vs-select-item
          :key="index"
          :value="item.value"
          :text="item.key"
          v-for="(item, index) in years"
        />
      </vs-select>
    </div>
    <div class="common-card">
      <div class="title ">节假日活动管理</div>
      <Table
        class="m-t-20"
        stripe
        :height="280"
        :columns="holidayColumn"
        :data="holidayData"
      ></Table>
      <div class="paginations">
        <Page :page-size="5" :model-value="holidayPage" :total="holidayTotal" show-elevator @on-change="(page)=>{getHolidays(page)}" />
      </div>
    </div>
    <div class="common-card m-t-20">
      <div class="flex-between">
        <div class="title">活动管理</div>
        <div class="account-add-remove flex-center">
        <span class="account-add" @click="addData" :title="$t('添加')">
          <Icon type="md-add" />
        </span>
          <span class="account-add" :title="$t('删除')" @click="deleteMultiple">
          <Icon type="md-remove" />
        </span>
        </div>
      </div>
      <Table
        stripe
        class="m-t-20"
        :height="280"
        @on-select="handleSelect"
        @on-select-cancel="handleSelectCancel"
        :columns="activityColumn"
        :data="activityData"
      >
        <template slot-scope="{ row }" slot="operate">
          <div class="flex-center">
              <span v-if="userLvl=='common_admin'||userLvl=='admin'" class="icons" :title="$t('编辑')"
                    @click="editClick(row)">
            <vs-icon icon="ivu-icon-md-create" icon-pack='ivu-icon'></vs-icon>
          </span>
            <span v-if="userLvl=='admin' " class="icons" :title="$t('删除')"
                  @click="removeClick(row)">
            <Icon type="ios-trash"/>
          </span>
          </div>
        </template>
      </Table>

      <div class="paginations">
        <div class="paginations">
          <Page :page-size="5" :model-value="actPage" :total="activityTotal" show-elevator @on-change="(page)=>{getActives(page)}" />
        </div>
      </div>
    </div>
    <holidayEdit ref="editActive" @refresh="getActives"></holidayEdit>
  </div>
</template>

<script>
import holidayEdit from "@/components/holiday-manage/holiday-edit.vue";
import { getActiveDays, deleteActiveDays } from "@/api/manager.js";
import {mapState } from 'vuex'
import { getYearList } from "@/api/operate";
import moment from 'moment'
export default {
  components: {
    holidayEdit,
  },
  computed:{
    ...mapState({
      propertyId: state => state.home.headerAction,
      menuList:state => state.home.menuList,
    }),
    userLvl(){
      let userLvl;
      let theUser = this.$store.state.user
      if (theUser.role_id < 3) {
        userLvl = theUser.role_id == 1 ? 'admin' : 'common_admin'
      } else {
        let temp = _.find(this.menuList, ['name', 'Admin']).subpagesList
        temp = _.find(temp, ['name', 'EntityManage']).id + ''
        if (theUser.access.indexOf(temp) > -1) {
          userLvl = 'common_admin'
        }
      }
      return userLvl
    }
  },
  data() {
    return {
      holidayColumn:[
        {
          key:'name',
          title:'节假日名称',
        },{
          key:'start_date',
          title:'开始时间',
        },{
          key:'end_date',
          title:'结束时间',
        },{
          key:'duration',
          title:'持续时间',
        },
      ],
      holidayData:[],
      holidayTotal:0,
      holidayPage:1,


      actPage:1,
      activityTotal:0,
      activityData:[],
      activityColumn:[
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          key:'name',
          title:'活动名称',
        },{
          key:'property_name',
          title:'活动归属',
        },{
          key:'target_enter',
          title:'目标客流',
        },{
          key:'start_date',
          title:'开始时间',
        },{
          key:'end_date',
          title:'结束时间',
        },{
          key:'duration',
          title:'持续时间',
        },{
          slot:'operate',
          title:'操作',
        },
      ],

      selectYear: new Date().getFullYear(),
      years: [],
      currentPropertyId: "",
      selected: [],
    };
  },
  watch: {
    "$store.state.home.headerAction"() {
      // 监听是否切换购物中心
      this.currentPropertyId = this.$store.state.home.headerAction;
      this.getActives()
    },

    selectYear: {
      // 切换年份
      handler(newVal, oldVal) {
        if (newVal) {
          this.getHolidays()
          this.getActives()
        }
      },
      immediate: false,
    },
  },
  async mounted() {
    this.currentPropertyId = this.$store.state.home.headerAction;
    await getYearList({ property_id: this.currentPropertyId }).then((res) => {
      this.years = res.data.data.map((val) => {
        return (val = { key: val, value: val });
      });
    });
    this.getHolidays()
    this.getActives()
  },
  methods: {
    // 新增活动
    addData() {
      this.$refs.editActive.$refs.modal.showModal();
      var that = this;
      var checklist = that.$store.state.user.checklist;
      this.$nextTick(() => {
        that.$refs.editActive.isUpdate = false;
        that.$refs.editActive.msgTitle = this.$t("添加活动");

        if (that.$store.state.user.role_id < 3) {
          that.$refs.editActive.showBelong = true;
        } else {
          that.$refs.editActive.showBelong = checklist.length > 1;
          if (!that.$refs.editActive.showBelong) {
            that.$refs.editActive.datas.property = Number(
              that.$store.state.home.headerAction
            );
          }
        }
      });
    },
    tableSelect(value) {
      this.selected = value;
    },
    deleteMultiple() {
      if (!this.selected.length) {
        this.$alert({
          content: this.$t("删除活动管理请选择最少一个！"),
        });
      } else {
        this.$alert({
          content: this.$t("确定要删除所选中的活动管理？"),
          cancel() {},
          confirm: () => {
            const ids = this.selected.map(o=>{
              return o.id
            })
            deleteActiveDays(ids.toString()).then((res) => {
              this.getActives(1)
            });
          },
        });
      }
    },
    getHolidays(page = this.holidayPage){
      this.holidayPage = page
      const params = {
        type_id:20,
        year:this.selectYear,
        limit:5,
        page:this.holidayPage
      }
      getActiveDays(params).then(res=>{
        this.holidayTotal = res.data.data.total;
        let list = res.data.data.list || [];
        list.forEach(o=>{
          const day =
            this.$i18n.locale === "zh-CN"
              ? "天"
              : e.duration > 1
              ? " days"
              : " day";
          const duration = moment(o.end_date).diff(moment(o.start_date),'days')
          this.$set(o,'duration',String(duration+1)+day)
        })
        this.holidayData = list
      })
    },

    getActives(page = this.actPage){
      this.actPage = page;
      const params = {
        type_id:21,
        year:this.selectYear,
        limit:5,
        page:this.actPage,
        property_id:this.propertyId
      }
      getActiveDays(params).then(res=>{
        this.activityTotal = res.data.data.total;
        let list = res.data.data.list || [];
        list.forEach(o=>{
          const day =
            this.$i18n.locale === "zh-CN"
              ? "天"
              : e.duration > 1
              ? " days"
              : " day";
          const duration = moment(o.end_date).diff(moment(o.start_date),'days')
          this.$set(o,'duration',String(duration+1)+day)
        })
        this.activityData = list
      })
    },
    handleSelectCancel(value){
      this.selected = value
    },
    handleSelect(value){
      this.selected = value
    },
    removeClick(data){
      this.$alert({
        content: this.$t("确认删除此活动信息？"),
        cancel() {},
        confirm: () => {
          deleteActiveDays(data.id).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(this.$t("删除成功"));
              this.getActives(1)
            } else {
              this.$alert({ content: res.data.message });
            }
          });
        },
      });
    },
    editClick(data){
      let row = _.cloneDeep(data)
      this.$refs.editActive.$refs.modal.showModal();
      var that = this;
      var checklist = that.$store.state.user.checklist;
      this.$nextTick(() => {
        row.date = [row.start_date,row.end_date]
        that.$refs.editActive.datas = row
        if(row.target_type === 2 ){
          this.$set(this.$refs.editActive,'targetType','每日目标')
          this.$refs.editActive.targetTypeChange('每日目标')
          row.target_enter = row.target_enter.split(',')
          row.target_enter.forEach((o,i)=>{
            this.$set(row,`target_daily_${i}`,o)
          })
        }else {
          this.$refs.editActive.targetType = '总目标'
          row.target_total = (row.target_enter)
        }
        that.$refs.editActive.datas = row
        that.$refs.editActive.isUpdate = true;
        that.$refs.editActive.msgTitle = this.$t("编辑活动");

        if (that.$store.state.user.role_id < 3) {
          that.$refs.editActive.showBelong = true;
        } else {
          that.$refs.editActive.showBelong = checklist.length > 1;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.holiday {
  .headerSelect {
    position: relative;
    margin-top: -40px;

    .con-select {
      position: relative;
      left: 91%;
      top: -17px;
      width: 74px;

      input {
        background-color: rgba(93, 144, 255, 0);
      }
    }
  }

  .tables {
    height: 430px;
    box-shadow: none;
    background: none;
  }

  .account-add-remove {


    .account-add {
      /*margin-top: 16px !important;*/
    }

    span {
      width: 24px;
      height: 24px;
      line-height: 24px;
      border-radius: 50%;
      text-align: center;
      font-size: 16px;
      color: #fff;
      margin-left: 20px;
      cursor: pointer;

      &:nth-child(1) {
        margin-top: 9px;
        background-color: #2bd9cf;
      }

      &:nth-child(2) {
        margin-top: 9px;
        background-color: #feb33d !important;
      }
    }
  }

  .title{
    font-size: 18px;
  }
  .paginations {
    text-align: center;
    padding-top: 20px;
  }
  .icons{
    font-size: 20px;
    &:hover{
      color: #00a0e9;
      cursor: pointer;
    }
  }
  .icons+.icons{
    margin-left: 10px;
  }
}
</style>
