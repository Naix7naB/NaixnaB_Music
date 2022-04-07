<template>
	<div class="progress-bar">
		<!-- 播放背景条 -->
		<div class="bar-inner" ref="totaProgressRef" @click="changeProgress">
			<!-- 实际播放进度条 -->
			<div class="progress" ref="progressRef" :style="progressStyle"></div>
			<div
				class="progress-btn-wrapper"
				ref="progressBtnRef"
				:style="progressBtnStyle"
				@touchstart.stop="touchStart"
				@touchmove.stop="touchMove"
				@touchend.stop="touchEnd"
			>
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from '@vue/reactivity';
	import { computed, onMounted, watch } from '@vue/runtime-core';

	const props = defineProps({
		progress: {
			type: Number,
			default: 0,
		},
	});
	const emit = defineEmits(['progressChanging', 'progressChanged']);

	const progressRef = ref(null);
	const totaProgressRef = ref(null);
	const progressBtnRef = ref(null);

	/* 进度条真实走动偏移量 */
	const offset = ref(0);
	/* 进度条最大宽度 */
	const maxWidth = ref(0);
	/* 记录手指触摸 */
	const touch = {
		x1: 0,
		x2: 0,
		originWidth: 0,
		progress: 0,
	};

	/* 进度条样式 */
	const progressStyle = computed(() => {
		return {
			width: `${offset.value}px`,
		};
	});

	/* 进度条按钮样式 */
	const progressBtnStyle = computed(() => {
		return {
			transform: `translateX(${offset.value}px)`,
		};
	});

	/* 实时更新 监视进度条长度 */
	watch(
		() => props.progress,
		(newVal) => {
			offset.value = newVal * maxWidth.value;
		}
	);

	/* 手指点击进度条 */
	function changeProgress(e) {
		const delta = progressBtnRef.value.firstChild.offsetWidth / 2;
		/* layerX 是相对于定位父级进行计算 | offsetX 是相对于自身内容区进行计算 */
		offset.value = Math.max(0, Math.min(e.layerX - delta, maxWidth.value));
		emitProgress('progressChanged');
	}

	/* 手指拖动开始进度条 */
	function touchStart(e) {
		touch.x1 = e.touches[0].pageX;
		/* 进度条初始宽度 */
		touch.originWidth = progressRef.value.clientWidth;
	}

	/* 手指拖动进度条过程 */
	function touchMove(e) {
		touch.x2 = e.touches[0].pageX;
		/* 拖动的距离 */
		const delta = touch.x2 - touch.x1;
		const tempWidth = touch.originWidth + delta;
		/* 进度条偏移量  0 ~ maxWidth */
		offset.value = Math.max(0, Math.min(tempWidth, maxWidth.value));
		emitProgress('progressChanging');
	}

	/* 手指拖动进度条结束 */
	function touchEnd() {
		emitProgress('progressChanged');
	}

	/* 将进度值提交给 player进行计算时间 */
	function emitProgress(event) {
		/* 进度条比例 */
		const progress = offset.value / maxWidth.value;
		emit(event, progress);
	}

	onMounted(() => {
		maxWidth.value =
			totaProgressRef.value.offsetWidth -
			progressBtnRef.value.firstChild.offsetWidth;
	});
</script>

<style lang="scss" scoped>
	.progress-bar {
		height: 30px;

		.bar-inner {
			position: relative;
			top: 13px;
			height: 4px;
			background: rgba(0, 0, 0, 0.3);

			.progress {
				position: absolute;
				height: 100%;
				background: $color-theme;
			}

			.progress-btn-wrapper {
				position: absolute;
				left: -8px;
				top: -13px;
				width: 30px;
				height: 30px;

				.progress-btn {
					position: relative;
					top: 7px;
					left: 7px;
					box-sizing: border-box;
					width: 16px;
					height: 16px;
					border: 3px solid $color-text;
					border-radius: 50%;
					background: $color-theme;
				}
			}
		}
	}
</style>
