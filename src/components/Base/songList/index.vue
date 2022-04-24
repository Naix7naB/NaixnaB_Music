<template>
	<!-- 歌曲列表 -->
	<ul class="song-list" @click="playSong">
		<li
			class="item"
			v-for="(item, index) in songs"
			:key="item"
			:data-index="index"
		>
			<div class="image" v-if="!isNum">
				<img v-img-lazy="item.al.picUrl" />
			</div>
			<div
				class="num"
				v-if="isNum"
				:style="{ fontSize: index < 99 ? '16px' : '14px' }"
			>
				{{ index + 1 }}
			</div>
			<div class="details">
				<h2 class="name">{{ item.name }}</h2>
				<p class="desc">{{ handleName(item) }}</p>
			</div>
			<div class="icon"><i class="icon-bofang"></i></div>
		</li>
	</ul>
</template>

<script setup>
	import { computed } from 'vue';
	import { useStore } from 'vuex';
	import { handleName } from '@/plugins/utils';

	const store = useStore();
	const props = defineProps({
		songs: {
			type: Array,
			required: true,
		},
		isNum: {
			type: Boolean,
			default: true,
		},
	});

	const playList = computed(() => store.state.playList);

	/* 点击歌单中的歌曲 播放歌曲 并把歌单的歌曲添加到播放列表中 */
	function playSong(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.index / 1;
		if (!playList.value.length || playList.value !== props.songs) {
			/* 当播放列表没有歌曲时 或 当前播放列表跟当前点击的歌曲所在的歌单不一致时(歌单与歌单之间) */
			store.dispatch('addWholeList', props.songs);
		}
		/* 处理是随机播放时的情况 */
		store.dispatch('getCurPlayIndex', { index, type: 1 });
	}
</script>

<style lang="scss" scoped>
	.song-list {
		padding: 0 20px;
		overflow: hidden;

		.item {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			height: 56px;

			.image {
				flex: 0 0 50px;
				height: 50px;
				border-radius: 10px;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.num {
				flex: 0 0 30px;
				text-align: center;
				color: $color-text-l;
			}

			.details {
				flex: 1;
				line-height: 20px;
				padding: 0 10px;
				overflow: hidden;

				.name {
					@include no-wrap();
					color: $color-text;
					font-size: $font-size-medium;
				}

				.desc {
					@include no-wrap();
					color: $color-text-d;
					font-size: $font-size-small;
				}
			}

			.icon {
				flex: 0 0 40px;
				color: $color-text-d;
				font-size: 24px;
				text-align: center;
			}
		}
	}
</style>
