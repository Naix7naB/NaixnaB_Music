<template>
	<div class="switch">
		<ul class="switch-wrapper">
			<li
				class="switch-item"
				v-for="(item, index) in text"
				:key="index"
				:class="{ active: modelValue === index }"
				@click="onSwitch(index)"
			>
				{{ item }}
			</li>
		</ul>
		<div class="active-bar" :style="activeStyle"></div>
	</div>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		text: {
			type: Array,
			default: [],
		},
		modelValue: {
			type: Number,
			default: 0,
		},
	});
	const emit = defineEmits(['update:modelValue']);

	const activeStyle = computed(() => {
		return {
			transform: `translateX(${props.modelValue * 130}px)`,
		};
	});

	/* 切换 */
	function onSwitch(index) {
		emit('update:modelValue', index);
	}
</script>

<style scoped lang="scss">
	.switch {
		position: relative;
		width: 280px;
		margin: 0 auto;

		.switch-wrapper {
			display: flex;
			border: 1px solid $color-highlight-background;
			border-radius: 20px;
			align-items: center;
			padding: 0 10px;

			.switch-item {
				position: relative;
				z-index: 10;
				flex: 1;
				height: 34px;
				line-height: 34px;
				text-align: center;
				font-size: $font-size-medium-x;
				color: $color-text-d;

				&.active {
					color: $color-text;
				}
			}
		}

		.active-bar {
			position: absolute;
			left: 0;
			top: 1px;
			width: calc(50% + 10px);
			height: 34px;
			transition: transform 0.3s;
			border-radius: 20px;
			background: $color-highlight-background;
		}
	}
</style>
