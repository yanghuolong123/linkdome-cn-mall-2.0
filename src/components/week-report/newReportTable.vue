
<template>
    <ul class="table">
        <li>
            <p v-for="(item,index) in columns" :key="index">{{item.name}}</p>
        </li>
        <template v-if="data.length">
          <li  v-for="(item,index) in data" :key="index" >
            <p v-for="(eachCo,index) in columns" :key="`${item}_${index}`">{{item[eachCo.key]}}</p>
        </li>
      </template>
    </ul>
</template>
<script>
export default {
  name: 'newReportTable',
  props: {
    columns: {
      type: Array,
      default: () => [
        {
          name: '时间',
          key: 'time'
        },
        {
          name: '客流量',
          key: 'enter'
        },
        {
          name: '集客量峰值',
          key: 'highest'
        }
      ]
    },
    data: {
      type: Array,
      default: () => []
    }
  }
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
        display: flex;
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
            flex: 1;
            text-align: center;
            color: #000;
            height: 40px;
            line-height:40px;
            font-size: 16px;
            border-right: 1px solid #fff;
        }
    }
}

</style>
