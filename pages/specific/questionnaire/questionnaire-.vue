<template>
	<view class="question-wrap" v-if="configCols.length > 0">
		<!-- <view class="cu-card article ">
			<view class="cu-item shadow">
				<view class="title center">
					<view class="text-cut">{{ formData.title }}</view>
				</view>
				<view class="content">
					<view class="desc">
						<view class="text-content">{{ formData.remark }}</view>
						<view>
							<view class="cu-tag bg-red light sm round">{{ formData.create_time }}</view>
							<view class="cu-tag bg-green light sm round">{{ formData.user_state }}</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<view class="question-title">{{ formData.title }}</view>
		<view class="question-remark">{{ formData.remark }}</view>
		<view class="question-content">
			<view class="form-wrap"><bxform ref="bxform" :fields="configCols" :BxformType="formType" @value-blur="saveValue"></bxform></view>
		</view>
		<view class="button-box" v-if="formType === 'form'">
			<!-- <button type="primary" @click="submitForm('save')" :disabled="formType === 'preview'">保存</button> -->
			<button type="primary" @click="submitForm('submit')" :disabled="formType === 'detail'">提交</button>
		</view>
		<!-- 结束语 -->
		<!-- <view class="cu-card article" :class="isCard ? 'no-card' : ''">
			<view class="cu-item shadow">
				<view class="content">
					<view class="desc">
						<view class="text-content">{{ formData.end_remark }}</view>
						
					</view>
				</view>
			</view>
		</view> -->
		<view class="question-endremark">{{ formData.end_remark }}</view>
	</view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form-item.vue';
