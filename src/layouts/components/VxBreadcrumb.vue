<!-- =========================================================================================
	File Name: VxBreadcrumb.vue
	Description: Breadcrumb component
	Component Name: VxBreadcrumb
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
	<div class="vx-breadcrumb">
		<ul class="flex flex-wrap items-center">
			<li class="inline-flex items-end">
				<router-link  :to="homeUrl">
					<feather-icon icon="HomeIcon" svgClasses="h-5 w-5 mb-1 stroke-current text-primary"></feather-icon>
				</router-link>
				<span class="breadcrumb-separator mx-2"><feather-icon icon="ChevronsRightIcon" svgClasses="w-4 h-4" /></span>
			</li>
			<li v-for="(link, index) in $route.meta.breadcrumb.slice(1,-1)" :key="index" class="inline-flex items-center">
				<router-link :to="link.url" v-if="link.url">{{ link.title }}</router-link>
				<span class="text-primary cursor-default" v-else>{{ link.title }}</span>
				<span class="breadcrumb-separator mx-2 flex items-start"><feather-icon icon="ChevronsRightIcon" svgClasses="w-4 h-4" /></span>
			</li>
			<li class="inline-flex">
				<span v-if="$route.meta.breadcrumb.slice(-1)[0].active" class="cursor-default">{{ $route.meta.breadcrumb.slice(-1)[0].title }}</span>
			</li>
		</ul>
	</div>
</template>

<script>
export default{
  name: 'vx-breadcrumb',
  data () {
	  return {
		  homeUrl: ''
	  }
  },
  mounted () {
    var menuList = JSON.parse(window.localStorage.getItem('menulist'))
    var Dashboard = _.find(menuList, ['name', 'Dashboard']).subpagesList
    var GroupCompany = _.find(Dashboard, ['name', 'GroupCompany']).id + ''
    var Shopping = _.find(Dashboard, ['name', 'Shopping']).id + ''
    var showCompany
    var showShoping
    _.indexOf(this.$store.state.user.access, GroupCompany) > -1 ? showCompany = true : showCompany = false
    _.indexOf(this.$store.state.user.access, Shopping) > -1 ? showShoping = true : showShoping = false
    if (!showCompany && !showShoping) this.homeUrl = ''
    else this.homeUrl = '/'
  }
}
</script>
