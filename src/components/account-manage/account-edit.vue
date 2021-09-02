<template>
	<modal ref="modal"
				 :loading="true"
				 :width="800"
				 :title="$t(editTitle)"
				 @onOk="handleSubmit('formInline')"
				 @onCancel="closeEdit">
		<div class="flex-start account-form">
			<div class="flex-column left">
				<img :src="uploadImg" class="uploadImg">
				<uploadImg @changeImg="changeImg"></uploadImg>
			</div>
			<div class="model-right">
				<div class="edit-right-title">{{ $t('详细信息') }}</div>
				<Form ref="formInline" :model="userForm" :rules="ruleInline" inline>
					<div class="flex-between">
						<FormItem prop="username" :label="$t('用户名')">
							<Input :disabled="modify" :maxlength="45" :placeholder="$t('holder.请输入用户名')"
										 v-model="userForm.username"></Input>
						</FormItem>
						
						<FormItem prop="realname" :label="$t('姓名')">
							<Input v-model="userForm.realname" :maxlength="128" :placeholder="$t('holder.请输入用户姓名')"/>
						</FormItem>
						<input type="text" class="input-hidden">
						<input type="password" class="input-hidden">
					</div>
					<div class="flex-between password">
						<FormItem prop="password" :label="$t('密码')">
							<Input v-model="userForm.password"
										 @on-focus='passwordType'
										 :type="psType"
										 placeholder/>
						</FormItem>
						<FormItem prop="password2" :label="$t('确认密码')">
							<Input v-model="userForm.password2"
										 @on-focus='passwordType'
										 :type="psType"
										 placeholder/>
						</FormItem>
					</div>
					<div class="flex-between">
							<FormItem prop="role" :label="$t('角色')" v-if="showRolePermission">
								<Select v-model="userForm.role" :disabled="disabledRole" @on-change="changeRole">
									<Option
										v-for="item in roleList"
										:value="item.value"
										:key="item.value"
									>{{ $t(item.label) }}
									</Option>
								</Select>
							</FormItem>
						<div class="w-100"  v-if="showEntityPermission">
							<FormItem prop="bzidList" v-if="!superAdmin" :label="$t('实体权限')" style="position:relative">
								<el-cascader
									:placeholder="$t('holder.请选择')"
									class="account-edit-select"
									@change="changeBzid"
									v-model="userForm.bzidList"
									:disabled="disabledRole"
									collapse-tags
									:options="organization"
									:props="{ multiple: true,checkStrictly: true ,expandTrigger:'hover'}"
									clearable>
								</el-cascader>
							</FormItem>
							<FormItem :label="$t('实体权限')" v-else :prop='editTitle=="编辑用户"?"superAdminList":""'>
								<Select :value="$t('全部实体')" disabled>
									<Option :value="$t('全部实体')">{{ $t('全部实体') }}</Option>
								</Select>
							</FormItem>
						</div>
					</div>
					<div class="flex-between">
						<FormItem prop="sex" class="w-100" :label="$t('性别')">
							<Select v-model="userForm.sex">
								<Option
									v-for="item in sexList"
									:value="item.value"
									:key="item.value"
								>{{ item.label }}
								</Option>
							</Select>
						</FormItem>
					</div>
					<div class="flex-between">
						<FormItem prop="mobile" :label="$t('手机号')">
							<Input v-model="userForm.mobile" placeholder/>
						</FormItem>
					</div>
					<div class="flex-between">
						<FormItem prop="email" :label="$t('邮箱')">
							<Input v-model="userForm.email" type="email" placeholder/>
						</FormItem>
					</div>
				
				</Form>
			</div>
		</div>
	</modal>
</template>

