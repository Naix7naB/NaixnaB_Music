const mutations = {
	// 设置当前播放列表
	setCurPlayList(state, list) {
		state.curPlayList = list;
	},

	// 设置源歌曲播放列表
	setPlayList(state, list) {
		state.playList = list;
	},

	// 设置播放状态
	setPlayState(state, playState) {
		state.playState = playState;
	},

	// 设置播放模式
	setPlayMode(state, mode) {
		state.playMode = mode;
	},

	// 设置播放器样式
	setPlayerStyle(state, style) {
		state.playerStyle = style;
	},

	//设置播放索引值
	setCurPlayIndex(state, index) {
		state.curPlayIndex = index;
	},
};

export default mutations;
