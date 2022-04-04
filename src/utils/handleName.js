/* 处理歌曲作者名 */
export default (song) => {
	const ar = song.ar;
	const artists = ar.map((artist) => artist.name);
	return artists.join(' / ');
};
