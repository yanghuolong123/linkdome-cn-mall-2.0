<template>
	<div>
		<empty-page v-if="hasNoEntity"></empty-page>
		<div v-else class="content flex-column">
			<div class="basic-info flex-column common-card">
				<div class="title flex-between">
					<Cascader
						:data="orgTree"
						v-model="entitySelect"
						change-on-select
						@on-change="cascaderChange"
						class="cascader"
					>
					</Cascader>
					<div class="icon-area flex-center">
						 <span
							 v-if="isSuperAdmin"
							 :title="$t('添加')"
							 @click="addEntity"
						 >
              <Icon type="md-add" />
            </span>
						<span
							v-if="isSuperAdmin"
							:title="$t('删除')"
							@click="delEntity"
						>
              <Icon type="md-remove" />
            </span>
					</div>
				</div>
				<span>基本信息</span>
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
	</div>
</template>
<script>
  import emptyPage from '_c/entity/components/emptyPage.vue'

  export default {
    name: 'entity',
    data () {
      return {
        hasNoEntity:false,
				entitySelect:[],
        orgTree:[],
        addType:1
			}
    },
    components: {
      emptyPage
    },
    computed: {
      isSuperAdmin() {
        return Number(this.$store.state.user.role_id) === 1;
      },
		},
    methods: {
      cascaderChange(value,select){
      
			},
      addEntity(){
      
			},
      delEntity(){
      
			}
		},
    created () {

    }
  }
</script>
<style scoped lang="less">
	.content{
		.basic-info{
			.icon-area{
				>*{
					width: 24px;
					height: 24px;
					line-height: 24px;
					border-radius: 50%;
					font-size: 16px;
					text-align: center;
					color: #fff;
					&:hover{
						cursor: pointer;
					}
					&:nth-child(1){
						background-color: #2bd9cf;
					}
					&:nth-child(2){
						background-color: #feb33d;
						margin-left: 20px;
					}
				}
			}
		}
	}
</style>
