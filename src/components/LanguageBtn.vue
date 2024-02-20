<template>
	<div class="chang-lang" v-on:click="changeLang">{{translatedText}}</div>
</template>
<script>
	export default {
		name:'LanguageBtn',
		methods:{
			changeLang(){
				this.$i18n.locale = (this.$i18n.locale == 'zh-CN') ? 'en-US' : 'zh-CN';
        this.$store.commit('UPDATE_LANG', this.$i18n.locale)
				document.title = this.$t('mainTitle')
			},
		},
		computed:{
      translatedText(){
				const map = {
					'en-US': this.$t('english'),
					'zh-CN': this.$t('chinese')
				}
        return map[this.$i18n.locale]
      }
    },
	}
</script>

<style lang="scss" scoped>
	.chang-lang{
		width: 100px;
		height: 50px;
		text-align: center;
		line-height: 46px;
		color: #6495ed;
		font-size: 16px;
		border: rgba($color: #000000, $alpha: 0) solid 2px;
		border-radius: 6px;
		cursor: pointer;
		user-select:none;
		transition: .2s;
		&:hover{
			// background-color: #6495ed;
			// color: #fff;
		border: rgba($color: #6495ed, $alpha: 1) solid 2px;
		}
	}
</style>
