<template>
	<div class="account-center">
		<div class="flex mb-4 account-text">
			<div class="w-full bg-grid-color-secondary">
				<div class="account-text-right">
					<div class="account-seach">
						<div class="data-picker">
							<div class="account-seach-text">
								<!-- <Icon size='24' type="ios-search" /> -->
								<input type="text" v-model="searchText" :placeholder="$t('fn.inputHolder',[$t('accountName')])">
							</div>
							<div class="account-seach-text" style="margin-left:10px;">
								<input type="text" v-model="searchRole" :placeholder="$t('fn.inputHolder',[$t('role')])">
							</div>
							<div class="account-add-remove">
                <span class="account-add" :title="$t('add')" @click="addData">
                  <Icon type="md-add"/>
                </span>
								<span :title="$t('del')" @click="allRemoveData">
                  <Icon type="md-remove"/>
                </span>
							</div>
						</div>
					</div>
					<div class="account-table">
						<table-multiple-selected
							@tableData='tableData'
							@removeData='removeData'
							@tableSelect='tableSelect'
							:tableName='tableName'
							:tableList='filterUser'
							:titleName='titleName'
							:isMultiple='true'
						></table-multiple-selected>
					</div>
				</div>
			</div>
		</div>
		<account-edit
			ref="accoutModal"
			@success='initData'
			:editData='dataList'
			:roleList="roleList"
			:organization="organization"
		></account-edit>
	</div>
</template>

