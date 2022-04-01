import { createLogger, createStore } from 'vuex';
import state from './state';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const debug = process.env.NODE_ENV !== 'production';
// true是 开发模式   false 生产模式

export default createStore({
	state,
	actions,
	mutations,
	getters,
	strict: debug, //严格模式 除 mutations之外的函数修改state内的数据 都是不允许的
	plugins: debug ? [createLogger()] : [], // 每一次修改 生成快照 追踪数据状态
});
