<template>
  <modal ref="modal" :loading="true"
         :width="500"
         @onOk="handleSubmit('formValidate')"
         @onCancel="closeModal"
         :title="title">

			<el-form ref="formValidate" :model="formValidate" class="form-data" :rules="ruleValidate" label-position="top">
					<el-form-item :label="$t('type')" prop="type_name">
						<el-select v-model="formValidate.type_name" :disabled="isModify" class="w-100" @change="entityTypeChange">
							<el-option v-for="item in typeList"
												 :value="item.value"
												 :label="$t(item.label)"
												 :key="item.value"></el-option>
						</el-select>
					</el-form-item>
				<el-form-item :label="$t('parentNode')" prop="parentNode" v-if="userLvl === 'admin'">
					<el-cascader
						v-model="formValidate.parentNode"
						:placeholder="$t('fn._', [$t('holder.Select'), $t('parentNode')])"
						class="w-select "
						style="width: 100%"
						:props="cascadeProps"
						:options="parentNodeCascade"
					>
					</el-cascader>
				</el-form-item>
				<el-form-item :label="$t('floor')" prop="zone_index" v-show="formValidate.type_name === 'floor'">
					<el-select v-model="formValidate.zone_index"
										 class="w-100"
										 @change="floorChange"
										 :placeholder="$t('fn._', [$t('holder.Select'), $t('floor')])"
										 :disabled="userLvl === 'common_admin'">
						<el-option v-for="item in floors"
											 :value="item.value"
											 :label="item.label"
											 :key="item.id"></el-option>
					</el-select>
				</el-form-item>
					<el-form-item :label="$t('name')" prop="name" v-show="['store','other'].includes(formValidate.type_name)||(formValidate.type_name==='floor'&&formValidate.zone_index)">
						<el-input  maxlength="20" type="text" v-model="formValidate.name" ></el-input>
					</el-form-item>
					<el-form-item :label="$t('areaAsso')" prop="zoneIds" v-if="isSuperAdmin">
						<el-select v-model="formValidate.zoneIds"
											 multiple
											 class="w-100"
											 @change="changeZones"
											 :placeholder="$t('holder.Select')"
											 :disabled="disabledZones">
							<el-option v-for="item in zonelist"
												 :value="item.value"
												 :label="item.label"
												 :key="item.value"></el-option>
						</el-select>
					</el-form-item>



					<el-form-item :label="$t('bussinessType')" prop="business_type_id" v-show="formValidate.type_name === 'store'">
						<el-select v-model="formValidate.business_type_id"
											 class="w-100"
											 :placeholder="$t('fn._', [$t('holder.Select'), $t('bussinessType')])"
											 :disabled="disabledModal5">
							<el-option v-for="item in formats"
												 :value="item.value"
												 :label="$t(item.label)"
												 :key="item.value"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item :label="$t('squareMeasure')" prop="area_size"  v-show="formValidate.type_name === 'store'">
						<el-input  v-model.number="formValidate.area_size" ></el-input>
					</el-form-item>
					<el-form-item :label="$t('description')" prop="description">
						<el-input maxlength="50" type="text" v-model="formValidate.description" ></el-input>
					</el-form-item>
				</el-form>

  </modal>

</template>

<script>
import i18n from "@/i18n/i18n";
import Modal from '_c/common/Modal.vue'
import {deepTraversal,findKey} from '@/libs/util'
import {
  createEntity,
  updateEntity,
  zones,
} from "@/api/manager.js";
import { getFormateData } from "@/api/formats.js";
import { getBzoneTree } from "@/api/home.js";
import {mapState} from 'vuex'

