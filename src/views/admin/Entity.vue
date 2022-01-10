<template>
  <!-- 实体管理 -->
  <div>
    <empty-Page v-if="type == 1" @addCompany="addCompany"></empty-Page>
    <div v-if="type == 2">
      <div style="position:relative">
        <div v-if="hasCover == 3" class="hasCover">
          <img :src="noBuy" class="noBuy" />
        </div>
        <div class="topArea" v-bind:class="{ mohu: hasCover == 3 }">
          <Cascader
            :data="dataList"
            v-model="defaultValue"
            change-on-select
            @on-change="caseDidChange"
            class="cascader"
          >
          </Cascader>
          <div class="stall-header-right">
            <span
              class="stall-add"
              v-if="isSuperAdmin"
              :title="$t('添加')"
              @click="addEntity"
            >
              <Icon type="md-add" />
            </span>
            <span
              class="stall-add"
              v-if="isSuperAdmin"
              :title="$t('删除')"
              @click="delEntity"
            >
              <Icon type="md-remove" />
            </span>
          </div>
          <!-- 商场列表 -->
          <market-list
            v-if="addType === 1"
            :userLvl="userLvl"
            @imgConfig="imgConfig"
            @editMail="editMail"
            @delMail="delMail"
            ref="marketlist"
          ></market-list>
          <!-- 楼层列表 -->
          <area-list
            v-if="addType === 2"
            :userLvl="userLvl"
            @imgConfig="imgConfig"
            @editFloor="editFloor"
            @delFloor="delFloor"
            @changeDoorway="changeDoorway"
            ref="arealist"
            :floorInfo="floorInfo"
            :parent_id="parent_id"
          ></area-list>
          <!-- 商铺列表 -->
          <group-list
            v-if="addType === 3"
            :userLvl="userLvl"
            @editStore="editStore"
            @delStore="delStore"
            @changeDoorway="changeDoorway"
            :storeInfo="storeInfo"
          ></group-list>
        </div>
      </div>
      <!-- 业态管理 -->
      <formats :propertyId="addmall.property_id"></formats>
      <!-- 工作人员列表 -->
      <!-- <staff-list></staff-list> -->
    </div>
    <!-- 添加商场 -->
    <add-Entity
      v-show="showAddEntity"
      ref="entityModal"
      :addmall="addmall"
      :mallList="mallList"
      :editTitle="$t(editTitle)"
      :isEmptyPage="isEmptyPage"
      :userLvl="userLvl"
      :propertyId="addmall.property_id"
      @changeEditTitle="changeEditTitle"
      @init="init"
      @closeEdit="closeEdit"
      @getData="getData"
      @addTypeData="addTypeData"
      @addFloorData="addFloorData"
      @addStoreData="addStoreData"
      @updateTypeData="updateTypeData"
      @updateFloorData="updateFloorData"
      @updateStoreData="updateStoreData"
      v-cloak
    ></add-Entity>

    <imgconfig-modal
      ref="imgcofig"
      :title="$t('图片配置')"
      :footerHide="true"
      :width="1350"
    >
      <div class="img-config" @mousemove="handleMouseMove">
        <div class="part">
          <div
            class="img-container"
            ref="imgContainer"
            @drop.stop.prevent="handleDropOnPannel($event)"
            @dragover.stop.prevent
          >
            <img
              class="img-bg"
              ref="img"
              :src="configImage"
              v-if="configImage"
            />
            <img
              ref="img"
              class="img-bg"
              v-else
              src="../../assets/images/fixation_img/bg/placeholder.jpg"
            />
            <img
              width="27"
              height="40"
              :src="
                currentWay.id == symbol.id
                  ? require('@/assets/images/fixation_img/bg/symbol_select.png')
                  : require('@/assets/images/fixation_img/bg/symbol.png')
              "
              :key="index"
              class="symbol"
              :draggable="currentWay.id == symbol.id"
              @dragstart="handleDragStart($event, symbol.id)"
              :style="{ top: symbol.top + 'px', left: symbol.left + 'px' }"
              v-for="(symbol, index) in symbolList"
            />
            <img
              class="add-symbol"
              @click="setCoordinate"
              width="27"
              height="40"
              :style="{ top: symbol.top + 'px', left: symbol.left + 'px' }"
              src="../../assets/images/fixation_img/bg/symbol.png"
              v-show="addStatus"
            />
          </div>
          <p>{{ $t("图片建议尺寸") }}:1000×800</p>
        </div>
        <div class="part">
          <span>{{ $t("操作") }}</span>
          <span v-if="addType === 1">{{ $t("首页实体展示图配置") }}</span>
          <div class="flex-center">
            <Select
              v-if="addType === 1"
              :disabled="!isConfigDataSame"
              v-model="property"
              style="width:200px"
              @on-change="propertyChange"
            >
              <Option
                v-for="(item, index) in propertyList"
                :value="item.id"
                :key="index"
                >{{ item.name }}
              </Option>
            </Select>
            <uploadImg
              @changeImg="changeImg"
              :disabled="property === '' && addType === 1"
              v-if="currentWay.itype && currentWay.itype !== 'property'"
              :style="{ marginLeft: addType === 1 ? '20px' : '' }"
              >{{ $t("上传") }}
            </uploadImg>
          </div>
          <span v-if="addType === 1">{{ $t("首页展示图出入口坐标配置") }}</span>
          <span v-else
            >{{ floorInfo[1] && floorInfo[1].name
            }}{{ $t("下属出入口店铺坐标配置") }}</span
          >
          <div class="flex-center">
            <Select
              v-model="way"
              :disabled="!isConfigDataSame"
              style="width:160px"
              @on-change="wayChange"
            >
              <Option v-for="item in wayList" :value="item.id" :key="item.id"
                >{{ item.name }}
              </Option>
            </Select>
            <Button
              type="primary"
              style="margin-left: 20px"
              :disabled="!way"
              :loading="uploadLoading"
              @click="setClick"
            >
              {{ hasSymbol ? $t("删除坐标") : $t("放置坐标") }}
            </Button>
            <Button
              v-if="addType === 3"
              :disabled="!way"
              style="margin-left: 20px"
              @click="previewClick"
              >{{ $t("预览") }}
            </Button>
          </div>
          <div class="part" v-if="['gate', 'store'].includes(currentWay.itype)">
            <span>{{ $t("是否为热力图") }}</span>
            <i-switch
              :disabled="!way"
              :true-value="1"
              :false-value="0"
              v-model="configData.is_heatmap"
            ></i-switch>
            <span>{{ $t("是否为路径动线点") }}</span>
            <i-switch
              :disabled="!way"
              :true-value="1"
              :false-value="0"
              v-model="configData.is_keypath"
            ></i-switch>
          </div>

          <div class="btn-box">
            <Button
              type="primary"
              :disabled="!Object.keys(currentWay).length"
              @click="handleReset"
              >{{ $t("重置") }}
            </Button>
            <Button
              :disabled="isConfigDataSame"
              type="primary"
              @click="handleSave"
              :loading="saveLoading"
            >
              {{ $t("保存") }}
            </Button>
          </div>
        </div>
      </div>
    </imgconfig-modal>
    <imgconfig-modal
      ref="preview"
      :title="$t('预览')"
      :footerHide="true"
      :width="650"
    >
      <div class="flex-column">
        <div ref="viewContainer" id="viewContainer">
          <img
            v-if="cameraImageUrl"
            width="500"
            height="400"
            :src="cameraImageUrl"
          />
          <img
            width="500"
            height="400"
            v-else
            src="../../assets/images/fixation_img/bg/placeholder.jpg"
          />
          <template v-for="node in graphViewData.nodeList">
            <flow-node :id="node.id" :key="'node' + node.id" :node="node">
            </flow-node>
          </template>
        </div>
      </div>
    </imgconfig-modal>
  </div>
