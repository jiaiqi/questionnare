<template>
	<view class="collect-wrap">
		<view class="camera-wrap" v-if="showCamera">
			<!-- <view class="collect-title" v-if="!showCamera">照片预览</view> -->
			<!-- #ifdef APP-PLUS||MP-WEIXIN -->
			<camera device-position="back" flash="auto" @error="error" style="width:750upx; height: 1115upx">
				<cover-image :src="addType === 'car' ? '@/static/img/car_horizonal.png' : '@/static/img/idcard01.png'" class="scan-img"></cover-image>
			</camera>
			<view class="take-photo-box"><image src="@/static/img/bd_ocr_take_photo_normal.png" @click="takePhoto" class="take-photo"></image></view>
			<!-- #endif -->

			<!-- #ifdef H5 -->
			<view class="collect-button"><button type="primary" @click="takePhoto">从相册选择照片</button></view>
			<!-- #endif -->
		</view>
		<view class="collect-box" v-if="!showCamera">
			<view class="image-box" v-if="addType === 'person'">
				<image src="@/static/img/idcard.png" mode="" class="image"></image>
				<image :src="previewImg" mode="aspectFit" class="image previewImg personImg"></image>
			</view>
			<view class="imgs-box" v-if="addType === 'car'">
				<image src="@/static/img/car_horizonal.png" mode="" class="image carPreviewImg"></image>
				<image :src="previewImg" mode="aspectFit" class="image PreviewCarImg"></image>
			</view>
			<view class="collect-button">
				<button type="primary" @click="clipImages">识别文字</button>
				<button type="primary" @click="toCarema">重新拍照</button>
			</view>
			<form v-if="addType === 'car'">
				<view class="cu-form-group margin-top">
					<view class="title">车牌号</view>
					<input placeholder="车牌号" name="input" v-model="formData.car_no" />
				</view>
			</form>
			<form v-if="addType === 'person'">
				<view class="cu-form-group margin-top">
					<view class="title">姓名</view>
					<input placeholder="姓名" name="input" v-model="formData.name" />
				</view>
				<view class="cu-form-group margin-top">
					<view class="title">地址</view>
					<input placeholder="地址" name="input" v-model="formData.id_card_addr" />
				</view>
				<view class="cu-form-group margin-top">
					<view class="title">身份证号</view>
					<input placeholder="身份证号" name="input" v-model="formData.id_card_no" />
				</view>
			</form>
			<button type="primary" @click="toForm" style="margin: 20upx auto;">下一步</button>
			<canvas style="width: 920px; height:1300px;position:fixed;top:99999999999999upx;" canvas-id="previewCarCanvas"></canvas>
			<canvas style="width:308px; height: 385px;position:fixed;top:99999999999999upx;" canvas-id="profileCanvas"></canvas>
			<canvas style="width: 848px; height: 585px;position:fixed;top:99999999999999upx;" canvas-id="previewCanvas"></canvas>
			<!-- <canvas style="width: 1042px; height: 700px;position:fixed;top:99999999999999upx;" canvas-id="previewCanvas"></canvas> -->
			<canvas style="width: 399px; height: 86px;position:fixed;top:99999999999999upx;" canvas-id="firstCanvas"></canvas>
			<canvas style="width:412px; height: 168px;position:fixed;top:99999999999999upx;" canvas-id="secondCanvas"></canvas>
			<canvas style="width: 590px; height: 85px;position:fixed;top:99999999999999upx;" canvas-id="thirdCanvas"></canvas>
			<canvas style="width: 307px; height: 105px;position:fixed;top:99999999999999upx;" canvas-id="carCandCanvas"></canvas>
		</view>
	</view>
</template>

