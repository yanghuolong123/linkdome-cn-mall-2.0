<template>
  <div class="tab-container">
    <div v-for="(item,index) in tabs" :key="index">
      <input type="radio" name="footfall" :id="item.value" :value="item.value" v-model="flowType">
      <label :for="item.value">
        <div>{{ $t(item.label) }}</div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelevanceTab',
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      flowType: 0
    }
  },
  watch: {
    flowType: {
      immediate: true,
      handler: function (val, oldVal) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
my-box-card()
  box-shadow:0px 0px 17px 1px rgba(166,167,167,0.28);
  border-radius:6px
mylinear-gradient()
    background:#03A1E9
.tab-container
        margin-top 20px
        display flex
        background-color #fff
        box-shadow:0px 5px 9px 0px rgba(166,167,167,0.17);
        border-top-left-radius 6px
        border-top-right-radius 6px
        --Primary:rgba(115,103,240,1)
        >div
            display flex
            padding-bottom 3px
            align-items center
            justify-content space-around
            margin 0 1em
            >input[type='radio']
                position: absolute;
                left: -999em;
                &:checked + label
                    mylinear-gradient()
                    >div
                      color #03A1E9
            >label
                padding-bottom 3px
                &:hover
                    mylinear-gradient()
                >div
                    display: inline-block;
                    border: none;
                    color #3E3C3C
                    padding: 1rem 2rem;
                    margin: 0;
                    text-decoration: none;
                    background: #ffffff;
                    font-size: 18px;
                    cursor: pointer;
                    text-align: center;
                    -webkit-appearance: none;
                    -moz-appearance: none
                    &:hover
                      color #03A1E9
</style>
