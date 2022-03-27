import BScroll from '@better-scroll/core';
import ObserveDOM from '@better-scroll/observe-dom';
import { onMounted, ref } from 'vue';
BScroll.use(ObserveDOM);

// props 接收用户自定义设置 如 probeType
export function scrollAni(props) {
	const scrollRef = ref(null);
	const scroll = ref(null);

	onMounted(() => {
		scroll.value = new BScroll(scrollRef.value, {
			observeDOM: true,
			...props,
		});
	});

	return {
		scrollRef,
	};
}
