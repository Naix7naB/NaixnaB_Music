<template>
	<div class="progress-circle">
		<!-- svg实际呈现的大小 由 width,height 决定 (最终展示到浏览器的大小) -->
		<!-- viewBox: x起点 0  y起点 0 视口的大小(画布大小) 100*100 -->
		<svg :width="radius" :height="radius" viewBox="0 0 100 100">
			<!-- 半径: r 圆心的坐标位置: cx cy -->
			<circle
				class="progress-background"
				r="50"
				cx="50"
				cy="50"
				fill="transparent"
			/>
			<circle
				class="progress-bar"
				r="50"
				cx="50"
				cy="50"
				fill="transparent"
				:stroke-dasharray="dashArray"
				:stroke-dashoffset="dashOffset"
			/>
		</svg>
		<slot></slot>
	</div>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		radius: {
			type: Number,
			default: 100,
		},
		progress: {
			type: Number,
			default: 0,
		},
	});

	/* 圆的周长 */
	const dashArray = Math.PI * 2 * 50;
	/* 进度条偏移量 */
	const dashOffset = computed(() => (1 - props.progress) * dashArray);
</script>

<style lang="scss" scoped>
	.progress-circle {
		position: relative;

		circle {
			stroke-width: 8px;
			transform-origin: center;

			&.progress-background {
				transform: scale(0.9);
				stroke: $color-sub-theme;
			}

			&.progress-bar {
				transform: scale(0.9) rotate(-90deg);
				stroke: $color-theme;
			}
		}
	}
</style>
