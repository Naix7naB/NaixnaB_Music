const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
	transpileDependencies: true,
	css: {
		loaderOptions: {
			// sass 预加载
			sass: {
				additionalData: `
        @import '@/assets/scss/variable.scss';
        @import '@/assets/scss/mixin.scss';
        `,
			},
		},
	},
	lintOnSave: false,
	devServer: {
		proxy: 'https://autumnfish.cn/', // api请求地址
	},
});
// 'https://netease-cloud-music-api-naix7nab.vercel.app/'
