import axios from 'axios';

// const baseURL = 'https://autumnfish.cn';

/* 封装 axios发送请求 */
export function request(params) {
	return new Promise((resolve, reject) => {
		axios({
			...params,
		})
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
