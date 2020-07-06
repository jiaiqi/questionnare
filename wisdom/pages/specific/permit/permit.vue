<template>
	<view class="permit_wrap">
		<view class="permit_top">
			<text>通行码</text>
		</view>
		<view class="permit_cen">
			<!-- <view class="permit_cen_t">
				<image src="../../../static/img/permit.png" mode=""></image>
			</view> -->
			<canvas canvas-id="qrcode" style="width: 215px;height: 215px;" />
			
			<view class="permit_cen_b">
				<text>进入小区时，请主动出示，配合小区检查人员</text>
			</view>
		</view>
		<view v-if="type && type == 'share'" class="bots">
			<button class="bg-green cu-btn lg" open-type="share">分享</button>
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	export default {
		name:"permit",
		data(){
			return {
				type:""
			}
		},
		onLoad(option) {
			console.log("option---------",option)
			if(option && option.type){
				this.type = option.type
			}
			this.make(option.code)
		},
		onShareAppMessage(res) {
			console.log("res=====>>>>>",res)
				return {
				  title: '邀请来访',
				  path: '/pages/specific/permit/permit',
				  success: function (res) {
				          console.log('成功', res)
				        }
				}
			//  }
		},
		methods:{
			 make(code) {
			      uQRCode.make({
			        canvasId: 'qrcode',
			        componentInstance: this,
			        // text: "VjAwMSu8cWuljgtCcn/ybfRTRBK8mBwm/ds8QINYB57LJniavQsBZXc2Im0Vd/Ql8R3sXXA=",
					text:code,
			        size: 215,
			        margin: 10,
			        backgroundColor: '#ffffff',
			        foregroundColor: '#000000',
			        fileType: 'png',
			        correctLevel: uQRCode.defaults.correctLevel,
			        success: res => {
			          console.log(res)
			        }
			      })
			    }
		}
	}
</script>

<style lang="scss" scoped>
	.permit_wrap{
		width: 100%;
		height: 100vh;
		background:#25b125;
		.permit_top{
			padding: 80upx 40upx;
			font-size: 18px;
			font-weight: 700;
		}
		.permit_cen{
			width: 580upx;
			height: 580upx;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			padding: 20upx;
			border-radius: 20upx;
			background-color: white;
			box-shadow: 3px 3px 4px rgba(26, 26, 26, 0.2);
			
			.permit_cen_t{
				width: 500upx;
				height: 500upx;
			}
		}
	}
	.bots{
		width: 100%;
		margin-top: 15px;
		display: flex;
		justify-content: center;
	}	
</style>
