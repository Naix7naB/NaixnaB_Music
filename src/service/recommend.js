import { request } from '@/service/base.js';

/* 获取轮播图 */
export function getBanner() {
	return request({
		method: 'get',
		url: '/banner',
		params: {
			type: 2,
		},
	});
}

/* 获取推荐歌单 */
export function getRecommendList() {
	return request({
		method: 'get',
		url: '/top/playlist',
		params: {
			limit: 30,
		},
	});
}

/* 获取歌单详细 */
export async function getAlbumMusic(item) {
	const { playlist } = await request({
		method: 'get',
		url: '/playlist/detail',
		params: {
			id: item.id,
		},
	});
	if (playlist.tracks.length === playlist.trackIds.length) {
		return {
			hotSongs: playlist.tracks,
		};
	}
	const trackIds = playlist.trackIds.map((item) => Number(item.id));
	let musicIds = [];
	if (trackIds.length > 50) musicIds = trackIds.slice(0, 50);
	const params = musicIds.join(',');
	return getSongDetail(params);
}

/* 获取歌曲详细 */
async function getSongDetail(data) {
	const res = await request({
		method: 'get',
		url: '/song/detail',
		params: {
			ids: data,
		},
	});
	return {
		hotSongs: res.songs,
	};
}
