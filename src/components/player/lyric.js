import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { getSongLyric } from '@/service/songApi';
import { formatLyric } from '@/utils';

export default (curTime) => {
	const store = useStore();
	/* 定时器 */
	let timer = null;

	const lyricScrollRef = ref(null);
	const lyricRef = ref(null);
	const lyric = ref(null);
	const curLyricIndex = ref(0);

	const currentSong = computed(() => store.getters.currentSong);
	const playState = computed(() => store.state.playState);

	watch(currentSong, async (newSong) => {
		if (!newSong.id) return;
		const { lrc } = await getSongLyric(newSong);
		lyric.value = formatLyric(lrc.lyric);
		/* 首先清空时间 */
		curTime.value = 0;
		stop();
		play();
	});

	/* 歌词索引值改变时 执行滚动动画 */
	watch(curLyricIndex, (newIndex) => {
		scrollLyric(newIndex);
	});

	/* 歌词滚动 */
	function scrollLyric(newIndex) {
		const scroll = lyricScrollRef.value.scroll;
		const lyricRefVal = lyricRef.value;
		if (newIndex <= 6) {
			/* 如果 index<=6 就不发生滚动 */
			scroll.scrollTo(0, 0, 1000);
		} else {
			const targetEl = lyricRefVal.children[newIndex - 6];
			scroll.scrollToElement(targetEl, 1000);
		}
	}

	/* 开始计算需要滚动到歌词索引值 */
	function play() {
		const lyricVal = lyric.value;
		if (!lyricVal || !lyricVal.length) return;
		currentIndex();
		if (playState.value) {
			start();
		}
	}

	/* 计算当前歌词的索引值 */
	function currentIndex() {
		const lyricVal = lyric.value;
		const nowTime = curTime.value;

		let index = 0;
		/* 如果没有歌词 或 歌词不支持滚动 */
		if (!lyricVal.length || !lyricVal[index].time) return;
		for (let i = 0; i < lyricVal.length; i++) {
			if (nowTime >= lyricVal[lyricVal.length - 1].time) {
				/* 处理歌词到达最后一句时 */
				index = lyricVal.length - 1;
				break;
			}
			if (nowTime >= lyricVal[i].time && nowTime < lyricVal[i + 1].time) {
				index = i;
				break;
			}
		}

		curLyricIndex.value = index;
	}

	/* 开启定时器 */
	function start() {
		const lyricVal = lyric.value;
		const nowTime = curTime.value;
		let index = curLyricIndex.value;
		/* 如果没有歌词 或 歌词不支持滚动 */
		if (!lyricVal.length || !lyricVal[index].time) return;
		/* 如果是最后一句歌词 就不再开启定时器 */
		if (index === lyricVal.length - 1) return;
		/* 定时器延时时间为 = 下一句歌词时间 - 当前播放时间 (单位: ms) */
		let delay = (lyricVal[index + 1].time - nowTime) * 1000;
		timer = setTimeout(() => {
			curLyricIndex.value = ++index;
			start();
		}, delay);
	}

	/* 关闭定时器 */
	function stop() {
		clearTimeout(timer);
	}

	return {
		lyric,
		curLyricIndex,
		play,
		stop,
		lyricScrollRef,
		lyricRef,
	};
};
