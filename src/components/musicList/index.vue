<template>
	<div class="music-list">
		<!-- 返回按钮 -->
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<!-- 标题 -->
		<h1 class="title">{{ listTitle }}</h1>
		<!-- 固定播放栏 -->
		<ListTop
			class="list-fixed"
			:style="fixedStyle"
			:count="songs.length"
			@play="sequencePlayAll"
		></ListTop>
		<!-- 背景图片 -->
		<div class="bg-image" :style="bgImageStyle" ref="imageRef">
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
				<ListTop :count="songs.length" @play="sequencePlayAll"></ListTop>
				<SongList :songs="songs"></SongList>
			</div>
		</Scroll>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useStore } from 'vuex';
	import storage from '@/plugins/storage';
	import Scroll from '@/components/base/scroll';
	import ListTop from '@/components/base/listTop';
	import SongList from '@/components/base/songList';

	const router = useRouter();
	const store = useStore();
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

	const playList = computed(() => store.state.playList);

	/* 播放全部固定样式 */
	const fixedStyle = computed(() => {
		let visibility = 'hidden';
		if (scrollY.value > maxTranslateY.value) {
			visibility = 'visible';
		}
		return {
			visibility,
		};
	});

	/* 背景图片样式 */
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

	/* 模糊层样式 */
	const filterStyle = computed(() => {
		let blur = 0;
		if (scrollY.value > 0) {
			blur = Math.min(scrollY.value / 50, 7);
		}
		return {
			backdropFilter: `blur(${blur}px)`,
		};
	});

	/* 滚动样式 */
	const scrollStyle = computed(() => {
		return {
			top: `${imageHeight.value}px`,
			bottom: playList.value.length ? '60px' : 0,
		};
	});

	/* 返回上一级 */
	function back() {
		router.back();
	}

	/* 正在滚动 */
	function onScroll(pos) {
		scrollY.value = -pos.y;
	}

	/* 顺序播放歌单歌曲 */
	function sequencePlayAll() {
		store.dispatch('playSequenceList', props.songs);
		/* 把当前模式存储到本地 */
		storage.setLocal('__mode__', 0);
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
			z-index: 20;
			position: absolute;
			top: 5px;
			left: 6px;
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
			left: 20%;
			width: 60%;
			z-index: 20;
			transform: translateZ(2px);
			@include no-wrap();
			text-align: center;
			line-height: 50px;
			font-size: $font-size-large;
			color: $color-text;
		}

		.list-fixed {
			z-index: 50;
			position: fixed;
			top: 50px;
			left: 0;
			visibility: hidden;
		}

		.bg-image {
			position: relative;
			width: 100%;
			height: 40%;
			transform-origin: top;
			background-size: cover;

			.play-btn-wrapper {
				z-index: 10;
				position: absolute;
				bottom: 20px;
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
			z-index: 0;
			position: absolute;
			bottom: 0;
			width: 100%;

			.song-list-wrapper {
				min-height: 350px;
				background: $color-background;
			}
		}
	}
</style>
