export default (interval) => {
	// 256.032s
	/** 我自己写的方法
	 *  let min = Math.floor(interval / 60);
	 * 	let sec = Math.round(interval % 60);
	 * 	if (min / 10 < 1) min = '0' + min; // 歌曲分钟数 小于10分钟
	 * 	if (sec / 10 < 1) sec = '0' + sec; // 歌曲秒数 小于10秒
	 */

	/* 很妙的方法 */
	interval = interval | 0;
	const min = (((interval / 60) | 0) + '').padStart(2, '0');
	const sec = ((interval % 60) + '').padStart(2, '0');
	const result = min + ':' + sec;
	return result;
};
