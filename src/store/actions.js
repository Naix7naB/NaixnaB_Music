const actions = {
	/* 添加一首歌到播放列表 */
	addOneSong({ commit, state }, song) {
		const playList = state.playList.slice();
		const curPlayList = state.curPlayList.slice();
		/* 如果点击的歌曲是同一个歌单内的 则不重复添加 直接跳转到歌曲索引值 */
		let curPlayIndex = state.curPlayIndex;
		/* 查找当前点击歌曲 在当前播放列表中的索引值 不存在则返回 -1 */
		let existIndex = findInd(curPlayList, song);
		/* 在当前播放歌曲后面 添加当前点击歌曲 */
		curPlayList.splice(curPlayIndex + 1, 0, song);
		if (existIndex === -1) {
			/* 当前点击歌曲不存在当前播放列表时 */
			/* playList.unshift(song); */
			curPlayIndex++;
		} else {
			/* 当前点击歌曲存在当前播放列表时 */
			if (curPlayIndex < existIndex) {
				/* 歌曲存在当前播放歌曲 之后 */
				curPlayList.splice(existIndex + 1, 1);
				curPlayIndex++;
			} else {
				/* 歌曲存在当前播放歌曲 之前 */
				curPlayList.splice(existIndex, 1);
			}
		}
		/* 边界情况 只有一首歌曲时 并且添加的歌曲是同一首歌曲 */
		if (curPlayList.length === 1) {
			curPlayIndex = 0;
		}
		/* 设置当前歌曲播放列表 */
		commit('setCurPlayList', curPlayList);
		/* 设置当前播放索引值 */
		commit('setCurPlayIndex', curPlayIndex);
		/* 设置播放器样式 */
		commit('setPlayerStyle', 1);
	},

	/* 添加整个歌单到播放列表 */
	addWholeList({ commit }, list) {
		/* 设置源歌曲播放列表 */
		commit('setPlayList', list);
		/* 设置当前歌曲播放列表 */
		commit('setCurPlayList', list);
	},

	/* 顺序播放列表 */
	playSequenceList({ commit }, list) {
		/* 设置源歌曲播放列表 */
		commit('setPlayList', list);
		/* 设置当前歌曲播放列表 */
		commit('setCurPlayList', list);
		/* 设置当前播放索引值 */
		commit('setCurPlayIndex', 0);
		/* 设置当前歌曲播放状态 */
		commit('setPlayState', 1);
		/* 设置播放模式 */
		commit('setPlayMode', 0);
		/* 设置播放器样式 */
		commit('setPlayerStyle', 1);
	},

	/* 更改播放模式 */
	changeMode({ commit, state, getters }, mode) {
		// 获取当前播放歌曲
		const currentSong = getters.currentSong;
		if (mode === 2) {
			// 随机播放  把当前播放列表换成打乱后的播放列表
			commit('setCurPlayList', shuffle(state.curPlayList));
		} else {
			// 顺序播放和单曲循环
			commit('setCurPlayList', state.curPlayList);
		}
		const index = findInd(state.curPlayList, currentSong);
		commit('setCurPlayIndex', index);
		commit('setPlayMode', mode);
	},

	/* 删除一首歌曲 */
	removeSong() {},

	/* 清空播放列表 */
	clearSongList() {},
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
