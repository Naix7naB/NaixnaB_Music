export default (lyric) => {
	const arr = lyric.split('\n');

	const result = arr.reduce((prev, cur) => {
		if (cur !== '') {
			const obj = {};
			const temp = cur.replace('[', '').split(']');
			if (temp.length === 1) {
				prev[0] = { content: '**** 该歌曲不支持歌词滚动 ****' };
				obj.content = temp[0].trim();
				prev.push(obj);
			} else {
				/* 歌词不为空 */
				if (temp[1].trim()) {
					/* 处理歌词时间 */
					const timeArr = temp[0].split(':');
					const first = Number(timeArr[0]) * 60;
					const second = Number(timeArr[1]);
					const timeVal = (first + second).toFixed(3) / 1;
					/* 处理返回的格式 */
					obj.time = timeVal;
					obj.content = temp[1].trim();
					prev.push(obj);
				}
			}
		}
		return prev;
	}, []);

	return result;
};
