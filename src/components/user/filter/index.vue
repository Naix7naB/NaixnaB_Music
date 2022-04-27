<template>
	<div class="filter-wrapper">
		<div class="filter"></div>
	</div>
</template>

<style lang="scss" scoped>
	.filter-wrapper {
		z-index: -1;
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.4);

		.filter {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 100%;
			background: rgba(69, 65, 65, 0.3);
			backdrop-filter: blur(2px);
		}
	}
</style>
