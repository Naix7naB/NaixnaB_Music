<template>
	<div class="login-wrapper">
		<!-- 顶部 -->
		<div class="login-top">
			<h1 class="txt">登 录</h1>
			<span class="close" @click="close">
				<i class="icon-close"></i>
			</span>
		</div>
		<!-- 登录 -->
		<div class="login-content">
			<!-- 标题 -->
			<div class="title">
				<Switch :text="['短信登录', '密码登录']" v-model="uType"></Switch>
			</div>
			<!-- 输入框 -->
			<div class="login-input">
				<LoginInput
					ref="inputRef"
					:uType="uType"
					@onChange="onChange"
					@onClick="reqCaptcha"
				></LoginInput>
			</div>
			<!-- 登录按钮 -->
			<button class="login-btn" @click="clickLogin">{{ btnText }}</button>
		</div>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref, watch } from 'vue';
	import { useRouter } from 'vue-router';
	import { storage } from '@/utils';
	import {
		login_phone,
		login_email,
		sendCaptcha,
		verifyCaptcha,
	} from '@/service/login';
	import md5 from 'md5';
	import Switch from '@/components/base/switch';
	import LoginInput from './components/loginInput';

	const router = useRouter();

	const userName = ref('');
	const password = ref('');
	const matchRes = ref(null);
	const userInfo = ref({});
	const errMsg = ref('');
	const accountType = ref('phone');
	const loginSuccess = ref(false);

	/* uiType 0: 短信登录(注册)  1: 密码登录 */
	const uType = ref(1);
	const inputRef = ref(null);

	const uTitle = computed(() => (uType.value ? '密码登录' : '短信登录'));
	const btnText = computed(() => (uType.value ? '登录' : '注册 / 登录'));

	watch(uType, () => {
		inputRef.value.claerContent();
	});

	watch(loginSuccess, (newStatus) => {
		if (!newStatus) return;
		router.push('/user');
	});

	/* 输入框内容修改时 */
	function onChange(value) {
		if ('userName' in value) {
			userName.value = value.userName;
			accountType.value = value.phoneFlag ? 'phone' : 'email';
			matchRes.value = value.res;
		} else {
			password.value = value.password;
		}
	}

	/* 关闭页面 */
	function close() {
		router.push('/');
	}

	/* 点击登录 */
	async function clickLogin() {
		/* 账号名 密码 不能为空 且 账号必须合法 */
		if (!userName.value.trim() || !password.value || !matchRes.value) return;
		const passwordType = uType.value ? 'md5_password' : 'captcha';
		const passwordVal = uType.value ? md5(password.value) : password.value;
		const data = {
			[accountType.value]: userName.value,
			[passwordType]: passwordVal,
		};
		if (!uType.value) {
			/* 短信登录 */
			const res = await verifyCaptcha(data);
			if (res.code !== 200) {
				errMsg.value = res.msg;
				loginSuccess.value = false;
				return;
			}
		}
		login(accountType.value, data);
	}

	/* 手机登录 或 邮箱登录 */
	function login(type, data) {
		const loginMode = type === 'phone' ? login_phone : login_email;
		loginMode(data).then((res) => {
			if (res.code === 200) {
				userInfo.value = {
					account: res.account,
					bindings: res.bindings,
					profile: res.profile,
					loginType: res.loginType,
				};
				storage.setLocal('__userInfo__', userInfo.value);
				storage.setLocal('__cookie__', res.cookie);
				storage.setLocal('__token__', res.token);
				loginSuccess.value = true;
			} else {
				errMsg.value = res.msg;
				loginSuccess.value = false;
			}
		});
	}

	/* 发送验证码 */
	function reqCaptcha() {
		sendCaptcha(userName.value);
	}

	onMounted(() => {
		const token = storage.getLocal('__token__', '');
		if (token) {
			// console.log(token);
		}

		// if (uiType.value) {
		// 	title = '';
		// }
	});
</script>

<style lang="scss" scoped>
	.login-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 88%;
		border-radius: 10px;
		transform: translate(-50%, -50%);
		background: rgba($color: $color-highlight-background, $alpha: 0.25);

		.login-top {
			margin-top: 10px;

			.txt {
				flex: 1;
				height: 40px;
				line-height: 40px;
				font-size: 26px;
				text-align: center;
			}

			.close {
				z-index: 10;
				position: absolute;
				top: 20px;
				right: 16px;
				font-size: $font-size-large;

				&::before {
					content: '';
					position: absolute;
					top: -10px;
					bottom: -10px;
					left: -10px;
					right: -10px;
				}
			}
		}

		.login-content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 240px;

			.title {
				width: 100%;
			}

			.login-input {
				width: 100%;
				margin: 10px 0;
			}

			.login-btn {
				width: 50%;
				height: 36px;
				border: none;
				border-radius: 20px;
				color: $color-text;
				background: #9b9bd0;
			}
		}
	}
</style>
