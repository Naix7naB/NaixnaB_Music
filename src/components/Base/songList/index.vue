<template>
	<ul class="song-list" @click="playSong">
		<li
			class="item"
			v-for="(item, index) in songs"
			:key="item"
			:data-index="index"
		>
			<div class="content">
				<h2 class="name">{{ item.name }}</h2>
				<p class="desc">{{ handleName(item) }}</p>
			</div>
		</li>
	</ul>
</template>

<script setup>
	import { computed } from 'vue';
	import { useStore } from 'vuex';
	import { handleName } from '@/utils';

	const store = useStore();
	const props = defineProps(['songs']);

	const playList = computed(() => store.state.playList);
	/* 点击歌单中的歌曲 播放歌曲 并把歌单的歌曲添加到播放列表中 */
	function playSong(e) {
		let curNode = e.target;
		while (curNode.className !== 'item') {
			curNode = curNode.parentElement;
		}
		const curIndex = curNode.dataset.index / 1;
		if (!playList.value.length || playList.value !== props.songs) {
			/* 当播放列表没有歌曲时 或 当前播放列表跟当前点击的歌曲所在的歌单不一致时(歌单与歌单之间) */
			store.dispatch('addWholeList', props.songs);
		}
		store.dispatch('addOneSong', props.songs[curIndex]);
	}
</script>

<style lang="scss" scoped>
	.song-list {
		.item {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			height: 64px;
			font-size: $font-size-medium;

			.content {
				flex: 1;
				line-height: 20px;
				overflow: hidden;

				.name {
					@include no-wrap();
					color: $color-text-ll;
				}

				.desc {
					@include no-wrap();
					margin-top: 4px;
					color: $color-text-d;
				}
			}
		}
	}
</style>
