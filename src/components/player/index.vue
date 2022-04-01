<template>
	<div class="player" v-if="playList.length">
		<div class="normal-player" v-show="playerStyle">
			<!-- 歌曲背景图 -->
			<div class="background">
				<img :src="currentSong.al.picUrl" />
			</div>
			<!-- 顶部 -->
			<div class="top">
				<!-- 返回按钮 -->
				<div class="back">
					<i class="icon-back"></i>
				</div>
				<h1 class="title">{{ currentSong.name }}</h1>
				<h2 class="subtitle">{{ handleName(currentSong) }}</h2>
			</div>
			<!-- 中间 -->
			<div class="middle">
				<div class="middle-l">
					<!-- CD转盘 -->
					<div class="cd-wrapper playing" :style="cdStyle">
						<div class="cd">
							<img class="image" :src="currentSong.al.picUrl" />
						</div>
					</div>
					<!-- 歌词 -->
					<div class="playing-lyric-wrapper">
						<div class="playing-lyric">歌词占位</div>
					</div>
				</div>
				<!-- 全部歌词页 -->
				<!-- <div class="lyric-wrapper">
					<div ref="lyricRef">
						<p class="text">全部歌词</p>
					</div>
				</div> -->
			</div>
			<!-- 底部 -->
			<div class="bottom">
				<!-- 标识 -->
				<div class="dot-wrapper">
					<span class="dot"></span>
					<span class="dot"></span>
				</div>
				<!-- 歌曲进度条 -->
				<div class="progress-wrapper">
					<span class="time time-l">当前时间</span>
					<div class="progress-bar-wrapper"></div>
					<span class="time time-r">总时间</span>
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
						<i class="icon-favorite"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
	<audio ref="audioRef"></audio>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';
	import { useStore } from 'vuex';
	import { getSongUrl, getSongLyric } from '@/service/songApi';

	const store = useStore();
	const audioRef = ref(null);

	/****************************   Vuex   ****************************/
	const currentSong = computed(() => store.getters.currentSong);
	const playList = computed(() => store.state.playList);
	const curPlayList = computed(() => store.state.curPlayList);
	const curPlayIndex = computed(() => store.state.curPlayIndex);
	const playState = computed(() => store.state.playState);
	const playMode = computed(() => store.state.playMode);
	const playerStyle = computed(() => store.state.playerStyle);
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

	/* 播放模式图标 */
	const modeIcon = computed(() => {
		const mode = playMode.value;
		switch (mode) {
			case 0:
				return 'icon-sequence';
			case 1:
				return 'icon-loop';
			case 2:
				return 'icon-random';
		}
	});

	/* 监视当前歌曲是否存在 或 是否被修改 */
	watch(currentSong, async (newSong) => {
		if (!newSong) return;
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
			audio.play();
			store.commit('setPlayState', 1);
		}
	});

	/* 监视播放状态 */
	watch(playState, (newState) => {
		let audio = audioRef.value;
		if (newState) {
			audio.play();
		} else {
			audio.pause();
		}
	});

	/* 处理歌曲作者名 */
	function handleName(item) {
		const ar = item.ar;
		return ar.map((artist) => artist.name).join(' / ');
	}

	/* 切换播放状态 */
	function togglePlay() {
		store.commit('setPlayState', !playState.value);
	}

	/* 切换播放模式 */
	function toggleMode() {
		// 0 => 1 => 2 => 0
		const mode = (playMode.value + 1) % 3;
		store.commit('setPlayMode', mode);
	}

	/* 循环播放 */
	function loop() {
		const audio = audioRef.value;
		audio.currentTime = 0; // 重头播放 时间清零
		audio.play();
		store.commit('curPlayState', 1);
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

	/*  */
	/*  */
	/*  */
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
				margin-bottom: 25px;

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
					width: 70%;
					margin: 0 auto;
					line-height: 40px;
					text-align: center;
					@include no-wrap();
					font-size: $font-size-large;
					color: $color-text;
				}

				.subtitle {
					line-height: 20px;
					text-align: center;
					font-size: $font-size-medium;
					color: $color-text;
				}
			}

			// 中间
			.middle {
				position: fixed;
				width: 100%;
				top: 80px;
				bottom: 170px;
				white-space: nowrap;
				font-size: 0;

				.middle-l {
					display: inline-block;
					vertical-align: top;
					position: relative;
					width: 100%;
					height: 0;
					padding-top: 80%;

					// CD转盘
					.cd-wrapper {
						position: absolute;
						left: 10%;
						top: 0;
						width: 80%;
						box-sizing: border-box;
						height: 100%;
						overflow: hidden;
						height: 100%;
						border-radius: 50%;
						border: 10px solid rgba(255, 255, 255, 0.1);

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
						margin: 30px auto 0 auto;
						overflow: hidden;
						text-align: center;

						.playing-lyric {
							height: 20px;
							line-height: 20px;
							font-size: $font-size-medium;
							color: $color-text-l;
						}
					}
				}

				.middle-r {
					display: inline-block;
					vertical-align: top;
					width: 100%;
					height: 100%;
					overflow: hidden;

					// 全部歌词
					.lyric-wrapper {
						width: 80%;
						margin: 0 auto;
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
