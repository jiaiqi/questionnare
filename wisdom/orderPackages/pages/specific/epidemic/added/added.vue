<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">新建活动</block>
		</cu-custom>
		<view class="">
				<bxform ref="bxform" :fields="configCols"></bxform>
			
		</view>
		
		<view class="padding-xl">
			<button class="cu-btn block bg-blue margin-tb-sm lg" @click="toUpdate">
				<!-- <text class="cuIcon-loading2 cuIconfont-spin"></text> -->
				提交</button>
		</view>
	</view>
</template>

<script>
	import bxform from '@/components/form.vue'
	export default {
		components:{bxform},
		data() {
			return {
				activity:{
					"title": "xxxx收集活动",  //---活动标题
					"end_time": "2020-03-05 12:00:00", //--活动结束时间
					"remark": "活动简介说明", //---活动简介
					"end_remark": "问卷到此结束,感谢你的参与" //--结束语
				},
				activieyData:null,
				configCols:[
					{
						label:"活动名称",
						column:"title",
						value:"",
						type:"input",
						isRequire:true,
						isShowExp:"true",
						options:[
						]
					},
					{
						label:"开始时间",
						column:"start_time",
						value:"",
						type:"dateTime",
						isRequire:true,
						isShowExp:"true",
						options:[
						]
					},{
						label:"结束时间",
						column:"end_time",
						value:"",
						type:"dateTime",
						isRequire:true,
						isShowExp:"true",
						options:[
						]
					},
					{
						label:"活动说明",
						column:"remark",
						value:"",
						type:"textarea",
						isRequire:true,
						isShowExp:"true",
						options:[
							
						]
					},
					{
						label:"结束语",
						column:"end_remark",
						value:"",
						type:"textarea",
						isRequire:true,
						isShowExp:"true",
						options:[
						]
					}
					
				]
			};
		},
		created() {
			if(this.$route.query.hasOwnProperty('activity_no')){
				this.getActivityInfo(this.$route.query.activity_no)
			}
		},
		onShow() {
			if(this.$route.query.hasOwnProperty('activity_no')){
				this.getActivityInfo(this.$route.query.activity_no)
			}
		},
		methods:{
			async getActivityInfo(e){
				let url = this.getServiceUrl('daq', 'srvdaq_init_view_select', 'select');
				let req = {
					"serviceName":"srvdaq_init_view_select",
					"condition": [
				  	  {
				  		  "colName": "activity_no",
				  		  "ruleType": "eq",
				  		  "value": e
				  	  },{
						"colName": "biz_type",
						"ruleType": "eq",
						"value": "cfg"
					}
				    ]
				  }
				  let response = await this.$http.post(url, req);
				  console.log("srvdaq_init_view_select",response)
				  if(response.data.state === "SUCCESS" && response.data.data.length>0){
					  this.activieyData = response.data.data[0]
					  console.log('this.activityData',this.activityData)
					  this.setFieldsVals(this.activieyData)
				  }
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			// toUpdate(){
				
			// 	uni.redirectTo({
			// 	    url: '../activityUpdate/activityUpdate?id='+1
			// 	});
			// },
			async toUpdate(){
				let self = this
				let itemData = this.$refs.bxform.getFieldModel()
				let url = this.getServiceUrl('daq', 'srvdaq_activity_cfg_add', 'add');
				let req = [{"serviceName":"srvdaq_activity_cfg_add",
				  "data":[itemData]
				  }]
				if(itemData){
					console.log('itemData',itemData)
					if(this.activieyData!==null){
						url = this.getServiceUrl('daq', 'srvdaq_activity_cfg_update', 'add');
						req = [{
							"serviceName":"srvdaq_activity_cfg_update",
							"data":[itemData],
							"condition": [
								  {
									  "colName": "activity_no",
									  "ruleType": "eq",
									  "value": this.activieyData.activity_no
								  }
							  ]
						  }]
						  let response = await this.$http.post(url, req);
						  console.log("srvdaq_activity_cfg_update",response)
						  if(response.data.state === "SUCCESS" && response.data.response.length>0){
							  this.activieyData = self.getResData(response.data.response)
							  	uni.redirectTo({
							  	    url: '../activityUpdate/activityUpdate?activity_no=' + this.activieyData.activity_no
							  	});
						  }
					}else{
						url = this.getServiceUrl('daq', 'srvdaq_activity_cfg_add', 'add');
						req = [{"serviceName":"srvdaq_activity_cfg_add",
						  "data":[itemData]
						  }]
						  let response = await this.$http.post(url, req);
						  console.log("srvdaq_activity_cfg_add",response)
						  if(response.data.state === "SUCCESS" && response.data.response.length>0){
							  this.activieyData = self.getResData(response.data.response)
							  	uni.redirectTo({
							  	    url: '../activityUpdate/activityUpdate?activity_no=' + this.activieyData.activity_no
							  	});
						  }
					}
					
					// self.hideModal()
					self.newProblemData = {
						"item_title": "", //--条目问题标题
						"item_type": "string", //--条目问题类型
						"is_require":false, //--是否必须填写
						"item_type_attr": {
						}
					}
				}else{
					console.log('表单填写不完整')
				}
				
			},
			setFieldsVals:function(e){
				let fields = this.configCols
				for(var col in e){
					for(let i =0;i<fields.length;i++){
						if(fields[i].column === col){
							fields[i].value = e[col]
						}
					}
				}
			}
		},
		watch:{
			"activityData":{
				hanlder:function(newOld,old){
					this.setFieldsVals(newOld)
				},
				deep:true
			}
		}
	}
</script>

<style lang="scss" >
	.cu-form-group {
		background-color: #ffffff;
		padding: 1upx 30upx;
		display: flex;
		flex-direction: column;
		align-items: self-start;
		min-height: 100upx;
		justify-content: space-between;
		.title {
			// min-width: calc(4em + 15px);
			width: 100vw;
			display: block;
		}
		uni-input{
			width: 100%;
			flex: 1;
		}
			
			
			text[class*="cuIcon-"] {
				font-size: 36upx;
				padding: 0;
				box-sizing: border-box;
			}
			
			textarea {
				margin: 32upx 0 30upx;
				height: 4.6em;
				width: 100%;
				line-height: 1.2em;
				flex: 1;
				font-size: 28upx;
				padding: 0;
			}
	}
</style>
