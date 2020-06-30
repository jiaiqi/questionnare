<template>
	<view>
		<view class="form-box">
			<view class=""><bxform ref="bxform" v-if="showForm" :fields="configCols" :BxformType="formType" @on-form-item="handleClick($event)"></bxform></view>
			<view class="padding-xl" v-if="formType === 'form'"><button class="cu-btn block bg-blue margin-tb-sm lg submit-button" @click="added">提 交</button></view>
		</view>
	</view>
</template>

<script>
import bxform from '@/components/form.vue';
export default {
	components: { bxform },
	data() {
		return {
			formType: 'form',
			id: null,
			carData: null,
			showCamera: true,
			showForm: false,
			beforeImg: '', //原始照片
			configCols: [
				{
					label: '车牌号',
					column: 'car_no',
					value: '',
					type: 'input',
					isRequire: true,
					isShowExp: [],
					options: [],
					buttons: [
						{
							name: '拍  照',
							type: 'car_no'
						}
					]
				},
				{
					label: '归属地',
					column: 'from_addr',
					value: '',
					type: 'input',
					isRequire: true,
					isShowExp: [
						// {
						// 	column: 'car_no',
						// 	type: 'neq',
						// 	value: ''
						// }
					],
					options: []
				},
				{
					label: '联系人电话',
					column: 'phone',
					value: '',
					type: 'input',
					isRequire: true,
					isShowExp: [
						// {
						// 	column: 'car_no',
						// 	type: 'neq',
						// 	value: ''
						// }
					],
					options: []
				},
				{
					label: '人数',
					column: 'person_num',
					value: '',
					type: 'number',
					isRequire: true,
					isShowExp: [
						// {
						// 	column: 'car_no',
						// 	type: 'neq',
						// 	value: ''
						// }
					],
					options: []
				},
				{
					label: '现场照片',
					column: 'car_photo',
					value: '',
					type: 'images',
					isRequire: false,
					isShowExp: [
						// {
						// 	column: 'car_no',
						// 	type: 'neq',
						// 	value: ''
						// }
					],
					fileNum: 1,
					srvInfo: {
						tableName: 'bxdaq_check_car',
						appNo: 'daq'
					},
					options: []
				},
				{
					label: '备注',
					column: 'remark',
					value: '',
					type: 'textarea',
					isRequire: false,
					isShowExp: [
						// {
						// 	column: 'car_no',
						// 	type: 'neq',
						// 	value: ''
						// }
					],
					options: []
				}
			],
			file_no: '',
			car_no: '',
			dept_no: '', // 区域编号
			car_photo: '' //现场照片
		};
	},
	created() {
		if (this.$route.query.hasOwnProperty('id')) {
			this.getCarInfo(this.$route.query.id);
			this.id = this.$route.query.id;
		}
	},
	onLoad(option) {
		console.log('car-option', option);
		if (option.dept_no) {
			this.dept_no = option.dept_no;
		}
		if (option.formType) {
			this.formType = option.formType;
			if (this.formType === 'detail') {
				uni.setNavigationBarTitle({
					title: '车辆详情'
				});
			}
		}
		if (option.formData) {
			const data = JSON.parse(decodeURIComponent(option.formData));
			const configCols = this.configCols;
			if (data.car_photo) {
				this.car_photo = data.car_photo;
			}
			configCols.forEach((item, index) => {
				if (item.column === 'car_no') {
					this.$set(this.configCols[index], 'value', data.car_no);
				}
				if (item.column === 'car_photo') {
					this.$set(this.configCols[index], 'value', data.car_photo);
				}
				console.log('configCols', this.configCols);
			});
		}
		if (option.id) {
			this.id = option.id;
			this.getCarInfo(this.id);
		} else {
			this.showForm = true;
		}
	},
	onShow() {
		if (this.$route.query.hasOwnProperty('id')) {
			this.getCarInfo(this.$route.query.id);
			this.id = this.$route.query.id;
		}
	},
	methods: {
		handleClick(e) {
			console.log(e);
			if (e.column == 'car_no' && e.name === '拍  照') {
				uni.redirectTo({
					url: '../takePhotos/takePhotos?addType=car&dept_no=' + this.dept_no
				});
			}
		},
		async getCarInfo(e) {
			let url = this.getServiceUrl('daq', 'srvdaq_check_car_select', 'select');
			let req = {
				serviceName: 'srvdaq_check_car_select',
				condition: [
					{
						colName: 'id',
						ruleType: 'eq',
						value: e
					}
				]
			};
			let response = await this.$http.post(url, req);
			console.log('srvdaq_init_view_select', response);
			if (response.data.state === 'SUCCESS' && response.data.data.length > 0) {
				this.carData = response.data.data[0];
				console.log('this.activityData', this.activityData);
				this.setFieldsVals(this.carData);
			}
		},
		async added() {
			let itemData = this.$refs.bxform.getFieldModel();
			itemData['dept_no'] = this.dept_no;
			let url = this.getServiceUrl('daq', 'srvdaq_check_car_add', 'add');
			let req = [
				{
					serviceName: 'srvdaq_check_car_add',
					data: [
						{
							car_no: '陕A55556',
							from_addr: '陕西西安',
							phone: '13611112222',
							car_photo: '20200212131045939100',
							person_num: 3,
							remark: '没去疫区'
						}
					]
				}
			];
			if (itemData) {
				uni.showLoading({
					mask: true,
					title: '正在提交'
				});
				console.log('itemData', itemData);
				if (this.id !== null) {
					// 编辑
					url = this.getServiceUrl('daq', 'srvdaq_check_car_update', 'add');
					req = [
						{
							serviceName: 'srvdaq_check_car_update',
							data: [itemData],
							condition: [
								{
									colName: 'id',
									ruleType: 'eq',
									value: this.id
								}
							]
						}
					];
					let response = await this.$http.post(url, req);
					uni.hideLoading();
					console.log('srvdaq_check_car_add', response);
					if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
						// this.activieyData = self.getResData(response.data.response);
						uni.reLaunch({
							url: '../home/home',
							animationType: 'pop-out',
							animationDuration: 200
						});
					}
				} else {
					// 新增
					url = this.getServiceUrl('daq', 'srvdaq_check_car_add', 'add');
					req = [{ serviceName: 'srvdaq_check_car_add', data: [itemData] }];
					let response = await this.$http.post(url, req);
					uni.hideLoading();
					console.log('srvdaq_check_car_add', response);
					if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
						// this.carData = this.getResData(response.data.response);
						// console.log('srvdaq_check_car_add', this.carData);
						// uni.navigateBack({

						// })
						uni.reLaunch({
							url: '../home/home',
							animationType: 'pop-out',
							animationDuration: 200
						});
						// uni.navigateBack({
						// 	delta: 1,
						// 	animationType: 'pop-out',
						// 	animationDuration: 200
						// });
					}
				}
			} else {
				uni.showToast({
					title: '表单填写不完整'
				});
			}
		},
		setFieldsVals: function(e) {
			let fields = this.configCols;
			for (var col in e) {
				for (let i = 0; i < fields.length; i++) {
					if (fields[i].column === col) {
						fields[i].value = e[col];
					}
				}
			}
			this.showForm = true;
		},
		error(e) {
			console.log(e.detail);
		}
	}
};
</script>

<style lang="scss">
.submit-button {
	padding: 0 40upx;
	font-size: 40upx;
	height: 100upx;
}
</style>
