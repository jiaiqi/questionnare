<template>
	<view class="">
		<view class="" style="height: 10px;"></view>
		<view class="header_content">
			<bw-swiper :swiperList="swiperList" style="width:100%"></bw-swiper>
		</view>
		<cg-swiper :swiperList="swipertitle"></cg-swiper>
	</view>
</template>

<script>
	import bwSwiper from '@/components/bw-swiper/bw-swiper.vue';
	import cgSwiper from '@/components/cg-swiper/cg-swiper.vue';
	export default {
		components: {
			bwSwiper,
			cgSwiper
		},
		data() {
			return {
				swipertitle: [
					
				],
				swiperList: [{
						img: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1211338343,1056512950&fm=26&gp=0.jpg',
					},
					{
						img: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1558124756,1684547130&fm=26&gp=0.jpg',
					},
					{
						img: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2605935299,2493192961&fm=26&gp=0.jpg',
					}
				],
			}
		},
		methods: {
			getmenu() {
				let url = this.getServiceUrl('shop', 'srvshop_goods_category_select', 'select');
				let reqs = {
					"serviceName": "srvshop_goods_category_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "parent_no",
						"ruleType": "isnull"
					}],
					"order": []
				}
				this.$http.post(url, reqs).then(res => {
					this.swipertitle = (res.data.data)
				})
			},
		},
		onLoad() {
			this.getmenu()
		}
	}
</script>

<style>
	.header_content {
		height: 260upx;
		overflow: hidden;
	}

</style>
