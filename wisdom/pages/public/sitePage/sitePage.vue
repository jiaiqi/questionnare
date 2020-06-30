<template>
	<view>
		<SitePage
			v-if="index == 0"
			:website_no="website_no"
			:is_owner="isOwner"
			:page_no="currentPage.page_no"
			@clickButton="clickButton"
			ref="sitePage"
			:style="{ 'padding-bottom': websiteList.length > 1 ? '100upx' : 0 }"
		></SitePage>
		<proFile ref="profile" v-if="index == 1"></proFile>
		<view class="cu-bar tabbar bg-white shadow foot" v-if="websiteList.length > 1">
			<view class="action" v-for="(item, siteIndex) in websiteList" :key="siteIndex" @click="changePage(item)">
				<view class="cuIcon-cu-image" v-if="item.page_name == '首页' && !item.checked"><image src="/static/img/home.png"></image></view>
				<view class="cuIcon-cu-image" v-if="item.page_name == '首页' && item.checked">
					<image style="width: 25px;height: 25px;margin-bottom: 2px;" src="/static/img/check_home.png"></image>
				</view>
				<view class="cuIcon-cu-image" v-if="item.page_name == '我的' && !item.checked"><image src="/static/img/my.png"></image></view>
				<view class="cuIcon-cu-image" v-if="item.page_name == '我的' && item.checked"><image src="/static/img/check_my.png"></image></view>
				<view :class="{ 'text-green': item.page_no === currentPage.page_no, 'text-gray': item.page_no !== currentPage.page_no }">{{ item.page_name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import SitePage from '../homePage/homePage';
import proFile from '../profile/profile';
export default {
	name: 'home-page',
	components: {
		SitePage,
		proFile
	},
	data() {
		return {
			website_no: '',
			currentPage: '',
			websiteList: [],
			index: 0,
			isOwner: false
		};
	},
	methods: {
		clickButton(e) {
			if (uni.getStorageSync('activeApp') == 'zhxq') {
				this.getUserInfoLimits().then(result=>{
					console.log("--------",result)
					let isOwner = uni.getStorageSync('is_owner');
					if (
						(e.dest_menu_no === '访客登记' ||
							e.dest_menu_no === '物业报修' ||
							e.dest_menu_no === '住户登记' ||
							e.dest_menu_no === '车辆登记' ||
							e.dest_menu_no === '工作人员登记' ||
							e.dest_menu_no === '服务人员登记') &&
						e.dest_app === 'zhxq'
					) {
						if(uni.getStorageSync('isLogin')){
							
						this.selectInfoFromMember().then(result1 => {
							console.log('11111111111',result1)
							if (!!result1) {
								if (!isOwner && (e.dest_menu_no === '物业报修' || e.dest_menu_no === '车辆登记')) {
									uni.showToast({
										title: '暂未入住小区,请进行信息登记',
										duration: 1000,
										icon: 'none'
									});
									return
								}
								let urlArgumentIndex = e.dest_page.indexOf('?');
								let urlAllArgument = e.dest_page.split('?');
								let queryObj = {};
								if (urlArgumentIndex >= 0) {
									/** 确保在登录状态下进行跳转*/
									// if(uni.getStorageSync('isLogin')){																		
										if (urlAllArgument[1].indexOf('&') < 0) {
											for (let i = 1; i < urlAllArgument.length; i++) {
												let urlAloneArgument = urlAllArgument[i].split('=');
												queryObj[urlAloneArgument[0]] = urlAloneArgument[1];
											}
										} else {
											let urlArg = urlAllArgument[1].split('&');
											for (let j = 0; j < urlArg.length; j++) {
												let urlAlo = urlArg[j].split('=');
												queryObj[urlAlo[0]] = decodeURIComponent(urlAlo[1]);
											}
										}
										console.log('queryObj=======', queryObj);
										if (queryObj.no || queryObj.website_no || queryObj.serviceName) {
											uni.navigateTo({
												url: urlAllArgument[0] + '?query=' + encodeURIComponent(JSON.stringify(queryObj))
											});
										} else {
											uni.navigateTo({
												url: urlAllArgument[0]
											});
										}
									// }
								}
							} else {
								// let urlArgumentIndex = e.dest_page.indexOf('?');
								// let urlAllArgument = e.dest_page.split('?');
								// let queryObj = {};
								// if (urlArgumentIndex >= 0) {
								// 	if (urlAllArgument[1].indexOf('&') < 0) {
								// 		for (let i = 1; i < urlAllArgument.length; i++) {
								// 			let urlAloneArgument = urlAllArgument[i].split('=');
								// 			queryObj[urlAloneArgument[0]] = urlAloneArgument[1];
								// 		}
								// 	} else {
								// 		let urlArg = urlAllArgument[1].split('&');
								// 		for (let j = 0; j < urlArg.length; j++) {
								// 			let urlAlo = urlArg[j].split('=');
								// 			queryObj[urlAlo[0]] = decodeURIComponent(urlAlo[1]);
								// 		}
								// 	}
								// 	console.log('queryObj=======', queryObj);
								// 	if (queryObj.no || queryObj.website_no || queryObj.serviceName) {
								// 		uni.navigateTo({
								// 			url: urlAllArgument[0] + '?query=' + encodeURIComponent(JSON.stringify(queryObj))
								// 		});
								// 	} else {
								// 		uni.navigateTo({
								// 			url: urlAllArgument[0]
								// 		});
								// 	}
								// } 
							}
						});
						}
					} else if (e.dest_menu_no == '紧急求助') {
									uni.navigateTo({
										url: e.dest_page
									});
								}
					// if (!isOwner && (e.dest_menu_no === '物业报修'|| e.dest_menu_no === '车辆登记')) {
					//   uni.showToast({
					//     title: '暂未入住小区,请进行信息登记',
					//     duration: 1000,
					//     icon: 'none'
					//   });
					// }
				});
			}else{
				
			}
			console.log(e);
		},
		changePage(item) {
			let websiteList = this.websiteList;
			websiteList.forEach(wb => {
				wb.checked = false;
			});
			item.checked = !item.checked;
			if (item && item.page_no !== this.currentPage.page_no && item.page_no != 'BX202006171012480019') {
				this.index = 0;
				this.currentPage = item;
				this.$nextTick(() => {
					this.$refs.sitePage.getPageInfo(item.website_no, item.page_no);
				});
			} else if (item && item.page_no !== this.currentPage.page_no && item.page_no == 'BX202006171012480019') {
				console.log('点击我的');
				this.selectInfoFromMember().then(result => {
					if (!!result) {
						this.currentPage = item;
						this.index = 1;
						this.$nextTick(() => {
							this.$refs.profile.getUserInfo();
						});
					}
				});
				// uni.redirectTo({
				//     url: '/pages/public/profile/profile'
				// });
			}
		},
		async getBasicsInfo() {
			let userInfo = uni.getStorageSync('login_user_info');
			let url = this.getServiceUrl('zhxq', 'srvzhxq_member_select', 'select');
			let req = {
				serviceName: 'srvzhxq_member_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'openid',
						value: userInfo.user_no,
						ruleType: 'eq'
					}
				],
				page: {
					pageNo: 1,
					rownumber: 10
				}
			};
			let res = await this.$http.post(url, req);
			if (res.data.data.length > 0) {
				uni.setStorageSync('basics_info', res.data.data[0]);
			}
		},
		async getWebsiteList() {
			const url = this.getServiceUrl('daq', 'srvdaq_website_page_select', 'select');

			let website_no = '';
			// #ifdef H5
			website_no = this.$route.query.website_no;
			// #endif
			// #ifdef MP-WEIXIN
			website_no = this.website_no;
			// #endif
			if (website_no) {
				const req = {
					serviceName: 'srvdaq_website_page_select',
					colNames: ['*'],
					condition: [{ colName: 'website_no', ruleType: 'like', value: website_no }],
					page: { pageNo: 1, rownumber: 10 },
					order: [
						{
							colName: 'sorts',
							orderType: 'asc'
						}
					]
				};
				const res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					if (res.data.data.length > 0) {
						res.data.data.length > 5 ? (res.data.data.length = 5) : '';
						res.data.data.forEach((it, i) => {
							it['checked'] = false;
							if (i == 0) {
								it['checked'] = true;
							}
						});
						this.websiteList = res.data.data;

						this.currentPage = res.data.data[0];
						this.$refs.sitePage.getPageInfo(res.data.data[0].website_no, res.data.data[0].page_no);
					}
				}
			}
		},
		async getUserInfoLimits() {
			let user_no = uni.getStorageSync('login_user_info').user_no;
			let urls = this.getServiceUrl('zhxq', 'srvzhxq_syrk_select', 'select');
			let reqs = {
				serviceName: 'srvzhxq_syrk_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'openid',
						ruleType: 'eq',
						value: user_no
					},
					{
						colName: 'proc_status',
						ruleType: 'eq',
						value: '完成'
					},
					{
						colName: 'status',
						ruleType: 'eq',
						value: '有效'
					}
					// {
					//  colName:"is_fuzeren",
					//  ruleType:"eq",
					//  value:"是"
					// }
				],
				order: [{ colName: 'create_time', orderType: 'asc' }]
			};
			let ress = await this.$http.post(urls, reqs);
			if (ress.data.state === 'SUCCESS') {
				this.getBasicsInfo();
				if (ress.data.data.length > 0) {
					this.isOwner = true;
					uni.setStorageSync('is_owner', true);
					uni.setStorageSync('infoObj', ress.data.data[0]);
					return this.isOwner
				}
			}
		}
	},
	created() {
		// #ifdef H5
		if (this.$route.query.website_no) {
			this.website_no = this.$route.query.website_no;
			this.getWebsiteList();
		}
		// #endif

		// #ifdef MP-WEIXIN
		this.website_no = 'WS2020060611100007';
		this.getWebsiteList();
		// #endif
	},
	onLoad(option) {
		this.website_no = option.website_no;
		uni.setStorageSync('is_owner', false);
		if (option.destApp) {
			uni.setStorageSync('activeApp', option.destApp);
		}
		console.log('--------------', uni.getStorageSync('activeApp'));

		// console.log("option",option)
	},
	onShareAppMessage(res) {
		console.log('res=====>>>>>', res);
		return {
			title: '邀请来访',
			path: '/pages/public/proc/apply/apply?serviceName=srvzhxq_guest_mgmt_add',
			imageUrl: '../../../static/xx.png'
		};
	}
};
</script>

<style lang="scss"></style>
