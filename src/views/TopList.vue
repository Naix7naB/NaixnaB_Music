<template>
	<div class="top-list" v-load="!topList.length">
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
						<div class="count">
							<i class="icon-play-plain"></i>
							<span class="num">{{ handleCount(item.playCount) }}</span>
						</div>
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
	import { handleCount } from '@/plugins/utils';
	import storage from '@/plugins/storage';
	import Scroll from '@/components/base/scroll';

	const router = useRouter();

	const topList = ref([]);
	const topListDetail = ref({});

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
		storage.setSession('__topListDetail__', topListDetail.value);
		/* 跳转 */
		router.push({
			path: `/toplist/${item.id}`,
		});
	}

	onMounted(() => {
		getTopList().then((res) => {
			const list = res.list.slice(0, 10);
			topList.value = list;
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
				overflow: hidden;

				.item {
					display: flex;
					align-items: center;
					width: 90%;
					height: 120px;
					margin: 16px auto;
					padding: 0 16px;
					border-radius: 10px;
					background: rgba($color: $color-highlight-background, $alpha: 0.25);
					box-sizing: border-box;

					.image {
						flex: 0 0 82px;
						position: relative;
						text-align: center;

						.icon {
							width: 82px;
							height: 86px;
							border-radius: 10px;
							overflow: hidden;
							vertical-align: middle;
						}

						.frequency {
							position: absolute;
							bottom: 6px;
							left: 6px;
							color: $color-text;
							font-size: $font-size-small-s;
						}

						.count {
							position: absolute;
							top: 0;
							right: 4px;
							line-height: 20px;

							.icon-play-plain {
								vertical-align: 1px;
								font-size: $font-size-small-s;
							}

							.num {
								margin-left: 2px;
								font-size: $font-size-small-s;
							}
						}
					}

					.txt {
						flex: 1;
						padding: 0 16px;
						line-height: 20px;
						overflow: hidden;
						font-size: $font-size-small;
						color: $color-text-l;

						.title {
							line-height: 26px;
							font-size: $font-size-medium;
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
