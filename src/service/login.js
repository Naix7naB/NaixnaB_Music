import { request } from './base.js';

/* 检测手机号是否被注册 */
function checkExist(phone) {
	return request({
		method: 'post',
		url: '/cellphone/existence/check',
		data: { phone },
	});
}

/* 手机登录 */
export async function login_phone(params) {
	const { phone } = params;
	const res = await checkExist(phone);
	if (res.exist === -1) {
		return {
			code: 501,
			message: '账号不存在',
			msg: '账号不存在',
		};
	} else {
		return request({
			method: 'post',
			url: '/login/cellphone',
			data: { ...params },
		});
	}
}

/* 邮箱登录 */
export function login_email(params) {
	return request({
		method: 'post',
		url: '/login',
		data: { ...params },
	});
}

/* 发送验证码 */
export function sendCaptcha(phone) {
	return request({
		method: 'post',
		url: '/captcha/sent',
		data: { phone },
	});
}

/* 验证验证码 */
export function verifyCaptcha(params) {
	return request({
		method: 'post',
		url: '/captcha/verify',
		data: { ...params },
	});
}
