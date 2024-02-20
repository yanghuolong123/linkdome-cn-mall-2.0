<template>
  <div class="CheckboxGroups">
    <div class="checkAll">
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        :disabled="disabled"
        @click.prevent.native="handleCheckAll">
        {{ $t(checkDatas.name) }}
      </Checkbox>
    </div>
    <CheckboxGroup v-model="checkValues" class="checkList" @on-change="onchange">
      <Checkbox class="margin-t-b ellipsis-1" :title="$t(item.name)" :label="$t(item.name)" :disabled="disabled" v-for=" item in checkDatas.subpagesList"></Checkbox>
    </CheckboxGroup>
  </div>
</template>

<script>
export default {
  name: 'CheckboxGroups',
  components: {
  },
  props: {
    checkData: {
      type: [Array, Object],
      default: {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      indeterminate: false,
      checkAll: '',
      checkValues: []
    }
  },
  watch: {
    checkValues () {
      this.$emit('changeCheckData', this.checkData)
    }
  },
  computed: {
    checkDatas () {
      if (!this.checkData.subpagesList) {
        this.checkData.subpagesList = []
      }
      let checkValues = []
      this.checkAll = !!this.checkData.enable
      this.checkData.subpagesList.forEach(function (m) {
        if (m.enable) {
          checkValues.push(m.cname)
        }
      })
      this.checkValues = checkValues
      return this.checkData
    }
  },
  mounted () {
  },
  methods: {
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        this.checkValues = this.checkData.subpagesList.map(function (m) {
          return m.cname
        })
        this.checkData.enable = 1
        this.checkData.subpagesList.forEach(function (m) {
          m.enable = 1
        })
      } else {
        this.checkData.enable = 0
        this.checkData.subpagesList.forEach(function (m) {
          m.enable = 0
        })
        this.checkValues = []
      }
    },
    onchange (data) {
      var length = 0
      var that = this
      if (data.length == 0) {
        this.indeterminate = false
        this.checkAll = false
        this.checkData.enable = 0
        this.checkData.subpagesList.map(value=>{
          value.enable = 0
        })
      } else {
        if (this.checkData.subpagesList) {
          length = this.checkData.subpagesList.length

          this.checkData.subpagesList.forEach(function (m) {
            let findIndex = _.indexOf(data, m.cname)
            if (findIndex > -1) {
              m.enable = 1
              that.checkData.enable = 1
            } else {
              m.enable = 0
            }
          })
          if (data.length === length) {
            this.indeterminate = false
            this.checkAll = true
          } else if (data.length > 0) {
            this.indeterminate = true
            this.checkAll = false
          } else {
            this.indeterminate = false
            this.checkAll = false
          }
        }
      }
    }
  }
}
</script>
<style scope lang="scss">
.CheckboxGroups{
  background-color: #fff;
  border-radius: 8px;
  margin-bottom:20px;
  .checkAll{
    border-bottom: 1px solid #e9e9e9;
    padding-bottom:6px;
    margin-bottom:6px;
    padding-left: 20px;
    padding-top: 14px;
  }
  .checkList{
    padding-left: 20px;
    padding-bottom: 14px;
    .ivu-checkbox-group-item {
      display: inline-block;
      width: 16%;
      margin: 5px 0;
    }
  }
  ::v-deep .ivu-checkbox-wrapper{
    font-size: 14px;
  }
}

</style>
