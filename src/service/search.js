import { request } from './base.js';

/* 获取默认搜索关键词 */
export function getDefaultSearch() {
	return request({
		method: 'get',
		url: '/search/default',
	});
}

/* 获取热门搜索列表 */
export function getHotSearch() {
	return request({
		method: 'get',
		url: '/search/hot/detail',
	});
}

/* 获取搜索结果 */
export function getSearchResult(query) {
	return request({
		method: 'get',
		url: '/search',
		params: {
			keywords: query,
		},
	});
}

/* 获取歌曲详细 */
export function getSearchSongDetail(item) {
	return request({
		method: 'get',
		url: '/song/detail',
		params: {
			ids: item.id,
		},
	});
}
