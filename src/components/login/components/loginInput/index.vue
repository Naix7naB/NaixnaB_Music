<template>
	<!-- 账号 -->
	<div class="input-wrapper">
		<span class="name">{{ title.user }}</span>
		<input
			type="text"
			v-model="userName"
			:style="errStyle"
			:placeholder="placeholder.user"
		/>
		<span class="err-msg" :style="errStyle">{{ errMsg }}</span>
	</div>
	<!-- 密码 / 验证码 -->
	<div class="input-wrapper">
		<span class="name">{{ title.pwd }}</span>
		<input
			:type="_type_"
			:placeholder="placeholder.pwd"
			v-model.lazy="password"
		/>
		<button
			class="captcha"
			v-if="inputType === 'captcha'"
			:disabled="locked"
			@click="reqCaptcha"
		>
			{{ captchaText }}
		</button>
	</div>
</template>

<script setup>
	import { onMounted, ref, watch, computed } from 'vue';

	const props = defineProps({
		uType: {
			type: Number,
			default: 1,
		},
	});
	const emit = defineEmits(['onChange', 'onClick']);

	const userName = ref('');
	const password = ref('');
	const phoneReg = /^1[3-9]\d{9}$/;
	const emailReg = /^\w+([\-\w]+)*@163\.com$/;

	/* 控制输入框样式 */
	const _type_ = ref('');
	const errMsg = ref('');
	const errStyle = ref({});
	const captchaText = ref('发送验证码');
	const locked = ref(true);
	const inputType = computed(() => (props.uType ? 'password' : 'captcha'));
	const title = computed(() => {
		if (!props.uType) {
			/* 短信登录 */
			return {
				user: '手机号',
				pwd: '验证码',
			};
		} else {
			/* 密码登录 */
			return {
				user: '账号',
				pwd: '密码',
			};
		}
	});
	const placeholder = computed(() => {
		if (!props.uType) {
			/* 短信登录 */
			return {
				user: '请输入手机号',
				pwd: '请输入验证码',
			};
		} else {
			/* 密码登录 */
			return {
				user: '手机号/网易邮箱',
				pwd: '密码',
			};
		}
	});

	/* 定时器 */
	let timer = null;

	watch(userName, (newVal) => {
		const { phoneFlag, res } = checkLegal(newVal);
		if (!newVal) {
			/* 输入框为空 */
			errStyle.value = {
				color: '#fff',
				borderColor: '#fff',
			};
			errMsg.value = '';
		} else {
			if (!res) {
				errStyle.value = {
					color: '#CDAA7D',
					borderColor: '#CDAA7D',
				};
				errMsg.value = '格式错误';
			} else {
				locked.value = false;
				errStyle.value = {
					color: '#fff',
					borderColor: '#fff',
				};
				errMsg.value = '';
			}
		}
		emit('onChange', { userName: newVal, phoneFlag, res });
	});

	watch(password, (newVal) => {
		emit('onChange', { password: newVal });
	});

	watch(
		() => props.uType,
		() => {
			pickType(inputType.value);
		}
	);

	/* 选择输入框类型 */
	function pickType(val) {
		switch (val) {
			case 'password':
				_type_.value = 'password';
				break;
			case 'captcha':
				_type_.value = 'text';
				break;
		}
	}

	/* 清空输入框内容 */
	function claerContent() {
		userName.value = '';
		password.value = '';
	}

	/* 发送验证码 */
	function reqCaptcha() {
		let sec = 60;
		captchaText.value = `${sec}s后重试`;
		locked.value = true;
		timer = setInterval(() => {
			if (--sec === 0) {
				clearInterval(timer);
				captchaText.value = '发送验证码';
				locked.value = false;
			} else {
				captchaText.value = `${sec}s后重试`;
			}
		}, 1000);
		emit('onClick');
	}

	/* 检查输入的是否合法 */
	function checkLegal(value) {
		let phoneFlag = true;
		let res = null;
		if (props.uType) {
			/* 密码登录 */
			phoneFlag = value.indexOf('@') === -1;
			res = phoneFlag ? value.match(phoneReg) : value.match(emailReg);
		} else {
			/* 短信登录 */
			res = value.match(phoneReg);
		}
		return {
			phoneFlag,
			res,
		};
	}

	onMounted(() => {
		pickType(inputType.value);
	});

	defineExpose({
		claerContent,
	});
</script>

<style lang="scss" scoped>
	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		width: 85%;
		height: 40px;
		margin: 0 auto;
		padding: 10px 0;
		font-size: $font-size-small;

		.name {
			flex: 0 0 48px;
			text-align: center;
			font-size: $font-size-medium;
		}

		input {
			flex: 1;
			padding: 5px 0;
			text-indent: 8px;
			outline: none;
			color: $color-text;
			background: rgba(0, 0, 0, 0);
			border-bottom: 1px solid $color-text;
			vertical-align: 2px;

			&::placeholder {
				color: $color-text-l;
			}
		}

		.err-msg {
			position: absolute;
			top: 24px;
			right: 6px;
		}

		.captcha {
			flex: 0 0 80px;
			height: 26px;
			margin-left: 8px;
			color: $color-text;
			font-size: $font-size-small;
			border: 1px solid $color-text-l;
			border-radius: 8px;
			background: $color-background-d;
			box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
		}

		input,
		.err-msg {
			transition: all 0.3s;
		}
	}
</style>
