<template>
	<Scroll class="singer-list" :probeType="3" @onScroll="onScroll" ref="rootRef">
		<!-- 歌手列表 -->
		<ul class="view-scroll" ref="groupRef" @click="getSingerDetail">
			<li
				class="group"
				v-for="(group, index) in singerList"
				:key="group.tag"
				:data-gindex="index"
			>
				<h2 class="title">{{ group.tag }}</h2>
				<ul>
					<li
						class="item"
						v-for="(item, index) in group.singers"
						:key="item.id"
						:data-sindex="index"
					>
						<div class="avatar">
							<img v-img-lazy="item.picUrl" />
						</div>
						<span class="name">{{ item.name }}</span>
					</li>
				</ul>
			</li>
		</ul>
		<!-- 固定标签栏 -->
		<div class="fixed" v-if="curTag" :style="fixedStyle">
			<div class="fixed-title">{{ curTag }}</div>
		</div>
		<!-- 快捷访问侧边栏 -->
		<div class="shortcut">
			<!-- 通过事件委托进行绑定事件 -->
			<ul
				@touchstart.stop="onShortCutTouchStart"
				@touchmove.stop="onShortCutTouchMove"
			>
				<li
					class="item"
					v-for="(item, index) in singerList"
					:key="index"
					:data-index="index"
					:class="{ current: curIndex === index }"
				>
					{{ item.tag }}
				</li>
			</ul>
		</div>
	</Scroll>
</template>

<script setup>
	import Scroll from '@/components/base/scroll';
	import { handleFixed } from './fixedBar';
	import { useShortCut } from './shortCut';

	const emit = defineEmits(['toDetail']);
	const props = defineProps({
		singerList: {
			type: [Array, Object],
		},
	});
	const { groupRef, onScroll, curTag, curIndex, fixedStyle } =
		handleFixed(props);
	const { rootRef, onShortCutTouchStart, onShortCutTouchMove } =
		useShortCut(groupRef);

	/* 点击歌手 获取当前歌手的详细信息 */
	function getSingerDetail(e) {
		let curNode = e.target;
		const I = {};
		while (1) {
			if (curNode.className === 'item') {
				I.sindex = curNode.dataset.sindex;
			} else if (curNode.className === 'group') {
				I.gindex = curNode.dataset.gindex;
				break;
			}
			curNode = curNode.parentNode;
		}
		// 获取当前点击的歌手id
		const item = props.singerList[I.gindex].singers[I.sindex];
		emit('toDetail', item);
	}
</script>

<style lang="scss" scoped>
	.singer-list {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: $color-background;

		.group {
			padding-bottom: 30px;

			.title {
				height: 30px;
				line-height: 30px;
				padding-left: 20px;
				font-size: $font-size-small;
				color: $color-text-l;
				background: $color-highlight-background;
			}

			.item {
				display: flex;
				align-items: center;
				padding: 20px 0 0 30px;

				.avatar {
					position: relative;
					width: 50px;
					height: 50px;
					border-radius: 50%;
					overflow: hidden;

					img {
						position: absolute;
						width: 130%;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.name {
					margin-left: 20px;
					color: $color-text-l;
					font-size: $font-size-medium;
				}
			}
		}

		.fixed {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;

			.fixed-title {
				height: 30px;
				line-height: 30px;
				padding-left: 20px;
				font-size: $font-size-small;
				color: $color-text-l;
				background: $color-highlight-background;
			}
		}

		.shortcut {
			position: absolute;
			right: 4px;
			top: 50%;
			transform: translateY(-50%);
			width: 20px;
			padding: 20px 0;
			border-radius: 10px;
			text-align: center;
			background: $color-background-d;
			font-family: Helvetica;

			.item {
				padding: 3px;
				line-height: 1;
				color: $color-text-l;
				font-size: $font-size-small;

				&.current {
					// 高亮 当前区间的 字母高亮
					color: $color-theme;
				}
			}
		}
	}
</style>
