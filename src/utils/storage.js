export default {
	/* 会话存储 (临时存储) */
	getSession(key, type) {
		let val = JSON.parse(sessionStorage.getItem(key));
		if (!val) val = type;
		return val;
	},
	setSession(key, value) {
		sessionStorage.setItem(key, JSON.stringify(value));
	},
	rmSession(key) {
		sessionStorage.removeItem(key);
	},

	/* 本地存储 (永久存储) */
	getLocal(key, type) {
		let val = JSON.parse(localStorage.getItem(key));
		if (!val) val = type;
		return val;
	},
	setLocal(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	rmLocal(key) {
		localStorage.removeItem(key);
	},
};
