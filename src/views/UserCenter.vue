<template>
	<div class="user-center">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
	</div>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { storage } from '@/utils';
	import {
		getUserAccount,
		getUserSubcount,
		getUserLevel,
	} from '@/service/user';
	import Cookies from 'vue-cookie';

	const router = useRouter();

	/* 返回上一级 */
	function back() {
		router.push('/');
	}

	onMounted(async () => {
		const cookie = Cookies.get('MUSIC_U') || storage.getLocal('__token__', '');
		if (!cookie) {
			/* token 或 cookie 为空就重定向到login页面 */
			router.push('/login');
		} else {
			/* 有值的话 不需要登录 携带cookie发送请求即可获取用户信息 */
			/* 账号信息 */
			const { profile } = await getUserAccount(cookie);
			/* 账号等级 */
			const { data } = await getUserLevel(cookie);
			/* 用户信息、MV数量、创建歌单数量、收藏歌单数量 */
			const subcount = await getUserSubcount(cookie);
		}
	});
</script>

<style lang="scss" scoped>
	.user-center {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 100;
		width: 100%;
		background-color: $color-background;

		.back {
			position: absolute;
			top: 0;
			left: 6px;
			z-index: 50;

			.icon-back {
				display: block;
				padding: 10px;
				font-size: $font-size-large-x;
				color: $color-theme;
			}
		}
	}
</style>
