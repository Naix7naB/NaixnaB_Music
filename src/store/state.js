const state = {
	// 当前播放列表
	curPlayList: [],

	// 源播放列表
	playList: [],

	//当前的播放索引值
	curPlayIndex: 0,

	// 播放状态 [0 off] [1 on]
	playState: 0,

	// 播放模式: [0 顺序播放] [1 单曲循环]  [2 随机播放]
	playMode: 0,

	// 播放器样式 [0 mini] [1 full]
	playerStyle: 1,
};

export default state;
