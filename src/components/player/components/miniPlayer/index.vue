<template>
	<transition name="mini">
		<!-- mini播放器 -->
		<div class="mini-player" v-show="!playerStyle" @click="showFull">
			<!-- 左边歌曲信息 -->
			<div
				ref="itemRef"
				class="mini-player-l"
				:style="miniSlideStyle"
				@touchstart="touchSlideStart"
				@touchmove="touchSlideMove"
				@touchend="touchSlideEnd"
			>
				<div
					class="item"
					v-for="(song, idx) in songList"
					:key="idx"
					:class="handleClassName(idx)"
				>
					<!-- CD转盘 歌曲图片 -->
					<div class="cd-wrapper">
						<div class="cd" :style="cdStyle">
							<img :src="song.al.picUrl" />
						</div>
					</div>
					<!-- 歌曲信息 -->
					<div class="slider-wrapper">
						<h2 class="name">{{ song.name }}</h2>
						<p class="desc">{{ handleName(song) }}</p>
					</div>
				</div>
			</div>
			<!-- 右边控制器 -->
			<div class="mini-player-r">
				<!-- 播放按钮 进度条 -->
				<div class="control">
					<ProgressCircle :radius="32" :progress="progress">
						<i
							class="icon-mini"
							:class="playIconMini"
							@click.stop="togglePlay"
						></i>
					</ProgressCircle>
				</div>
				<!-- 歌曲播放列表 -->
				<div class="control" @click.stop="showMiniList">
					<i class="icon-playlist"></i>
				</div>
			</div>
			<!-- mini 播放列表 -->
			<MiniList ref="miniListRef"></MiniList>
		</div>
	</transition>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { useStore } from 'vuex';
	import { handleName } from '@/utils';
	import MiniSlide from './miniSlide';
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
	const emit = defineEmits(['slidePrev', 'slideNext']);

	const miniListRef = ref(null);

	const playState = computed(() => store.state.playState);

	const {
		itemRef,
		miniSlideStyle,
		songList,
		touchSlideStart,
		touchSlideMove,
		touchSlideEnd,
	} = MiniSlide(emit);

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

	/*  */
	function handleClassName(idx) {
		if (songList.value.length < 3) {
			return {
				middle: true,
			};
		} else {
			return {
				left: idx === 0,
				middle: idx === 1,
				right: idx === 2,
			};
		}
	}
</script>

<style lang="scss" scoped>
	.mini-player {
		display: flex;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 180;
		width: 100%;
		height: 60px;
		background: $color-highlight-background;

		.mini-player-l {
			flex: 1;
			position: relative;

			.item {
				display: flex;
				align-items: center;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				.cd-wrapper {
					width: 40px;
					height: 40px;
					padding: 0 16px 0 20px;

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

				&.left {
					transform: translateX(-100%);
				}

				&.middle {
					transform: translateX(0);
				}

				&.right {
					transform: translateX(100%);
				}
			}
		}

		.mini-player-r {
			z-index: 99;
			display: flex;
			justify-content: center;
			align-items: center;
			background: $color-highlight-background;

			.control {
				width: 30px;
				padding: 0 10px;

				.icon-playlist {
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
