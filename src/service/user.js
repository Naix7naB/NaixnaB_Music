import { request } from './base.js';

/* 获取用户歌单 */
export function getUserPlaylist(params) {
	return request({
		method: 'post',
		url: '/user/playlist',
		data: { ...params },
	});
}

/* 以下用于登录状态没过期时 免登陆请求数据 */
/* 统一获取用户信息 统一处理结果 */
export function getUserInfo(cookie) {
	return Promise.all([
		getUserAccount(cookie),
		getUserLevel(cookie),
		getUserSubcount(cookie),
	])
		.then((res) => {
			return {
				profile: res[0].profile,
				levelInfo: res[1].data,
				subcount: res[2],
			};
		})
		.catch((err) => {
			throw new Error(err);
		});
}

/* 获取账号信息 */
function getUserAccount(cookie) {
	return request({
		method: 'post',
		url: '/user/account',
		cookie,
	});
}

/* 获取用户信息 */
function getUserSubcount(cookie) {
	return request({
		method: 'post',
		url: '/user/subcount',
		cookie,
	});
}

/* 获取用户等级信息 */
function getUserLevel(cookie) {
	return request({
		method: 'post',
		url: '/user/level',
		cookie,
	});
}
