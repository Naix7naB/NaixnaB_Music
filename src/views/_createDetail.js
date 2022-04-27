import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import storage from '@/plugins/storage';

export default (params) => {
	const { props, sessionKey, api } = params;

	const router = useRouter();
	const route = useRoute();
	const songs = ref([]);
	const isLoading = ref(true);

	/* 重新处理歌单详细的数据 */
	const computedData = computed(() => {
		let result = null;
		let data = props.detailObj;
		if (data.id) {
			/* props的值存在时 */
			result = data;
		} else {
			/* props的值不存在时 */
			const cached = storage.getSession(sessionKey);
			if (cached && cached.id === route.params.id / 1) {
				result = cached;
			}
		}
		return result;
	});

	/* 歌单标题 */
	const listTitle = computed(() => {
		return computedData.value ? computedData.value.name : '';
	});

	/* 歌单图片 */
	const picUrl = computed(() => {
		return computedData.value ? computedData.value.picUrl : '';
	});

	onMounted(() => {
		const data = computedData.value;
		if (!data) {
			/* 如果 props 和 本地存储 的数据都不存在，就回到上一页 */
			router.push({
				path: route.matched[0].path,
			});
			return;
		} else {
			/* 获取歌单歌曲 */
			api({ id: data.id }).then((res) => {
				songs.value = res.hotSongs;
				isLoading.value = false;
			});
		}
	});

	return {
		listTitle,
		picUrl,
		songs,
		isLoading,
	};
};
