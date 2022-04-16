<template>
	<div class="list-wrapper">
		<h1 class="list-title">创建歌单({{ list.length }}个)</h1>
		<!-- @click.stop="getAlbumDetail" -->
		<ul>
			<li
				class="list-item"
				v-for="(item, index) in list"
				:key="item.id"
				:data-index="index"
			>
				<div class="image">
					<img v-img-lazy="item.coverImgUrl" />
				</div>
				<div class="text">
					<h1 class="name">{{ item.name }}</h1>
					<p class="desc">
						<span>{{ item.trackCount }}首</span>
						<span v-if="false"
							>，descriptiondescriptiondescriptiondescription</span
						>
					</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
	import { onMounted } from 'vue';

	const props = defineProps({
		list: {
			type: Array,
			default: [],
		},
	});

	onMounted(() => {
		console.log(props.list);
	});
</script>

<style lang="scss" scoped>
	.list-wrapper {
		padding: 14px;
		border-radius: 14px;
		background: rgba(178, 164, 164, 0.3);

		.list-title {
			line-height: 20px;
			font-size: $font-size-small;
		}

		.list-item {
			display: flex;
			align-items: center;
			margin-top: 8px;

			.image {
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
					font-size: $font-size-medium-x;
				}

				.desc {
					@include no-wrap();
					color: $color-text-l;
					font-size: $font-size-small;
				}
			}
		}
	}
</style>
