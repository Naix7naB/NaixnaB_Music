<template>
	<div class="login">
		<Login></Login>
	</div>
</template>

<script setup>
	import Login from '@/components/login';
</script>

<style lang="scss" scoped>
	.login {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: $color-background;
	}
</style>
