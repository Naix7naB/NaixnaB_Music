import { request } from './base.js';

/* 手机登录 */
export function login_phone(params) {
	return request({
		method: 'post',
		url: '/login/cellphone',
		data: {
			phone: params.userName,
			password: params.password,
		},
	});
}

/* 邮箱登录 */
export function login_email(params) {
	return request({
		method: 'post',
		url: '/login',
		data: {
			email: params.userName,
			password: params.password,
		},
	});
}
