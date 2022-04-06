<template>
	<transition name="mini">
		<!-- mini播放器 -->
		<div class="mini-player" v-show="!playerStyle">
			<!-- CD转盘 歌曲图片 -->
			<div class="cd-wrapper" @click="showFull">
				<div class="cd" :style="cdStyle">
					<img :src="currentSong.al.picUrl" />
				</div>
			</div>
			<!-- 歌曲信息 -->
			<div class="slider-wrapper" @click="showFull">
				<h2 class="name">{{ currentSong.name }}</h2>
				<p class="desc">{{ handleName(currentSong) }}</p>
			</div>
			<!-- 播放按钮 进度条 -->
			<div class="control">
				<ProgressCircle :radius="32" :progress="progress">
					<i class="icon-mini" :class="playIconMini" @click="togglePlay"></i>
				</ProgressCircle>
			</div>
			<!-- 歌曲播放列表 -->
			<div class="control" @click="showMiniList">
				<i class="icon-playlist"></i>
			</div>
			<MiniList ref="miniListRef"></MiniList>
		</div>
	</transition>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { useStore } from 'vuex';
	import { handleName } from '@/utils';
	import ProgressCircle from '../progressCircle';
	import MiniList from '../miniList';

	const store = useStore();
	const props = defineProps({
		playerStyle: {
			type: Number,
			default: 1,
		},
		cdStyle: {
			type: Object,
			default: {},
		},
		progress: {
			type: Number,
			default: 0,
		},
		togglePlay: Function,
	});

	const miniListRef = ref(null);
	const currentSong = computed(() => store.getters.currentSong);
	const playState = computed(() => store.state.playState);

	/* mini 播放/暂停 图标 */
	const playIconMini = computed(() => {
		return playState.value ? 'icon-pause-mini' : 'icon-play-mini';
	});

	/* 展示全屏播放器 */
	function showFull() {
		store.commit('setPlayerStyle', 1);
	}

	/* 展示 mini播放列表 */
	function showMiniList() {
		miniListRef.value.show();
	}
</script>

<style lang="scss" scoped>
	.mini-player {
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 180;
		width: 100%;
		height: 60px;
		background: $color-highlight-background;

		.cd-wrapper {
			flex: 0 0 40px;
			width: 40px;
			height: 40px;
			padding: 0 10px 0 20px;

			.cd {
				position: relative;
				height: 100%;
				width: 100%;
				animation: rotate 40s linear infinite;
				overflow: hidden;
				border-radius: 50%;

				img {
					position: absolute;
					width: 130%;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}

		.slider-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			line-height: 20px;
			overflow: hidden;

			.name {
				margin-bottom: 2px;
				@include no-wrap();
				font-size: $font-size-medium;
				color: $color-text;
			}

			.desc {
				@include no-wrap();
				font-size: $font-size-small;
				color: $color-text-d;
			}
		}

		.control {
			flex: 0 0 30px;
			width: 30px;
			padding: 0 10px;

			.icon-playlist {
				position: relative;
				top: -2px;
				font-size: 28px;
				color: $color-theme-d;
			}

			.icon-mini {
				position: absolute;
				left: 0;
				top: 0;
				color: $color-theme-d;
				font-size: 32px;
			}
		}

		&.mini-enter-active,
		&.mini-leave-active {
			transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
		}

		&.mini-enter-from,
		&.mini-leave-to {
			opacity: 0;
			transform: translate3d(0, 100%, 0);
		}
	}
</style>
