<template>
	<modal ref="modal" :loading="true"
				 :width="1300"
				 @onOk="handleSubmit('formValidate')"
				 @onCancel="handleClose"
				 title="编辑购物中心">
		<Form ref="formValidate"
					class="form-data flex-start"
					:model="formValidate"
					:rules="ruleValidate">
			<div class="left">
				<FormItem
					:label="$t('名称')"
					prop="name"
				>
					<Input
						maxlength="20"
						type="text"
						v-model="formValidate.name"
					></Input>
				</FormItem>
				
				<FormItem
					:label="$t('楼层')"
					prop="floor"
					v-if="formValidate.spc == 2"
				>
					<Select
						@on-change="changeFloor"
						:disabled="userLvl == 'common_admin' ? true : false"
						:placeholder="$t('fn._', [$t('holder.请选择'), $t('楼层')])"
						v-model="formValidate.floor"
					>
						<Option
							v-for="item in floors"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				
				<FormItem
					:label="$t('营业时间')"
					prop="timerange"
				>
					<div class="flex-center w-100">
						<TimePicker
							confirm
							type="time"
							v-model="formValidate.timerange[0]"
							placement="bottom-end"
							:placeholder="
                      $t('fn._', [$t('holder.请选择'), $t('营业时间')])
                    "
							class="w-100"
						></TimePicker>
						<div class="mid-margin"> 至 </div>
						<TimePicker
							confirm
							type="time"
							v-model="formValidate.timerange[1]"
							placement="bottom-end"
							:placeholder="
                      $t('fn._', [$t('holder.请选择'), $t('营业时间')])
                    "
							class="w-100"
						></TimePicker>
					</div>
				
				</FormItem>
				<FormItem
					:label="$t('区域关联')"
					prop="zones"
					v-if="isSuperAdmin"
				>
					<Select
						filterable
						multiple
						:placeholder="$t('holder.请选择')"
						v-model="formValidate.zones"
					>
						<Option
							v-for="item in zonelist"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				
				<FormItem
					:label="$t('省份')"
					prop="province"
				>
					<Select
						v-model="formValidate.province"
						:placeholder="$t('fn._', [$t('holder.请选择'), $t('省份')])"
						@on-change="changeProvince"
						class="w-100"
					>
						<Option
							v-for="item in provinceArr"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				
				<FormItem
					:label="$t('城市')"
					prop="city"
				>
					<Select
						v-model="formValidate.city"
						:placeholder="$t('fn._', [$t('holder.请选择'), $t('城市')])"
						class="w-100"
					>
						<Option
							v-for="item in cities"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				
				<FormItem
					:label="$t('地址')"
					prop="address"
				>
					<Input
						maxlength="20"
						type="text"
						v-model="formValidate.address"
					></Input>
				</FormItem>
				
				<FormItem
					:label="$t('面积')"
					prop="area_size"
				>
					<Input type="text" v-model="formValidate.area_size"></Input>
				</FormItem>
				
				<FormItem :label="$t('描述')" prop="description">
					<Input
						maxlength="50"
						type="text"
						v-model="formValidate.description"
					></Input>
				</FormItem>
			</div>
			
			<div class="right">
				<div class="form-control addsub flex-center">
					<FormItem
						:label="$t('选择年份')"
						style="width: auto;word-break: keep-all"
					></FormItem>
					<Select v-model="currentYear" @on-change="currentYearChange">
						<Option v-for="year in yearlist" :value="year" :key="year">
							{{ year }}
						</Option>
					</Select>
				</div>
				<FormItem class="title" :label="$t('客流目标')"></FormItem>
				<div class="form-control flex-center">
						<div class="flex-center">
							<FormItem class="mb0" :label="$t('全年目标')"></FormItem>
							<Radio
								v-model="flowYear"
								@on-change="setFlowYearGoal"
							></Radio>
						</div>
						<div class="flex-center">
							<span>{{ $t('fn.total', ['']) }}</span>
							<Input
								type="number"
								style="margin-left:4px;width:270px"
								:disabled="!disabled"
								v-model="sumFlowYear"
							></Input>
						</div>
						<div class="fs16">
							{{ $t('人') }},
							{{
							$t('fn.平均每月', [
							$t('fn._', [
							Math.floor(sumFlowYear / 12).toLocaleString(),
							$t('人'),
							]),
							])
							}}
						</div>
				</div>
				
				<div class="form-control addsub">
					<row class="m-t-20">
						<div class="flex-center">
							<FormItem :label="$t('每月目标')"></FormItem>
							<Radio
								v-model="flowMonth"
								@on-change="setFlowMonthGoal"
							></Radio>
						</div>
						<div class="flex-wrap">
							<row
								class="omonth"
								v-for="(item, index) in monthsGoal"
								:key="index"
							>
								<i-col span="5" style="margin-left: -6px;">
									<FormItem :label="$t(item.name)"></FormItem>
								</i-col>
								<i-col span="16">
									<Input
										type="number"
										:disabled="disabled"
										v-model="item.modal"
									></Input>
								</i-col>
								<i-col span="2" offset="1">{{ $t('人') }}</i-col>
							</row>
							<row span="24" offset="0" class="fs16">
								{{ $t('全年总计') }}
								{{ totalEnter.toLocaleString() }}
								{{ $t('人') }}
							</row>
						</div>
					</row>
				</div>
				
				<FormItem class="title m-t-20"  :label="$t('销售额目标')"></FormItem>
				<div class="form-control flex-center">
						<div class="flex-center">
							<FormItem class="mb0" :label="$t('全年目标')"></FormItem>
							<Radio
								v-model="saleYear"
								@on-change="setSaleYearGoal"
							></Radio>
						</div>
					<div class="flex-center">
							<span>{{ $t('fn.total', ['']) }}</span>
							<Input
								type="number"
								:disabled="!disabledSale"
								style="margin-left:4px;width:270px"
								v-model="sumSaleYear"
							></Input>
					</div>
						<div class="fs16">
							{{ $t('yuan') }},
							{{
							$t('fn.平均每月', [
							Math.floor(sumSaleYear / 12).toLocaleString() +
							$t('yuan'),
							])
							}}
						</div>
				</div>
				
				<div class="form-control addsub">
					<row class="m-t-20">
						<div class="flex-center">
							<FormItem :label="$t('每月目标')"></FormItem>
							<Radio
								v-model="saleMonth"
								@on-change="setSaleMonthGoal"
							></Radio>
						</div>
						<div class="flex-wrap m-b-40">
							<row
								class="omonth"
								v-for="(item, index) in monthsSale"
								:key="index"
							>
								<i-col span="5" style="margin-left: -6px;">
									<FormItem :label="$t(item.name)"></FormItem>
								</i-col>
								<i-col span="16">
									<Input
										type="number"
										:disabled="disabledSale"
										v-model="item.modal"
									></Input>
								</i-col>
								<i-col span="2" offset="1">{{ $t('yuan') }}</i-col>
							</row>
							<row span="8" offset="1" class="fs16">
								{{ $t('全年总计') }}
								{{ totalSales.toLocaleString() }}
								{{ $t('yuan') }}
							</row>
						</div>
					</row>
				</div>
			</div>
		</Form>
	</modal>
