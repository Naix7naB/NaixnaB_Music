<template>
	<div class="user-exhibit">
		<ul class="exhibit-list">
			<li
				class="item"
				v-for="(item, index) in list"
				:key="index"
				@click="onClick(index)"
			>
				<i class="item-icon" :class="item.icon"></i>
				<span class="item-title">{{ item.title }}</span>
			</li>
		</ul>
		<div class="favorite-album" @click="onClick(list.length)">
			<div class="favorite-image">
				<img :src="imgUrl" />
			</div>
			<div class="favorite-text">
				<h1 class="text-name">我喜欢的音乐</h1>
				<p class="text-desc">{{ favoriteList.length }}首</p>
			</div>
			<div class="favorite-icon">
				<i class="icon-heartbeat"></i>
				<span>心动模式</span>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue';
	import { useStore } from 'vuex';

	const list = [
		{
			title: '每日推荐',
			subTitle: '每日推荐',
			icon: 'icon-calendar',
		},
		{
			title: '我的好友',
			subTitle: '我的好友',
			icon: 'icon-group-fill',
		},
		{
			title: '我的收藏',
			subTitle: '我的收藏',
			icon: 'icon-collect-fill',
		},
		{
			title: '历史播放',
			subTitle: '歌单',
			icon: 'icon-time-fill',
		},
	];

	const props = defineProps({
		imgUrl: {
			type: String,
			default: '',
		},
	});

	const emit = defineEmits(['pickItem']);

	const store = useStore();
	const favoriteList = computed(() => store.state.favoriteList);

	function onClick(idx) {
		let type = '';
		if (idx === 3 || idx === list.length) {
			type = idx === 3 ? 'history' : 'favorite';
			idx = list.findIndex((item) => item.subTitle === '歌单');
		}
		const { subTitle } = list[idx];
		const item = {
			index: idx,
			title: subTitle,
		};
		if (type) item.type = type;
		emit('pickItem', item);
	}
</script>

<style lang="scss" scoped>
	.user-exhibit {
		width: 90%;
		margin: 30px auto;
		margin-bottom: 0;
		padding: 5%;
		border-radius: 14px;
		background: rgba(69, 65, 65, 0.3);
		backdrop-filter: blur(2px);
		box-sizing: border-box;

		.exhibit-list {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 40px;

			.item {
				flex: 1;
				min-width: 25%;
				display: flex;
				flex-direction: column;
				align-content: center;
				text-align: center;

				.item-icon {
					margin-bottom: 6px;
					font-size: 30px;
					color: rgb(216, 184, 143);
				}

				.item-title {
					font-size: $font-size-small;
					color: $color-text-l;
				}
			}
		}

		.favorite-album {
			display: flex;
			align-items: center;
			padding-left: 6px;

			.favorite-image {
				flex: 0 0 54px;
				height: 54px;
				border-radius: 8px;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.favorite-text {
				flex: 1;
				line-height: 20px;
				padding-left: 10px;
				overflow: hidden;

				.text-name {
					@include no-wrap();
					font-size: $font-size-medium-x;
				}

				.text-desc {
					@include no-wrap();
					color: $color-text-l;
					font-size: $font-size-small;
				}
			}

			.favorite-icon {
				flex: 0 0 80px;
				padding: 0 4px;
				line-height: 22px;
				border: 1px solid $color-text-d;
				border-radius: 12px;
				text-align: center;

				i {
					margin-right: 2px;
					vertical-align: -2px;
					font-size: $font-size-large;
				}

				span {
					font-size: $font-size-small;
				}
			}
		}
	}
</style>
