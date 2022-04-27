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
	import { getSingerMusic } from '@/service/singer';
	import createDetail from './_createDetail';
	import MusicList from '@/components/musicList';

	const props = defineProps(['detailObj']);

	const { listTitle, picUrl, songs, isLoading } = createDetail({
		props: props,
		sessionKey: '__singerDetail__',
		api: getSingerMusic,
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
