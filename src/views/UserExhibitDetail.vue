<template>
	<div
		class="user-exhibit"
		:style="{ backgroundImage: `url(${bgImage})` }"
		v-if="bgImage"
	>
		<!-- 模糊层 -->
		<Filter></Filter>
		<!-- 顶部标题 -->
		<UserTitle :text="title" :style="titleStyle" @back="back"></UserTitle>
		<!-- 内容区 不同组件渲染 -->
		<component :type="type" :is="curComponent" />
	</div>
</template>

<script setup>
	import { computed, onMounted } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import storage from '@/plugins/storage';

	import Filter from '@/components/user/filter';
	import UserTitle from '@/components/user/userTitle';
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

	/* 重新处理的数据 */
	const computedData = computed(() => {
		let result = null;
		let data = props.detailObj;
		if (data.title) {
			/* props的值存在时 */
			result = data;
		} else {
			/* props的值不存在时 */
			const cached = storage.getSession('__exhibitDetail__');
			if (!cached) return;
			result = cached;
		}
		return result;
	});

	const bgImage = computed(() => {
		return computedData.value ? computedData.value.bgImage : '';
	});

	/* 标题 */
	const title = computed(() => {
		return computedData.value ? computedData.value.title : '';
	});

	/* 标题样式 */
	const titleStyle = computed(() => {
		const index = computedData.value ? computedData.value.index : -1;
		if (index === 0) {
			return {
				background: 'rgba(0,0,0,0)',
			};
		}
	});

	/* 我喜欢的 和 历史播放 */
	const type = computed(() => {
		return computedData.value.type ? computedData.value.type : '';
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
		router.back();
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
	.user-exhibit {
		z-index: 50;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: 0 -160px / contain fixed;
	}
</style>
