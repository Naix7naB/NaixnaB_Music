<template>
	<div class="player" v-if="playList.length">
		<transition name="normal">
			<!-- 全屏播放器 -->
			<div class="normal-player" v-show="playerStyle">
				<!-- 歌曲背景图 -->
				<div class="background">
					<img :src="currentSong.al.picUrl" />
				</div>
				<!-- 顶部 -->
				<div class="top">
					<!-- 返回按钮 -->
					<div class="back" @click="hide">
						<i class="icon-back"></i>
					</div>
					<h1 class="title">{{ currentSong.name }}</h1>
					<h2 class="subtitle">{{ handleName(currentSong) }}</h2>
				</div>
				<!-- 中间 -->
				<div class="middle" @click="toggleMiddle">
					<div class="middle-l" :style="middleLStyle">
						<!-- CD转盘 -->
						<div class="cd-wrapper playing" :style="cdStyle">
							<div class="cd">
								<img class="image" :src="currentSong.al.picUrl" />
							</div>
						</div>
						<!-- 歌词 -->
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">{{ curLyric }}</div>
							<div class="check-more">点击查看全部歌词</div>
						</div>
					</div>
					<Scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
						<!-- 全部歌词页 -->
						<div class="lyric-wrapper">
							<div ref="lyricRef">
								<p
									class="text"
									v-for="(item, index) in lyric"
									:key="index"
									:class="{ current: curLyricIndex === index }"
								>
									{{ item.content }}
								</p>
							</div>
						</div>
					</Scroll>
				</div>
				<!-- 底部 -->
				<div class="bottom">
					<!-- 标识 -->
					<!-- <div class="dot-wrapper">
						<span class="dot"></span>
						<span class="dot"></span>
					</div> -->
					<!-- 歌曲进度条 -->
					<div class="progress-wrapper">
						<span class="time time-l">{{ formatTime(curTime) }}</span>
						<div class="progress-bar-wrapper">
							<ProgressBar
								:progress="progress"
								@progressChanging="progressChanging"
								@progressChanged="progressChanged"
							></ProgressBar>
						</div>
						<span class="time time-r">{{ formatTime(durTime) }}</span>
					</div>
					<!-- 操作栏 -->
					<div class="operators">
						<div class="icon i-left">
							<i :class="modeIcon" @click="toggleMode"></i>
						</div>
						<div class="icon i-left">
							<i class="icon-prev" @click="prev"></i>
						</div>
						<div class="icon i-center">
							<i :class="playIcon" @click="togglePlay"></i>
						</div>
						<div class="icon i-right">
							<i class="icon-next" @click="next"></i>
						</div>
						<div class="icon i-right">
							<i
								:class="favoriteIcon(currentSong)"
								@click="toggleFavorite(currentSong)"
							></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<!-- mini播放器 -->
		<MiniPlayer
			:playerStyle="playerStyle"
			:cdStyle="cdStyle"
			:progress="progress"
			:togglePlay="togglePlay"
			@slidePrev="prev"
			@slideNext="next"
		></MiniPlayer>
	</div>
	<!-- 真实播放器 -->
	<audio
		ref="audioRef"
		@timeupdate="updateTime"
		@canplay="ready"
		@ended="end"
	></audio>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';
	import { useStore } from 'vuex';
	import { getSongUrl } from '@/service/song';
	import { handleName, formatTime } from '@/plugins/utils';
	import Mode from './mode';
	import Favorite from './favorite';
	import Middle from './middle';
	import Lyric from './lyric';
	import Scroll from '@/components/base/scroll';
	import ProgressBar from './components/progressBar';
	import MiniPlayer from './components/miniPlayer';

	const store = useStore();
	const audioRef = ref(null);
	/* 歌曲当前时间 */
	const curTime = ref(0);
	/* 歌曲总时长 */
	const durTime = ref(0);
	/* 进度条拖动状态 */
	const changeState = ref(false);

	/****************************   Vuex   ****************************/
	const currentSong = computed(() => store.getters.currentSong);
	const playList = computed(() => store.state.playList);
	const curPlayList = computed(() => store.state.curPlayList);
	const curPlayIndex = computed(() => store.state.curPlayIndex);
	const playState = computed(() => store.state.playState);
	const playMode = computed(() => store.state.playMode);
	const playerStyle = computed(() => store.state.playerStyle);
	/******************************************************************/

	/***************************   Hooks   ****************************/
	const { modeIcon, toggleMode } = Mode();
	const { favoriteIcon, toggleFavorite } = Favorite();
	const { toggleMiddle, middleLStyle, middleRStyle } = Middle();
	const {
		lyric,
		curLyric,
		curLyricIndex,
		play,
		stop,
		lyricScrollRef,
		lyricRef,
	} = Lyric(curTime);
	/******************************************************************/

	/* CD转盘动画 */
	const cdStyle = computed(() => {
		return {
			animationPlayState: playState.value ? 'running' : 'paused',
		};
	});

	/* 播放/暂停 图标 */
	const playIcon = computed(() => {
		return playState.value ? 'icon-pause' : 'icon-play';
	});

	/* 进度条时间比例 */
	const progress = computed(() => {
		if (!audioRef.value) return;
		return curTime.value / durTime.value;
	});

	/* 监视当前歌曲是否存在 或 是否被修改 */
	watch(currentSong, async (newSong) => {
		if (!newSong.id) return;
		/* 先让上一首歌暂停 */
		store.commit('setPlayState', 0);
		const { data } = await getSongUrl(newSong);
		const url = data[0].url;
		let playListVal = playList.value.slice();
		let curPlayListVal = curPlayList.value.slice();
		if (!url) {
			// 如果请求失败 把这首歌 从播放列表中移除 播放下一首歌
			let srcInd = playListVal.findIndex((item) => item.id === newSong.id);
			let curInd = curPlayListVal.findIndex((item) => item.id === newSong.id);
			playListVal.splice(srcInd, 1);
			curPlayListVal.splice(curInd, 1);
			// 修改vuex中的数据状态
			store.commit('setPlayList', playListVal);
			store.commit('setCurPlayList', curPlayListVal);
			// 如果请求不到url的歌 是最后一首
			store.commit(
				'setCurPlayIndex',
				curInd === curPlayListVal.length ? 0 : curInd
			);
			return;
		} else {
			// 请求成功
			let audio = audioRef.value;
			audio.src = url;
			store.commit('setPlayState', 1);
		}
	});

	/* 监视播放状态 */
	watch(playState, (newState) => {
		let audio = audioRef.value;
		if (newState) {
			audio.play();
			stop();
			play();
		} else {
			audio.pause();
			stop();
		}
	});

	/* 监视播放器类型 */
	watch(playerStyle, (newStyle) => {
		newStyle ? play() : stop();
	});

	/* 隐藏全屏播放器 */
	function hide() {
		store.commit('setPlayerStyle', 0);
	}

	/* 切换播放状态 */
	function togglePlay() {
		store.commit('setPlayState', !playState.value);
	}

	/* 循环播放 */
	function loop() {
		const audio = audioRef.value;
		/* 重头播放 时间清零 */
		audio.currentTime = curTime.value = 0;
		audio.play();
		store.commit('setPlayState', 1);
		stop();
		play();
	}

	/* 上一首 */
	function prev() {
		const list = curPlayList.value;
		if (!list.length) return; // 播放列表没有歌曲时
		if (list.length === 1) return loop(); // 播放列表只有一首歌时
		let index = curPlayIndex.value - 1;
		if (index < 0) {
			// 当前歌曲是第一首时
			index = list.length - 1;
		}
		store.commit('setCurPlayIndex', index);
	}

	/* 下一首 */
	function next() {
		const list = curPlayList.value;
		if (!list.length) return; // 播放列表没有歌曲时
		if (list.length === 1) return loop(); // 播放列表只有一首歌时
		let index = curPlayIndex.value + 1;
		if (index === list.length) {
			// 当前歌曲是最后一首时
			index = 0;
		}
		store.commit('setCurPlayIndex', index);
	}

	/* 歌曲能够播放时 */
	function ready() {
		durTime.value = audioRef.value.duration;
	}

	/* 歌曲播放结束 */
	function end() {
		/* 让歌曲的播放状态设置为暂停 */
		store.commit('setPlayState', 0);
		if (playMode.value === 1) {
			/* 当前播放模式为单曲循环 */
			loop();
		} else {
			next();
		}
	}

	/* 更新进度条时间 */
	function updateTime() {
		/* 正在拖动进度条 */
		if (changeState.value) return;
		curTime.value = audioRef.value.currentTime;
	}

	/* 进度值正在拖动 */
	function progressChanging(progress) {
		stop();
		changeState.value = true;
		curTime.value = progress * durTime.value;
	}

	/* 进度值拖动完毕 */
	function progressChanged(progress) {
		changeState.value = false;
		audioRef.value.currentTime = curTime.value = progress * durTime.value;
		stop();
		play();
	}
