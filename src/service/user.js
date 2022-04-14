import { request } from './base.js';

// 获取用户歌单
// 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
// 必选参数 : uid : 用户 id
// 可选参数 :
// limit : 返回数量 , 默认为 30
// offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
// 接口地址 : /user/playlist

/* 以下用于登录后请求数据 */
/* 获取账号信息 */
export function getUserAccount(cookie) {
	return request({
		method: 'post',
		url: '/user/account',
		cookie,
	});
}

/* 获取用户信息 */
export function getUserSubcount(cookie) {
	return request({
		method: 'post',
		url: '/user/subcount',
		cookie,
	});
}

/* 获取用户等级信息 */
export function getUserLevel(cookie) {
	return request({
		method: 'post',
		url: '/user/level',
		cookie,
	});
}
