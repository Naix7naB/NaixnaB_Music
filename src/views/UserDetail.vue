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
		<div class="title" :style="titleStyle">
			<img class="image" :src="userInfo.avatarUrl" />
			<span class="name">{{ userInfo.nickname }}</span>
		</div>
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
			<AlbumList></AlbumList>
		</div>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
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

	const titleStyle = computed(() => {
		return {};
	});

	/* 返回上一级 */
	function back() {
		router.back();
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
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.2);
		}

		.back {
			position: absolute;
			top: 0;
			left: 6px;
			z-index: 50;

			.icon-back {
				display: block;
				padding: 10px;
				font-size: $font-size-large-x;
				color: $color-theme;
			}
		}

		.title {
			position: absolute;
			top: 0;
			left: 25%;
			width: 50%;
			z-index: 20;
			transform: translateZ(2px);
			@include no-wrap();
			text-align: center;
			line-height: 40px;
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
					box-shadow: 0 2px 20px rgba($color: #000, $alpha: 0.2);

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
</style>
