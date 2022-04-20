import axios from 'axios';

// const baseURL = 'https://autumnfish.cn';

// const ax = axios.create({
// 	baseURL: 'https://netease-cloud-music-api-naix7nab.vercel.app/',
// 	withCredentials: true,
// 	timeout: 5000,
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
