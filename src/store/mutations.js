const mutations = {
	/* 设置登录标识 */
	setLoginState(state, isLogin) {
		state.isLogin = isLogin;
	},

	/* 设置用户 id */
	setUserId(state, uid) {
		state.uid = uid;
	},

	/* 设置当前播放列表 */
	setCurPlayList(state, list) {
		state.curPlayList = list;
	},

	/* 设置源歌曲播放列表 */
	setPlayList(state, list) {
		state.playList = list;
	},

	/* 设置播放索引值 */
	setCurPlayIndex(state, index) {
		state.curPlayIndex = index;
	},

	/* 设置播放状态 */
	setPlayState(state, playState) {
		state.playState = playState;
	},

	/* 设置播放模式 */
	setPlayMode(state, mode) {
		state.playMode = mode;
	},

	/* 设置我喜欢歌曲列表 */
	setFavoriteList(state, list) {
		state.favoriteList = list;
	},

	/* 设置历史播放列表 */
	setHistoryList(state, list) {
		state.historyList = list;
	},

	/* 设置播放器样式 */
	setPlayerStyle(state, style) {
		state.playerStyle = style;
	},
};

export default mutations;
