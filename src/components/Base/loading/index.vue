<template>
	<div class="loading">
		<div class="loading-content">
			<img src="./loading.gif" />
			<p class="text">正在加载...</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);

		.loading-content {
			text-align: center;

			img {
				width: 24px;
				height: 24px;
			}

			.text {
				line-height: 20px;
				font-size: $font-size-small;
				color: $color-text-l;
			}
		}
	}
</style>
