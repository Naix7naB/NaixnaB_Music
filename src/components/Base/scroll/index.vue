<template>
	<div ref="scrollRef">
		<slot></slot>
	</div>
</template>

<script setup>
	import { scrollAni } from './scroll';

	const props = defineProps({
		probeType: {
			type: Number,
			default: 1,
		},
	});
	const { scrollRef } = scrollAni(props);
</script>
