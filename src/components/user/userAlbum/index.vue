<template>
	<ul class="user-album">
		<li class="album-list" v-for="album in albums" :key="album">
			<h1 class="list-title">{{ album.title }}</h1>
			<ul @click.stop="getAlbumDetail">
				<li
					class="item"
					v-for="(item, index) in album.list"
					:key="item.id"
					:data-index="index"
				>
					<div class="icon">
						<img v-img-lazy="item.coverImgUrl" />
					</div>
					<div class="text">
						<h1 class="name">{{ item.name }}</h1>
						<p class="desc">
							<span>{{ item.trackCount }}首</span>
							<span v-if="album.described">{{ handleName(item) }}</span>
						</p>
					</div>
				</li>
			</ul>
		</li>
	</ul>
</template>

<script setup>
	import { onMounted, reactive } from 'vue';

	const props = defineProps({
		playlist: {
			type: Array,
			default: [],
		},
	});

	const emit = defineEmits(['pickItem']);

	const albums = reactive({
		self: {
			title: '创建歌单',
			described: false,
			list: [],
		},
		sub: {
			title: '收藏歌单',
			described: true,
			list: [],
		},
	});

	/* 处理作者名称 */
	function handleName(item) {
		return `，by ${item.creator.nickname}`;
	}

	/* 获取歌单 */
	function getAlbumDetail(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.index;
		const item = props.playlist[index];
		emit('pickItem', item);
	}

	onMounted(() => {
		/* 筛选出 自建歌单 和 收藏歌单 */
		props.playlist.forEach((item) => {
			item.subscribed
				? albums.sub.list.push(item)
				: albums.self.list.push(item);
		});
	});
</script>

<style lang="scss" scoped>
	.user-album {
		padding: 5%;
		overflow: hidden;

		.album-list {
			margin-bottom: 20px;
			padding: 14px;
			border-radius: 14px;
			background: rgba(69, 65, 65, 0.3);
			backdrop-filter: blur(2px);

			&:last-child {
				margin-bottom: 0;
			}

			.list-title {
				line-height: 20px;
				font-size: $font-size-small;
			}

			.item {
				display: flex;
				align-items: center;
				margin-top: 16px;

				.icon {
					flex: 0 0 54px;
					height: 54px;
					border-radius: 8px;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					flex: 1;
					line-height: 20px;
					padding-left: 10px;
					overflow: hidden;

					.name {
						@include no-wrap();
						font-size: $font-size-medium;
					}

					.desc {
						@include no-wrap();
						color: $color-text-l;
						font-size: $font-size-small;
					}
				}
			}
		}
	}
</style>
