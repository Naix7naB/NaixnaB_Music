<template>
	<div class="daily">
		<!-- 背景 -->
		<div class="bg"></div>
		<!-- 日期 历史日推 -->
		<div class="daily-lable">
			<!-- 日期 -->
			<div class="lable-date">
				<span class="date">{{ getCurDate().date }}</span>
				<span class="mouth"> / {{ getCurDate().mouth }}</span>
			</div>
			<!-- 历史日推 -->
			<div class="lable-history">历史日推</div>
		</div>
		<!-- 歌曲列表 -->
		<div class="daily-content" :style="contentStyle">
			<!-- 头部 -->
			<div class="list-top">
				<div class="icon"><i class="icon-play-fill"></i></div>
				<span class="txt">播放全部</span>
				<span class="num">({{ songs.length }})</span>
			</div>
			<!-- 歌曲 -->
			<Scroll class="scroll-wrapper" :probeType="3" @onScroll="onScroll">
				<div class="list-wrapper" v-load="isLoading">
					<ul class="list" @click.stop="playSong">
						<li
							class="item"
							v-for="(item, index) in songs"
							:key="item.id"
							:data-index="index"
						>
							<div class="image">
								<img v-img-lazy="item.al.picUrl" />
							</div>
							<div class="detail">
								<h2 class="name">{{ item.name }}</h2>
								<p class="desc">{{ handleName(item) }}</p>
							</div>
							<div class="icon"><i class="icon-bofang"></i></div>
						</li>
					</ul>
				</div>
			</Scroll>
		</div>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useStore } from 'vuex';
	import { getDailySongs } from '@/service/recommend';
	import { handleName } from '@/plugins/utils';
	import Scroll from '@/components/base/scroll';

	const store = useStore();

	const scrollY = ref(0);

	const songs = ref([]);
	const reason = ref([]);
	const isLoading = ref(true);
	const _style = {
		zIndex: 0,
		background: 'rgba(0,0,0,0)',
		backdropFilter: 'blur(0px)',
	};

	const playList = computed(() => store.state.playList);

	/* 获取当前日期 */
	function getCurDate() {
		const now = new Date();
		const date = (now.getDate() + '').padStart(2, '0');
		const mouth = (now.getMonth() + 1 + '').padStart(2, '0');
		return {
			date,
			mouth,
		};
	}

	/* 歌曲列表滚动事件 */
	function onScroll(pos) {
		scrollY.value = -pos.y;
	}

	/* 滚动样式 */
	const contentStyle = computed(() => {
		return {
			bottom: playList.value.length ? '60px' : 0,
		};
	});

	/* 点击歌单中的歌曲 播放歌曲 并把歌单的歌曲添加到播放列表中 */
	function playSong(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.index / 1;
		if (!playList.value.length || playList.value !== songs) {
			/* 当播放列表没有歌曲时 或 当前播放列表跟当前点击的歌曲所在的歌单不一致时(歌单与歌单之间) */
			store.dispatch('addWholeList', songs);
		}
		/* 处理是随机播放时的情况 */
		store.dispatch('getCurPlayIndex', index);
	}

	onMounted(async () => {
		const { dailySongs, reasons } = await getDailySongs();
		reason.value = reasons;
		songs.value = dailySongs;
		isLoading.value = false;
	});

	defineExpose({
		_style,
	});
</script>

<style lang="scss" scoped>
	.daily {
		z-index: -1;
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;

		.bg {
			height: 0;
			padding-top: 175px;
			background: rgba(0, 0, 0, 0.4);
			backdrop-filter: blur(2px);
		}

		.daily-lable {
			display: flex;
			position: absolute;
			align-items: center;
			top: 50px;
			left: 0;
			right: 0;
			padding: 0 20px;

			.lable-date {
				flex: 1;

				.date {
					font-size: 42px;
					font-weight: 700;
				}

				.mouth {
					font-size: $font-size-medium-x;
					font-weight: 600;
				}
			}

			.lable-history {
				width: 90px;
				height: 24px;
				line-height: 24px;
				text-align: center;
				border-radius: 20px;
				font-size: $font-size-medium;
				background: rgba(188, 188, 215, 0.8);
			}
		}

		.daily-content {
			position: fixed;
			top: 100px;
			bottom: 0;
			width: 100%;
			border-top-left-radius: 30px;
			border-top-right-radius: 30px;
			background: rgba(69, 65, 65, 0.3);
			backdrop-filter: blur(2px);

			.list-top {
				display: flex;
				align-items: center;
				line-height: 30px;
				padding: 10px 20px;

				.icon {
					width: 20px;
					height: 20px;
					border-radius: 50%;
					background: rgba(209, 182, 147, 0.8);
					text-align: center;

					.icon-play-fill {
						font-size: $font-size-small-s;
						vertical-align: 6px;
					}
				}

				.txt {
					padding-left: 10px;
					font-size: $font-size-medium-x;
				}

				.num {
					margin-left: 6px;
					font-size: $font-size-small;
					color: $color-text-l;
				}
			}

			.scroll-wrapper {
				position: absolute;
				top: 50px;
				bottom: 0;
				width: 100%;
				overflow: hidden;

				.list-wrapper {
					min-height: 350px;

					.list {
						padding: 10px 20px;

						.item {
							display: flex;
							align-items: center;
							margin-bottom: 20px;

							&:last-child {
								margin-bottom: 0;
							}

							.image {
								flex: 0 0 50px;
								height: 50px;
								border-radius: 10px;
								overflow: hidden;

								img {
									width: 100%;
									height: 100%;
								}
							}

							.detail {
								flex: 1;
								padding: 0 16px;
								overflow: hidden;

								.name {
									line-height: 26px;
									@include no-wrap();
									color: $color-text;
									font-size: $font-size-medium-x;
								}

								.desc {
									@include no-wrap();
									color: $color-text-l;
									font-size: $font-size-small;
								}
							}

							.icon {
								flex: 0 0 40px;
								color: $color-text-d;
								font-size: 24px;
								text-align: center;
							}
						}
					}
				}
			}
		}
	}
</style>
