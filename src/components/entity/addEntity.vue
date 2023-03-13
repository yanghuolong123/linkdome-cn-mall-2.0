<template>
  <modal ref="modal" :loading="true"
         :width="500"
         @onOk="handleSubmit('formValidate')"
         @onCancel="closeModal"
         :title="title">

			<el-form ref="formValidate" :model="formValidate" class="form-data" :rules="ruleValidate" label-position="top">
					<el-form-item :label="$t('类型')" prop="type_name">
						<el-select v-model="formValidate.type_name" :disabled="isModify" class="w-100" @change="entityTypeChange">
							<el-option v-for="item in typeList"
												 :value="item.value"
												 :label="$t(item.label)"
												 :key="item.value"></el-option>
						</el-select>
					</el-form-item>
				<el-form-item :label="$t('父节点')" prop="parentNode" v-if="userLvl === 'admin'">
					<el-cascader
						v-model="formValidate.parentNode"
						:placeholder="$t('fn._', [$t('holder.请选择'), $t('父节点')])"
						class="w-select "
						style="width: 100%"
						:props="cascadeProps"
						:options="parentNodeCascade"
					>
					</el-cascader>
				</el-form-item>
				<el-form-item :label="$t('楼层')" prop="zone_index" v-show="formValidate.type_name === 'floor'">
					<el-select v-model="formValidate.zone_index"
										 class="w-100"
										 @change="floorChange"
										 :placeholder="$t('fn._', [$t('holder.请选择'), $t('楼层')])"
										 :disabled="userLvl === 'common_admin'">
						<el-option v-for="item in floors"
											 :value="item.value"
											 :label="item.label"
											 :key="item.id"></el-option>
					</el-select>
				</el-form-item>
					<el-form-item :label="$t('名称')" prop="name" v-show="['store','other'].includes(formValidate.type_name)||(formValidate.type_name==='floor'&&formValidate.zone_index)">
						<el-input  maxlength="20" type="text" v-model="formValidate.name" ></el-input>
					</el-form-item>
					<el-form-item :label="$t('区域关联')" prop="zoneIds" v-if="isSuperAdmin">
						<el-select v-model="formValidate.zoneIds"
											 multiple
											 class="w-100"
											 @change="changeZones"
											 :placeholder="$t('holder.请选择')"
											 :disabled="disabledZones">
							<el-option v-for="item in zonelist"
												 :value="item.value"
												 :label="item.label"
												 :key="item.value"></el-option>
						</el-select>
					</el-form-item>
					
				
					
					<el-form-item :label="$t('业态')" prop="business_type_id" v-show="formValidate.type_name === 'store'">
						<el-select v-model="formValidate.business_type_id"
											 class="w-100"
											 :placeholder="$t('fn._', [$t('holder.请选择'), $t('业态')])"
											 :disabled="disabledModal5">
							<el-option v-for="item in formats"
												 :value="item.value"
												 :label="item.label"
												 :key="item.value"></el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item :label="$t('面积')" prop="area_size"  v-show="formValidate.type_name === 'store'">
						<el-input  v-model.number="formValidate.area_size" ></el-input>
					</el-form-item>
					<el-form-item :label="$t('描述')" prop="description">
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
        callback(new Error(i18n.t("fn.请选择", [i18n.t(rule.tips)])));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isFinite(Number(value))) {
          callback(new Error(i18n.t("面积数要为数字")));
        } else {
          if (value < 0) {
            callback(new Error(i18n.t("面积数不能为负")));
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
            message: this.$t("名称不能为空"),
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

        zoneIds: [
          {
            required: true,
            tips: "区域关联",
            validator: this.validSelect,
            trigger: "change",
          },
        ],
        parentNode: [
          {
            required: true,
            tips: "父节点",
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
        { value: -5, label: "负五楼" },
        { value: -4, label: "负四楼" },
        { value: -3, label: "负三楼" },
        { value: -2, label: "负二楼" },
        { value: -1, label: "负一楼" },
        { value: 1, label: "一楼" },
        { value: 2, label: "二楼" },
        { value: 3, label: "三楼" },
        { value: 4, label: "四楼" },
        { value: 5, label: "五楼" },
        { value: 6, label: "六楼" },
        { value: 7, label: "七楼" },
        { value: 8, label: "八楼" },
        { value: 9, label: "九楼" },
        { value: 10, label: "十楼" },
        { value: 11, label: "十一楼" },
        { value: 12, label: "十二楼" },
        { value: 13, label: "十三楼" },
        { value: 14, label: "十四楼" },
        { value: 15, label: "十五楼" },
        { value: 16, label: "十六楼" },
        { value: 17, label: "十七楼" },
        { value: 18, label: "十八楼" },
        { value: 19, label: "十九楼" },
        { value: 20, label: "二十楼" },
      ],
      isModify: false,
      yearlist: [],
      currentYear: new Date().getFullYear(),
      typeList:[
        {
          value: 'floor', label: "楼层",id:51
          
        },{
          value: 'store', label: "商铺",id:50
        },{
          value: 'other', label: "其他",id:2
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
      let rule = _.cloneDeep(this.rule)
      if(this.formValidate.type_name !== 'store'){
        return  Object.assign(rule,{
          zoneIds: [
            {
              required: false,
              trigger: "change",
            },
          ],
				})
			}else {
        return this.rule
			}
		},
    title(){
      if(this.isModify){
        return this.$t("fn.编辑", [this.$t("实体")])
			}else {
        return this.$t("fn.添加", [this.$t("实体")])
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
          callback(new Error(this.$t("fn.请选择", [this.$t(rule.tips)])));
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
          this.$t("fn.successTo", [this.$t("编辑")])
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
            this.$t("fn.successTo", [this.$t("添加")])
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

