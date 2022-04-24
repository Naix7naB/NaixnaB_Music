<template>
	<div class="list-top" @click.stop="onClick">
		<div class="top-icon"><i class="icon-play-fill"></i></div>
		<span class="txt">播放全部</span>
		<span class="count">({{ count }})</span>
		<div class="space" @click.stop></div>
	</div>
</template>

<script setup>
	const props = defineProps({
		count: {
			type: Number,
			default: 0,
		},
	});
	const emit = defineEmits(['play']);

	function onClick() {
		emit('play');
	}
</script>

<style lang="scss" scoped>
	.list-top {
		display: flex;
		align-items: center;
		width: 100%;
		line-height: 50px;
		padding-left: 20px;
		background: $color-background;

		.top-icon {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background: rgba(209, 182, 147, 0.8);
			text-align: center;

			.icon-play-fill {
				font-size: $font-size-small-s;
				vertical-align: 16px;
			}
		}

		.txt {
			padding-left: 10px;
			font-size: $font-size-medium-x;
		}

		.count {
			margin-left: 6px;
			font-size: $font-size-small;
			color: $color-text-l;
		}

		.space {
			flex: 1;
			height: 50px;
		}
	}
</style>
