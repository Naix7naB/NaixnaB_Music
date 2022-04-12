<template>
	<div class="search">
		<!-- 顶部搜索栏 -->
		<div class="search-top">
			<!-- 搜索栏 -->
			<div class="search-input">
				<i class="icon-search"></i>
				<input
					class="input-inner"
					v-model="query"
					:placeholder="_default.showKeyword"
				/>
				<i class="icon-dismiss" @click="clearQuery"></i>
			</div>
		</div>
		<!-- 历史记录 热搜榜 -->
		<Scroll class="search-content" v-load="!hots.length">
			<div class="content-wrapper">
				<!-- 历史记录 -->
				<div class="search-history">
					<h1 class="title">
						<span class="text">历史记录</span>
						<span class="clear" @click="clearHistory">
							<i class="icon-clear"></i>
						</span>
					</h1>
					<!-- 历史搜索歌曲 -->
					<ul>
						<li class="item" v-for="(item, index) in history" :key="index">
							<span>{{ item }}</span>
						</li>
					</ul>
				</div>
				<!-- 热搜榜 -->
				<div class="search-hot" @click.stop="inputQuery">
					<h1 class="title">热搜榜</h1>
					<ul>
						<li
							class="item"
							v-for="(item, idx) in hots"
							:key="idx"
							:data-idx="idx"
						>
							<!-- 序号 -->
							<span class="num" :style="{ color: idx < 3 ? '#EE4000' : '' }">
								{{ idx + 1 }}
							</span>
							<!-- 热搜词 -->
							<div class="content">
								<p class="name">
									<span>{{ item.searchWord }}</span>
									<img
										:src="item.iconUrl"
										v-if="item.iconUrl"
										:style="iconStyle(item.iconType)"
									/>
								</p>
								<p class="desc" v-if="item.content">{{ item.content }}</p>
							</div>
							<!-- 热度 -->
							<span class="score">{{ item.score }}</span>
						</li>
					</ul>
				</div>
			</div>
		</Scroll>
		<!-- 搜索列表 -->
		<div class="search-result" v-if="query.trim()">
			<Scroll class="result-wrapper" ref="searchResultRef">
				<ul @click="pickItem">
					<li
						class="item"
						v-for="(item, idx) in searchResult"
						:key="idx"
						:data-idx="idx"
					>
						<span>{{ item.name }}</span>
						&nbsp;
						<span>{{ handle(item) }}</span>
					</li>
				</ul>
			</Scroll>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, reactive, ref, watch } from 'vue';
	import { useStore } from 'vuex';
	import { storage } from '@/utils';
	import {
		getDefaultSearch,
		getHotSearch,
		getSearchResult,
		getSearchSongDetail,
	} from '@/service/search';
	import Scroll from '@/components/base/scroll';

	const store = useStore();

	const _default = reactive({
		showKeyword: '',
		realKeyword: '',
	});
	const history = ref([]);
	const hots = ref([]);
	const query = ref('');
	const searchResult = ref([]);
	const searchResultRef = ref(null);

	/* 监视搜索关键词 */
	watch(query, async (newQuery) => {
		/* 每次更新搜索词后自动滚动到最顶上 */
		// searchResultRef.value.scroll.scrollTo(0, 0);
		if (!newQuery.trim()) return;
		const { result } = await getSearchResult(newQuery);
		searchResult.value = result.songs;
	});

	/* 搜索当前点击内容 */
	function inputQuery(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.idx;
		const { searchWord } = hots.value[index];
		query.value = searchWord;
	}

	/* 搜索当前点击的歌曲 */
	async function pickItem(e) {
		const target = e.path.filter((item) => item.className === 'item')[0];
		const index = target.dataset.idx;
		const song = searchResult.value[index];
		search(song);
		setHistory(song.name);
	}

	/* 搜索歌曲 */
	async function search(song) {
		const { songs } = await getSearchSongDetail(song);
		store.dispatch('addOneSong', songs[0]);
	}

	/* 设置历史记录 */
	function setHistory(word) {
		history.value.unshift(word);
		/* 去重 */
		history.value = [...new Set(history.value)];
		/* 限制历史记录个数 */
		history.value.length = Math.min(10, history.value.length);
		storage.setLocal('__searchHistory__', history.value);
	}

	/* 清空历史记录 */
	function clearHistory() {
		history.value = [];
		storage.rmLocal('__searchHistory__');
	}

	/* 处理歌曲作者名称 */
	function handle(item) {
		return item.artists.map((item) => item.name).join(' & ');
	}

	/* 清空搜索内容 */
	function clearQuery() {
		query.value = '';
	}

	/* icon */
	function iconStyle(type) {
		const _style = {};
		if (type > 2) {
			_style.width = '12px';
			_style.height = '14px';
		}
		return _style;
	}

	onMounted(() => {
		getDefaultSearch().then((res) => {
			const { showKeyword, realkeyword } = res.data;
			_default.showKeyword = showKeyword;
			_default.realKeyword = realkeyword;
		});
		getHotSearch().then((res) => {
			hots.value = res.data;
		});
		/* 获取搜索历史 */
		if (!history.value.length) {
			const historyList = storage.getLocal('__searchHistory__', []);
			if (historyList.length) {
				history.value = historyList;
			}
		}
	});
