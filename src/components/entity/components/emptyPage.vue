<template>
  <div>
    <Card>
      <Row>
        <i-col span="24">
          <div style="text-align:center">
            <img :src="empty">
          </div>
        </i-col>
      </Row>
      <Row>
        <i-col span="24">
        </i-col>
      </Row>
      <Row>
        <i-col span="24">
          <div style="text-align:center">
            <Button @click="addEntity" type="primary">请添加实体信息</Button>
          </div>
        </i-col>
      </Row>
    </Card>
  </div>
</template>
<script>
export default {
  name: 'emptyPage',
  components: {
  },
  data () {
    return {
      empty: require('@/assets/images/pages/empty.webp'),
      showAddCompany: false,
      orgnaizationTree: []
    }
  },
  methods: {
    addEntity () {
      this.$emit('addCompany')
    }
  }
}
</script>

<style lang="less" scoped>
.lefttext {
  font-size: 22px;
  color: rgb(47, 141, 227);
}
.ivu-modal-footer {
  border-top: none !important;
}
</style>
