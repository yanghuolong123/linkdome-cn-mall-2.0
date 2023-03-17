<template>
	<!-- 实体管理 -->
	<div>
		<div class="content flex-column">
			<div class="basic-info flex-column common-card">
				<div class="top flex-between">
					<el-cascader
						:options="treeData"
						:props="cascadeProps"
						v-model="defaultValue"
						@change="caseDidChange"
						class="cascader"
					>
					</el-cascader>
					<div class="icon-area flex-center">
            <span
							v-if="isSuperAdmin"
							:title="$t('添加')"
							@click="addEntity"
						>
              <Icon type="md-add"/>
            </span>
					</div>
				
				</div>
				<!-- 商场列表 -->
				<market-list
					v-if="currentEntityType === 'mall'"
					:userLvl="userLvl"
					@imgConfig="imgConfig"
					@editMail="editMall"
					ref="marketlist"
				></market-list>
				<!-- 楼层列表 -->
				<area-list
					v-if="currentEntityType === 'floor'"
					:tree="originTreeData"
					:userLvl="userLvl"
					@imgConfig="imgConfig"
					@editFloor="editEntity"
					@delFloor="deleteEntity"
					@changeDoorway="changeDoorway"
					ref="arealist"
					:entityInfo="floorInfo"
				></area-list>
				<!-- 商铺列表 -->
				<group-list
					v-if="currentEntityType === 'store'"
					:userLvl="userLvl"
					@editStore="editEntity"
					@delStore="delStore"
					@changeDoorway="changeDoorway"
					:storeInfo="storeInfo"
				></group-list>
				<!--其他实体-->
				<area-list v-if="currentEntityType === 'other'"
									 ref="otherList"
									 @editFloor="editEntity"
									 @refresh="getData"
									 :tree="originTreeData"
									 @delFloor="deleteEntity"
									 @changeDoorway="changeDoorway"
									 :userLvl="userLvl"
									 :entityInfo="entityInfo"></area-list>
			</div>
			<!-- 业态管理 -->
			<formats></formats>
		</div>
		<!-- 添加商场 -->
		<add-Entity
			ref="entityModal"
			:userLvl="userLvl"
			@updateSuc="updateSuc"
			@addSuc="addSuc"
			@init="init"
			v-cloak
		></add-Entity>
		<edit-mall ref="shopmall"
							 :userLvl="userLvl"
							 @init="init"
							 @updateTypeData="getData"></edit-mall>
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
							@click="symbolClick(symbol)"
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
					<p>{{ $t('图片建议尺寸') }}:1000×800</p>
				</div>
				<div class="part">
					<span>{{ $t('操作') }}</span>
					<span v-if="currentEntityType === 'mall'">{{ $t('首页实体展示图配置') }}</span>
					<div class="flex-center">
						<Select
							v-if="currentEntityType === 'mall'"
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
							:disabled="property === '' && currentEntityType === 'mall'"
							v-if="currentWay.type_name && currentWay.type_name !== 'mall'"
							:style="{ marginLeft: currentEntityType === 'mall' ? '20px' : '' }"
						>{{ $t('上传') }}
						</uploadImg>
					</div>
					<span v-if="currentEntityType === 'mall'">{{ $t('首页展示图出入口坐标配置') }}</span>
					<span v-else
					>{{ floorInfo && floorInfo.name
            }}{{ $t('下属出入口店铺坐标配置') }}</span
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
							{{ hasSymbol ? $t('删除坐标') : $t('放置坐标') }}
						</Button>
						<Button
							v-if="currentEntityType === 'store'"
							:disabled="!way"
							style="margin-left: 20px"
							@click="previewClick"
						>{{ $t('预览') }}
						</Button>
					</div>
					<div class="part" v-if="['gate', 'store'].includes(currentWay.type_name)">
						<span>{{ $t('是否为热力图') }}</span>
						<i-switch
							:disabled="!way"
							:true-value="1"
							:false-value="0"
							v-model="configData.is_heatmap"
						></i-switch>
						<span>{{ $t('是否为路径动线点') }}</span>
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
						>{{ $t('重置') }}
						</Button>
						<Button
							:disabled="isConfigDataSame"
							type="primary"
							@click="handleSave"
							:loading="saveLoading"
						>
							{{ $t('保存') }}
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
  import groupList from '_c/entity/groupList.vue'
  import areaList from '_c/entity/areaList.vue'
  import marketList from '_c/entity/marketList.vue'
  import addEntity from '_c/entity/addEntity.vue'
  import editMall from '_c/entity/components/editMall.vue'
  import formats from '_c/entity/formats.vue'
  import imgconfigModal from '_c/common/Modal.vue'
  import flowNode from './components/node'
  import _ from 'lodash'
  import {
    getDataEntity,
    configEntity,
    getCameraImageUrl,
    delEntity
  } from '@/api/manager.js'
  import { initMonthsData, deepTraversal, isEmpty, deepFind, filterTreeByType,findParentNodes } from '@/libs/util'
  import { getGroupOrganization, getBzoneTree } from '@/api/home.js'
  import uploadImg from '_c/common/uploadImg.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'entity',
    provide () {
      return {
        getGateTypeList: () => this.gateTypeList,
      }
    },
    components: {
      uploadImg,
      imgconfigModal,
      groupList,
      areaList,
      marketList,
      addEntity,
      formats,
      flowNode,
      editMall
    },
    data () {
      return {
        gateTypeList: [],
        id: '',
        floorInfo: {},
        storeInfo: {},
        entityInfo: {},
        treeData: [],
        cascadeProps: {
          multiple: false,
          checkStrictly: true,
          expandTrigger: 'hover',
          value: 'id',
          label: 'name'
        },
        originTreeData:[],//未经过滤的bzoneTree
        cascaderCanshow: false,
        defaultValue: [],
        userLvl: '',
        currentYear: new Date().getFullYear(),
        organaizationData: {},
        // 图片配置相关数据
        addStatus: false,
        orgData: [],
        symbolList: [],
        symbol: {
          left: '',
          top: '',
        },
        propertyList: [], //展示图选项
        property: '',
        wayList: [], //配置坐标选项
        way: '',
        saveLoading: false, //保存按钮
        uploadLoading: false, //上传按钮
        switch1: true,
        switch2: true,
        configOriginData: {}, //图片配置的原始数据
        configData: {}, //图片配置的数据
        graphViewData: {
          nodeList: [],
        },
        storeImageUrl: '', //预览时显示的店铺图片
        cameraImageUrl: '',
        jsPlumb: null,

      }
    },
    created () {
      let theUser = this.$store.state.user
      if (theUser.role_id < 3) {
        this.userLvl = theUser.role_id == 1 ? 'admin' : 'common_admin'
      } else {
        let menulist = JSON.parse(window.localStorage.getItem('menulist'))
        let temp = _.find(menulist, ['name', 'Admin']).subpagesList
        temp = _.find(temp, ['name', 'EntityManage']).id + ''
        if (theUser.access.indexOf(temp) > -1) {
          this.userLvl = 'common_admin'
        }
      }
    },
    watch: {
      // 监听业态变化
      '$store.state.home.bussinessDict' () {
        this.getData()
      },
    },
    computed: {
      ...mapState({
        propertyId: state => state.home.headerAction,
        organizationData: state => state.home.organizationData,
        shoppingInfoDate: state => state.user.shoppingInfoDate,
        companyId: state => state.user.companyId
      }),
      currentEntityType () {        //判断当前选择的实体类型
        let type
        if (this.defaultValue.length) {
          const node = deepFind(this.treeData, o => {
            return o.id === this.defaultValue[this.defaultValue.length - 1]
          })
          if (node) {
            type = node.type_name
          }
        }
        return type
      },
      isSuperAdmin () {
        return Number(this.$store.state.user.role_id) === 1
      },
      //图片配置的背景图
      configImage () {
        switch (this.currentEntityType) {
          case 'mall':
            const property = _.find(this.propertyList, (o) => {
              return o.id === this.property
            })
            if (property) {
              if (property.type_name === 'company') {
                return require('@/assets/images/fixation_img/bg/map.png')
              } else {
                return property.map_url
              }
            }
            break
          case 'floor':
            if (this.floorInfo) return this.floorInfo.map_url
            break
          case 'store':
            return this.storeImageUrl
            break
        }
      },
      //当前选中的店铺或者出入口是否有symbol
      hasSymbol () {
        if (isEmpty(this.currentWay)) return false
        return this.symbolList.some((o) => {
          return o.id == this.currentWay.id
        })
      },
      currentWay () {
        if (this.way && this.wayList.length) {
          return (
            _.find(this.wayList, (o) => {
              return this.way == o.id
            }) || {}
          )
        } else {
          return {}
        }
      },
      //配置图片的数据是否发生了变化
      isConfigDataSame () {
        return _.isEqual(
          JSON.stringify(this.configData),
          JSON.stringify(this.configOriginData)
        )
      },
    },
    mounted () {
      this.getData()
      this.getDic()
      this.$store.commit('setMall', { shoppingInfoDate: this.shoppingInfoDate })
    },
    methods: {
      updateSuc(data){
        let node = deepFind( this.treeData,o=>{
          return o.id === data.id
				})
        node = Object.assign(node,data)
        this.originTreeData = Object.assign(this.originTreeData,this.treeData)
				this.getData()
      },
      addSuc(data){
        let node = deepFind( this.treeData,o=>{
          return o.id === data.parent_id
        })
        if(Array.isArray(node.children)){
          node.children.push(data)
        }else {
          this.$set(node,'children', [data])
        }
        this.originTreeData = Object.assign(this.originTreeData,this.treeData)
			},
      deleteEntity (data) {
        this.$alert({
          content: this.$t('确认删除此实体信息？'),
          cancel () {
          },
          confirm: () => {
            delEntity(data.id).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(this.$t('删除成功'))
                this.defaultValue = [this.defaultValue[0]]
                this.getData()
              }else {
                this.$message.error(res.data.msg)
              }
            })
          },
        })
      },
      editEntity (data) {
        this.$refs.entityModal.formValidate = Object.assign(this.$refs.entityModal.formValidate,data)
        this.$refs.entityModal.formValidate.parentNode = findParentNodes(data.id,this.treeData)
        this.$refs.entityModal.isModify = true
				this.$refs.entityModal.showModal()

      },

      symbolClick (symbol) {
        this.way = symbol.id
        this.wayChange(this.way)
      },
      previewClick () {
        getCameraImageUrl({ line_id: this.currentWay.id }).then((res) => {
          this.cameraImageUrl = res.data.data.screen_capture
        })
        this.jsPlumb && this.jsPlumb.reset()
        this.$refs.preview.showModal()
        this.$nextTick(() => {
          this.formatGraphData([this.currentWay], 'line')
        })
      },
      // 加载流程图
      loadEasyFlow () {
        // 初始化节点
        for (var i = 0; i < this.graphViewData.nodeList.length; i++) {
          let node = this.graphViewData.nodeList[i]
          // 设置源点，可以拖出线连接其他节点
          this.jsPlumb.makeSource(
            node.id,
            _.merge(this.jsplumbSourceOptions, {})
          )
          // 设置目标点，其他源点拖出的线可以连接该节点
          this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        }
        // 初始化连线
        for (let i = 0; i < this.graphViewData.lineList.length; i++) {
          let line = this.graphViewData.lineList[i]
          let connParam = {
            source: line.from,
            target: line.to,
          }
          if (line.isLastLine) {
            connParam.overlays = [
              [
                'Arrow',
                {
                  width: 10, // 箭头尾部的宽度
                  length: 8, // 从箭头的尾部到头部的距离
                  location: 1, // 位置，建议使用0～1之间
                  direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
                  foldback: 0.623, // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
                },
              ],
            ]
          }
          this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
        }
      },
      jsPlumbInit () {
        this.jsPlumb.ready(() => {
          // 导入默认配置
          this.jsPlumb.importDefaults(this.jsplumbSetting)
          // 会使整个jsPlumb立即重绘。
          this.jsPlumb.setSuspendDrawing(false, true)
          // 初始化节点
          this.loadEasyFlow()
          this.jsPlumb.setContainer(this.$refs.viewContainer)
        })
      },
      //构造图形数据，type是polygon时需要闭合
      formatGraphData (data, type) {
        this.graphViewData = {
          nodeList: [],
          lineList: [],
        }
        const imgWidth = this.$refs.viewContainer.offsetWidth
        const imgHeight = this.$refs.viewContainer.offsetHeight
        data.forEach((o, i) => {
          const specification = JSON.parse(o.line_specification)
          const specificationLength = specification.length
          for (let j = 0; j < specificationLength; j++) {
            this.graphViewData.nodeList.push({
              graphId: o.id, //图形id
              id: `${i}${j}`,
              left: Math.round(imgWidth * specification[j].x) + 'px',
              top: Math.round(imgHeight * specification[j].y) + 'px',
              x: specification[j].x,
              y: specification[j].y,
            })
            if (j < specificationLength - 1) {
              this.graphViewData.lineList.push({
                from: `${i}${j}`,
                to: `${i}${j + 1}`,
                graphId: o.id,
                isLastLine:
                  type === 'polygon' ? false : j === specificationLength - 2,
              })
            }
            if (j === specificationLength - 1) {
              if (type === 'polygon') {
                //首尾相连
                this.graphViewData.lineList.push({
                  from: this.graphViewData.nodeList[
                  this.graphViewData.nodeList.length - 1
                    ].id,
                  to: `${i}0`,
                  graphId: o.id,
                  isLastLine: false,
                })
              }
            }
          }
        })
        this.$nextTick(() => {
          this.jsPlumb = this.$jsPlumb.getInstance()
          this.jsPlumbInit()
        })
      },
      //保存图片配置
      handleSave () {
        this.saveLoading = true
        let image_type
        switch (this.currentEntityType) {
          case 'mall':
            image_type =
              this.currentWay.type_name === 'mall' ? 'company' : 'mall'
            break
          case 'floor':
            image_type = 'floor'
            break
          case 'store':
            image_type = 'store'
            break
        }
        let data = {}
        switch (image_type) {
          case 'company':
            data.property_id = Number(this.currentWay.id.split('_')[1])
            break
          case 'mall':
            data.property_id = Number(this.property.split('_')[1])
            data.bz_id = this.currentWay.id
            break
          case 'floor':
            data.bz_id = this.currentWay.id
            break
          case 'store':
            data.bz_id = this.storeInfo.id
            data.line_id = this.currentWay.id
            break
        }
        data.image_type = image_type
        //存储的坐标点应该是symbol的指向点
        const img = this.$refs.img
        const configData = _.cloneDeep(this.configData)
        configData.position_x = (
          (configData.position_x * img.offsetWidth + 13.5) /
          img.offsetWidth
        ).toFixed(4)
        configData.position_y = (
          (configData.position_y * img.offsetHeight + 35) /
          img.offsetHeight
        ).toFixed(4)
        data = _.merge(data, configData)
        configEntity(data)
          .then(async (res) => {
            this.$message.success(this.$t('fn.successTo', [this.$t('保存')]))
            if (this.currentWay.type_name === 'mall') {
              const orgData = await getGroupOrganization()
              this.$store.commit('saveOrganizationData', orgData.data.data)
            }
            //保存成功之后重新拉取数据库的数据，并展示当前选择的节点
            if (this.currentEntityType === 'mall') {
              this.imgConfig(this.way, this.property)
            } else {
              this.imgConfig(this.way)
            }
            this.saveLoading = false
          })
          .catch((err) => {
            this.saveLoading = false
            this.$message.error(err)
          })
      },
      //重置图片配置
      handleReset () {
        const img = this.$refs.img
        const symbol = this.symbolList.find((o) => {
          return o.id == this.currentWay.id
        })
        if (symbol) {
          //本来就有坐标
          if (
            this.configOriginData.position_x > -1 &&
            this.configOriginData.position_y > -1
          ) {
            symbol.left = this.configOriginData.position_x * img.offsetWidth
            symbol.top = this.configOriginData.position_y * img.offsetHeight
          } else {
            //本来没有坐标，但是后来添加了坐标
            const index = this.symbolList.findIndex((o) => {
              return o.id == this.currentWay.id
            })
            this.symbolList.splice(index, 1)
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
          }
          this.symbolList.push(symbolNew)
        }
        //重置恢复图片
        this.changeImg(this.configOriginData.map_url)
        this.configData = _.cloneDeep(this.configOriginData)
      },
      wayChange (val) {
        this.symbolList = this.getSymbolList()
        const way = _.find(this.wayList, (o) => {
          return o.id === val
        })
        if (way) {
          this.configData = {
            position_x: way.position_x ? way.position_x : -1,
            position_y: way.position_y ? way.position_y : -1,
            is_heatmap: way.is_heatmap || 0,
            is_keypath: way.is_keypath || 0,
            map_url: this.configImage,
          }
          this.configOriginData = _.cloneDeep(this.configData)
        }
      },
      handleDragStart (e, id) {
        e.dataTransfer.setData('symbol', id)
      },
      handleDropOnPannel (event) {
        const id = event.dataTransfer.getData('symbol')
        let symbol = this.symbolList.find((o) => {
          return o.id == id
        })
        const img = this.$refs.img
        if (event.target.className === 'symbol') {
          //如果移动距离过小，target落在symbol上
          const modalEl = document.getElementsByClassName('ivu-modal')[0]
          const imgContainer = this.$refs.imgContainer
          const left =
            event.x - 13.5 - modalEl.offsetLeft - imgContainer.offsetLeft
          const top = event.y - 20 - modalEl.offsetTop - imgContainer.offsetTop
          symbol.left =
            left > img.offsetWidth - 27
              ? img.offsetWidth - 27
              : left < 0
              ? 0
              : left
          symbol.top =
            top > img.offsetHeight - 35
              ? img.offsetHeight - 35
              : top < 0
              ? 0
              : top
        } else {
          const left = event.offsetX - 13.5
          const top = event.offsetY - 20
          symbol.left =
            left > img.offsetWidth - 27
              ? img.offsetWidth - 27
              : left < 0
              ? 0
              : left
          symbol.top =
            top > img.offsetHeight - 35
              ? img.offsetHeight - 35
              : top < 0
              ? 0
              : top
        }
        this.configData.position_x = (symbol.left / img.offsetWidth).toFixed(4)
        this.configData.position_y = (symbol.top / img.offsetHeight).toFixed(4)
      },
      //图片配置
      async imgConfig (way, property) {
        this.propertyList = []
        const orgData = await getBzoneTree({company_id: this.companyId})
        this.$refs.imgcofig.showModal()
        this.orgData = orgData.data.data
        let floor, floorId
        this.$nextTick(() => {
          const img = this.$refs.img
          switch (this.currentEntityType) {
            case 'mall': //购物中心
              this.orgData.forEach((o) => {
                this.propertyList.push({
                  ...o,
                  id: `${o.type_name}_${o.id}`,
                })
                if (o.children && o.children.length) {
                  o.children.forEach((child) => {
                    this.propertyList.push({
                      ...child,
                      id: `${child.type_name}_${child.property_id}`,
                    })
                  })
                }
              })
              this.property = property || this.propertyList[0].id
              this.propertyChange(this.property, way)
              break
            case 'floor':
              this.wayList = []
              floorId = this.floorInfo.id
              floor = deepFind(
                this.orgData,
                (o) => {
                  return o.id === floorId
                },
                'children'
              )
							deepTraversal([floor],'children',o=>{
							  if(['store','gate'].includes(o.type_name)){
							    this.wayList.push(o)
								}
							})
              this.wayList.forEach((o) => {
                //因为保存的时候存的是symbol的指向点，所以此时要恢复0,0,点坐标
                if (o.position_x !== 0 && !isEmpty(o.position_x)) {
                  o.position_x = (
                    (o.position_x * img.offsetWidth - 13.5) /
                    img.offsetWidth
                  ).toFixed(4)
                }
                if (o.position_y !== 0 && !isEmpty(o.position_y)) {
                  o.position_y = (
                    (o.position_y * img.offsetHeight - 35) /
                    img.offsetHeight
                  ).toFixed(4)
                }
              })
              this.way = way || this.wayList[0].id
              this.wayChange(this.way)
              break
            case 'store':
              floorId = this.floorInfo.id
              floor = deepFind(
                this.orgData,
                (item) => {
                  return item.bz_id === floorId
                },
                'children'
              )
              const storeId = this.storeInfo.id
              const store = floor.store.find((o) => {
                return o.bz_id === storeId
              })
              this.storeImageUrl = store.map_url
              this.wayList = store.line || []
              this.way = way || (this.wayList[0] && this.wayList[0].id)
              this.wayChange(this.way)
              break
          }
        })
      },
      changeImg (img) {
        switch (this.currentEntityType) {
          case 'mall':
            const property = _.find(this.propertyList, (o) => {
              return o.id === this.property
            })
            property.map_url = img
            break
          case 'floor':
            if (this.floorInfo) this.floorInfo.map_url = img
            break
          case 'store':
            this.storeImageUrl = img
        }

        this.configData.map_url = img
      },
      //点击放置坐标
      setClick (e) {
        if (this.hasSymbol) {
          //删除坐标
          const index = this.symbolList.findIndex((o) => {
            return o.id === this.currentWay.id
          })
          this.symbolList.splice(index, 1)
          this.configData.position_x = -1 //'-1'代表删除了当前点
          this.configData.position_y = -1
        } else {
          //放置坐标
          this.addStatus = true
          const modalEl = this.$refs.imgcofig.$el.querySelector('.ivu-modal')
          const imgContainer = this.$refs.imgContainer
          this.symbol.left = e.x - 13.5 - modalEl.offsetLeft - imgContainer.offsetLeft
          this.symbol.top = e.y - 20 - modalEl.offsetTop - imgContainer.offsetTop
          this.symbol.name = this.currentWay.name
          this.symbol.id = this.currentWay.id
        }
      },
      handleMouseMove (e) {
        if (this.addStatus) {
          const modalEl = this.$refs.imgcofig.$el.querySelector('.ivu-modal')
          const imgContainer = this.$refs.imgContainer
          this.symbol.left =
            e.x - 13.5 - modalEl.offsetLeft - imgContainer.offsetLeft
          this.symbol.top = e.y - 20 - modalEl.offsetTop - imgContainer.offsetTop
        }
      },
      setCoordinate () {
        const width = this.$refs.img.offsetWidth
        const height = this.$refs.img.offsetHeight
        if (
          this.symbol.left < width - 13.5 &&
          this.symbol.left > -13.5 &&
          this.symbol.top > -35 &&
          this.symbol.top < height - 35
        ) {
          //在范围内
          this.configData.position_x = (this.symbol.left / width).toFixed(4)
          this.configData.position_y = (this.symbol.top / height).toFixed(4)
          this.symbolList.push(_.cloneDeep(this.symbol))
          this.addStatus = false
        } else {
          console.log('cc')
        }
      },
      propertyChange (val, way) {
        const img = this.$refs.img
        if (val.indexOf('company') > -1) {
          //选择的是集团
          //wayList是集团下的购物中心
          this.wayList = _.cloneDeep(this.propertyList).splice(1)
        } else {
          //选择的是购物中心
          const value = val.split('_')
          //waylist 是购物中心下的所有出入口gate
          this.wayList = []
					const mall = deepFind(this.orgData,o=>{
					  return o.type_name === 'mall' && o.property_id === Number(value[1])
					})
					if(mall){
            deepTraversal([mall],'children',child=>{
              if(child.type_name === 'gate'){
                this.wayList.push(child)
              }
            })
					}
          if (!this.wayList.length) {
            this.way = ''
            this.$message.warning(this.$t('notices.configGate'))
            return
          }
        }
        this.wayList.forEach((o) => {
          // if (val.indexOf('company') === -1) o.id = o.bz_id
          //因为保存的时候存的是symbol的指向点，所以此时要恢复0,0,点坐标
          if (o.gate_position_x > -1 && !isEmpty(o.gate_position_x)) {
            o.position_x = (
              (o.gate_position_x * img.offsetWidth - 13.5) /
              img.offsetWidth
            ).toFixed(4)
          } else {
            o.position_x = o.gate_position_x
          }
          if (o.gate_position_y > -1 && !isEmpty(o.gate_position_y)) {
            o.position_y = (
              (o.gate_position_y * img.offsetHeight - 35) /
              img.offsetHeight
            ).toFixed(4)
          } else {
            o.position_y = o.gate_position_y
          }
        })
        this.way = way || this.wayList[0].id
        this.wayChange(this.way)
      },
      getSymbolList () {
        if (!this.wayList.length) return
        const wayList = this.wayList.filter((o) => {
          return (
            o.position_x > 0 &&
            o.position_x !== -1&&
            o.position_y > 0 &&
            o.position_y !== -1&&
            !isEmpty(o.position_x) &&
            !isEmpty(o.position_y)
          )
        })
        const img = this.$refs.img
        return wayList.map((o) => {
          return {
            id: o.id,
            name: o.name,
            left: Number(o.position_x) * img.offsetWidth,
            top: Number(o.position_y) * img.offsetHeight,
          }
        })
      },
      getData () {
        this.id = this.$route.params.id
        getBzoneTree({ property_id: this.propertyId }).then(res => {
          res = res.data.data
					this.originTreeData = _.cloneDeep(res)
          //级联数据不显示出入口和区域
          let treeData = filterTreeByType(res, ['area','gate'])
          if (this.$store.state.user.role_id < 3) {
            this.treeData = treeData
          } else {
            let checklist = this.$store.state.user.checklist
            if (checklist) {
              treeData = treeData.map((mm) => {
                if (checklist.indexOf(mm.property_id) > -1) return mm
              })
            }
            this.treeData = treeData
          }
          //设置默认值
          if (this.defaultValue.length === 0) {
            if (this.treeData[0]) {
              this.defaultValue = [this.treeData[0].id]
              this.caseDidChange()
            }
          } else {
            if (this.currentEntityType !== 'other') {
              this.caseDidChange()
            } else {
              //todo

            }

          }
        })
      },
      getDic () {
        getDataEntity().then((res) => {
          this.gateTypeList = res.data.data.gate_type
        }).catch((err) => {
          console.log(err)
        })
      },
      getCascadeNode () {
        let arr = []
        this.defaultValue.forEach(o => {
          const node = deepFind(this.treeData, t => {
            return t.id === o
          })
          arr.push(node)
        })
        return arr
      },
      caseDidChange (value = this.defaultValue) {
        const selectedData = this.getCascadeNode()
        switch (this.currentEntityType) {
          case 'mall':
            const property = _.find(this.organizationData.property, ['property_id', selectedData[0].property_id])
            this.$store.commit('setMall', { shoppingInfoDate: property })
            this.$nextTick(() => {
              this.$refs.marketlist.init()
            })
            break
          case 'floor':
            this.floorInfo = selectedData[selectedData.length-1]
            break
          case 'store':
            this.storeInfo = selectedData[selectedData.length-1]
            break
          case 'other':
            this.entityInfo = selectedData[selectedData.length-1]
            break

        }
      },
      init () {
        this.$refs.marketlist.init()
      },
      addEntity () {
        this.$refs.entityModal.showModal()
        this.$refs.entityModal.isModify = false
      },

      editMall (values) {
        var value = _.cloneDeep(values)
        value.area_size = value.goal_sale[0].area_size
        value.timerange = [value.daily_start, value.daily_end]

        value.province = isNaN(Number(value.province))
          ? 0
          : Number(value.province)
        value.city = isNaN(Number(value.city)) ? 0 : Number(value.city)
        var zones = []
        if (value.zone_id) {
          var zone_id = _.cloneDeep(value.zone_id).split(',')
          zones = zone_id.map(Number)
        } else {
          zones = []
        }
        value.zones = zones
        let goal_flow = value.goal_flow
        let goal_sale = value.goal_sale
        let sumFlowYear = null
        let sumSaleYear = null
        // 获取当年的客流目标
        const currentYearGoalFlow = goal_flow.find((f) => {
          return f.year === this.currentYear
        })
        if (currentYearGoalFlow.is_year === 'year') {
          this.$refs.shopmall.disabled = true
          sumFlowYear = currentYearGoalFlow.flow_year
          this.$refs.shopmall.sumFlowYear = sumFlowYear
          this.$refs.shopmall.setFlowYearGoal()
        } else {
          this.$refs.shopmall.disabled = false
          sumFlowYear = currentYearGoalFlow.flow_year
          this.$refs.shopmall.sumFlowYear = sumFlowYear
          this.$refs.shopmall.setFlowMonthGoal()
        }

        var monthFlow = currentYearGoalFlow.detail.months
        var monthFlowData = []
        monthFlow.forEach((m) => {
          monthFlowData.push(Object.values(m)[0])
        })
        let monthsGoal = initMonthsData('name', 'modal')
        monthsGoal.forEach((m, index) => {
          m.modal = monthFlowData[index]
        })
        // 获取当年的销售目标
        const currentYearGoalSale = goal_sale.find((s) => {
          return s.year === this.currentYear
        })
        if (currentYearGoalSale.is_year == 'year') {
          this.$refs.shopmall.disabledSale = true
          sumSaleYear = currentYearGoalSale.sale_year
          this.$refs.shopmall.sumSaleYear = sumSaleYear
          this.$refs.shopmall.setSaleYearGoal()
        } else {
          this.$refs.shopmall.disabledSale = false
          sumSaleYear = currentYearGoalSale.sale_year
          this.$refs.shopmall.sumSaleYear = sumSaleYear
          this.$refs.shopmall.setSaleMonthGoal()
        }
        var monthSale = currentYearGoalSale.detail.months
        var monthSaleData = []
        monthSale.forEach((m) => {
          monthSaleData.push(Object.values(m)[0])
        })
        let monthsSale = initMonthsData('name', 'modal')
        monthsSale.forEach((m, index) => {
          m.modal = monthSaleData[index]
        })
        this.$refs.shopmall.monthsGoal = monthsGoal
        this.$refs.shopmall.monthsSale = monthsSale
        this.$refs.shopmall.formValidate = value
        this.$refs.shopmall.showModal()

      },
      delStore (value, alertText, obj) {
        this.$alert({
          content: this.$t('确认删除此商铺？'),
          cancel () {
          },
          confirm: () => {
            delEntity(obj.id).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(this.$t('删除成功'))
                this.defaultValue = findParentNodes(obj.id,this.treeData)
                this.getData()
              }else {
                this.$message.error(res.data.msg)
              }
            })
          },
        })
      },
      changeDoorway () {
        this.getData()
      },
    },
  }
</script>

<style scoped lang="less">
	.content {
		.basic-info {
			.top {
				.cascader {
					width: 230px;
				}
			}
			
			.icon-area {
				> * {
					width: 24px;
					height: 24px;
					line-height: 24px;
					border-radius: 50%;
					font-size: 16px;
					text-align: center;
					color: #fff;
					
					&:hover {
						cursor: pointer;
					}
					
					&:nth-child(1) {
						background-color: #2bd9cf;
					}
					
					&:nth-child(2) {
						background-color: #feb33d;
						margin-left: 20px;
					}
				}
			}
		}
	}
	
	/*.cascader {*/
	/*  width: 230px;*/
	
	/*  .ivu-input-wrapper {*/
	/*    width: 100%;*/
	
	/*    .ivu-input {*/
	/*      width: 230px;*/
	/*      height: 43px;*/
	/*      border: 1px solid rgba(0, 0, 0, 0.2);*/
	/*      font-family: "source_han_sans_cn", "Roboto", sans-serif;*/
	/*    }*/
	/*  }*/
	/*}*/
	
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
