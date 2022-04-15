<template>
	<div class="list-wrapper">
		<h1 class="list-title">创建歌单(11个)</h1>
		<!-- @click.stop="getAlbumDetail" -->
		<ul>
			<li class="list-item">
				<!-- v-for="(item, index) in recommend.playLists" :key="item.id"
					:data-index="index" -->
				<div class="image">
					<img v-img-lazy="pic" />
				</div>
				<div class="text">
					<p class="name">namenamenamenamenamenamenamenamenamenamename</p>
					<p class="desc">descriptiondescriptiondescriptiondescription</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
	import pic from '@/assets/images/lazy.jpg';
</script>

<style lang="scss" scoped>
	.list-wrapper {
		width: 80%;
		margin: 0 auto;

		.list-title {
			font-size: 16px;
		}

		.list-item {
			display: flex;
			align-items: center;

			.image {
				flex: 0 0 80px;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.text {
				flex: 1;
				@include no-wrap();

				.name {
					font-size: 14px;
				}

				.desc {
					font-size: 12px;
				}
			}
		}
	}
</style>
