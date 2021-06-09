<template>
    <div class="addEntity">
        <div class="dialogs-edit">
            <div class="dialogs-edit-bg"></div>
            <div class="dialogs-edit-text"
                 :style="{marginLeft:marginLeft,marginTop:marginTop,width:mWidth,height:mHeight}"
                 id="addEntity">
                <div class="edit-title">{{editTitle}}</div>
                <div class="edit-close" v-on:click="closeEdit">
                    <Icon type="md-close"/>
                </div>
                <div class="edit-text">
                    <section class="modal-card-body">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="formmail"
                              v-if="isEmptyPage">
                            <div class="flexs">
                                <FormItem label="名称" prop="name" v-if="formValidate.spc!=2">
                                    <Input type="text" v-model="formValidate.name"></Input>
                                </FormItem>
                            </div>
                            <div class="flexs">
                                <FormItem label="地址" prop="address" v-if="formValidate.spc==1">
                                    <Input type="text" v-model="formValidate.address"></Input>
                                </FormItem>
                            </div>
                        </Form>
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="formmail"
                              v-bind:class="{stores:formValidate.spc==3}" v-show="!isEmptyPage">
                            <div class="left">
                                <FormItem label="类型" prop="spc">
                                    <Select v-model="formValidate.spc" :disabled="disabledSpc"
                                            @on-change="getSelectValue">
                                        <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label
                                            }}
                                        </Option>
                                    </Select>
                                </FormItem>

                                <FormItem label="名称" prop="name" v-if="formValidate.spc!=2">
                                    <Input type="text" v-model="formValidate.name"></Input>
                                </FormItem>

                                <FormItem label="楼层" prop="floor" v-if="formValidate.spc==2">
                                    <Select @on-change="changeFloor" :disabled="userLvl=='common_admin'?true:false"
                                            v-model="formValidate.floor">
                                        <Option
                                                v-for="item in floors"
                                                :value="item.value"
                                                :key="item.value"
                                        >{{ item.label }}
                                        </Option>
                                    </Select>
                                </FormItem>

                                <FormItem label="营业时间" prop="timerange" v-if="formValidate.spc==1">
                                    <TimePicker
                                            confirm
                                            type="timerange"
                                            v-model="formValidate.timerange"
                                            placement="bottom-end"
                                            placeholder="选择营业时间"
                                            style="width:100%"
                                    ></TimePicker>
                                </FormItem>

                                <FormItem label="区域关联" prop="zones" v-if="isSuperAdmin">
                                    <Select multiple @on-change="changeZones" :disabled="disabledZones"
                                            v-model="formValidate.zones">
                                        <Option
                                                v-for="item in zonelist"
                                                :value="item.value"
                                                :key="item.value"
                                        >{{item.label}}
                                        </Option>
                                    </Select>
                                </FormItem>

                                <FormItem label="省份" prop="province" v-if="formValidate.spc==1">
                                    <Select
                                            v-model="formValidate.province"
                                            placeholder="请选择省份"
                                            @on-change="changeProvince"
                                            style="width:100%"
                                    >
                                        <Option
                                                v-for="item in provinceArr"
                                                :key="item.value"
                                                :value="item.value"
                                        >{{ item.label}}
                                        </Option>
                                    </Select>
                                </FormItem>

                                <FormItem label="城市" prop="city" v-if="formValidate.spc==1">
                                    <Select
                                            v-model="formValidate.city"
                                            placeholder="请选择城市"
                                            @on-change="changeCity"
                                            style="width:100%"
                                    >
                                        <Option v-for="item in cities" :key="item.value" :value="item.value">
                                            {{item.label}}
                                        </Option>
                                    </Select>
                                </FormItem>

                                <FormItem label="地址" prop="address" v-if="formValidate.spc==1">
                                    <Input type="text" v-model="formValidate.address"></Input>
                                </FormItem>

                                <FormItem label="父节点" prop="parentNode" v-if="formValidate.spc!=1&&userLvl=='admin'">
                                    <Select v-model="formValidate.parentNode" :disabled="disabledParentNode">
                                        <Option
                                                v-for="item in addfloor"
                                                :value="item.value"
                                                :key="item.value"
                                        >{{item.label}}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="业态" prop="modal5" v-if="formValidate.spc==3">
                                    <Select v-model="formValidate.modal5" :disabled="disabledModal5">
                                        <Option
                                                v-for="item in formats"
                                                :value="item.value"
                                                :key="item.value"
                                        >{{item.label }}
                                        </Option>
                                    </Select>
                                </FormItem>

                                <FormItem label="面积" prop="area" v-if="formValidate.spc!=2">
                                    <Input type="text" v-model="formValidate.area"></Input>
                                </FormItem>

                                <FormItem label="描述" prop="description">
                                    <Input type="text" v-model="formValidate.description"></Input>
                                </FormItem>

                                <FormItem v-if="userLvl!='admin'&&formValidate.spc!=3">
                                    <div :style="{height:hideHeight}"></div>
                                </FormItem>
                            </div>

                            <div class="right">
                                <div class="form-control addsub"
                                     style="display: flex;align-items: center;margin-top: 30px;width: 45%">
                                    <FormItem label="选择年份" style="width: auto;word-break: keep-all"></FormItem>
                                    <Select v-model="currentYear"
                                            @on-change="currentYearChange">
                                        <Option v-for="year in yearlist" :value="year" :key="year">{{ year }}
                                        </Option>
                                    </Select>
                                </div>
                                <FormItem label="客流目标"></FormItem>
                                <div class="form-control addsub">
                                    <label></label>
                                    <row>
                                        <i-col span="3" style="display:flex;">
                                            <FormItem label="全年目标"></FormItem>
                                            <Radio v-model="flowYear" @on-change="setFlowYearGoal"></Radio>
                                        </i-col>
                                        <i-col span="9" style="width:34.5%!important">
                                            总 <Input type="number" style="margin-left:4px;width:270px"
                                                     :disabled="!disabled" v-model="sumFlowYear"></Input>
                                        </i-col>
                                        <i-col span="12" offset="0" class="fs16">
                                            人,平均每月{{Math.floor(sumFlowYear/12).toLocaleString()}} 人
                                        </i-col>
                                    </row>
                                </div>

                                <div class="form-control addsub">
                                    <row>
                                        <i-col span="3" style="display:flex;">
                                            <FormItem label="每月目标"></FormItem>
                                            <Radio v-model="flowMonth" @on-change="setFlowMonthGoal"></Radio>
                                        </i-col>
                                        <div style="display:flex;flex-wrap: wrap;">
                                            <row class="omonth" v-for="(item,index) in monthsGoal" :key="index">
                                                <i-col span="5" style="margin-left: -6px;">
                                                    <FormItem :label="item.name"></FormItem>
                                                </i-col>
                                                <i-col span="16">
                                                    <Input type="number" :disabled="disabled"
                                                           v-model="item.modal"></Input>
                                                </i-col>
                                                <i-col span="2" offset="1">人</i-col>
                                            </row>
                                            <row span="24" offset="0" class="fs16">全年总计 {{totals.toLocaleString()}} 人
                                            </row>
                                        </div>
                                    </row>
                                </div>

                                <FormItem label="销售额目标"></FormItem>
                                <div class="form-control addsub">
                                    <label></label>
                                    <row>
                                        <i-col span="3" style="display:flex;">
                                            <FormItem label="全年目标"></FormItem>
                                            <Radio v-model="saleYear" @on-change="setSaleYearGoal"></Radio>
                                        </i-col>
                                        <i-col span="9" style="width:34.5%!important">
                                            总<Input type="number" :disabled="!disabledSale"
                                                    style="margin-left:4px;width:270px" v-model="sumSaleYear"></Input>
                                        </i-col>
                                        <i-col span="12" offset="0" class="fs16">
                                            元,平均每月{{Math.floor(sumSaleYear/12).toLocaleString()}} 元
                                        </i-col>
                                    </row>
                                </div>

                                <div class="form-control addsub">
                                    <row>
                                        <i-col span="3" style="display:flex;">
                                            <FormItem label="每月目标"></FormItem>
                                            <Radio v-model="saleMonth" @on-change="setSaleMonthGoal"></Radio>

                                        </i-col>
                                        <div style="display:flex;flex-wrap: wrap;margin-bottom: 50px">
                                            <row class="omonth" v-for="(item,index) in monthsSale" :key="index">
                                                <i-col span="5" style="margin-left: -6px;">
                                                    <FormItem :label="item.name"></FormItem>
                                                </i-col>
                                                <i-col span="16">
                                                    <Input type="number" :disabled="disabledSale"
                                                           v-model="item.modal"></Input>
                                                </i-col>
                                                <i-col span="2" offset="1">元</i-col>
                                            </row>
                                            <row span="8" offset="1" class="fs16">全年总计 {{totalSales.toLocaleString()}}
                                                元
                                            </row>
                                        </div>
                                    </row>
                                </div>
                            </div>

                        </Form>
                        <div class="control" v-bind:class="{addFloorShop:formValidate.spc!=1}">
                            <Button @click="handleSubmit('formValidate')">提交</Button>
                            <Button class="buttonCel" @click.native="closeEdit">取消</Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import data from '@/assets/json/province.json'
