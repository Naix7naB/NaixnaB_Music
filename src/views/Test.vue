<template>
	<div class="text">
		<Message ref="messageRef"></Message>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import Message from '@/components/base/message';

	const messageRef = ref(null);

	onMounted(() => {
		setTimeout(() => {
			messageRef.value.success('登陆成功！');
			setTimeout(() => {
				messageRef.value.error('登陆失败！');
			}, 500);
		}, 1000);
	});
</script>

<style lang="scss" scoped>
	.text {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: $color-background;
	}
</style>
