const actions = {
	// 添加一首歌到播放列表
	addOneSong({ commit, state }, index) {},

	// 添加歌单所有歌曲到播放列表
	addWholeList({ commit }, data) {
		const { list, index } = data;
		/* 设置当前歌曲播放状态 */
		commit('setPlayState', 1);
		/* 设置源歌曲播放列表 */
		commit('setPlayList', list);
		/* 设置当前歌曲播放列表 */
		commit('setCurPlayList', list);
		/* 设置当前播放索引值 */
		commit('setCurPlayIndex', index);
		/* 设置播放器样式 */
		commit('setPlayerStyle', 1);
	},

	// 更改播放模式
	changeMode({ state, commit }, mode) {
		if (mode === 2) {
			// 随机播放  把当前播放列表换成打乱后的播放列表
			commit('setCurPlayList', shuffle(state.playList));
		} else {
			// 顺序播放和单曲循环
			commit('setCurPlayList', state.playList);
		}
	},
};

// 返回 return为 true时的 index下标  如果都不满足 -1
function findInd(list, song) {
	return list.findIndex((item) => item.id === song.id);
}

// 把列表随机打乱
function shuffle(list) {
	const shuffleArr = list.slice();
	shuffleArr.sort(() => {
		return Math.random() - 0.5;
	});
	return shuffleArr;
}

export default actions;
