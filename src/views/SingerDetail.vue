<template>
	<div class="singer-detail">
		<MusicList
			:listTitle="artist.name"
			:picUrl="artist.picUrl"
			:songs="songs"
		></MusicList>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { getSingerMusic } from '@/service/singerApi';
	import MusicList from '@/components/musicList';

	const props = defineProps(['singerId']);

	const artist = ref({});
	const songs = ref([]);
	onMounted(() => {
		getSingerMusic(props.singerId).then(res => {
			artist.value = res.artist;
			songs.value = res.hotSongs;
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
