<template>
  <div>
    <!-- 实时数据区域 -->
    <real-time-data
      @interValChange="intervalClick"
      @refresh="updateRealTimezone"
    >
      <template slot="map">
        <map-carousel
          :center="center"
          :zooms="zooms"
          :markers="markers"
          :shopData="shopData"
          :gateData="gateData"
          :window="window"
          :timingValue="$store.state.home.intervalTime"
          :id="currentMenuName"
          @markClick="selectMenuByName"
        ></map-carousel>
      </template>

      <template slot="dashboard">
        <dashBoard
          :target="monthTargetVal"
          :saleData="saleData"
          :todayEnter="todayEnter"
          :monthEnter="monthEnter"
          :dayTotalEnter="dayTotalEnter"
          ref="dashBoard"
        ></dashBoard>
      </template>

      <template slot="cards">
        <indicator-cards
          :indicatorList="kpiData"
          textName="shop-center-current"
          :propertyId="currentPropertyId"
          ref="currentKpi"
          class="groupStyle"
          :moveWidth="0.024"
        >
          <template slot-scope="{ item }">
            <singleCard
              :isShowText="true"
              :item="item"
              :innerRange="innerRange"
            ></singleCard>
          </template>
        </indicator-cards>
      </template>
    </real-time-data>
    <!-- 历史数据区域 -->
    <template>
      <!-- 历史数据指标 -->
      <div class="-mx-3 px-3 py-2">
        <indicator-cards
          :indicatorList="historyIndicators"
          :propertyId="currentPropertyId"
          ref="historyKpi"
          indicatorType="historyIndicator"
          textName="shop-center-histrry"
          scaleCards
          :defaultCountsOfCards="4"
          :moveWidth="0.013"
        >
          <template slot-scope="{ item }">
            <!-- 历史数据 卡片 列表  -->
            <!-- 平均客流量 客流峰值 总客流 集客量峰值 销售额 有效客流 -->
            <singleCard
              :isShowText="false"
              :item="item"
              :innerRange="innerRange"
              :isLiveData="false"
            ></singleCard>
          </template>
          <template>
            <template slot="title">
              <span
                class="text-xl text-black font-medium hidden sm:block"
                style="padding-left:18px"
              >
                {{ $t("历史数据查询") }}
                <Tooltip
                  :content="tootipText"
                  placement="right"
                  theme="light"
                  transfer
                  max-width="500"
                >
                  <icons type="wenhao" />
                </Tooltip>
              </span>
            </template>
            <template slot="dateSelector">
              <i-date-picker
                @selectDate="selectDate"
                :value="historyDate"
                class="mr-8 history-date-picker"
              ></i-date-picker>
            </template>
          </template>
        </indicator-cards>
      </div>
      <!-- 趋势对比 -->
<!--      <Trend-->
<!--        class="m-t-20"-->
<!--        :time1="outRange"-->
<!--        @curretIndicatorChange="-->
<!--          (val) => {-->
<!--            showTotal = !val;-->
<!--          }-->
<!--        "-->
<!--        :innerRange="innerRange"-->
<!--        :propertyId="currentPropertyId"-->
<!--        :indicatorData="trendIndicators"-->
<!--        :istotal="showTotal"-->
<!--      ></Trend>-->
      
      <TrendAnalys class="m-t-20"
                   ref="trend"
                   :date="outRange"
                   :innerRange="innerRange"></TrendAnalys>
      <!-- 排行占比 -->
      <Ranking
        :time1="outRange"
        :propertyId="currentPropertyId"
        :indicatorData="rankingIndicators"
        :defaultBizIndicator="rankingDataShowType"
        :defaultShopIndicator="rankingDataShowType"
      />
      <!-- 顾客类型数据 -->
      <customer-analytics :data="customAnalytics">
        <template slot-scope="{ item }">
          <customer-charts
            :labels="item.labels"
            :series="item.series"
            :type="item.type"
            :title="item.title"
            :tooltipUnit="$t('人')"
            :height="item.height"
            @tableChage="shopTabChange"
          >
            <export-menu
              slot="export"
              @onchange="genderExportBiztop(item.title)"
            ></export-menu>
          </customer-charts>
        </template>
      </customer-analytics>
    </template>
  </div>
