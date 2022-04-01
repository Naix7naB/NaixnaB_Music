<template>
	<div class="singer-detail">
		<MusicList
			:listTitle="listTitle"
			:picUrl="picUrl"
			:songs="songs"
			:isLoading="isLoading"
		></MusicList>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { getSingerMusic } from '@/service/singerApi';
	import storage from '@/utils/storage';
	import MusicList from '@/components/musicList';

	const router = useRouter();
	const route = useRoute();
	const props = defineProps(['singerDetail']);
	const isLoading = ref(true);

	const computedData = computed(() => {
		let result = null;
		let data = props.singerDetail;
		if (data.id) {
			// props的值存在时
			result = data;
		} else {
			// props的值不存在时
			const cached = storage.getLocal('__singerDetail__');
			if (cached && cached.id == route.params.id) {
				result = cached;
			}
		}
		return result;
	});

	const listTitle = computed(() => {
		return computedData.value ? computedData.value.name : '';
	});
	const picUrl = computed(() => {
		return computedData.value ? computedData.value.picUrl : '';
	});

	const songs = ref([]);
	onMounted(() => {
		const data = computedData.value;
		if (!data) {
			// 如果 props 和 本地存储 的数据都不存在，就回到上一页
			router.push({
				path: route.matched[0].path,
			});
			return;
		}
		getSingerMusic(data).then(res => {
			songs.value = res.hotSongs;
			isLoading.value = false;
		});
	});
</script>

<style lang="scss" scoped>
	.singer-detail {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: $color-background;
		z-index: 1;
	}
</style>
