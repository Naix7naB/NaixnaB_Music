<template>
	<transition name="list-fade">
		<div class="mini-list" v-show="visible">
			<div class="list-wrapper">
				<!-- 列表头部 -->
				<div class="list-header">
					<h1 class="title">
						<!-- 播放模式 -->
						<div class="mode" @click="toggleMode">
							<i class="icon" :class="modeIcon"></i>
							<span class="text">{{ modeText }}</span>
						</div>
						<!-- 清空列表 -->
						<span class="clear" @click="clearList">
							<i class="icon-clear"></i>
						</span>
					</h1>
				</div>
				<!-- 列表歌曲 -->
				<Scroll class="list-content" ref="listScrollRef" :probeType="2">
					<ul ref="listRef" @click="playSong">
						<li
							class="item"
							v-for="(song, index) in playList"
							:key="song.id"
							:data-index="index"
						>
							<i class="current" :class="curPlayIcon(song)"></i>
							<span class="text">{{ song.name }}</span>
							<span class="favorite" @click.stop="toggleFavorite(song)">
								<i :class="favoriteIcon(song)"></i>
							</span>
							<span class="delete" @click.stop="removeSong(song)">
								<i class="icon-delete"></i>
							</span>
						</li>
					</ul>
				</Scroll>
				<div class="list-footer" @click="hide">
					<span>关闭</span>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';
	import { useStore } from 'vuex';
	import Mode from '@/components/player/mode';
	import Favorite from '@/components/player/favorite';
	import Scroll from '@/components/base/scroll';

	const store = useStore();
	const listScrollRef = ref(null);
	const listRef = ref(null);
	const visible = ref(false);
	/* 节流阀 */
	const flag = ref(true);

	const currentSong = computed(() => store.getters.currentSong);
	const curPlayList = computed(() => store.state.curPlayList);
	const playList = computed(() => store.state.playList);

	const { modeIcon, modeText, toggleMode } = Mode();
	const { favoriteIcon, toggleFavorite } = Favorite();

	watch(currentSong, (newSong) => {
		if (!newSong.id || !visible.value) return;
		scrollToCurSong();
	});

	/* 正在播放图标 */
	function curPlayIcon(song) {
		if (song.id === currentSong.value.id) {
			return 'icon-play';
		}
	}

	/* 点击播放列表歌曲 */
	function playSong(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.index;
		store.commit('setCurPlayIndex', index);
		scrollToCurSong();
	}

	/* 滚动到当前播放歌曲 */
	function scrollToCurSong() {
		const song = currentSong.value;
		const index = curPlayList.value.findIndex((item) => item.id === song.id);
		const target = listRef.value.children[index];
		listScrollRef.value.scroll.scrollToElement(target, 500);
	}

	/* 删除一首歌曲 */
	function removeSong(song) {
		if (!flag.value) return;
		flag.value = false;
		store.dispatch('removeSong', song);
		/* 等待 1.5s 开启节流阀 */
		setTimeout(() => {
			flag.value = true;
		}, 1500);
	}

	/* 清空播放列表 */
	function clearList() {
		store.dispatch('clearSongList');
	}

	/* 展示 mini歌单列表 */
	function show() {
		visible.value = true;
	}

	/* 隐藏 mini歌单列表 */
	function hide() {
		visible.value = false;
	}

	defineExpose({
		show,
		hide,
	});
</script>

<style lang="scss" scoped>
	.mini-list {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 200;
		background-color: $color-background-d;

		&.list-fade-enter-active,
		&.list-fade-leave-active {
			transition: opacity 0.3s;

			.list-wrapper {
				transition: all 0.3s;
			}
		}

		&.list-fade-enter-from,
		&.list-fade-leave-to {
			// 进入的起点  离开的终点
			opacity: 0;

			.list-wrapper {
				transform: translate(0, 100%);
			}
		}

		.list-wrapper {
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 210;
			width: 100%;
			background-color: $color-highlight-background;

			.list-header {
				position: relative;
				padding: 20px 30px 10px 20px;

				.title {
					display: flex;
					align-items: center;

					.mode {
						display: flex;
						align-items: center;

						.icon {
							margin-right: 10px;
							font-size: 24px;
							color: $color-theme-d;
						}

						.text {
							font-size: $font-size-medium;
							color: $color-text-l;
						}
					}

					.clear {
						flex: 1;
						text-align: right;
						@include extend-click();

						.icon-clear {
							font-size: $font-size-medium;
							color: $color-text-d;
						}
					}
				}
			}

			.list-content {
				max-height: 280px;
				overflow: hidden;

				.item {
					display: flex;
					align-items: center;
					height: 40px;
					padding: 0 30px 0 20px;
					overflow: hidden;

					.current {
						flex: 0 0 20px;
						width: 20px;
						font-size: $font-size-small;
						color: $color-theme-d;
					}

					.text {
						flex: 1;
						@include no-wrap();
						font-size: $font-size-medium;
						color: $color-text-l;
					}

					.favorite {
						@include extend-click();
						margin-right: 15px;
						font-size: $font-size-small;
						color: $color-theme;

						.icon-favorite {
							color: $color-sub-theme;
						}
					}

					.delete {
						@include extend-click();
						font-size: $font-size-small;
						color: $color-theme;

						&.disable {
							color: $color-theme-d;
						}
					}
				}
			}

			.list-add {
				width: 140px;
				margin: 20px auto 30px auto;

				.add {
					display: flex;
					align-items: center;
					padding: 8px 16px;
					border: 1px solid $color-text-l;
					border-radius: 100px;
					color: $color-text-l;

					.icon-add {
						margin-right: 5px;
						font-size: $font-size-small-s;
					}

					.text {
						font-size: $font-size-small;
					}
				}
			}

			.list-footer {
				text-align: center;
				line-height: 60px;
				background: $color-background;
				font-size: $font-size-medium-x;
				color: $color-text-l;
			}
		}
	}
</style>
