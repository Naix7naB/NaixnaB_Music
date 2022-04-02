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
