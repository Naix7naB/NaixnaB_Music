import { get } from './base.js';

export function getAllSinger() {
	const letterArr = ['热'],
		singerList = [],
		promiseArr = [];

	for (let i = 65; i < 91; i++) {
		letterArr.push(String.fromCharCode(i));
	}
	letterArr.forEach((item, index) => {
		promiseArr[index] = getSinger(item);
	});
	return Promise.all(promiseArr).then(res => {
		res.forEach((item, index) => {
			singerList[index] = {
				tag: letterArr[index],
				singers: item.artists,
			};
		});
		return singerList;
	});
}
// 接口地址: /artist/list
// 可选参数:
// limit: 返回数量
// offset: 偏移数量，用于分页
// initial: 按首字母索引查找参数, 热门传-1, #传 0
// type取值: -1:全部  1:男歌手  2:女歌手  3:乐队
// area取值: -1:全部  7华语  96欧美  8:日本  16韩国  0:其他
// 获取全部歌手 (按字母排序)
function getSinger(letter) {
	// 返回的结果是一个 Promise对象
	if (letter === '热') letter = -1;
	return get('/artist/list', {
		type: -1,
		area: -1,
		initial: letter,
	});
}

// 接口地址: /artists  必传 id
// 获取歌手单曲
export function getSingerMusic(id) {
	return get('/artists', {
		id,
	});
}
