import axios from 'axios';

// const baseURL = 'https://autumnfish.cn';

// const ax = axios.create({
// 	baseURL: 'https://autumnfish.cn',
// 	withCredentials: true,
// });

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
