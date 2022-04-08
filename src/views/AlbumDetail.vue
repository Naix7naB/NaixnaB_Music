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
	import MusicList from '@/components/musicList';
	import { getAlbumMusic } from '@/service/recommend';
	import createDetail from './_createDetail';

	const props = defineProps(['detailObj']);

	const { listTitle, picUrl, songs, isLoading } = createDetail({
		props: props,
		localKey: '__albumDetail__',
		api: getAlbumMusic,
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
