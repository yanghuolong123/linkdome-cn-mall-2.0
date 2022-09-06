<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar
        class="vx-navbar navbar-custom"
        :color="navbarColor"
        :class="classObj"
      >
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer mr-1"
          icon="MenuIcon"
          @click.stop="showSidebar"
        ></feather-icon>
        <span class="header-title">{{ systemTitle }}</span>
        <vs-select
          class="headerSelect"
          labe l=""
          v-model="comprotModel"
          autocomplete
          v-if="showCompany && isnotBgmange"
          @change="comprotChange"
        >
          <vs-select-item
            class="headeSele"
            :key="index"
            :value="item.value"
            :text="item.text"
            v-for="(item, index) in comprotList"
          />
        </vs-select>
        <span v-else class="m-l-20">{{
          $store.state.home.headerData.text
        }}</span>
        <vs-spacer></vs-spacer>
        <div class="flex-center">
          <div v-show="comprotModel!==0&&weathers.id" class="weather-box flex-center">
            <span
            >城市:&nbsp;{{ weathers.city_name }}&nbsp; &nbsp;| &nbsp; &nbsp;
              <img
              style="width:20px;height:20px;"
              :src="weathers.weather_icon"
            />
              &nbsp;{{ weathers.condition }}&nbsp;
            {{ weathers.low_temperature }}℃-{{ weathers.high_temperature }}℃
            </span>

          </div>
          <div class="text-right ml-8 leading-tight hidden sm:block">
            <p class="font-semibold">{{ user.userName }}</p>
          </div>
          <vs-dropdown
            vs-custom-content
            vs-trigger-click
            style=" cursor: pointer;"
          >
            <div class="con-img ml-3">
              <img
                :src="user.avatorImgPath == '' ? nameImg : user.avatorImgPath"
                alt
                width="34"
                height="34"
                class="rounded-full shadow-md cursor-pointer block"
              />
            </div>
            <vs-dropdown-menu>
              <ul style="min-width: 9rem">
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="isAccount = true"
                >
                  <Icon type="md-person" size="16" />
                  <span class="ml-2">{{ $t("账户信息") }}</span>
                </li>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="accountOut"
                >
                  <feather-icon
                    icon="LogOutIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-2">{{ $t("退出") }}</span>
                </li>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </vs-navbar>
    </div>
    <vs-sidebar
      parent="body"
      default-index="1"
      color="primary"
      class="sidebarx"
      spacer
      v-model="isAccount"
    >
      <div class="header-sidebar" slot="header">
        <vs-avatar
          size="70px"
          :src="user.avatorImgPath == '' ? nameImg : user.avatorImgPath"
        />
        <h4>
          <span>{{ user.userName }}</span>
          <span
            style="display: inline-block; cursor: pointer;"
            v-on:click="showEdit"
          >
            <Icon type="md-create" />
          </span>
        </h4>
      </div>
      <ul class="account-text">
        <li>
          <span>{{ $t("角色") }}：</span>
          <span>{{ $t(roleName) }}</span>
        </li>
        <li>
          <span>{{ $t("姓名") }}：</span>
          <span>{{ user.realName }}</span>
        </li>
        <li>
          <span>{{ $t("性别") }}：</span>
          <span v-if="user.sex == 1">{{ $t("男性") }}</span>
          <span v-if="user.sex == 0">{{ $t("女性") }}</span>
        </li>
        <li>
          <span>{{ $t("手机号") }}：</span>
          <span>{{ user.mobile }}</span>
        </li>
        <li>
          <span>{{ $t("邮箱") }}：</span>
          <span>{{ user.email }}</span>
        </li>
      </ul>
      <headerAccount
        v-if="isEdit"
        @closeEdit="closeEdit"
        :editData="dataList"
      ></headerAccount>
    </vs-sidebar>
  </div>
</template>

