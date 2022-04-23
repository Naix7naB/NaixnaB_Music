<template>
	<div class="exhibit" :style="{ backgroundImage: `url(${bgImage})` }">
		<!-- 模糊层 -->
		<div class="filter"></div>
		<!-- 返回按钮 -->
		<div class="back" @click="back" :style="{ zIndex: Style ? 1 : 0 }">
			<i class="icon-back"></i>
		</div>
		<!-- 标题  -->
		<div class="title" :style="Style">
			<p class="name">{{ title }}</p>
		</div>
		<!-- 内容区 不同组件渲染 -->
		<div class="content">
			<component ref="cmpRef" :type="type" :is="curComponent" />
		</div>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import storage from '@/plugins/storage';
	import Daily from '@/components/user/userExhibition/components/daily';
	import Friend from '@/components/user/userExhibition/components/friend';
	import Collection from '@/components/user/userExhibition/components/collection';
	import History from '@/components/user/userExhibition/components/history';

	const router = useRouter();
	const route = useRoute();

	const props = defineProps({
		detailObj: {
			type: Object,
			default: {},
		},
	});

	const cmpRef = ref(null);

	/* 背景图片 */
	const bgImage = computed(() => {
		return props.detailObj.bgImage || storage.getLocal('__bgImage__', '');
	});

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

	/* 标题样式 */
	const Style = computed(() => {
		return cmpRef.value ? cmpRef.value._style : {};
	});

	/* 我喜欢的 和 历史播放 */
	const type = computed(() => {
		return computedData.value.type ? computedData.value.type : 0;
	});

	/* 当前索引值 */
	const curIndex = computed(() => {
		return computedData.value ? computedData.value.index : -1;
	});

	/* 根据当前索引值, 选择真正需要渲染的组件 */
	const curComponent = computed(() => {
		switch (curIndex.value) {
			case 0:
				return Daily;
			case 1:
				return Friend;
			case 2:
				return Collection;
			case 3:
				return History;
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
			background: rgba(110, 91, 66, 0.8);
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