<script>
  import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
  import accountEdit from '@/components/account-manage/account-edit.vue'
  import photoImg from '@/assets/images/fixation_img/rest/who.png'
  import { getUserData, deleteUserData, getbusinessDate } from '@/api/manager.js'
  import { getRolesList } from '@/api/custom.js'
  import _ from 'lodash'

  export default {
    components: {
      TableMultipleSelected,
      accountEdit,
    },
    data () {
      return {
        tableIdList: [],
        userLvl: '',
        searchText: '',
        searchRole: '',
        dataList: {},
        colorAlert: '#00a0e9',
        titleName: 'userList',
        tableName: [
          'avator', 'accountName', 'userName', 'role', 'gender', 'phoneNumber', 'mail', 'operate'
        ],
        tableList: [],
        userId: '',
        roleList: [],
        organization: []
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      },
      filterUser () {
        var that = this
        return this.tableList.filter(function (u, index, array) {
          return u.account.toLowerCase().includes(that.searchText.toLowerCase()) && u.rank.includes(that.searchRole)
        })
      }
    },
    created () {
      this.initRoleList()
      this.initOrganization()
    },
    mounted () {
      this.initData()
    },
    methods: {
      initOrganization () {
        var that = this
        getbusinessDate(52).then(function (res) {
          if (res.data.code == 200) {
            let userRoleId = that.$store.state.user.role_id

            let data = res.data.data
            let organization = data.map(function (m, index) {
              m.value = m.id
              m.label = m.name
              if (m.children) {
                m.children.forEach(function (e) {
                  e.value = e.id
                  e.label = e.name
                  if (e.children) {
                    e.children.forEach(function (k) {
                      k.value = k.id
                      k.label = k.name
                    })
                  }
                  if (e.gate) {
                    e.gate.forEach(function (k) {
                      let kk = {}
                      kk.id = k.id
                      kk.value = k.id
                      kk.label = k.name
                      kk.name = k.name
                      if (!(e.children)) {
                        e.children = []
                      }
                      e.children.push(kk)
                    })
                  }
                  if (e.area) {
                    e.area.forEach(function (k) {
                      let kk = {}
                      kk.id = k.id
                      kk.value = k.id
                      kk.label = k.name
                      kk.name = k.name
                      if (!e.children) {
                        e.children = []
                      }
                      e.children.push(kk)
                    })
                  }
                })
              }
              return m
            })
            if (userRoleId < 3) {
              that.organization = organization
            } else {
              let temp = []
              let role_property = that.$store.state.user.checklist
              if (role_property.length) {
                let tem = role_property
                if (role_property.indexOf(',') > -1) {
                  tem = role_property.split(',')
                }
                tem.map(function (m) {
                  return Number(m)
                })
                tem.forEach(function (m) {
                  temp.push(_.find(organization, ['property_id', m]))
                })
                that.organization = temp
              } else {
                that.organization = _.find(organization, ['property_id', role_property])
              }
            }
          }
        })
      },
      initRoleList () {
        var that = this
        let property = this.$store.state.user.role_property
        let role_id = that.$store.state.user.role_id
        property = role_id < 3 ? '' : property
        getRolesList(property).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data
            that.roleList = data.map(function (m) {
              let obj = {}
              obj = m
              obj.name = m.name
              obj.label = m.name
              obj.value = m.id
              obj.id = m.id
              return obj
            })
            let role_id = that.$store.state.user.role_id
            // if(role_id<4){
            //   that.roleList.unshift({"name":"购物中心管理员","label":"购物中心管理员","value":3,"id":3})
            // }
            if (role_id < 3) {
              that.roleList.unshift({ 'name': '集团管理员', 'label': '集团管理员', 'value': 2, 'id': 2 })
            }
            if (role_id < 2) {
              that.roleList.unshift({ 'name': '超级管理员', 'label': '超级管理员', 'value': 1, 'id': 1 })
            }
          }
        })
      },
      initData () {
        var that = this
        getUserData().then(function (res) {
          if (res.data.code === 200) {
            that.tableList = []
            _.forEach(res.data.data, function (item) {
              var list = {}
              list.id = item.userid
              list.photo = (!_.isNull(item.avatar)) ? item.avatar : photoImg
              list.account = item.username
              if (_.isNull(item.realname)) {
                list.name = ' '
              } else {
                list.name = item.realname
              }
              list.rank = item.roles_name
              list.roles_id = item.roles_id
              if (item.sex != null) {
                item.sex === 1 ? list.gender = '男' : list.gender = '女'
              } else {
                list.gender = ' '
              }
              if (_.isNull(item.mobile)) {
                list.mobile = ' '
              } else {
                list.mobile = item.mobile
              }
              list.email = item.email
              list.operation = true
              list.checklist = item.checklist
              list.role = item.roles_id
              list.bzidList = item.business_zone_privilege ? JSON.parse(item.business_zone_privilege) : ''
              list.password = ''
              that.tableList.push(list)
            })
          }
        })
      },
      addData () {
        this.$refs.accoutModal.$refs.modal.showModal()
        this.dataList = {
          data: '',
          type: 'add'
        }
      },
      tableData (value) {
        this.$refs.accoutModal.$refs.modal.showModal()
        this.dataList = _.cloneDeep(value)
      },
      delUser (id) {
        deleteUserData(id).then((res) => {
          if (res.data.code === 200) {
			  this.$message.success(this.$t('fn.successTo',[this.$t('del')]))
			  this.initData()
          } else {
		  	this.$message.error(this.$t('fn.failedTo',[this.$t('del')]))
		  }
        })
      },
      tableSelect (value) {
        var that = this
        that.tableIdList = []
        value.forEach(function (e) {
          that.tableIdList.push(e.id)
        })
      },
      allRemoveData () {
        this.$alert({
          content: this.$t('userDelConfirm'),
          cancel () {
          },
          confirm: () => {
            this.delUser(this.tableIdList.join(','))
          }
        })
      },
      removeData (value) {
        this.$alert({
          content: this.$t('theUserDelConfirm'),
          cancel () {
          },
          confirm: () => {
            this.delUser(value.data.id)
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
	#content-overlay {
		background-color: #f5f5f5;
	}

	.account-center {
		.account-text {
			margin-top: 25px;

			.account-text-right {
				width: 100%;
				height: auto;

				.account-seach {
					width: 100%;
					height: 43px;

					.data-picker {
						margin-bottom: 20px;
						overflow: hidden;
						background-color: #fff;
						padding: 18px 30px;
						-webkit-box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
						box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
						border-radius: 6px;
					}

					.account-seach-text {
						width: 252px;
						height: 100%;
						border-radius: 6px;
						border: 1px solid rgba(0, 0, 0, .2);
						padding: 5px;
						float: left;
						background-color: #fff;

						.ivu-icon {
							float: left;
						}

						input {
							display: inline-block;
							width: 195px;
							border: none;
							height: 31px;
							margin-left: 10px;
							padding-left: 10px;
							background-color: rgba(93, 144, 255, 0.0);
						}
					}

					.account-add-remove {
						float: right;
						margin-right: 10px;

						span {
							display: flex;
							align-items: center;
							justify-content: center;
							float: left;
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
								background-color: #FEB33D;
							}
						}
					}
				}

				.account-table {
					margin-top: 52px;
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px 2px 9px 1px rgba(175, 175, 176, 0.25);
					border-radius: 6px;
					overflow: auto;

					::v-deep img {
						width: 38px;
						height: 38px;
						border-radius: 50%;
						-moz-border-radius: 50%;
						-webkit-border-radius: 50%;
					}
				}
			}
		}
	}
</style>
