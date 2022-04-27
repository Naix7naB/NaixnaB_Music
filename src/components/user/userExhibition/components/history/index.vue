<template>
	<div class="play-list">
		<div class="top">
			<Switch
				:text="['我喜欢的', '播放历史']"
				v-model="switchNum"
				@update:modelValue="toggle"
			></Switch>
			<ListTop :count="curList.length" @play="sequencePlayAll"></ListTop>
		</div>
		<Scroll
			class="list"
			ref="listScrollRef"
			:probeType="3"
			:style="scrollStyle"
			@onScroll="onScroll"
		>
			<div class="song-list-wrapper" v-no-result="!curList.length">
				<SongList :songs="curList"></SongList>
			</div>
		</Scroll>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { useStore } from 'vuex';
	import storage from '@/plugins/storage';
	import Switch from '@/components/base/switch';
	import ListTop from '@/components/base/listTop/index.vue';
	import SongList from '@/components/base/songList/index.vue';
	import Scroll from '@/components/base/scroll/index.vue';

	const store = useStore();
	const props = defineProps({
		type: {
			type: String,
			default: 'favorite',
		},
	});

	const listScrollRef = ref(null);
	const scrollY = ref(0);
	const switchNum = ref(props.type === 'favorite' ? 0 : 1);

	const playList = computed(() => store.state.playList);
	const favoriteList = computed(() => store.state.favoriteList);
	const historyList = computed(() => store.state.historyList);
	const curList = computed(() => {
		return switchNum.value
			? historyList.value.slice()
			: favoriteList.value.slice();
	});

	/* 滚动样式 */
	const scrollStyle = computed(() => {
		return {
			bottom: playList.value.length ? '60px' : 0,
		};
	});

	/* 开关转换 */
	function toggle(index) {
		listScrollRef.value.scroll.refresh();
		listScrollRef.value.scroll.scrollTo(0, 0, 500);
		switchNum.value = index;
	}

	/* 歌曲列表滚动事件 */
	function onScroll(pos) {
		scrollY.value = -pos.y;
	}

	/* 顺序播放歌单歌曲 */
	function sequencePlayAll() {
		store.dispatch('playSequenceList', curList.value);
		/* 把当前模式存储到本地 */
		storage.setLocal('__mode__', 0);
	}
</script>

<style lang="scss" scoped>
	.play-list {
		position: fixed;
		top: 50px;
		bottom: 0;
		width: 100%;
		background: rgba(69, 65, 65, 0.3);
		backdrop-filter: blur(2px);

		.top {
			display: flex;
			flex-direction: column;
			height: 100px;
			box-sizing: border-box;

			/* scss样式穿透 */
			&::v-deep(.switch) {
				flex: 1;
				width: 200px;
				margin-top: 20px;

				.switch-wrapper {
					border: 1px solid rgb(146, 129, 108);

					.switch-item {
						height: 28px;
						line-height: 28px;
						font-size: $font-size-medium;
					}
				}

				.active-bar {
					height: 28px;
					background: rgb(146, 129, 108);
				}
			}

			&::v-deep(.list-top) {
				box-sizing: border-box;
				background: rgba(0, 0, 0, 0);
			}
		}

		.list {
			z-index: 0;
			position: absolute;
			top: 100px;
			bottom: 0;
			width: 100%;
			overflow: hidden;

			.song-list-wrapper {
				min-height: 350px;
			}
		}
	}
</style>
