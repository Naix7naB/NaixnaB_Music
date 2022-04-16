<template>
	<div
		class="user-center"
		:style="{ backgroundImage: `url(${userInfo.backgroundUrl})` }"
	>
		<!-- 模糊层 -->
		<div class="filter"></div>
		<!-- 返回按钮 -->
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<!-- 标题 -->
		<div class="user-title" :style="titleStyle">
			<div class="title">
				<img class="image" :src="userInfo.avatarUrl" />
				<span class="name">{{ userInfo.nickname }}</span>
			</div>
		</div>
		<!-- 内容滚动区 -->
		<Scroll
			class="user-content"
			ref="scrollConRef"
			:probeType="3"
			@onScroll="onScroll"
		>
			<div class="content-wrapper">
				<!-- 用户信息 -->
				<div class="user-info-top">
					<div class="content">
						<div class="icon">
							<img :src="userInfo.avatarUrl" />
						</div>
						<div class="text">
							<div class="head">
								<span class="name">{{ userInfo.nickname }}</span>
								<img :src="vipInfo.redVipDynamicIconUrl2" />
							</div>
							<div class="desc">
								<span class="txt follows">{{ userInfo.follows }}关注</span>
								<span class="txt followed">{{ userInfo.followeds }}粉丝</span>
								<span class="txt level">Lv.{{ userInfo.level }}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- 用户歌单 -->
				<div class="user-album">
					<AlbumList :list="selfList"></AlbumList>
				</div>
			</div>
		</Scroll>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import { getUserPlaylist } from '@/service/user';
	import AlbumList from '@/components/user/albumList';
	import Scroll from '@/components/base/scroll';

	const router = useRouter();
	const route = useRoute();
	const props = defineProps({
		userInfo: {
			type: Object,
			default: {},
		},
		vipInfo: {
			type: Object,
			default: {},
		},
	});

	const subList = ref([]);
	const selfList = ref([]);
	const scrollY = ref(0);
	const scrollConRef = ref(null);

	const titleStyle = computed(() => {
		let opacity = 0;
		if (scrollY.value > 0 && scrollY.value < 50) {
			opacity = scrollY.value / 50;
		} else if (scrollY.value > 50) {
			opacity = 1;
		}
		return {
			opacity,
			transition: 'all .1s',
		};
	});

	/* 滚动事件 */
	function onScroll(pos) {
		scrollY.value = -pos.y;
		console.log(scrollY.value);
	}

	/* 返回上一级 */
	function back() {
		router.push('/');
	}

	onMounted(async () => {
		const uid = route.params.uid;
		const { playlist } = await getUserPlaylist({ uid });
		/* 筛选出 自建歌单 和 收藏歌单 */
		playlist.reduce(
			(prev, cur) => {
				if (cur.subscribed) {
					subList.value[prev.i] = cur;
					prev.i++;
				} else {
					selfList.value[prev.j] = cur;
					prev.j++;
				}
				return prev;
			},
			{ i: 0, j: 0 }
		);
	});
</script>

<style lang="scss" scoped>
	.user-center {
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		background: 0 -160px / contain fixed;

		.filter {
			z-index: -1;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.4);
		}

		.back {
			z-index: 50;
			position: absolute;
			top: 4px;
			left: 6px;

			.icon-back {
				display: block;
				padding: 10px;
				font-size: $font-size-large-x;
				color: $color-theme;
			}
		}

		.user-title {
			z-index: 49;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 50px;
			background-color: #625243;

			.title {
				width: 50%;
				line-height: 50px;
				margin: 0 auto;
				@include no-wrap();
				text-align: center;
				font-size: $font-size-medium-x;
				color: $color-text;

				.image {
					width: 30px;
					height: 30px;
					margin-right: 6px;
					border-radius: 50%;
					vertical-align: -9px;
				}
			}
		}

		.user-content {
			height: 100vh;
			overflow: hidden;

			.user-info-top {
				position: relative;
				width: 100%;
				height: 0;
				padding-top: 56%;

				.content {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					position: absolute;
					bottom: 0;
					left: 5%;
					width: 90%;
					height: 50%;
					border-radius: 14px;
					background: rgba(82, 77, 77, 0.7);
					backdrop-filter: blur(10px);

					.icon {
						flex: 0 0 80px;
						margin-top: -15%;
						border-radius: 50%;
						overflow: hidden;
						box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);

						img {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						padding-top: 10px;
						line-height: 24px;

						.head {
							color: $color-text;
							font-size: $font-size-large;

							img {
								width: 38px;
								height: 14px;
								vertical-align: -1px;
								margin-left: 4px;
							}
						}

						.desc {
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: $font-size-medium;

							.txt {
								flex: 0 0 50px;
								text-align: center;
							}
						}
					}
				}
			}

			.user-album {
				overflow: hidden;
				padding: 5%;
			}
		}
	}
</style>
