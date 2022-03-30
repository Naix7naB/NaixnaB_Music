<template>
	<div ref="scrollRef">
		<slot></slot>
	</div>
</template>

<script setup>
	import { useScroll } from './useScroll';

	// 这里有个坑  better-scroll插件 默认会阻止浏览器原生的 click事件
	// 把 click属性 设置为true 浏览器的 click事件才会生效
	const props = defineProps({
		probeType: {
			type: Number,
			default: 1,
		},
		click: {
			type: Boolean,
			default: true,
		},
	});
	const emit = defineEmits(['onScroll']);
	const { scrollRef, scroll } = useScroll(props, emit);

	defineExpose({
		scroll,
	});
</script>
