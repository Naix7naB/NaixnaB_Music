<template>
	<div class="recommend">
		<Scroll class="recommend-content">
			<div class="scroll-content">
				<div class="recommend-banner">
					<Slider :banners="banners"></Slider>
				</div>
				<div class="recommend-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul>
						<li class="list-item" v-for="item in recommendList" :key="item.id">
							<div class="image">
								<img :src="item.coverImgUrl" />
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
	import { onMounted, ref } from 'vue';
	import { getBanner, getRecommendList } from '@/service/recommend-api';
	import Slider from '@/components/base/slider';
	import Scroll from '@/components/base/scroll';

	const banners = ref([]),
		recommendList = ref([]);

	onMounted(() => {
		getBanner().then(res => {
			// 轮播图数据
			if (res.code === 200) banners.value = res.banners;
		});
		getRecommendList().then(res => {
			// 推荐歌单数据
			if (res.code === 200) recommendList.value = res.playlists;
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

		.recommend-content {
			height: 100%;
			overflow: hidden;

			.recommend-banner {
				width: 100%;
			}

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
