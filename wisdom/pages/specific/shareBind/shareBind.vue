<template>
	<view>
		<view class="tip">
			<text class="text-red">*</text>
			请检查以下信息是否跟您本人信息匹配，确定信息匹配后请点击确定按钮登记您的入住信息
		</view>
		<bxform
			:service="serviceName"
			ref="bxForm"
			:pageType="type"
			:BxformType="type"
			:fields="fields"
			:moreConfig="colsV2Data && colsV2Data.more_config ? colsV2Data.more_config : null"
		></bxform>
		<view class="button-box" v-if="fields && fields.length > 0"><button class="bg-green cu-btn lg" @click="confirmInfo">确认</button></view>
	</view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';
export default {
	components: { bxform },
	data() {
		return {
			fields: [],
			colsV2Data: null,
			type: 'detail',
			serviceName: '',
			condition: [],
			proc_instance_no: ''
		};
	},
	created() {
		// #ifdef H5
		const destApp = this.$route.query.destApp;
		if (destApp) {
			uni.setStorageSync('activeApp', destApp);
		}
		// #endif
	},
	onLoad(option) {
		if (option.proc_instance_no) {
			this.proc_instance_no = option.proc_instance_no;
			this.getFieldsV2();
		}
	},
	methods: {
		async getV2Data() {
			let url = this.getServiceUrl('zhxq', 'srvsys_service_columnex_v2_select', 'select');
			let req = {
				serviceName: 'srvsys_service_columnex_v2_select',
				colNames: ['*'],
				condition: [{ colName: 'service_name', value: 'srvzhxq_syrk_select', ruleType: 'eq' }, { colName: 'use_type', value: 'list', ruleType: 'eq' }],
				order: [{ colName: 'seq', orderType: 'asc' }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				return res.data.data.srv_cols;
			}
		},
		async getDefaultValue() {
			let url = this.getServiceUrl('zhxq', 'srvzhxq_syrk_select', 'select');
			let req = {
				serviceName: 'srvzhxq_syrk_select',
				colNames: ['*'],
				condition: [{ colName: 'proc_instance_no', value: this.proc_instance_no, ruleType: 'eq' }],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				return res.data.data[0];
			}
		},
		getFieldsV2: async function() {
			let colVs = await this.getV2Data();
			let defaultData = await this.getDefaultValue();
			colVs = await this.getServiceV2('srvzhxq_syrk_select', 'update', 'update', 'zhxq');
			this.colsV2Data = colVs;
			let fieldsArr = this.setFieldsDefaultVal(colVs._fieldInfo, defaultData);
			fieldsArr.forEach(item => {
				item.disabled = true;
				if(item.column == 'is_benren'){
					item.value = "本人信息"
				}
			});
			console.log("fieldsArr--------------",fieldsArr)
			
			this.fields = this.deepClone(fieldsArr);
		},
		confirmInfo() {
			let self = this;
			let data = this.$refs.bxForm.getFieldModel();
			;
			data.is_benren = '本人信息'
			if (data.is_benren == '本人信息') {
				data.openid = uni.getStorageSync('login_user_info').user_no;
			}
			
			console.log(data.openid, 'data.openid');
			console.log(data, 'data');
			Object.keys(data).forEach(item => {
				if (!data[item]) {
					delete data[item];
				}
			});
			if (data) {
				uni.showModal({
					title: '警告',
					content: '请确认上述信息跟您本人信息相符，如果不符合您本人信息，请联系邀请人',
					success(res) {
						if (res.confirm) {
							console.info('11111111111111111', self.proc_instance_no);
							let req = [
								{ serviceName: 'srvzhxq_syrk_update', condition: [{ colName: 'proc_instance_no', ruleType: 'eq', value: self.proc_instance_no }], data: [data] }
							];
							let app = uni.getStorageSync('activeApp');
							let url = self.getServiceUrl(app, 'srvzhxq_syrk_update', 'update');
							self.$http.post(url, req).then(res => {
								console.log(url, res.data);
								uni.showToast({
									title: res.data.resultMessage,
									icon: 'none'
								});
								if (res.data.state === 'SUCCESS') {
									uni.showModal({
										title: '提示',
										content: '您的住户信息已成功登记',
										showCancel: false,
										success(res) {
											if (res.confirm) {
												uni.navigateTo({
													url: '/pages/public/sitePage/sitePage?website_no=WS2020060611100007&destApp=zhxq'
												});
											}
										}
									});
								}
							});
						} else if (res.cancel) {
						}
					}
				});
			}
		},
		async getUserInfo() {
			let user_no = uni.getStorageSync('login_user_info').user_no;
			let urls = this.getServiceUrl('zhxq', 'srvzhxq_syrk_select', 'select');
			let reqs = {
				serviceName: 'srvzhxq_syrk_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'create_user',
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
				]
				// order: [{ colName: 'seq', orderType: 'asc' }] ,
			};
			let ress = await this.$http.post(urls, reqs);
			console.log('------------', ress);
			return ress.data.data[0];
		}
	}
};
</script>

<style scoped lang="scss">
.tip {
	background-color: #fff;
	padding: 20rpx;
	color: #999;
	border-bottom: 1px dashed #efefef;
}
.button-box {
	width: 100%;
	height: 200rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	.bg-green {
		background-color: rgb(11, 201, 157);
		width: 50%;
	}
}
</style>
