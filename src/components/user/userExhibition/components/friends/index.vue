<template>
	<div class="friends">
		<div class="filter"></div>
		<!-- 返回按钮 -->
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<!-- 标题 -->
		<div class="title">
			<span class="name">我的好友</span>
		</div>
	</div>
</template>

<script setup>
	/* 返回上一级 */
	function back() {
		router.back();
	}
</script>

<style lang="scss" scoped>
	.friends {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;

		.filter {
			z-index: -1;
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.4);
		}

		.back {
			z-index: 50;
			position: absolute;
			top: 4px;
			left: 6px;

			.icon-back {
				display: block;
				padding: 10px;
				font-size: $font-size-large-x;
				color: $color-theme;
			}
		}

		.title {
			width: 50%;
			line-height: 50px;
			margin: 0 auto;
			@include no-wrap();
			text-align: center;
			font-size: $font-size-medium-x;
			color: $color-text;
		}
	}
</style>