export default {
  name: "addEntity",
  props: {
    userLvl: {
      type: String,
      default: "admin",
    },

  },
  components:{
    Modal
  },
  data() {
    const validSelect = (rule, value, callback) => {
      if (value === "" || (rule.field == "zoneIds" && !value[0])) {
        callback(new Error(i18n.t("fn.select", [i18n.t(rule.tips)])));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isFinite(Number(value))) {
          callback(new Error(i18n.t("areaMustNumber")));
        } else {
          if (value < 0) {
            callback(new Error(i18n.t("areaCtNeg")));
          } else {
            callback();
          }
        }
      }, 200);
    };
    return {
      formValidate: {
        type_name: 'floor', // 类型
        name: "", // 名称
        zone_index: "", // 楼层
        zoneIds: [], // 区域关联,
        parentNode: "", // 父节点
        description: "", // 描述
        business_type_id: "", // 业态
        area_size: "",
      },
      rule: {
        name: [
          {
            required: true,
            message: this.$t('fn.cantBeEmpty',[this.$t('name')]),
            trigger: "blur",
          },
        ],
        floor: [
          {
            required: true,
            tips: "楼层",
            validator: validSelect,
            trigger: "change",
          },
        ],

        // zoneIds: [
        //   {
        //     required: true,
        //     tips: "区域关联",
        //     validator: this.validSelect,
        //     trigger: "change",
        //   },
        // ],
        parentNode: [
          {
            required: true,
            tips: "parentNode",
            validator: validSelect,
            trigger: "change",
          },
        ],
        modal5: [
          {
            required: true,
            tips: "业态",
            validator: validSelect,
            trigger: "change",
          },
        ],
        area_size: [
          {
            required: false,
            tips: "面积",
            validator: validateNumber,
            trigger: "change",
          },
        ],
      },

      cascadeProps:{
        checkStrictly: true,
        expandTrigger:'hover',
        value:'id',
				label:'name'
      },
      floorindex: "",
      floornum: "",
      zonelist: [],
      zone_id: "",
      type: 1,
      disabled: true,
      disabledParentNode: false,
      disabledZones: false,
      disabledModal5: false,
      formats: [],
      floors: [
        { value: -5, label: this.$t('fn.negFloor',[5]) },
        { value: -4, label: this.$t('fn.negFloor',[4]) },
        { value: -3, label: this.$t('fn.negFloor',[3]) },
        { value: -2, label:this.$t('fn.negFloor',[2]) },
        { value: -1, label: this.$t('fn.negFloor',[1]) },
        { value: 1, label: this.$t('fn.floor',[1]) },
        { value: 2, label: this.$t('fn.floor',[2]) },
        { value: 3, label: this.$t('fn.floor',[3]) },
        { value: 4, label: this.$t('fn.floor',[4]) },
        { value: 5, label:this.$t('fn.floor',[5]) },
        { value: 6, label: this.$t('fn.floor',[6]) },
        { value: 7, label: this.$t('fn.floor',[7]) },
        { value: 8, label:this.$t('fn.floor',[8]) },
        { value: 9, label: this.$t('fn.floor',[9]) },
        { value: 10, label: this.$t('fn.floor',[10]) },
        { value: 11, label: this.$t('fn.floor',[11]) },
        { value: 12, label: this.$t('fn.floor',[12]) },
        { value: 13, label: this.$t('fn.floor',[13]) },
        { value: 14, label: this.$t('fn.floor',[14]) },
        { value: 15, label: this.$t('fn.floor',[15]) },
        { value: 16, label: this.$t('fn.floor',[16]) },
        { value: 17, label: this.$t('fn.floor',[17]) },
        { value: 18, label: this.$t('fn.floor',[18]) },
        { value: 19, label: this.$t('fn.floor',[19]) },
        { value: 20, label: this.$t('fn.floor',[20])},
      ],
      isModify: false,
      yearlist: [],
      currentYear: new Date().getFullYear(),
      typeList:[
        {
          value: 'floor', label: "floor",id:51

        },{
          value: 'store', label: "store",id:50
        },{
          value: 'other', label: "Other",id:2
        }
      ],
			parentNodeTree:[]
    };
  },

  watch: {
    // 监听业态变化
    "$store.state.home.bussinessDict"() {
      this.getBussinessType();
    },
    "formValidate.modal5"() {
      if (!this.formValidate.modal5) {
        const node = _.find(this.formats, (val) => val.label === "其他");
        this.formValidate.modal5 = node ? Number(node.value) : "";
      }
    },
    propertyId() {
      if (this.propertyId != 0) {
        this.getZones();
      }
    },
  },
  computed: {
    isSuperAdmin() {
      return this.$store.state.user.role_id == 1;
    },
    ...mapState({
      propertyId: state => state.home.headerAction,
    }),
    ruleValidate(){
      // let rule = _.cloneDeep(this.rule)
      // if(this.formValidate.type_name !== 'store'){
      //   return  Object.assign(rule,{
      //     zoneIds: [
      //       {
      //         required: false,
      //         trigger: "change",
      //       },
      //     ],
			// 	})
			// }else {
      //   return this.rule
			// }
      return this.rule
		},
    title(){
      if(this.isModify){
        return this.$t("fn.edit", [this.$t("entity")])
			}else {
        return this.$t("fn.add", [this.$t("entity")])
			}
		},
    parentNodeCascade(){
      let tree = _.cloneDeep(this.parentNodeTree);
      const type = this.formValidate.type_name;
      //商铺只可以挂在【楼层】和【其他下面】
      if(type === 'store'){
        deepTraversal(tree,'children',t=>{
          if(['mall','gate','area','store'].includes(t.type_name)){
            t.disabled = 'disabled'
          }
        })
			}
      if(type === 'floor'){
        deepTraversal(tree,'children',t=>{
          if(['store','gate','area','floor'].includes(t.type_name)){
            t.disabled = 'disabled'
					}
				})
			}
      if(type === 'other'){
        deepTraversal(tree,'children',t=>{
          if(['store','gate','area'].includes(t.type_name)){
            t.disabled = 'disabled'
          }
        })
			}
      return tree
		},
  },

  methods: {
    validSelect(rule, value, callback){
      if(this.formValidate.type_name === 'store'){
        if (value === "" || (rule.field == "zoneIds" && !value[0])) {
          callback(new Error(this.$t("fn.select", [this.$t(rule.tips)])));
        } else {
          callback();
        }
			}else {
        callback()
			}

		},
    showModal(){
      this.$refs.modal.showModal()
      this.getZones();
      this.getBussinessType();
      this.getBzoneTree()
    },
    getBzoneTree(){
      getBzoneTree({property_id:this.propertyId}).then(res=>{
        this.parentNodeTree = res.data.data || [];
        // this.parentNodeTree = this.filterTree(res);

      })
		},
		filterTree(arr){
      let emptyArr = [];
      for (let item of arr) {
        if (!['store','gate','area'].includes(item.type_name) ) {
          if (item.children &&Array.isArray(item.children)&& item.children.length > 0) {
            item.children = this.filterTree(item.children);
          }
          emptyArr.push(item);
        } else if (item.children&&Array.isArray(item.children) && item.children.length > 0) {
          item.children = this.filterTree(item.children);
          if (item.children.length) {
            emptyArr.push(item);
          }
        }
      }
      return emptyArr;
		},
    /* 获取所有的区域关联zons列表
     *@method
     *@param {int}
     *@return null
     */
    getZones() {
      zones(this.propertyId).then((res) => {
        res = res.data.data;
        this.zonelist = res.map(o=>{
          return {
            value:o.id,
            label:o.name
          }
        })
      });
    },
    /* 获取商家业态数据列表
     *@method getBussinessType
     *@return null
     */
    getBussinessType() {
      getFormateData(this.propertyId).then((res) => {
        if (res.data.code === 200) {
          res = res.data.data;
          this.formats = res.map((list) => {
            return {
              value: Number(list.id),
              label: list.name,
            };
          });
        }
      });
    },
    closeModal() {
      this.$refs.formValidate.resetFields();
      this.$refs.modal.closeModal()
    },
    entityTypeChange(val) {
      this.$refs.formValidate.resetFields()
      this.formValidate.type_name = val
      this.zones = "";
    },
    /* 选择楼层
     *@method changeFloor
     *@param {int} val 楼层value值
     *@return null
     */
    changeFloor(val) {
      this.floorindex = val;
      for (var i = 0; i < this.floors.length; i++) {
        if (val == this.floors[i].value) {
          this.floornum = this.floors[i].label;
        }
      }
    },
    /* 更改选中的区域关联数据
     *@method changeZones
     *@param {int} val 选中的区域关联数据value值
     *@return null
     */
    changeZones(val) {
      this.zones = val;
      this.zone_id = this.zones.join(",");
    },

    /* 校验表单
     *@method handleSubmit
     *@param {String} name 表单的ref值
     *@return null
     */
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const data = {
            property_id:this.propertyId,
            ...this.formValidate,
            type_id:findKey(this.typeList,'value',this.formValidate.type_name,'id'),
            zone_id:this.formValidate.zoneIds.toString(),
            parent_id:this.formValidate.parentNode[this.formValidate.parentNode.length-1]
          }
					if(this.isModify){
					  this.updateEntity(data)
					}else {
            this.createEntity(data)
					}

        }else {
          this.$refs.modal.resetOkButton()
        }
      });
    },
    updateEntity(data){
      updateEntity(data.id,data).then(()=>{
        this.$message.success(
          this.$t("fn.successTo", [this.$t("edit")])
        );
        this.$refs.modal.resetOkButton()
        this.closeModal()
        this.$emit('updateSuc',data)
			}).catch(err=>{
        this.$message.error(err);
        this.$refs.modal.resetOkButton()
      })
		},
    createEntity(data){
      createEntity(data).then(res=>{
        this.$refs.modal.resetOkButton()
        if(res.data.code === 200){
          data.id = res.data.data.id
          this.$message.success(
            this.$t("fn.successTo", [this.$t("add")])
          );
          this.$refs.modal.resetOkButton()
          this.closeModal()
          this.$emit('addSuc',data)
				}

			}).catch(err=>{
        this.$message.error(err);
        this.$refs.modal.resetOkButton()
			})
    },
    floorChange(value){
      this.formValidate.name = findKey(this.floors,'value',value,'label')
		},
  },
};
</script>

<style lang="less" scoped>
  .form-data{
    padding-right: 10px;
    max-height: 65vh;
    overflow-y: scroll;
		/deep/.el-form-item__label{
			padding-bottom: 0;
		}
		/deep/.el-form-item{
			margin-bottom: 15px;
		}
		.w-100{
			width: 100%;
		}
  }
</style>

