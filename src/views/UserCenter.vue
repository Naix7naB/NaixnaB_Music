<template>
	<div
		class="user-center"
		:style="{ backgroundImage: `url(${profile.backgroundUrl})` }"
		v-load="isLoading"
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
				<img class="image" :src="profile.avatarUrl" />
				<span class="name">{{ profile.nickname }}</span>
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
							<img :src="profile.avatarUrl" />
						</div>
						<div class="text">
							<div class="head">
								<span class="name">{{ profile.nickname }}</span>
								<img :src="vipInfo.redVipDynamicIconUrl2" />
							</div>
							<div class="desc">
								<span class="txt follows">{{ profile.follows }}关注</span>
								<span class="txt followed">{{ profile.followeds }}粉丝</span>
								<span class="txt level">Lv.{{ profile.level }}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- 用户歌单 -->
				<div class="user-album">
					<div class="favorite-album">
						<div class="image">
							<img
								:src="favoriteAlbum.coverImgUrl"
								v-if="favoriteAlbum.coverImgUrl"
							/>
						</div>
						<div class="text">
							<h1 class="name">{{ favoriteAlbum.name }}</h1>
							<p class="desc">{{ favoriteAlbum.trackCount }}首</p>
						</div>
					</div>
					<AlbumList :list="selfList" :sub="false"></AlbumList>
					<AlbumList :list="subList"></AlbumList>
				</div>
			</div>
		</Scroll>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { getUserInfo, getUserPlaylist } from '@/service/user';
	import storage from '@/plugins/storage';
	import AlbumList from '@/components/user/albumList';
	import Scroll from '@/components/base/scroll';

	const router = useRouter();
	const props = defineProps({
		userId: {
			type: Number,
			default: 0,
		},
	});

	const profile = ref({});
	const vipInfo = ref({});
	const favoriteAlbum = ref({});
	const selfList = ref([]);
	const subList = ref([]);
	const scrollY = ref(0);
	const scrollConRef = ref(null);

	const isLoading = computed(() => {
		return (
			favoriteAlbum.value === {} ||
			!selfList.value.length ||
			!subList.value.length
		);
	});

	const titleStyle = computed(() => {
		let opacity = 0;
		if (scrollY.value > 0 && scrollY.value < 160) {
			opacity = scrollY.value / 160;
		} else if (scrollY.value >= 160) {
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
	}

	/* 返回上一级 */
	function back() {
		console.log(router);
		router.push('/');
	}

	onMounted(async () => {
		const uid = props.userId || storage.getLocal('__uid__', 0);
		if (uid) {
			const info = storage.getLocal('__userInfo__', '');
			const list = storage.getLocal('__userPlayList__', null);
			if (info) {
				profile.value = info.profile;
				vipInfo.value = info.vipInfo;
			} else {
				const { result } = await getUserInfo(uid);
				profile.value = result.profile;
				vipInfo.value = result.vipInfo;
				storage.setLocal('__userInfo__', result);
			}
			if (list) {
				favoriteAlbum.value = list.favorite;
				selfList.value = list.self;
				subList.value = list.sub;
			} else {
				const { playlist } = await getUserPlaylist({ uid });
				favoriteAlbum.value = playlist.favorite;
				selfList.value = playlist.self;
				subList.value = playlist.sub;
				storage.setLocal('__userPlayList__', playlist);
			}
		} else return;
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
					background: rgba(72, 65, 65, 0.3);
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

				.favorite-album {
					display: flex;
					align-items: center;
					padding: 14px;
					margin-bottom: 20px;
					border-radius: 14px;
					background: rgba(178, 164, 164, 0.3);

					.image {
						flex: 0 0 54px;
						height: 54px;
						border-radius: 8px;
						overflow: hidden;

						img {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						flex: 1;
						line-height: 20px;
						padding-left: 10px;
						overflow: hidden;

						.name {
							@include no-wrap();
							font-size: $font-size-medium-x;
						}

						.desc {
							@include no-wrap();
							color: $color-text-l;
							font-size: $font-size-small;
						}
					}
				}
			}
		}
	}
</style>
