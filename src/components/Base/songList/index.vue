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

	const store = useStore();
	const props = defineProps(['songs']);

	function handleName(item) {
		const ar = item.ar;
		return ar.map((artist) => artist.name).join(' / ');
	}

	function playSong(e) {
		let curNode = e.target;
		while (curNode.className !== 'item') {
			curNode = curNode.parentElement;
		}
		const curIndex = curNode.dataset.index / 1;
		store.dispatch('addWholeList', { list: props.songs, index: curIndex });
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
