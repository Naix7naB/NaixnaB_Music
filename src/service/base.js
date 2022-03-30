import axios from 'axios';

// 封装 axios发送请求
export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				params,
			})
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}
