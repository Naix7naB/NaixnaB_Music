import { createRouter, createWebHistory } from 'vue-router';

const Recommend = () => import('@/views/Recommend.vue');
const Singer = () => import('@/views/Singer.vue');
const TopList = () => import('@/views/TopList.vue');
const Search = () => import('@/views/Search.vue');

const routes = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    component: Recommend,
  },
  {
    path: '/singer',
    component: Singer,
  },
  {
    path: '/toplist',
    component: TopList,
  },
  {
    path: '/search',
    component: Search,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
