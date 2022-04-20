<template>
	<div class="user-exhibit">
		<ul class="exhibit-list" @click="onClick">
			<li
				class="item"
				ref="itemRef"
				v-for="(item, index) in list"
				:key="index"
				:data-index="index"
			>
				<i class="icon" :class="item.icon"></i>
				<span class="title">{{ item.title }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
	import exhibit from './exhibit';

	const list = [
		{
			title: '我的好友',
			icon: 'icon-group-fill',
		},
		{
			title: '收藏和赞',
			icon: 'icon-collect-fill',
		},
		{
			title: '听歌排行',
			icon: 'icon-rank-fill',
		},
		{
			title: '历史播放',
			icon: 'icon-time-fill',
		},
	];

	const { itemRef, onClick } = exhibit();
</script>

<style lang="scss" scoped>
	.user-exhibit {
		padding: 5%;
		border-radius: 14px;
		background: rgba(178, 164, 164, 0.3);

		.exhibit-list {
			display: flex;
			flex-wrap: wrap;

			.item {
				flex: 1;
				min-width: 25%;
				display: flex;
				flex-direction: column;
				align-content: center;
				text-align: center;

				.icon {
					margin-bottom: 6px;
					font-size: 28px;
					color: rgb(216, 184, 143);
				}

				.title {
					font-size: $font-size-small;
					color: $color-text-l;
				}
			}
		}
	}
</style>
