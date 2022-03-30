import BScroll from '@better-scroll/core';
import ObserveDOM from '@better-scroll/observe-dom';
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue';
BScroll.use(ObserveDOM);

// props 接收用户自定义设置 如 probeType
export function useScroll(props, emit) {
	const scrollRef = ref(null);
	const scroll = ref(null);

	onMounted(() => {
		scroll.value = new BScroll(scrollRef.value, {
			observeDOM: true,
			...props,
		});

		if (props.probeType > 0) {
			scroll.value.on('scroll', pos => {
				emit('onScroll', pos);
			});
		}
	});

	onUnmounted(() => {
		scroll.value.destroy(); // 销毁
	});

	onActivated(() => {
		scroll.value.enable(); //恢复功能
		scroll.value.refresh(); //刷新一下
	});

	onDeactivated(() => {
		scroll.value.disable(); //禁用功能
	});

	return {
		scrollRef,
		scroll,
	};
}
