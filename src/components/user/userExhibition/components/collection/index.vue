<template>
	<div class="collection" v-load="!collectionList.length">
		<h1 h1 class="title">我收藏的专辑 ({{ collectionList.length }})</h1>
		<ul class="list" @click="pickItem">
			<li
				class="item"
				v-for="(item, index) in collectionList"
				:key="item.id"
				:data-index="index"
			>
				<div class="icon"><img :src="item.picUrl" /></div>
				<div class="content">
					<p class="name">{{ item.name }}</p>
					<p class="desc">
						<span>{{ item.artists[0].name }}，</span>
						<span>{{ item.size }}首</span>
					</p>
				</div>
			</li>
		</ul>
		<!-- vue3 路由组件添加 transition/keep-alive -->
		<router-view v-slot="{ Component }">
			<transition name="slide" appear>
				<component :is="Component" :detailObj="albumDetail" />
			</transition>
		</router-view>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { getCollectAlbum } from '@/service/user';
	import storage from '@/plugins/storage';

	const router = useRouter();

	const collectionList = ref([]);
	const albumDetail = ref({});

	function pickItem(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.index;
		const item = collectionList.value[index];
		toDetail(item);
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
			path: `/user/exhibit/${item.id}`,
		});
	}

	onMounted(async () => {
		const { data } = await getCollectAlbum();
		collectionList.value = data;
	});
</script>

<style lang="scss" scoped>
	.collection {
		position: fixed;
		top: 50px;
		bottom: 0;
		width: 100%;

		.title {
			width: 86%;
			line-height: 30px;
			margin: 10px auto 0;
			font-size: $font-size-medium;
			text-decoration: underline;
		}

		.list {
			width: 90%;
			margin: 0 auto;
			background: rgba(86, 79, 79, 0.3);
			backdrop-filter: blur(2px);

			.item {
				display: flex;
				align-items: center;
				padding: 10px;

				.icon {
					width: 50px;
					height: 50px;
					border-radius: 10px;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.content {
					flex: 1;
					padding: 0 10px;
					line-height: 24px;

					.name {
						font-size: $font-size-medium-x;
					}

					.desc {
						color: $color-text-l;
						font-size: $font-size-medium;
					}
				}
			}
		}
	}
</style>