</template>
<script>
import {
  realTimeData,
  mapCarousel,
  Trend,
  TrendAnalys,
  indicatorCards,
  dashBoard,
  CustomerAnalytics,
} from "../home";

// api
import {
  getCurrent,
  postHistorycompute,
  getEntityFlow,
  exportEx,
  getSaleReach,
} from "@/api/home.js";
import Ranking from "@/views/operation/components/RankingGroup.vue";
import singleCard from "@/views/home/components/singleCard.vue";
import CustomerCharts from "_c/common/CopyChartsTabs";
import { getBussinessTree } from "@/api/passenger";
import iDatePicker from "_c/common/idatepicker.vue";
import { mapMutations } from "vuex";
import Moment from "moment";
import _ from "lodash";
import { gotInnerRange, downloadEx } from "@/libs/util";
import customerNameDict from "../home/seriesDict";
import salesMixin from "../operation/salseMixin";
import salesDict from "@/views/home/components/salesIndicatorDict.js";
import exportMenu from "@/views/operation/components/ExportMenu.vue";
export default {
  name: "shoppingDashboard",
  mixins: [salesMixin],
  components: {
    TrendAnalys,
    realTimeData,
    mapCarousel,
    Ranking,
    Trend,
    indicatorCards,
    dashBoard,
    iDatePicker,
    CustomerAnalytics,
    singleCard,
    CustomerCharts,
    exportMenu,
  },
  data() {
    return {
      weathers: [],
      saleData: {},
      historyDate: [
        Moment()
          .add(-1, "d")
          .toDate(),
        Moment()
          .add(-1, "d")
          .toDate(),
      ], //历史查询时间
      rankingDataShowType: "enter",
      dayTotalEnter: 0,
      innerRange: "1h",
      outRange: "",
      clickTimeName: "l",
      center: [108.948234, 34.223579],
      zooms: [0, 18],
      markers: [],
      dashboardData: {},
      window: "",
      enterArr: [],
      windows: [],
      shopData: null,
      gateData: null,
      // showTotal: true,
      monthTargetVal: 0,
      todayEnter: 0,
      monthEnter: 0,
      kpiData: [],
      historyData: null,
      summarySalse: [],
      today: Moment().format("YYYY-MM-DD"),
      footFallTypeRes: {},
      zones: [],
      intervalId: "",
      initRes: [],
      changedMenuName: "company",
      currentMenuName: "",
      currentDayData: "",
      currentPropertyId: this.$store.state.home.headerAction,
      customChecklist: {
        new_old_proportion: {
          name: "新老顾客占比",
          chartType: ["donut"],
        },
        vip_proportion: {
          name: "VIP顾客占比",
          chartType: ["radialBar"],
        },
        arrival_distribution: {
          name: "到店次数",
          chartType: ["pie"],
        },
        age_distribution: {
          name: "年龄分布",
          chartType: ["bar"],
        },
        gender_propotion: {
          name: "性别分布",
          chartType: ["radialBar"],
        },
      },
      canshow: false,
      obj1: [],
      obj2: [],
      obj3: [],
      obj4: [],
      downloadName: "",
      cancelGetGroupOrganizationAjax: null,
      cancelGetBussinessTreeAjax: null,
      cancelGetCurrentAjax: null,
      cancelPostHistorycomputeAjax: null,
    };
  },
  computed: {
    tootipText() {
      return this.$t("passages.tootipText7");
    },
    companyId() {
      return this.$store.state.user.companyId;
    },
    shoppingCurrentId() {
      return this.$store.state.home.headerAction;
    },
    customAnalytics() {
      let tml = [];
      if (!Object.keys(this.footFallTypeRes).length) return tml;
      let data = this.footFallTypeRes;
      delete data.clerk_proportion;
      Object.keys(data).forEach((e) => {
        let chartObj = {};
        // 由于年龄性别的数据结构不一致，采用另外一种处理方式
        if (e === "gender_propotion") {
          let genderName = {
            "0": {
              name: this.$t("女性"),
              icon: "female",
            },
            "1": {
              name: this.$t("男性"),
              icon: "male",
            },
          };
          chartObj.labels = {
            name: this.$t("性别"),
            key: "gender",
            data: Object.keys(data[e]).map((e) => genderName[e].name),
            icons: Object.keys(data[e]).map((e) => genderName[e].icon),
          };
          chartObj.series = Object.values(data[e]);
        } else if (e === "age_distribution") {
          let genderName = {
            female: this.$t("女性"),
            male: this.$t("男性"),
          };
          if (Object.keys(data[e]).length <= 4) {
            chartObj.labels = {
              name: this.$t("年龄"),
              key: "age",
              data: ["少年", "青年", "中年", "老年"],
            };
          } else {
            chartObj.labels = {
              name: this.$t("年龄"),
              key: "age",
              data: Object.keys(data[e]).map((e) => {
                return this.ageNameformat(e);
              }),
            };
          }
          chartObj.series = Object.keys(genderName).map((k) => ({
            name: genderName[k],
            key: k,
            data: Object.values(data[e]).map((o) => o[k]),
          }));
        } else {
          chartObj.labels = {
            name: this.$t("类型"),
            key: e,
            data: Object.keys(data[e]).map((e) => customerNameDict[e].name),
            icons: Object.keys(data[e]).map((e) => customerNameDict[e].icon),
          };
          chartObj.series = Object.values(data[e]);
        }
        chartObj.title = this.customChecklist[e].name;
        chartObj.type = this.customChecklist[e].chartType;
        chartObj.height = this.customChecklist[e].height;
        if (e !== "vip_proportion") tml.push(chartObj);
      });
      return tml;
    },
    historyIndicators() {
      var arr = [...this.historyKpiData, ...this.summarySalse];
      return arr; // 合并数组 组成一个新的数组
    },
    rankingIndicators() {
      return {
        ...{ enter: { name: "入客流" }, dwell: { name: "停留时间" } },
        ...salesDict,
      };
    },
    filterFootfallData() {
      if (!this.historyData) return null;
      let currentData = null;
      currentData = _.find(
        this.historyData.property,
        (o) => o.property_id === this.currentMenuName
      );
      return currentData;
    },
    historyKpiData() {
      if (!this.filterFootfallData) return [];
      const { enter, occupancy, valid } = this.filterFootfallData;
      let tmlEnterKPI = this.processKPIData(enter, "enter");
      let tmlOccuKPI = _.dropRight(this.processKPIData(occupancy, "occupancy")); // 删除集客量
      if (this.clickTimeName === "y")
        return _.dropRight([...tmlEnterKPI, ...tmlOccuKPI]);
      let validObj = {
        id: "entervalid",
        name: this.$t("有效客流"),
        data: Number(valid) < 0 ? 0 : valid,
        type: {
          icon: "youxiaokeliu",
          color: "#2bd9cf",
        },
      };

      let newDate = Moment(new Date()).format("YYYY-MM-DD");
      let selectDate = this.outRange.split(",")[0];
      let selectDateTwo = this.outRange.split(",")[1];
      if (newDate == selectDate && newDate == selectDateTwo) {
        tmlEnterKPI.forEach((val) => {
          if (val.name == this.$t("Average Enter"))
            val.data = this.currentDayData.enter.avg;
          if (val.name == this.$t("fn.total", [this.$t("enter")]))
            val.data = val.data.number;
        });
      }
      tmlOccuKPI.map((list, index) => {
        if (Number(list.data.number) < 0) tmlOccuKPI[index].data.number = 0;
      });
      return [...tmlEnterKPI, ...tmlOccuKPI, ...[validObj]];
    },
    // trendIndicators() {
    //   let footfallYaxis = {
    //     enter: {
    //       name: this.$t("客流量"),
    //       yaxis: {
    //         title: {
    //           text: `${this.$t("客流量")}(${this.$t("人次")})`,
    //         },
    //         labels: {
    //           formatter(value) {
    //             return value ? value.toLocaleString() : "";
    //           },
    //         },
    //       },
    //     },
    //     occupancy: {
    //       name: this.$t("集客量"),
    //       yaxis: {
    //         title: {
    //           text: `${this.$t("集客量")}(${this.$t("人次")})`,
    //         },
    //         labels: {
    //           formatter(value) {
    //             return value ? value.toLocaleString() : "";
    //           },
    //         },
    //       },
    //     },
    //   };
    //   return { ...footfallYaxis, ...salesDict };
    // },
  },
  mounted() {
    // this.initRequest();
  },
  activated() {
    this.historyDate = [
      Moment()
        .add(-1, "d")
        .toDate(),
      Moment()
        .add(-1, "d")
        .toDate(),
    ];
    this.innerRange = "1h";
    this.initRequest();
    this.intervalClick(this.$store.state.home.intervalTime);
  },
  watch: {
    outRange() {
      // 时间选择器触发，因为历史卡片数据每次请求的是所有购物中心的数据，所以只有当时间发生变化才会触发请求
      let footfallReq = this.getHistoryComputed();
      this.querHistory(footfallReq);
    },
    shoppingCurrentId() {
      if (this.shoppingCurrentId != 0) this.initRequest();
    },
    "$store.state.home.headerAction"() {
      let routerName = this.$router.currentRoute.name;
      if (routerName === "dashboardAnalytics") {
        this.selectMenuByName();
      }
    },
  },
  methods: {
    ...mapMutations(["saveBusinessTree", "saveAllTargetData"]),
    ageNameformat(str) {
      return str
        .replace("_", "-")
        .replace("less-", this.$t("小于"))
        .replace(/more-/, this.$t("大于"));
    },
    updateMapZoneByName(name) {
      this.currentMenuName = Number(name);
      this.currentPropertyId = Number(name);
      if (this.dashboardData[name]) {
        this.shopData = this.dashboardData[name].shopData
          ? this.dashboardData[name].shopData
          : null; // 轮播图数据
      } else {
        this.shopData = null;
      }
      if (this.dashboardData[name]) {
        var dayData = _.cloneDeep(this.dashboardData[name].compute);
        this.kpiData = _.remove(dayData, function(n) {
          return n.id !== "entertotal";
        });
        let totalData = _.find(this.dashboardData[name].compute, (e) => {
          return e.id === "entertotal";
        });
        if (totalData) {
          this.dayTotalEnter = totalData.data;
        } else {
          this.dayTotalEnter = 0;
        }
        this.monthTargetVal = Number(
          this.dashboardData[name].targetValue.toFixed(0)
        ); // 当月目标数据
        this.todayEnter = this.dashboardData[name].todayEnter; // 今天实时总客流
        this.monthEnter = this.dashboardData[name].monthEnter; // 当月实时总客流
      }
    },
    selectMenuByName(name) {
      // 菜单栏被拿掉，以下代码没用了，但是，需要手动触发更新函数
      // this.changedMenuName = `${name}`// 触发菜单栏更新
      // this.$refs.headMenu.handleSelect(name.toString())
      let nameID = this.$store.state.home.headerAction;
      this.updateMapZoneByName(`${nameID}`);
    },
    mapDataInit(data) {
      const orgData = this.$store.state.home.organizationData;
      let currentData = data[0].data.data;
      let businessTreeData = data[1].data.data; // 将businessTreeData 存入store,方便其他页面访问，避免重复请求
      this.saleData = data[2].data.data;
      this.saveBusinessTree(businessTreeData);
      let propertyId = this.$store.state.home.headerAction;
      let currentMonthIndex = new Date().getMonth(); // 当月月份
      this.windows = [];
      const windows = []; // mapwindows
      // const markers = [] // mapmarkers
      let companyMonthTargetValue = 0;
      const { name: companyName } = orgData; // 集团name
      const { property: targetArr } = orgData; // 各商场的目标数据
      const { property: currentArr } = currentData; // 各商场的实时数据
      const { company: currentCompany } = currentData; // 集团的实时数据
      let allTargetData = [];
      let dashBoardObj = {};
      this.zones = [];
      try {
        let ele = _.find(targetArr, (o) => o.property_id === propertyId);
        if (ele) {
          let currentObj = _.find(currentArr, (o) => o.bzid === ele.bzid);
          let shopData = _.find(businessTreeData, (o) => o.id === ele.bzid);
          let shopCurrent;
          if (currentObj) {
            let shopEnterCurrent = this.processKPIData(
              currentObj.enter,
              "enter"
            ); // 实时客流分析数据
            let shopOccuCurrent = this.processKPIData(
              currentObj.occupancy,
              "occupancy"
            ); // 实时集客量分析数据
            shopCurrent = _.concat(shopEnterCurrent, shopOccuCurrent);
          } else {
            shopCurrent = [];
          }
          let shopTargetValue = 0;
          if (ele.goal_flow) {
            let year = new Date().getFullYear();
            ele.goal_flow.map((list) => {
              if (list.year == year) {
                allTargetData.push({
                  id: ele.bzid,
                  data: ele.goal_flow,
                  marketData: ele.goal_sale,
                });
                if (list.is_year === "year") {
                  shopTargetValue = list.flow_year / 12; // 目标值为年
                  companyMonthTargetValue += shopTargetValue;
                } else {
                  const {
                    detail: { months: everyMonth },
                  } = list;
                  shopTargetValue =
                    everyMonth[currentMonthIndex][
                      Object.keys(everyMonth[currentMonthIndex])[0]
                    ] || 0;
                  companyMonthTargetValue += shopTargetValue; // 集团当月目标值等于各商场的当月目标值
                }
              }
            });
          }
          if (currentObj) {
            this.currentDayData = currentObj;
            dashBoardObj[ele.property_id] = {
              compute: shopCurrent,
              name: ele.name,
              targetValue: shopTargetValue,
              shopData,
              todayEnter: currentObj.enter.total,
              monthEnter: currentObj.enter.month.number,
              propertyId: ele.property_id,
            };
            let dataObj = {};
            if (this.saleData.highest_sales) {
              dataObj.saleHighest = this.saleData.highest_sales.value;
              dataObj.saleHighestTimerange = this.saleData.highest_sales.timeRange;
              dataObj.saleTotal = this.saleData.sale_today;
            }
            dashBoardObj[ele.property_id] = {
              ...dashBoardObj[ele.property_id],
              ...dataObj,
            };
          } else {
            this.currentDayData = 0;
            dashBoardObj[ele.property_id] = {
              compute: shopCurrent,
              name: ele.name,
              targetValue: shopTargetValue,
              shopData,
              todayEnter: 0,
              monthEnter: 0,
              propertyId: ele.property_id,
              saleHighest: 0,
              saleHighestTimerange: 0,
              saleTotal: 0,
            };
          }
        }
      } catch (error) {
        console.log(error);
      }
      this.saveAllTargetData(allTargetData); // 将目标数据存入store 中，方便目标管理页面使用
      this.windows = windows;
      let companyTargetValue = companyMonthTargetValue;
      let firstMenuName = "";

      firstMenuName = this.$store.state.home.headerAction;
      this.dashboardData = dashBoardObj;
      this.updateMapZoneByName(firstMenuName);
    },
    processKPIData(data, type) {
      let checkNameObj = {
        enter: {
          avg: this.$t("Average Enter"),
          highest: this.$t("客流峰值"),
          total: this.$t("总客流量"),
        },
        occupancy: {
          highest: this.$t("集客峰值"),
          total: this.$t("集客量"),
        },
      };
      let icontypes = {
        total: {
          icon: type === "occupancy" ? "liuliang" : "enter_total",
          color: "#857aef",
        },
        avg: {
          icon: "avg",
          color: "#1dd9d1",
        },
        highest: {
          icon: type === "occupancy" ? "occu_highest" : "highest",
          color: "#e8585a",
        },
      };

      let tmlKPIarr = [];
      let typeCheckname = checkNameObj[type];
      for (const key in typeCheckname) {
        if (typeCheckname.hasOwnProperty(key)) {
          const element = typeCheckname[key];
          let sizeData;
          if (data[key]) {
            if (Number(data[key]) < 0) {
              sizeData = 0;
            } else {
              sizeData = data[key];
              if (sizeData.number)
                sizeData.number =
                  Number(sizeData.number) < 0 ? 0 : sizeData.number;
            }
          } else {
            sizeData = 0;
          }
          tmlKPIarr.push({
            id: type + key,
            name: element,
            data: sizeData,
            type: icontypes[key],
          });
        }
      }

      return tmlKPIarr;
    },
    selectDate(date, clickType) {
      if (date[0] == "" || this.outRange == date.toString()) return false;
      // 日期选
      this.clickTimeName = clickType;
      this.outRange = date.toString();
      this.innerRange = gotInnerRange(date);
      this.$nextTick(()=>{
        this.$refs.trend.getTrendData()
      })
     
      // 销售数据
    },
    initDateDuration() {
      let format = "YYYY-MM-DD";
      let endtime = Moment()
        .add(-1, "days")
        .format(format);
      let starttime = Moment()
        .add(-1, "days")
        .format(format);
      let dateDuration = `${starttime},${endtime}`;
      return dateDuration;
    },
    getCustom() {
      // 请求客户数据
      let params = { range: this.outRange, property_id: this.currentMenuName };
      return getEntityFlow(params);
    },
    getHistoryComputed() {
      // 历史客流指标数据查询
      let params = { companyId: this.companyId, timeRange: this.outRange };
      // 取消多余http请求
      if (typeof this.cancelPostHistorycomputeAjax === "function") {
        this.cancelPostHistorycomputeAjax();
      }
      return postHistorycompute(params, this);
    },
    intervalClick(val) {
      let time;
      switch (val) {
        case "30秒":
          time = 1000 * 30;
          break;
        case "5分钟":
          time = 1000 * 60 * 5;
          break;
        case "10分钟":
          time = 1000 * 60 * 10;
          break;
        case "20分钟":
          time = 1000 * 60 * 20;
          break;
        case "30分钟":
          time = 1000 * 60 * 30;
          break;
      }
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        if (this.$route.name === "dashboardAnalytics") {
          this.updateRealTimezone();
        } else {
          return false;
        }
      }, time);
    },
    updateRealTimezone() {
      let companyId = this.companyId; // 公司id
      Promise.all([
        getCurrent({ time: this.today, companyId, offset: 60 }),
        getSaleReach({ property_id: this.currentPropertyId }),
      ])
        .then((res) => {
          this.$set(this.initRes, 0, res[0]);
          this.$set(this.initRes, 2, res[1]);
          this.mapDataInit(this.initRes);
        })
        .catch((err) => {
          console.log(err);
        });
      // getCurrent({ time: this.today, companyId, offset: 60 }).then(res => {
      //   this.$set(this.initRes, 0, res)
      //   this.mapDataInit(this.initRes)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    async initRequest() {
      // in 1.0 version has 'company'
      this.outRange = this.initDateDuration(); // get this month's date range
      this.$nextTick(()=>{
        this.$refs.trend.getTrendData()
  
      })
      let companyId = this.companyId; // companyId
      // request orgnization and instantData of company
      if (typeof this.cancelGetBussinessTreeAjax === "function") {
        this.cancelGetBussinessTreeAjax();
      }
      if (typeof this.cancelGetCurrentAjax === "function") {
        this.cancelGetCurrentAjax();
      }
      this.initRes = await Promise.all([
        getCurrent({ time: this.today, companyId, offset: 60 }, this),
        getBussinessTree({ entity: 52 }, this),
        getSaleReach({ property_id: this.currentPropertyId }),
      ]);
      let nowBzid = this.$store.state.user.bzid;
      var resp = this.initRes[1];
      var areaList = [];
      resp.data.data.forEach(function(m) {
        if (nowBzid.indexOf(m.id) > -1) {
          m.children.forEach(function(l) {
            if (l.area) {
              l.area.forEach(function(ele) {
                let obj = {};
                obj.id = ele.id;
                obj.value = ele.id;
                obj.key = ele.id;
                obj.name = ele.name;
                obj.text = ele.name;
                obj.label = ele.name;
                areaList.push(obj);
              });
            }
          });
        }
      });
      this.$store.commit("setAreaList", areaList);

      this.mapDataInit(this.initRes); // 实时区域初始化
      // 历史区域中，趋势对比，和排行占比，通过传入props watch 请求数据，卡片部分，客户数据则是在这个组件请求数据
      // 历史销售指标数据
      this.canshow = true;
      let footfallReq = this.getHistoryComputed();
      this.querHistory(footfallReq);
    },
    async querHistory(req) {
      let reqs = [
        this.getSalesData({
          time1: this.outRange,
          propertyId: this.currentPropertyId,
        }),
        this.getCustom(),
      ];
      if (req) reqs.push(req);
      let res = await Promise.all(reqs);
      const [salesData, customData, footFallData] = res;
      this.summarySalse = salesData;
      if (customData) this.footFallTypeRes = customData.data.data;
      if (footFallData) this.historyData = footFallData.data.data;
    },
    updateHistoryRes(history, current) {
      for (const key in history.company.enter) {
        if (history.company.enter.hasOwnProperty(key)) {
          const element = history.company.enter[key];
          if (element.hasOwnProperty("lastRatio")) delete element.lastRatio;
          if (element.hasOwnProperty("ringRatio")) delete element.ringRatio;
          element.number = current.company[key].hasOwnProperty("number")
            ? current.company[key].number
            : current.company[key];
        }
      }
      history.property.forEach((element, index) => {
        for (const key in element) {
          if (element.hasOwnProperty(key)) {
            const e = element[key];
            if (key === "enter" || key === "occupancy") {
              for (const k in e) {
                if (e.hasOwnProperty(k)) {
                  const o = e[k];
                  if (o.hasOwnProperty("lastRatio")) delete o.lastRatio;
                  if (o.hasOwnProperty("ringRatio")) delete o.ringRatio;
                  o.number = current.property[index][key][k].hasOwnProperty(
                    "number"
                  )
                    ? current.property[index][key][k].number
                    : current.property[index][key][k];
                }
              }
            }
          }
        }
      });
    },
    shopTabChange(value) {
      switch (value.type) {
        case "年龄分布":
          this.obj1 = value.data;
          break;
        case "性别分布":
          this.obj2 = value.data;
          break;
        case "新老顾客占比":
          this.obj3 = value.data;
          break;
        case "到店次数":
          this.obj4 = value.data;
          break;
      }
    },
    genderExportBiztop(title) {
      switch (title) {
        case "年龄分布":
          downloadEx(exportEx, "购物中心年龄分布客流数据", this.obj1);
          break;
        case "性别分布":
          downloadEx(exportEx, "购物中心性别分布客流数据", this.obj2);
          break;
        case "新老顾客占比":
          downloadEx(exportEx, "购物中心新老顾客占比客流数据", this.obj3);
          break;
        case "到店次数":
          downloadEx(exportEx, "购物中心顾客到店次数客流数据", this.obj4);
          break;
      }
    },
  },
  deactivated() {
    this.intervalId && clearInterval(this.intervalId);
  },
};
</script>
<style>
.ivu-carousel-track,
.ivu-carousel-item {
  min-width: 100%;
}
.temperature {
  height: 100%;
  vertical-align: middle;
  font-size: 17px;
}
img {
  vertical-align: middle;
}
.ml-10 {
  margin-left: 10px;
}
</style>
<style lang="stylus" scoped>
.history-date-picker
  min-width 236px
.groupStyle.bottomcard
  padding-bottom 9px!important
  margin-top 0!important
</style>
