<template>
	<view class="collect-wrap">
		<view class="form-box" v-if="showForm">
			<view class="form-wrap">
				<bxform ref="bxform" v-if="showForm" :showTextarea="showTextarea"  :fields="configCols" :BxformType="formType" @on-form-item="handleClick($event)" @get-cascader-val="getCascaderVal"></bxform>
			</view>
			<view class="padding-xl" v-if="formType === 'form'"><button class="cu-btn block bg-blue margin-tb-sm lg submit-button" @click="added">提 交</button></view>
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
			formType: 'form',
			id: null,
			src: '',
			showForm: false,
			tempFilePath: '',
			beforeImg: '',
			compressImg: '', //压缩后的图片
			afterImg: '', //裁剪之后的图
			ctxWidth: '',
			ctxHeight: '',
			fileList: [],
			picList: [],
			responseList: [],
			formData: {
				name: '',
				id_card_addr: '',
				id_card_no: '',
				from_addr_no: '', //来源地址编号
				from_addr_name: '', //来源地址名称
				to_addr_no: '', //来源地址编号
				to_addr_name: '' //来源地址名称
			},
			showTextarea:true,
			configCols: [
				{
					label: '姓名',
					column: 'name',
					value: '',
					type: 'input',
					isRequire: true,
					isShowExp: [],
					buttons: [
						{
							name: '拍  照',
							type: 'navTo'
						}
					],
					options: []
				},
				{
					label: '户籍所在地',
					column: 'id_card_addr',
					value: '',
					type: 'input',
					isRequire: true,
					isShowExp: [],
					options: []
				},
				{
					label: '身份证号',
					column: 'id_card_no',
					value: '',
					type: 'input',
					isRequire: true,
					isShowExp: [],
					options: []
				},
				{
					label: '体温',
					column: 'temperature',
					value: '',
					type: 'digit',
					isRequire: true,
					isShowExp: [],
					options: []
				},
				{
					label: '来源地址',
					column: 'from_addr_name',
					value: '',
					type: 'cascader',
					srvInfo: {
						serviceName: 'srvconfig_area_adj_select',
						appNo: 'config'
					},
					topVal: '中国',
					isRequire: true,
					isShowExp: [],
					options: []
				},
				{
					label: '目的地址',
					column: 'to_addr_name',
					value: '',
					type: 'cascader',
					srvInfo: {
						serviceName: 'srvdaq_check_area_select',
						appNo: 'daq'
					},
					topVal: '铜川',
					isRequire: true,
					isShowExp: [],
					options: []
				},
				{
					label: '身份证照片',
					column: 'id_card_photo',
					value: '',
					type: 'images',
					isRequire: false,
					isShowExp: [],
					srvInfo: {
						tableName: 'bxdaq_check_person',
						appNo: 'daq'
					},
					fileNum: 1,
					options: []
				},
				{
					label: '车牌号',
					column: 'vehicle',
					value: '',
					type: 'input',
					isRequire: false,
					isShowExp: [],
					options: []
				},
				{
					label: '手机号',
					column: 'phone',
					value: '',
					type: 'number',
					isRequire: false,
					isShowExp: [],
					options: []
				},
				{
					label: '备注',
					column: 'remark',
					value: '',
					type: 'textarea',
					isRequire: false,
					isShowExp: [],
					options: []
				}
			],
			dept_no: '',
			id_card_photo: '', //身份证预览图的file_no
			profile_picture: '' //头像照片
		};
	},
	onLoad(option) {
		console.log('peop-option', option);
		if (option.dept_no) {
			console.log(option.dept_no);
			this.dept_no = option.dept_no;
		}
		if (option.formType) {
			this.formType = option.formType;
			if (this.formType === 'detail') {
				uni.setNavigationBarTitle({
					title: '人员详情'
				});
			}
		}
		if (option.formData) {
			this.formData = JSON.parse(decodeURIComponent(option.formData));
			const formData = this.formData;
			const configCols = this.configCols;
			if (formData.profile_picture) {
				// 头像
				this.profile_picture = formData.profile_picture;
			}
			configCols.forEach((item, index) => {
				if (item.column === 'name') {
					this.$set(this.configCols[index], 'value', formData[item.column]);
				}
				if (item.column === 'id_card_addr') {
					this.$set(this.configCols[index], 'value', formData[item.column]);
				}
				if (item.column === 'id_card_no') {
					this.$set(this.configCols[index], 'value', formData[item.column]);
				}
				if (item.column === 'id_card_photo') {
					console.log('id_card_photo', formData[item.column]);
					this.$set(this.configCols[index], 'value', formData[item.column]);
				}
			});
			console.log('configCols', this.configCols);
		}
		if (option.id) {
			this.id = option.id;
			this.getPersonInfo(this.id);
		} else {
			this.showForm = true;
		}
	},
	methods: {
		handleClick(e) {
			if (e.column == 'name' && e.name === '拍  照') {
				uni.redirectTo({
					url: '../takePhotos/takePhotos?addType=person&dept_no=' + this.dept_no
				});
			}
			if (e.type === 'cascader') {
				this.showTextarea = !this.showTextarea 
				console.log('showTextarea',this.showTextarea)
			}
		},
		async getPersonInfo(e) {
			let url = this.getServiceUrl('daq', 'srvdaq_check_person_select', 'select');
			let req = {
				serviceName: 'srvdaq_check_person_select',
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
				this.formData = response.data.data[0];
				console.log('this.activityData', this.activityData);
				this.setFieldsVals(this.formData);
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
		async added() {
			// 提交表单
			let itemData = this.$refs.bxform.getFieldModel();
			itemData['dept_no'] = this.dept_no; // 部门
			let url = this.getServiceUrl('daq', 'srvdaq_check_person_add', 'add');
			let req = [];
			if (itemData) {
				uni.showLoading({
					mask: true,
					title: '正在提交'
				});
				if (this.formData.from_addr_no) {
					itemData['from_addr_no'] = this.formData.from_addr_no;
				}
				if (this.formData.to_addr_no) {
					itemData['to_addr_no'] = this.formData.to_addr_no;
				}
				if (this.id !== null) {
					// 编辑
					url = this.getServiceUrl('daq', 'srvdaq_check_person_update', 'add');
					req = [
						{
							serviceName: 'srvdaq_check_person_update',
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
					console.log('srvdaq_check_person_add', response);
					if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
						uni.reLaunch({
							url: '../home/home?currentTab=1',
							animationType: 'pop-out',
							animationDuration: 200
						});
					}
				} else {
					// 新增
					if (this.profile_picture) {
						itemData['profile_picture'] = this.profile_picture; // 头像
					}
					// if(this.formData.from_addr_no){
					// 	itemData['from_addr_no'] = this.formData.from_addr_no
					// }
					// if(this.formData.to_addr_no){
					// 	itemData['to_addr_no'] = this.formData.to_addr_no
					// }
					url = this.getServiceUrl('daq', 'srvdaq_check_person_add', 'add');
					req = [{ serviceName: 'srvdaq_check_person_add', data: [itemData] }];
					let response = await this.$http.post(url, req);
					uni.hideLoading();
					console.log('srvdaq_check_person_add', response);
					if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
						uni.reLaunch({
							url: '../home/home?currentTab=1',
							animationType: 'pop-out',
							animationDuration: 200
						});
					}
				}
			} else {
				uni.showToast({
					title: '表单填写不完整',
					icon: 'none'
				});
			}
		},
		getCascaderVal(e) {
			console.log(e);
			if (e) {
				if (e.column === 'to_addr_name') {
					this.formData.to_addr_no = e.path;
					this.formData.to_addr_name = e.path_name;
				} else if (e.column === 'from_addr_name') {
					this.formData.from_addr_no = e.path;
					this.formData.from_addr_name = e.path_name;
				}
			}
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
.collect-wrap {
	width: 100%;
	display: flex;
	flex-direction: column;
}
</style>
