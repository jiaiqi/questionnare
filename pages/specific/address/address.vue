<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index">
			<view class="wrapper" @click="checkAddress(item)">
				<view class="u-box">
					<text class="name">{{ item.userName }}</text>
					<text class="mobile">{{ item.telNumber }}</text>
				</view>
				<view class="address-box">
					<text v-if="item.defaultStatus == 1" class="tag">默认</text>
					<text class="address"> {{ item.provinceName }}-{{ item.cityName }}-{{ item.countyName }}-{{ item.detailInfo }}</text>
				</view>

			</view>
			<view class="" style="display: flex;flex-direction: row;width: 100%;justify-content: flex-end;">
				<view class="" style="width: 20%;display: flex;align-items: center;justify-content: center;" @click="addAddress('edit', item)">
					<text class="yticon icon-bianji"></text>
					<text style="font-size: 30upx;margin-left: 10upx;">编辑</text>
				</view>
				<view class="" style="width: 20%;display: flex;align-items: center;justify-content: center;" @click="delAddress(item)">
					<text class="yticon icon-iconfontshanchu1"></text>
					<text style="font-size: 30upx;">删除</text>
				</view>
			</view>
		</view>
		<!--<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
		</text>-->

		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
// import Api from '@/common/api';
var wx = require('jweixin-module');
export default {
	data() {
		return {
			source: 0,
			addressList: [
				{'userName':"候敏华1",'telNumber':'18700963685',
				'provinceName':'陕西','cityName':'西安','countyName':'雁塔区',
				'detailInfo':'科技五路泰祥花园','defaultStatus':1},
			],
		};
	},
	 onLoad(option) {
		// this.source = option.source;
		// this.getListAddress()
		const that = this
		   uni.setNavigationBarTitle({
		            title:'收货地址'
		    });
			

		
	},
	async onShow(){
		// this.getListAddress()
	},
	mounted() {
		this.getSignature()
	},
	methods: {
		async getListAddress(){
			let params = {};
			// this.addressList = await Api.apiCall('get', Api.goods.listAddress, params);
		},
		//选择地址
		checkAddress(item) {

		},
		addAddress(type, item) {
			uni.navigateTo({
				// url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
			});
		},
		//添加或修改成功之后回调
		refreshList(data, type) {
			//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
			this.addressList.unshift(data);

			console.log(data, type);
		},
		// 删除地址
		async delAddress(item){
			console.log(item)
			// let params = {
			// 	id: item.id
			// }
			let data = await Api.apiCall('post', Api.goods.deleteAddress, {id: item.id});
			if(data){
				uni.showToast({
					title: '删除成功',
				})
			}else{
				uni.showToast({
					title: '删除失败',
					icon: 'none'
				})
			}
			console.log("------删除-------",data)
		},
		
		/// 微信共享地址
		getSignature() {
			let self = this;
			let linkurl = window.location.href.split('#')[0];
			let req = {
				serviceName: 'srvwx_app_signature_select',
				colNames: ['*'],
				condition: [{
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
			self.$http.post(self.$api.getSignature, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					let resData = res.data.data[0];
					console.log('getSignature', resData);
					// uni.setStorageSync('signatureInfo', resData);
					wx.config({
						debug: false, // 调试阶段建议开启
						appId: resData.appId, // APPID
						timestamp: resData.timestamp, // 时间戳timestamp
						nonceStr: resData.noncestr, // 随机数nonceStr
						signature: resData.signature, // 签名signature
						// 需要调用的方法接口
						jsApiList: [
							  'openAddress',
							  'checkJsApi'
						]
					});
					wx.checkJsApi({
						jsApiList: [
							'openAddress',
						],
						success: function (res) {
							console.log(JSON.stringify(res));
						}
					});  
					
					wx.ready(function () {
						wx.openAddress({
						success: function (res) {
						// 用户接受
						aler(JSON.stringify(res));
						},
						cancel: function (errMsg) {
						// 用户取消
						aler(errMsg);
					}});
						// wx.openAddress({
						//   success: function (res) {
						// 	  console.log(res)
						//     // var userName = res.userName; // 收货人姓名
						//     // var postalCode = res.postalCode; // 邮编
						//     // var provinceName = res.provinceName; // 国标收货地址第一级地址（省）
						//     // var cityName = res.cityName; // 国标收货地址第二级地址（市）
						//     // var countryName = res.countryName; // 国标收货地址第三级地址（国家）
						//     // var detailInfo = res.detailInfo; // 详细收货地址信息
						//     // var nationalCode = res.nationalCode; // 收货地址国家码
						//     // var telNumber = res.telNumber; // 收货人手机号码
						//   }
						// });
					});
				
					wx.error(function(res) {});
				} else {}
			});
			
			
			
		},
		
		
		
		
		
		
		
		
		
	}
};
</script>

<style lang="scss">
page {
	padding-bottom: 120upx;
}
.content {
	position: relative;
}
.list {
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 20upx;
	background: #fff;
	position: relative;
}
.wrapper {
	width: 100%;
	display: flex;
	flex-direction: column;
	flex: 1;
}
.address-box {
	display: flex;
	align-items: center;
	margin: 10upx 0;
	.tag {
		font-size: 24upx;
		color: #fa436a;
		margin-right: 10upx;
		background: #fffafb;
		border: 1px solid #ffb4c7;
		border-radius: 4upx;
		padding: 4upx 10upx;
		line-height: 1;
	}
	.address {
		font-size: 28upx;
		color: #909399;
	}
}
.u-box {
	font-size: 32upx;
	color:#000000;
	// margin-top: 16upx;
	.name {
		margin-right: 30upx;
	}
}
.icon-bianji {
	// display: flex;
	// align-items: center;
	// height: 80upx;
	font-size: 36upx;
	color: #909399;
	// padding-left: 30upx;
}

.add-btn {
	position: fixed;
	left: 30upx;
	right: 30upx;
	bottom: 16upx;
	z-index: 95;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690upx;
	height: 80upx;
	font-size: 32upx;
	color: #fff;
	background-color: #fa436a;
	border-radius: 10upx;
	box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
