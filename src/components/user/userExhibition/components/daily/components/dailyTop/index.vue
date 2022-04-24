<template>
	<div class="daily-top" :style="{ backgroundImage: `url(${bgImage})` }">
		<div class="filter">
			<!-- 日期 历史日推 -->
			<Date></Date>
		</div>
		<!-- 固定播放栏 -->
		<ListTop :count="count" @play="play"></ListTop>
	</div>
</template>

<script setup>
	import { computed } from 'vue';
	import storage from '@/plugins/storage';
	import Date from '../date';
	import ListTop from '@/components/base/listTop/index.vue';

	const props = defineProps({
		play: {
			type: Function,
			required: true,
		},
		count: {
			type: Number,
			default: 0,
		},
		bgImage: {
			type: String,
			default: '',
		},
	});

	const bgImage = computed(() => storage.getLocal('__bgImage__', ''));
</script>

<style lang="scss" scoped>
	.daily-top {
		z-index: 50;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		visibility: hidden;
		background-position: 0 -160px;
		background-size: cover;
		.filter {
			padding-bottom: 10px;
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(2px);

			&::before {
				content: '';
				display: block;
				height: 50px;
			}
		}

		&::v-deep(.list-top) {
			background: rgba(42, 40, 40, 0.7);
			box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
		}
	}
</style>
