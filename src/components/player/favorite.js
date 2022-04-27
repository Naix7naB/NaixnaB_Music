import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getLikeList } from '@/service/user';
import storage from '@/plugins/storage';

export default () => {
	const store = useStore();

	const isLogin = computed(() => store.state.isLogin);
	const favoriteList = computed(() => store.state.favoriteList);

	/* 喜欢歌曲图标 */
	function favoriteIcon(song) {
		return isFavorite(song) === -1 ? 'icon-not-favorite' : 'icon-favorite';
	}

	/* 切换喜欢 */
	function toggleFavorite(song) {
		const list = favoriteList.value.slice();
		const index = isFavorite(song);
		if (index === -1) {
			// 歌曲不在喜欢列表里 把歌曲添加到喜欢列表
			list.unshift(song);
		} else {
			// 歌曲在喜欢列表里 取消喜欢 把歌曲在喜欢列表中删除
			list.splice(index, 1);
		}
		store.commit('setFavoriteList', list);
		storage.setLocal('__favoriteList__', list);
	}

	/* 判断是否是我喜欢的歌曲 */
	function isFavorite(song) {
		return favoriteList.value.findIndex((item) => item.id === song.id);
	}

	onMounted(async () => {
		/* 如果 Vuex没有 我喜欢的歌曲列表 */
		if (!favoriteList.value.length) {
			const list = storage.getLocal('__favoriteList__', []);
			if (list.length) {
				store.commit('setFavoriteList', list);
			} else {
				if (!isLogin.value) return;
				/* 如果都没有则请求数据 */
				const { favoriteSongs } = await getLikeList();
				store.commit('setFavoriteList', favoriteSongs);
				storage.setLocal('__favoriteList__', favoriteSongs);
			}
		}
	});

	return {
		favoriteIcon,
		toggleFavorite,
	};
};
