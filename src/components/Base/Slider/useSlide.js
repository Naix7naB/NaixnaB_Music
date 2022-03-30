import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue';
BScroll.use(Slide);

export function useSlide() {
	const slideRef = ref(null);
	const slide = ref(null);
	const currentPageIndex = ref(0);

	function init() {
		// 需要操作的 DOM
		slide.value = new BScroll(slideRef.value, {
			// 配置项
			slide: true,
			scrollX: true, // 开启横行滚动
			scrollY: false, // 禁用纵向滚动
			click: true,
			momentum: false, // 解决快速滑动时一次滚动多页的问题
			bounce: false, // 禁用回弹动画
			stopPropagation: true,
			probeType: 2,
		});
		slide.value.on('slideWillChange', page => {
			currentPageIndex.value = page.pageX;
		});
	}

	onMounted(() => {
		init();
	});

	onUnmounted(() => {
		slide.value.destroy(); // 销毁
	});

	onActivated(() => {
		slide.value.enable(); //恢复功能
		slide.value.refresh(); //刷新一下
	});

	onDeactivated(() => {
		slide.value.disable(); //禁用功能
	});

	return {
		slideRef,
		currentPageIndex,
	};
}
