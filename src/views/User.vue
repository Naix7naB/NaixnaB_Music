<template>
	<div class="user">
		<Confirm
			ref="confirmRef"
			text="请先登录后操作"
			confirmText="登录"
			@confirm="confirm"
			@cancel="cancel"
		></Confirm>
		<!-- vue3 路由组件添加 transition/keep-alive -->
		<router-view :userInfo="userInfo" :vipInfo="vipInfo"> </router-view>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';
	import { getUserAccount, getUserInfo } from '@/service/user';
	import storage from '@/plugins/storage';
	import Cookies from 'vue-cookie';
	import Confirm from '@/components/base/confirm';

	const store = useStore();
	const router = useRouter();

	const userDetail = ref({});
	const userInfo = ref({});
	const vipInfo = ref({});
	const confirmRef = ref(null);

	function toUserDetail(info) {
		userInfo.value = info.userInfo.profile;
		userInfo.value.level = info.userInfo.level;
		vipInfo.value = info.vipInfo;
		const uid = info.userInfo.profile.userId;
		router.push(`/user/${uid}`);
	}

	function confirm() {
		router.push('/login');
	}
	function cancel() {
		router.push('/');
	}

	onMounted(() => {
		const token =
			storage.getLocal('__token__', '') || Cookies.get('MUSIC_U') || '';
		if (!token) {
			/* 没有登录 或 登录过期 */
			confirmRef.value.show();
		} else {
			const info = storage.getLocal('__userDetail__', null);
			if (info) {
				userDetail.value = info;
			} else {
				/* 登录状态 */
				getUserAccount().then(async (res) => {
					const { result } = await getUserInfo(res.account.id);
					userDetail.value = result;
					storage.setLocal('__userDetail__', result);
				});
			}
			store.commit('setLoginState', true);
			storage.setLocal('__token__', token);
			toUserDetail(userDetail.value);
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
		background: $color-background;
	}
</style>
