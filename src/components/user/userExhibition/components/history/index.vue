<template>
	<div class="play-list">
		<Switch
			:text="['我喜欢的', '播放历史']"
			v-model="switchNum"
			@update:modelValue="toggle"
		></Switch>
	</div>
</template>

<script setup>
	import Switch from '@/components/base/switch';
	import { ref } from 'vue';

	const props = defineProps({
		type: {
			type: Number,
			default: 0,
		},
	});

	const switchNum = ref(props.type);

	/* 开关转换 */
	function toggle(index) {
		// listScrollRef.value.scroll.refresh();
		// listScrollRef.value.scroll.scrollTo(0, 0, 500);
		switchNum.value = index;
	}
</script>

<style lang="scss" scoped></style>
