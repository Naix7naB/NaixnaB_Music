import { request } from './base.js';

/* 检测手机号是否被注册 */
function checkExist(data) {
	return request({
		method: 'post',
		url: '/cellphone/existence/check',
		data,
	});
}

/* 手机登录 */
async function login_phone(params) {
	const { phone } = params;
	const res = await checkExist({ phone });
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
function login_email(params) {
	return request({
		method: 'post',
		url: '/login',
		data: { ...params },
	});
}

/* 发送验证码 */
function sendCaptcha(phone) {
	return request({
		method: 'post',
		url: '/captcha/sent',
		data: { phone },
	});
}

/* 验证验证码 */
function verifyCaptcha(params) {
	return request({
		method: 'post',
		url: '/captcha/verify',
		data: { ...params },
	});
}

export { login_phone, login_email, sendCaptcha, verifyCaptcha };
