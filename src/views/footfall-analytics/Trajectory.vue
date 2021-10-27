<template>
	<div class="containter">
		<div class="selector-container common-card">
			<div class="flex-center">
				<DatePicker
					type="daterange"
					@on-change="val=>queryParams.date = val"
					v-model="queryParams.date"
					class="w-select"
					placement="bottom-start"
					:placeholder="$t('holder.请选择')"
					:options="options"
				></DatePicker>
				<Button size="large" class="m-l-20" type="primary" @click="handleSearch">{{ $t('查询') }}</Button>
				<Button size="large" class="m-l-20" @click="reset">{{ $t('重置') }}</Button>
			</div>
		</div>
		<div class="common-card m-t-20 main">
			<div class="tit">顾客轨迹信息统计</div>
			<el-table
				ref="table"
				default-expand-all
				:data="tableData"
				:header-cell-style="{background:'#F8F8F8'}"
				class="trajectory-table m-t-20"
				style="width: 100%"
				border>
				<el-table-column
					align="center"
					prop="object_id"
					label="顾客ID">
				</el-table-column>
				<el-table-column
					prop="count"
					align="center"
					label="轨迹点位数">
				</el-table-column>
				<el-table-column
					prop="operate"
					align="center"
					label="操作">
					<template slot-scope="scope">
						<div @click="rowClick(scope.row)" class="operate-btn">
							轨迹点位 <i class="el-icon-arrow-down"></i>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="operate"
					align="center"
					width="1"
					type="expand">
					<template slot-scope="scope">
						<div class="img-box flex-center p-r">
							<el-button :disabled="!scope.row.listPage || !scope.row.list.length"
												 @click.stop="pageChange(scope.row,scope.row.listPage-1)"
												 size="mini" class="icon-btn left" icon="el-icon-arrow-left" circle></el-button>
							<el-image
								v-for="img in scope.row.list[scope.row.listPage]"
								:key="img.id"
								class="img"
								:src="img.image_path"
								:preview-src-list="scope.row.list[scope.row.listPage].map(o=>{return o.image_path})">
							</el-image>
							<el-button :disabled="!scope.row.list.length || scope.row.listPage+1 === scope.row.list.length"
												 size="mini" class="icon-btn right"
												 icon="el-icon-arrow-right"
												 @click="pageChange(scope.row,scope.row.listPage+1)"
												 circle></el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	import {getCustomerTrailList} from '@/api/passenger'
	import  moment from 'moment'
	const today = moment(new Date).format('YYYY-MM-DD')
	export default {
	  data(){
	    return{
        options: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        },
        tableData:[],
        queryParams:{
        	date:[today,today]
				},
			}
		},
    methods: {
      pageChange(row,page){
        row.listPage = page
			},
			rowClick(row){
          // 点击button展开
        this.$refs.table.toggleRowExpansion(row, !row.expand);
        row.expand = !row.expand
			},
      handleSearch(){
				if(_.isEmpty(_.compact(this.queryParams.date))){
          this.$alert({ content: this.$t('fn.请选择', [this.$t('日期')])})
					return
				}
				const params = {
				  time1:this.queryParams.date[0],
				  time2:this.queryParams.date[1],
				}
        getCustomerTrailList(params).then(res=>{
					this.tableData = res.data.data.list ||[];
					this.tableData.forEach(o=>{
					  o.expand = true;
					  this.$set(o,'listPage',0)
					  o.list = _.chunk(o.list,10)
					})
        })
			},
			reset(){
   			this.queryParams.date = [today,today]
			},
    },
    created () {
	   this.handleSearch()
    },
	}
</script>
<style scoped lang="scss">
.containter{
	.main{
		.tit{
			font-size: 18px;
		}
		.operate-btn{
			color: #5fc4f1;
			&:hover{
				cursor: pointer;
			}
		}
	}
	.trajectory-table{
		/deep/.el-table__expanded-cell{
			padding: 0;
		}
	}
	.img-box{
		width: 100%;
		background:#f7f7f7;
		padding: 9px 50px;
		.icon-btn{
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			&.left{
				left:10px ;
			}
			&.right{
				right:10px ;
			}
		}

		.img{
			width: 136px;
			height: 79px;
		}
		.img+.img{
			margin-left: 16px;
		}
	}
}
</style>
