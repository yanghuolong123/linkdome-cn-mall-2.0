<template>
	<div class="vx-row">
		<!-- HORIZONTAL LAYOUT -->
		<div class="vx-col md:w-1/2 w-full mb-base">
			<vx-card title="Horizontal Form">
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-1/3 w-full">
						<span>First Name</span>
					</div>
					<div class="vx-col sm:w-2/3 w-full">
						<vs-input class="w-full" v-model="input1" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-1/3 w-full">
						<span>Email</span>
					</div>
					<div class="vx-col sm:w-2/3 w-full">
						<vs-input class="w-full" type="email" v-model="input2" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-1/3 w-full">
						<span>Mobile</span>
					</div>
					<div class="vx-col sm:w-2/3 w-full">
						<vs-input class="w-full" v-model="input3" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-1/3 w-full">
						<span>Password</span>
					</div>
					<div class="vx-col sm:w-2/3 w-full">
						<vs-input class="w-full" type="password" v-model="input4" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-2/3 w-full ml-auto">
						<vs-checkbox class="inline-flex" v-model="check1">Remember Me</vs-checkbox>
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col sm:w-2/3 w-full ml-auto">
						<vs-button class="mr-3 mb-2">Submit</vs-button>
						<vs-button color="warning" type="border" class="mb-2" @click="input1 = input2 = input3 = input4 = input4 = ''; check1 = false;">Reset</vs-button>
					</div>
				</div>
			</vx-card>
		</div>

		<!-- HORIZONTAL LAYOUT WITH ICON-->
		<div class="vx-col md:w-1/2 w-full mb-base">
			<vx-card title="Horizontal Form">
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-1/3 w-full">
						<span>First Name</span>
					</div>
					<div class="vx-col sm:w-2/3 w-full">
						<vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border v-model="input5" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-1/3 w-full">
						<span>Email</span>
					</div>
					<div class="vx-col sm:w-2/3 w-full">
						<vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border v-model="input6" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-1/3 w-full">
						<span>Mobile</span>
					</div>
					<div class="vx-col sm:w-2/3 w-full">
						<vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="input7" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-1/3 w-full">
						<span>Password</span>
					</div>
					<div class="vx-col sm:w-2/3 w-full">
						<vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border v-model="input8" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col sm:w-2/3 w-full ml-auto">
						<vs-checkbox class="inline-flex" v-model="check2">Remember Me</vs-checkbox>
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col sm:w-2/3 w-full ml-auto">
						<vs-button class="mr-3 mb-2">Submit</vs-button>
						<vs-button color="warning" type="border" class="mb-2" @click="input5 = input6 = input7 = input8 = ''; check2 = false;">Reset</vs-button>
					</div>
				</div>
			</vx-card>
		</div>

		<!-- VERTICAL LAYOUT -->
		<div class="vx-col md:w-1/2 w-full mb-base">
			<vx-card title="Vertical Form">
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input class="w-full" label="First Name" v-model="input9" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input class="w-full" type="email" label="Email" v-model="input10" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input class="w-full" label="Mobile" v-model="input11" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input class="w-full" type="password" label="Password" v-model="input12" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-checkbox class="inline-flex" v-model="check3">Remember Me</vs-checkbox>
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col w-full">
						<vs-button class="mr-3 mb-2">Submit</vs-button>
						<vs-button color="warning" type="border" class="mb-2" @click="input9 = input10 = input11 = input12 = ''; check3 = false;">Reset</vs-button>
					</div>
				</div>
			</vx-card>
		</div>

		<!-- VERTICAL LAYOUT WITH ICON-->
		<div class="vx-col md:w-1/2 w-full mb-base">
			<vx-card title="Vertical Form">
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="First Name" v-model="input13" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Email" v-model="input14" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Mobile" v-model="input15" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border label="Password" v-model="input16" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-checkbox class="inline-flex" v-model="check4">Remember Me</vs-checkbox>
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col w-full">
						<vs-button class="mr-3 mb-2">Submit</vs-button>
						<vs-button color="warning" type="border" class="mb-2" @click="input13 = input14 = input15 = input16 = ''; check4 = false;">Cancle</vs-button>
					</div>
				</div>
			</vx-card>
		</div>

		<!-- FORM WITH LABEL PLACEHOLDER -->
		<div class="vx-col md:w-1/2 w-full mb-base">
			<vx-card title="Form With Label Placeholder">
				<div class="vx-row mb-2">
					<div class="vx-col w-full">
						<vs-input class="w-full" label-placeholder="First Name" v-model="input17" />
					</div>
				</div>
				<div class="vx-row mb-2">
					<div class="vx-col w-full">
						<vs-input class="w-full" type="email" label-placeholder="Email" v-model="input18" />
					</div>
				</div>
				<div class="vx-row mb-2">
					<div class="vx-col w-full">
						<vs-input class="w-full" label-placeholder="Mobile" v-model="input19" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input class="w-full" type="password" label-placeholder="Password" v-model="input20" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-checkbox class="inline-flex" v-model="check5">Remember Me</vs-checkbox>
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col w-full">
						<vs-button class="mr-3 mb-2">Submit</vs-button>
						<vs-button color="warning" type="border" class="mb-2" @click="input17 = input18 = input19 = input20 = ''; check5 = false;">Cancle</vs-button>
					</div>
				</div>
			</vx-card>
		</div>

		<!-- FORM WITH LABEL PLACEHOLDER WITH ICON-->
		<div class="vx-col md:w-1/2 w-full mb-base">
			<vx-card title="Form With Label Placeholder">
				<div class="vx-row mb-2">
					<div class="vx-col w-full">
						<vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="First Name" v-model="input21" />
					</div>
				</div>
				<div class="vx-row mb-2">
					<div class="vx-col w-full">
						<vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label-placeholder="Email" v-model="input22" />
					</div>
				</div>
				<div class="vx-row mb-2">
					<div class="vx-col w-full">
						<vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label-placeholder="Mobile" v-model="input23" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border label-placeholder="Password" v-model="input24" />
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<vs-checkbox class="inline-flex" v-model="check6">Remember Me</vs-checkbox>
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col w-full">
						<vs-button class="mr-3 mb-2">Submit</vs-button>
						<vs-button color="warning" type="border" class="mb-2" @click="input21 = input22 = input23 = input24 = ''; check6 = false;">Reset</vs-button>
					</div>
				</div>
			</vx-card>
		</div>

		<!-- MULTIPLE COLUMNS-->
		<div class="vx-col w-full mb-base">
			<vx-card title="Multiple Columns">
				<div class="vx-row">
					<div class="vx-col sm:w-1/2 w-full mb-2">
						<vs-input class="w-full" label-placeholder="First Name" v-model="input25" />
					</div>
					<div class="vx-col sm:w-1/2 w-full mb-2">
						<vs-input class="w-full" label-placeholder="Last Name" v-model="input26" />
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col sm:w-1/2 w-full mb-2">
						<vs-input class="w-full" label-placeholder="City" v-model="input27" />
					</div>
					<div class="vx-col sm:w-1/2 w-full mb-2">
						<vs-input class="w-full" label-placeholder="Country" v-model="input28" />
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col sm:w-1/2 w-full mb-2">
						<vs-input class="w-full" label-placeholder="Company" v-model="input29" />
					</div>
					<div class="vx-col sm:w-1/2 w-full mb-6">
						<vs-input type="email" class="w-full" label-placeholder="Email" v-model="input30" />
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col w-full mb-6">
						<vs-checkbox class="inline-flex" v-model="check7">Remember Me</vs-checkbox>
					</div>
				</div>
				<div class="vx-row">
					<div class="vx-col w-full">
						<vs-button class="mr-3 mb-2">Submit</vs-button>
						<vs-button color="warning" type="border" class="mb-2" @click="input25 = input26 = input27 = input28 = input29 = input30 = ''; check7 = false;">Reset</vs-button>
					</div>
				</div>
			</vx-card>
		</div>
	</div>
</template>

<script>
export default{
	data() {
		return {
			check1: '',
			check2: '',
			check3: '',
			check4: '',
			check5: '',
			check6: '',
			check7: '',
			input1: '',
			input2: '',
			input3: '',
			input4: '',
			input5: '',
			input6: '',
			input7: '',
			input8: '',
			input9: '',
			input10: '',
			input11: '',
			input12: '',
			input13: '',
			input14: '',
			input15: '',
			input16: '',
			input17: '',
			input18: '',
			input19: '',
			input20: '',
			input21: '',
			input22: '',
			input23: '',
			input24: '',
			input25: '',
			input26: '',
			input27: '',
			input28: '',
			input29: '',
			input30: '',
		}
	}	
}
</script>