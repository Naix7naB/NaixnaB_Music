<template>
	<div class="header">
		<MusicHeader></MusicHeader>
		<MusicTab></MusicTab>
	</div>
	<div class="content">
		<router-view></router-view>
	</div>
</template>

<script setup>
	import MusicHeader from '@/components/header';
	import MusicTab from '@/components/tab';
</script>
