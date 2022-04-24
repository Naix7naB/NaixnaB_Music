<template>
	<div class="friend" v-load="isLoading">
		<div class="friend-top">
			<Switch
				:text="['关注', '粉丝']"
				v-model="switchNum"
				@update:modelValue="toggle"
			></Switch>
		</div>
		<Scroll
			class="list-wrapper"
			ref="listScrollRef"
			:style="scrollStyle"
			:probeType="3"
		>
			<ul class="list">
				<li class="item" v-for="item in list" :key="item.userId">
					<div class="icon">
						<img class="pic" v-img-lazy="item.avatarUrl" />
						<img
							class="identity"
							:src="item.avatarDetail.identityIconUrl"
							v-if="item.avatarDetail"
						/>
					</div>
					<div class="content">
						<span class="name">{{ item.nickname }}</span>
						<p class="desc">{{ item.signature }}</p>
					</div>
					<div
						class="follow-btn"
						v-if="switchNum"
						:class="handleClass(item)"
						@click="followOrUnfollow(item)"
					>
						<i class="icon-add" v-if="!checkFollowed(item)"></i>
						<span class="txt">
							{{ checkFollowed(item) ? '互相关注' : '回关' }}
						</span>
					</div>
				</li>
			</ul>
		</Scroll>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { useStore } from 'vuex';
	import { getFollows, getFolloweds } from '@/service/user';
	import storage from '@/plugins/storage';
	import Switch from '@/components/base/switch';
	import Scroll from '@/components/base/scroll';

	const store = useStore();

	const listScrollRef = ref(null);
	const friends = ref({});
	const isFollowed = ref([]);
	const switchNum = ref(0);

	const isLoading = computed(() => {
		return !friends.value.follows || !friends.value.followeds;
	});

	const list = computed(() => {
		return !switchNum.value ? friends.value.follows : friends.value.followeds;
	});

	const playList = computed(() => store.state.playList);

	/* 滚动样式 */
	const scrollStyle = computed(() => {
		return {
			bottom: playList.value.length ? '60px' : 0,
		};
	});

	/* 开关转换 */
	function toggle(index) {
		listScrollRef.value.scroll.refresh();
		listScrollRef.value.scroll.scrollTo(0, 0, 500);
		switchNum.value = index;
	}

	/* 检查是否已关注 */
	function checkFollowed(item) {
		const index = isFollowed.value.findIndex((i) => i.uid === item.userId);
		return isFollowed.value[index].followed;
	}

	/* 处理 是否已关注 的类名 */
	function handleClass(item) {
		const flag = checkFollowed(item);
		return { followed: flag };
	}

	/* 关注/取消关注 */
	function followOrUnfollow(item) {
		/* 操作频繁的话需要手机验证 */
		// const t = followed ? 0 : 1;
		// follow({ id: userId, t });
		/* 首先判断该用户是否已关注 */
		const flag = checkFollowed(item);
		const index = isFollowed.value.findIndex((i) => i.uid === item.userId);
		isFollowed.value[index].followed = !flag;
		storage.setLocal('__followedList__', isFollowed.value);
	}

	onMounted(async () => {
		const uid = storage.getLocal('__uid__', '');
		const { follow } = await getFollows({ uid });
		const { followeds } = await getFolloweds({ uid });
		friends.value = {
			follows: follow,
			followeds,
		};
		const followedList = storage.getLocal('__followedList__', []);
		if (followedList.length) {
			isFollowed.value = followedList;
		} else {
			isFollowed.value = followeds.map((item) => {
				return {
					uid: item.userId,
					followed: item.followed,
				};
			});
			storage.setLocal('__followedList__', isFollowed.value);
		}
	});
</script>

<style lang="scss" scoped>
	.friend {
		position: fixed;
		top: 50px;
		bottom: 0;
		width: 100%;

		.friend-top {
			display: flex;
			align-items: center;
			height: 70px;
			background: rgba(69, 65, 65, 0.3);
			backdrop-filter: blur(2px);

			/* scss样式穿透 */
			&::v-deep(.switch) {
				width: 200px;

				.switch-wrapper {
					border: 1px solid rgb(146, 129, 108);

					.switch-item {
						height: 28px;
						line-height: 28px;
						font-size: $font-size-medium;
					}
				}

				.active-bar {
					height: 28px;
					background: rgb(146, 129, 108);
				}
			}
		}

		.list-wrapper {
			position: absolute;
			top: 70px;
			bottom: 0;
			width: 100%;
			overflow: hidden;
			background: rgba(69, 65, 65, 0.3);
			backdrop-filter: blur(2px);

			.list {
				padding: 5%;

				.item {
					display: flex;
					align-items: center;
					margin-bottom: 20px;

					&:last-child {
						margin: 0;
					}

					.icon {
						position: relative;
						flex: 0 0 50px;
						height: 50px;

						.pic {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}

						.identity {
							position: absolute;
							bottom: 0px;
							right: 0px;
							width: 14px;
							height: 14px;
						}
					}

					.content {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						line-height: 24px;
						padding: 0 20px;
						overflow: hidden;

						.name {
							font-size: $font-size-medium;
						}

						.desc {
							@include no-wrap();
							color: $color-text-l;
							font-size: $font-size-small;
						}
					}

					.follow-btn {
						flex: 0 0 60px;
						padding: 2px 0;
						text-indent: 6px;
						border: 1px solid rgb(231, 196, 153);
						border-radius: 12px;
						color: rgb(231, 196, 153);

						&.followed {
							border: 1px solid $color-text-ll;
							color: $color-text-ll;
						}

						.icon-add {
							margin-right: 4px;
							vertical-align: -1px;
						}

						.txt {
							font-size: $font-size-small;
						}
					}
				}
			}
		}
	}
</style>
