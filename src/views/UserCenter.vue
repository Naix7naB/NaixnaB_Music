<template>
	<div class="user">
		<Confirm
			ref="confirmRef"
			text="请先登录后操作"
			confirmText="登录"
			@confirm="confirm"
			@cancel="cancel"
		></Confirm>
		<div
			class="user-wrapper"
			:style="{ backgroundImage: `url(${profile.backgroundUrl})` }"
			v-if="profile.backgroundUrl"
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
			<Scroll class="user-content" :probeType="3" @onScroll="onScroll">
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
					<!-- 用户展示区 -->
					<div class="user-public">
						<Exhibit @getCurItem="getCurItem"></Exhibit>
					</div>
					<!-- 用户歌单 -->
					<div class="user-album">
						<div class="favorite-album" @click="getCurItem">
							<div class="image">
								<img :src="favoriteAlbum.coverImgUrl" />
							</div>
							<div class="text">
								<h1 class="name">我喜欢的音乐</h1>
								<p class="desc">{{ favoriteAlbum.trackCount }}首</p>
							</div>
							<div class="icon">
								<i class="icon-heartbeat"></i>
								<span>心动模式</span>
							</div>
						</div>
						<AlbumList
							:list="selfList"
							:sub="false"
							@pickItem="toDetail"
						></AlbumList>
						<AlbumList
							:list="subList"
							@pickItem="toDetail"
							:style="{ marginBottom: '0' }"
						></AlbumList>
					</div>
				</div>
			</Scroll>
		</div>
		<!-- vue3 路由组件添加 transition/keep-alive -->
		<router-view v-slot="{ Component }">
			<transition name="slide" appear>
				<component
					:is="Component"
					:detailObj="albumDetail.id ? albumDetail : userExhibitDetail"
				/>
			</transition>
		</router-view>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { getUserAccount, getUserInfo, getUserPlaylist } from '@/service/user';
	import storage from '@/plugins/storage';
	import Cookies from 'vue-cookie';
	import Confirm from '@/components/base/confirm';
	import Scroll from '@/components/base/scroll';
	import Exhibit from '@/components/user/userExhibition';
	import AlbumList from '@/components/user/userAlbumList';

	const router = useRouter();

	const confirmRef = ref(null);

	const profile = ref({});
	const vipInfo = ref({});
	const favoriteAlbum = ref({});
	const selfList = ref([]);
	const subList = ref([]);
	const albumDetail = ref({});
	const userExhibitDetail = ref({});

	const bgImage = ref('');
	const scrollY = ref(0);
	const isLoading = ref(true);

	/* 头部标题样式 */
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

	/* 跳转展示区页面 */
	function getCurItem(item) {
		let data = null;
		if (item instanceof MouseEvent || item.index === 3) {
			data = {
				title: '歌单',
				index: 3,
				type: item.index === 3 ? 1 : 0,
			};
		} else {
			data = item;
		}
		userExhibitDetail.value = {
			...data,
			bgImage: bgImage.value,
		};
		storage.setLocal('__exhibitDetail__', userExhibitDetail.value);
		router.push('/user/exhibit');
	}

	/* 跳转用户歌单详细页 */
	function toDetail(item) {
		albumDetail.value = {
			id: item.id,
			name: item.name,
			picUrl: item.picUrl || item.coverImgUrl,
		};
		/* 缓存 albumDetail数据 */
		storage.setLocal('__albumDetail__', albumDetail.value);
		/* 跳转 */
		router.push({
			path: `/user/${item.id}`,
		});
	}

	/* 返回上一级 */
	function back() {
		router.push('/');
	}

	/* 点击确认按钮 */
	function confirm() {
		router.push('/login');
	}

	/* 点击取消按钮 */
	function cancel() {
		router.push('/');
	}

	onMounted(async () => {
		const token =
			storage.getLocal('__token__', '') || Cookies.get('MUSIC_U') || '';
		if (!token) {
			/* 没有登录 或 登录过期 */
			isLoading.value = false;
			confirmRef.value.show();
		} else {
			let uid = storage.getLocal('__uid__', '');
			if (!uid) {
				const { account } = await getUserAccount();
				uid = account.id;
				storage.setLocal('__uid__', uid);
			}
			if (!uid) return;
			/* 获取 用户信息 */
			const info = storage.getLocal('__userInfo__', '');
			if (info) {
				profile.value = info.profile;
				vipInfo.value = info.vipInfo;
				bgImage.value = info.profile.backgroundUrl;
			} else {
				const { result } = await getUserInfo({ uid });
				profile.value = result.profile;
				vipInfo.value = result.vipInfo;
				bgImage.value = result.profile.backgroundUrl;
				storage.setLocal('__userInfo__', result);
			}
			/* 获取 用户歌单 */
			const res = await getUserPlaylist({ uid });
			const temp = res.playlist.slice();
			favoriteAlbum.value = temp.splice(0, 1)[0];
			/* 筛选出 自建歌单 和 收藏歌单 */
			temp.forEach((item) => {
				item.subscribed ? subList.value.push(item) : selfList.value.push(item);
			});
			isLoading.value = false;
			/* 后面通过 bgImage 全部页面更换皮肤 待完成... */
			storage.setLocal('__bgImage__', bgImage.value);
		}
	});
</script>

<style lang="scss" scoped>
	.user {
		z-index: 1;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: $color-background;

		.user-wrapper {
			z-index: -2;
			position: absolute;
			top: 0;
			bottom: 0;
			width: 100%;
			background: 0 -160px / contain fixed;

			.filter {
				z-index: -1;
				position: fixed;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background: rgba(0, 0, 0, 0.4);
			}

			.back {
				z-index: 2;
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
				z-index: 1;
				position: absolute;
				left: 0;
				right: 0;
				line-height: 50px;
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
				height: 100%;
				overflow: hidden;

				.user-public {
					width: 90%;
					margin: 20px auto 10px;
				}

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

						.icon {
							flex: 0 0 80px;
							padding: 0 4px;
							line-height: 22px;
							border: 1px solid $color-text-d;
							border-radius: 12px;
							text-align: center;

							.icon-heartbeat {
								margin-right: 2px;
								vertical-align: -2px;
								font-size: $font-size-large;
							}

							span {
								font-size: $font-size-small;
							}
						}
					}
				}
			}
		}
	}
</style>
