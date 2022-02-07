<template>
  <div class="login-container" :class="themeClass">
    <!--国际化按钮-->
    <LanguageBtn style="margin: 8px 16px 0 auto;" />
    <div class="login">
      <img
        src="@/assets/images/fixation_img/logo/logo.png"
        width="150"
        alt=""
      />
      			<!-- <div class="system-select" @click="selectBoxShow=true">{{systemSelectName}} <Icon type="md-arrow-dropdown" /> -->
      <div class="system-select">
        {{ systemSelectName }}
        <div class="select-box" v-show="selectBoxShow">
          <div
            class="sys-item"
            :class="{ active: systemSelect === sys.id }"
            @click.stop="handleSystemSwitch(sys.id)"
            v-for="(sys, i) in systemListCom"
            :key="i"
          >
            {{ sys.name }}
          </div>
        </div>
      </div>
      <Form
        @keydown.enter.native="handleLogin('formValidate')"
        ref="formValidate"
        class="form-data"
        :model="loginForm"
        :rules="validateRulesCom"
      >
        <FormItem prop="username">
          <input
            :placeholder="$t('fn.inputHolder', [$t('accountNum')])"
            v-model="loginForm.username"
          />
        </FormItem>
        <FormItem prop="password">
          <input
            :placeholder="$t('fn.inputHolder', [$t('password')])"
            type="password"
            v-model="loginForm.password"
          />
        </FormItem>
      </Form>
      <div class="flex-between">
        <label for="remember" class="remember flex-box">
          <input id="remember" type="checkbox" v-model="isRememberMe" />{{
            $t("rememberPassword")
          }}
        </label>
        <router-link to="/pages/forgot-password"
          ><span class="forget">{{ $t("forgetPassword") }}</span></router-link
        >
      </div>
      <Button
        class="login-btn"
        :loading="loading"
        type="primary"
        @click="handleLogin('formValidate')"
        >{{ $t("login") }}</Button
      >
    </div>
    <div class="bottom">
      苏ICP备2021044524号 苏州凌图科技有限公司 Copyright 2019-{{ currentYear }}
    </div>
    <vs-alert
      :active="isalert"
      color="danger"
      icon-pack="feather"
      icon="icon-info"
    >
      <span>{{ alertText }}</span>
    </vs-alert>
  </div>
