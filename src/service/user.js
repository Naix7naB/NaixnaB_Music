import { request } from './base.js';

/* 获取用户歌单 */
function getUserPlaylist(params) {
	return request({
		method: 'get',
		url: '/user/playlist',
		params,
	});
}

/* 获取用户关注 */
export function getFollows(params) {
	return request({
		method: 'get',
		url: '/user/follows',
		params,
	});
}

/* 获取用户粉丝 */
export function getFolloweds(params) {
	return request({
		method: 'get',
		url: '/user/followeds',
		params,
	});
}

/**获取用户播放记录
 * 必选参数: uid
 * 可选参数: type: type=1 weekData, type=0 allData
 * 接口地址: /user/record
 */

/**获取已喜欢音乐
 * 必选参数: uid
 * 接口地址: /likelist
 */

/**获取云盘数据
 * 可选参数: limit offset
 * 接口地址: /user/cloud
 */

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

export { getUserPlaylist, getUserInfo, getUserAccount };
