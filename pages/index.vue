<template>
	<section
		class="
			flex flex-col
			lg:flex-row
			flex-1
			lg:flex-none
			lg:mt-16
			sm:gap-x-10
			md:gap-x-20
		"
	>
		<div class="flex flex-col w-full lg:w-1/2">
			<Profile />
			<CompletedChallenges />
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';

interface Head {
	title: string;
}

export default Vue.extend({
	head(): Head {
		return {
			title: 'Home | movue.it',
		};
	},
});
</script>
