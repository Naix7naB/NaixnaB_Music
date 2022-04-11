import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default (emit) => {
	const store = useStore();

	const itemRef = ref(null);
	const miniSlideStyle = ref(null);
	const touch = {
		x1: 0,
		x2: 0,
		maxWidth: 0,
		delta: 0,
		percent: 0,
	};

	const currentSong = computed(() => store.getters.currentSong);
	const curPlayList = computed(() => store.state.curPlayList);
	const songList = computed(() => getList());

	/* 获取 上一首歌曲 当前歌曲 下一首歌曲 */
	function getList() {
		const list = curPlayList.value.slice();
		const song = currentSong.value;
		const index = list.findIndex((item) => item.id === song.id);
		const songlist = [];
		if (list.length < 3) {
			songlist.push(song);
		} else {
			if (index === 0) {
				/* 如果当前歌曲是第一首 */
				songlist[0] = list[list.length - 1];
				songlist[1] = list[index];
				songlist[2] = list[index + 1];
			} else if (index === list.length - 1) {
				/* 如果当前歌曲是最后一首 */
				songlist[0] = list[index - 1];
				songlist[1] = list[index];
				songlist[2] = list[0];
			} else {
				songlist[0] = list[index - 1];
				songlist[1] = list[index];
				songlist[2] = list[index + 1];
			}
		}
		return songlist;
	}

	/* 滑动开始 */
	function touchSlideStart(e) {
		touch.x1 = e.touches[0].pageX;
		touch.maxWidth = itemRef.value.clientWidth;
	}

	/* 滑动中 */
	function touchSlideMove(e) {
		touch.x2 = e.touches[0].pageX;
		touch.delta = touch.x2 - touch.x1;
		/* 计算手指滑动距离百分比 */
		touch.percent = Math.abs(touch.delta / window.innerWidth);
		miniSlideStyle.value = {
			opacity: 1 - touch.percent,
			transform: `translateX(${touch.delta}px)`,
		};
	}

	/* 滑动结束 */
	function touchSlideEnd() {
		miniSlideStyle.value = {
			opacity: 1,
			transition: 'transform 0.5s',
		};
		if (touch.percent < 0.25) {
			miniSlideStyle.value.transform = `translateX(0px)`;
		} else if (touch.delta > 0 && touch.percent > 0.25) {
			/* 手指向右滑 切换上一首 */
			miniSlideStyle.value.transform = `translateX(${touch.maxWidth}px)`;
			emit('slidePrev');
		} else if (touch.delta < 0 && touch.percent > 0.25) {
			/* 手指向左滑 切换下一首 */
			miniSlideStyle.value.transform = `translateX(${-touch.maxWidth}px)`;
			emit('slideNext');
		}
	}

	return {
		itemRef,
		miniSlideStyle,
		songList,
		touchSlideStart,
		touchSlideMove,
		touchSlideEnd,
	};
};
