import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'vue-cookie';
import storage from '@/plugins/storage';

const Recommend = () => import('@/views/Recommend.vue');
const AlbumDetail = () => import('@/views/AlbumDetail.vue');
const Singer = () => import('@/views/Singer.vue');
const SingerDetail = () => import('@/views/SingerDetail.vue');
const TopList = () => import('@/views/TopList.vue');
const TopListDetail = () => import('@/views/TopListDetail.vue');
const Search = () => import('@/views/Search.vue');
const Login = () => import('@/views/Login.vue');
const UserCenter = () => import('@/views/UserCenter.vue');
const UserExhibitDetail = () => import('@/views/UserExhibitDetail.vue');
const UserAlbumDetail = () => import('@/views/UserAlbumDetail.vue');

const Test = () => import('@/views/Test.vue');

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
		component: UserCenter,
		meta: { authRequired: true },
		children: [
			{
				path: ':id',
				component: AlbumDetail,
			},
			{
				path: '/user/exhibit',
				component: UserExhibitDetail,
				children: [
					{
						path: ':id',
						component: UserAlbumDetail,
					},
				],
			},
		],
	},
	{
		path: '/login',
		component: Login,
	},
	{
		path: '/test',
		component: Test,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

/* 路由前置守卫 */
router.beforeEach((to, from, next) => {
	if (!to.meta.authRequired) {
		next();
	} else {
		const token =
			storage.getLocal('__token__', '') || Cookies.get('MUSIC_U') || '';
		if (!token) {
			/* 没有登录 或 登录过期 */
			next('/login');
		} else {
			next();
		}
	}
});

export default router;
