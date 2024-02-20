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
      <div class="title ">{{$t('HolidayManage')}}</div>
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
        <div class="title">{{$t('actManage')}}</div>
        <div class="account-add-remove flex-center">
        <span class="account-add" @click="addData" :title="$t('add')">
          <Icon type="md-add" />
        </span>
          <span class="account-add" :title="$t('del')" @click="deleteMultiple">
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
              <span v-if="userLvl=='common_admin'||userLvl=='admin'" class="icons" :title="$t('edit')"
                    @click="editClick(row)">
            <vs-icon icon="ivu-icon-md-create" icon-pack='ivu-icon'></vs-icon>
          </span>
            <span v-if="userLvl=='admin' " class="icons" :title="$t('del')"
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
          title:this.$t('holidayName'),
        },{
          key:'start_date',
          title:this.$t('startTime'),
        },{
          key:'end_date',
          title:this.$t('endTime'),
        },{
          key:'duration',
          title:this.$t('duringTime'),
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
          title:this.$t('actName'),
        },{
          key:'property_name',
          title:this.$t('actBelong'),
        },{
          key:'target_enter',
          title:this.$t('targetEnter'),
        },{
          key:'start_date',
          title:this.$t('startTime'),
        },{
          key:'end_date',
          title:this.$t('endTime'),
        },{
          key:'duration',
          title:this.$t('duringTime'),
        },{
          slot:'operate',
          title:this.$t('operate'),
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
        that.$refs.editActive.msgTitle = this.$t("fn.add",[this.$t('activity')]);

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
          content: this.$t("chooseActivityTip"),
        });
      } else {
        this.$alert({
          content: this.$t("activityDelConfirm"),
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
              : o.duration > 1
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
              : o.duration > 1
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
        content: this.$t("activityDelConfirm"),
        cancel() {},
        confirm: () => {
          deleteActiveDays(data.id).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(this.$t('fn.successTo',[this.$t('del')]))
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
          this.$set(this.$refs.editActive,'targetType',this.$t('dailyTarget'))
          this.$refs.editActive.targetTypeChange(this.$t('dailyTarget'))
          row.target_enter = row.target_enter.split(',')
          row.target_enter.forEach((o,i)=>{
            this.$set(row,`target_daily_${i}`,o)
          })
        }else {
          this.$refs.editActive.targetType =this.$t('totalTarget')
          row.target_total = (row.target_enter)
        }
        that.$refs.editActive.datas = row
        that.$refs.editActive.isUpdate = true;
        that.$refs.editActive.msgTitle = this.$t("fn.edit",[this.$t('activity')])

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
