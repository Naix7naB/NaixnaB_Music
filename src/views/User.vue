<template>
	<div class="user">
		<Confirm
			ref="confirmRef"
			text="请先登录后操作"
			confirmText="登录"
			@confirm="confirm"
			@cancel="cancel"
		></Confirm>
		<router-view :userId="userId"> </router-view>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { getUserAccount } from '@/service/user';
	import storage from '@/plugins/storage';
	import Cookies from 'vue-cookie';
	import Confirm from '@/components/base/confirm';

	const router = useRouter();

	const userId = ref('');
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
			const uid = storage.getLocal('__uid__', '');
			if (uid) {
				userId.value = uid;
			} else {
				const { account } = await getUserAccount();
				userId.value = account.id;
				storage.setLocal('__uid__', account.id);
			}
			if (!userId.value) return;
			/* 用户id有值的话跳转个人中心页 */
			router.push(`/user/center`);
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