var wx = require('jweixin-module');
export default {
	name: 'questionnaire', //问卷答题页面
	components: {
		bxform
	},
	data() {
		return {
			formType: 'form', // 表单类型 预览:detail 正常:form
			activity_no: '', // 问卷编号
			configCols: [],
			formData: {
				title: '', // 标题
				remark: '', //欢迎语
				end_remark: '' //结束语
			},
			userInfo: {}, // 登录用户信息
			wxUserInfo: {} // 微信用户信息
		};
	},
	methods: {
		saveValue(e) {
			console.log('e', e);
			if (e.value) {
				// return
				let itemData = [
					{
						item_no: e.column,
						option_data: [e.value]
					}
				];
				if (e.type === 'checkbox') {
					itemData = [
						{
							item_no: e.column,
							option_data: e.value
						}
					];
				}
				const serviceName = 'srvdaq_activity_result_save';
				const url = this.getServiceUrl('daq', serviceName, 'operate');
				let req = [
					{
						serviceName: serviceName,
						data: [
							{
								activity_no: this.activity_no,
								item_data: itemData
							}
						]
					}
				];
				this.$http.post(url, req).then(res => {
					if (res.data.state === 'SUCCESS') {
						if (res.data.resultCode === 'SUCCESS') {
							console.log(res.data);
							// uni.showToast({
							// 	title: '提交成功',
							// 	icon: 'none'
							// });
						}
					} else {
						console.log(res);
					}
				});
			}
		},
		submitForm() {
			let itemData = this.$refs.bxform.getFieldModel();
			let resultData = [];
			Object.keys(itemData).forEach(item => {
				let obj = {
					item_no: item,
					option_data: [itemData[item]]
				};
				resultData.push(obj);
			});
			let serviceName = 'srvdaq_activity_result_submit';
			const url = this.getServiceUrl('daq', serviceName, 'operate');
			let req = [
				{
					serviceName: serviceName,
					data: [
						{
							activity_no: this.activity_no,
							item_data: resultData
						}
					]
				}
			];
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					if (res.data.resultCode === 'SUCCESS') {
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						});
						uni.redirectTo({
							url: '../home/home'
						});
					}
				} else {
					console.log(res);
				}
			});
		},
		getQuestionnaireData() {
			// 获取问卷数据
			let that = this
			uni.showLoading({
				mask: true
			});
			const serviceName = 'srvdaq_init_view_select';
			const url = this.getServiceUrl('daq', serviceName, 'select');
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				order: [{ colName: 'item_seq', orderType: 'asc' }],
				condition: [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: this.activity_no
					},
					{
						colName: 'type', // 查看视图初始化
						ruleType: 'eq',
						value: 'use'
					}
				]
			};
			if (this.formType === 'form') {
				const userInfo = uni.getStorageSync('login_user_info');
				this.userInfo = userInfo;
				if (userInfo && userInfo.user_no) {
					req.condition.push({
						colName: 'from_user',
						ruleType: 'eq',
						value: userInfo.user_no
					});
				}
			}
			this.$http
				.post(url, req)
				.then(res => {
					uni.hideLoading();
					if (res.data.state === 'SUCCESS') {
						
						const data = res.data.data[0];
						this.activity_no = data.activity_no;
						let configCols = [];
						data.item_data.forEach(item => {
							configCols.push(this.getConfig(item));
						});
						if (data.user_data) {
							configCols.forEach(item => {
								data.user_data.forEach(items => {
									if (item.column === items.item_no) {
										if (items.option_data.length > 1) {
											item.value = items.option_data;
											console.log('items.option_data', items.option_data);
										} else {
											item.value = items.option_data[0];
										}
									}
								});
							});
						}
						this.formData = data;
						this.configCols = configCols;
						this.getUserInfo();
					} else if (res.data.resultCode === '0011') {
						// alert("getQuestionnaireData",res.data)
						// that.initLogin();
					}
				})
				.then(() => {
					console.log('getQuestionnaireData-then-getSignature');
					// this.getUserInfo();
					// this.getSignature();
				})
				.catch(err => {
					console.log('err', err);
					// this.getQuestionnaireData();
					uni.hideLoading();
				});
		},
		getUserInfo() {
			let url = this.$api.getUserInfo;
			let req = {
				serviceName: 'srvwx_basic_user_info_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxh5
					}
				]
			};
			this.$http.post(url, req).then(res => {
				console.log(res);
				if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
					const userInfo = res.data.data[0];
					this.wxUserInfo = userInfo;
				}
			});
			
			this.getSignature();
		},
		async getPicture(file_no) {
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
		},
		getConfig(e) {
			let config = {
				label: e.item_title,
				column: e.item_no,
				srvInfo: {
					serviceName: 'srvdaq_activity_result_submit',
					appNo: 'daq'
				},
				value: e.value,
				type: e.item_type,
				isRequire: e.is_require === '是' ? true : false,
				isShowExp: [],
				options: [],
				item_type_attr: e.item_type_attr
			};
			if (e.option_data && e.item_type === '选项') {
				config.options = e.option_data.map(item => {
					return item.option_value;
				});
			}
			if (e.item_type === '图片') {
				config['fileNum'] = e.item_type_attr['fileNum'];
			}
			if (e.item_type === '时间日期') {
				//date yearMonth dateTime time
				config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'dateTime';
			}
			switch (e.item_type) {
				case '文本':
					config.type = 'input';
					break;
				case '图片':
					config.type = 'images';
					break;
				case '选项':
					config.type = 'radio';
					break;
			}
			if (e.item_type === '数字') {
				// number-数字 digit-带小数点
				if (e.item_type_attr.numberType) {
					config.type = e.item_type_attr.numberType;
				} else {
					config.type = 'number';
				}
			}
			if (e.item_type === '选项') {
				// radio-单选 checkbox-多选
				if (e.item_type_attr && e.item_type_attr.radioType) {
					if (e.item_type_attr.radioType === 'single') {
						config.type = 'radio';
					} else if (e.item_type_attr.radioType === 'multi') {
						config.type = 'checkbox';
					}
				} else {
					config.type = 'radio';
				}
			}
			return config;
		},
		saveShareRecord(share_type) {
			let url = this.$api.saveShareRecord;
			let req = [
				{
					serviceName: 'srvdaq_record_share_add',
					data: [
						{
							biz_no: this.activity_no,
							biz_type: 'daq',
							share_url: window.location.href,
							from_user: this.userInfo.user_no,
							share_type: share_type ? share_type : '朋友圈'
						}
					]
				}
			];
			this.$http.post(url, req).then(res => {
				console.log(res);
			});
		},
		getSignature(formData) {
			let self = this;
			let linkurl = window.location.href.split('#')[0];
			// if (self.userInfo && self.userInfo.user_no) {
			// 	url += '&user_no=' + self.userInfo.user_no;
			// }
			let req = {
				serviceName: 'srvwx_app_signature_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxh5
					},
					{
						colName: 'page_url',
						ruleType: 'eq',
						// value: linkurl
						value: uni.getStorageSync('linkUrl') ? uni.getStorageSync('linkUrl') : window.location.href.split('#')[0]
					}
				]
			};
			if (uni.getStorageSync('linkUrl')) {
				// alert(uni.getStorageSync('linkUrl'));
			}
			uni.setStorageSync('linkUrl', null);
			self.$http.post(self.$api.getSignature, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					let resData = res.data.data[0];
					console.log('getSignature', resData);
					uni.setStorageSync('signatureInfo', resData);
					wx.config({
						debug: false, // 调试阶段建议开启
						appId: resData.appId, // APPID
						timestamp: resData.timestamp, // 时间戳timestamp
						nonceStr: resData.noncestr, // 随机数nonceStr
						signature: resData.signature, // 签名signature
						// 需要调用的方法接口
						jsApiList: [
							'updateAppMessageShareData',
							'updateTimelineShareData',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareWeibo',
							'onMenuShareQQ',
							'onMenuShareQZone'
						]
					});

					wx.ready(() => {
						console.log('wx.ready()', self.wxUserInfo);
						wx.updateAppMessageShareData({
							//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
							imgUrl: self.wxUserInfo.headimgurl ? self.wxUserInfo.headimgurl : self.formData.fileUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: self.formData.remark, // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: self.formData.title, // 分享卡片标题
							// link:  window.location.href, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
								// //// alert('分享成功')
								// self.saveShareRecord('朋友');
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
							}
						}); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
						wx.updateTimelineShareData({
							imgUrl: self.formData.fileUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: self.formData.remark, // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: self.formData.title, // 分享卡片标题
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
								// //// alert('分享成功')
								// self.saveShareRecord('朋友圈');
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
							}
						}); // 分享到微博
						wx.onMenuShareWeibo({
							imgUrl: self.formData.fileUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: self.formData.remark, // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: self.formData.title, // 分享卡片标题
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
								// //// alert('分享成功')
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
								// self.saveShareRecord('微博');
							}
						}); // 分享给手机QQ
					});
					wx.error(function(res) {});
				} else {
				}
			});
		},
		getParams(name) {
			let str = window.location.href;
			str = str.split('?')[1];
			let arr = str.split('&');
			let obj = {};
			arr.forEach(item => {
				obj[item.split('=')[0]] = item.split('=')[1];
			});
			if(obj[name]){
				return obj[name];
			}else{
				return false
			}
		},
		initLogin() {
			let that = this;
			let code = null;
			code = this.getParams('code');
			// 公众号环境
			
			// code = this.$route.query.code;
			console.log('code:', code);
			let isLogin = uni.getStorageSync('is_login');
			console.log('是否绑定账号:', isLogin);
			let isWeixinClient = this.isWeixinClient();
			const client_env = uni.getStorageSync('client_env');
			console.log('是否微信环境', isWeixinClient);
			if (isWeixinClient) {
				//微信环境
				let isLogin = uni.getStorageSync('isLogin');
				if (code && !isLogin) {
					// 已经得到code,进行验证登录
					console.log('已获取到code,即将进行验证登录');
					uni.showToast({
						title: "to saveWxUser"+code,
						icon: 'none'
					});
					that.saveWxUser();
				} else if(!isLogin){
					//公众号 未授权 -> 获取授权
					console.log('未发现code,尝试获取重定向链接');
					uni.showToast({
						title: "to getAuthorized"+code,
						icon: 'none'
					});
					that.getAuthorized();
				}else{
					that.getQuestionnaireData();
				}
			} else if (!isWeixinClient) {
				// 非微信环境(H5或APP)
				uni.showToast({
					title: '请在微信中访问此页面',
					icon: 'none',
					duration: 3000
				});
			}
		},
	
	},
	mounted() {
	},
	onShow() {},
	created() {},
	onLoad(option) {
		if (option.formType && option.formType === 'detail') {
			this.formType = option.formType;
		} else {
			this.formType = 'form';
		}
		if(option.activity_no) {
			this.activity_no = option.activity_no;
			this.getQuestionnaireData();
		}else{
			uni.reLaunch({
				url:this.$api.homePath
			})
		}
	}
};
</script>

<style lang="scss">
.question-wrap {
	width: 100%;
	display: flex;
	flex-direction: column;
	.question-title {
		width: calc(100% - 60upx);
		margin: 30upx auto 0;
		box-sizing: border-box;
		min-height: 60upx;
		text-align: left;
		font-weight: 600;
		font-size: 32upx;
		line-height: 40upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.question-remark {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin: 30upx;
		width: calc(100% - 60upx);
		padding: 30upx;
		line-height: 40upx;
		background: #eee;
		border-radius: 4px;
		border: 1px solid #ebeef5;
		background-color: #fff;
		overflow: hidden;
		color: #303133;
		transition: 0.3s;
	}
	.question-endremark {
		// box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin: 30upx 0;
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;
		line-height: 40upx;
		background: #eee;
		border-radius: 4px;
		border-top: 1px solid #ebeef5;
		// border: 1px solid #ebeef5;
		background-color: #fff;
		overflow: hidden;
		color: #303133;
		transition: 0.3s;
	}
	.button-box {
		width: calc(100% - 30upx);
		height: 100upx;
		margin: 30upx auto;
		display: flex;
		justify-content: center;
		align-items: center;
		button {
			width: 40%;
			height: 80upx;
			line-height: 80upx;
		}
	}
}
</style>