<script>
// @ is an alias to /src
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import bxform from '@/components/form.vue';
export default {
	name: 'idCardInfoCollect',
	components: { uniPopup, bxform },
	data() {
		return {
			addType: '',
			showCamera: true,
			tempFilePath: '',
			beforeImg: '',
			previewImg: '',
			compressImg: '', //压缩后的图片
			afterImg: '', //裁剪之后的图
			fileList: [],
			picList: [],
			responseList: [],
			dept_no: '',
			formData: {
				name: '',
				id_card_addr: '',
				id_card_no: '',
				profile_picture: '',
				car_photo: '',
				car_no: ''
			}
		};
	},
	onLoad(option) {
		console.log('photo-option', option);
		if (option.dept_no) {
			this.dept_no = option.dept_no;
		}
		if (option.addType) {
			this.addType = option.addType;
		}
	},
	methods: {
		toForm() {
			const formData = this.formData;
			if (this.addType === 'car') {
				uni.redirectTo({
					url: '../checkInCarInfo/checkInCarInfo?formData=' + encodeURIComponent(JSON.stringify(formData)) + '&dept_no=' + this.dept_no
				});
			} else {
				uni.redirectTo({
					url: '../checkInPersonInfo/checkInPersonInfo?formData=' + encodeURIComponent(JSON.stringify(formData)) + '&dept_no=' + this.dept_no
				});
			}
		},
		getPreviewPic() {
			let that = this;
			let path = this.beforeImg;
			// 将身份证照片转为canvas图像(缩放为375px*250px)
			const uploadUrl = that.$api.upload;
			if (that.addType === 'car') {
				const ctx0 = uni.createCanvasContext('previewCarCanvas', this);
				// 改变中心点carCandCanvas
				// ctx0.translate(0, 688);
				// 旋转270°
				// ctx0.rotate((270 * Math.PI) / 180);
				// ctx0.drawImage(path, 0, 0, 688, 1024);
				ctx0.drawImage(path, 0, 0, 920, 1300);
				ctx0.draw(false, function(e) {
					that.fileList = [];
					that.picList = [];
					that.responseList = [];
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: 920,
						height: 1300,
						// width: 1024,
						// height: 688,
						destWidth: 920,
						destHeight: 1300,
						fileType: 'jpg',
						canvasId: 'previewCarCanvas',
						success: res => {
							// 车牌
							that.previewImg = res.tempFilePath;
							console.log('car-preview', res.tempFilePath);
							uni.uploadFile({
								url: uploadUrl,
								filePath: res.tempFilePath,
								name: 'file',
								header: {
									bx_auth_ticket: that.$api.onTicket ? that.$api.ticket : uni.getStorageSync('bx_auth_ticket')
								},
								formData: {
									serviceName: 'srv_bxfile_service',
									interfaceName: 'add',
									app_no: 'daq',
									table_name: 'bxdaq_check_car',
									columns: 'car_photo'
								},
								success: uploadFileRes => {
									const data = JSON.parse(uploadFileRes.data);
									that.formData.car_photo = data.file_no;
								}
							});
						}
					});
				});
			} else {
				const ctx0 = uni.createCanvasContext('previewCanvas', this);
				// 改变中心点
				ctx0.translate(0, 585);
				// ctx0.translate(0, 250);
				// 旋转270°
				ctx0.rotate((270 * Math.PI) / 180);
				ctx0.drawImage(path, 0, 0, 585, 848);
				// ctx0.drawImage(path, 0, 0, 250, 375);
				ctx0.draw(false, function(e) {
					that.fileList = [];
					that.picList = [];
					that.responseList = [];
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: 848,
						height: 585,
						destWidth: 848,
						destHeight: 585,
						fileType: 'jpg',
						canvasId: 'previewCanvas',
						success: res => {
							// 身份证
							that.previewImg = res.tempFilePath;
							console.log('that.previewImg', that.previewImg);
							uni.uploadFile({
								url: uploadUrl,
								filePath: res.tempFilePath,
								name: 'file',
								header: {
									bx_auth_ticket: that.$api.onTicket ? that.$api.ticket : uni.getStorageSync('bx_auth_ticket')
								},
								formData: {
									serviceName: 'srv_bxfile_service',
									interfaceName: 'add',
									app_no: 'daq',
									table_name: 'bxdaq_check_car',
									columns: 'car_photo'
								},
								success: uploadFileRes => {
									const data = JSON.parse(uploadFileRes.data);
									that.formData.id_card_photo = data.file_no;
								}
							});
						}
					});
				});
			}
		},
		clipImages() {
			uni.showLoading({
				title: '正在识别...'
			});
			// 将身份证照片裁剪为姓名、住址、身份证三个canvas图像
			const that = this;
			if (this.addType === 'person') {
				const ctx = uni.createCanvasContext('firstCanvas', this);
				ctx.drawImage(that.previewImg, 184, 83, 310, 90, 0, 0, 310, 90);
				// ctx.drawImage(that.previewImg, 212, 111, 399, 86, 0, 0, 399, 86);
				ctx.draw(false, function(e) {
					const attr = {
						width: 310,
						height: 90,
						id: 'firstCanvas',
						label: 'name'
					};
					that.getImg(attr);
				});
				// 头像
				const ctx1 = uni.createCanvasContext('profileCanvas', this);
				ctx1.drawImage(that.previewImg, 508, 111, 230, 312, 0, 0, 236, 312);
				ctx1.draw(false, function(e) {
					const attr = {
						width: 236,
						height: 312,
						id: 'profileCanvas',
						label: 'profile_picture'
					};
					that.getImg(attr);
				});
				// 住址
				const ctx2 = uni.createCanvasContext('secondCanvas', this);
				ctx2.drawImage(that.previewImg, 184, 281, 324, 142, 0, 0, 324, 142);
				// ctx2.drawImage(that.previewImg, 212, 328, 412, 168, 0, 0, 412, 168);
				ctx2.draw(false, function(e) {
					const attr = {
						width: 324,
						height: 142,
						id: 'secondCanvas',
						label: 'id_card_addr'
					};
					that.getImg(attr);
				});
				// 身份证号
				const ctx3 = uni.createCanvasContext('thirdCanvas', this);
				ctx3.drawImage(that.previewImg, 287, 423, 454, 88, 0, 0, 454, 88);
				// ctx3.drawImage(that.previewImg, 344, 513, 590, 85, 0, 0, 590, 85);
				// ctx3.drawImage(that.previewImg, 130, 160, 235, 70, 0, 0, 235, 70);
				ctx3.draw(false, function(e) {
					const attr = {
						width: 454,
						height: 88,
						id: 'thirdCanvas',
						label: 'id_card_no'
					};
					that.getImg(attr);
				});
			} else if (this.addType === 'car') {
				const ctx = uni.createCanvasContext('carCandCanvas', this);
				ctx.drawImage(that.previewImg, 280, 876, 380, 112, 0, 0, 380, 112);
				// ctx.drawImage(that.previewImg, 354, 433, 307, 105, 0, 0, 307, 105);
				ctx.draw(false, function(e) {
					const attr = {
						width: 380,
						height: 112,
						id: 'carCandCanvas',
						label: 'car_no'
					};
					that.getImg(attr);
				});
			}
		},
		getImg(canvasData) {
			// 将canvas图像转换成png格式图片
			const that = this;
			uni.canvasToTempFilePath({
				x: 0,
				y: 0,
				width: canvasData.width,
				height: canvasData.height,
				destWidth: canvasData.width,
				destHeight: canvasData.height,
				canvasId: canvasData.id,
				success: res => {
					that.picList.push(res.tempFilePath);
					const uploadUrl = that.$api.upload;
					console.log(res.tempFilePath);
					uni.uploadFile({
						url: uploadUrl,
						filePath: res.tempFilePath,
						name: 'file',
						header: {
							bx_auth_ticket: that.$api.onTicket ? that.$api.ticket : uni.getStorageSync('bx_auth_ticket')
						},
						formData: {
							serviceName: 'srv_bxfile_service',
							interfaceName: 'add',
							app_no: 'daq',
							table_name: 'bxdaq_check_car',
							columns: 'car_photo'
						},
						success: uploadFileRes => {
							// 图片上传成功后的回调
							const data = JSON.parse(uploadFileRes.data);
							if (canvasData.label === 'profile_picture') {
								console.log('profile_picture', data);
								console.log(res.tempFilePath);
								that.formData.profile_picture = data.file_no;
							} else {
								that.fileList.push(data.file_no);
								that.responseList.push({
									file_no: data.file_no,
									label: canvasData.label,
									content: ''
								});
								let serviceName = 'srvdaq_orc_text_extraction';
								if (that.addType === 'car') {
									serviceName = 'srvdaq_orc_car_no_extraction';
								}
								let reqUrl = that.getServiceUrl('daq', serviceName, 'operate');
								const reqData = [
									{
										serviceName: serviceName,
										data: [
											{
												file_no: data.file_no
											}
										]
									}
								];
								that.$http.post(reqUrl, reqData).then(response => {
									// 得到识别的文字
									if (response.data.state === 'SUCCESS') {
										let list = that.responseList;
										const resp = response.data.response[0].response; // {file_no:text}
										if (resp) {
											list.map(listItem => {
												if (resp[listItem.file_no]) {
													listItem['value'] = resp[listItem.file_no];
													console.log(listItem);
													that.$set(that.formData, canvasData.label, resp[listItem.file_no]);
													console.log(this.formData);
													uni.hideLoading();
												}
											});
											console.log(response.data.response[0].response);
											uni.hideLoading();
										}
										console.log(response.data.response);
									} else {
										console.log(response.data.resultMessage);
									}
								});
							}
						}
					});
				}
			});
		},
		toCarema() {
			this.formData = {
				name: '',
				id_card_addr: '',
				id_card_no: ''
			};
			this.showCamera = true;
		},
		takePhoto() {
			const that = this;
			// this.showCanvas = true;
			// #ifdef H5
			// 从本地选择图片
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: function(res) {
					that.beforeImg = res.tempFilePaths[0];
					that.clipImages();
				}
			});
			// #endif
			// #ifdef APP-PLUS||MP-WEIXIN
			// 得到camera组件拍到的照片
			const ctx = uni.createCameraContext();
			ctx.takePhoto({
				quality: 'high',
				success: res => {
					// 拍到的照片
					this.beforeImg = res.tempImagePath;
					this.showCamera = false;
					console.log('beforeImg', res.tempImagePath);
					// this.clipImages();
					this.getPreviewPic();
				}
			});
			// #endif
		},
		error(e) {
			console.log(e.detail);
		}
	}
};
</script>

