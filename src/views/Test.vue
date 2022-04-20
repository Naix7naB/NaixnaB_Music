<template>
	<div class="test">
		<Tip ref="tipRef" closed plain type="success">登录成功！</Tip>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import Tip from '@/components/base/tip';

	const tipRef = ref(null);

	onMounted(() => {
		setTimeout(() => {
			tipRef.value.show();
		}, 1000);
	});
</script>

<style lang="scss" scoped>
	.test {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: $color-background;
	}
</style>
