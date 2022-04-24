const actions = {
	/*  */

	/* 添加一首歌到播放列表 */
	addOneSong({ commit, state }, song) {
		const playList = state.playList.slice();
		const curPlayList = state.curPlayList.slice();
		let curPlayIndex = state.curPlayIndex;
		if (!playList.length || !curPlayList.length) {
			/* 如果当前播放列表没有歌曲 则把歌曲直接添加到播放列表 */
			playList.push(song);
			curPlayList.push(song);
		} else {
			/* 查找当前点击歌曲 在当前播放列表中的索引值 不存在则返回 -1 */
			let existIndex = findInd(curPlayList, song);
			/* 在当前播放歌曲后面添加当前点击歌曲 */
			playList.splice(curPlayIndex + 1, 0, song);
			curPlayList.splice(curPlayIndex + 1, 0, song);
			if (existIndex === -1) {
				/* 当前点击歌曲不存在当前播放列表时 */
				curPlayIndex++;
			} else {
				/* 当前点击歌曲存在当前播放列表时 */
				if (curPlayList[existIndex].id === song.id) {
					/* 如果添加的是同一首歌 */
					commit('setPlayerStyle', 1);
				}
				if (curPlayIndex < existIndex) {
					/* 歌曲存在当前播放歌曲 之后 */
					playList.splice(existIndex + 1, 1);
					curPlayList.splice(existIndex + 1, 1);
					curPlayIndex++;
				} else {
					/* 歌曲存在当前播放歌曲 之前 */
					playList.splice(existIndex, 1);
					curPlayList.splice(existIndex, 1);
				}
			}
		}
		/* 设置源歌曲播放列表 */
		commit('setPlayList', playList);
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

	/* 获取当前点击歌曲的索引 */
	getCurPlayIndex({ commit, state }, { index, type }) {
		const playList = state.playList.slice();
		const curPlayList = state.curPlayList.slice();
		const song = playList[index];
		const curIndex = findInd(curPlayList, song);
		/* 设置播放歌曲的索引 */
		commit('setCurPlayIndex', curIndex);
		type ? commit('setPlayerStyle', 1) : commit('setPlayerStyle', 0);
	},

	/* 顺序播放列表 */
	playSequenceList({ commit }, list) {
		/* 设置源歌曲播放列表 */
		commit('setPlayList', list);
		/* 设置当前歌曲播放列表 */
		commit('setCurPlayList', list);
		/* 设置当前播放索引值 */
		commit('setCurPlayIndex', 0);
		/* 设置当前播放状态 */
		commit('setPlayState', 1);
		/* 设置播放模式 */
		commit('setPlayMode', 0);
		/* 设置播放器样式 */
		commit('setPlayerStyle', 1);
	},

	/* 更改播放模式 */
	changeMode({ commit, state, getters }, mode) {
		/* 获取当前播放歌曲 */
		const currentSong = getters.currentSong;
		if (mode === 2) {
			/* 随机播放  把当前播放列表换成打乱后的播放列表 */
			commit('setCurPlayList', shuffle(state.curPlayList));
		} else {
			/* 顺序播放和单曲循环 */
			commit('setCurPlayList', state.curPlayList);
		}
		const index = findInd(state.curPlayList, currentSong);
		commit('setCurPlayIndex', index);
		commit('setPlayMode', mode);
	},

	/* 删除一首歌曲 */
	removeSong({ commit, state }, song) {
		const playList = state.playList.slice();
		const curPlayList = state.curPlayList.slice();
		let curPlayIndex = state.curPlayIndex;
		/* 找到需要被删除歌曲的 对应索引 */
		const oriIndex = findInd(playList, song);
		const curIndex = findInd(curPlayList, song);
		/* 没找到该歌曲 */
		if (oriIndex < 0 || curIndex < 0) return;
		/* 找到该歌曲 删除 */
		playList.splice(oriIndex, 1);
		curPlayList.splice(curIndex, 1);
		if (curIndex < curPlayIndex) {
			/* 删除的歌曲在当前播放歌曲之前 */
			curPlayIndex--;
		}
		if (curPlayList.length === curPlayIndex) {
			/* 删除的是当前播放歌曲 且是最后一项 */
			curPlayIndex = 0;
		}
		commit('setPlayList', playList);
		commit('setCurPlayList', curPlayList);
		commit('setCurPlayIndex', curPlayIndex);
		/* 删除后 歌曲列表为空 */
		if (!curPlayList.length) {
			commit('setPlayState', false);
		}
	},

	/* 清空播放列表 */
	clearSongList({ commit }) {
		commit('setPlayList', []);
		commit('setCurPlayList', []);
		commit('setCurPlayIndex', 0);
		commit('setPlayState', 0);
	},
};

/* 返回 return为 true时的 index下标  如果都不满足 -1 */
function findInd(list, song) {
	return list.findIndex((item) => item.id === song.id);
}

/* 把列表随机打乱 */
function shuffle(list) {
	const shuffleArr = list.slice();
	shuffleArr.sort(() => {
		return Math.random() - 0.5;
	});
	return shuffleArr;
}

export default actions;
