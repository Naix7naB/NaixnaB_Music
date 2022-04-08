import { get } from './base.js';

/* 获取所有榜单 */
export function getTopList() {
	return get('/toplist/detail');
}
