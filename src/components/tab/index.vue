<template>
	<!-- 导航栏选项卡 -->
	<div class="tab">
		<router-link
			class="tab-item"
			v-for="item in tabs"
			:key="item.name"
			:to="item.path"
		>
			<span class="tab-link">{{ item.name }}</span>
		</router-link>
	</div>
</template>

<script setup>
	const tabs = [
		{
			path: '/recommend',
			name: '推荐',
		},
		{
			path: '/singer',
			name: '歌手',
		},
		{
			path: '/toplist',
			name: '榜单',
		},
		{
			path: '/search',
			name: '搜索',
		},
	];
</script>

<style lang="scss" scoped>
	.tab {
		display: flex;
		height: 44px;
		line-height: 44px;
		font-size: $font-size-medium;

		.tab-item {
			flex: 1;
			text-align: center;

			.tab-link {
				padding-bottom: 5px;
				color: $color-text-l;
			}

			&.router-link-active {
				.tab-link {
					color: $color-theme;
					border-bottom: 2px solid $color-theme;
				}
			}
		}
	}
</style>