</template>
<script>
  import Modal from '_c/common/Modal.vue'
  import i18n from '@/i18n/i18n'
  import province from '@/assets/json/province.json'
  import { initMonthsData } from '@/libs/util'
  import {
    updateShopmall,
    zones,
  } from "@/api/manager.js";
  import { getYearList } from "@/api/operate";
  import { mapState } from 'vuex'
  export default {
    name: 'modifyShopmall',
    props:{
      userLvl: {
        type: String,
        default: "admin",
      },
		},
    components: {
      Modal
    },
    data () {
      const validSelectTime = (rule, value, callback) => {
        if (value[0] === '' && value[1] === '') {
          callback(new Error(i18n.t('fn.请选择', [i18n.t('营业时间')])))
        } else {
          callback()
        }
      }
      const validSelect = (rule, value, callback) => {
        if (value === '' || (rule.field == 'zones' && !value[0])) {
          callback(new Error(i18n.t('fn.请选择', [i18n.t(rule.tips)])))
        } else {
          callback()
        }
      }
      const validateNumber = (rule, value, callback) => {
        // 模拟异步验证效果
        setTimeout(() => {
          if (!Number.isFinite(Number(value))) {
            callback(new Error(i18n.t('面积数要为数字')))
          } else {
            if (value < 0) {
              callback(new Error(i18n.t('面积数不能为负')))
            } else {
              callback()
            }
          }
        }, 200)
      }
      return {
        formValidate: {
          spc: 1, // 类型
          name: '', // 名称
          timerange: ['', ''], // 营业时间
          zones: [], // 区域关联,
          province: '', // 省份
          city: '', // 市名
          address: '', // 地址
          description: '', // 描述
          area_size: '',//面积

        },
        ruleValidate: {
          name: [
            {
              required: true,
              message: this.$t('名称不能为空'),
              trigger: 'blur',
            },
          ],
          address: [
            {
              required: true,
              message: this.$t('fn._不能为空', [this.$t('地址')]),
              trigger: 'blur',
            },
            {
              type: 'string',
              min: 6,
              message: this.$t('fn.cantLessThan', [this.$t('地址'), 6]),
              trigger: 'blur',
            },
          ],
          timerange: [
            { required: true, validator: validSelectTime, trigger: 'change' },
          ],
          zones: [
            {
              required: true,
              tips: '区域关联',
              validator: validSelect,
              trigger: 'change',
            },
          ],
          province: [
            {
              required: true,
              tips: '省份',
              validator: validSelect,
              trigger: 'change',
            },
          ],
          city: [
            {
              required: true,
              tips: '城市',
              validator: validSelect,
              trigger: 'change',
            },
          ],
          area_size: [
            {
              required: false,
              tips: '面积',
              validator: validateNumber,
              trigger: 'change',
            },
          ],
        },
        flowYear: true,//客流年目标
        flowMonth: false,//客流月目标
        sumFlowYear: '',
        monthsGoal: initMonthsData('name', 'modal'),
        monthsSale: initMonthsData('name', 'modal'),
        saleYear: true,
        saleMonth: false,
        sumSaleYear: '', // 年销售目标
        sumSaleMonth: '', // 月销售目标
        cities: [],
        provinceArr: province,
        disabled: true,
        disabledSale: true,
        currentYear: new Date().getFullYear(),
        zonelist: [],
        yearlist: [],
      }
    },
    computed: {
      ...mapState({
        propertyId: state => state.home.headerAction,
      }),
      isSuperAdmin () {
        return Number(this.$store.state.user.role_id) === 1
      },
      totalEnter () {
        var s = 0
        if (this.flowMonth) {
          var monthsGoal = this.monthsGoal
          s = monthsGoal.map((m) => {
            return m.modal ? Number(m.modal) : 0
          })
          s = _.sum(s)
        }
        this.sumFlowMonth = s
        return s
      },
      totalSales () {
        var s = 0
        if (this.saleMonth) {
          var monthsSale = this.monthsSale
          s = monthsSale.map((m) => {
            return m.modal ? Number(m.modal) : 0
          })
          s = _.sum(s)
        }
        this.sumSaleMonth = s
        return s
      },
    },
    methods: {
      showModal(){
        this.$refs.modal.showModal()
        this.getZones();
        this.getYearList();
        this.currentYearChange(this.currentYear)
				this.changeProvince(this.formValidate.province)
			},
      currentYearChange (value) {
        this.currentYear = value
        const currentYearGoalFlow = this.formValidate.goal_flow.find((f) => {
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
        const currentYearGoalSale = this.formValidate.goal_sale.find((s) => {
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

      /* 设置客流年目标
	*@method setFlowYearGoal
	*@return null
	*/
      setFlowYearGoal () {
        this.disabled = true
        this.flowMonth = false
        this.flowYear = true
      },
      /* 设置客流每月目标
			 *@method setFlowMonthGoal
			 *@return null
			 */
      setFlowMonthGoal () {
        this.disabled = false
        this.flowMonth = true
        this.flowYear = false
      },
      /* 设置销售额年目标
			 *@method setSaleYearGoal
			 *@return null
			 */
      setSaleYearGoal () {
        this.disabledSale = true
        this.saleMonth = false
        this.saleYear = true
      },
      /* 设置销售每月目标
			 *@method setSaleMonthGoal
			 *@return null
			 */
      setSaleMonthGoal () {
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
      /* 格式化选择器数据
			 *@method addValuesToEle2
			 *@param {obj} pArray 需要格式化的数据对象
			 *@return null
			 */
      addValuesToEle2(pArray) {
        return pArray.map((ele)=> {
          ele.value = ele.id;
          ele.label = ele.name;
          return ele;
        });
      },
      /* 获取所有的区域关联zons列表
			 *@method
			 *@param {int}
			 *@return null
			 */
      getZones () {
        zones(this.propertyId).then((res) => {
          this.zonelist = this.addValuesToEle2(res.data.data)
        })
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let flow_year,flow_type,sale_year,sale_type;
            let flowTarget = {},saleTarget = {};
            if(this.flowYear){
              flow_type = "year";
              flow_year = Number(this.sumFlowYear);
						}else {
              flow_type = "month";
              flow_year = this.sumFlowMonth;

              var monthsGoal = _.cloneDeep(this.monthsGoal);
              monthsGoal.forEach((m)=> {
                m.modal = m.modal ? Number(m.modal) : 0;
              });
              for(let i =1;i<=12;i++){
                flowTarget[`flow_target_${i}`] = parseInt(monthsGoal[i-1].modal)
							}
            }
            if(this.saleYear){
              sale_type = "year";
              sale_year = Number(this.sumSaleYear);
						}else {
              sale_type = "month";
              sale_year = this.sumSaleMonth;

              var monthsSale = _.cloneDeep(this.monthsSale);
              monthsSale.forEach((m) =>{
                m.modal = m.modal ? Number(m.modal) : 0;
              })
						
              for(let i =1;i<=12;i++){
                saleTarget[`sale_target_${i}`] = parseInt(monthsSale[i-1].modal)
              }
						}
            const data = {
              ...this.formValidate,
							...flowTarget,
							...saleTarget,
              daily_start:this.formValidate.timerange[0],
              daily_end:this.formValidate.timerange[1],
              zone_id:this.formValidate.zones.toString(),
              flow_type,
              flow_year,
              sale_type,
              sale_year,
							year:this.currentYear,
              company_id:this.$store.state.home.organizationData.company_id
            }
            updateShopmall(this.propertyId,data).then(res=>{
              this.$store.dispatch('updateOrganizationData').then(re=>{
                this.$message.success(
                  this.$t("fn.successTo", [this.$t("编辑购物中心")])
                );
                const data = {
                  name:this.formValidate.name,
                  label:this.formValidate.name,
                  id:this.formValidate.bzid,
                  value:this.formValidate.bzid,
                  property_id:this.formValidate.property_id,
                  zones:this.formValidate.zones,
                };
                this.$emit("updateTypeData", data);
                this.$emit("init");
                this.handleClose()
              })
              
						}).catch(err=>{
						  this.$message.error(err)
              this.$refs.modal.resetOkButton()
						})
          }else {
            this.$refs.modal.resetOkButton()
					}
        });
      },
      handleClose () {
        this.currentYear = new Date().getFullYear()
        this.$refs.formValidate.resetFields()
        this.$refs.modal.closeModal()
      },
			getYearList(){
        getYearList({ property_id: this.propertyId }).then((res) => {
          this.yearlist = res.data.data;
        });
			}
    },

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
	.form-data{
		height: 65vh;
		overflow-y: scroll;
		.w-100{
			width: 100%;
		}
		.left{
			width: 28%;
			.mid-margin{
				margin-left: 5px;
				margin-right: 5px;
			}
		}
		.right{
			flex: 1;
			margin-left: 40px;
			.form-control:nth-child(1) {
				margin-top: 30px;
				width: 45%;
			}
			.mb0{
				margin-bottom: 0;
			}
			.title{
				font-weight: bold;
			}
			.addsub {
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

				.m-b-40 {
					margin-bottom: 40px;
				}
				label {
					margin: 0;
				}
				.m-t-20 {
					margin-top: 20px;
				}
				.ivu-col-span-6 {
					margin-top: 0.3125rem;
					
					label {
						font-size: @f16;
					}
				}
			}
		}
	}
</style>
