module.exports = {
	css: {
		loaderOptions: {
			// sass 预加载
			sass: {
				prependData: `
        @import '@/assets/scss/variable.scss';
        @import '@/assets/scss/mixin.scss';
        `,
			},
		},
	},
	lintOnSave: false,
	devServer: {
		proxy: 'https://netease-cloud-music-api-naix7nab.vercel.app/', // api请求地址
	},
};
// 'https://autumnfish.cn/'
// 'https://netease-cloud-music-api-naix7nab.vercel.app/'
