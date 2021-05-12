<template>
  <vs-table stripe :data="data" :maxHeight="maxHeight" :noDataText="noData" id="i-table-component">
    <template slot="header">
      <slot name="head"></slot>
    </template>
    <template slot="thead">
      <vs-th :key="index" v-for="(item,index) in columns">{{item.title}}</vs-th>
    </template>
    <template slot-scope="{data}">
      <vs-tr :key="indextr" v-for="(tr, indextr) in data">
        <vs-td v-for="(c,idx) in columns" :key="idx">
          {{tr[c.key] && tr[c.key].toLocaleString()}}
        </vs-td>
      </vs-tr>
    </template>
  </vs-table>
</template>

<script>
  export default {
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      },
      noData: {
        type: String,
        default: '暂无数据'
      },
      maxHeight:{
        type:String,
        default:'440px'
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .vs-con-table .vs-con-tbody .vs-table--tbody-table .vs-table--thead th
    background-color #f8f8f8
  #i-table-component.vs-component.vs-con-table /deep/
  .vs-table--thead
    >tr
      background-color #f8f8f8
      >th
        white-space nowrap
        // min-width fit-content
        padding-right 1em
  .vs-table.vs-table--tbody-table
    min-width max-content
    >tr
      border-bottom 1px solid #f8f8f8
      white-space nowrap
      min-width fit-content
</style>
