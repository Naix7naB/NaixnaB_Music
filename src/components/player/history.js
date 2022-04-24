import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import storage from '@/plugins/storage';

export default () => {
	const store = useStore();

	const historyList = computed(() => store.state.historyList);

	/* 把歌曲保存到历史播放列表 */
	function saveHistoryList(song) {
		const list = historyList.value.slice();
		const idx = list.findIndex((item) => item.id === song.id);
		if (idx === -1) {
			/* 当前歌曲不在历史播放列表里 则在列表最前面添加歌曲 */
			list.unshift(song);
		} else {
			/* 当前歌曲在列表里 则把歌曲移到列表最前面 */
			list.unshift(...list.splice(idx, 1));
		}
		/* 最多存放100首历史歌曲 */
		list.length = Math.min(100, list.length);
		store.commit('setHistoryList', list);
		storage.setLocal('__historyList__', list);
	}

	onMounted(() => {
		/* 如果 Vuex没有 历史播放列表 */
		if (!historyList.value.length) {
			const list = storage.getLocal('__historyList__', []);
			if (list.length) {
				store.commit('setHistoryList', list);
			}
		}
	});

	return {
		saveHistoryList,
	};
};
