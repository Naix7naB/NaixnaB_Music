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
					<ul>
						<li
							class="list-item"
							v-for="item in recommend.playLists"
							:key="item.id"
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
	</div>
</template>

<script setup>
	import { computed, onMounted, reactive } from 'vue';
	import { getBanner, getRecommendList } from '@/service/recommend';
	import Slider from '@/components/base/slider';
	import Scroll from '@/components/base/scroll';

	const recommend = reactive({
		banners: [],
		playLists: [],
	});
	const isLoading = computed(
		() => !recommend.banners.length || !recommend.playLists.length
	);

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
