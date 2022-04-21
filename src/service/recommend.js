import { request } from '@/service/base.js';

/* 获取轮播图 */
function getBanner(params) {
	return request({
		method: 'get',
		url: '/banner',
		params,
	});
}

/* 获取推荐歌单 */
function getRecommendList(params) {
	return request({
		method: 'get',
		url: '/top/playlist',
		params,
	});
}

/* 获取歌单详细 */
async function getAlbumMusic(params) {
	const { playlist } = await request({
		method: 'get',
		url: '/playlist/detail',
		params,
	});
	if (playlist.tracks.length === playlist.trackIds.length) {
		return {
			hotSongs: playlist.tracks,
		};
	}
	const trackIds = playlist.trackIds.map((item) => Number(item.id));
	let musicIds = [];
	if (trackIds.length > 50) musicIds = trackIds.slice(0, 50);
	const ids = musicIds.join(',');
	return getSongDetail({ ids });
}

/* 获取每日推荐歌曲 */
async function getDailySongs() {
	const { data } = await request({
		method: 'get',
		url: '/recommend/songs',
	});
	let musicIds = [];
	data.dailySongs.forEach((item) => {
		musicIds.push(Number(item.id));
	});
	const ids = musicIds.join(',');
	return {
		reasons: data.recommendReasons,
		...getSongDetail({ ids }),
	};
}

/* 获取歌曲详细 */
async function getSongDetail(params) {
	const { songs } = await request({
		method: 'get',
		url: '/song/detail',
		params,
	});
	return {
		hotSongs: songs,
	};
}

export {
	getBanner,
	getRecommendList,
	getAlbumMusic,
	getDailySongs,
	getSongDetail,
};