import { initMonthsData } from '@/libs/util'
import {
  addtype,
  updateFloorData,
  addAreas,
  updateAreas,
  addmall,
  updateMallrData,
  zones,
} from '@/api/manager.js'
import { getFormateData } from '@/api/formats.js'
import {getGroupOrganization} from '@/api/home.js'

export default {
  name: 'addEntity',
  props: {
    isEmptyPage: {
      type: Boolean,
      default: false
    },
    addmall: {
      required: true
    },
    mallList: {
      type: Array
    },
    editTitle: {
      type: String,
      default: '添加实体'
    },
    userLvl: {
      type: String,
      default: 'admin'
    },
    propertyId: {
      type: Number,
      default: 0
    }
  },
  data () {
    const validSelectTime = (rule, value, callback) => {
      if (value[0] === '' && value[1] === '') {
        callback(new Error('请选择营业时间'))
      } else {
        callback()
      }
    }
    const validSelect = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择' + rule.tips))
      } else {
        callback()
      }
    }
    const validateNumber = (rule, value, callback) => {
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isFinite(Number(value))) {
          callback(new Error('面积数要为数字'))
        } else {
          if (value < 0) {
            callback(new Error('面积数不能为负'))
          } else {
            callback()
          }
        }
      }, 200)
    }
    return {
      controlLeft: '57%!important',
      controlBottom: '3%!important',
      mWidth: '1286px',
      mHeight: '686px',
      marginLeft: '-643px',
      marginTop: '-414px',
      formValidate: {
        spc: 1, // 类型
        name: '', // 名称
        floor: '', // 楼层
        timerange: ['', ''], // 营业时间
        zones: [], // 区域关联,
        province: '', // 省份
        city: '', // 市名
        address: '', // 地址
        parentNode: '', // 父节点
        description: '', // 描述
        modal5: '', // 业态
        area: ''
      },
      ruleValidate: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        },
        {
          type: 'string',
          max: 20,
          message: '名称长度不得大于20个字符',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '地址不能为空',
          trigger: 'blur'
        },
        {
          type: 'string',
          min: 6,
          message: '地址长度不得少于6个字符',
          trigger: 'blur'
        },
        {
          type: 'string',
          max: 20,
          message: '地址长度不得大于20个字符',
          trigger: 'blur'
        }],
        description: [{
          type: 'string',
          max: 50,
          message: '描述长度不得大于50个字符',
          trigger: 'blur'
        }],
        floor: [{ required: true, tips: '楼层', validator: validSelect, trigger: 'change' }],
        timerange: [{ required: true, validator: validSelectTime, trigger: 'change' }],
        zones: [{ required: true, tips: '区域关联', validator: validSelect, trigger: 'change' }],
        province: [{ required: true, tips: '省份', validator: validSelect, trigger: 'change' }],
        city: [{ required: true, tips: '城市', validator: validSelect, trigger: 'change' }],
        parentNode: [{ required: true, tips: '父节点', validator: validSelect, trigger: 'change' }],
        modal5: [{ required: true, tips: '业态', validator: validSelect, trigger: 'change' }],
        area: [{ required: false, tips: '面积', validator: validateNumber, trigger: 'change' }]
      },
      monthsGoal: initMonthsData('name', 'modal'),
      monthsSale: initMonthsData('name', 'modal'),
      flowYear: true, // 全年目标
      flowMonth: false, // 每月目标
      saleYear: true,
      saleMonth: false,
      floorindex: '',
      floornum: '',
      zonelist: [],
      zone_id: '',
      type: 1,
      flow_month: {},
      sale_month: {},
      disabled: true,
      disabledSale: true,
      disabledSpc: false,
      disabledFloor: false,
      disabledParentNode: false,
      disabledZones: false,
      disabledModal5: false,
      hidemonth: false,
      company_id: '',
      name: '',
      mall: 'mall',
      floor: 'floor',
      store: 'store',
      flow_type: '', // 客流目标类型
      saleYearType: '', // 销售额目标类型
      sumFlowYear: '', // 年客流目标
      sumFlowMonth: '', // 月客流目标总和
      sumSaleYear: '', // 年销售目标
      sumSaleMonth: '', // 月销售目标
      list: [
        { value: 1, label: '购物中心' },
        { value: 2, label: '楼层' },
        { value: 3, label: '商铺' }
      ],
      formats: [],
      floors: [
        { value: -5, label: '负五楼' },
        { value: -4, label: '负四楼' },
        { value: -3, label: '负三楼' },
        { value: -2, label: '负二楼' },
        { value: -1, label: '负一楼' },
        { value: 1, label: '一楼' },
        { value: 2, label: '二楼' },
        { value: 3, label: '三楼' },
        { value: 4, label: '四楼' },
        { value: 5, label: '五楼' },
        { value: 6, label: '六楼' },
        { value: 7, label: '七楼' },
        { value: 8, label: '八楼' },
        { value: 9, label: '九楼' },
        { value: 10, label: '十楼' },
        { value: 11, label: '十一楼' },
        { value: 12, label: '十二楼' },
        { value: 13, label: '十三楼' },
        { value: 14, label: '十四楼' },
        { value: 15, label: '十五楼' },
        { value: 16, label: '十六楼' },
        { value: 17, label: '十七楼' },
        { value: 18, label: '十八楼' },
        { value: 19, label: '十九楼' },
        { value: 20, label: '二十楼' }
      ],
      provinceArr: [],
      cities: '',
      a: '',
      b: '',
      isModify: false,
      yearlist: [2019, 2020, 2021],
      currentYear: new Date().getFullYear()
    }
  },
  created () {
  },
  watch: {
    isEmptyPage: {
      handler (newVal) {
        if (newVal) {
          this.mWidth = '560px'
          this.mHeight = '300px'
          this.marginLeft = '-280px'
          this.marginTop = '-150px'
          this.formValidate.spc = 1
        }
      },
      immediate: true
    },
    // 监听业态变化
    '$store.state.home.bussinessDict' () {
      this.gettype()
    },
    'formValidate.modal5' () {
      if (!this.formValidate.modal5) {
        const node = _.find(this.formats, (val) => val.label === '其他')
        this.formValidate.modal5 = node ? Number(node.value) : ''
      }
    },
    propertyId () {
      if (this.propertyId != 0) this.getZones()
    }
  },
  computed: {
    isSuperAdmin () {
      return this.$store.state.user.role_id == 1
    },
    hideHeight: function () {
      if (this.userLvl == 'admin') {
        return '50px'
      } else if (this.userLvl == 'common_admin') {
        if (this.formValidate.spc == 1) {
          return '50px'
        } else if (this.formValidate.spc == 2) {
          return '0px'
        }
      }
    },
    totals: function () {
      var s = 0
      if (this.flowMonth) {
        var monthsGoal = this.monthsGoal
        s = monthsGoal.map(function (m) {
          return m.modal ? Number(m.modal) : 0
        })
        s = _.sum(s)
      }
      // else{
      //    s = this.sumFlowYear
      // }
      this.sumFlowMonth = s
      return s
    },
    totalSales: function () {
      var s = 0
      if (this.saleMonth) {
        var monthsSale = this.monthsSale
        s = monthsSale.map(function (m) {
          return m.modal ? Number(m.modal) : 0
        })
        s = _.sum(s)
      }
      // else{
      //    s = this.sumSaleYear
      // }
      this.sumSaleMonth = s
      return s
    },
    addfloor () { // 父节点options
      switch (this.formValidate.spc) {
        case 2:// 类型为楼层,返回第一级数据
          return this.mallList.map(o => {
            return {
              value: o.id,
              label: o.name
            }
          })
        case 3:// 类型为商铺
          return this.addmall.children.map(o => {
            return {
              value: o.id,
              label: o.name
            }
          })
      }
    }
  },
  mounted () {
    this.provinceArr = data
    this.getZones()
  },
  methods: {
    currentYearChange (value) {
      this.currentYear = value
      const currentYearGoalFlow = this.formValidate.goal_flow.find(f => {
        return f.year === this.currentYear
      })
      if (currentYearGoalFlow) {
        this.sumFlowYear = currentYearGoalFlow.flow_year
        switch (currentYearGoalFlow.is_year) {
          case 'year':
            this.disabled = true
            this.setFlowYearGoal()
            break
          case 'month':
            this.disabled = false
            this.setFlowMonthGoal()
            break
        }
        let monthFlowData = []
        currentYearGoalFlow.detail.months.forEach((m) => {
          monthFlowData.push(Object.values(m)[0])
        })
        this.monthsGoal.forEach((m, index) => {
          m.modal = monthFlowData[index]
        })
      } else {
        this.disabled = true
        this.setFlowYearGoal()
        this.monthsGoal = initMonthsData('name', 'modal')
        this.sumFlowYear = ''
        this.sumSaleYear = ''
      }

      // 获取当年的销售目标
      const currentYearGoalSale = this.formValidate.goal_sale.find(s => {
        return s.year === this.currentYear
      })
      if (currentYearGoalSale) {
        this.sumSaleYear = currentYearGoalSale.sale_year
        switch (currentYearGoalSale.is_year) {
          case 'year':
            this.disabledSale = true
            this.setSaleYearGoal()
            break
          case 'month':
            this.disabledSale = false
            this.setSaleMonthGoal()
            break
        }
        let monthSaleData = []
        currentYearGoalSale.detail.months.forEach((m) => {
          monthSaleData.push(Object.values(m)[0])
        })
        this.monthsSale.forEach((m, index) => {
          m.modal = monthSaleData[index]
        })
      } else {
        this.disabledSale = true
        this.setSaleYearGoal()
        this.monthsSale = initMonthsData('name', 'modal')
        this.sumFlowYear = ''
        this.sumSaleYear = ''
      }
    },
    /* 获取所有的区域关联zons列表
            *@method
            *@param {int}
            *@return null
            */
    getZones () {
      let that = this
      zones(this.propertyId).then(function (res) {
        if (res.data.code == 200) {
          that.zonelist = that.addValuesToEle2(res.data.data)
        }
      })
    },
    /* 获取商家业态数据列表
                        *@method gettype
                        *@return null
                        */
    gettype () {
      getFormateData(this.propertyId).then(res => {
        if (res.data.code === 200) {
          res = res.data.data
          this.formats = res.map(list => {
            return {
              value: Number(list.id),
              label: list.name
            }
          })
        }
      })
    },
    /* 设置客流年目标
                *@method setFlowYearGoal
                *@return null
                */
    setFlowYearGoal () {
      this.flow_type = 'year'
      this.disabled = true
      this.flowMonth = false
      this.flowYear = true
    },
    /* 设置客流每月目标
                      *@method setFlowMonthGoal
                      *@return null
                      */
    setFlowMonthGoal () {
      this.flow_type = 'month'
      this.disabled = false
      this.flowMonth = true
      this.flowYear = false
    },
    /* 设置销售额年目标
                    *@method setSaleYearGoal
                    *@return null
                    */
    setSaleYearGoal () {
      this.saleYearType = 'year'
      this.disabledSale = true
      this.saleMonth = false
      this.saleYear = true
    },
    /* 设置销售每月目标
                        *@method setSaleMonthGoal
                        *@return null
                        */
    setSaleMonthGoal () {
      this.saleYearType = 'month'
      this.disabledSale = false
      this.saleYear = false
      this.saleMonth = true
    },
    /* 选择省份 获取城市数组
                        *@method changeProvince
                        *@param {int} val 省份id
                        *@return null
                        */
    changeProvince (val) {
      this.province = val
      for (var i = 0; i < this.provinceArr.length; i++) {
        if (val == this.provinceArr[i].value) {
          this.cities = this.provinceArr[i].children
        }
      }
    },
    /* 选择城市
                        *@method changeCity
                        *@param {int} val 城市id
                        *@return null
                        */
    changeCity (val) {
      this.city = val
    },
    closeEdit () {
      this.$emit('closeEdit')
    },
    /* 选择类型
                        *@method getSelectValue
                        *@param {int} val 类型id 1:购物中心;2:楼层;3:商铺
                        *@return null
                        */
    getSelectValue (val) {
      this.formValidate.spc = val
      var titleNames
      if (val == 2) {
        titleNames = this.isModify ? '编辑楼层' : '添加楼层'
        this.mWidth = '500px'
        this.mHeight = '530px'
        this.marginLeft = '-250px'
        this.marginTop = '-265px'
        this.controlLeft = '33%!important'
        this.controlBottom = '-4%!important'
        if (this.userLvl === 'common_admin') {
          this.mHeight = '378px'
          this.marginTop = '-189px'
        }
        document.getElementsByClassName('right')[0].style.display = 'none'
        document.getElementsByClassName('left')[0].style.width = '100%'
      } else if (val == 3) {
        titleNames = this.isModify ? '编辑商铺' : '添加商铺'
        this.mWidth = '570px'
        this.mHeight = '686px'
        this.marginLeft = '-285px'
        this.marginTop = '-343px'
        this.controlLeft = '33%!important'
        this.controlBottom = '-4%!important'
        if (this.userLvl === 'common_admin') {
          this.mHeight = '530px'
          this.marginTop = '-265px'
        }
        document.getElementsByClassName('left')[0].style.width = '100%'
        document.getElementsByClassName('right')[0].style.display = 'none'
        document.getElementsByClassName('left')[0].style.width = '100%'
      } else if (val == 1) {
        titleNames = this.isModify ? '编辑购物中心' : '添加购物中心'
        this.mWidth = '1286px'
        this.mHeight = '686px'
        this.marginLeft = '-643px'
        this.marginTop = '-414px'
        if (this.userLvl === 'common_admin') {
          this.controlBottom = '3%!important'
          this.controlLeft = '44%!important'
        }
        document.getElementsByClassName('left')[0].style.width = '28%'
        document.getElementsByClassName('right')[0].style.display = 'block'
        document.getElementsByClassName('right')[0].style.width = '68%'
      }
      this.zones = ''
      this.$emit('changeEditTitle', titleNames)
    },
    /* 选择楼层
                        *@method changeFloor
                        *@param {int} val 楼层value值
                        *@return null
                        */
    changeFloor (val) {
      this.floorindex = val
      for (var i = 0; i < this.floors.length; i++) {
        if (val == this.floors[i].value) {
          this.floornum = this.floors[i].label
        }
      }
    },
    /* 格式化选择器数据
                        *@method addValuesToEle2
                        *@param {obj} pArray 需要格式化的数据对象
                        *@return null
                        */
    addValuesToEle2 (pArray) {
      let that = this
      return pArray.map(function (ele) {
        ele.value = ele.id
        ele.label = ele.name
        return ele
      })
    },
    /* 更改选中的区域关联数据
                        *@method changeZones
                        *@param {int} val 选中的区域关联数据value值
                        *@return null
                        */
    changeZones (val) {
      this.zones = val
      this.zone_id = this.zones.join(',')
    },

    /* 校验表单
                    *@method handleSubmit
                    *@param {String} name 表单的ref值
                    *@return null
                    */
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addEntity()
        } else {
        }
      })
    },

    /* 添加实体
                    *@method addEntity
                    *@return null
                    */
    addEntity () {
      var that = this
      // 添加商场
      if (that.formValidate.spc == 1) {
        var sumFlow = null
        var flowType = null// 客流目标类型
        var sumSale = null// 年销售目标类型
        var saleType = null// 年销售目标总和
        if (that.flowYear) {
          flowType = 'year'
          sumFlow = Number(that.sumFlowYear)
        } else {
          flowType = 'month'
          sumFlow = that.sumFlowMonth

          var monthsGoal = _.cloneDeep(that.monthsGoal)
          monthsGoal.forEach(function (m) {
            m.modal = m.modal ? Number(m.modal) : 0
          })
          that.flow_month = {
            Jan: parseInt(monthsGoal[0].modal),
            Feb: parseInt(monthsGoal[1].modal),
            Mar: parseInt(monthsGoal[2].modal),
            Apr: parseInt(monthsGoal[3].modal),
            May: parseInt(monthsGoal[4].modal),
            Jun: parseInt(monthsGoal[5].modal),
            Jul: parseInt(monthsGoal[6].modal),
            Aug: parseInt(monthsGoal[7].modal),
            Sep: parseInt(monthsGoal[8].modal),
            Oct: parseInt(monthsGoal[9].modal),
            Nov: parseInt(monthsGoal[10].modal),
            Dec: parseInt(monthsGoal[11].modal)
          }
        }

        if (that.saleYear) {
          saleType = 'year'
          sumSale = Number(that.sumSaleYear)
        } else {
          saleType = 'month'
          sumSale = that.sumSaleMonth

          var monthsSale = _.cloneDeep(that.monthsSale)
          monthsSale.forEach(function (m) {
            m.modal = m.modal ? Number(m.modal) : 0
          })
          that.sale_month = {
            Jan: parseInt(monthsSale[0].modal),
            Feb: parseInt(monthsSale[1].modal),
            Mar: parseInt(monthsSale[2].modal),
            Apr: parseInt(monthsSale[3].modal),
            May: parseInt(monthsSale[4].modal),
            Jun: parseInt(monthsSale[5].modal),
            Jul: parseInt(monthsSale[6].modal),
            Aug: parseInt(monthsSale[7].modal),
            Sep: parseInt(monthsSale[8].modal),
            Oct: parseInt(monthsSale[9].modal),
            Nov: parseInt(monthsSale[10].modal),
            Dec: parseInt(monthsSale[11].modal)
          }
        }

        var year_data = new Date()
        var years = that.currentYear
        getGroupOrganization().then(function (res) {
          if (res.data.code == 200) {
            that.company_id = res.data.data.company_id
            var daily_start = that.formValidate.timerange[0]
            var daily_end = that.formValidate.timerange[1]
            if (!that.isModify) {
              addmall(that.mall, that.company_id, that.formValidate.name, that.formValidate.province, that.formValidate.city,
                that.formValidate.address, that.formValidate.description, flowType, sumFlow, saleType, sumSale, that.zone_id,
                daily_start, daily_end, that.flow_month, that.sale_month, Number(that.formValidate.area), years).then(function (res) {
                if (res.data.code == 200) {
                  that.closeEdit()
                  var alertText = {}
                  alertText.bg = '#00A0E9'
                  alertText.title = '添加购物中心'
                  alertText.text = '添加购物中心成功'
                  alertText.confirm = false
                  that.$emit('alertMessage', true, alertText)
                  var data = {}
                  data.children = []
                  data.name = that.formValidate.name
                  data.label = that.formValidate.name
                  data.id = res.data.data.bzid
                  data.value = res.data.data.bzid
                  data.property_id = res.data.data.property_id
                  data.zones = that.zone_id.split(',').map(Number)
                  that.$emit('addTypeData', data)
                }
              })
            } else {
              updateMallrData(that.mall, that.company_id, that.formValidate.name, that.formValidate.province, that.formValidate.city,
                that.formValidate.address, that.formValidate.description, flowType, sumFlow, saleType, sumSale, that.zone_id,
                daily_start, daily_end, that.flow_month, that.sale_month, Number(that.formValidate.area), years, that.formValidate.bzid, that.formValidate.property_id).then(function (res) {
                if (res.data.code == 200) {
                  that.closeEdit()
                  var alertText = {}
                  alertText.bg = '#00A0E9'
                  alertText.title = '编辑购物中心'
                  alertText.text = '编辑购物中心成功'
                  alertText.confirm = false
                  that.$emit('alertMessage', true, alertText)
                  var data = {}
                  // data.children = [];
                  data.name = that.formValidate.name
                  data.label = that.formValidate.name
                  data.id = that.formValidate.bzid
                  data.value = that.formValidate.bzid
                  data.property_id = that.formValidate.property_id
                  data.zones = that.zone_id.split(',').map(Number)
                  that.$emit('updateTypeData', data)
                  that.$emit('init')
                }
              })
            }
          }
        })
      } else if (that.formValidate.spc == 2) {
        // 添加楼层
        if (!that.isModify) {
          addtype(that.floor, that.addmall.property_id, that.floornum, that.addmall.id, that.zone_id, that.floorindex, that.formValidate.description).then(function (res) {
            if (res.data.code == 200) {
              that.closeEdit()
              var alertText = {}
              alertText.bg = '#00A0E9'
              alertText.title = that.editTitle
              alertText.text = '添加楼层成功'
              alertText.confirm = false
              that.$emit('alertMessage', true, alertText)
              var data = {}
              data.itype = 'floor'
              data.id = res.data.data.bzid
              data.value = res.data.data.bzid
              data.gate = []
              data.map_url = null
              data.name = that.floornum
              data.label = that.floornum
              data.description = that.formValidate.description
              data.zone_index = that.floorindex
              data.parent_id = that.addmall.id
              data.zones = that.zone_id.split(',').map(Number)
              that.$emit('addFloorData', data.parent_id, data)
            }
          })
        } else {
          // 编辑楼层
          var thefloor = _.find(that.floors, ['value', that.formValidate.floor])
          var name = thefloor.label
          let description = that.formValidate.description
          let bzid = that.formValidate.id
          let parent_id = that.formValidate.parentNode
          let zones = that.formValidate.zones.join(',')
          let zone_index = thefloor.value
          updateFloorData(name, parent_id, zones, zone_index, description, bzid).then(function (res) {
            if (res.data.code == 200) {
              that.closeEdit()
              var alertText = {}
              alertText.bg = '#00A0E9'
              alertText.title = that.editTitle
              alertText.text = '编辑楼层成功'
              alertText.confirm = false
              that.$emit('alertMessage', true, alertText)
              var data = {}
              data.itype = 'floor'
              data.id = bzid
              data.value = bzid
              data.gate = []
              data.map_url = null
              data.name = name
              data.label = name
              data.description = description
              data.floor = zone_index
              data.zone_index = zone_index
              data.parent_id = that.addmall.id
              data.zones = that.zone_id.split(',').map(Number)
              that.$emit('updateFloorData', data.parent_id, data)
            }
          })
        }
      } else {
        var name = that.formValidate.name
        var description = that.formValidate.description
        var parent_id = that.formValidate.parentNode
        var area_size = that.formValidate.area
        var business_type_id = that.formValidate.modal5

        // 添加商铺
        if (!that.isModify) {
          addAreas('store', that.addmall.property_id, name, parent_id, that.zone_id, business_type_id, area_size, description).then(function (res) {
            if (res.data.code == 200) {
              that.closeEdit()
              var alertText = {}
              alertText.bg = '#00A0E9'
              alertText.title = that.editTitle
              alertText.text = '添加商铺成功'
              alertText.confirm = false
              that.$emit('alertMessage', true, alertText)
              var data = {}
              data.itype = 'store'
              data.id = res.data.data.bzid
              data.value = res.data.data.bzid
              data.name = name
              data.label = name
              data.description = description
              data.parent_id = parent_id
              data.business_type_id = business_type_id
              data.area_size = area_size
              data.zones = that.zone_id.split(',').map(Number)
              that.$emit('addStoreData', that.addmall.id, parent_id, data)
            }
          })
        } else {
          var bzid = that.formValidate.id
          updateAreas('store', that.addmall.property_id, name, parent_id, that.zone_id, business_type_id, area_size, description, bzid).then(function (res) {
            if (res.data.code == 200) {
              that.closeEdit()
              var alertText = {}
              alertText.bg = '#00A0E9'
              alertText.title = that.editTitle
              alertText.text = '修改商铺成功'
              alertText.confirm = false
              that.$emit('alertMessage', true, alertText)
              var data = {}
              data.itype = 'store'
              data.id = bzid
              data.value = bzid
              data.name = name
              data.label = name
              data.description = description
              data.parent_id = parent_id
              data.business_type_id = business_type_id
              data.area_size = area_size
              data.zones = that.zone_id.split(',').map(Number)
              that.$emit('updateStoreData', that.addmall.id, parent_id, data)
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
    @color: #919191;
    @f16: 1rem;
    @font-size-base: 14px;
    @font-size-small: 12px;

    .f_ta(@direction) {
        text-align: @direction;
    }

    h3 {
        font-size: 20px;
        padding-left: 28px;
        padding-bottom: 20px;
        border-bottom: 1px solid #d7dfe3;
        color: @color;
    }

    .ivu-form .ivu-form-item-label {
        font-size: 18px;
    }

    .ivu-form-item {
        width: 100%;
    }

    .total {
        line-height: 34px;
        font-size: 16px;
    }

    .ivu-form-item {
        margin-bottom: 0;
    }

    .months {
        text-align: right;
        width: 24%;
        line-height: 34px;
        font-size: 16px;
        padding-right: 15px;
    }

    .form-inlinie {
        margin-bottom: 10px;
    }

    .m0 {
        margin: 0;
    }

    .modal {
        align-items: center;
        display: none;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        position: fixed;
        z-index: 999;
    }

    .modal.is-active {
        display: flex;
    }

    .modal-background {
        background-color: #000;
        opacity: 0.3;
    }

    .flexs {
        display: flex;
        width: 100%;
    }

    .addFloorShop {
        bottom: -30px !important;
    }

    .control {
        position: absolute;
        right: 20px;
        bottom: 20px;

        .ivu-btn {
            width: 90px;
            color: #fff;
            outline: none;

            &:nth-child(1) {
                margin-right: 20px;
                background-color: #00a0e9;

                &:hover {
                    border: px solid #00a0e9;
                }
            }

            &:nth-child(2) {
                background-color: #fff;
                color: #515a6e;

                &:hover {
                    color: #57a3f3;
                }
            }
        }
    }

    .modal-background,
    .modal {
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
    }

    .modal-content,
    .modal-card {
        margin: 0 20px;
        max-height: calc(100vh - 160px);
        overflow: auto;
        position: relative;
        width: 100%;
    }

    @media screen and (min-width: 769px), print {
        .modal-content,
        .modal-card {
            margin: 0 auto;
            max-height: 90vh;
            width: 40%;
        }
    }

    .modal-card-title {
        color: #363636;
        flex-grow: 1;
        flex-shrink: 0;
        font-size: 1.5rem;
        line-height: 1;
    }

    .modal-card-body {
        -webkit-overflow-scrolling: touch;
        background-color: white;
        flex-grow: 1;
        flex-shrink: 1;
        color: @color;
        position: relative
    }

    .formmail {
        padding: 20px;
        display: flex;
        width: 100%;
        flex-wrap: wrap;

        .left {
            width: 28%;
            margin-right: 0;
        }

        .right {
            width: 68%;
            margin-left: 4%;

            .radios {
                display: flex;
            }
        }
    }

    label {
        font-size: 18px;
        margin-bottom: 10px;
        display: block;
    }

    .form-inlinie {
        display: flex;

        .radio {
            width: 24%;
            font-size: 1rem;
            line-height: 34px;

            label {
                margin: 0;
            }
        }
    }

    .w100 {
        .ivu-form-item {
            width: 100%;
        }
    }

    .fs16 {
        font-size: 1rem;
        line-height: 35px;
        padding-left: 5px;
    }

    .addmail {
        .ivu-col-span-8 {
            display: block;
            width: 33.33333333%;
            text-align: right;
            padding-right: 20px;
        }
    }

    .addsub {
        label {
            margin: 0;
        }

        .ivu-col-span-6 {
            margin-top: 0.3125rem;

            label {
                font-size: @f16;
            }
        }
    }

    .omonth {
        width: 30%;
        margin-left: 3.3%;
        font-size: @f16;
        margin-bottom: @font-size-small - 2;

        .ivu-col-span-6 {
            .f_ta(right);
            padding-right: @font-size-base;
        }

        .ivu-col-span-24 {
            .f_ta(center);
        }

        img {
            cursor: pointer;
        }
    }

    .addEntity {
        .ivu-form-item {
            margin-bottom: 12px;
        }

        .ivu-form .ivu-form-item-label {
            padding: 0px 12px 5px 0;
        }

        .ivu-form .ivu-form-item-label {
            margin-top: 8px;
        }

        .dialogs-edit {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 66666;

            .dialogs-edit-bg {
                width: 100%;
                height: 100%;
                background-color: #000;
                opacity: 0.3;
            }

            .dialogs-edit-text {
                position: absolute;
                left: 50%;
                top: 50%;
                // margin-left: -414px;
                // margin-top: -343px;
                // width: 828px;
                // height: 686px;
                background-color: #fff;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(215, 223, 227, 1);
                box-shadow: 1px 2px 10px 0px rgba(193, 193, 193, 0.2);
                border-radius: 8px;

                .edit-title {
                    width: 100%;
                    height: 53px;
                    line-height: 53px;
                    padding-left: 20px;
                    background: rgba(242, 242, 242, 1);
                    font-size: 18px;
                    font-family: PingFangSC-Medium;
                    font-weight: 500;
                    color: rgba(91, 89, 89, 1)
                }
            }
        }

        .edit-close {
            position: absolute;
            right: -5px;
            top: -5px;
            background: #fff;
            width: 33px;
            height: 33px;
            box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
            border-radius: 5px;
            text-align: center;
            line-height: 33px;
            cursor: pointer;
            transition: all .23s ease .1s;

            &:hover {
                transform: translate(5px, -5px);
                box-shadow: 0 0 0 0 rgba(0, 0, 0, .1)
            }

            i {
                font-size: 20px;
            }
        }

    }
</style>
<style>
    .right .ivu-form-item {
        margin-bottom: 0px !important;
        height: 40px;
        position: relative;
    }

    .right .ivu-col-span-3 {
        width: 9.5%;
        margin-right: 10px;
    }

    .omonth .ivu-form-item-label {
        position: absolute;
        right: 0px;
    }

    .stores {
        margin-left: 8px;
    }
</style>
