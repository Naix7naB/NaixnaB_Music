const getters = {
	//获取当前播放的歌曲对象
	currentSong(state) {
		return state.curPlayList[state.curPlayIndex] || {};
	},
};

export default getters;
