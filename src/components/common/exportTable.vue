<template>
  <div class="export">
    <Table height="auto" ref="table" :columns="columns" :data="tableData"></Table>
  </div>
</template>

<script>
export default {
  name: 'exportTable',
  data () {
    return {
      title: '',
      columns: [],
      tableData: [],
      status: false
    }
  },
  computed: {

  },
  methods: {
    export () {
      var that = this
      setTimeout(function () {
        if (that.status) {
          var truthBeTold = window.confirm('只能导出5000条数据，是否继续')
          if (truthBeTold) {
            that.exportData()
          }
        } else {
          that.exportData()
        }
      }, 500)
    },
    exportData () {
      this.$refs.table.exportCsv({
        filename: this.title
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.export{
  display:none
}
</style>
