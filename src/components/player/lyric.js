import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { getSongLyric } from '@/service/songApi';
import { formatLyric } from '@/utils';

export default (curTime) => {
	const store = useStore();

	/* 定时器 */
	let timer = null;
	const lyric = ref(null);
	// const currentTime = curTime.value
	const curIndex = ref(0);

	const currentSong = computed(() => store.getters.currentSong);

	watch(currentSong, async (newSong) => {
		if (!newSong.id) return;
		const { lrc } = await getSongLyric(newSong);
		lyric.value = formatLyric(lrc.lyric);
		/* 首先清空时间 */
		console.log(curTime);
		curTime.value = 0;
		stop();
		start();
	});

	watch(curIndex, (newIndex) => {
		console.log(newIndex);
	});

	/* 计算当前歌词的索引值 */
	function currentIndex() {
		const lyricVal = lyric.value;
		console.log(curTime);
		const curTime = curTime.value;
		/* 如果没有歌词 */
		if (!lyricVal.length) return;

		let index = 0;
		for (let i = 0; i < lyricVal.length; i++) {
			if (curTime >= lyricVal[lyricVal.length - 1].time) {
				/* 处理歌词到达最后一句时 */
				index = lyricVal.length - 1;
				break;
			}
			if (curTime >= lyricVal[i].time && curTime < lyricVal[i + 1].time) {
				index = i;
				break;
			}
		}

		curIndex.value = index;
	}

	/* 开启定时器 */
	function start() {
		const lyricVal = lyric.value;
		/* 如果没有歌词 */
		if (!lyricVal.length) return;
		currentIndex();
		let index = curIndex.value;
		/* 如果是最后一句歌词 就不再开启定时器 */
		if (index === lyricVal.length - 1) return;
		/* 定时器延时时间为 = 下一句歌词时间 - 当前播放时间 (单位: ms) */
		let delay = (lyricVal[index + 1].time - curTime.value) * 1000;
		timer = setTimeout(() => {
			curIndex.value = ++index;
			start();
		}, delay);
	}

	/* 关闭定时器 */
	function stop() {
		clearTimeout(timer);
	}

	return {
		lyric,
	};
};
