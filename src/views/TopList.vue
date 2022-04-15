<template>
	<div class="top-list" v-load="isLoading">
		<Scroll class="top-list-content">
			<ul @click="getTopListDetail">
				<li
					class="item"
					v-for="(item, index) in topList"
					:key="item.id"
					:data-index="index"
				>
					<!-- 榜单图片 -->
					<div class="image">
						<img class="icon" v-img-lazy="item.coverImgUrl" />
						<span class="frequency">{{ item.updateFrequency }}</span>
					</div>
					<!-- 榜单详情 -->
					<div class="txt">
						<p class="title">{{ item.name }}</p>
						<p class="top-des" v-if="!item.tracks.length">
							{{ item.description }}
						</p>
						<div v-if="item.tracks.length">
							<p class="song-des" v-for="(des, idx) in item.tracks" :key="idx">
								<span>{{ handlerText(des, idx) }}</span>
							</p>
						</div>
					</div>
				</li>
			</ul>
		</Scroll>
		<!-- vue3 路由组件添加 transition/keep-alive -->
		<router-view v-slot="{ Component }">
			<transition name="slide" appear>
				<component :is="Component" :detailObj="topListDetail" />
			</transition>
		</router-view>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { getTopList } from '@/service/toplist';
	import { useRouter } from 'vue-router';
	import storage from '@/plugins/storage';
	import Scroll from '@/components/base/scroll';

	const router = useRouter();

	const topList = ref([]);
	const topListDetail = ref({});
	const isLoading = ref(true);

	/* 处理歌单详细文本 */
	function handlerText(text, idx) {
		const txt = text.first + ' - ' + text.second;
		const desc = idx + 1 + '. ' + txt;
		return desc;
	}

	/* 获取当前榜单详细 */
	function getTopListDetail(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.index;
		const item = topList.value[index];
		toDetail(item);
	}

	/* 跳转榜单的详细页 */
	function toDetail(item) {
		topListDetail.value = {
			id: item.id,
			name: item.name,
			picUrl: item.picUrl || item.coverImgUrl,
		};
		/* 缓存 topListDetail数据 */
		storage.setLocal('__topListDetail__', topListDetail.value);
		/* 跳转 */
		router.push({
			path: `/toplist/${item.id}`,
		});
	}

	onMounted(() => {
		getTopList().then((res) => {
			const list = res.list.slice(0, 10);
			topList.value = list;
			isLoading.value = false;
		});
	});
</script>

<style lang="scss" scoped>
	.top-list {
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0;

		.top-list-content {
			height: 100%;
			overflow: hidden;

			ul {
				&::before,
				&::after {
					content: '';
					display: block;
					width: 100%;
					height: 20px;
				}

				.item {
					display: flex;
					align-items: center;
					height: 130px;
					margin: 0 14px 20px 14px;
					border-radius: 4%;
					background: rgba($color: $color-highlight-background, $alpha: 0.25);

					&:last-child {
						margin-bottom: 0;
					}

					.image {
						flex: 0 0 120px;
						position: relative;
						text-align: center;

						.icon {
							width: 100px;
							height: 105px;
							border-radius: 12px;
							overflow: hidden;
							vertical-align: middle;
						}

						.frequency {
							position: absolute;
							bottom: 6px;
							left: 16px;
							color: $color-text;
							font-size: $font-size-small-s;
						}
					}

					.txt {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						padding: 0 20px 0 10px;
						height: 100px;
						overflow: hidden;
						line-height: 24px;
						font-size: $font-size-medium;
						color: $color-text-l;

						.title {
							line-height: 30px;
							font-size: $font-size-medium-x;
							color: $color-text;
						}

						.top-des {
							@include multiple-lines();
						}

						.song-des {
							@include no-wrap();
						}
					}
				}
			}
		}
	}
</style>
