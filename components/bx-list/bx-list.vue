<template>
	<view class="list-wrap">
		<view class="list-wrap">
			<sPullScroll 
			ref="pullScroll" 
			:heightStyle="heightStyle"
			:pullDown="pullDown" 
			:pullUp="loadData"
			:top="top"
			:fixed="fixed"
			:bottom="bottom"
			finishText="我是有底线的...">
				<list-item
					v-for="item in listData"
					:key="item[rowKey]"
					:itemData="item"
					:viewTemp="viewTemp"
					:viewType="viewType"
					:imageNum="imageNum"
					:gridRowNum="gridRowNum"
					:rowButton="rowButton"
					:srv_cols="srv_cols"
					@click-list-item="clickItem"
					@click-foot-btn="clickFootBtn"
				></list-item>
			</sPullScroll>
		</view>

		<view class="pagination">
			<text class="page-no">{{ pageInfo.pageNo }}</text>
			<text class="total">{{ pageInfo.total }}</text>
		</view>
	</view>
</template>

<script>
import listItem from '@/components/bx-list/bx-list-item.vue';
import sPullScroll from '@/components/s-pull-scroll';
export default {
	components: { listItem, sPullScroll },
	data() {
		return {
			listData: [],
			noData: false,
			pageInfo: {
				total: 0,
				rownumber: this.rownumber,
				pageNo: 1
			},
			srv_cols: [],
			rowButton: this.rowButtons,
			searchCol: ''
		};
	},
	watch: {
		pageInfo: {
			deep: true,
			handler(newValue) {
				console.log('Page:', newValue.total <= newValue.rownumber * newValue.pageNo);
				if (newValue.total <= newValue.rownumber * newValue.pageNo) {
					this.noData = true;
					this.$emit('loadEnd', newValue);
				} else {
					this.noData = false;
				}
			}
		},
		listConfig: {
			deep: true,
			immediate: true,
			handler(newValue) {
				if(newValue && newValue.hasOwnProperty("srv_cols")){
					this.srv_cols = newValue.srv_cols;
					let rowButton = newValue.rowButton;
					if (rowButton) {
						rowButton = rowButton.filter(item => item.button_type === 'edit' || item.button_type === 'delete');
						this.rowButton = rowButton;
					}
				}
				
			}
		},
		searchColumn: {
			immediate: true,
			handler(newValue) {
				if (newValue) {
					this.searchCol = newValue;
				} else if (this.viewTemp && this.viewTemp.title) {
					this.searchCol = this.viewTemp.title;
				}
			}
		}
	},
	mounted() {},
	props: {
		// height
		 heightStyle: {
		   type: String,
		   default: ''
		},
		// class
		customClass: {
		  type: String,
		  default: ''
		},
		// 距顶部(rpx)
		top: {
		  type: [Number, Array, String],
		  default () {
		    return 0;
		  }
		},
		// 距底部(rpx)
		bottom: {
		  type: [Number, Array, String],
		  default () {
		    return 0;
		  }
		},
		
		// 是否通过fixed固定高度, 默认true
		fixed: {
		  type: Boolean,
		  default: true
		},
		listConfig: {
			type: Object,
			default: () => {}
		},
		viewType: {
			type: String,
			default: 'normal'
		},
		viewTemp: {
			type: Object,
			default: () => {}
		},
		imageNum: {
			type: Number,
			default: 1
		},
		gridRowNum: {
			type: Number,
			default: 2
		},
		rowKey: {
			type: String,
			default: 'id'
		},
		serviceName: {
			type: String,
			default: ''
		},
		condition: {
			type: Array,
			default: () => {
				[];
			}
		},
		rownumber: {
			type: Number,
			default: 10
		},
		order: {
			type: Array,
			default: () => {
				[];
			}
		},
		searchWords: {
			//搜索关键词
			type: String,
			default: ''
		},
		searchColumn: {
			//搜索字段
			type: String,
			default: ''
		},
		rowButtons:{
			type: Array,
			default: () => {
				[];
			}
		}
	},
	methods: {
		toSearch() {
			let keywords = this.searchWords;
			this.pageInfo.pageNo = 1;
			this.onRefresh()
		},
		trigger(e) {
			console.log('trigger', e);
			this.$emit('trigger', e);
		},
		fabClick(e) {
			console.log('fabClick', e);
			this.$emit('fab-click', e);
		},
		clickItem(data) {
			this.$emit('click-list-item', data);
		},
		clickFootBtn(data) {
			this.$emit('clickFootBtn', data);
		},
		async getListV2() {
      let app = uni.getStorageSync('activeApp')
			let colVs = await this.getServiceV2(this.serviceName, 'list', 'list', app);
			console.log('colVs', colVs);
			this.listInfo = colVs;
			let srv_cols = colVs.srv_cols;
			this.srv_cols = srv_cols.filter(item => item.in_list === 1);
			return colVs;
		},
		async getListData(cond) {
			uni.showLoading({
				mask: true
			});
			let serviceName = this.serviceName;
      let app = uni.getStorageSync('activeApp')
			let url = this.getServiceUrl(app, serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: this.condition,
				page: this.pageInfo,
				order: this.order
			};
			if (cond && cond.length > 0) {
				req.condition = req.condition.concat(cond);
			}
			let keywords = this.searchWords;
			if (keywords) {
				req.condition = req.condition.concat([{ colName: this.searchCol, ruleType: 'like', value: keywords }]);
			}
			let res = await this.$http.post(url, req);
			uni.hideLoading();

			if (res.data.state === 'SUCCESS') {
				if (this.pageInfo.pageNo === 1) {
					this.listData = [];
				}
				this.listData = this.listData.concat(res.data.data);
				this.pageInfo.total = res.data.page.total;
				this.pageInfo.pageNo = res.data.page.pageNo;
				this.$emit('list-change', this.listData);
				let page = this.pageInfo;
				if (page.rownumber * page.pageNo >= page.total) {
					// finish(boolean:是否显示finishText,默认显示)
					this.$refs.pullScroll.finish();
				} else {
					this.$refs.pullScroll.success();
				}
				return this.listData;
			}
		},
		onRefresh() {
			this.pageInfo.pageNo = 1;
			// this.getListData();
			this.$nextTick(() => {
				this.$refs.pullScroll.refresh();
			});
		},
		pullDown(pullScroll) {
			console.log(pullScroll.page);
			let page = this.pageInfo;
			this.pageInfo.pageNo = 1;
			setTimeout(() => {
				this.getListData().then(res => {
					// if (page.rownumber * page.pageNo >= page.total) {
					// 	// finish(boolean:是否显示finishText,默认显示)
					// 	pullScroll.finish();
					// 	// pullScroll.empty();
					// } else {
					// 	pullScroll.success();
					// }
				});
				// this.loadData(pullScroll);
			}, 200);
		},
		loadData(pullScroll) {
			let page = this.pageInfo;
			this.pageInfo.pageNo = pullScroll.page;
			console.log(pullScroll.page);
			this.getListData().then(res => {
				// if (page.rownumber * page.pageNo >= page.total) {
				// 	// finish(boolean:是否显示finishText,默认显示)
				// 	pullScroll.finish();
				// } else {
				// 	pullScroll.success();
				// }
			});
		}
	},
	mounted() {
		if (this.serviceName) {
			this.getListData();
		}
	}
};
</script>

<style lang="scss" scoped>
.list-wrap {
	width: 100%;
	display: flex;
	flex-direction: column;
}
.pagination {
	position: fixed;
	bottom: 120rpx;
	right: 40upx;
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
	border: 1px solid rgba($color: #999, $alpha: 0.5);
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	z-index: 100;
	&::after {
		content: '';
		position: absolute;
		background-color: rgba($color: #999, $alpha: 0.5);
		width: 80%;
		height: 2upx;
		top: 50%;
	}
	.page-no {
		font-size: 28upx;
	}
	.total {
		font-size: 20upx;
		color: #666;
		transform: scale(0.8, 0.8);
	}
}
</style>
