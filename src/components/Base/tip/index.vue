<template>
	<!-- <teleport to="body"> -->
	<transition name="msg-fade">
		<div
			class="message"
			:class="[`message-${type}`, { 'is-plain': plain, 'is-round': round }]"
			:style="centered"
		>
			<i :class="[`icon-${type}`]"></i>
			<span><slot></slot></span>
			<i :class="{ 'icon-info-close': closed }"></i>
		</div>
	</transition>
	<!-- </teleport> -->
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		type: {
			type: String,
			default: 'info',
		},
		plain: {
			type: Boolean,
			default: false,
		},
		round: {
			type: Boolean,
			default: false,
		},
		closed: {
			type: Boolean,
			default: false,
		},
		center: {
			type: Boolean,
			default: false,
		},
	});

	const centered = computed(() => {
		return {
			textAlign: props.center ? 'center' : 'left',
		};
	});

	function show() {
		console.log(1);
	}

	defineExpose({
		show,
	});
</script>

<style lang="scss" scoped>
	.message {
		position: relative;
		width: 140px;
		height: 34px;
		line-height: 34px;
		margin: 20px auto 0;
		padding: 0 12px;
		line-height: 34px;
		border-radius: 6px;

		i {
			vertical-align: -1px;
		}

		span {
			flex: 1;
			padding-left: 10px;
			font-size: $font-size-small;
		}

		&.is-round {
			border-radius: 20px;
		}

		&.msg-fade-enter-from,
		&.msg-fade-leave-to {
			opacity: 0;
			transform: translate3d(0, -100%, 0);
		}

		&.msg-fade-enter-active,
		&.msg-fade-leave-active {
			opacity: 1;
			transform: translate3d(0, 0, 0);
			transition: all 0.5s;
		}
	}

	.message-info {
		color: #fff;
		background-color: #909399;

		&.is-plain {
			color: #909399;
			background-color: #d9d9e1;
		}
	}

	.message-success {
		color: #fff;
		background-color: #73c749;

		&.is-plain {
			color: #67c23a;
			background-color: #d8eace;
		}
	}

	.message-warn {
		color: #fff;
		background-color: #ffb950;

		&.is-plain {
			color: #e6a23c;
			background-color: #fae8d0;
		}
	}

	.message-error {
		color: #fff;
		background-color: #f56c6c;

		&.is-plain {
			color: #f56c6c;
			background-color: #f4d8d8;
		}
	}

	.icon-info-close {
		position: absolute;
		top: 50%;
		right: 8px;
		padding: 4px;
		transform: translate(0, -50%);
	}
</style>