<script>
import VxAutoSuggest from "@/components/vx-auto-suggest/VxAutoSuggest.vue";
import headerAccount from "_c/account-manage/header-account-edit.vue";
import { weatherTrend } from "@/api/entityNew";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { getGroupOrganization, getUrl } from "@/api/home.js";
import Moment from "moment";
import _ from "lodash";
import Cookies from "js-cookie";
import LanguageBtn from "@/components/LanguageBtn.vue";
export default {
  name: "the-navbar",
  components: {
    VxAutoSuggest,
    VuePerfectScrollbar,
    headerAccount,
    LanguageBtn,
  },

  props: {
    navbarColor: {
      type: String,
      default: "#fff",
    },
  },
  data() {
    return {
      systemTitle: "",
      count: 0,
      showCompany: false,
      dataList: {},
      isEdit: false,
      isAccount: false,
      nameImg: require("@/assets/images/fixation_img/rest/who.png"),
      navbarSearchAndPinList: this.$store.state.navbarSearchAndPinList,
      searchQuery: "",
      showFullSearch: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      autoFocusSearch: false,
      showBookmarkPagesDropdown: false,
      comprotList: [],
      comprotModel: 0,
      Biurl: "",
      homeUrl: "",
      today: Moment().format("YYYY-MM-DD"),
      weathers:{},
    };
  },
  watch: {
    $route() {
      if (this.showBookmarkPagesDropdown)
        this.showBookmarkPagesDropdown = false;
    },
    "$store.state.home.headerAction"(val) {
      this.comprotModel = val;
      if(val!=0){
        this.getWeather()
      }
    },
  },
  mounted() {
    var menuList = JSON.parse(window.localStorage.getItem("menulist"));
    var GroupCompany = _.find(menuList, ["name", "Dashboard"]).subpagesList;
    GroupCompany = _.find(GroupCompany, ["name", "GroupCompany"]).id + "";
    var showCompany;
    if (this.$store.state.user.role_id < 3) {
      this.showCompany = true;
      this.comprotList = [];
      this.comprotModel = "";
      const data = this.$store.state.home.organizationData;
      let obj = {
        text: data.name,
        value: 0,
        img: data.map_url ? data.map_url : "",
      };
      this.comprotList.push(obj);
      if (data.property.length != 0) {
        data.property.map((list) => {
          if (list.property_id && list.bzid) {
            let l = {
              text: list.name,
              value: list.property_id,
              img: list.map_url,
            };
            this.comprotList.push(l);
          }
        });
      }
      let modal = _.filter(data.property, (o) => {
        return o.property_id === this.$store.state.home.headerAction;
      });
      this.comprotModel =
        modal.length === 0 ? 0 : this.$store.state.home.headerAction;
      const index = this.comprotList.findIndex((o) => {
        return o.value == this.comprotModel;
      });
      this.$store.commit("headerImg", this.comprotList[index].img);
      this.$store.commit("headerData", this.comprotList[index] || {});
      this.$store.commit("saveComprotList", this.comprotList);
    } else {
      _.indexOf(this.$store.state.user.access, GroupCompany) > -1
        ? (showCompany = true)
        : (showCompany = false); // 判断是否显示集团
      this.showCompany = showCompany;
      let role_property = this.$store.state.user.checklist;
      let allBzid = this.$store.state.user.bzid;
      if (role_property.length) {
        this.comprotList = [];
        this.comprotModel = "";
        const data = this.$store.state.home.organizationData;
        if (showCompany) {
          const obj = {
            text: data.name,
            value: 0,
            img: data.map_url,
          };
          this.comprotList.push(obj);
        }
        if (data.property.length != 0) {
          data.property.map((list) => {
            if (list.property_id && list.bzid) {
              let l = {
                text: list.name,
                bzId: list.bzid,
                value: list.property_id,
                img: list.map_url,
              };
              if (role_property.indexOf(l.value) > -1) this.comprotList.push(l);
            }
          });
        }
        // let currList = [];
        // let typeId = this.$store.state.user.allType;
        // let property_type = _.find(typeId, (val) => {
        //   return val == 52;
        // });
        // if (property_type) {
        //   this.comprotList.map(list => {
        //     allBzid.map(val => {
        //       if (list.bzId == val) currList.push(list)
        //     })
        //   })
        //   this.comprotList = currList
        // }
        this.$store.commit("headerData", this.comprotList[0] || {});
        this.showCompany = this.comprotList.length > 1;
        this.comprotModel = this.$store.state.home.headerAction;
        this.$store.commit("headerImg", this.comprotList[0].img);
        this.$store.commit("saveComprotList", this.comprotList);
      }
    }
    if(this.comprotModel!=0){
      this.getWeather()
    }
    getUrl().then((res) => {
      if (res.data.code == 200) {
        this.Biurl = res.data.data.BI;
        this.homeUrl = res.data.data.Dashboard;
        this.systemTitle = res.data.data.sysTitle;
      }
    });
  },
  destroyed() {
    document.removeEventListener("click", this.NavFalse);
  },
  computed: {
    // 不是后台管理
    isnotBgmange() {
      const bgMangeList = ["EntityManage", "HolidayManage", "Account", "Role"];
      return !bgMangeList.includes(this.$route.name);
    },
    roleName() {
      return this.$store.state.user.role_name;
    },
    classObj() {
      if (this.sidebarWidth == "default") return "navbar-default";
      else if (this.sidebarWidth == "reduced") return "navbar-reduced";
      else if (this.sidebarWidth) return "navbar-full";
    },
    user() {
      return this.$store.state.user;
    },
    sidebarWidth() {
      return this.$store.state.sidebarWidth;
    },
    starredPages() {
      return this.$store.getters.starredPages;
    },
    starredPagesLimited() {
      return this.starredPages.slice(0, 10);
    },
    starredPagesMore() {
      return this.starredPages.slice(10);
    },
  },
  methods: {
    getWeather(){
      weatherTrend({
        time1: this.today + "," + this.today,
        property_id: this.comprotModel,
        type: 0,
      }).then((res) => {
        this.weathers = res.data.data
          ? Object.values(res.data.data)[0][0].list[0]
          : {};
      });
    },
    accountOut() {
      this.$store.commit("setToken", "");
      this.$store.commit("setAccess", []);
      this.$store.commit("headerAction", 0);
      this.$store.commit("headerImg", "");
      this.$router.push("/login");
      // this.$vs.loading.close()
      // this.$store.commit('loadingState', false)
    },
    openModal() {
      this.$emit("showVips", true);
    },
    NavFalse(event) {
      var property = document.getElementById("vipRecordDiv");
      var openVip = document.getElementById("openVip");
      var editText = document.getElementById("editText");
      var alert = document.getElementsByClassName("alert-text")[0];
      if (property) {
        if (
          !openVip.contains(event.target) &&
          property.contains(event.target) &&
          !editText.contains(event.target) &&
          alert.contains(event.target)
        ) {
          this.$emit("showVips", false);
        }
      }
    },
    showEdit() {
      this.isEdit = true;
      this.dataList = this.user;
    },
    closeEdit() {
      this.isEdit = false;
    },
    showSidebar() {
      this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
    },
    outside: function() {
      this.showBookmarkPagesDropdown = false;
    },
    comprotChange() {
      let that = this;
      let companyLogo = _.find(this.comprotList, function(e) {
        return e.value == that.comprotModel;
      });
      if (!companyLogo) return false;
      this.$store.commit("headerAction", this.comprotModel);
      this.$store.commit("headerImg", companyLogo.img);
      this.$store.commit("headerData", companyLogo);
      if (this.comprotModel == 0) {
        this.$router.push({ name: "Dashboard" });
      }
    },
  },
  directives: {
    "click-outside": {
      bind: function(el, binding) {
        const bubble = binding.modifiers.bubble;
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target))
            binding.value(e);
        };
        el.__vueClickOutside__ = handler;
        document.addEventListener("click", handler);
      },
    },
  },
};
</script>
<style lang="scss">
.headeSele {
  :hover {
    font-weight: bold !important;
  }
}
</style>
<style lang="scss" scope>
.vx-navbar-wrapper {
  padding: 22px 22px 30px;
}
.headerSelect {
  margin-left: 20px;
  .vs-select--input {
    border: none;
  }
}
.header-title {
  color: #00a0e9;
  font-size: 22px;
}
.vs-sidebar--background,
.vs-sidebar {
  z-index: 201;
}
.vs-avatar--con-img img {
  width: 100%;
  height: 100%;
}
.header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  .con-img {
    margin-left: 0;
  }
  h4 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    span {
      display: inline-block;
      &:nth-child(2) {
        margin-top: 2px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}

.footer-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  > button {
    border: 0px solid rgba(0, 0, 0, 0) !important;
    border-left: 1px solid rgba(0, 0, 0, 0.07) !important;
    border-radius: 0px !important;
  }
}
.account-text {
  margin-top: 20px;
  li {
    padding: 0 20px;
    margin-top: 20px;
    padding-bottom: 10px;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    span {
      font-size: 14px;
    }
  }
}

#openVip {
  display: inline-block;
  top: 5px;
  left: -20px;
  position: relative;
  z-index: 3;
  cursor: pointer;
  img {
    width: 31px;
    height: auto;
  }
  div {
    position: absolute;
    background-color: #feb33d;
    width: 18px;
    height: 18px;
    top: -4px;
    right: -5px;
    border-radius: 8px;
    p {
      position: absolute;
      top: -18px;
      left: 4px;
      color: #fff;
      font-size: 16px;
    }
  }
}
.header-account-text {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
<style scoped>
.BIButton {
  border-radius: 4px;
  background: #5f81f4;
  padding: 5px 10px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  line-height: 22px;
  margin-right: 78px;
  cursor: pointer;
}
</style>
