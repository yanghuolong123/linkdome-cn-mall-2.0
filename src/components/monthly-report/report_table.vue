
<template>
    <ul class="table">
        <li>
            <p>{{firstName}}</p>
            <p>客流量</p>
            <p>客流量峰值</p>
            <p>平均客流量</p>
        </li>
        <li v-for="item in list">
            <p>{{item.name}}</p>
            <p>{{item.enter}}</p>
            <p>{{item.peak}} 人 {{item.time}}</p>
            <p>{{item.mean}} 人/天</p>
        </li>
    </ul>
</template>
<script>

export default {
  name: 'report-monthly-table',
  props: {
    firstName: {
      type: String,
      default: '出入口名称'
    }
  },
  components: {

  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    listData (data) {
      this.list = []
      this.list = data
    }
  },
  computed: {},
  created () {},
  mounted () {}
}
</script>
<style scoped lang="less">
.table{
    width: 100%;
    height: auto;
    margin-top: 30px;
    li{
        width: 100%;
        height: auto;
        overflow: hidden;
        background-color: #e9ebf5;
        border-bottom: 1px solid #fff;
        &:nth-child(1){
            background-color: #4472c4;
            margin-bottom: 5px;
            p{
                color: #fff;
            }
        }
        &:nth-child(2n+0){
            background-color: #cfd5ea;
        }
        p{
            width: 25%;
            float:left;
            text-align: center;
            color: #000;
            height: 50px;
            line-height:50px;
            font-size: 16px;
            border-right: 1px solid #fff;
        }
    }
}

</style>
