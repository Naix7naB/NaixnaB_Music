<template>
	<div class="user-center">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
	</div>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { storage } from '@/utils';

	const router = useRouter();

	/* 返回上一级 */
	function back() {
		router.push('/');
	}

	onMounted(() => {
		const token = storage.getLocal('__token__', '');
		if (!token) {
			/* token为空就重定向到login页面 */
			router.push('/login');
		}
	});
</script>

<style lang="scss" scoped>
	.user-center {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 100;
		width: 100%;
		background-color: $color-background;

		.back {
			position: absolute;
			top: 0;
			left: 6px;
			z-index: 50;

			.icon-back {
				display: block;
				padding: 10px;
				font-size: $font-size-large-x;
				color: $color-theme;
			}
		}
	}
</style>
