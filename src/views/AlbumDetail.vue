<template>
	<div class="album-detail">
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
	import { getAlbumMusic } from '@/service/recommend';
	import { storage } from '@/utils';
	import MusicList from '@/components/musicList';

	const router = useRouter();
	const route = useRoute();
	const props = defineProps(['albumDetail']);
	const isLoading = ref(true);
	const songs = ref([]);

	/* 重新处理歌单详细的数据 */
	const computedData = computed(() => {
		let result = null;
		let data = props.albumDetail;
		if (data) {
			/* props的值存在时 */
			result = data;
		} else {
			/* props的值不存在时 */
			const cached = storage.getLocal('__albumDetail__');
			if (cached && cached.id === route.params.id / 1) {
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

	onMounted(() => {
		const data = computedData.value;
		if (!data) {
			/* 如果 props 和 本地存储 的数据都不存在，就回到上一页 */
			router.push({
				path: route.matched[0].path,
			});
			return;
		} else {
			/* 获取歌单歌曲 */
			getAlbumMusic(data).then((res) => {
				songs.value = res.hotSongs;
				isLoading.value = false;
			});
		}
	});
</script>

<style lang="scss" scoped>
	.album-detail {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: $color-background;
		z-index: 1;
	}
</style>
