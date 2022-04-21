import { request } from './base.js';

/* 获取默认搜索关键词 */
function getDefaultSearch() {
	return request({
		method: 'get',
		url: '/search/default',
	});
}

/* 获取热门搜索列表 */
function getHotSearch() {
	return request({
		method: 'get',
		url: '/search/hot/detail',
	});
}

/* 获取搜索结果 */
function getSearchResult(params) {
	return request({
		method: 'get',
		url: '/search',
		params,
	});
}

/* 获取歌曲详细 */
function getSearchSongDetail(params) {
	return request({
		method: 'get',
		url: '/song/detail',
		params,
	});
}

export { getDefaultSearch, getHotSearch, getSearchResult, getSearchSongDetail };
