<template>
	<div class="user">
		<Confirm
			ref="confirmRef"
			text="请先登录后操作"
			confirmText="登录"
			@confirm="confirm"
			@cancel="cancel"
		></Confirm>
		<router-view :userInfo="userDetail.profile" :vipInfo="userDetail.vipInfo">
		</router-view>
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
	const confirmRef = ref(null);

	/* 点击确认按钮 */
	function confirm() {
		router.push('/login');
	}

	/* 点击取消按钮 */
	function cancel() {
		router.push('/');
	}

	onMounted(async () => {
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
				const res = await getUserAccount();
				const { userInfo } = await getUserInfo(res.account.id);
				userDetail.value = userInfo;
				storage.setLocal('__userDetail__', userInfo);
			}
			store.commit('setLoginState', true);
			storage.setLocal('__token__', token);
			/* 跳转 */
			const uid = userDetail.value.profile.userId;
			router.push(`/user/${uid}`);
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
