<!-- =========================================================================================
	File Name: TableDefault.vue
	Description: Rendering default table
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->
<template>
  <vx-card :title="tableTitle" class="headline">

    <vs-table
      :data="tableList"
      :noDataText="name">
      <!-- table title -->
      <template slot="thead" #thead>
        <vs-th
          :key="index"
          class="table-title"
          v-for="(item,index) in tableName">
          {{ $t(item) }}
        </vs-th>
      </template>
      <!-- table list -->
      <template slot-scope="{data}" #tbody>
        <vs-tr v-for="(tr, indextr) in data" :key="indextr">
          <vs-td v-if="data[indextr].name" :data="data[indextr].name">
            {{data[indextr].name}}
          </vs-td>
          <vs-td v-if="data[indextr].type" :data="data[indextr].type">
            {{data[indextr].type}}
          </vs-td>
          <vs-td v-if="data[indextr].time" :data="data[indextr].time">
            {{data[indextr].time}}
          </vs-td>
          <vs-td v-if="data[indextr].avg" :data="data[indextr].avg">
            {{data[indextr].avg}}
          </vs-td>
          <vs-td v-if="data[indextr].enter" :data="data[indextr].enter">
            {{data[indextr].enter}}
          </vs-td>
          <vs-td v-if="data[indextr].percent" :data="data[indextr].percent">
            {{data[indextr].percent}}%
          </vs-td>
          <vs-td
            v-for="(item,allIndex) in data[indextr].percentList"
            v-if="data[indextr].percentList"
            :data="data[indextr].percentList"
            :key="allIndex">
            {{item}}
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </vx-card>
</template>

<script>
export default {
  name: 'dwell-time-table',
  props: {
    tableTitle: {
      type: String,
      default: ''
    },
    tableName: {
      type: Array,
      default: []
    },
    tableList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      name: '暂无数据'
    }
  }
}
</script>
<style lang="scss" scope>
.table-title {
  background-color: #f8f8f8;
}
.vs-con-table .vs-con-tbody .vs-table--tbody-table .vs-table--thead th {
  white-space: nowrap;
  padding-right: 5px;
  min-width: fit-content;
  &:nth-child(1) {
    background-color: #f8f8f8;
  }
  .vs-table-text{
    font-size: 14px;
  }
}

.vs-table--tbody-table .tr-values td {
  border-bottom: 1px solid #f8f8f8;
  white-space: nowrap;
  min-width: fit-content;
}
.vs-table--td {
  padding-left: 0 !important;
}
.vx-card .vx-card__header{
  padding:27px 19px 0;
  h4{
    font-size: 18px;
  }
}
</style>
