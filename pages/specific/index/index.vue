<template>
	<view>
		<view v-for="(pageItem, itemIndex) in pageItemList" :key="itemIndex">
			<view class="carousel-view" v-if="pageItem.div_type === 'carousel'">
				<swiper
					class="screen-swiper"
					:class="dotStyle ? 'square-dot' : 'round-dot'"
					:indicator-dots="true"
					:circular="true"
					:autoplay="true"
					interval="5000"
					duration="500"
				>
					<swiper-item v-for="(item, index) in swiperList" :key="index"><image :src="item.picUrl" mode="aspectFill" v-if="item.picUrl"></image></swiper-item>
				</swiper>
			</view>
			<view class="menu-view" v-if="pageItem.div_type === 'buttons'">
				<swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="false" interval="5000" duration="500">
					<swiper-item v-for="(item, index) in menuList" :key="index">
						<view class="bg-white  menu-item">
							<view class="bg-imgs " v-for="(item2, index2) in item" :key="index2" @click="clickMenu(item2)">
								<view class="menu-pic bg-blue" v-if="!item2.type">{{ item2.dest_app }}</view>
								<view class="menu-pic" v-if="item2.type && item2.type === 'more'"><image src="../../../static/img/more2.png" mode=""></image></view>
								<view class="label">{{ item2.dest_app }}</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="news-view" v-if="pageItem.div_type === 'tablist'">
				<view class="news-list" v-for="(list, index) in newsList" :key="index" @click="clickListItem(list)">
					<image src="" mode="" class="image"></image>
					<view class="content">
						{{ list.title }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import bxList from '@/components/bx-list/bx-list.vue';
export default {
	components: { bxList },
	data() {
		return {
			dotStyle: true,
			pageItemList: [], //页面项列表，控制页面显示内容
			menuList: [],
			newsList: [],
			swiperList: [],
			listConfig: {
				serviceName: 'srvdaq_cms_content_select',
				pageType: 'list',
				viewTemp: {
					// title: 'name',
					// tip: 'desc',
					// img: 'img',
					// price: 'current_price',
					// footer: 'shop_name'
				}
			}
		};
	},
	created() {
		this.getPageItemList();
	},
	methods: {
		clickMenu(e) {
			// 菜单按钮点击事件
			console.log("点击了按钮：",e)
			if (e.type && e.type === 'more') {
				// 点击了更多按钮
				this.showMoreMenu();
			}
		},
		showMoreMenu() {
			// 展示所有按钮
		},
		clickListItem(e) {
			// 列表点击事件
			console.log("点击了列表项：",e)
		},
		clickFootBtn() {},
		async getPageItemList() {
			//获取页面项列表
			let url = this.getServiceUrl('daq', 'srvdaq_website_page_item_select', 'select');
			let req = {
				serviceName: 'srvdaq_website_page_item_select',
				colNames: ['*'],
				order: [{ colName: 'seq', orderType: 'asc' }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				this.pageItemList = res.data.data;
				res.data.data.forEach((item, index) => {
					this.getPageItem(item).then(data => {
						item['data'] = data;
						console.log(item);
						this.$set(this.pageItemList, index, item);
					});
				});
				return res.data.data;
			}
		},
		async getPageItem(item = {}) {
			// 获取页面项
			let serviceName = '';
			switch (item.div_type) {
				case 'buttons':
					serviceName = 'srvdaq_page_item_buttons_select';
					break;
				case 'carousel':
					serviceName = 'srvdaq_page_item_carousel_select';
					break;
				case 'tablist':
					serviceName = 'srvdaq_cms_content_select';
					break;
			}
			if (serviceName) {
				let url = this.getServiceUrl('daq', serviceName, 'select');
				let req = {
					serviceName: serviceName,
					colNames: ['*']
					// order: [{ colName: 'seq', orderType: 'asc' }] ,
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					// this.itemList = res.data.data;
					let itemList = res.data.data;
					
					console.log('itemList', itemList);
					itemList.forEach((pageitem, index) => {
						switch (item.div_type) {
							case 'buttons':
								let itemLists = [];
								if (itemList.length <= 8) {
									itemLists = [itemList];
								} else if (itemList.length > 8 && itemList.length <= 16) {
									itemLists = [itemList.slice(0, 8), itemList.slice(8)];
								} else if (itemList.length > 16) {
									itemLists = [itemList.slice(0, 8), [...itemList.slice(8, 15), { type: 'more', dest_app: '更多' }]];
								}
								this.menuList = itemLists;
								break;
							case 'carousel':
								this.getPictureUrl(pageitem.carousel_image).then(url => {
									pageitem.picUrl = url;
									this.$set(itemList, index, pageitem);
									this.swiperList = itemList;
								});
								break;
							case 'tablist':
								this.newsList = itemList;
								break;
						}
					});
					return itemList;
				}
			}
		},
		async getPictureUrl(file_no) {
			const serviceName = 'srvfile_attachment_select';
			const url = this.getServiceUrl('file', serviceName, 'select');
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
			};
			if (file_no !== null && file_no !== '' && file_no !== undefined) {
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					const data = res.data.data[0];
					if (data) {
						const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl;
						return fileurl;
					}
				}
			}
		}
	},
	watch: {
		pageItemList: {
			deep: true,
			handler(newVal) {
				console.log(newVal);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.menu-view {
	min-height: 400upx;
	padding: 20upx 0;
	.menu-item {
		display: flex;
		box-sizing: border-box;
		flex-wrap: wrap;
	}
	.bg-imgs {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 10upx;
		width: 22%;
		.label {
			line-height: 50upx;
		}
	}
	.menu-pic {
		width: 100upx;
		height: 100upx;
		border-radius: 20upx;
		font-size: 30upx;
		margin: 0 auto;
		justify-content: center;
		align-items: center;
		display: flex;
		font-family: '黑体';
	}
}
.news-view{
	display: flex;
	flex-direction: column;
	.news-list{
		width: calc(100% - 20upx);
		margin:  10upx;
		display: flex;
		.image{
			width: 150upx;
			height: 150upx;
			margin-right: 20upx;
		}
		.content{
			flex: 1;
			line-height: 40upx;
			padding: 10upx;
		}
	}
}
</style>
