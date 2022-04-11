import { get } from './base.js';

/* 获取默认搜索关键词 */
export function getDefaultSearch() {
	return get('/search/default');
}

/* 获取热门搜索列表 */
export function getHotSearch() {
	return get('/search/hot/detail');
}

/* 获取搜索结果 */
export function getSearchResult(query) {
	return get('/search', {
		keywords: query,
	});
}

/* 获取歌曲详细 */
export function getSearchSongDetail(item) {
	return get('/song/detail', {
		ids: item.id,
	});
}
