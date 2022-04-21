import { request } from './base.js';

/* 获取歌曲的url */
function getSongUrl(params) {
	return request({
		method: 'get',
		url: '/song/url',
		params,
	});
}

/* 获取歌词 */
function getSongLyric(params) {
	return request({
		method: 'get',
		url: '/lyric',
		params,
	});
}

export { getSongUrl, getSongLyric };