</script>

<style lang="scss" scoped>
	.search {
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0;
		box-sizing: border-box;

		.search-top {
			display: flex;
			align-items: center;
			padding: 0 20px;
			height: 50px;

			.search-input {
				flex: 1;
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 0 6px;
				height: 32px;
				background: $color-highlight-background;
				border-radius: 20px;

				.icon-search {
					font-size: 24px;
					color: $color-text-d;
				}

				.input-inner {
					flex: 1;
					margin: 0 5px;
					line-height: 18px;
					background: $color-highlight-background;
					color: $color-text;
					font-size: $font-size-medium;
					outline: 0;

					&::placeholder {
						color: $color-text-d;
					}
				}

				.icon-dismiss {
					font-size: 16px;
					color: $color-text-d;
				}
			}
		}

		.search-content {
			position: absolute;
			top: 50px;
			bottom: 0;
			left: 20px;
			right: 20px;
			overflow: hidden;

			.content-wrapper {
				&::before {
					content: '';
					display: block;
					width: 100%;
					height: 25px;
				}

				.search-history {
					.title {
						display: flex;
						margin-bottom: 20px;

						.text {
							flex: 1;
							font-size: $font-size-medium-x;
							color: $color-text-ll;
						}
						.clear {
							font-size: $font-size-medium;
							color: $color-text-l;
						}
					}

					.item {
						display: inline-block;
						padding: 5px 12px;
						margin: 0 16px 10px 0;
						border-radius: 20px;
						background: $color-highlight-background;
						font-size: $font-size-medium;
						color: $color-text-l;
					}
				}

				.search-hot {
					position: relative;
					margin-top: 50px;

					.title {
						margin-bottom: 10px;
						font-size: $font-size-medium-x;
						color: $color-text-ll;
					}

					.item {
						display: flex;
						align-items: center;
						padding: 10px 0;
						line-height: 24px;

						.num {
							flex: 0 0 20px;
							text-align: center;
							font-weight: 600;
						}

						.content {
							flex: 1;
							min-width: 1px;
							padding: 0 36px 0 10px;

							.name {
								@include no-wrap();

								img {
									width: 20px;
									min-height: 10px;
									margin-left: 10px;
									vertical-align: 0px;
								}
							}

							.desc {
								@include no-wrap();
								font-size: $font-size-small;
								color: $color-text-l;
							}
						}

						.score {
							font-size: $font-size-small;
							color: $color-text-l;
						}
					}
				}
			}
		}

		.search-result {
			position: absolute;
			top: 50px;
			bottom: 0;
			color: $color-text-l;
			background-color: $color-background;
			width: 100%;

			.result-wrapper {
				position: absolute;
				bottom: 0;
				top: 10px;
				width: 100%;
				overflow: hidden;

				.item {
					padding: 5px 30px;
					height: 25px;
					font-size: $font-size-medium;
					@include no-wrap();

					span {
						&:first-child {
							color: $color-text;
						}
					}
				}
			}
		}
	}
</style>
