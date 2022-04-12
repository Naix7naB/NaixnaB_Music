<template>
	<div class="login">
		<div class="login-wrapper">
			<h1 class="title">账号登录</h1>
			<div class="login-input">
				<input
					type="text"
					placeholder="手机号/邮箱"
					v-model.lazy="data.userName"
				/>
				<input
					type="password"
					placeholder="密码"
					v-model.lazy="data.password"
				/>
			</div>
			<div class="btn-wrapper">
				<button class="btn">注册</button>
				<button class="btn" @click="login">登录</button>
			</div>
			<span class="tip">其他登录方式</span>
		</div>
	</div>
</template>

<script setup>
	import { reactive, ref } from 'vue';
	import { login_phone, login_email } from '@/service/login';

	const data = reactive({
		userName: '',
		password: '',
	});
	const userInfo = ref(null);

	/* 登录账号 */
	function login() {
		const idx = data.userName.indexOf('@');
		if (idx === -1) {
			/* 手机登录 */
			login_phone(data).then((res) => {
				userInfo.value = {
					account: res.account,
					bindings: res.bindings,
					profile: res.profile,
					loginType: res.loginType,
					cookie: res.cookie,
					token: res.token,
				};
			});
		} else {
			/* 邮箱登录 */
			login_email(data).then((res) => {
				console.log(res);
				// userInfo.value = {
				// 	account: res.account,
				// 	bindings: res.bindings,
				// 	profile: res.profile,
				// 	loginType: res.loginType,
				// 	cookie: res.cookie,
				// 	token: res.token,
				// };
			});
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 80%;
		height: 42%;
		min-width: 250px;
		min-height: 260px;
		border-radius: 10px;
		transform: translate(-50%, -50%);
		background: rgba($color: $color-highlight-background, $alpha: 0.25);

		.login-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;

			.title {
				margin-top: 30px;
				font-size: 32px;
				color: $color-text;
			}

			.login-input {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: center;
				width: 100%;

				input {
					width: 76%;
					height: 40px;
					padding: 0 20px;
					border: none;
					outline: none;
					border-radius: 20px;
					font-size: $font-size-medium-x;
				}

				&::placeholder {
					color: $color-background-d;
				}
			}

			.btn-wrapper {
				display: flex;
				justify-content: space-around;
				align-items: center;
				width: 70%;
				margin-bottom: 10px;

				.btn {
					width: 90px;
					height: 30px;
					border: none;
					border-radius: 16px;
					background: #8f8fc8;
				}
			}

			.tip {
				flex: 0 0 40px;
				line-height: 40px;
				font-size: $font-size-small;
				text-decoration: underline;
			}
		}
	}
</style>
