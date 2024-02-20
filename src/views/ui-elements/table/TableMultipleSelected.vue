<template>
    <vx-card :title="titleName" :titleTip="titleTip" class="mul-table">
        <vs-table v-model="selected"
                  :multiple="isMultiple"
                  :noDataText="$t('holder.NoData')"
                  :data="tableList">
            <template slot="thead" #thead>
                <vs-th :key="indexs" class="table-title" v-for="(item, indexs) in tableName">{{$t(item)}}</vs-th>
            </template>
            <template slot-scope="{data}" #tbody>
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
                    <vs-td style="width: 360px" :title="data[indextr].bzone_name" :data="data[indextr].bzone_name"
                           v-if="data[indextr].bzone_name">
                        {{data[indextr].bzone_name.length>25?data[indextr].bzone_name.substring(0,25)+'...':data[indextr].bzone_name}}
                    </vs-td>
                    <vs-td :data="data[indextr].ratio" v-if="data[indextr].ratio">
                        {{data[indextr].ratio+'%'}}
                    </vs-td>
                    <vs-td :data="data[indextr].type_id" v-if="hasProperty(data[indextr],'type_id')">
                        {{data[indextr].type_id === 0?$t('decomposeTask'):$t('overallTask')}}
                    </vs-td>
                    <vs-td :data="data[indextr].exec_date" v-if="hasProperty(data[indextr],'exec_date')">
                        {{data[indextr].exec_date.replace(',',' - ')}}
                    </vs-td>
                    <vs-td :data="data[indextr].exec_time"  v-if="hasProperty(data[indextr],'exec_time')">
                        {{data[indextr].exec_time.replace(',',' - ')}}
                    </vs-td>
                    <vs-td :data="data[indextr].status_num"
                           v-if="data[indextr].status_num||data[indextr].status_num===0">
                        <i-switch size="large" v-model="data[indextr].status_num" :true-value="1" :false-value="0"
                                  @on-change="val=>{statusChange(val,data[indextr])}">
                            <span slot="open">{{$t('enabled')}}</span>
                            <span slot="close">{{$t('disabled')}}</span>
                        </i-switch>
                    </vs-td>
                    <vs-td :data="data[indextr].type_name" v-if="data[indextr].type_name">
                        {{$t(findKey(typeList,'value',data[indextr].type_name,'name'))}}
                    </vs-td>
                    <!-- 客流目标 -->
                    <vs-td :data="data[indextr].enterGoal" v-if="data[indextr].enterGoal">
                        {{data[indextr].enterGoal}}
                    </vs-td>
                    <!-- 客流目标 -->
                    <vs-td :data="data[indextr].saleGoal" v-if="data[indextr].saleGoal||data[indextr].saleGoal==0">
                        {{data[indextr].saleGoal}}
                    </vs-td>
                    <!-- 详细地址 -->
                    <vs-td :data="data[indextr].address" v-if="data[indextr].address">
                        {{data[indextr].address}}
                    </vs-td>
                    <!-- 描述 -->
                    <vs-td :data="data[indextr].description" v-if="data[indextr].description">
                        {{data[indextr].description}}
                    </vs-td>
                    <!-- 等级 -->
                    <vs-td :data="data[indextr].rank" v-if="data[indextr].rank">
                        {{$t(data[indextr].rank)}}
                    </vs-td>
                    <!-- 年龄 -->
                    <vs-td :data="data[indextr].age" v-if="data[indextr].age">
                        {{data[indextr].age}}
                    </vs-td>
                    <!-- 性别 -->
                    <vs-td :data="data[indextr].gender" v-if="data[indextr].gender">
                        {{$t(data[indextr].gender)}}
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
                    <vs-td :data="data[indextr].begin" v-if="!isEmpty(data[indextr].begin)">
                        {{data[indextr].begin}}
                    </vs-td>
                    <!-- 结束时间 -->
                    <vs-td :data="data[indextr].end" v-if="!isEmpty(data[indextr].end)">
                        {{data[indextr].end}}
                    </vs-td>


                    <!-- 开始时间 -->
                    <vs-td :data="data[indextr].enterReal" v-if="!isEmpty(data[indextr].enterReal)">
                        {{data[indextr].enterReal.toLocaleString()}}
                    </vs-td>
                    <!-- 结束时间 -->
                    <vs-td :data="data[indextr].enterTarget" v-if="!isEmpty(data[indextr].enterTarget)">
                        {{data[indextr].enterTarget.toLocaleString()}}
                    </vs-td>

                    <!-- 客流 -->
                    <vs-td :data="data[indextr].enter" v-if="data[indextr].enter">
                        {{data[indextr].enter}}
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
                    <vs-td v-if="data[indextr].operation"
                           :data="data[indextr].operation"
                           class="action-box flex-center">
                        <Icon v-if="userLvl=='common_admin'||userLvl=='admin'"
                              type="md-create"
                              size="20"
                              color="#C7C6C6"
                              :title="$t('edit')"
                              @click="tableData(data[indextr])"/>
                        <Icon v-if="userLvl=='admin'&& !data[indextr].hideDelBtn"
                              class="m-l-10"
                              type="ios-trash"
                              size="20"
                              color="#C7C6C6"
                              :title="$t('del')"
                              @click="removeData(data[indextr])"/>
                        <Icon class="m-l-10" :title="$t(icon.name)"
                              v-for="icon in actionList"
                              size="20"
                              color="#C7C6C6"
                              :type="icon.icon"
                              @click="actionClick(icon.name)"/>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-pagination v-if="isPage" class='table-page' :color="pageColor" :total="40"
                       v-model="currentx"></vs-pagination>
    </vx-card>
