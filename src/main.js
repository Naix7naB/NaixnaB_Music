import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// 全局引入样式
import '@/assets/scss/index.scss';
// 全局引入插件
import { plugins } from '@/plugins';

createApp(App).use(store).use(router).use(plugins).mount('#app');
