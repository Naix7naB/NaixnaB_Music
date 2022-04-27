# NaixnaB_Music

---

### 项目简介

项目后端接口用的是开源的网易云 API

在这里贴上地址了: **[接口地址](https://github.com/Binaryify/NeteaseCloudMusicApi)**

项目使用的是 Vue3，用 setup 语法糖是真香

写的第一个项目，写的比较烂，别喷...

声明：这里项目只用于学习，不得商用！

声明：这里项目只用于学习，不得商用！

声明：这里项目只用于学习，不得商用！

---

### 安装

开项目之前记得把后端接口打开
具体参考上面的 **[接口地址](https://github.com/Binaryify/NeteaseCloudMusicApi)**

先把项目克隆到本地

```
$ https://github.com/Naix7naB/NaixnaB_Music.git
```

然后安装一下项目依赖

```
$ npm install / npm i
```

---

### 运行

```
$ npm run serve
```

---

### 打包

```
$ npm run build
```

---

### TODO

- 首页现在是四个 tab 按钮点击切换进行切换页面，后面可能改为点击切换或者滑动切换，有过渡效果
- 简易歌词现在才一句，有点想做三句的，也想支持滚动
- Mini-Player(底部小播放器) 左右滑动切换歌曲 **(现在也可以切换，只是还没做，有 bug)**
- 现在首页皮肤颜色是固定的，希望登录之后根据每个人的背景图片，进行修改所有页面的皮肤以及背景图片(说实话有点难，没啥好的思路)
- 其他用户界面
- 歌曲评论
- **其他想到再写...**

---

### 主要页面与功能实现

#### 主要页面

- **推荐页**
  - 轮播图
  - 首页歌单
  - 歌单详情页
- **歌手页**
  - 歌手展示
  - 侧边栏（首字母）
  - 歌手详情页
- **榜单页**
  - 榜单展示
  - 榜单详情页
- **搜索页**
  - 默认搜索词
  - 热门搜索词
  - 监测输入展示搜索内容
- **登录页**
  - 登录表单
  - 登录按钮（验证码/密码 登录）
- **用户中心页**
  - 用户信息栏
  - 用户多功能展示区（目前只做了四个入口）
  - 用户歌单展示
  - 用户歌单详情页

#### 最主要的功能

- **轮播滑动 以及 页面滚动**

  - 主要实现是用的第三方库 **`Better Scroll`**

- **歌曲播放**

  ```js
  /* 首先获取audio标签 通过ref获取 */
  <audio ref="audioRef"></audio>;
  const audioRef = ref(null);

  /* 通过后端接口返回的歌曲url，把url设置给audio标签 */
  getMusicUrl().then((res) => {
  	let url = res.url;
  	let audio = audioRef.value;
  	audio.src = url;
  });
  ```

- **歌词格式化**

  ```js
  /* 直接贴上代码 */
  function formatLyric(lyric) {
  	const arr = lyric.split('\n');
  	const result = arr.reduce((prev, cur) => {
  		if (cur !== '') {
  			const obj = {};
  			const temp = cur.replace('[', '').split(']');
  			if (temp.length === 1) {
  				prev[0] = { content: '**** 该歌曲不支持歌词滚动 ****' };
  				obj.content = temp[0].trim();
  				prev.push(obj);
  			} else {
  				/* 歌词不为空 */
  				if (temp[1].trim()) {
  					/* 处理歌词时间 */
  					const timeArr = temp[0].split(':');
  					const first = Number(timeArr[0]) * 60;
  					const second = Number(timeArr[1]);
  					const timeVal = (first + second).toFixed(3) / 1;
  					/* 处理返回的格式 */
  					obj.time = timeVal;
  					obj.content = temp[1].trim();
  					prev.push(obj);
  				}
  			}
  		}
  		return prev;
  	}, []);
  	return result;
  }
  ```

- **歌词滚动**

  主要思路：
  通过 audio 的 currentTime 获取当前播放的时间，
  比较 currentTime 和歌词的时间，
  计算出 currentTime 距离下一句歌词的时间 delta，
  并且设置一个定时器 delay 的时间就是 delta，
  这个定时器时间一到就滚动到该歌词（这里滚动的话还是使用的 **`BetterScroll`** 插件的一个 API，**`scrollTo()`** 和 **`scrollToElement()`** 两个方法），
  并且计算出一下句歌词与当前时间的差值 newDelta，然后开启下一个定时器，
  而且当**歌曲暂停**，**播放器页面隐藏**，**歌词页隐藏** 时都需要暂停定时器，这样不会造成性能浪费

  ```js
  /**
   * 详细可以去看源代码
   * 路径: src/components/player/lyric.js
   */
  ```

- **账号合法性校验**

  ```js
  /* 主要是通过正则去匹配结果 */
  const phoneReg = /^1[3-9]\d{9}$/;
  const emailReg = /^\w+([\-\w]+)*@163\.com$/; // 因为是网易的接口，就直接匹配 @163.com 结尾的邮箱就好了
  /**
   * 然后在通过 watch 监听 v-model 绑定的 input 输入框里面的 value 值进行校验
   * 校验不成功的话 登录按钮是 disable 的状态，并不会发送请求
   */
  ```

- **自定义指令（懒得写了...）**

  - 等待加载指令 `v-load`
  - 图片懒加载指令 `v-img-lazy`
  - 无结果指令 `v-no-result`

- **封装 axios**