</template>

<script>
  import { findKey, isEmpty } from '../../../libs/util'
  import config from '@/config/index'

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
      },
      actionList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        pageColor: '#00A0E9',
        currentx: 20,
        selected: [],
        disabled: false,
        typeList: config.entityType
      }
    },
    components: {},
    watch: {
      selected () {
        this.$emit('tableSelect', this.selected)
      }
    },
    methods: {
      hasProperty(obj,key){
        return obj.hasOwnProperty(key)
      },
      isEmpty (val) {
        return isEmpty(val)
      },
      statusChange (value, data) {
        const payload = {
          value,
          data
        }
        this.$emit('statusChange', payload)
      },
      connectedConfig () {
        if (this.disabled) return
        this.disabled = true
        this.$emit('connectedConfig')
        setTimeout(() => {
          this.disabled = false
        }, 1000)
      },
      actionClick (name) {
        switch (name) {
          case 'imgConfig':
            this.imgConfig()
            break
          case 'heatmapConfig':
            this.heatmapConfig()
            break
          case 'connGraphConfig':
            this.connectedConfig()
            break
        }
      },
      imgConfig () {
        if (this.disabled) return
        this.disabled = true
        this.$emit('imgConfig')
        setTimeout(() => {
          this.disabled = false
        }, 1000)
      },
      heatmapConfig () {
        if (this.disabled) return
        this.disabled = true
        this.$emit('heatmapConfig')
        setTimeout(() => {
          this.disabled = false
        }, 1000)
      },
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
      },
      findKey (arr, valueKey, value, targetkey) {
        return findKey(arr, valueKey, value, targetkey)
      }

    }
  }
</script>
<style lang="scss" scoped>
    .mul-table {
        ::v-deep .vs-table--tbody {
            z-index: 1;
        }
    }

    .action-box {
        font-size: 20px;
        color: #C7C6C6;

        .m-l-10 {
            margin-left: 10px;
        }

        ::v-deep.ivu-icon {
            &:hover {
                color: #00a0e9 !important;
            }
        }
    }

    .account-deit i {
        font-size: 20px;
        color: #C7C6C6;
        margin-right: 10px;
        margin-top: -5px;

        &:hover {
            color: #00a0e9;
        }
    }

    .ellipsis-1 {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;

    }

</style>
