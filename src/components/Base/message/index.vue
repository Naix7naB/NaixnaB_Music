<template>
	<teleport to="body">
		<div class="message">
			<div class="content" :style="theme">{{ message }}</div>
		</div>
	</teleport>
</template>

<script setup>
	import { ref } from 'vue';

	const message = ref('this is a message.');

	const theme = ref({});

	/* 成功的消息 */
	function success(msg) {
		message.value = msg;
		theme.value = { color: '#67c23a', backgroundColor: '#d0eac1' };
	}

	/* 失败的消息 */
	function error(msg) {
		message.value = msg;
		theme.value = { color: '#f56c6c', backgroundColor: '#f4cece' };
	}

	defineExpose({
		success,
		error,
	});
</script>

<style lang="scss" scoped>
	.message {
		position: absolute;
		top: 10%;
		left: 50%;
		transform: translate(-50%, -50%);

		.content {
			width: 200px;
			height: 34px;
			line-height: 34px;
			text-align: center;
			border-radius: 14px;
			font-size: $font-size-medium;
		}
	}
</style>
