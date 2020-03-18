<template>
	<view>
		测试v2
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onShow() {
			this.getServiceV2("srvdaq_activity_cfg_select","list","list")
		}
	}
</script>

<style lang="less">

</style>
