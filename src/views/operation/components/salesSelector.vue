<template>
    <div class="pb-4">
    <vs-row>
      <vs-col :vs-lg="3" :vs-xs="12" class="mt-4">
        <i-date-picker :dType="1" @selectDate="dateSelect"></i-date-picker>
      </vs-col>
      <vs-col :vs-lg="3" :vs-xs="12"  class="mt-4">
        <vs-select v-model="compareType" width="100%" autocomplete>
          <vs-select-item
            v-for="(item,index) in type"
            :key="index"
            :value="item.value"
            :text="item.label"
          />
        </vs-select>
      </vs-col>
      <template v-if="compareType === 'time'">
        <vs-col :vs-lg="3" :vs-xs="10" class="mt-4">
          <i-date-picker :dType="2" @selectDate="dateSelect"></i-date-picker>
        </vs-col>
      </template>
    </vs-row>
    <vs-row>
      <vs-col :vs-lg="3" :vs-xs="12" class="mt-4" >
        <vs-select
          width="100%"
          v-model="selectList"
          autocomplete
          placeholder="请选择实体"
          :noDataText="noData"
        >
          <vs-select-item
            v-for="item in treeList"
            :value="item.value"
            :key="item.value"
            :text="item.label"
          />
        </vs-select>
      </vs-col>
      <vs-col :vs-lg="3" :vs-xs="12" class="mt-4">
        <vs-button color="primary" @click="handleClick" class="btn">查询</vs-button>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import mymixin from '_c/Passenger-analysis/selectMixin.js'
export default {
  name: 'saleAnalyticsSelector',
  mixins: [mymixin],
  computed: {
    treeList () {
      let list = []
      let propertyId = this.$store.state.home.headerAction
      for (const e of this.treeData) {
        if (e.property_id == propertyId) {
          e.value = e.id
          e.label = e.name
          list.push(e)
        }
      }
      return list
    }
  }
}
</script>
