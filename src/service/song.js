import { request } from './base.js';

/* 获取歌曲的url */
export function getSongUrl(song) {
	return request({
		method: 'get',
		url: '/song/url',
		params: {
			id: song.id,
		},
	});
}

/* 获取歌词 */
export function getSongLyric(song) {
	return request({
		method: 'get',
		url: '/lyric',
		params: {
			id: song.id,
		},
	});
}
