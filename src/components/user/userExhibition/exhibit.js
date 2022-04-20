import { computed, onMounted, ref } from 'vue';
import { getFollows, getFolloweds } from '@/service/user';
import storage from '@/plugins/storage';

export default () => {
	const itemRef = ref(null);
	const friends = ref({});

	const userId = computed(() => {
		return storage.getLocal('__uid__', '');
	});

	function onClick(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.index / 1;
		switch (index) {
			case 0:
				getUserFriends(userId.value);
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
		}
	}

	async function getUserFriends(uid) {
		const { follow } = await getFollows({ uid });
		const { followeds } = await getFolloweds({ uid });
		friends.value = {
			follow,
			followeds,
		};
	}

	return {
		itemRef,
		onClick,
		friends,
	};
};