</script>

<style lang="scss" scoped>
	.player {
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;

		.normal-player {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 150;
			background: $color-background;

			// 歌曲背景图
			.background {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: -1;
				opacity: 0.6;
				filter: blur(20px);

				img {
					height: 100%;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}

			// 顶部
			.top {
				position: relative;
				margin-bottom: 50px;

				// 返回按钮
				.back {
					position: absolute;
					top: 0;
					left: 6px;
					z-index: 50;

					.icon-back {
						display: block;
						padding: 9px;
						font-size: $font-size-large-x;
						color: $color-theme;
						transform: rotate(-90deg);
					}
				}

				.title {
					width: 60%;
					margin: 0 auto;
					line-height: 40px;
					text-align: center;
					@include no-wrap();
					font-size: $font-size-large;
					color: $color-text;
				}

				.subtitle {
					width: 70%;
					margin: 0 auto;
					line-height: 20px;
					text-align: center;
					@include no-wrap();
					font-size: $font-size-medium;
					color: $color-text;
				}
			}

			// 中间
			.middle {
				position: fixed;
				width: 100%;
				top: 120px;
				bottom: 170px;
				white-space: nowrap;
				font-size: 0;

				.middle-l {
					vertical-align: top;
					position: absolute;
					width: 100%;
					height: 0;
					padding-top: 80%;
					transition: all 0.4s ease-out;

					// CD转盘
					.cd-wrapper {
						position: absolute;
						left: 10%;
						top: 0;
						width: 80%;
						height: 100%;
						overflow: hidden;
						border-radius: 50%;
						border: 10px solid rgba(255, 255, 255, 0.1);
						box-sizing: border-box;

						&.playing {
							animation: rotate 30s linear infinite;
						}

						.cd {
							width: 100%;

							img {
								position: absolute;
								left: 50%;
								top: 50%;
								height: 100%;
								box-sizing: border-box;
								transform: translate(-50%, -50%);
							}
						}
					}

					// 歌词
					.playing-lyric-wrapper {
						width: 80%;
						line-height: 20px;
						margin: 20px auto 0;
						overflow: hidden;
						text-align: center;
						color: $color-text-l;
						font-size: $font-size-medium;

						.playing-lyric {
							@include no-wrap();
						}

						.check-more {
							margin-top: 10px;
							text-decoration: underline;
						}
					}
				}

				.middle-r {
					opacity: 0;
					vertical-align: top;
					position: absolute;
					width: 100%;
					height: 100%;
					overflow: hidden;
					transition: all 0.4s ease-out;

					// 全部歌词
					.lyric-wrapper {
						width: 66%;
						margin: 0 auto;
						white-space: pre-wrap;
						overflow: hidden;
						text-align: center;

						.text {
							line-height: 32px;
							color: $color-text-l;
							font-size: $font-size-medium;

							&.current {
								color: $color-text;
							}
						}

						.pure-music {
							padding-top: 50%;
							line-height: 32px;
							color: $color-text-l;
							font-size: $font-size-medium;
						}
					}
				}
			}

			// 底部
			.bottom {
				position: absolute;
				bottom: 50px;
				width: 100%;

				// 标识
				.dot-wrapper {
					text-align: center;
					font-size: 0;

					.dot {
						display: inline-block;
						vertical-align: middle;
						margin: 0 4px;
						width: 8px;
						height: 8px;
						border-radius: 50%;
						background: $color-text-l;

						&.active {
							width: 20px;
							border-radius: 5px;
							background: $color-text-ll;
						}
					}
				}

				// 歌曲进度条
				.progress-wrapper {
					display: flex;
					align-items: center;
					width: 80%;
					margin: 0px auto;
					padding: 10px 0;

					.time {
						color: $color-text;
						font-size: $font-size-small;
						flex: 0 0 40px;
						line-height: 30px;
						width: 40px;

						&.time-l {
							text-align: left;
						}

						&.time-r {
							text-align: right;
						}
					}

					.progress-bar-wrapper {
						flex: 1;
					}
				}

				// 操作栏
				.operators {
					display: flex;
					align-items: center;

					.icon {
						flex: 1;
						color: $color-theme;

						&.disable {
							color: $color-theme-d;
						}

						i {
							font-size: 30px;
						}
					}

					.i-left {
						text-align: right;
					}

					.i-center {
						padding: 0 20px;
						text-align: center;
						i {
							font-size: 40px;
						}
					}

					.i-right {
						text-align: left;
					}

					.icon-favorite {
						color: $color-theme;
					}
				}
			}

			&.normal-enter-active,
			&.normal-leave-active {
				transition: all 0.6s;

				.middle-l,
				.top,
				.bottom {
					transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
				}
			}

			&.normal-enter-from,
			&.normal-leave-to {
				opacity: 0;

				.top {
					transform: translate3d(0, -100px, 0);
				}

				.bottom {
					transform: translate3d(0, 100px, 0);
				}

				.middle-l {
					transform: scale(0);
				}
			}
		}
	}
</style>
