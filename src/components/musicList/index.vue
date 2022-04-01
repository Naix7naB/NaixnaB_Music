<template>
	<div class="music-list">
		<!-- 返回按钮 -->
		<div class="back" @click="goBack">
			<i class="icon-back"></i>
		</div>
		<!-- 标题 -->
		<h1 class="title">{{ listTitle }}</h1>
		<!-- 背景图片 -->
		<div class="bg-image" :style="bgImageStyle" ref="imageRef">
			<div class="play-btn-wrapper" v-if="showBtn">
				<div class="play-btn">
					<i class="icon-play"></i>
					<span class="text">顺序播放全部</span>
				</div>
			</div>
			<div class="filter" :style="filterStyle"></div>
		</div>
		<!-- 歌曲列表 -->
		<Scroll
			class="list"
			:probeType="3"
			:style="scrollStyle"
			@onScroll="onScroll"
		>
			<div class="song-list-wrapper" v-load="isLoading">
				<SongList :songs="songs"></SongList>
			</div>
		</Scroll>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import Scroll from '@/components/base/scroll';
	import SongList from '@/components/base/songList';

	const router = useRouter();
	const props = defineProps({
		isLoading: Boolean,
		listTitle: String,
		picUrl: String,
		songs: {
			type: Array,
			default: [],
		},
	});

	const imageRef = ref(null);
	const imageHeight = ref(0);
	const titleHeight = ref(0);
	const maxTranslateY = ref(0);
	const scrollY = ref(0);

	const bgImageStyle = computed(() => {
		let zIndex = 0;
		let scale = 1;
		let height = '40%';
		if (scrollY.value > maxTranslateY.value) {
			zIndex = 1;
			height = `${titleHeight.value}px`;
		} else if (scrollY.value < 0) {
			scale = -scrollY.value / imageHeight.value + 1;
		}
		return {
			zIndex,
			height,
			transform: `scale(${scale})`,
			backgroundImage: `url(${props.picUrl})`,
		};
	});

	const showBtn = computed(() => {
		let flag = true;
		if (!props.songs.length) {
			flag = false;
		}
		if (scrollY.value > maxTranslateY.value) {
			flag = false;
		}
		return flag;
	});

	const filterStyle = computed(() => {
		let blur = 0;
		if (scrollY.value > 0) {
			blur = Math.min(scrollY.value / 50, 7);
		}
		return {
			backdropFilter: `blur(${blur}px)`,
		};
	});

	const scrollStyle = computed(() => {
		return {
			top: `${imageHeight.value}px`,
		};
	});

	// 返回上一级
	function goBack() {
		router.back();
	}

	function onScroll(pos) {
		scrollY.value = -pos.y;
	}

	onMounted(() => {
		imageHeight.value = imageRef.value.clientHeight;
		titleHeight.value = imageRef.value.previousElementSibling.clientHeight;
		maxTranslateY.value = imageHeight.value - titleHeight.value;
	});
</script>

<style lang="scss" scoped>
	.music-list {
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 0;

		.back {
			position: absolute;
			top: 0;
			left: 6px;
			z-index: 20;
			transform: translateZ(2px);

			.icon-back {
				display: block;
				padding: 10px;
				font-size: $font-size-large-x;
				color: $color-theme;
			}
		}

		.title {
			position: absolute;
			top: 0;
			left: 10%;
			width: 80%;
			z-index: 20;
			transform: translateZ(2px);
			@include no-wrap();
			text-align: center;
			line-height: 40px;
			font-size: $font-size-large;
			color: $color-text;
		}

		.bg-image {
			position: relative;
			width: 100%;
			height: 40%;
			transform-origin: top;
			background-size: cover;

			.play-btn-wrapper {
				position: absolute;
				bottom: 20px;
				z-index: 10;
				width: 100%;

				.play-btn {
					box-sizing: border-box;
					width: 135px;
					padding: 7px 0;
					margin: 0 auto;
					text-align: center;
					border: 1px solid $color-theme;
					color: $color-theme;
					border-radius: 100px;
					font-size: 0;
				}

				.icon-play {
					display: inline-block;
					vertical-align: middle;
					margin-right: 6px;
					font-size: $font-size-medium-x;
				}

				.text {
					display: inline-block;
					vertical-align: middle;
					font-size: $font-size-small;
				}
			}

			.filter {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(7, 17, 27, 0.4);
				transform-origin: center;
			}
		}

		.list {
			position: absolute;
			bottom: 0;
			width: 100%;
			z-index: 0;

			.song-list-wrapper {
				padding: 20px 30px;
				min-height: 350px;
				background: $color-background;
			}
		}
	}
</style>
