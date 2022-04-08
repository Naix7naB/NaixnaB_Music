import { get } from '@/service/base.js';

/* 获取轮播图 */
export function getBanner() {
	return get('/banner', {
		type: 2,
	});
}

/* 获取推荐歌单 */
export function getRecommendList() {
	return get('/top/playlist', {
		limit: 30,
	});
}

/* 获取歌单详细 */
export async function getAlbumMusic(item) {
	const { playlist } = await get('/playlist/detail', {
		id: item.id,
	});
	const trackIds = playlist.trackIds.map((item) => Number(item.id));
	let musicIds = [];
	if (trackIds.length > 50) musicIds = trackIds.slice(0, 50);
	const params = musicIds.join(',');
	return getSongDetail(params);
}

/* 获取歌曲详细 */
async function getSongDetail(params) {
	const res = await get('/song/detail', {
		ids: params,
	});
	return {
		hotSongs: res.songs,
	};
}
