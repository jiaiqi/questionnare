<template>
	<view class="container999 " @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd">
		<refresh ref="refresh" @isRefresh="isRefresh"></refresh>
		<view class="nav">
			<!-- #ifdef H5 -->
			<view style="height: 45px;width: 100%;">边距盒子</view>
			<!-- #endif -->
			<!-- 搜索 -->
			<!-- <view class='searchInput999'>
				<view class='searchBox999'>
					<image src='/static/icon-search.png' class='search999'></image>
				</view>
				<input class='input999' placeholder="输入关键词"></input>
			</view> -->
			<!-- 导航栏 agents导航栏标题 -->
			<!-- 刷新组件需搭配scroll-view使用，并在pages.json中添加 "disableScroll":true-->
			<view class="bg-blue info-hander_title justify-between">
				<picker v-if="depts.length !== 0" @change="PickerChange" range-key="dept_name" :value="onDept" :range="depts">
					<view class="picker text-white">
						<text class="cuIcon-home"></text>
						{{ onDept > -1 ? (depts[onDept].dept_name === null ? '暂无单位信息' : depts[onDept].dept_name) : '' }}{{ depts.length > 0 ? '[切换]' : '' }}
					</view>
				</picker>
				<button class="cu-btn round bg-yellow shadow-blur" @click="showModalView()" v-if="!depts[onDept]">
					<text class="cuIcon-add icon"></text>
					开通
				</button>
			</view>
			<navTab ref="navTab" :currentTab="currentTab" :tabTitle="tabTitle" @changeTab="changeTab"></navTab>
		</view>
		<!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
		<swiper style="min-height: 100vh;" :current="currentTab" @change="swiperTab">
			<swiper-item v-for="(listItem, listIndex) in list" :key="listIndex">
				<scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="lower1" scroll-with-animation :scroll-into-view="toView">
					<view :id="'top' + listIndex" style="width: 100%;height: 180upx;"></view>
					<view class="content">
						<!-- 搜索 -->
						<view class="searchInput999">
							<view class="searchBox999"><image src="/static/icon-search.png" class="search999"></image></view>
							<input type="text" class="input999" placeholder="输入关键词" @confirm="onSearch" confirm-type="search" />
						</view>
						<view class="cu-list menu-avatar" v-if="currentTab === 0">
							<view class="cu-item" v-for="(item, index) in carData" :key="index" @click="toCarInfo(item)" style="width: 100%;">
								<image class="cu-avatar radius lg" :src="item.picUrl"></image>
								<view class="content">
									<view style="display: flex;justify-content: space-between;">
										<view class="text-cut">
											车牌:
											<text class="text-bold">{{ item.car_no }}</text>
										</view>
										<view class="cu-tag round bg-orange lg text-large">{{ item.person_num === null ? '-' : item.person_num }}人</view>
									</view>
									<view class="text-gray text-lg flex">
										<view class="text-cut">来源：{{ item.from_addr }}</view>
									</view>
									<view style="display: flex;justify-content: space-between;">
										<view class="text-grey text-lg">{{ item.create_time }}</view>
										<view class="cuIcon-edit  text-xl text-blue" @click.stop="toUpdate(item)">编辑</view>
									</view>
								</view>
							</view>
						</view>
						<view class="cu-list menu-avatar" v-if="currentTab === 1">
							<view class="cu-item" v-for="(item, index) in personData" :key="index" @click="toPersonInfo(item)">
								<image class="cu-avatar radius lg" :src="item.picUrl"></image>
								<view class="content">
									<view style="display: flex;justify-content: space-between;">
										<view class="text-cut">
											姓名:
											<text class="text-bold">{{ item.name }}</text>
										</view>
										<view class="cu-tag round bg-orange lg text-large">{{ item.temperature ? item.temperature + '℃' : '未记录' }}</view>
									</view>
									<view class="text-gray text-lg flex">
										<view class="text-cut">
											<text class="cuIcon-dianhua text-gray margin-right-xs"></text>
											电话：{{ item.phone ? item.phone : '未记录' }}
										</view>
									</view>
									<view class="text-gray text-lg flex">
										<view class="text-cut">
											<text class="cuIcon-newsfill text-gray margin-right-xs"></text>
											身份证号：{{ item.id_card_no ? item.id_card_no : '未记录' }}
										</view>
									</view>
									<view class="" style="display: flex;justify-content: space-between;">
										<view class="text-grey text-lg">{{ item.create_time }}</view>
										<view class="cuIcon-edit  text-xl text-blue" @click.stop="toUpdate(item)">编辑</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="noCard" v-if="listItem.length === 0">暂无信息</view> -->
					<view style="width: 100%;height: 100upx;opacity:0;">底部占位盒子</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="cu-bar tabbar foot bg-white" v-if="depts[onDept]">
			<view class="bottom-view ">
				<text>总数:</text>
				<text class="text">{{ pageInfo.total }}</text>
				{{ currentTab === 0 ? '辆' : '人' }}
			</view>
			<view class="action text-blue text-lg add-action" style="font-size: 30upx;paddint-top:12upx;">
				<button class="cu-btn cuIcon-add bg-blue shadow" @click="toCreate"></button>
				创建{{ tabTitle[currentTab] }}
			</view>
			<view class="bottom-view">今日：{{ dayNum }}{{ currentTab === 0 ? '辆' : '人' }}</view>
		</view>
		<view class="cu-modal bottom-modal" :class="showModal ? 'show' : ''">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-modal-content"><bxform ref="bxform" @on-form-item="onItemButtons($event)" :fields="configCols"></bxform></view>
				<view class="cu-bar bg-white padding-sm foot-buttons">
					<button class="cu-btn round bg-red shadow-blur" @click.stop="hideModal">取消</button>
					<button class="cu-btn round bg-blue shadow-blur" @click.stop="addUser">确定</button>
				</view> 
			</view>
		</view>
	</view>
