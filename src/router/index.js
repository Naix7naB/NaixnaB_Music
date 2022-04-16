import { createRouter, createWebHistory } from 'vue-router';

const Recommend = () => import('@/views/Recommend.vue');
const AlbumDetail = () => import('@/views/AlbumDetail.vue');
const Singer = () => import('@/views/Singer.vue');
const SingerDetail = () => import('@/views/SingerDetail.vue');
const TopList = () => import('@/views/TopList.vue');
const TopListDetail = () => import('@/views/TopListDetail.vue');
const Search = () => import('@/views/Search.vue');
const Login = () => import('@/views/Login.vue');
const User = () => import('@/views/User.vue');
const UserCenter = () => import('@/views/UserCenter.vue');

const routes = [
	{
		path: '/',
		redirect: '/recommend',
	},
	{
		path: '/recommend',
		component: Recommend,
		children: [
			{
				path: ':id',
				component: AlbumDetail,
			},
		],
	},
	{
		path: '/singer',
		component: Singer,
		children: [
			{
				path: ':id',
				component: SingerDetail,
			},
		],
	},
	{
		path: '/toplist',
		component: TopList,
		children: [
			{
				path: ':id',
				component: TopListDetail,
			},
		],
	},
	{
		path: '/search',
		component: Search,
	},
	{
		path: '/user',
		component: User,
		children: [
			{
				path: '/user/center',
				component: UserCenter,
			},
		],
	},
	{
		path: '/login',
		component: Login,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
