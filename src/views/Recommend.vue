<template>
	<div class="recommend" v-load="isLoading">
		<!-- 滚动区 -->
		<Scroll class="recommend-content">
			<div class="scroll-content">
				<!-- 轮播图 -->
				<div class="recommend-banner">
					<div class="banner-content">
						<Slider :banners="recommend.banners"></Slider>
					</div>
				</div>
				<!-- 歌单列表 -->
				<div class="recommend-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul @click.stop="getAlbumDetail">
						<li
							class="list-item"
							v-for="(item, index) in recommend.playLists"
							:key="item.id"
							:data-index="index"
						>
							<div class="image">
								<img v-img-lazy="item.coverImgUrl" />
							</div>
							<div class="text">
								<p class="name">{{ item.name }}</p>
								<p class="desc">{{ item.description }}</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</Scroll>
		<!-- vue3 路由组件添加 transition/keep-alive -->
		<router-view v-slot="{ Component }">
			<transition name="slide" appear>
				<component :is="Component" :detailObj="albumDetail" />
			</transition>
		</router-view>
	</div>
</template>

<script setup>
	import { computed, onMounted, reactive, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { storage } from '@/utils';
	import { getBanner, getRecommendList } from '@/service/recommend';
	import pic from '@/assets/images/lazy.jpg';
	import Slider from '@/components/base/slider';
	import Scroll from '@/components/base/scroll';

	const router = useRouter();

	const recommend = reactive({
		banners: [{ bannerId: 0, pic: pic }],
		playLists: [],
	});
	const albumDetail = ref({});

	const isLoading = computed(
		() => !recommend.banners.length || !recommend.playLists.length
	);

	/* 获取当前歌单详细 */
	function getAlbumDetail(e) {
		const t = e.path.filter((item) => item.className === 'list-item')[0];
		const index = t.dataset.index;
		const album = recommend.playLists[index];
		toDetail(album);
	}

	/* 跳转歌单详细页 */
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
			path: `/recommend/${item.id}`,
		});
	}

	onMounted(() => {
		/* 轮播图数据 */
		getBanner().then((res) => {
			if (res.code === 200) recommend.banners = res.banners;
		});
		/* 推荐歌单列表数据 */
		getRecommendList().then((res) => {
			if (res.code === 200) recommend.playLists = res.playlists;
		});
	});
</script>

<style lang="scss" scoped>
	.recommend {
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0;
		overflow: scroll;

		// 滚动区
		.recommend-content {
			height: 100%;
			overflow: hidden;

			// 轮播图
			.recommend-banner {
				position: relative;
				width: 100%;
				height: 0;
				padding-top: 40%;
				overflow: hidden;

				.banner-content {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
				}
			}

			// 歌单列表
			.recommend-list {
				.list-title {
					height: 65px;
					line-height: 65px;
					text-align: center;
					font-size: $font-size-medium;
					color: $color-theme;
				}

				.list-item {
					display: flex;
					box-sizing: border-box;
					align-items: center;
					padding: 0 20px 20px 20px;

					.image {
						flex: 0 0 60px;
						width: 60px;
						padding-right: 20px;

						img {
							width: 60px;
							height: 60px;
						}
					}

					.text {
						display: flex;
						flex-direction: column;
						justify-content: center;
						flex: 1;
						line-height: 20px;
						overflow: hidden;
						font-size: $font-size-medium;

						.name {
							margin-bottom: 10px;
							color: $color-text-ll;
						}

						.desc {
							@include no-wrap();
							color: $color-text-d;
						}
					}
				}
			}
		}
	}
</style>
