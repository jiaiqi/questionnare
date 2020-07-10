<template>
	<view class="permit_wrap">
		<view class="permit_top">
			<text>通行码</text>
		</view>
		<view class="permit_cen">
			<!-- <view class="permit_cen_t">
				<image src="../../../static/img/permit.png" mode=""></image>
			</view> -->
			<canvas canvas-id="qrcode" style="width: 350px;height: 350px;" />
			
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
		comments:{
		},
		
		data(){
			return {
				type:"",
				code:""
				
			}
		},
		onLoad(option) {
			console.log("option---------",option)
			if(option && option.type){
				this.type = option.type
			}
			if(option && option.code){
				this.code = option.code
			}
			this.make(option.code)
			// setTimeout(()=>{
				// this.make("VjAwMSu8cWuljgtCcn/ybfRTRBK8mBwm/ds8QINYB57LJniavQsBZXc2Im0Vd/Ql8R3sXXA=")
			// },2000)
		},
		onShareAppMessage(res) {
			console.log("res=====>>>>>",res)
				return {
				  title: '邀请来访',
				  path: '/pages/specific/permit/permit?code=' + this.code,
				  // path: '/pages/specific/permit/permit',
				  success: function (res) {
				          console.log('成功', res)
				        }
				}
		},
		methods:{
			make(code) {
				 if(code){
					 uQRCode.make({
					   canvasId: 'qrcode',
					   componentInstance: this,
					   // text: "VjAwMSu8cWuljgtCcn/ybfRTRBK8mBwm/ds8QINYB57LJniavQsBZXc2Im0Vd/Ql8R3sXXA=",
					 	text:code, 	
					   size: 350,
					   margin: 5,
					   backgroundColor: '#ffffff',
					   foregroundColor: '#000000',
					   fileType: 'png',
					   correctLevel: 0,
					   success: res => {
						   try{
						   	console.log("加载成功")
						   }catch(e){
						   	//TODO handle the exception
							console.log("catch--------失败")
						   }
						 uni.hideLoading()						 
					   },
					   fail: res=>{
						   console.log("失败")
					   }
					 })
				 }else{
					 uni.showLoading({
					     title: '加载中'
					 });
				 }			     
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
			// width: 680upx;
			// height: 680upx;
			margin: 0 10upx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			padding: 10upx;
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
