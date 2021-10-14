<template>
	<div class="holiday">
		<div class="headerSelect">
			<vs-select class="selectExample" autocomplete v-model="selectYear">
				<vs-select-item :key="index" :value="item.value" :text="item.key" v-for="(item,index) in years"/>
			</vs-select>
		</div>
		<div class="holidayTable">
			<TableMultipleSelected class="tables" :titleName="$t(titleName)" :tableName='$t(tableName)'
														 :tableList="showHolidays">
			
			</TableMultipleSelected>
			<div class="paginations">
				<vs-pagination :total="holidayTotal" v-model="currentx" goto></vs-pagination>
			</div>
		</div>
		<div class="holidayTable">
			<div class="account-add-remove">
                <span class="account-add" @click="addData" :title="$t('添加')">
                    <Icon type="md-add"/>
                </span>
				<span class="account-add" :title="$t('删除')" @click="deleteMultiple">
                    <Icon type="md-remove"/>
                </span>
			</div>
			<TableMultipleSelected class="tables" @tableData='tableData' @removeData='removeData' @tableSelect="tableSelect"
														 :isMultiple='true' :titleName="$t(titleName2)" :tableName='$t(tableName2)'
														 :tableList="showEvents">
			</TableMultipleSelected>
			<div class="paginations">
				<vs-pagination :total="eventTotal" v-model="currentActive" goto></vs-pagination>
			</div>
		</div>
		<holidayEdit
			ref="editActive"
			@initData="initData"
		></holidayEdit>
	</div>
</template>

