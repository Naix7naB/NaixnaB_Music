<template>
	<div
		class="user-center"
		:style="{ backgroundImage: `url(${baseInfo.bgImage})` }"
		v-load="isLoading"
		v-if="baseInfo.bgImage"
	>
		<!-- 模糊层 -->
		<Filter></Filter>
		<!-- 顶部标题 -->
		<UserTitle
			:text="profile.nickname"
			:icon="profile.avatarUrl"
			:style="titleStyle"
			@back="back"
		></UserTitle>
		<!-- 内容滚动区 -->
		<Scroll
			class="user-content"
			:probeType="3"
			@onScroll="onScroll"
			v-if="!isLoading"
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
				<!-- 用户展示区 -->
				<Exhibit :imgUrl="favorite.coverImgUrl" @pickItem="toDetail"></Exhibit>
				<!-- 用户歌单 -->
				<UserAlbum :playlist="albumList" @pickItem="toDetail"></UserAlbum>
			</div>
		</Scroll>
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
	import { getUserInfo, getUserPlaylist, getUserAccount } from '@/service/user';
	import storage from '@/plugins/storage';

	/* 组件 */
	import Scroll from '@/components/base/scroll';
	import Filter from '@/components/user/filter';
	import UserTitle from '@/components/user/userTitle';
	import Exhibit from '@/components/user/userExhibition';
	import UserAlbum from '@/components/user/userAlbum/index.vue';

	const router = useRouter();

	const baseInfo = ref({});
	const profile = ref({});
	const vipInfo = ref({});
	const favorite = ref({});
	const albumList = ref([]);
	const albumDetail = ref({});
	const userExhibitDetail = ref({});

	const scrollY = ref(0);

	const isLoading = computed(() => !albumList.value.length);

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

	/* 跳转用户歌单详细页 或 跳转展示区页面 */
	function toDetail(item) {
		if (item.id) {
			albumDetail.value = {
				id: item.id,
				name: item.name,
				picUrl: item.picUrl || item.coverImgUrl,
			};
			/* 缓存 albumDetail数据 */
			storage.setSession('__albumDetail__', albumDetail.value);
			/* 跳转 */
			router.push({
				path: `/user/${item.id}`,
			});
		} else {
			userExhibitDetail.value = {
				...item,
				bgImage: baseInfo.value.bgImage,
			};
			storage.setSession('__exhibitDetail__', userExhibitDetail.value);
			router.push('/user/exhibit');
		}
	}

	/* 返回上一级 */
	function back() {
		router.push('/');
	}

	onMounted(async () => {
		let base = storage.getSession('__base__', null);
		if (base) {
			baseInfo.value = base;
		} else {
			const { profile } = await getUserAccount();
			baseInfo.value = {
				uid: profile.userId,
				bgImage: profile.backgroundUrl,
			};
			storage.setSession('__base__', baseInfo.value);
		}
		const { uid } = baseInfo.value;
		const info = storage.getLocal('__userInfo__', '');
		if (info) {
			profile.value = info.profile;
			vipInfo.value = info.vipInfo;
		} else {
			const { result } = await getUserInfo({ uid });
			profile.value = result.profile;
			vipInfo.value = result.vipInfo;
			storage.setLocal('__userInfo__', result);
		}
		/* 获取 用户歌单 */
		const { playlist } = await getUserPlaylist({ uid });
		favorite.value = playlist.splice(0, 1)[0];
		albumList.value = playlist;
	});
</script>

<style lang="scss" scoped>
	.user-center {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: 0 -160px / contain fixed;

		.user-content {
			z-index: -1;
			position: absolute;
			top: 0;
			bottom: 0;
			width: 100%;
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
					background: rgba(98, 95, 95, 0.3);
					backdrop-filter: blur(20px);

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
		}
	}
</style>
