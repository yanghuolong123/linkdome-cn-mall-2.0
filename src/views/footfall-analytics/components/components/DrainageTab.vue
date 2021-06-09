<template>
    <div class="tab-container">
      <div v-for="(item,index) in tabs" :key="index">
        <input type="radio" name="footfall" :id="item.value" :value="item.value" v-model="flowType">
        <label :for="item.value">
          <div>{{item.label}}
              <Tooltip  :content="item.tootipText"  placement="bottom" theme="light" transfer max-width="350">
                <icons type="wenhao"/>
              </Tooltip>
          </div>
        </label>
      </div>
    </div>
</template>

<script>
export default {
  name: 'DrainageTab',
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      flowType: 'from'
    }
  },
  watch: {
    flowType: {
      immediate: true,
      handler: function (val, oldVal) {
        let label = val === 'from' ? '来源流量分析' : '目的流量分析'
        try {
          window.TDAPP.onEvent('实体引流分析页面', label, { })
        } catch (error) {
          console.log('实体引流分析页面-' + label + '-error:' + error)
        }
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
    background:linear-gradient(90deg,rgba(120,108,241,1) 0%,rgba(180,174,245,1) 100%)
.tab-container
        display flex
        background-color #fff
        box-shadow:0px 5px 9px 0px rgba(166,167,167,0.17);
        border-radius:6px 6px 0px 0px
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
                      color var(--Primary)
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
                    font-size: 1.5rem;
                    cursor: pointer;
                    text-align: center;
                    -webkit-appearance: none;
                    -moz-appearance: none
                    &:hover
                      color var(--Primary)
</style>
