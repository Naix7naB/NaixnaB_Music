<template>
	<div class="singer" v-load="!singerList.length">
		<SingerList :singerList="singerList" @toDetail="toDetail"></SingerList>
		<!-- vue3 路由组件添加 transition/keep-alive -->
		<router-view v-slot="{ Component }">
			<transition name="slide" appear>
				<component :is="Component" :detailObj="singerDetail" />
			</transition>
		</router-view>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { getAllSinger } from '@/service/singer.js';
	import { storage } from '@/utils';
	import SingerList from '@/components/singerList';

	const router = useRouter();
	const singerList = ref([]);
	const singerDetail = ref({});

	/* 跳转相应歌手的详细页 */
	function toDetail(item) {
		singerDetail.value = {
			id: item.id,
			name: item.name,
			picUrl: item.picUrl || item.coverImgUrl,
		};
		/* 缓存 singerDetail数据 */
		storage.setLocal('__singerDetail__', singerDetail.value);
		/* 跳转 */
		router.push({
			path: `/singer/${item.id}`,
		});
	}

	onMounted(() => {
		/* 先往本地存储获取歌手列表 */
		let list = storage.getLocal('__singerList__', []);
		if (list.length) {
			/* 如果存储存在 */
			singerList.value = list;
		} else {
			/* 如果存储不存在 */
			getAllSinger().then((res) => {
				singerList.value = res;
				storage.setLocal('__singerList__', res);
			});
		}
	});
</script>

<style lang="scss" scoped>
	.singer {
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0;
	}
</style>
