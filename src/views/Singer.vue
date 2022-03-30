<template>
	<div class="singer" v-load="!singerList.length">
		<SingerList :singerList="singerList" @toDetail="toDetail"></SingerList>
	</div>
	<router-view :singerId="singerId"></router-view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { getAllSinger } from '@/service/singerApi.js';
	import storage from '@/utils/storage';
	import SingerList from '@/components/singerList';

	const router = useRouter();

	const singerList = ref([]);
	onMounted(() => {
		// 先往本地存储获取歌手列表
		let list = storage.getLocal('__singerList__', []);
		if (list.length) {
			// 如果存储存在
			singerList.value = list;
		} else {
			// 如果存储不存在
			getAllSinger().then(res => {
				singerList.value = res;
				storage.setLocal('__singerList__', res);
			});
		}
	});

	const singerId = ref(null);
	function toDetail(id) {
		singerId.value = id;
		router.push({
			path: `/singer/${id}`,
		});
	}
</script>

<style lang="scss" scoped>
	.singer {
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0;
	}
</style>
