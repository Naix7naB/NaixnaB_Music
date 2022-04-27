<template>
	<div class="login">
		<Login v-if="visible"></Login>
		<!-- 弹窗 -->
		<Confirm
			ref="confirmRef"
			text="请先登录后操作"
			@confirm="confirm"
			@cancel="cancel"
		></Confirm>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import Login from '@/components/login';
	import Confirm from '@/components/base/confirm';

	const router = useRouter();

	const confirmRef = ref(null);
	const visible = ref(false);

	/* 点击确认按钮 */
	function confirm() {
		visible.value = true;
	}

	/* 点击取消按钮 */
	function cancel() {
		router.push('/');
	}

	onMounted(() => {
		confirmRef.value.show();
	});
</script>

<style lang="scss" scoped>
	.login {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: $color-background;
	}
</style>
