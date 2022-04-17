import { request } from './base.js';

/* 获取用户歌单 */
function getUserPlaylist(data) {
	return request({
		method: 'post',
		url: '/user/playlist',
		data,
	});
}

/* 统一获取用户信息 统一处理结果 */
async function getUserInfo(data) {
	const vipInfo = await getVipInfo();
	const { level, profile } = await getUserDetail(data);
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
function getUserDetail(data) {
	return request({
		method: 'post',
		url: '/user/detail',
		data,
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

export { getUserPlaylist, getUserInfo, getUserAccount };
