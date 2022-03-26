const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        @import '@/assets/scss/variable.scss';
        @import '@/assets/scss/mixin.scss';
        `
      }
    }
  },
  lintOnSave: false,
  devServer: {
    proxy: 'https://autumnfish.cn/' // api请求地址
  }
});
