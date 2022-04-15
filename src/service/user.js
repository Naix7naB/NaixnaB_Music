import { request } from './base.js';

/* 获取用户歌单 */
function getUserPlaylist(params) {
	return request({
		method: 'post',
		url: '/user/playlist',
		data: { ...params },
	});
}

/* 统一获取用户信息 统一处理结果 */
async function getUserInfo(userId) {
	const vipInfo = await getVipInfo();
	const userDetail = await getUserDetail(userId);
	return {
		code: vipInfo.code,
		message: vipInfo.message,
		result: {
			userInfo: userDetail,
			vipInfo: vipInfo.data,
		},
	};
}

/* 获取用户详细信息 */
function getUserDetail(userId) {
	return request({
		method: 'post',
		url: '/user/detail',
		data: {
			uid: userId,
		},
	});
}

/* 获取账号信息 */
function getUserAccount() {
	return request({
		method: 'post',
		url: '/user/account',
	});
}

/* 获取用户VIP信息 */
function getVipInfo() {
	return request({
		method: 'post',
		url: '/vip/info',
	});
}

/* 获取用户信息 */
function getUserSubcount() {
	return request({
		method: 'post',
		url: '/user/subcount',
	});
}

/* 获取用户等级信息 */
function getUserLevel() {
	return request({
		method: 'post',
		url: '/user/level',
	});
}

export { getUserPlaylist, getUserInfo, getUserAccount };