<style lang="scss">
.collect-wrap {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	.camera-wrap {
		background-color: #000;
		width: 100%;
		height: 100%;
		overflow: auto;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		.collect-title {
			width: 100%;
			color: #fff;
			background-color: #000;
			font-size: 36upx;
			font-weight: 600;
			line-height: 100upx;
			text-align: center;
		}
		.scan-img {
			opacity: 0.4;
			width: 750upx;
			height: 1115upx;
			margin: 0 auto;
			// padding: 30upx;
		}
		.take-photo-box {
			width: 100%;
			height: 140upx;
			background-color: #000;
			display: flex;
			justify-content: center;
			align-items: center;
			.take-photo {
				width: 100upx;
				height: 100upx;
			}
		}
	}
	.collect-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		.image-box {
			width: 750upx;
			height: 504upx;
			text-align: center;
			position: relative;
			.previewImg {
				width: 750upx;
				height: 504upx;
			}

			.image {
				width: 100%;
				height: 100%;
				&:first-child {
					z-index: 2;
					position: absolute;
					top: 0;
					left: 0;
				}
				&:last-child {
					z-index: 1;
				}
			}
		}
		.imgs-box {
			width: 750upx;
			height: 975upx;
			// height: 650upx;
			margin-bottom: 40upx;
			position: relative;
			text-align: center;
			.image {
				width: 100%;
				height: 100%;
				&:first-child {
					z-index: 2;
					position: absolute;
					top: 0;
				}
				&:last-child {
					z-index: 1;
				}
			}
			.carPreviewImg {
				// width: 460upx; //690
				// height: 650upx; //975
				// left: calc(50% - 230upx); //345
				width: 690upx; //690
				height: 975upx; //975
				left: calc(50% - 345upx); //345
			}
			.PreviewCarImg {
				width: 690upx;
				height: 975upx;
			}
		}
		.collect-button {
			width: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 150upx;
		}
	}
}
</style>
