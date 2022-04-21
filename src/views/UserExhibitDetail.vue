<template>
	<div class="exhibit" :style="{ backgroundImage: `url(${bgImage})` }">
		<!-- 模糊层 -->
		<div class="filter"></div>
		<!-- 返回按钮 -->
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<!-- 标题 -->
		<div class="title">
			<p class="name">{{ title }}</p>
		</div>
		<!-- 内容区 不同组件渲染 -->
		<div class="content">
			<component :is="curComponent" />
		</div>
	</div>
</template>

<script setup>
	import { computed, onMounted } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import storage from '@/plugins/storage';
	import Friend from '@/components/user/userExhibition/components/friend';
	import Collection from '@/components/user/userExhibition/components/collection';
	import History from '@/components/user/userExhibition/components/history';
	import Rank from '@/components/user/userExhibition/components/rank';

	const router = useRouter();
	const route = useRoute();

	const props = defineProps({
		detailObj: {
			type: Object,
			default: {},
		},
	});

	/* 背景图片 */
	const bgImage = computed(() => storage.getLocal('__bgImage__', ''));

	/* 重新处理的数据 */
	const computedData = computed(() => {
		let result = null;
		let data = props.detailObj;
		if (data.title) {
			/* props的值存在时 */
			result = data;
		} else {
			/* props的值不存在时 */
			const cached = storage.getLocal('__exhibitDetail__');
			if (!cached) return;
			result = cached;
		}
		return result;
	});

	/* 标题 */
	const title = computed(() => {
		return computedData.value ? computedData.value.title : '';
	});

	/* 当前索引值 */
	const curIndex = computed(() => {
		return computedData.value ? computedData.value.index : -1;
	});

	/* 根据当前索引值, 选择真正需要渲染的组件 */
	const curComponent = computed(() => {
		switch (curIndex.value) {
			case 0:
				return Friend;
			case 1:
				return Collection;
			case 2:
				return History;
			case 3:
				return Rank;
		}
	});

	/* 返回上一级 */
	function back() {
		router.push({
			path: route.matched[0].path,
		});
	}

	onMounted(() => {
		const data = computedData.value;
		if (!data) {
			/* 如果 props 和 本地存储 的数据都不存在，就回到上一页 */
			router.push({
				path: route.matched[0].path,
			});
			return;
		}
	});
</script>

<style lang="scss" scoped>
	.exhibit {
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		background: 0 -160px / contain fixed;

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
			z-index: -1;
			position: absolute;
			left: 0;
			right: 0;
			line-height: 50px;
			background-color: rgba(110, 91, 66, 0.8);
			backdrop-filter: blur(10px);

			.name {
				width: 50%;
				margin: 0 auto;
				@include no-wrap();
				text-align: center;
				font-size: $font-size-medium-x;
			}
		}
	}
</style>
