<template>
    <div>
        <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link pointer medium">
        <i class="iconfont iconyuyan-01">&nbsp;</i><span class="medium lang">{{$t(translatedText)}}</span><i
              class="el-icon-arrow-down el-icon--right"></i>
      </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="lang.value" v-for="lang in langList">{{$t(lang.name)}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

</template>
<script>
  export default {
    name: 'LanguageBtn',
    data () {
      return {
        langList: [
          {
            value:'en-US',
            name:'english'
          }, {
            value:'zh-CN',
            name:'chinese'
          }
        ]
      }
    },
    computed: {
      translatedText () {
        const map = {
          'en-US': this.$t('english'),
          'zh-CN': this.$t('chinese')
        }
        return map[this.$i18n.locale]
      }
    },
    methods: {
      handleCommand(val){
        this.$i18n.locale = val;
        this.$store.commit('UPDATE_LANG', this.$i18n.locale)
        document.title = this.$t('mainTitle')
      },
    },
  }
</script>

<style lang="scss" scoped>
    .chang-lang {
        width: 100px;
        height: 50px;
        text-align: center;
        line-height: 46px;
        color: #6495ed;
        font-size: 16px;
        border: rgba($color: #000000, $alpha: 0) solid 2px;
        border-radius: 6px;
        cursor: pointer;
        user-select: none;
        transition: .2s;

        &:hover {
            // background-color: #6495ed;
            // color: #fff;
            border: rgba($color: #6495ed, $alpha: 1) solid 2px;
        }
    }
</style>
