<template>
	<div class="nav">
		<MusicHeader></MusicHeader>
		<MusicTab></MusicTab>
		<router-view></router-view>
	</div>
	<Player></Player>
</template>

<script setup>
	import MusicHeader from '@/components/header';
	import MusicTab from '@/components/tab';
	import Player from '@/components/player';
</script>
