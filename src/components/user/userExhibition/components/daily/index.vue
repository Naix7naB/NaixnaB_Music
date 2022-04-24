<template>
	<div class="daily">
		<!-- 固定头部 -->
		<DailyTop
			:style="visible"
			:count="songs.length"
			:play="sequencePlayAll"
		></DailyTop>
		<!-- 歌曲列表 -->
		<Scroll
			class="list"
			:probeType="3"
			:style="scrollStyle"
			@onScroll="onScroll"
		>
			<div>
				<Date></Date>
				<div class="song-list-wrapper" v-load="isLoading">
					<ListTop :count="songs.length" @play="sequencePlayAll"></ListTop>
					<SongList :songs="songs" :isNum="false"></SongList>
				</div>
			</div>
		</Scroll>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useStore } from 'vuex';
	import { getDailySongs } from '@/service/recommend';
	import storage from '@/plugins/storage';
	import DailyTop from './components/dailyTop';
	import Date from './components/date/index.vue';
	import Scroll from '@/components/base/scroll';
	import SongList from '@/components/base/songList/index.vue';
	import ListTop from '@/components/base/listTop/index.vue';

	const store = useStore();

	const songs = ref([]);
	const reason = ref([]);
	const scrollY = ref(0);
	const isLoading = ref(true);

	const _style = {
		zIndex: 0,
		background: 'rgba(0,0,0,0)',
		backdropFilter: 'blur(0px)',
	};

	const playList = computed(() => store.state.playList);

	/* 播放全部固定样式 */
	const visible = computed(() => {
		let visibility = 'hidden';
		if (scrollY.value > 30) {
			visibility = 'visible';
		}
		return {
			visibility,
		};
	});

	/* 滚动样式 */
	const scrollStyle = computed(() => {
		return {
			bottom: playList.value.length ? '60px' : 0,
		};
	});

	/* 歌曲列表滚动事件 */
	function onScroll(pos) {
		scrollY.value = -pos.y;
	}

	/* 顺序播放歌单歌曲 */
	function sequencePlayAll() {
		store.dispatch('playSequenceList', songs);
		/* 把当前模式存储到本地 */
		storage.setLocal('__mode__', 0);
	}

	onMounted(async () => {
		const { dailySongs, reasons } = await getDailySongs();
		reason.value = reasons;
		songs.value = dailySongs;
		isLoading.value = false;
	});

	defineExpose({
		_style,
	});
</script>

<style lang="scss" scoped>
	.daily {
		z-index: -1;
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;

		.list {
			z-index: 0;
			position: absolute;
			top: 80px;
			bottom: 0;
			width: 100%;

			.song-list-wrapper {
				min-height: 350px;
				margin-top: 10px;
				border-top-left-radius: 30px;
				border-top-right-radius: 30px;
				background: rgba(69, 65, 65, 0.3);
				backdrop-filter: blur(2px);

				&::v-deep(.list-top) {
					background: rgba(0, 0, 0, 0);
				}

				&::v-deep(.song-list .item) {
					margin-bottom: 12px;
				}
			}
		}
	}
</style>
