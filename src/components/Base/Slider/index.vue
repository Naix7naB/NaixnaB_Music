<template>
	<div class="slider" ref="slideRef">
		<div class="slider-banner">
			<div class="slider-page" v-for="item in banners" :key="item.bannerId">
				<img :src="item.pic" />
			</div>
		</div>

		<div class="dots-wrapper">
			<span
				class="dot"
				v-for="(item, index) in banners"
				:key="index"
				:class="{ active: currentPageIndex === index }"
			></span>
		</div>
	</div>
</template>

<script setup>
	import { slideAni } from './slide.js';

	const props = defineProps({
		banners: {
			type: [Array, Object],
			require: true,
		},
	});
	const { slideRef, currentPageIndex } = slideAni();
</script>

<style lang="scss" scoped>
	.slider {
		min-height: 1px;
		font-size: 0;
		touch-action: pan-y;
		position: relative;

		.slider-banner {
			position: relative;
			overflow: hidden;
			white-space: nowrap;

			.slider-page {
				display: inline-block;
				transform: translate3d(0, 0, 0);
				backface-visibility: hidden;

				img {
					display: block;
					width: 100%;
				}
			}
		}

		.dots-wrapper {
			position: absolute;
			left: 50%;
			bottom: 12px;
			line-height: 12px;
			transform: translateX(-50%);

			.dot {
				display: inline-block;
				margin: 0 4px;
				width: 8px;
				height: 8px;
				transform: translateZ(1px);
				border-radius: 50%;
				background: $color-text-l;

				&.active {
					width: 20px;
					border-radius: 5px;
					background: $color-text-ll;
				}
			}
		}
	}
</style>
