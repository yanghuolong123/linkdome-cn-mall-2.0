import Moment from 'moment'
import iDatePicker from '_c/common/idatepicker.vue'

const yesterday = Moment(new Date()).add(-1, 'day').format('YYYY-MM-DD')
import {
  deepTraversal,
  findCascadeLastLevel,
  deepFind,
  getCompareDate,
  getUnique,
  isEmpty,
} from '@/libs/util'
import i18n from '@/i18n/i18n'
import { getBussinessTree,  getCascadeList } from '@/api/passenger.js'
import {  getGateTypeList,getIndustry } from '@/api/manager.js'
import { getBussinessDict,getBzoneTree } from '@/api/home'
const selectMixin = {
  components:{
    iDatePicker
  },
  props:{
    maxEntity:{
      type:Boolean,
      default:true
    },
    multiQuta:{
      type:Boolean,
      default:false
    },

  },
  data () {
    return {
      queryParams: {
        date1Array: [yesterday,yesterday],
        date2Array: [],
        enterType: '0',
        selectList:[],
        bussinessType:[],
        range:''
      },
      bussinessTypeOptions: [],//业态
      cascadeProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name'
      },
      compareType: 'not',//对比类型
      entityType: '',//单选按钮
      typeOptions: [
        {
          value: 'not',
          label: i18n.t('noComp')
        }, {
          value: 'entity',
          label: i18n.t('entityComp')
        }, {
          value: 'time',
          label: i18n.t('cusTimeCompare')
        },
        {
          value: 'onYear',
          label: i18n.t('YOY')
        },
        {
          value: 'onChain',
          label: i18n.t('QOQ')
        }
      ],
      customType: [
        {
          value: '0',
          label: this.$t('allEnter')
        }
      ],
      storeCascadeOpiton: [],//商铺级联数据
      storeCascadeData: [],
      entityCascaderOption: [],//组织结构实体级联数据
      entityCascaderData: [],
      entitySelectObj:{},
      cascadeAllStore:[],
      gateCascadeOpiton:[],
      bussinessCascadeOpiton:[],
      gateCascadeData:[],
      busiCascadeData:[],
    }
  },
  watch: {
    entityCascaderData: {//根据新旧值的差别来判断勾选了全部还是取消了全部
      handler (newval, oldval) {
        if (_.isEmpty(_.differenceWith(newval, oldval, _.isEqual))) {//取消节点
          const dif = _.differenceWith(oldval, newval, _.isEqual)
          if (dif.length > 1) return//dif大于一个节点，为数据的变化，页面是只会一个节点一个节点的勾选
          if (JSON.stringify(dif).indexOf('all') > -1) {//取消的是全部节点
            const pId = dif[0][dif[0].length - 1].substring(3)
            const node = deepFind(this.entityCascaderOption, o => {
              return o.id === Number(pId)
            }, 'children')
            const valueList = node.children.map(o => {
              return JSON.stringify(o.cascadeValue)
            })
            //清除节点
            const cascaderSelectList = _.cloneDeep(this.entityCascaderData)
            for (let i = 0; i < cascaderSelectList.length; i++) {
              if (valueList.includes(JSON.stringify(cascaderSelectList[i]))) {
                cascaderSelectList.splice(i, 1)
                i--
              }
            }
            //更新视图
            this.updateCascader(cascaderSelectList)
          }
        } else {
          const dif = _.differenceWith(newval, oldval, _.isEqual)
          if (JSON.stringify(dif).indexOf('all') > -1) {//勾选的是全部节点
            if (dif.length > 1) return
            const pId = dif[0][dif[0].length - 1].substring(3)

            const node = deepFind(this.entityCascaderOption, o => {
              return o.id === Number(pId)
            }, 'children')
            //全选节点
            const cascaderSelectList = this.entityCascaderData.concat(node.children.map(o => {
              return o.cascadeValue
            }))

            this.updateCascader(cascaderSelectList)
          }
        }
      }
    },
    //实体下拉框全选
    'queryParams.selectList':{
      handler(newval,oldval){
        if(_.differenceWith(newval, oldval)[0] === -1){
          this.queryParams.selectList = this.selectOptions.map(o=>{return o.id})
        }
        if(_.differenceWith(oldval,newval)[0] === -1){
          this.queryParams.selectList = []
        }
        if(this.queryParams.selectList.length === 1 && this.queryParams.selectList[0] === -1){
          this.queryParams.selectList = []
        }
      },
      deep:true
    },
    entityType:{
      handler(newval){
        this.entityTypeChange(newval)
      }
    }
  },
  computed:{
    selectOptions(){
      const all = {
        id: -1,
        name: i18n.t('allEntity')
      }
      if(this.entitySelectObj[this.entityType]){
        return [all,...this.entitySelectObj[this.entityType]]
      }else {
        return []
      }
    },
    entityOptions(){
      return [
        {
          label: this.$t('floor'),
          value: 'floor'
        },
        {
          label:`${this.$t('bussinessType')}/${this.$t('store')}`,
          value: 'bussiness',
          cascadeOption:this.bussinessCascadeOpiton,
          cascadeData:this.busiCascadeData
        },
        {
          label: this.$t('area'),
          value: 'area'
        },
        {
          label: this.$t('gate'),
          value: 'gate',
          type_name:'gate',
          cascadeOption:this.gateCascadeOpiton,
          cascadeData:this.gateCascadeData
        },

      ]
    }
  },
  methods: {
    getCascadeOption(){
     return _.find(this.entityOptionsCom,['value',this.entityType])
    },
    getBussinessDict () {
      getBussinessDict({ property_id: this.$store.state.home.headerAction }).then(res => {
        res = res.data.data
        this.bussinessTypeOptions = [{
          id: -1,
          name: this.$t('allBussType')
        }]
        if (res) {
          for (let key in res) {
            this.bussinessTypeOptions.push({
              id: key,
              name: res[key]
            })
          }
        }
      })
    },
    getGateTypeList(){
      getGateTypeList({ property_id: this.$store.state.home.headerAction }).then(res=>{
        this.gateCascadeOpiton = res.data.data || [];
      })
    },
    //按业态选择店铺
    getIndustry(){
      getIndustry({ property_id: this.$store.state.home.headerAction }).then(res=>{
        this.bussinessCascadeOpiton = res.data.data || [];
      })
    },
    getStoreCascadeOpiton(){
      this.storeCascadeOpiton = [];
      this.cascadeAllStore = []
      getCascadeList({ property_id: this.$store.state.home.headerAction }).then(res=>{
        let data = res.data.data
        for(let key in data){
          this.storeCascadeOpiton.push({
            id:key,
            name:key,
            children:data[key]
          })
          this.cascadeAllStore = this.cascadeAllStore.concat(data[key])
        }
      })
    },
    compareTypeChange(val){
      switch (val) {
        case 'time':
          // 自定义时间
          this.queryParams.date2Array = [
            Moment().add(-1, 'd').format('YYYY-MM-DD'),
            Moment().add(-1, 'd').format('YYYY-MM-DD')
          ]
          break
        case 'onYear':
        case 'onChain':
          this.queryParams.date2Array = getCompareDate(this.queryParams.date1Array,val)
          break;
        case 'not':
          this.queryParams.date2Array = [];
          break
        case 'entity':
          this.queryParams.selectList = this.selectOptions.map(o=>{return o.id});
          break
        case 'businessType':
          this.queryParams.bussinessType = this.bussinessTypeOptions.map(o => {
            return o.id
          })
          break
      }
    },
    //单选按钮change
    entityTypeChange(){
      this.queryParams.selectList = this.selectOptions.map(o=>{return o.id})
    },
    //查询
    handleClick () {
      let entitys = []
      // 判断是否是实体对比
      if (this.compareType === 'entity') {
        if (this.entityType === 'store') {
          this.storeCascadeData.forEach(o=>{
            const node = deepFind(this.storeCascadeOpiton,store=>{
              return store.id === o[o.length-1]
            })
            entitys.push({
              type_name:'store',
              id:node.id,
              name:node.name
            })
          })
        } else if(['gate','bussiness'].includes(this.entityType) ){
          const option = _.find(this.entityOptions,['value',this.entityType])

          option.cascadeData.map(list => {
            let obj = {}
            obj.type_name = option.type_name
            obj.id = list[1]
            const node = deepFind(option.cascadeOption, o => {
              return o.id === Number(list[1])
            }, 'children')
            obj.name = node.name
            obj.label = node.name
            obj.belongsType = option.label
            entitys.push(obj)
          })
        }else {
          let copySelect = _.cloneDeep(this.queryParams.selectList)
          if (!Array.isArray(copySelect)) {
            copySelect = Array.of(copySelect)// 单选的时候会通不过验证
          }
          if (this.$store.state.home.headerAction != 0) {
            if (!copySelect) {
              alert(i18n.t('fn.select',[i18n.t('entity')]))
              return
            }
          } else {
            return false
          }
          copySelect.forEach(e => {
            let tml = _.find(this.selectOptions, (o) => o.id === e)
            if (tml&&tml.id !== -1) entitys.push(tml)
          })
        }
      }else if(this.compareType === 'businessType'){//实体客流中有业态对比
        if(!this.queryParams.bussinessType.length){
          alert(i18n.t('fn.select',[i18n.t('bussinessType')]));
          return
        }
        let bussinessType;
        if(!Array.isArray(this.queryParams.bussinessType)){
          bussinessType = [this.queryParams.bussinessType]
        }else {
          bussinessType = this.queryParams.bussinessType
        }
        entitys = bussinessType.filter(o=>{
          return o>-1
        }).map(o=>{
          return {
            id:o,
            name:_.find(this.bussinessTypeOptions,b=>{return b.id===o}).name
          }
        })
      }else {
        let selectList = []
        // 拿到选择节点的id(数组的最后一个元素)
        if (this.cascadeProps.multiple) {
          selectList = _.compact(this.entityCascaderData && this.entityCascaderData.map(o => {
            // 含有字符串项的为【全部】
            if (typeof o[o.length - 1] !== 'string') {
              return o[o.length - 1]
            }
          }))
        } else {
          selectList = this.entityCascaderData && [this.entityCascaderData[this.entityCascaderData.length - 1]]
        }
        function getEntityObj (node) {
          if (selectList.includes(node.id)) {
            entitys.push({
              id: node.id,
              label: node.label,
              name: node.name,
              type_name: node.type_name,
              property_id:node.property_id,
              belongsType: node.belongsType
            })
          }
        }
        deepTraversal(this.entityCascaderOption, 'children', getEntityObj)
      }
      this.queryParams.entitys = entitys
      this.queryParams.compareType = this.compareType;

      if(this.$store.state.home.headerAction===0){
        return false
      }
      if(entitys.length===0){
        this.$alert({
          content:i18n.t('fn.select',[i18n.t('entity')])
        })
        return false
      }else if(this.maxEntity && entitys.length>25){
        this.$alert({
          content:i18n.t('fn.entityLimit',[25])
        })
        return false
      }
      this.$emit('paramsPrepare',this.queryParams)
    },
    resetClick () {
      this.queryParams.date1Array = [yesterday,yesterday];
      this.compareType = 'not';
      this.setEntityCascaderDataDefaultValue()
    },
    updateCascader (arr) {
      // 去重
      arr = getUnique(_.compact(arr))
      // 防止视图不更新
      this.entityCascaderData = []
      this.entityCascaderData = arr
    },
    dateSelect (date, shortname, dType) {
      date[0] = Moment(date[0]).format('YYYY-MM-DD')
      date[1] = Moment(date[1]).format('YYYY-MM-DD')
      if (dType === 1) {
        this.queryParams.date1Array = date;
        if(this.compareType === 'onYear' || this.compareType === 'onChain') this.compareTypeChange(this.compareType)
      }
      if (dType === 2) this.queryParams.date2Array = date
    },
    bussinessTreeReq () {
      return new Promise((resolve, reject) => {
        if (!this.$store.state.home.headerAction) {
          reject(i18n.t('fn.select',[i18n.t('shopmall')]))
          return
        }
        getBzoneTree({property_id:this.$store.state.home.headerAction}).then(res=>{
          res = res.data.data;
          resolve(res)
        })
        // getBussinessTree({ entity: 52 }).then(res => {
        //   res = res.data.data;
        //   resolve(res)
        // }).catch(err => {
        //   reject(err)
        // })
      })

    },
    //获取实体选择时多选下拉框
    getSelectOption (res) {
      let obj = {}
      deepTraversal(res,'children',o=>{
        if(obj[o.type_name] && Array.isArray(obj[o.type_name])){
          obj[o.type_name].push(o)
        }else {
          obj[o.type_name] = [o]
        }

      })
      this.entitySelectObj = obj
    },
    //给级联数据最后一级加全部按钮
    cascadeDataAddAll (data) {
      findCascadeLastLevel(data, 'children', addAll)
      function addAll (levelNode) {
        const parent_id = levelNode[levelNode.length - 1].parent_id
        levelNode.unshift({
          id: 'all' + parent_id,
          name: i18n.t('all')
        })
      }
    },
    //过滤实体权限
    handleEntityPrivilege () {
      const entityPrivilege = _.cloneDeep(this.$store.state.user.business_zone_privilege)
      if (isEmpty(entityPrivilege)) return
      /** *************处理楼层权限***************/
        // 所有商铺(叶子)
      const leaves = entityPrivilege.filter(o => {
          return o.length === 3
        })
      // 所有商铺所属楼层,并深度去重（2级节点）
      const leavesParent = _.uniqBy(leaves.map(o => {
        o = _.cloneDeep(o)
        o.pop()
        return o
      }), JSON.stringify)
      // 得到的数组和实体权限对比，得到的差值为没有权限的楼层节点
      const invalidLeavesParent = _.differenceWith(leavesParent, entityPrivilege, _.isEqual)
      // 得到楼层节点id
      const invalidFloorIds = invalidLeavesParent.map(o => {
        o = _.cloneDeep(o)
        o.shift()
        return o[0]
      })
      /** *************处理购物中心权限***************/
        // 所有楼层所属购物中心,并深度去重（1级节点）
      const roots = _.uniqBy(entityPrivilege.map(o => {
          o = _.cloneDeep(o)
          return [o.shift()]
        }), JSON.stringify)
      // 得到的数组和实体权限对比，得到的差值为没有权限的购物中心节点
      const invalidRoots = _.differenceWith(roots, entityPrivilege, _.isEqual).flat()
      // 合并楼层和购物中心全部没有权限的节点
      const invalidNodes = invalidFloorIds.concat(invalidRoots)
      // 深度遍历，将没有权限的节点禁用
      deepTraversal(this.entityCascaderOption, 'children', disabledNode)

      function disabledNode (node) {
        if (node && invalidNodes.includes(node.id)) node.disabled = 'disabled'
      }
      // if (this.cascaderTree[0]) {
      //   const firNode = this.cascaderTree[0].id
      //   const secNode = this.cascaderTree[0].children && this.cascaderTree[0].children[0] && this.cascaderTree[0].children[0].id
      //   const thNode = this.cascaderTree[0].children && this.cascaderTree[0].children[0] && this.cascaderTree[0].children[0].children && this.cascaderTree[0].children[0].children[1] && this.cascaderTree[0].children[0].children[1].id
      //   this.cascaderSelectList = this.multiple ? [_.compact([firNode, secNode, thNode])] : _.compact([firNode, secNode, thNode])
      //   this.$forceUpdate()
      // }
    },
    setEntityCascaderDataDefaultValue(){
      if(this.$store.state.user.role_id<3){
        this.entityCascaderData = [this.entityCascaderOption[0].cascadeValue]
      }else {
        const node = deepFind(this.entityCascaderOption,o=>{
          return o.disabled===false
        },'children')
        if(node){
          this.entityCascaderData = [node.cascadeValue]
        }
      }
    }
  },
  mounted(){
    this.getGateTypeList()

    this.entityType = this.entityOptions[0] && this.entityOptions[0].value;
  }
}
export default selectMixin
