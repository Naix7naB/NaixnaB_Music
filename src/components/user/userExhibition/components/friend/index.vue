<template>
	<div class="friend">
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
				<li class="item" v-for="(item, index) in list" :key="item.userId">
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
						:class="{ followed: item.followed }"
						@click="followUser(item, index)"
					>
						<i class="icon-add" v-if="!item.followed"></i>
						<span class="txt">{{ item.followed ? '互相关注' : '回关' }}</span>
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
	const followList = ref({});
	const followedList = ref({});
	const switchNum = ref(0);

	const list = computed(() => {
		return !switchNum.value ? followList.value : followedList.value;
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

	/* 关注/取消关注 */
	async function followUser(item, index) {
		/* 操作频繁的话需要手机验证 */
		// const t = followed ? 0 : 1;
		// follow({ id: userId, t });
		list.value[index].followed = !item.followed;
		storage.setLocal('__followedList__', list.value);
	}

	onMounted(async () => {
		const list1 = storage.getLocal('__followList__', null);
		const list2 = storage.getLocal('__followedList__', null);
		if (list1 && list2) {
			/* 本地存储有值的话 */
			followList.value = list1;
			followedList.value = list2;
		} else {
			/* 本地存储没有值的话 */
			const uid = storage.getLocal('__uid__', '');
			const { follow } = await getFollows({ uid });
			const { followeds } = await getFolloweds({ uid });
			followList.value = follow;
			followedList.value = followeds;
			storage.setLocal('__followList__', followList.value);
			storage.setLocal('__followedList__', followedList.value);
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
			height: 72px;
			background: rgba(90, 83, 83, 0.3);
			backdrop-filter: blur(2px);

			/* scss样式穿透 */
			&::v-deep .switch {
				.switch-wrapper {
					border: 1px solid rgb(146, 129, 108);
				}

				.active-bar {
					background: rgb(146, 129, 108);
				}
			}
		}

		.list-wrapper {
			position: absolute;
			top: 72px;
			bottom: 0;
			width: 100%;
			overflow: hidden;

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
							font-size: $font-size-medium-x;
						}

						.desc {
							@include no-wrap();
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
