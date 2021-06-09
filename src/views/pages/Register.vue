<!-- =========================================================================================
	File Name: Register.vue
	Description: Register Page
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
	<div class="h-screen flex w-full bg-img">
		<div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
			<vx-card>
				<div slot="no-body" class="full-page-bg-color">
					<div class="vx-row">
						<div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
							<img src="@/assets/images/pages/register.webp" alt="register" class="mx-auto">
						</div>
						<div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center bg-white">
							<div class="p-8">
								<div class="vx-card__title">
									<h4 class="mb-4">Create Account</h4>
									<p>Fill the below form to create a new account.</p>
								</div>
								<div class="clearfix">
									<vs-input label-placeholder="Name" placeholder="Name" v-model="value1" class="w-full mb-6"/>
									<vs-input type="email" label-placeholder="Email" placeholder="Email" v-model="value2" class="w-full mb-6" />
									<vs-input type="password" label-placeholder="Password" placeholder="Password" v-model="value3" class="w-full mb-6" />
									<vs-input type="password" label-placeholder="Confirm Password" placeholder="Confirm Password" v-model="value4" class="w-full mb-6" />
									<vs-checkbox v-model="checkBox1" class="mb-6">I accept the terms & conditions.</vs-checkbox>
									<vs-button  type="border" to="/pages/login">Login</vs-button>
									<vs-button class="float-right">Register</vs-button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</vx-card>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      checkBox1: true
    }
  }
}
</script>
