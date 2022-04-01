<template>
	<ul class="song-list">
		<li class="item" v-for="item in songs" :key="item">
			<div class="content">
				<h2 class="name">{{ item.name }}</h2>
				<p class="desc">{{ handleName(item.ar) }}</p>
			</div>
		</li>
	</ul>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps(['songs']);

	function handleName(ar) {
		const artists = ar.map(item => item.name);
		return artists.join(' / ');
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
