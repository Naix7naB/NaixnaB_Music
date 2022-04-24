<template>
	<div class="daily-date">
		<!-- 日期 -->
		<div class="date-wrapper">
			<span class="date">{{ getCurDate().date }}</span>
			<span class="mouth"> / {{ getCurDate().mouth }}</span>
		</div>
		<!-- 历史日推 -->
		<div class="date-history">历史日推 (待...)</div>
	</div>
</template>

<script setup>
	/* 获取当前日期 */
	function getCurDate() {
		const now = new Date();
		const date = (now.getDate() + '').padStart(2, '0');
		const mouth = (now.getMonth() + 1 + '').padStart(2, '0');
		return {
			date,
			mouth,
		};
	}
</script>

<style lang="scss" scoped>
	.daily-date {
		display: flex;
		align-items: center;
		height: 50px;
		padding: 0 20px;

		.date-wrapper {
			flex: 1;

			.date {
				font-size: 42px;
				font-weight: 700;
			}

			.mouth {
				font-size: $font-size-medium-x;
				font-weight: 600;
			}
		}

		.date-history {
			width: 120px;
			line-height: 24px;
			text-align: center;
			border-radius: 20px;
			font-size: $font-size-medium;
			background: rgba(188, 188, 215, 0.8);
		}
	}
</style>
