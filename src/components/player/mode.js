import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { storage } from '@/utils';

export default () => {
	const store = useStore();

	const playMode = computed(() => store.state.playMode);

	/* 播放模式图标 */
	const modeIcon = computed(() => {
		const mode = playMode.value;
		switch (mode) {
			case 0:
				return 'icon-sequence';
			case 1:
				return 'icon-loop';
			case 2:
				return 'icon-random';
		}
	});

	/* 播放模式文本 */
	const modeText = computed(() => {
		const mode = playMode.value;
		switch (mode) {
			case 0:
				return '顺序播放';
			case 1:
				return '单曲循环';
			case 2:
				return '随机播放';
		}
	});

	/* 切换播放模式 */
	function toggleMode() {
		// 0 => 1 => 2 => 0
		const mode = (playMode.value + 1) % 3;
		store.dispatch('changeMode', mode);
	}

	onMounted(() => {
		const mode = storage.getLocal('__mode__');
		/* 如果本地有 mode值 则使用本地的值 */
		if (mode) store.dispatch('changeMode', mode);
	});

	return {
		modeIcon,
		modeText,
		toggleMode,
	};
};