<script>
  import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
  import holidayEdit from '@/components/holiday-manage/holiday-edit.vue'
  import { getActiveDays, deleteActiveDays } from '@/api/manager.js'
  import { yearList } from '@/libs/util.js'

  export default {
    components: {
      TableMultipleSelected,
      holidayEdit,
    },
    data () {
      return {
        titleName: '节假日活动管理',
        tableName: ['节假日名称', '开始时间', '结束时间', '持续时间'],
        titleName2: '活动管理',
        tableName2: ['节假日名称', '活动归属', '目标客流', '开始时间', '结束时间', '持续时间', '操作'],
        showHolidays: [],
        showEvents: [],
        holidayAllData: [],
        eventAllData: [],
        selectYear: new Date().getFullYear(),
        holidayTotal: 1,
        eventTotal: 1,
        currentx: 1,
        currentActive: 1,
        years: [],
        id: '',
        currentPropertyId: '',
        selected: [],
      }
    },
    watch: {
      '$store.state.home.headerAction' () { // 监听是否切换购物中心
        this.currentPropertyId = this.$store.state.home.headerAction
        this.initData(21, true)// 刷新节假日活动数据
      },
      currentx (val) { // 监听节假日表格页码
        var data = _.cloneDeep(this.holidayAllData)
        this.showHolidays = data.splice((this.currentx - 1) * 5, 5)
        this.$nextTick(() => {
          document.getElementsByClassName('vs-pagination--input-goto')[1].value = val
        })
      },
      currentActive (val) { // 监听活动表格页码
        var data = _.cloneDeep(this.eventAllData)
        this.showEvents = data.splice((this.currentActive - 1) * 5, 5)
        this.$nextTick(() => {
          document.getElementsByClassName('vs-pagination--input-goto')[2].value = val
        })
      },
      selectYear: {// 切换年份
        handler (newVal, oldVal) {
          if (newVal) {
            this.initData(20, true)
            this.initData(21, true)
          }
        },
        immediate: false
      }
    },
    mounted () {
      this.currentPropertyId = this.$store.state.home.headerAction
      this.years = yearList()
      this.initData(20, true)
      this.initData(21, true)
    },
    methods: {
      // 新增活动
      addData () {
        this.$refs.editActive.$refs.modal.showModal()
        var data = {
          name: '',
          begin: '',
          end: '',
          description: ''
        }
        var that = this
        var checklist = that.$store.state.user.checklist
        this.$nextTick(() => {
          that.$refs.editActive.isAlert = false
          that.$refs.editActive.datas = data
          that.$refs.editActive.isUpdate = false
          that.$refs.editActive.msgTitle = this.$t('添加活动')

          if (that.$store.state.user.role_id < 3) {
            that.$refs.editActive.showBelong = true
          } else {
            that.$refs.editActive.showBelong = checklist.length > 1
            if (!that.$refs.editActive.showBelong) {
              that.$refs.editActive.datas.property = Number(that.$store.state.home.headerAction)
            }
          }
        })
      },
      tableData (value) {
        this.$refs.editActive.$refs.modal.showModal()
        var that = this
        var checklist = that.$store.state.user.checklist
        this.$nextTick(() => {
          that.$refs.editActive.isAlert = false
          that.$refs.editActive.datas = _.cloneDeep(value.data)
          that.$refs.editActive.datas.property = that.$refs.editActive.datas.property_id
          that.$refs.editActive.isUpdate = true
          that.$refs.editActive.msgTitle = this.$t('编辑活动')

          if (that.$store.state.user.role_id < 3) {
            that.$refs.editActive.showBelong = true
          } else {
            that.$refs.editActive.showBelong = checklist.length > 1
          }
        })
      },
      removeData (value) {
        this.$alert({
          content: this.$t('确认删除此活动信息？'),
          cancel () {
          },
          confirm: () => {
            deleteActiveDays(value.data.id).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(this.$t('删除成功'))
                this.initData(21, false)
              } else {
                this.$alert({ content: res.data.message })
              }
            })
          }
        })

      },
      tableSelect (value) {
        this.selected = value
      },
      deleteMultiple () {
        if (!this.selected.length) {
          this.$alert({
            content: this.$t('删除活动管理请选择最少一个！')
          })
        } else {
          this.$alert({
            content: this.$t('确定要删除所选中的活动管理？'),
            cancel () {
            },
            confirm: () => {
              let curLe = this.selected.length
              this.selected.forEach(list => {
                deleteActiveDays(list.id).then(res => {
                  this.selected.splice(0, this.selected.length)
                  curLe--
                  if (curLe == 0) {
                    this.$message.success(this.$t('删除成功'))
                    this.initData(21, false)
                  }
                })
              })
            }
          })
        }
      },
      initData (type, isInit) {
        var that = this
        if (type === 20) {
          getActiveDays(this.selectYear, 20).then(res => {
            this.loading = false
            let data = res.data.data
            this.holidayAllData = _.cloneDeep(data)
            data.forEach(e => {
              const day = (this.$i18n.locale === 'zh-CN')
                ? '天'
                : (e.duration > 1 ? ' days' : ' day')
              e.duration = String(e.duration) + day
            })
            this.holidayTotal = Math.ceil(data.length / 5)
            this.holidays = _.clone(data)
            if (isInit) {
              this.showHolidays = data.splice(0, 5)
              this.currentx = 1
            } else {
              this.showHolidays = data.splice((this.currentx - 1) * 5, 5)
            }
          }).catch(err => {
            this.showHolidays = []
            this.holidayTotal = 1
          })
        } else if (type === 21) {
          // 查询所有购物中心的活动
          let list = []
          // 0是集团
          getActiveDays(that.selectYear, 21, 0).then(res => {
            res = res.data.data
            res.forEach(b => {
              b.operation = true
              const day = (this.$i18n.locale === 'zh-CN')
                ? '天'
                : (b.duration > 1 ? ' days' : ' day')
              b.duration = String(b.duration) + day
              b.enterGoal = b.property_name || ' '
              if (b.target_enter == 0) {
                b.saleGoal = 0
              } else {
                b.saleGoal = b.target_enter || ' '
              }
              list.push(b)
            })
            this.eventAllData = _.cloneDeep(list)
            this.eventTotal = Math.ceil(this.eventAllData.length / 5)
            if (isInit) {
              this.showEvents = list.splice(0, 5)
              this.currentActive = 1
            } else {
              this.showEvents = list.splice((this.currentActive - 1) * 5, 5)
              if (this.eventAllData.length > 0 && this.showEvents.length === 0) {
                this.currentActive--
                this.showEvents = list.splice((this.currentActive - 1) * 5, 5)
              }
            }
          }).catch(err => {
            that.showEvents = []
            that.eventTotal = 1
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
	.holiday {
		.headerSelect {
			position: relative;
			margin-top: -40px;
			
			.con-select {
				position: relative;
				left: 91%;
				top: -17px;
				width: 74px;
				
				input {
					background-color: rgba(93, 144, 255, 0.0);
				}
			}
		}
		
		.tables {
			height: 430px;
			box-shadow: none;
			background: none
		}
		
		.account-add-remove {
			z-index: 1;
			position: absolute;
			top: 5px;
			right: 20px;
			
			.account-add {
				margin-top: 16px !important;
			}
			
			span {
				float: left;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 24px;
				height: 24px;
				border-radius: 50%;
				text-align: center;
				font-size: 16px;
				color: #fff;
				margin-left: 20px;
				cursor: pointer;
				
				&:nth-child(1) {
					margin-top: 9px;
					background-color: #2BD9CF;
				}
				
				&:nth-child(2) {
					margin-top: 9px;
					background-color: #FEB33D !important;
				}
			}
		}
		
		.holidayTable {
			position: relative;
			background-color: #fff;
			border-radius: 6px;
			margin-bottom: 20px;
			padding-bottom: 20px;
		}
		
		.paginations {
			position: relative;
			bottom: 6px;
			margin-top: 20px;
		}
		
		.router-view {
			padding-bottom: 0px;
		}
		
		.ivu-form-item-error-tip {
			position: absolute;
			top: 95%;
			left: 0;
			line-height: 1;
			padding-top: 0px;
			color: #ed4014;
		}
	}
</style>
