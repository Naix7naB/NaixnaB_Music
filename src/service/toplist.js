import { request } from './base.js';

/* 获取所有榜单 */
export function getTopList() {
	return request({
		method: 'get',
		url: '/toplist/detail',
	});
}