</template>
<script>
import { getYearList } from "@/api/operate";
import groupList from "_c/entity/groupList.vue";
import areaList from "_c/entity/areaList.vue";
import marketList from "_c/entity/marketList.vue";
import staffList from "_c/entity/staffList.vue";
import addEntity from "_c/entity/addEntity.vue";
import emptyPage from "_c/entity/components/emptyPage.vue";
import formats from "_c/entity/formats.vue";
import imgconfigModal from "_c/common/Modal.vue";
import alert from "@/components/alert.vue";
import flowNode from "./components/node";
import _ from "lodash";
import { setTimeout } from "timers";
import {
  getDataEntity,
  getbusinessDate,
  deletemall,
  deleteFloor,
  deleteData,
  configEntity,
  getConfigStructure,
  getCameraImageUrl,
} from "@/api/manager.js";
import { initMonthsData, deepTraversal, isEmpty, deepFind } from "@/libs/util";
import { getGroupOrganization } from "@/api/home.js";
import uploadImg from "_c/common/uploadImg.vue";

export default {
  name: "entity",
  provide() {
    return {
      getGateTypeList: () => this.gateTypeList,
    };
  },
  components: {
    uploadImg,
    imgconfigModal,
    groupList,
    areaList,
    marketList,
    staffList,
    addEntity,
    alert,
    emptyPage,
    formats,
    flowNode,
  },
  data() {
    return {
      type: 0,
      mallList: [],
      gateTypeList: [],
      noBuy: require("@/assets/images/pages/noBuy.png"),
      isEmptyPage: false,
      alertText: {
        title: "",
        text: "",
        bg: "",
        confirm: false,
      },
      nowEntity: [], // 当前选中的实体
      theMail: "", // 当前选中的商场
      theFloor: "", // 当前选中的楼层
      theStore: "",
      addmall: [], // 把当前购物中心传递给添加实体组件中
      delType: "",
      addType: 0,
      editTitle: "添加购物中心",
      id: "",
      entity: "",
      floor_entity: "",
      entitydata: "",
      parent_id: "",
      shoppingInfoDate: [],
      floorInfo: [],
      storeInfo: [],
      showAddEntity: false,
      treeData: [],
      cascaderCanshow: false,
      defaultValue: [],
      userLvl: "",
      currentYear: new Date().getFullYear(),
      organaizationData: {},
      // 图片配置相关数据
      addStatus: false,
      orgData: [],
      symbolList: [],
      symbol: {
        left: "",
        top: "",
      },
      propertyList: [], //展示图选项
      property: "",
      wayList: [], //配置坐标选项
      way: "",
      saveLoading: false, //保存按钮
      uploadLoading: false, //上传按钮
      switch1: true,
      switch2: true,
      configOriginData: {}, //图片配置的原始数据
      configData: {}, //图片配置的数据
      graphViewData: {
        nodeList: [],
      },
      storeImageUrl: "", //预览时显示的店铺图片
      cameraImageUrl: "",
      jsPlumb: null,
    };
  },
  created() {
    let theUser = this.$store.state.user;
    if (theUser.role_id < 3) {
      this.userLvl = theUser.role_id == 1 ? "admin" : "common_admin";
    } else {
      let menulist = JSON.parse(window.localStorage.getItem("menulist"));
      let temp = _.find(menulist, ["name", "Admin"]).subpagesList;
      temp = _.find(temp, ["name", "EntityManage"]).id + "";
      if (theUser.access.indexOf(temp) > -1) {
        this.userLvl = "common_admin";
      }
    }
  },
  watch: {
    // 监听业态变化
    "$store.state.home.bussinessDict"() {
      this.getData();
    },
  },
  computed: {
    dataList() {
      return this.treeData;
    },
    isSuperAdmin() {
      return this.$store.state.user.role_id == 1;
    },
    //图片配置的背景图
    configImage() {
      switch (this.addType) {
        case 1:
          const property = _.find(this.propertyList, (o) => {
            return o.id === this.property;
          });
          if (property) {
            if (property.itype === "company") {
              return require("@/assets/images/fixation_img/bg/map.png");
            } else {
              return property.map_url;
            }
          }
          break;
        case 2:
          if (this.floorInfo[1]) return this.floorInfo[1].map_url;
          break;
        case 3:
          return this.storeImageUrl;
          break;
      }
    },
    //当前选中的店铺或者出入口是否有symbol
    hasSymbol() {
      if (isEmpty(this.currentWay)) return false;
      return this.symbolList.some((o) => {
        return o.id == this.currentWay.id;
      });
    },
    currentWay() {
      if (this.way && this.wayList.length) {
        return (
          _.find(this.wayList, (o) => {
            return this.way == o.id;
          }) || {}
        );
      } else {
        return {};
      }
    },
    //配置图片的数据是否发生了变化
    isConfigDataSame() {
      return _.isEqual(
        JSON.stringify(this.configData),
        JSON.stringify(this.configOriginData)
      );
    },
  },
  mounted() {
    this.getData();
    this.$store.commit("setMall", { shoppingInfoDate: this.shoppingInfoDate });
  },
  methods: {
    previewClick() {
      getCameraImageUrl({ line_id: this.currentWay.id }).then((res) => {
        this.cameraImageUrl = res.data.data.screen_capture;
      });
      this.jsPlumb && this.jsPlumb.reset();
      this.$refs.preview.showModal();
      this.$nextTick(() => {
        this.formatGraphData([this.currentWay], "line");
      });
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (var i = 0; i < this.graphViewData.nodeList.length; i++) {
        let node = this.graphViewData.nodeList[i];
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(
          node.id,
          _.merge(this.jsplumbSourceOptions, {})
        );
        // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
      }
      // 初始化连线
      for (let i = 0; i < this.graphViewData.lineList.length; i++) {
        let line = this.graphViewData.lineList[i];
        let connParam = {
          source: line.from,
          target: line.to,
        };
        if (line.isLastLine) {
          connParam.overlays = [
            [
              "Arrow",
              {
                width: 10, // 箭头尾部的宽度
                length: 8, // 从箭头的尾部到头部的距离
                location: 1, // 位置，建议使用0～1之间
                direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
                foldback: 0.623, // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
              },
            ],
          ];
        }
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions);
      }
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting);
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true);
        // 初始化节点
        this.loadEasyFlow();
        this.jsPlumb.setContainer(this.$refs.viewContainer);
      });
    },
    //构造图形数据，type是polygon时需要闭合
    formatGraphData(data, type) {
      this.graphViewData = {
        nodeList: [],
        lineList: [],
      };
      const imgWidth = this.$refs.viewContainer.offsetWidth;
      const imgHeight = this.$refs.viewContainer.offsetHeight;
      data.forEach((o, i) => {
        const specification = JSON.parse(o.line_specification);
        const specificationLength = specification.length;
        for (let j = 0; j < specificationLength; j++) {
          this.graphViewData.nodeList.push({
            graphId: o.id, //图形id
            id: `${i}${j}`,
            left: Math.round(imgWidth * specification[j].x) + "px",
            top: Math.round(imgHeight * specification[j].y) + "px",
            x: specification[j].x,
            y: specification[j].y,
          });
          if (j < specificationLength - 1) {
            this.graphViewData.lineList.push({
              from: `${i}${j}`,
              to: `${i}${j + 1}`,
              graphId: o.id,
              isLastLine:
                type === "polygon" ? false : j === specificationLength - 2,
            });
          }
          if (j === specificationLength - 1) {
            if (type === "polygon") {
              //首尾相连
              this.graphViewData.lineList.push({
                from: this.graphViewData.nodeList[
                  this.graphViewData.nodeList.length - 1
                ].id,
                to: `${i}0`,
                graphId: o.id,
                isLastLine: false,
              });
            }
          }
        }
      });
      this.$nextTick(() => {
        this.jsPlumb = this.$jsPlumb.getInstance();
        this.jsPlumbInit();
      });
    },
    //保存图片配置
    handleSave() {
      this.saveLoading = true;
      let image_type;
      switch (this.addType) {
        case 1:
          image_type =
            this.currentWay.itype === "property" ? "company" : "property";
          break;
        case 2:
          image_type = "floor";
          break;
        case 3:
          image_type = "store";
          break;
      }
      let data = {};
      switch (image_type) {
        case "company":
          data.property_id = Number(this.currentWay.id.split("_")[1]);
          break;
        case "property":
          data.property_id = Number(this.property.split("_")[1]);
          data.bz_id = this.currentWay.bz_id;
          break;
        case "floor":
          data.bz_id = this.currentWay.id;
          break;
        case "store":
          data.bz_id = this.storeInfo[2].id;
          data.line_id = this.currentWay.id;
          break;
      }
      data.image_type = image_type;
      //存储的坐标点应该是symbol的指向点
      const img = this.$refs.img;
      const configData = _.cloneDeep(this.configData);
      configData.position_x = (
        (configData.position_x * img.offsetWidth + 13.5) /
        img.offsetWidth
      ).toFixed(4);
      configData.position_y = (
        (configData.position_y * img.offsetHeight + 35) /
        img.offsetHeight
      ).toFixed(4);
      data = _.merge(data, configData);
      configEntity(data)
        .then(async (res) => {
          this.$message.success(this.$t("fn.successTo", [this.$t("保存")]));
          if (this.currentWay.itype === "property") {
            const orgData = await getGroupOrganization();
            this.$store.commit("saveOrganizationData", orgData.data.data);
          }
          //保存成功之后重新拉取数据库的数据，并展示当前选择的节点
          if (this.addType === 1) {
            this.imgConfig(this.way, this.property);
          } else {
            this.imgConfig(this.way);
          }
          this.saveLoading = false;
        })
        .catch((err) => {
          this.saveLoading = false;
          this.$message.error(err);
        });
    },
    //重置图片配置
    handleReset() {
      const img = this.$refs.img;
      const symbol = this.symbolList.find((o) => {
        return o.id == this.currentWay.id;
      });
      if (symbol) {
        //本来就有坐标
        if (
          this.configOriginData.position_x > -1 &&
          this.configOriginData.position_y > -1
        ) {
          symbol.left = this.configOriginData.position_x * img.offsetWidth;
          symbol.top = this.configOriginData.position_y * img.offsetHeight;
        } else {
          //本来没有坐标，但是后来添加了坐标
          const index = this.symbolList.findIndex((o) => {
            return o.id == this.currentWay.id;
          });
          this.symbolList.splice(index, 1);
        }
      } else if (
        this.configOriginData.position_x > -1 &&
        this.configOriginData.position_y > -1
      ) {
        //本来有坐标，但是点了删除坐标时要恢复坐标
        const symbolNew = {
          id: this.currentWay.id,
          name: this.currentWay.name,
          left: this.configOriginData.position_x * img.offsetWidth,
          top: this.configOriginData.position_y * img.offsetHeight,
        };
        this.symbolList.push(symbolNew);
      }
      //重置恢复图片
      this.changeImg(this.configOriginData.map_url);
      this.configData = _.cloneDeep(this.configOriginData);
    },
    wayChange(val) {
      this.symbolList = this.getSymbolList();
      const way = _.find(this.wayList, (o) => {
        return o.id === val;
      });
      if (way) {
        this.configData = {
          position_x: way.position_x ? way.position_x : -1,
          position_y: way.position_y ? way.position_y : -1,
          is_heatmap: way.is_heatmap || 0,
          is_keypath: way.is_keypath || 0,
          map_url: this.configImage,
        };
        this.configOriginData = _.cloneDeep(this.configData);
      }
    },
    handleDragStart(e, id) {
      e.dataTransfer.setData("symbol", id);
    },
    handleDropOnPannel(event) {
      const id = event.dataTransfer.getData("symbol");
      let symbol = this.symbolList.find((o) => {
        return o.id == id;
      });
      const img = this.$refs.img;
      if (event.target.className === "symbol") {
        //如果移动距离过小，target落在symbol上
        const modalEl = document.getElementsByClassName("ivu-modal")[0];
        const imgContainer = this.$refs.imgContainer;
        const left =
          event.x - 13.5 - modalEl.offsetLeft - imgContainer.offsetLeft;
        const top = event.y - 20 - modalEl.offsetTop - imgContainer.offsetTop;
        symbol.left =
          left > img.offsetWidth - 27
            ? img.offsetWidth - 27
            : left < 0
            ? 0
            : left;
        symbol.top =
          top > img.offsetHeight - 35
            ? img.offsetHeight - 35
            : top < 0
            ? 0
            : top;
      } else {
        const left = event.offsetX - 13.5;
        const top = event.offsetY - 20;
        symbol.left =
          left > img.offsetWidth - 27
            ? img.offsetWidth - 27
            : left < 0
            ? 0
            : left;
        symbol.top =
          top > img.offsetHeight - 35
            ? img.offsetHeight - 35
            : top < 0
            ? 0
            : top;
      }
      this.configData.position_x = (symbol.left / img.offsetWidth).toFixed(4);
      this.configData.position_y = (symbol.top / img.offsetHeight).toFixed(4);
    },
    //图片配置
    async imgConfig(way, property) {
      this.propertyList = [];
      const orgData = await getConfigStructure();
      this.$refs.imgcofig.showModal();
      this.orgData = orgData.data.data;
      let floor, floorId;
      this.$nextTick(() => {
        const img = this.$refs.img;
        switch (this.addType) {
          case 1: //购物中心
            this.orgData.forEach((o) => {
              this.propertyList.push({
                ...o,
                id: `${o.itype}_${o.id}`,
              });
              if (o.children && o.children.length) {
                o.children.forEach((child) => {
                  this.propertyList.push({
                    ...child,
                    id: `${child.itype}_${child.id}`,
                  });
                });
              }
            });
            this.property = property || this.propertyList[0].id;
            this.propertyChange(this.property, way);
            break;
          case 2: //楼层
            floorId = this.floorInfo[1].id;
            floor = deepFind(
              this.orgData,
              (o) => {
                return o.bz_id === floorId;
              },
              "children"
            );
            this.wayList = _.compact(floor.store.concat(floor.gate));
            this.wayList.forEach((o) => {
              o.id = o.bz_id;
              //因为保存的时候存的是symbol的指向点，所以此时要恢复0,0,点坐标
              if (o.position_x > -1 && !isEmpty(o.position_x))
                o.position_x = (
                  (o.position_x * img.offsetWidth - 13.5) /
                  img.offsetWidth
                ).toFixed(4);
              if (o.position_y > -1 && !isEmpty(o.position_y))
                o.position_y = (
                  (o.position_y * img.offsetHeight - 35) /
                  img.offsetHeight
                ).toFixed(4);
            });
            this.way = way || this.wayList[0].id;
            this.wayChange(this.way);
            break;
          case 3:
            floorId = this.floorInfo[1].id;
            floor = deepFind(
              this.orgData,
              (item) => {
                return item.bz_id === floorId;
              },
              "children"
            );
            const storeId = this.storeInfo[2].id;
            const store = floor.store.find((o) => {
              return o.bz_id === storeId;
            });
            this.storeImageUrl = store.map_url;
            this.wayList = store.line || [];
            this.way = way || (this.wayList[0] && this.wayList[0].id);
            this.wayChange(this.way);
            break;
        }
      });
    },
    changeImg(img) {
      switch (this.addType) {
        case 1:
          const property = _.find(this.propertyList, (o) => {
            return o.id === this.property;
          });
          property.map_url = img;
          break;
        case 2:
          if (this.floorInfo[1]) this.floorInfo[1].map_url = img;
          break;
        case 3:
          this.storeImageUrl = img;
      }

      this.configData.map_url = img;
    },
    //点击放置坐标
    setClick(e) {
      if (this.hasSymbol) {
        //删除坐标
        const index = this.symbolList.findIndex((o) => {
          return o.id === this.currentWay.id;
        });
        this.symbolList.splice(index, 1);
        this.configData.position_x = -1; //'-1'代表删除了当前点
        this.configData.position_y = -1;
      } else {
        //放置坐标
        this.addStatus = true;
        const modalEl = document.getElementsByClassName("ivu-modal")[0];
        const imgContainer = this.$refs.imgContainer;
        this.symbol.left =
          e.x - 13.5 - modalEl.offsetLeft - imgContainer.offsetLeft;
        this.symbol.top = e.y - 20 - modalEl.offsetTop - imgContainer.offsetTop;
        this.symbol.name = this.currentWay.name;
        this.symbol.id = this.currentWay.id;
      }
    },
    handleMouseMove(e) {
      if (this.addStatus) {
        const modalEl = document.getElementsByClassName("ivu-modal")[0];
        const imgContainer = this.$refs.imgContainer;
        this.symbol.left =
          e.x - 13.5 - modalEl.offsetLeft - imgContainer.offsetLeft;
        this.symbol.top = e.y - 20 - modalEl.offsetTop - imgContainer.offsetTop;
      }
    },
    setCoordinate() {
      const width = this.$refs.img.offsetWidth;
      const height = this.$refs.img.offsetHeight;
      if (
        this.symbol.left < width - 13.5 &&
        this.symbol.left > -13.5 &&
        this.symbol.top > -35 &&
        this.symbol.top < height - 35
      ) {
        //在范围内
        this.configData.position_x = (this.symbol.left / width).toFixed(4);
        this.configData.position_y = (this.symbol.top / height).toFixed(4);
        this.symbolList.push(_.cloneDeep(this.symbol));
        this.addStatus = false;
      } else {
        console.log("cc");
      }
    },
    propertyChange(val, way) {
      const img = this.$refs.img;
      if (val.indexOf("company") > -1) {
        //选择的是集团
        //wayList是集团下的购物中心
        this.wayList = _.cloneDeep(this.propertyList).splice(1);
      } else {
        //选择的是购物中心
        const value = val.split("_");
        //waylist 是购物中心下的所有出入口gate
        console.log(_.cloneDeep(this.orgData));
        this.wayList = [];
        deepTraversal(this.orgData, "children", (o) => {
          if (o.itype === value[0] && o.id === Number(value[1])) {
            if (o.children && o.children.length) {
              const gateList = o.children.map((child) => {
                return child.gate;
              });
              this.wayList = _.compact(gateList.flat());
            }
          }
        });
        if (!this.wayList.length) {
          this.way = "";
          this.$message.warning(this.$t("notices.configGate"));
          return;
        }
      }
      this.wayList.forEach((o) => {
        if (val.indexOf("company") === -1) o.id = o.bz_id;
        //因为保存的时候存的是symbol的指向点，所以此时要恢复0,0,点坐标
        if (o.gate_position_x > -1 && !isEmpty(o.gate_position_x)) {
          o.position_x = (
            (o.gate_position_x * img.offsetWidth - 13.5) /
            img.offsetWidth
          ).toFixed(4);
        } else {
          o.position_x = o.gate_position_x;
        }
        if (o.gate_position_y > -1 && !isEmpty(o.gate_position_y)) {
          o.position_y = (
            (o.gate_position_y * img.offsetHeight - 35) /
            img.offsetHeight
          ).toFixed(4);
        } else {
          o.position_y = o.gate_position_y;
        }
      });
      this.way = way || this.wayList[0].id;
      console.log("change");
      this.wayChange(this.way);
    },
    getSymbolList() {
      if (!this.wayList.length) return;
      const wayList = this.wayList.filter((o) => {
        return (
          o.position_x > -1 &&
          o.position_y > -1 &&
          !isEmpty(o.position_x) &&
          !isEmpty(o.position_y)
        );
      });
      const img = this.$refs.img;
      return wayList.map((o) => {
        return {
          id: o.id,
          name: o.name,
          left: Number(o.position_x) * img.offsetWidth,
          top: Number(o.position_y) * img.offsetHeight,
        };
      });
    },
    addCompany() {
      this.showAddEntity = true;
      this.$refs.entityModal.gettype();
    },
    changeEditTitle(value) {
      this.editTitle = value;
    },
    /*
     *@params1: pArray:级联数据
     *@description:格式化级联数据
     *@author: shiyulong
     *@date: 2019-05-16 17:54:45
     */
    addValuesToEle(pArray) {
      let that = this;
      // this.$vs.loading.close()
      // this.$store.commit('loadingState', false)
      return pArray.map(function(ele) {
        ele.value = ele.id;
        ele.label = ele.name;
        if (_.has(ele, "children") && !_.isNull(ele.children)) {
          that.addValuesToEle(ele.children);
        }
        return ele;
      });
    },
    getData() {
      this.id = this.$route.params.id;
      getDataEntity()
        .then((res) => {
          this.entity = res.data.data.zone_type[0].id;
          this.floor_entity = res.data.data.zone_type[1].id;
          this.gateTypeList = res.data.data.gate_type;
          getbusinessDate(52).then((resd) => {
            if (resd.data.code == 200) {
              this.type = resd.data.data.length > 0 ? 2 : 1;
              this.isEmptyPage = false;
              let temp = resd.data.data;
              if (this.$store.state.user.role_id < 3) {
                this.treeData = this.addValuesToEle(temp);
              } else {
                let checklist = this.$store.state.user.checklist;
                if (checklist) {
                  temp = temp.map((mm) => {
                    if (checklist.indexOf(mm.property_id) > -1) return mm;
                  });
                }
                this.treeData = this.addValuesToEle(temp);
              }
              this.cascaderCanshow = true;
              if (this.defaultValue.length === 0) {
                if (this.treeData[0]) {
                  this.defaultValue = [this.treeData[0].value];
                  this.caseDidChange(
                    [this.treeData[0].value],
                    [this.treeData[0]]
                  );
                }
              } else {
                let dataArr = [];
                let propertyData, floorData, storeData;
                this.defaultValue.forEach((list, index) => {
                  switch (index) {
                    case 0:
                      propertyData = _.find(this.treeData, (val) => {
                        return val.value === list;
                      });
                      dataArr.push(propertyData);
                      break;
                    case 1:
                      floorData = _.find(propertyData.children, (val) => {
                        return val.value === list;
                      });
                      dataArr.push(floorData);
                      break;
                    case 2:
                      storeData = _.find(floorData.children, (val) => {
                        return val.value === list;
                      });
                      dataArr.push(storeData);
                      break;
                  }
                });
                this.caseDidChange(this.defaultValue, dataArr);
              }
              this.mallList = this.treeData;
            } else {
              this.type = 1;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    caseDidChange(value, selectedData) {
      let that = this;
      that.nowEntity = selectedData;
      that.addmall = _.find(that.treeData, ["id", selectedData[0].id]);
      if (value.length == 0) {
        that.addType = 0;
      } else if (value.length == 1) {
        getGroupOrganization().then((res) => {
          if (res.data.code == 200) {
            that.$store.commit("saveOrganizationData", res.data.data);
            this.organaizationData = _.cloneDeep(res.data.data);
            var shopping = res.data.data.property;
            for (var i = 0; i < shopping.length; i++) {
              if (selectedData[0].property_id == shopping[i].property_id) {
                that.shoppingInfoDate = shopping[i];
                that.$store.commit("setMall", {
                  shoppingInfoDate: that.shoppingInfoDate,
                });
                if (that.$refs.marketlist != undefined) {
                  that.$refs.marketlist.init();
                }
              }
            }
            that.addType = 1;
          }
        });
      } else if (value.length == 2) {
        that.floorInfo = selectedData;
        that.parent_id = value;
        that.addType = 2;
      } else if (value.length == 3) {
        that.storeInfo = selectedData;
        this.addType = 3;
      } else if (value.length == 4) {
        this.addType = 4;
      }
    },
    addTypeData(res) {
      if (this.isEmptyPage) {
        this.type = 2;
      }
      this.getData();
      this.treeData.push(res);
    },
    updateTypeData(res) {
      var index = _.findIndex(this.treeData, ["id", res.id]);
      res.children = this.treeData[index].children;
      this.treeData.splice(index, 1);
      this.treeData.push(res);
      this.getData();
    },
    /*
     *@method 新增楼层后修改级联数据
     *@param {int} id 楼层的parent_id
     *@param {obj} res 新增后的楼层的信息
     */
    addFloorData(id, res) {
      var index = _.findIndex(this.treeData, ["id", id]);
      this.treeData[index].children.push(res);
      this.treeData[index].children = _.orderBy(this.treeData[index].children, [
        "zone_index",
      ]);
      this.getData();
    },
    addStoreData(mallId, floorId, res) {
      var mallIndex = _.findIndex(this.treeData, ["id", mallId]);
      var floorIndex = _.findIndex(this.treeData[mallIndex].children, [
        "id",
        floorId,
      ]);
      if (this.treeData[mallIndex].children[floorIndex].children == undefined) {
        this.treeData[mallIndex].children[floorIndex].children = [];
      }
      this.treeData[mallIndex].children[floorIndex].children.push(res);
      this.getData();
    },
    updateStoreData(mallId, floorId, res) {
      var mallIndex = _.findIndex(this.treeData, ["id", mallId]);
      var floorIndex = _.findIndex(this.treeData[mallIndex].children, [
        "id",
        floorId,
      ]);
      var storeIndex = _.findIndex(
        this.treeData[mallIndex].children[floorIndex].children,
        ["id", res.id]
      );
      var storeInfo = _.cloneDeep(this.storeInfo);
      storeInfo[2] = res;
      this.storeInfo = storeInfo;
      this.treeData[mallIndex].children[floorIndex].children.splice(
        storeIndex,
        1,
        res
      );
      this.getData();
    },
    /*
     *@method 编辑楼层后修改级联数据
     *@param {int} id 楼层的parent_id
     *@param {obj} res 编辑后的楼层的信息
     */
    updateFloorData(id, res) {
      var index = _.findIndex(this.treeData, ["id", id]); // 找到楼层父类
      var index2 = _.findIndex(this.treeData[index].children, ["id", res.id]); // 找到楼层在父类中的index
      this.treeData[index].children.splice(index2, 1, res); // 替换级联楼层信息
      this.treeData[index].children = _.orderBy(this.treeData[index].children, [
        "zone_index",
      ]); // 排序
      this.floorInfo.splice(1, 1, res); // 替换该楼层信息
    },
    closeEdit() {
      this.showAddEntity = false;
    },
    init() {
      this.$refs.marketlist.init();
    },
    addEntity() {
      this.showAddEntity = true;
      this.$refs.entityModal.gettype();
      // this.editTitle = '添加购物中心';
      var that = this;
      let formValidate = {
        spc: this.addType === 1 ? 2 : this.addType,
        name: "",
        floor: "",
        timerange: ["", ""],
        zones: [],
        province: "",
        city: "",
        address: "",
        parentNode: "",
        description: "",
        modal5: "",
        area: "",
      };
      this.$nextTick(() => {
        that.$refs.entityModal.isModify = false;
        that.$refs.entityModal.disabledSpc = false;
        that.$refs.entityModal.getSelectValue(formValidate.spc);
        that.$refs.entityModal.disabledFloor = false;
        that.$refs.entityModal.disabledParentNode = false;
        that.$refs.entityModal.disabledZones = false;
        that.$refs.entityModal.formValidate = formValidate;
        that.$refs.entityModal.sumFlowYear = "";
        that.$refs.entityModal.sumSaleYear = "";
        that.$refs.entityModal.setSaleYearGoal();
        let monthsGoal = initMonthsData("name", "modal");
        let monthsSale = _.cloneDeep(monthsGoal);
        that.$refs.entityModal.monthsGoal = monthsGoal;
        that.$refs.entityModal.monthsSale = monthsSale;
      });
    },
    editFloor(values) {
      var value = _.cloneDeep(values);
      this.editTitle = "编辑楼层";
      var that = this;
      value.description = value.describe;
      value.parentNode = value.parent_id;
      value.floor = value.zone_index;
      value.spc = 2;
      that.$refs.entityModal.formValidate = value;
      that.$refs.entityModal.isModify = true;
      that.$refs.entityModal.getSelectValue(2);
      that.$refs.entityModal.disabledSpc = true;
      that.$refs.entityModal.disabledFloor = false;
      that.$refs.entityModal.disabledParentNode = false;
      that.$refs.entityModal.disabledZones = false;
      this.showAddEntity = true;
    },
    editStore(values) {
      var value = _.cloneDeep(values);
      this.editTitle = "编辑商铺";
      var that = this;
      value.description = value.describe;
      value.parentNode = value.parent_id;
      value.floor = value.zone_index;
      value.spc = 3;
      that.$refs.entityModal.isModify = true;
      that.$refs.entityModal.getSelectValue(3);
      that.$refs.entityModal.formValidate = value;
      that.$refs.entityModal.disabledSpc = true;
      that.$refs.entityModal.disabledFloor = true;
      that.$refs.entityModal.disabledParentNode = true;
      that.$refs.entityModal.disabledZones = true;
      that.$refs.entityModal.disabledModal5 = false;
      this.showAddEntity = true;
      this.$refs.entityModal.gettype();
    },
    editMail(values) {
      var value = _.cloneDeep(values);
      value.area = value.goal_sale[0].area_size;
      this.showAddEntity = true;
      this.editTitle = "编辑购物中心";
      var that = this;
      let timerange = [];
      timerange.push(value.daily_start);
      timerange.push(value.daily_end);
      value.timerange = timerange;

      value.province = isNaN(Number(value.province))
        ? 0
        : Number(value.province);
      value.city = isNaN(Number(value.city)) ? 0 : Number(value.city);
      var zones = [];
      if (value.zone_id) {
        var zone_id = _.cloneDeep(value.zone_id).split(",");
        zones = zone_id.map(Number);
      } else {
        zones = [];
      }
      value.zones = zones;
      setTimeout(() => {
        that.$refs.entityModal.isModify = true;
        that.$refs.entityModal.currentYear = this.currentYear;
        let goal_flow = value.goal_flow;
        let goal_sale = value.goal_sale;
        let sumFlowYear = null;
        let sumSaleYear = null;
        that.$refs.entityModal.getSelectValue(1);
        // 获取当年的客流目标
        const currentYearGoalFlow = goal_flow.find((f) => {
          return f.year === this.currentYear;
        });
        if (currentYearGoalFlow.is_year == "year") {
          that.$refs.entityModal.disabled = true;
          sumFlowYear = currentYearGoalFlow.flow_year;
          that.$refs.entityModal.sumFlowYear = sumFlowYear;
          that.$refs.entityModal.setFlowYearGoal();
        } else {
          that.$refs.entityModal.disabled = false;
          sumFlowYear = currentYearGoalFlow.flow_year;
          that.$refs.entityModal.sumFlowYear = sumFlowYear;
          that.$refs.entityModal.setFlowMonthGoal();
        }
        var monthFlow = currentYearGoalFlow.detail.months;
        var monthFlowData = [];
        monthFlow.forEach(function(m) {
          monthFlowData.push(Object.values(m)[0]);
        });
        let monthsGoal = initMonthsData("name", "modal");
        monthsGoal.forEach(function(m, index) {
          m.modal = monthFlowData[index];
        });
        // 获取当年的销售目标
        const currentYearGoalSale = goal_sale.find((s) => {
          return s.year === this.currentYear;
        });
        if (currentYearGoalSale.is_year == "year") {
          that.$refs.entityModal.disabledSale = true;
          sumSaleYear = currentYearGoalSale.sale_year;
          that.$refs.entityModal.sumSaleYear = sumSaleYear;
          that.$refs.entityModal.setSaleYearGoal();
        } else {
          that.$refs.entityModal.disabledSale = false;
          sumSaleYear = currentYearGoalSale.sale_year;
          that.$refs.entityModal.sumSaleYear = sumSaleYear;
          that.$refs.entityModal.setSaleMonthGoal();
        }
        var monthSale = currentYearGoalSale.detail.months;
        var monthSaleData = [];
        monthSale.forEach(function(m) {
          monthSaleData.push(Object.values(m)[0]);
        });
        let monthsSale = initMonthsData("name", "modal");
        monthsSale.forEach(function(m, index) {
          m.modal = monthSaleData[index];
        });
        that.$refs.entityModal.monthsGoal = monthsGoal;
        that.$refs.entityModal.monthsSale = monthsSale;
        value.spc = 1;
        that.$refs.entityModal.changeProvince(value.province);
        that.$refs.entityModal.formValidate = value;
        that.$refs.entityModal.isModify = true;
        that.$refs.entityModal.disabledSpc = true;
      }, 200);
    },
    delMail(value, alertText, obj) {
      this.$alert({
        content: this.$t("确认删除此购物中心信息？"),
        cancel() {},
        confirm: () => {
          deletemall("mall", obj.property_id, obj.bzid).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(this.$t("删除成功"));
              this.defaultValue = [];
              this.getData();
            }
          });
        },
      });
    },
    delFloor(obj) {
      this.$alert({
        content: this.$t("确认删除此楼层信息？"),
        cancel() {},
        confirm: () => {
          deleteFloor("floor", obj.id).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(this.$t("删除成功"));
              this.defaultValue = [this.defaultValue[0]];
              this.getData();
            }
          });
        },
      });
    },
    delStore(value, alertText, obj) {
      this.$alert({
        content: this.$t("确认删除此商铺？"),
        cancel() {},
        confirm: () => {
          deleteData(obj.id).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(this.$t("删除成功"));
              this.defaultValue = [this.defaultValue[0], this.defaultValue[1]];
              this.addType = 2;
              this.getData();
            }
          });
        },
      });
    },
    delEntity() {
      if (this.nowEntity.length === 1) {
        this.theMail = this.addmall;
        this.theMail.bzid = this.theMail.id;
        this.$alert({
          content: this.$t("确认删除此购物中心信息？"),
          cancel() {},
          confirm: () => {
            var property_id = this.theMail.property_id;
            var bzid = this.theMail.bzid;
            deletemall("mall", property_id, bzid).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(this.$t("删除成功"));
                this.defaultValue = [];
                this.getData();
              }
            });
          },
        });
      } else if (this.nowEntity.length === 2) {
        this.$alert({
          content: this.$t("确认删除此楼层信息？"),
          cancel() {},
          confirm: () => {
            deleteFloor("floor", this.defaultValue[1]).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(this.$t("删除成功"));
                this.defaultValue = [this.defaultValue[0]];
                this.getData();
              }
            });
          },
        });
      } else if (this.nowEntity.length === 3) {
        this.$alert({
          content: this.$t("确认删除此商铺？"),
          cancel() {},
          confirm: () => {
            deleteData(this.defaultValue[2]).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(this.$t("删除成功"));
                this.defaultValue = [
                  this.defaultValue[0],
                  this.defaultValue[1],
                ];
                this.addType = 2;
                this.getData();
              }
            });
          },
        });
      } else {
        this.$message.warning(this.$t("请选择商场/楼层/店铺"));
      }
    },
    changeDoorway() {
      this.getData();
    },
  },
};
</script>

