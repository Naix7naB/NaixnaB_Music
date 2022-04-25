import { request } from './base.js';
import { getSongDetail } from './recommend';

/* 获取用户歌单 */
function getUserPlaylist(params) {
	return request({
		method: 'get',
		url: '/user/playlist',
		params,
	});
}

/* 获取用户关注 */
function getFollows(params) {
	return request({
		method: 'get',
		url: '/user/follows',
		params,
	});
}

/* 获取用户粉丝 */
function getFolloweds(params) {
	return request({
		method: 'get',
		url: '/user/followeds',
		params,
	});
}

/* 获取已喜欢音乐 */
async function getLikeList(params) {
	const { ids } = await request({
		method: 'get',
		url: '/likelist',
		params,
	});
	let songs = null;
	if (ids.length) {
		const musicIds = ids.join(',');
		const { hotSongs } = await getSongDetail({ ids: musicIds });
		songs = hotSongs;
	} else {
		songs = ids;
	}
	return {
		favoriteSongs: songs,
	};
}

/* 获取收藏的专辑 */
function getCollectAlbum() {
	return request({
		method: 'get',
		url: '/album/sublist',
	});
}

/* 获取收藏专辑的歌曲 */
async function getMyAlbumMusic(params) {
	const { songs } = await request({
		method: 'get',
		url: '/album',
		params,
	});
	const musicIds = [];
	songs.forEach((item) => {
		musicIds.push(Number(item.id));
	});
	const ids = musicIds.join(',');
	return getSongDetail({ ids });
}

/* 获取用户播放记录 (听歌排行) */
function getUserRecord(params) {
	return request({
		method: 'get',
		url: '/user/record',
		params,
	});
}

/* 统一获取用户信息 统一处理结果 */
async function getUserInfo(params) {
	const vipInfo = await getVipInfo();
	const { level, profile } = await getUserDetail(params);
	profile.level = level;
	return {
		code: vipInfo.code,
		message: vipInfo.message,
		result: {
			profile,
			vipInfo: vipInfo.data,
		},
	};
}

/* 获取用户详细信息 */
function getUserDetail(params) {
	return request({
		method: 'get',
		url: '/user/detail',
		params,
	});
}

/* 获取账号信息 */
function getUserAccount() {
	return request({
		method: 'get',
		url: '/user/account',
	});
}

/* 获取用户VIP信息 */
function getVipInfo() {
	return request({
		method: 'get',
		url: '/vip/info',
	});
}

export {
	getUserPlaylist,
	getUserInfo,
	getUserAccount,
	getFollows,
	getFolloweds,
	getLikeList,
	getCollectAlbum,
	getMyAlbumMusic,
	getUserRecord,
};
