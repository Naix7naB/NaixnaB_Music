import { createApp } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import loading from '@/components/base/loading';
import defaultImg from '@/assets/images/lazy.jpg';

/* 创建插件 */
export const plugins = {
	install(app) {
		/* 加载等候指令 v-load */
		app.directive('load', {
			/* el 是指令绑定的 DOM元素  binding 是指令绑定传来的参数 */
			mounted(el, binding) {
				/* 把 loading组件应用对象挂载到自己创建的虚拟 DOM 上去 */
				const instance = createApp(loading).mount(
					document.createElement('div')
				);
				el.instance = instance;
				if (binding.value) {
					appendEl(el);
				}
			},
			updated(el, binding) {
				if (binding.value !== binding.oldValue) {
					binding.value ? appendEl(el) : removeEl(el);
				}
			},
		});
		/* 图片懒加载指令 v-img-lazy */
		app.directive('img-lazy', {
			/* npm install @vueuse/core --save 安装 VueUse */
			/* 接收的是图片的 src地址 */
			mounted(el, binding) {
				el.src = defaultImg;
				const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
					/* 判断 监测的DOM元素 是否在可视窗口内 */
					if (isIntersecting) {
						/* 如果请求的图片数据出错 也展示默认图片 */
						el.onerror = () => {
							el.src = defaultImg;
						};
						/* 元素在可视窗口内 把真实图片的 src路径给到元素上 */
						el.src = binding.value;
						stop(); /* 拿到真实src后 停止监听 */
					}
				});
			},
		});
	},
};

/* 把 组件实例对象 添加到 真实DOM(我们需要挂载的元素) 上去 */
function appendEl(el) {
	const _style = getComputedStyle(el);
	const posArr = ['relative', 'absolute', 'fixed'];
	if (!posArr.includes(_style.position)) {
		/* 如果父元素没有定位属性 则添加上 g-relative类名 => position: relative */
		el.classList.add('g-relative');
	}
	/* instance.$el 就是 loading组件的真实 DOM */
	el.appendChild(el.instance.$el);
}

/* 移除组件 */
function removeEl(el) {
	/* 移除父元素 g-relative类名 */
	el.classList.remove('g-relative');
	/* 移除 loading组件 */
	el.removeChild(el.instance.$el);
}
