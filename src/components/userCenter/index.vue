<template>
	<div class="user-center">
		<!-- 头部 -->
		<div class="user-header">
			<!-- 返回按钮 -->
			<div class="back" @click="back">
				<i class="icon-back"></i>
			</div>
			<!-- 标题 -->
			<div class="title">
				<img class="image" :src="profile.avatarUrl" />
				<span class="name">{{ profile.nickname }}</span>
			</div>
		</div>
		<!-- 背景图片 -->
		<div class="bg-image">
			<div class="filter"></div>
		</div>
		<!-- 用户信息 -->
	</div>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { useRouter } from 'vue-router';

	const router = useRouter();
	const props = defineProps({
		profile: {
			type: Object,
			default: {},
		},
	});

	/* 返回上一级 */
	function back() {
		router.back();
	}
</script>

<style lang="scss" scoped>
	.user-center {
		position: fixed;
		top: 0;
		bottom: 0;
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

		.title {
			position: absolute;
			top: 0;
			left: 25%;
			width: 50%;
			z-index: 20;
			transform: translateZ(2px);
			@include no-wrap();
			text-align: center;
			line-height: 40px;
			font-size: $font-size-large;
			color: $color-text;

			.image {
				width: 30px;
				height: 30px;
				margin-right: 6px;
				border-radius: 50%;
				vertical-align: -9px;
			}
		}
	}
</style>
