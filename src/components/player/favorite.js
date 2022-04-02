import storage from '@/utils/storage';
import { computed } from 'vue';
import { useStore } from 'vuex';

export function favorite() {
	const store = useStore();

	const favoriteList = computed(() => store.state.favoriteList);
	const favoriteIcon = computed(() => {});
}

function isFavorite(song) {
	const list = storage.getLocal('___favoriteList__');
	return list.findIndex((item) => item.id === song.id) === -1;
}
