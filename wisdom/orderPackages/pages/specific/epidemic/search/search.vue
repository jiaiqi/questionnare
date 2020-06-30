<template>
	<scroll-view :scroll-y="true" class="search-wrap">
		<view class="cu-bar bg-white search fixed" :style="[{ top: '0px' }]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索关键词" confirm-type="search" @confirm="onSearch" />
			</view>
		</view>
		<view class="cu-list menu-avatar margin-top-100">
			<view class="cu-item" v-for="(item,key) in listData" :key="key">
				<view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81007.jpg);"></view>
				<view class="content" v-if="searchColumn === 'car_no'">
					<view style="display: flex;justify-content: space-between;">
						<view class="text-cut">
							车牌:
							<text class="text-bold">{{ item.car_no }}</text>
						</view>
						<view class="cu-tag round bg-orange lg text-large">{{ item.person_num === null ? '-' : item.person_num }}人</view>
					</view>
					<view class="text-gray text-lg flex">
						<view class="text-cut">来源：{{ item.from_addr ? item.from_addr : '未记录' }}</view>
					</view>
					<view style="display: flex;justify-content: space-between;">
						<view class="text-grey text-lg">{{ item.create_time }}</view>
						<view class="cuIcon-edit  text-xl text-blue" @click.stop="toUpdate(item)">编辑</view>
					</view>
				</view>
				<view class="content" v-if="searchColumn === 'name'">
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
	</scroll-view>
</template>

<script>
export default {
	data() {
		return {
			searchColumn: 'car_no', // 用来做搜索条件的字段car_no||name
			keyword: '', //用来搜索的关键词
			carData: [],
			personData: [],
			listData: [],
			dept_no: '',
			pageInfo: {
				pageNo: 1,
				rownumber: 10,
				total: 1
			}
		};
	},
	methods: {
		onSearch(e) {
			if (e.detail.value) {
				console.log('关键词:', e.detail.value);
				this.keyword = e.detail.value;
				if (this.searchColumn === 'car_no') {
					this.getCarInfo();
				} else if (this.searchColumn === 'name') {
					this.getPersonInfo();
				}
			} else {
				const title = this.searchColumn === 'car_no' ? '请输入要搜索的车牌号' : '请输入要搜索的姓名';
				uni.showToast({
					title: title,
					icon: 'none',
					mask: true
				});
			}
		},
		getCarInfo() {
			const serviceName = 'srvdaq_check_car_select';
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				page: { pageNo: this.pageInfo.pageNo, rownumber: this.pageInfo.rownumber },
				order: [{ colName: 'create_time', orderType: 'desc' }]
			};
			if (this.dept_no) {
				req.condition.push({
					colName: 'dept_no',
					ruleType: 'eq',
					value: ''
				});
				req.condition[0].value = this.dept_no;
			}
			req.condition.push({
				colName: 'car_no',
				ruleType: 'like',
				value: this.keyword
			})
			let url = this.getServiceUrl('daq', serviceName, 'select');
			this.$http.post(url, req).then(res => {
				this.$refs.refresh.endAfter(); //刷新结束调用
				if (res.data.state === 'SUCCESS') {
					this.pageInfo = res.data.page;
					const listData = res.data.data;
					if (this.pageInfo.pageNo === 1) {
						this.carData = listData;
						this.listData = listData;
					} else if (this.pageInfo.pageNo > 1) {
						this.carData = this.carData.concat(listData);
						this.listData = this.listData.concat(listData);
					}
					// this.carData.map((item, index) => {
					// 	this.getPicture(item.car_photo, index);
					// });
					this.listData.map((item, index) => {
						this.getPicture(item.car_photo, index);
					});
				}
			});
		},
		getPersonInfo() {
			const serviceName = 'srvdaq_check_person_select';
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				page: { pageNo: this.pageInfo.pageNo, rownumber: this.pageInfo.rownumber },
				order: [{ colName: 'create_time', orderType: 'desc' }]
			};
			if (this.dept_no) {
				req.condition.push({
					colName: 'dept_no',
					ruleType: 'eq',
					value: ''
				});
				req.condition[0].value = this.dept_no;
			}
			req.condition.push({
				colName: 'name',
				ruleType: 'like',
				value: this.keyword
			})
			let url = this.getServiceUrl('daq', serviceName, 'select');
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					this.pageInfo = res.data.page;
					const listData = res.data.data;
					if (this.pageInfo.pageNo === 1) {
						this.personData = listData;
						this.listData = listData;
					} else if (this.pageInfo.pageNo > 1) {
						this.personData = this.personData.concat(listData);
						this.listData = this.listData.concat(listData);
					}
					this.listData.map((item, index) => {
						this.getPicture(item.profile_picture, index);
					});
					// this.personData.map((item, index) => {
					// 	this.getPicture(item.profile_picture, index);
					// });
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
							if (this.searchColumn === 'car_no') {
								// 车辆
								let item = this.carData[index];
								item['picUrl'] = fileurl;
								this.$set(this.carData, index, item);
							} else if (this.searchColumn === 'name') {
								// 人员
								let item = this.personData[index];
								item['picUrl'] = fileurl;
								this.$set(this.personData, index, item);
							}
						}
					}
				});
			}
		}
	},
	onLoad(option) {
		if (option.searchColumn) {
			this.searchColumn = option.searchColumn;
			if(option.searchColumn==='car_no'){
				this.getCarInfo()
			}else if(option.searchColumn==='name'){
				this.getPersonInfo()
			}
		}
		if (option.dept_no) {
			this.dept_no = option.dept_no;
		}
	}
};
</script>

<style lang="scss" scoped>
.search-wrap {
	width: 100%;
	display: flex;
	flex-direction: column;
	.margin-top-100 {
		margin-top: 100upx;
	}
	.cu-list.menu-avatar > .cu-item {
		height: 220upx;
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
	.cu-list.menu-avatar > .cu-item .content {
		width: 75%;
	}
}
</style>
