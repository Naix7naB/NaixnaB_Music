<template>
	<div class="nav">
		<MusicHeader></MusicHeader>
		<MusicTab></MusicTab>
		<router-view :style="viewStyle"></router-view>
	</div>
	<Player></Player>
</template>

<script setup>
	import MusicHeader from '@/components/header';
	import MusicTab from '@/components/tab';
	import Player from '@/components/player';

	import { computed } from 'vue';
	import { useStore } from 'vuex';
	const store = useStore();
	const playList = computed(() => store.state.playList);
	const viewStyle = computed(() => {
		return {
			bottom: playList.value.length ? '60px' : 0,
		};
	});
</script>