</template>

<script>
const util = require('@/util/util.js');
import refresh from '@/components/tablist/refresh.vue';
import navTab from '@/components/tablist/navTab.vue';
import tabBar4 from '@/components/tablist/tabBar4.vue';
import bxform from '@/components/form.vue';
export default {
	components: { refresh, navTab, tabBar4, bxform },
	data() {
		return {
			onDept: 0,
			showModal: false,
			currentPage: 'index',
			dayNum: 0,
			toView: '', //回到顶部id
			keyword: '', //搜索关键词
			showLoginModal: false,
			tabTitle: ['车辆', '人员'], //导航栏格式 --导航栏组件
			currentTab: 0, //sweiper所在页
			pages: [1, 1, 1, 1], //第几个swiper的第几页
			list: [{}], //数据格式
			pageInfo: {
				pageNo: 1,
				rownumber: 10,
				total: 0
			},
			carData: [],
			personData: [],
			fromUser: '',
			depts: [],
			configCols: [
				{
					label: '姓名',
					column: 'name',
					value: '',
					type: 'input',
					isRequire: true,
					isShowExp: [
						// {
						// 	column: 'name',
						// 	type: 'neq',
						// 	value: ''
						// }
					],
					// buttons: [
					// 	{
					// 		name: '拍照',
					// 		type: 'navTo'
					// 	}
					// ],
					options: []
				},
				{
					label: '电话',
					column: 'mobile',
					value: '',
					type: 'number',
					isRequire: false,
					isShowExp: [],
					options: []
				}
			]
		};
	},
	created() {
		this.initLogin();
	},
	onLoad(option) {
		uni.hideNavigationBarLoading();
		this.judgeClientEnviroment();
		if (option.hasOwnProperty('fromUser')) {
			this.fromUser = option.fromUser;
		}
		if (option.currentTab) {
			this.currentTab = parseInt(option.currentTab);
			console.log('option.currentTab', this.currentTab, option.currentTab);
			let r = {
				detail: {
					current: this.currentTab
				}
			};
			this.$refs.navTab.longClick(this.currentTab);
		}
	},
	onShow(option) {
		// this.getList(this.currentTab);
	},
	onShareAppMessage(res) {
		let userInfo = uni.getStorageSync('visiter_user_info');
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		let userNo = userInfo.user_no;
		console.log('onShareAppMessageuserNo', userNo);
		return {
			title: '邀请您加入疫情信息采集',
			path: '/pages/home/home?fromUser=' + userNo
		};
	},
	onHide() {},
	methods: {
		onSearch(e) {
			console.log('关键词:', e.detail.value);
			this.keyword = e.detail.value;
			this.pageInfo = {
				pageNo: 1,
				rownumber: 10,
				total: 1
			};
			if (this.currentTab === 0) {
				// 车辆
				this.geCarData(e.detail.value);
			} else if (this.currentTab === 1) {
				// 人员
				this.getPersonData(e.detail.value);
			}
		},
		onItemButtons(e) {
			// {
			// 	column: "name", //点击字段的column .其余为buttons 里配置内容
			// 	name: "拍照",
			// 	type: "navTo"}
			console.log('点击了表单按钮', e);
		},
		PickerChange(e) {
			console.log(e);
			this.onDept = e.detail.value;
			this.tabSelect();
		},
		async addUser() {
			// 提交表单
			let itemData = this.$refs.bxform.getFieldModel();
			let url = this.getServiceUrl('daq', 'srvdaq_check_staff_add', 'add');
			let req = [
				{
					serviceName: 'srvdaq_check_staff_add',
					data: [itemData]
				}
			];
			console.log('表单填写', itemData);
			if (itemData) {
				// 新增
				url = this.getServiceUrl('daq', 'srvdaq_check_staff_add', 'add');
				req = [{ serviceName: 'srvdaq_check_staff_add', data: [itemData] }];
				let response = await this.$http.post(url, req);
				console.log('srvdaq_check_staff_add', response);
				if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
					console.log('srvdaq_check_person_add', response.data.response);
					this.getUserRole();
					this.hideModal();
				}
			} else {
				console.log('表单填写不完整');
			}
		},
		getUserRole() {
			let req = { serviceName: 'srvdaq_login_check_staff_select', colNames: ['*'] };
			let url = this.getServiceUrl('daq', 'srvdaq_login_check_staff_select', 'select');
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					this.depts = res.data.data;
					this.depts.map((item,index)=>{
						if(item.selected){
							this.onDept = index
						}
					})
				}
			});
		},
		tabSelect(e) {
			if (e) {
				this.currentTab = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
			}

			if (this.currentTab === 0) {
				// 车辆
				this.geCarData();
			} else if (this.currentTab === 1) {
				// 人员
				this.getPersonData();
			}
		},
		toTop() {
			this.toView = '';
			setTimeout(() => {
				this.toView = 'top' + this.currentTab;
			}, 10);
		},
		async getList(e) {
			if (e === 0) {
				let url = this.getServiceUrl('daq', 'srvdaq_activity_mine_select', 'select');
				let req = { serviceName: 'srvdaq_activity_mine_select', colNames: ['*'] };
				let response = await this.$http.post(url, req);
				if (response.data.state === 'SUCCESS' && response.data.data.length > 0) {
					this.list[e] = response.data.data;
					console.log('this.activityData', this.activityData);
				}
			}
		},
		async getDayNum(e) {
			let time = this.getDayDate();
			console.log('当前日期', time);
			let url = this.getServiceUrl('daq', 'srvdaq_activity_mine_select', 'select');
			let req = {
				serviceName: 'srvdaq_activity_mine_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'create_time',
						ruleType: 'gt',
						value: time
					}
				]
			};
			if (e === 1) {
				req.serviceName = 'srvdaq_check_person_select';
				url = this.getServiceUrl('daq', 'srvdaq_check_person_select', 'select');
			} else if (e === 0) {
				req.serviceName = 'srvdaq_check_car_select';
				url = this.getServiceUrl('daq', 'srvdaq_check_car_select', 'select');
			}
			if (this.onDept !== null && this.depts.length > 0 && (this.depts[this.onDept].dept_no !== '' && this.depts[this.onDept].dept_no !== null)) {
				req.condition.push({
					colName: 'dept_no',
					ruleType: 'eq',
					value: this.depts[this.onDept].dept_no
				});
			}
			console.log('dayNum=====》', e, this.currentTab);
			let response = await this.$http.post(url, req);
			if (response.data.state === 'SUCCESS' && response.data.data.length > 0) {
				console.log('dayNum=====》', this.dayNum, response.data.data);
				this.dayNum = response.data.data.length;
			}else{
				this.dayNum = 0
			}
		},
		changeTab(index) {
			this.currentTab = index;
			this.pageInfo = {
				pageNo: 1,
				rownumber: 10,
				total: 1
			};
			console.log('当前changeTab', index);
			if (this.currentTab === 0) {
				// 车辆
				this.geCarData();
			} else if (this.currentTab === 1) {
				// 人员
				this.getPersonData();
			}
		},

		// swiper 滑动
		swiperTab: function(e) {
			var index = e.detail.current; //获取索引
			console.log('当前索引是', index);
			let self = this;
			self.$refs.navTab.longClick(index);
		},
		// 其他请求事件 当然刷新和其他请求可以写一起 多一层判断。
		isRequest() {
			return new Promise((resolve, reject) => {
				this.pages[this.currentTab]++;
				var that = this;
				this.pageInfo.pageNo++;
				if (this.currentTab === 0) {
					this.geCarData();
				} else if (this.currentTab === 1) {
					this.getPersonData();
				}
				setTimeout(() => {
					uni.hideLoading();
					// uni.showToast({
					// 	icon: 'none',
					// 	title: `请求第${that.currentTab + 1}个导航栏的第${that.pages[that.currentTab]}页数据成功`
					// });
					// let newData = ['新数据1', '新数据2', '新数据3'];
					// resolve(newData);
				}, 1000);
			});
		},
		// 加载更多 util.throttle为防抖函数
		lower1: util.throttle(function(e) {
			let page = this.pageInfo;
			if (page.rownumber * page.pageNo >= page.total) {
				uni.showToast({
					title: '已经没有数据了...',
					icon: 'none'
				});
			} else {
				console.log(`加载${this.currentTab}`); //currentTab表示当前所在页数 根据当前所在页数发起请求并带上page页数
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.isRequest().then(res => {
					let tempList = this.list;
					tempList[this.currentTab] = tempList[this.currentTab].concat(res);
					console.log(tempList);
					this.list = tempList;
					this.$forceUpdate(); //二维数组，开启强制渲染
				});
			}
		}, 300),
		// 刷新touch监听
		refreshStart(e) {
			this.$refs.refresh.refreshStart(e);
		},
		refreshMove(e) {
			this.$refs.refresh.refreshMove(e);
		},
		refreshEnd(e) {
			this.$refs.refresh.refreshEnd(e);
		},
		isRefresh() {
			setTimeout(() => {
				this.pageInfo = {
					pageNo: 1,
					rownumber: 10,
					total: 1
				};
				if (this.currentTab === 0) {
					this.geCarData();
				} else if (this.currentTab === 1) {
					this.getPersonData();
				}
				// uni.showToast({
				// 	icon: 'success',
				// 	title: '刷新成功'
				// });
				// this.$refs.refresh.endAfter(); //刷新结束调用
			}, 1000);
		},

		geCarData(keyword) {
			console.log('查询测量', this.currentTab);
			this.getDayNum(0);
			const serviceName = 'srvdaq_check_car_select';
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				page: { pageNo: this.pageInfo.pageNo, rownumber: this.pageInfo.rownumber },
				order: [{ colName: 'create_time', orderType: 'desc' }]
			};
			if (this.onDept !== null && this.depts.length > 0 && (this.depts[this.onDept].dept_no !== '' && this.depts[this.onDept].dept_no !== null)) {
				req.condition.push({
					colName: 'dept_no',
					ruleType: 'eq',
					value: ''
				});
				req.condition[0].value = this.depts[this.onDept].dept_no;
			}
			if (keyword) {
				req.condition.push({
					colName: 'car_no',
					ruleType: 'like',
					value: keyword
				});
			}
			let url = this.getServiceUrl('daq', serviceName, 'select');
			this.$http.post(url, req).then(res => {
				this.$refs.refresh.endAfter(); //刷新结束调用
				if (res.data.state === 'SUCCESS') {
					this.pageInfo = res.data.page;
					const listData = res.data.data;
					if (this.pageInfo.pageNo === 1) {
						this.carData = listData;
					} else if (this.pageInfo.pageNo > 1) {
						this.carData = this.carData.concat(listData);
						uni.showToast({
							title: '加载成功'
						});
					}
					this.carData.map((item, index) => {
						// let condition = [{ colName: 'vehicle_no', ruleType: 'eq', value: res }];
						this.getPicture(item.car_photo, index);
					});
					this.list[0] = this.carData;
				}
			});
		},
		getPersonData(keyword) {
			this.getDayNum(1);
			console.log('查询人员', this.currentTab);
			const serviceName = 'srvdaq_check_person_select';
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				page: { pageNo: this.pageInfo.pageNo, rownumber: this.pageInfo.rownumber },
				order: [{ colName: 'create_time', orderType: 'desc' }]
			};
			if (this.onDept !== null && this.depts.length > 0 && (this.depts[this.onDept].dept_no !== '' && this.depts[this.onDept].dept_no !== null)) {
				req.condition.push({
					colName: 'dept_no',
					ruleType: 'eq',
					value: ''
				});
				req.condition[0].value = this.depts[this.onDept].dept_no;
			}
			if (keyword) {
				req.condition.push({
					colName: 'name',
					ruleType: 'like',
					value: keyword
				});
			}
			let url = this.getServiceUrl('daq', serviceName, 'select');
			this.$http.post(url, req).then(res => {
				this.$refs.refresh.endAfter();
				if (res.data.state === 'SUCCESS') {
					this.pageInfo = res.data.page;
					const listData = res.data.data;
					if (this.pageInfo.pageNo === 1) {
						this.personData = listData;
					} else if (this.pageInfo.pageNo > 1) {
						this.personData = this.personData.concat(listData);
						uni.showToast({
							title: '加载成功'
						});
					}
					this.personData.map((item, index) => {
						// let condition = [{ colName: 'vehicle_no', ruleType: 'eq', value: res }];
						// this.getPicture(item.id_card_photo, index);
						this.getPicture(item.profile_picture, index);
					});
					console.log('加载成功');
					this.list[1] = this.personData;
				}
			});
		},
		getPicture(file_no, index) {
			const serviceName = 'srvfile_attachment_select';
			const url = this.getServiceUrl('file', serviceName, 'select');
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
			};
			if (file_no !== null && file_no !== '' && file_no !== undefined) {
				this.$http.post(url, req).then(res => {
					if (res.data.state === 'SUCCESS') {
						const data = res.data.data[0];
						if (data) {
							const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl;
							if (this.currentTab === 0) {
								// 车辆
								let item = this.carData[index];
								item['picUrl'] = fileurl;
								this.$set(this.carData, index, item);
							} else if (this.currentTab === 1) {
								// 人员
								let item = this.personData[index];
								item['picUrl'] = fileurl;
								this.$set(this.personData, index, item);
							}
						}
					}
				});
			}
		},
		toCreate() {
			console.log(this.depts);
			if (this.depts.length > 0) {
				const dept_no = this.depts[this.onDept].dept_no;
				if (this.currentTab === 0) {
					// 跳转到车辆信息登记页面
					uni.navigateTo({
						url: '../checkInCarInfo/checkInCarInfo?dept_no=' + dept_no + '&formType=form'
					});
				} else if (this.currentTab === 1) {
					// 跳转到人员信息登记页面
					uni.navigateTo({
						url: '../checkInPersonInfo/checkInPersonInfo?dept_no=' + dept_no + '&formType=form'
					});
				}
			}
		},
		toSearch() {
			if (this.currentTab === 0) {
				// 跳转到车辆信息搜索页面
			} else if (this.currentTab === 1) {
				// 跳转到人员信息搜索页面
			}
		},
		toUpdate(e) {
			if (e) {
				const dept_no = this.depts[this.onDept].dept_no;
				if (this.currentTab === 0) {
					uni.navigateTo({
						url: '../checkInCarInfo/checkInCarInfo?id=' + e.id + '&formType=form&dept_no=' + dept_no
					});
				} else {
					uni.navigateTo({
						url: '../checkInPersonInfo/checkInPersonInfo?id=' + e.id + '&formType=form&dept_no=' + dept_no
					});
				}
			}
		},
		toCarInfo(e) {
			console.log(e);
			uni.navigateTo({
				url: '../checkInCarInfo/checkInCarInfo?id=' + e.id + '&formType=detail'
			});
		},
		toPersonInfo(e) {
			uni.navigateTo({
				url: '../checkInPersonInfo/checkInPersonInfo?id=' + e.id + '&formType=detail'
			});
		},
		initLogin() {
			let that = this;
			let code = null;
			// #ifdef H5
			code = this.$route.query.code;
			// #endif
			let isLogin = uni.getStorageSync('is_login');
			console.log('是否绑定账号:', isLogin);
			let isWeixinClient = this.isWeixinClient();
			const client_env = uni.getStorageSync('client_env');
			console.log('是否微信环境', isWeixinClient);
			if (isWeixinClient) {
				//微信环境(小程序或者公众号)
				if (code || client_env === 'wxmp') {
					// 已经得到code,进行验证登录
					console.log('已获取到code,即将进行验证登录');
					this.saveWxUser();
				} else if (!code && client_env !== 'wxmp') {
					//公众号 未授权 -> 获取授权
					console.log('未发现code,尝试获取重定向链接', client_env, code);
					// #ifdef H5
					that.getAuthorized();
					// #endif
					// #ifdef MP-WEIXIN
					this.saveWxUser();
					// #endif
				}
			} else if (!isWeixinClient) {
				// 非微信环境(H5或APP)
				if (isLogin) {
				} else {
					this.showLoginModal = true;
				}
			}
		},
		async getAuthorized() {
			// 公众号环境获取回调地址(在回调地址中获取code)
			let url = this.getServiceUrl('wx', 'srvwx_public_page_authorization', 'operate');
			let req = [
				{
					data: [
						{
							app_no: this.$api.appNo.wxh5,
							redirect_uri: this.$api.frontEndAddress
						}
					],
					serviceName: 'srvwx_public_page_authorization'
				}
			];
			let response = await this.$http.post(url, req);
			console.log('response:', response);
			if (response.data.response[0].response.authUrl) {
				console.log('redirctUrl:', response.data.response[0].response.authUrl);
				window.location.href = response.data.response[0].response.authUrl;
			} else {
				uni.showToast({
					title: response.data.resultMessage,
					icon: 'none'
				});
			}
		},
		saveWxUser() {
			// 静默登录(验证登录)
			return
			let that = this;
			// #ifdef MP-WEIXIN
			wx.login({
				// 获取小程序code
				success(res) {
					if (res.code) {
						//验证登录
						let url = that.$api.verifyLogin.url;
						let req = [
							{
								data: [
									{
										code: res.code,
										app_no: that.$api.appNo.wxmp
									}
								],
								serviceName: 'srvwx_app_login_verify'
							}
						];
						that.$http.post(url, req).then(response => {
							if (response.data.resultCode === 'SUCCESS') {
								let resData = response.data.response[0].response;
								let expire_timestamp = parseInt(new Date().getTime() / 1000) + resData.expire_time; //过期时间的时间戳
								uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
								uni.setStorageSync('expire_time', resData.expire_time); // 过期时间
								uni.setStorageSync('expire_timestamp', expire_timestamp); // 过期时间
								if (resData.login_user_info) {
									//匿名登录
									uni.setStorageSync('is_login', false);
									uni.setStorageSync('visiter_user_info', resData.login_user_info); //匿名登录信息
									// that.$store.commit('setOpenid', resData.login_user_info.openid);
									that.openid = resData.login_user_info.openid;
									uni.setStorageSync('user_type', '匿名用户'); //微信环境匿名用户
									console.log('微信小程序环境---未登录');

									that.getUserRole();
									that.$refs.navTab.longClick(that.currentTab);
									// that.toAccountLogin(); 
								} else {
									// 已绑定账号用户登录
									uni.setStorageSync('is_login', true);
								}
							} else if (response.data.resultCode === 'FAILURE') {
								uni.setStorageSync('is_login', false);
								uni.showToast({
									title: response.data.resultMessage
								});
							}
						});
					} else {
						uni.setStorageSync('is_login', false); // 登录状态
						console.log('登录失败！' + res.errMsg);
					}
				}
			});
			// #endif
			// #ifdef H5
			const isWeixinClient = that.isWeixinClient();
			if (isWeixinClient) {
				// 公众号环境
				let req = [
					{
						data: [
							{
								code: that.$route.query.code,
								app_no: that.$api.appNo.wxh5
							}
						],
						serviceName: 'srvwx_app_login_verify'
					}
				];
				const url = this.getServiceUrl('wx', 'srvwx_app_login_verify', 'operate');
				this.$http.post(url, req).then(response => {
					if (response.data.resultCode === 'SUCCESS' && response.data.response[0].response) {
						console.log('授权成功', response);
						let resData = response.data.response[0].response;
						let loginMsg = {
							bx_auth_ticket: resData.bx_auth_ticket,
							expire_time: resData.expire_time
						};
						let expire_timestamp = parseInt(new Date().getTime() / 1000) + loginMsg.expire_time; //过期时间的时间戳(秒)
						uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
						uni.setStorageSync('expire_time', resData.expire_time); // 有效时间
						uni.setStorageSync('expire_timestamp', expire_timestamp); // 过期时间

						if (resData.login_user_info.data) {
							uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
							// this.$store.commit('setOpenid', resData.login_user_info.data[0].openid);
						}
						// self.$store.commit('setAuthorState', true);
						// this.getList(this.currentTab);
						this.hideModal();
					} else {
						// self.$store.commit('setAuthorState', false);
						console.log('授权失败');
					}
				});
			}

			// #endif
			// this.geCarData();
		},
		checkAuthorization() {
			// 查看是否授权获取用户信息
			// #ifdef MP-WEIXIN
			uni.getUserInfo({
				provider: 'weixin',
				success: function(infoRes) {
					uni.setStorageSync('userInfo', infoRes.userInfo);
				},
				fail: errMsg => {
					console.log('获取用户信息失败失败', errMsg);
					uni.navigateTo({
						url: '../authorization/authorization'
					});
				}
			});
			let that = this;
			uni.authorize({
				scope: 'scope.userInfo',
				success(res) {
					that.userInfoAuth = true;
					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							uni.setStorageSync('userInfo', infoRes.userInfo);
						},
						fail: errMsg => {
							console.log('获取用户信息失败失败', errMsg);
							uni.navigateTo({
								url: '../authorization/authorization'
							});
						}
					});
				},
				fail(errMsg) {
					that.userInfoAuth = false;
				}
			});
			// #endif
		},
		hideModal(e) {
			this.showModal = false;
		},
		showModalView() {
			this.showModal = true;
		}
	}
};
</script>

