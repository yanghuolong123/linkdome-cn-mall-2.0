<!-- =========================================================================================
	File Name: TheFooter.vue
	Description: Footer component
	Component Name: TheFooter
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <span>
      © 凌图科技有限公司 Copyright <span class="font-number text-grey-light">{{new Date().getFullYear()}} V2.5</span>
    </span>
    <span class="md:flex hidden items-center">
    </span>
  <a style="display:none;color: #f8f8f8!important">2020-03-03 17:45</a>
  </footer>
</template>

<script>

export default {
  name: 'the-footer',
  props: {
    classes: {
      type: String
    }
  }
}
</script>
