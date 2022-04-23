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
	import { ref } from 'vue';

	const list = [
		{
			title: '每日推荐',
			icon: 'icon-calendar',
		},
		{
			title: '我的好友',
			icon: 'icon-group-fill',
		},
		{
			title: '我的收藏',
			icon: 'icon-collect-fill',
		},
		{
			title: '历史播放',
			icon: 'icon-time-fill',
		},
	];

	const emit = defineEmits(['getCurItem']);

	const itemRef = ref(null);

	function onClick(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.index / 1;
		const { title } = list[index];
		emit('getCurItem', { index, title });
	}
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
