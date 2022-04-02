import { ref } from 'vue';

export function useShortCut(groupRef) {
	const rootRef = ref(null);
	const touch = {};

	/* 获取触摸时 当前字母的 index值 */
	function onShortCutTouchStart(e) {
		const anchorIndex = e.target.dataset.index / 1;
		touch.index = anchorIndex;
		touch.y1 = e.touches[0].pageY;
		scrollTo(anchorIndex);
	}

	/* 通过计算 触摸移动的距离 去获取当前的 index值 */
	function onShortCutTouchMove(e) {
		touch.y2 = e.touches[0].pageY;
		const deltaIndex = Math.floor((touch.y2 - touch.y1) / 18);
		scrollTo(deltaIndex);
	}

	/* 跳转至相应的元素 */
	function scrollTo(index) {
		const groups = groupRef.value.children;
		const scroll = rootRef.value.scroll;
		/* 限制 index的范围 index不能小于0 也不能大于26 */
		index = Math.max(Math.min(index, groups.length - 1), 0);
		/* 这个scroll 就是 Scroll组件 暴露出来的是 scroll实例对象 */
		const target = groups[index];
		scroll.scrollToElement(target);
	}

	return {
		rootRef,
		onShortCutTouchStart,
		onShortCutTouchMove,
	};
}