<style scoped lang="scss">
.topArea {
  .ivu-input {
    font-size: 14px;
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }

  position: relative;
  padding: 32px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 9px 1px rgba(175, 175, 176, 0.25);
  -moz-box-shadow: 0px 2px 9px 1px rgba(175, 175, 176, 0.25);
  -webkit-box-shadow: 0px 2px 9px 1px rgba(175, 175, 176, 0.25);
  border-radius: 6px;
  -moz-border-radius: 6px;
  -webkit-border-radius: 6px;

  .stall-header-right {
    position: absolute;
    top: 40px;
    right: 20px;
    margin-top: 3.5px;

    span {
      float: left;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      text-align: center;
      font-size: 16px;
      color: #fff;
      margin-left: 20px;
      cursor: pointer;
      margin-top: 9px;
      background-color: #00a0e9;

      &:nth-child(1) {
        margin-top: 9px;
        background-color: #2bd9cf;
      }

      &:nth-child(2) {
        margin-top: 9px;
        background-color: #feb33d;
      }
    }
  }

  .entity-query {
    width: 103px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid rgba(0, 160, 233, 1);
    border-radius: 6px;
    -moz-border-radius: 6px;
    -webkit-border-radius: 6px;
    float: left;
    margin-left: 45px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(0, 160, 233, 1);
    cursor: pointer;
  }
}

.cascader {
  width: 230px;

  .ivu-input-wrapper {
    width: 100%;

    .ivu-input {
      width: 230px;
      height: 43px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      font-family: "source_han_sans_cn", "Roboto", sans-serif;
    }
  }
}

[v-cloak] {
  display: none;
}

.img-config {
  display: flex;
  align-items: start;

  .add-symbol {
    position: absolute;
    cursor: pointer;
    z-index: 9999999999999999;
  }

  .part:nth-child(1) {
    width: 65%;
  }

  .part:nth-child(2) {
    flex: 1;
  }

  .part {
    display: flex;
    flex-direction: column;

    span {
      font-size: 14px;
    }

    .img-container {
      position: relative;
      font-size: 0;

      .img-bg {
        width: 100%;
        height: 500px;
      }

      .symbol {
        position: absolute;
      }
    }

    .flex-center {
      display: flex;
      align-items: center;
    }

    .btn-box {
      text-align: right;
      margin-top: 20px;

      > * + * {
        margin-left: 20px;
      }
    }

    > * + * {
      margin-top: 10px;
    }
  }

  .part + .part {
    margin-left: 20px;
  }
}

#viewContainer {
  position: relative;
  width: 100%;

  img {
    margin: 0 auto;
  }
}
</style>
