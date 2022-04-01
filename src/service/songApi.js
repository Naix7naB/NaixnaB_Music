import { get } from './base.js';

// 获取音乐 url
export function getSongUrl(song) {
	checkMusic(song).then((res) => {
		if (!res.success) return res.message;
	});
	return get('/song/url', {
		id: song.id,
	});
}

// 获取歌词
export function getSongLyric(song) {
	return get('/lyric', {
		id: song.id,
	});
}

// 音乐是否可用
function checkMusic(song) {
	return get('/check/music', {
		id: song.id,
	});
}
