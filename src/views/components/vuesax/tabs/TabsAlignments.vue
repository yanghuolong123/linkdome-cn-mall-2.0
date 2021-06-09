<!-- =========================================================================================
	File Name: TabsAlignments.vue
	Description: Align your tabs using vs-alignments prop
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
	<vx-card title="Alignments" code-toggler>
		
		<p>Change the alignment of the buttons with the property vs-alignments. Allowed values are:</p>

		<vx-list :list="['center', 'right', 'fixed']" class="mt-3"></vx-list>

		<div class="mt-5">
			<h6 class="mb-3"> Default </h6>
			<vs-tabs>
				<vs-tab vs-label="Home">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Documents">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Contributors">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Ecosistem">
					<div></div>
				</vs-tab>
			</vs-tabs>
		</div>

		<div class="mt-5">
			<h6 class="mb-3"> Center </h6>
			<vs-tabs vs-alignment="center">
				<vs-tab vs-label="Home">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Documents">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Contributors">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Ecosistem">
					<div></div>
				</vs-tab>
			</vs-tabs>
		</div>

		<div class="mt-5">
			<h6 class="mb-3"> Right </h6>
			<vs-tabs vs-alignment="right">
				<vs-tab vs-label="Home">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Documents">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Contributors">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Ecosistem">
					<div></div>
				</vs-tab>
			</vs-tabs>
		</div>

		<div class="mt-5">
			<h6 class="mb-3"> Fixed </h6>
			<vs-tabs vs-alignment="fixed">
				<vs-tab vs-label="Home">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Documents">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Contributors">
					<div></div>
				</vs-tab>
				<vs-tab vs-label="Ecosistem">
					<div></div>
				</vs-tab>
			</vs-tabs>
		</div>

		<template slot="codeContainer">
&lt;template&gt;
  &lt;div class=&quot;mt-5&quot;&gt;
    &lt;h3&gt; Default &lt;/h3&gt;
    &lt;vs-tabs&gt;
      &lt;vs-tab vs-label=&quot;Home&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Documents&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Contributors&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Ecosistem&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
    &lt;/vs-tabs&gt;
  &lt;/div&gt;

  &lt;div class=&quot;mt-5&quot;&gt;
    &lt;h3&gt; Center &lt;/h3&gt;
    &lt;vs-tabs vs-alignment=&quot;center&quot;&gt;
      &lt;vs-tab vs-label=&quot;Home&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Documents&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Contributors&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Ecosistem&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
    &lt;/vs-tabs&gt;
  &lt;/div&gt;

  &lt;div class=&quot;mt-5&quot;&gt;
    &lt;h3&gt; Right &lt;/h3&gt;
    &lt;vs-tabs vs-alignment=&quot;right&quot;&gt;
      &lt;vs-tab vs-label=&quot;Home&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Documents&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Contributors&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Ecosistem&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
    &lt;/vs-tabs&gt;
  &lt;/div&gt;

  &lt;div class=&quot;mt-5&quot;&gt;
    &lt;h3&gt; Fixed &lt;/h3&gt;
    &lt;vs-tabs vs-alignment=&quot;fixed&quot;&gt;
      &lt;vs-tab vs-label=&quot;Home&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Documents&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Contributors&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
      &lt;vs-tab vs-label=&quot;Ecosistem&quot;&gt;
        &lt;div&gt;&lt;/div&gt;
      &lt;/vs-tab&gt;
    &lt;/vs-tabs&gt;
  &lt;/div&gt;
&lt;/template&gt;
		</template>

	</vx-card>
</template>