<style lang="scss" scoped>
uni-app,
uni-page-head {
	display: none;
}
.container999 {
	width: 100vw;
	font-size: 28upx;
	min-height: 100vh;
	overflow: hidden;
	color: #6b8082;
	position: relative;
	background-color: #f6f6f6;
}
.content {
	width: 100%;
}

.card {
	width: 90%;
	height: 368upx;
	background-color: white;
	margin: 0 auto 42upx auto;
	background: #ffffff;
	box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	position: relative;
}

.noCard {
	width: 90%;
	height: 200upx;
	margin: auto;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999999;
	box-shadow: 0 0 10upx 0 rgba(0, 0, 0, 0.1);
	border-radius: 10upx;
}

.nav {
	position: fixed;
	left: 0;
	top: 0;
	color: white;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	font-size: 24upx;
	background-color: #50b7ea;
	z-index: 996;
}

.searchInput999 {
	width: 90%;
	padding: 10upx;
	margin: 12upx auto;
	background: white;
	border-radius: 30upx;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 66upx;
}

.search999 {
	width: 32upx;
	height: 32upx;
}

.searchBox999 {
	width: 56upx;
	height: 56upx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.input999 {
	color: #999;
	width: 80%;
}
// 首页
.info-hander_title {
	height: 80upx;
	width: 100%;
	line-height: 80upx;
	font-size: 42upx;
	display: flex;
	flex-direction: row;
	padding: 10upx;
	box-sizing: border-box;
	justify-content: baseline;
	align-content: center;
	align-items: center;
	.picker {
		box-sizing: border-box;
		padding: 10upx;
		font-size: 32upx;
	}
	.button {
		flex: 2;
		justify-content: flex-end;
	}
}
.cu-list.menu-avatar > .cu-item {
	height: 220rpx;
}
.cu-list.menu-avatar > .cu-item .content {
	width: 75%;
}
.cu-list.menu-avatar > .cu-item .flex .text-cut {
	max-width: 700upx;
}
.text-lg {
	line-height: 50upx;
}
.text-bold {
	margin-left: 10upx;
	display: inline-block;
	line-height: 50upx;
	font-weight: 600;
	font-size: 36upx;
}
.text-large {
	font-size: 36upx;
}
.foot-buttons {
	min-height: 200upx;
	justify-content: space-around;
}
.bottom-view {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	line-height: 40upx;
	.text {
		font-weight: 600;
		padding: 0 10upx;
	}
}
</style>