<script>
  import { validateTel, validateSelectMore } from '@/libs/util'
  import { addUserData, updateUserData } from '@/api/manager.js'
  import uploadImg from '_c/common/uploadImg.vue'
  import Modal from '_c/common/Modal.vue'

  import md5 from 'md5'
  import _ from 'lodash'

  export default {
    props: {
      editData: Object,
      roleList: {
        type: [Array, Object],
        default: []
      },
      organization: {
        type: [Array, Object],
        default: []
      }
    },
    components: {
      uploadImg,
      Modal
    },
    data () {
      var that = this
      // 密码验证
      const validatePass = (rule, value, callback) => {
        if (!this.modify) {
          if (value === undefined || value === '') {
            callback(new Error(this.$t('密码不能为空')))
          } else if (value.length < 6) {
            callback(new Error(this.$t('密码长度不得小于6个字符')))
          } else if (value.length > 255) {
            callback(new Error(this.$t('密码长度不得大于255个字符')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      // 用户名验证
      const validUserName = (rule, value, callback) => {
        if (value === undefined || value === '') {
          callback(new Error(this.$t('用户名不能为空')))
        } else if (value.length < 2) {
          callback(new Error(this.$t('长度不得小于2个字符')))
        } else if (value.length > 10) {
          callback(new Error(this.$t('最多输入10个字符')))
        } else {
          callback()
        }
      }
      // 用户姓名验证
      const validRealName = (rule, value, callback) => {
        if (value === undefined || value === '' || value === null) {
          callback()
        } else if (value.length < 2) {
          callback(new Error(this.$t('长度不得小于2个字符')))
        } else if (value.length > 10) {
          callback(new Error(this.$t('最多输入10个字符')))
        } else {
          callback()
        }
      }
      // 密码确认验证
      const validatePassCheck = (rule, value, callback) => {
        if (!that.modify) {
          if (value === undefined || value === '') {
            callback(new Error(this.$t('fn.require', [this.$t('password')])))
          } else if (value.length < 6) {
            callback(new Error(this.$t('密码长度不得小于6个字符')))
          } else if (value.length > 255) {
            callback(new Error(this.$t('密码长度不得大于255个字符')))
          } else if (that.userForm.password2 !== that.userForm.password) {
            callback(new Error(this.$t('两次密码不一致!')))
          } else {
            callback()
          }
        } else {
          if (that.userForm.password2 !== that.userForm.password) {
            callback(new Error(this.$t('两次密码不一致!')))
          } else {
            callback()
          }
        }
      }
      // 超级管理员权限验证
      const superAdminCheck = (rule, value, callback) => {
        callback()
      }
      return {
        superAdmin: false,
        disabledRole: false,
        showRolePermission: true,
        showEntityPermission: true,
        psType: 'text',
        checklists: [],
        editTitle: '',
        uploadImg: require('@/assets/images/fixation_img/rest/who.png'),
        userForm: {
          avatar: require('@/assets/images/fixation_img/rest/who.png'),
          username: '',
          realname: '',
          mobile: '',
          checklist: '',
          bzidList: '',
          age: '',
          sex: '',
          lvl: '',
          email: '',
          password: '',
          password2: '',
          userid: ''
        },
        ruleInline: {
          username: [{ required: true, validator: validUserName, trigger: 'blur' }],
          realname: [{ required: false, validator: validRealName, trigger: 'blur' }],
          mobile: [{ required: false, validator: validateTel, trigger: 'blur' }],
          checklist: [{ required: true, validator: validateSelectMore, trigger: 'change' }],
          bzidList: [{ required: true, validator: validateSelectMore, trigger: 'change' }],
          role: [{ required: true, validator: validateSelectMore, trigger: 'change' }],
          email: [{ required: true, message: this.$t('邮箱不能为空'), trigger: 'blur' },
            { type: 'email', message: this.$t('邮箱格式不正确'), trigger: 'blur' }],
          password: [{ required: true, validator: validatePass, trigger: 'blur' }],
          password2: [{ required: true, validator: validatePassCheck, trigger: 'blur' }],
          superAdminList: [{ required: true, validator: superAdminCheck }]
        },
        sexList: [{ 'label': this.$t('男'), 'value': 1 }, { 'label': this.$t('女'), 'value': 0 }],
        modify: false,
        copyBzid: []
      }
    },
    watch: {
      editData: {
        handler (newValue, oldValue) {
          this.modify = newValue.type == 'edit'
          if (newValue.type == 'edit') {
            this.editTitle = '编辑用户'
            this.userForm = newValue.data
            this.userForm.password = '*******'
            this.userForm.password2 = '*******'
            this.userForm.username = this.userForm.account
            this.userForm.role = newValue.data.roles_id
            this.superAdmin = this.userForm.role < 3
            if (this.userForm.name == ' ') {
              this.userForm.realname = ''
            } else {
              this.userForm.realname = this.userForm.name
            }
            if (this.userForm.gender == ' ') {
              this.userForm.sex = ''
            } else {
              this.userForm.sex = this.userForm.gender === '男' ? 1 : 0
            }
            if (this.userForm.mobile == ' ') this.userForm.mobile = ''
          } else {
            this.editTitle = '添加用户'
          }
        },
        immediate: true
      }
    },
    methods: {
      /*
			*@method 自动重选实体bzid
			*@param {string} type 类型 add:新增;remove:减少
			*@param {array}} diffBzid 当前选择的新增或者减少的bzid
			*/
      reselectBzid (type, diffBzid) {
        var that = this
        var tempBzidList = _.cloneDeep(this.userForm.bzidList)
        if (tempBzidList == '' || tempBzidList == undefined) return false
        var organizations = _.cloneDeep(this.organization)
        if (type == 'add') { // 新增操作
          organizations.forEach(function (m) {
            if (diffBzid.length == 1) { // 当选择的是购物中心,该购物中心下的实体全部选中
              if (diffBzid.toString() == m.id.toString()) {
                tempBzidList.push([m.id])
                if (m.children) {
                  m.children.forEach(function (k) {
                    tempBzidList.push([m.id, k.id])
                    if (k.children) {
                      k.children.forEach(function (kk) {
                        tempBzidList.push([m.id, k.id, kk.id])
                      })
                    }
                  })
                }
              }
            } else if (diffBzid.length == 2) { // 当选择的是楼层,该楼层下的实体全部选中
              m.children.forEach(function (k) {
                if (diffBzid[1].toString() == k.id.toString()) {
                  tempBzidList.push([m.id, k.id])
                  if (k.children) {
                    k.children.forEach(function (kk) {
                      tempBzidList.push([m.id, k.id, kk.id])
                    })
                  }
                }
              })
            }
          })
          let realBzid = this.uniqArray(tempBzidList)// 去重
          organizations.forEach(function (m) { // 当某楼层下实体全部选中,该楼层选中
            if (m.children) {
              m.children.forEach(function (k) {
                if (k.children) {
                  let count = 0
                  realBzid.forEach(function (r) {
                    if (r.length == 3 && r[1].toString() == k.id.toString()) {
                      count++
                    }
                  })
                  if (k.children.length == count) {
                    realBzid.push([m.id, k.id])
                  }
                }
              })
            }
          })
          realBzid = this.uniqArray(realBzid)
          organizations.forEach(function (m) { // 当某购物中心下楼层全部选中,该购物中心选中
            if (m.children) {
              let count = 0
              realBzid.forEach(function (r) {
                if (r.length == 2 && r[0].toString() == m.id.toString()) {
                  count++
                }
              })
              if (m.children.length == count && count != 0) {
                realBzid.push([m.id])
              }
            }
          })
          realBzid = this.uniqArray(realBzid)// 去重
          this.userForm.bzidList = realBzid
          this.copyBzid = realBzid
        } else { // 减少操作
          var tempBzidLists = []
          if (diffBzid.length == 1) { // 当某购物中心被取消,该购物中心下的所有实体都被取消
            tempBzidList.forEach(function (e, indexs) {
              if (e[0].toString() != diffBzid.toString()) {
                tempBzidLists.push(e)
              }
            })
          } else if (diffBzid.length == 2) { // 当某楼层被取消,该楼层下的所有实体都被取消
            tempBzidList.forEach(function (e, indexs) {
              if (e.length == 1 && e.toString() != diffBzid[0].toString()) {
                tempBzidLists.push(e)
              } else if (e.length == 2) {
                tempBzidLists.push(e)
              } else if (e.length == 3 && e[1].toString() != diffBzid[1].toString()) {
                tempBzidLists.push(e)
              }
            })
          } else if (diffBzid.length == 3) { // 当某商铺或出入口被取消,取消该商铺或出入口bzid
            let temp = diffBzid[0] + ',' + diffBzid[1]
            tempBzidList.forEach(function (e, indexs) {
              if (e.toString() != temp && e.toString() != diffBzid[0].toString()) {
                tempBzidLists.push(e)
              }
            })
          }
          that.userForm.bzidList = tempBzidLists
          that.copyBzid = tempBzidLists
        }
      },
      /*
			*@method  当前选中的实体bzid去重
			*@param {arr} arr 实体bzid数组
			*/
      uniqArray (arr) {
        var realBzid = []
        arr.forEach(function (m, index) {
          if (m.constructor == Array) {
            if (index == 0) {
              realBzid.push(m)
            } else {
              let count = 0
              realBzid.forEach(function (k) {
                if (k.toString() == m.toString()) {
                  count++
                }
              })
              if (count == 0) {
                realBzid.push(m)
              }
            }
          }
        })
        return realBzid
      },
      /*
			*@method 更改选中的实体
			*@param {number} value 当前操作的实体bzid
			*/
      changeBzid (value) {
        var diffBzid = []
        // 重置copyBzid,当选择了实体关闭后又新增用户时
        if (this.userForm.bzidList.length == 0) {
          this.copyBzid = this.userForm.bzidList
        } else {
          var that = this
          if (value.length < this.copyBzid.length) { // 当前操作是取消实体
            this.copyBzid.forEach(function (m) { // 筛选取消的实体bzid
              let count = 0
              that.userForm.bzidList.forEach(function (kk) {
                let oldstr = m.toString()
                let newstr = kk.toString()
                if (oldstr == newstr) {
                  count++
                }
              })
              if (count == 0) {
                if (typeof (m) === 'number') {
                  diffBzid = [m]
                } else {
                  diffBzid = m
                }
              }
            })
            this.reselectBzid('remove', diffBzid)
          } else { // 当前操作是新增实体
            this.userForm.bzidList.forEach(function (m) { // 筛选新增的实体bzid
              let count = 0
              that.copyBzid.forEach(function (kk) {
                let oldstr = m.toString()
                let newstr = kk.toString()
                if (oldstr == newstr) {
                  count++
                }
              })
              if (count == 0) {
                if (typeof (m) === 'number') {
                  diffBzid = [m]
                } else {
                  diffBzid = m
                }
              }
            })
            this.reselectBzid('add', diffBzid)
          }
        }
      },
      changeRole (value) {
        this.superAdmin = value < 3
      },
      closeEdit () {
        this.$refs.formInline.resetFields()
        this.$refs.modal.closeModal()
      },

      passwordType () {
        this.psType = 'password'
      },
      changeImg (img) {
        this.userForm.avatar = img
        this.uploadImg = img
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.updataUser()
          }else {
            this.$refs.modal.resetOkButton()
					}
        })
      },
      updataUser () {
        var that = this
        var user = {}
        user.level_id = this.userForm.lvl
        user.username = this.userForm.username
        user.password = this.userForm.password === '*******' ? '' : md5(this.userForm.password)
        if (this.userForm.bzidList == '') {
          user.checklist = []
        } else {
          user.checklist = this.userForm.bzidList.map(function (m) {
            return m[0]
          })
        }
        user.checklist = _.uniq(user.checklist)
        user.checklist = user.checklist.join(',')
        user.realname = this.userForm.realname
        user.sex = this.userForm.sex
        user.mobile = this.userForm.mobile
        user.email = this.userForm.email
        user.avatar = this.userForm.avatar
        user.roles_id = this.userForm.role
        user.business_zone_privilege = JSON.stringify(this.userForm.bzidList)

        if (!this.modify) {
          if (user.avatar == require('@/assets/images/fixation_img/rest/who.png') || user.avatar == undefined) {
            user.avatar = ''
          }
          addUserData(user)
            .then((res) => {
              this.$refs.modal.resetOkButton()
              switch (res.data.code) {
                case 200:
                  this.$message.success(this.$t('fn.successTo', [this.$t('添加用户')]))
									this.closeEdit()
                  this.$emit('success')
                  break
                case 302:
                  this.$message.warning(this.$t('用户名已存在'))
                  break
                case 307:
                  this.$message.warning(this.$t('邮箱已被占用'))
                  break
                default:
                  this.$message.error(this.$t('fn.failedTo', [this.$t('添加用户')]))
                  break
              }
            })
        } else {
          user.id = that.userForm.id
          updateUserData(user)
            .then(res => {
              this.$refs.modal.resetOkButton()
              if (res.data.code === 200) {
                this.$message.success(this.$t('fn.successTo', [this.$t('编辑用户')]))
                this.$emit('success');
                this.closeEdit()
              } else if (res.data.code === 307) {
                this.$message.warning(this.$t('邮箱已被占用'))
              }
            })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
	.account-form {
		.left {
			align-items: center;
			width: 38%;
			flex: none;
			
			.uploadImg {
				width: 177px;
				height: 177px;
				border-radius: 50%;
				margin-bottom: 30px;
			}
		}
		
		.model-right {
			flex: 1;
			.edit-right-title{
				margin-bottom: 20px;
			}
			.flex-between {
				width: 100%;
				/deep/.ivu-form-item{
					width: 45%;
				}
				.input-hidden {
					position: absolute;
					top: -999px;
					left: -999px;
				}
				.w-100 {
					width: 45%;
					/deep/.ivu-form-item{
						width: 100%
					}
				}
				.half {
					width: 50%;
					

				}
			}
		}
	}

</style>