</template>
<script>
import { getMenuList } from "@/api/custom.js";
import { login } from "@/api/user.js";
import { getUrl, getGroupOrganization, getPdfCenterUrl } from "@/api/home.js";
import moment from "moment";
import md5 from "md5";
import config from "@/config/index";
import _ from "lodash";
import Cookies from "js-cookie";
import LanguageBtn from "@/components/LanguageBtn.vue";
import { mapState } from "vuex";
export default {
  components: {
    LanguageBtn,
  },
  data() {
    return {
      systemSelect: 2,
      currentYear: moment().format("YYYY"),
      systemList: [],
      selectBoxShow: false,
      validateRules: {},
      loginForm: {
        username: "",
        password: "",
      },
      alertText: "",
      loading: false,
      isalert: false,
      isRememberMe: false,
      Biurl: "",
      homeUrl: "",
    };
  },
  computed: {
    ...mapState({
      organizationData: (state) => state.home.organizationData,
    }),
    systemSelectName() {
      return this.systemListCom.find((o) => {
        return o.id === this.systemSelect;
      }).name;
    },
    themeClass() {
      return this.systemSelect === 1 ? "dark" : "light";
    },
    systemListCom() {
      this.systemList = [
        //   {
        //   name: '凌图智慧商业BI大屏',
        //   id: 1
        // },
        {
          name: this.$t("analysisPlatform"),
          id: 2,
        },
      ];
      return this.systemList;
    },
    validateRulesCom() {
      this.validateRules = {
        username: {
          required: true,
          message: this.$t("fn.require", [this.$t("accountNum")]),
          trigger: "blur",
        },
        password: {
          required: true,
          message: this.$t("fn.require", [this.$t("password")]),
          trigger: "blur",
        },
      };
      return this.validateRules;
    },
  },
  activated() {},
  mounted() {},
  methods: {
    getPdfCenter() {
      getPdfCenterUrl().then((res) => {
        this.$store.commit("setPdfBaseUrl", res.data.data.pdf_center);
        this.$i18n.locale = res.locale;
      });
    },
    handleSystemSwitch(id) {
      this.systemSelect = id;
      this.selectBoxShow = false;
    },
    handleLogin(name) {
      var that = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true;
          const formdata = {
            userName: this.loginForm.username,
            password: md5(this.loginForm.password),
          };
          login(formdata)
            .then(async (res) => {
              const data = res.data.data;
              if (res.data.code === 200) {
                // systemSelect===1 跳转BI
                if (this.systemSelect === 1) {
                  if (this.showBI()) {
                    that.openBILarge();
                  } else {
                    that.showHint(this.$t("notices.noPermission"));
                    this.loading = false;
                  }
                } else {
                  that.getPdfCenter();
                  //  store list
                  that.commitStoreData(data);
                  // 处理当前账户菜单数据为键值对数组类型
                  let res = await getMenuList();
                  if (res.data.code == 200) {
                    var menuList = res.data.data.main;
                    var menuarr = [];
                    menuList.forEach((m) => {
                      menuarr.push({
                        id: m.id,
                        name: m.name,
                      });
                      m.subpagesList.forEach((k) => {
                        menuarr.push({
                          id: k.id,
                          name: k.name,
                        });
                      });
                    });
                    menuList = _.orderBy(menuList, ["id"]);
                    window.localStorage.setItem(
                      "saleStatus",
                      data.sale_feature
                    ); // 是否需要销售
                    window.localStorage.setItem(
                      "menuarr",
                      JSON.stringify(menuarr)
                    ); // 存所有菜单键值对到localStorage
                    window.localStorage.setItem(
                      "menulist",
                      JSON.stringify(menuList)
                    ); // 存所有菜单原始数据到localStorage
                  }
                  // 处理当前用户菜单权限
                  var pages_privilege = [];
                  // 当前用户为超级管理员或者集团管理员
                  if (data.roles_id == 1 || data.roles_id == 2) {
                    menuList.forEach((m) => {
                      pages_privilege.push(m.id + "");
                      m.subpagesList.forEach((k) => {
                        pages_privilege.push(k.id + "");
                      });
                    });
                    data.pages_privilege = pages_privilege;
                    that.$store.commit("setAccess", data.pages_privilege);
                    // 设置帐号类型为"super"
                    that.$store.commit("setAccountLvl", "super");
                  } else {
                    // 其它角色的用户
                    pages_privilege = data.pages_privilege
                      ? data.pages_privilege.split(",")
                      : [];
                    that.$store.commit("setAccess", pages_privilege);

                    if (data.type_id.indexOf(52) > -1) {
                      // 设置帐号类型为"shopping" 购物中心
                      that.$store.commit("setAccountLvl", "shopping");
                    } else if (data.type_id.indexOf(51) > -1) {
                      // 设置帐号类型为"floor" 楼层
                      that.$store.commit("setAccountLvl", "floor");
                    } else {
                      // 设置帐号类型为"store" 商铺
                      that.$store.commit("setAccountLvl", "store");
                    }
                  }

                  // 当前角色用户菜单排序
                  let theUserPage = _.cloneDeep(pages_privilege);
                  theUserPage.map((m) => {
                    return isNaN(Number(m)) ? Number(m) : 0;
                  });
                  theUserPage.sort();
                  // 根据权限处理用户跳转的第一个页面

                  // 第一个页面路由下标
                  let homePageIndex = Number(theUserPage[0])
                    ? Number(theUserPage[0])
                    : 0;
                  if (homePageIndex) {
                    let names = _.find(menuarr, ["id", homePageIndex]);
                    if (names) {
                      names = { name: names.name };
                      that.$store.commit("shopUserName", names);
                      const orgData = await getGroupOrganization();
                      this.$store.commit(
                        "saveOrganizationData",
                        orgData.data.data
                      );
                      if (this.isRememberMe) {
                        Cookies.set("userInfo", this.loginForm);
                      } else {
                        Cookies.remove("userInfo");
                      }
                      //如果进入的页面需要选择购物中心
                      if (!config.noPropertyPages.includes(names.name))
                        that.setHeaderAction();
                      that.$router.push(names);
                    } else {
                      that.showHint(this.$t("notices.noPermission"));
                    }
                  } else {
                    that.showHint(this.$t("notices.noPermission"));
                  }
                  this.loading = false;
                }
              } else if (res.data.code === 305 || res.data.code === 304) {
                that.showHint(this.$t("notices.wrongPassword"));
                this.loading = false;
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
              this.$Message.error(this.$t("notices.systemException"));
            });
        }
      });
    },
    setHeaderAction() {
      if (this.organizationData.property.length) {
        const id = this.organizationData.property[0].property_id;
        this.$store.commit("headerAction", id);
      }
    },
    openBILarge() {
      this.getBiUrl()
        .then((res) => {
          this.loading = false;
          let token = Cookies.get("token");
          let userName = this.$store.state.user.userName;
          if (this.Biurl == "") return false;
          window.location.href =
            "https://" +
            this.Biurl +
            "/#/?homeUrl=" +
            this.homeUrl +
            "&user=" +
            userName +
            "&token=" +
            token +
            "&userSource=login";
        })
        .catch((err) => {
          this.loading = false;
          this.showHint(err);
        });
    },
    // 获取bi跳转路径
    getBiUrl() {
      return new Promise((resolve, reject) => {
        getUrl()
          .then((res) => {
            if (res.data.code == 200) {
              this.Biurl = res.data.data.BI;
              this.homeUrl = res.data.data.Dashboard;
              resolve();
            } else {
              reject(
                this.$t("fn.failedTo", [
                  this.$t("fn.get", [this.$t("jumpPath")]),
                ])
              );
            }
          })
          .catch(() => {
            reject(
              this.$t("fn.failedTo", [this.$t("fn.get", [this.$t("jumpPath")])])
            );
          });
      });
    },
    showBI() {
      if (this.$store.state.user.role_id < 3) {
        return true;
      } else {
        let access = this.$store.state.user.access;
        let menulist = JSON.parse(window.localStorage.getItem("menulist"));
        let BIid = "";
        for (let i of menulist) {
          if (i.subpagesList) {
            let find = _.find(i.subpagesList, ["name", "BI"]);
            if (find) {
              BIid = find.id;
              break;
            }
          }
        }
        return access.indexOf("" + BIid) > -1;
      }
    },
    commitStoreData(data) {
      let isRememberMe = this.isRememberMe;
      // 存token到store

      this.$store.commit("setToken", { token: data.token, isRememberMe });
      this.$store.commit("allType", data.type_id);
      this.$store.commit(
        "setAvator",
        data.avatar
          ? data.avatar
          : require("@/assets/images/fixation_img/rest/who.png")
      );
      this.$store.commit("setUserName", data.username);
      this.$store.commit("setUserId", data.userid);
      this.$store.commit("setBzid", data.bzid);
      this.$store.commit("setlvl", data.lvl);
      this.$store.commit("setRole", data.roles_id);
      this.$store.commit("setRoleName", data.roles_name);
      this.$store.commit("setRoleProperty", data.property_id);
      this.$store.commit("setchecklist", data.checklist);
      this.$store.commit("setrealName", data.realname);
      this.$store.commit("setmobile", data.mobile);
      this.$store.commit("setSex", data.sex);
      this.$store.commit("setemail", data.email);
      this.$store.commit("setCompanyId", data.company_id);
      this.$store.commit(
        "setEntityPrivilege",
        data.business_zone_privilege && JSON.parse(data.business_zone_privilege)
      );
      this.$store.commit("outSize", 0);
      this.$store.commit("setSaleFeature", data.sale_feature);
    },
    showHint(text) {
      this.isalert = true;
      this.alertText = text;
      this.alertType();
      return false;
    },
    alertType() {
      setTimeout(() => {
        this.isalert = false;
      }, 2000);
    },
  },
  created() {
    if (Cookies.get("userInfo")) {
      this.loginForm = JSON.parse(Cookies.get("userInfo"));
      this.isRememberMe = true;
    } else {
      this.isRememberMe = false;
    }
  },
};
</script>
<style lang="less" scoped>
.light {
  color: #226299;
}
.ivu-btn-primary,
.ivu-btn-primary:hover {
  background-color: #2b83b7;
  border-color: #2b83b7;
}
.login-container/deep/.ivu-form-item-content {
  font-size: 14px !important;
}
.login-container {
  width: 100%;
  overflow: hidden;
  height: 100vh;
  background-color: #2569a3;
  background: url("../../assets/images/fixation_img/bg/login-bg-1.png");
  background-size: 100% 100%;
  position: relative;
  .login {
    position: absolute;
    top: 50%;
    right: 179px;
    transform: translateY(-50%);
    color: #464646;
    font-size: 22px;
    background: url("../../assets/images/fixation_img/bg/login-input-box-bg1.png")
      no-repeat;
    background-size: 100% 100%;
    width: 500px;
    height: 620px;
    padding: 60px 60px;
    .system-select {
      color: #216199;
      font-weight: bold;
      cursor: pointer;
      position: relative;
      .select-box {
        padding: 13px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border: 2px solid rgba(210, 210, 210, 1);
        box-shadow: 0px 6px 8px 0px rgba(46, 54, 60, 0.33);
        border-radius: 6px;
        z-index: 1;
        .sys-item {
          font-size: 24px;
          border-radius: 6px;
          padding: 5px 10px;
          color: #5d5d5f;
          cursor: pointer;
          &.active {
            color: white;
            background-color: #2b83b7;
          }
        }
        .sys-item + .sys-item {
          margin-top: 10px;
        }
        .sys-item:hover {
          color: white;
          background-color: #2b83b7;
        }
      }
    }
    .flex-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .login-btn {
      width: 100%;
      height: 50px;
      margin-top: 20px;
      font-size: 18px;
    }
    .login-btn:hover {
      opacity: 0.95;
    }
    img {
      width: 150px;
      height: auto;
      margin-bottom: 40px;
    }
    .form-data {
      margin-top: 40px;
      font-family: "layicon";
      input {
        height: 50px;
        width: 100%;
        border-radius: 4px;
        border: 1px solid #dcdee2;
        padding: 0 5px;
      }
    }
    .ivu-form-item {
      margin-bottom: 30px;
    }
    .remember {
      font-size: 14px;
      cursor: pointer;
      input {
        margin-right: 5px;
        background-color: white;
      }
    }
    .forget {
      font-size: 14px;
      cursor: pointer;
    }
    .forget:hover {
      opacity: 0.85;
    }
  }
  .bottom {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 40px;
    color: #3c3e40;
  }
}
&.dark {
  background: url("../../assets/images/fixation_img/bg/login-bg-2.png");
  .login {
    background: url("../../assets/images/fixation_img/bg/login-input-box-bg2.png")
      no-repeat;
    .system-select {
      color: white;
      .select-box {
        background-color: #17172b;
        border: 2px solid rgba(3, 181, 185, 1);
        box-shadow: 0px 6px 8px 0px rgba(46, 54, 60, 0.52);
        .sys-item {
          color: white;
          &.active {
            background-color: #03b5b9;
          }
        }
        .sys-item:hover {
          color: white;
          background-color: #03b5b9;
        }
      }
    }
    input {
      border: 2px solid rgba(3, 181, 185, 1) !important;
      background: rgba(255, 255, 255, 0.4) !important;
    }
    .login-btn {
      background-color: #03b5b9;
    }
    .remember {
      color: white;
    }
    .forget {
      color: #03b5b9;
    }
  }
  .bottom {
    color: white;
  }
}
</style>
