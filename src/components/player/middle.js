import { ref } from 'vue';

export default () => {
	const middleLStyle = ref(null);
	const middleRStyle = ref(null);
	const curInterface = ref('cd');

	function toggleMiddle() {
		if (curInterface.value === 'cd') {
			curInterface.value = 'lyric';
			middleLStyle.value = {
				opacity: 0,
				zIndex: 0,
			};
			middleRStyle.value = {
				opacity: 1,
				zIndex: 1,
			};
		} else {
			curInterface.value = 'cd';
			middleLStyle.value = {
				opacity: 1,
				zIndex: 1,
			};
			middleRStyle.value = {
				opacity: 0,
				zIndex: 0,
			};
		}
	}

	return {
		toggleMiddle,
		middleLStyle,
		middleRStyle,
	};
};
