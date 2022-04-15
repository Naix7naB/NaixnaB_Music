<template>
	<div class="user" v-load="userInfo === {}">
		<UserCenter :profile="userInfo.profile"></UserCenter>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';
	import { getUserInfo } from '@/service/user';
	import storage from '@/plugins/storage';
	import Cookies from 'vue-cookie';
	import UserCenter from '@/components/userCenter';

	const store = useStore();
	const router = useRouter();

	const userInfo = ref({});

	onMounted(() => {
		const isLogin = storage.getLocal('__isLogin__', '') || store.state.isLogin;
		const token = storage.getLocal('__token__', '') || Cookies.get('MUSIC_U');
		if (!isLogin || !token) {
			/* 没有登录 或 登录过期 */
			router.push('/login');
		} else {
			const info = storage.getLocal('__userInfo__', null);
			if (info) {
				userInfo.value = info;
			} else {
				/* 是登录状态就携带token发送请求即可获取用户信息 */
				getUserInfo(token).then((res) => {
					userInfo.value = res;
					storage.setLocal('__userInfo__', res);
				});
			}
			store.commit('setLoginState', true);
		}
	});
</script>

<style lang="scss" scoped>
	.user {
		z-index: 1;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
</style>
