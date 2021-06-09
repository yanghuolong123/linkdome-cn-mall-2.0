<template>
<vx-card :title=titleName :titleTip="titleTip">
	<vs-table stripe v-model="selected" :multiple="isMultiple"  :noDataText="name" :data="tableList">

		<template slot="thead" >
		  <vs-th :key="indexs" class="table-title" v-for="(item, indexs) in tableName">{{item}}</vs-th>
		</template>

		<template slot-scope="{data}">
			<vs-tr :data="tr" :disabled="false" :key="indextr" v-for="(tr, indextr) in data">
        <!-- 头像 -->
				<vs-td :data="data[indextr].photo" v-if="data[indextr].photo">
					<img :src="data[indextr].photo">
				</vs-td>
        <!-- 用户 -->
				<vs-td :data="data[indextr].account" v-if="data[indextr].account">
					{{data[indextr].account}}
				</vs-td>
        <!-- 姓名 -->
				<vs-td :data="data[indextr].name" v-if="data[indextr].name">
					{{data[indextr].name}}
				</vs-td>
        <!-- 客流目标 -->
        <vs-td :data="data[indextr].enterGoal" v-if="data[indextr].enterGoal">
					{{data[indextr].enterGoal}}
				</vs-td>
        <!-- 客流目标 -->
        <vs-td :data="data[indextr].saleGoal"  v-if="data[indextr].saleGoal||data[indextr].saleGoal==0">
					{{data[indextr].saleGoal}}
				</vs-td>
        <!-- 详细地址 -->
        <vs-td :data="data[indextr].address" v-if="data[indextr].address">
					{{data[indextr].address}}
				</vs-td>
        <!-- 描述 -->
        <vs-td :data="data[indextr].describe" v-if="data[indextr].describe">
					{{data[indextr].describe}}
				</vs-td>
        <!-- 等级 -->
				<vs-td :data="data[indextr].rank" v-if="data[indextr].rank">
					{{data[indextr].rank}}
				</vs-td>
        <!-- 年龄 -->
				<vs-td :data="data[indextr].age" v-if="data[indextr].age">
					{{data[indextr].age}}
				</vs-td>
        <!-- 性别 -->
				<vs-td :data="data[indextr].gender" v-if="data[indextr].gender">
					{{data[indextr].gender}}
				</vs-td>
        <!-- 电话 -->
				<vs-td :data="data[indextr].mobile" v-if="data[indextr].mobile">
					{{data[indextr].mobile}}
				</vs-td>
        <!-- 邮箱 -->
				<vs-td :data="data[indextr].email" v-if="data[indextr].email">
					{{data[indextr].email}}
				</vs-td>
         <!-- 开始时间 -->
        <vs-td :data="data[indextr].begin" v-if="data[indextr].begin">
					{{data[indextr].begin}}
				</vs-td>
        <!-- 结束时间 -->
        <vs-td :data="data[indextr].end" v-if="data[indextr].end">
					{{data[indextr].end}}
				</vs-td>
        <!-- 客流 -->
        <vs-td :data="data[indextr].enter" v-if="data[indextr].enter">
					{{data[indextr].enter}}
				</vs-td>
		<!-- 销售额 -->
		<vs-td :data="data[indextr].sale" v-if="data[indextr].sale">
			{{data[indextr].sale}}
		</vs-td>
		<!-- 成交率 -->
		<vs-td :data="data[indextr].deal" v-if="data[indextr].deal">
			{{data[indextr].deal}}
		</vs-td>
		<!-- 客单价 -->
		<vs-td :data="data[indextr].price" v-if="data[indextr].price">
			{{data[indextr].price}}
		</vs-td>
        <!-- 持续时间 -->
        <vs-td :data="data[indextr].duration" v-if="data[indextr].duration">
					{{data[indextr].duration}}
				</vs-td>
        <!-- 到访次数 -->
        <vs-td :data="data[indextr].times" v-if="data[indextr].times">
					{{data[indextr].times}}
				</vs-td>
        <!-- 最后一次到访 -->
        <vs-td :data="data[indextr].lastTime" v-if="data[indextr].lastTime">
					{{data[indextr].lastTime}}
				</vs-td>
        <vs-td :data="data[indextr].status" v-if="data[indextr].status">
					<img :src="data[indextr].status" class="imgStatus">
				</vs-td>
        <!-- 操作 -->
				<vs-td v-if="data[indextr].operation" :data="data[indextr].operation" >
          <span v-if="userLvl=='common_admin'||userLvl=='admin'" class="account-deit" title="编辑" v-on:click.stop="tableData(data[indextr])">
            <vs-icon  icon="ivu-icon-md-create" icon-pack='ivu-icon'></vs-icon>
          </span>
          <span  v-if="userLvl=='admin'" class="account-remove" title="删除" v-on:click.stop="removeData(data[indextr])">
            <Icon type="ios-trash" />
          </span>
          <div v-if="userLvl=='normal'">  </div>
				</vs-td>
			</vs-tr>
		</template>
	</vs-table>
  <vs-pagination v-if="isPage" class='table-page' :color="pageColor" :total="40" v-model="currentx"></vs-pagination>
</vx-card>
</template>

<script>
import Prism from 'vue-prism-component'
export default {
  props: {
    titleName: {
      type: String
    },
    tableName: {
      type: Array
    },
    tableList: {
      type: Array
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    isPage: {
      type: Boolean,
      default: false
    },
    userType: {
      type: Boolean,
      default: true
    },
    userLvl: {
      type: String,
      default: 'admin'
    },
	  titleTip: {// 问号提示
		  type: String,
		  default: ''
	  }
  },
  data () {
    return {
      pageColor: '#00A0E9',
      currentx: 20,
      selected: [],
      name: '暂无数据'
    }
  },
  components: {
    Prism
  },
  watch: {
    selected () {
      this.$emit('tableSelect', this.selected)
    }
  },
  methods: {
    removeData (data) {
      var user = {
        data: data,
        type: 'remove'
      }
      this.$emit('removeData', user)
    },
    tableData (data) {
      var user = {
        data: data,
        type: 'edit'
      }
      this.$emit('tableData', user)
    }
  }
}
</script>
<style lang="scss" scope>
.table-page{
  margin-top:30px;
  .vs-pagination--li{}
}
.table-title{
  background-color: #f8f8f8;
}
.vs-con-table .vs-con-tbody .vs-table--tbody-table .vs-table--thead th{
  &:nth-child(1){
    background-color: #f8f8f8
  }
  .vs-table-text{
    font-size: 14px;
  }
}
.vs-table--tbody-table .tr-values.selected{
  border-bottom: 1px solid #f8f8f8;
}
  .vs-table--td{
    padding-left: 0!important;
    span{
      display:inline-block;
      height:38px;
      line-height:38px;
      float:left;
    }
  }
  .account-remove i{
    font-size: 20px;
    color: #C7C6C6;
     margin-top:-5px;
    &:hover{
      color: #00a0e9;
    }
  }
  .account-deit i{
    font-size: 20px;
    color: #C7C6C6;
     margin-right: 10px;
     margin-top:-5px;
     &:hover{
      color: #00a0e9;
    }
  }
</style>
