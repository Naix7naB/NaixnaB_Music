<template>
	<div class="user-title">
		<!-- 返回按钮 -->
		<div class="back" @click="onClick">
			<i class="icon-back"></i>
		</div>
		<!-- 标题 -->
		<div class="title">
			<img v-if="icon" :src="icon" />
			<span>{{ text }}</span>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		text: {
			type: String,
			default: '标题',
		},
		icon: {
			type: String,
			default: '',
		},
	});
	const emit = defineEmits(['back']);

	/* 返回上一级 */
	function onClick() {
		emit('back');
	}
</script>

<style lang="scss" scoped>
	.user-title {
		z-index: 1;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #625243;

		.back {
			z-index: 2;
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
			margin: 0 auto;
			@include no-wrap();
			text-align: center;
			font-size: $font-size-medium-x;

			img {
				width: 30px;
				height: 30px;
				margin-right: 6px;
				border-radius: 50%;
				vertical-align: -9px;
			}
		}
	}
</style>
