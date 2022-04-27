<template>
	<div class="user-album-detail">
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
	import { getMyAlbumMusic } from '@/service/user';
	import createDetail from './_createDetail';

	const props = defineProps(['detailObj']);

	const { listTitle, picUrl, songs, isLoading } = createDetail({
		props: props,
		sessionKey: '__albumDetail__',
		api: getMyAlbumMusic,
	});
</script>

<style lang="scss" scoped>
	.user-album-detail {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: $color-background;
		z-index: 1;
	}
</style>
