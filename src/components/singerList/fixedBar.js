import { computed, nextTick, onMounted, ref, watch } from 'vue';

export function handleFixed(props) {
	const groupRef = ref(null);
	const heightRange = [];
	let posY = ref(0);
	let curIndex = ref(0);
	let diffHeight = ref(0);

	function onScroll(pos) {
		posY.value = -pos.y;
		calcRange(posY.value);
	}

	/* 计算每个歌手组别的高度 如 'A'组的高度 */
	function calcHeight() {
		const groups = groupRef.value.children;
		let index = 0,
			_top = 0,
			_bottom = 0;
		for (const item of groups) {
			_top = _bottom;
			heightRange[index] = _top;
			_bottom += item.clientHeight;
			index++;
		}
	}

	/* 判断当前位置处于哪个区间 */
	function calcRange(pos) {
		for (let i = 0; i < heightRange.length - 1; i++) {
			if (pos >= heightRange[i] && pos < heightRange[i + 1]) {
				curIndex.value = i;
				diffHeight.value = heightRange[i + 1] - pos;
			} else if (pos >= heightRange[heightRange.length - 1]) {
				curIndex.value = heightRange.length - 1;
				diffHeight.value = heightRange[heightRange.length - 1] - pos;
			}
		}
	}

	/* 当前歌手组别的标签 */
	const curTag = computed(() => {
		/* 往上划的话 则让 fixed的tag标签 不显示 */
		if (posY.value <= 0) return '';
		return props.singerList[curIndex.value]
			? props.singerList[curIndex.value].tag
			: '';
	});

	/* 固定栏样式 */
	const fixedStyle = computed(() => {
		let trnasY = 0;
		/* 当滑动距离差值大于0且小于固定栏高度时 创建位移动画 */
		if (diffHeight.value > 0 && diffHeight.value < 30) {
			/* 固定栏高度是30px */
			trnasY = diffHeight.value - 30;
		}
		return {
			transform: `translateY(${trnasY}px)`,
		};
	});

	watch(
		() => props.singerList,
		() => {
			// 等待页面渲染完成后 重新计算一次区间高度
			nextTick(() => {
				calcHeight();
			});
		}
	);

	onMounted(() => {
		calcHeight();
	});

	return {
		groupRef,
		onScroll,
		curTag,
		curIndex,
		fixedStyle,
	};
}
