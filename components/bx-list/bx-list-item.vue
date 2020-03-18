<template>
	<view class="list-item-wrap">
		<view class="list-item" v-if="viewType === 'normal'">
			<image :src="goodsData.img" onerror="this.src='@/static/noneImg.png'" mode="" class="main-image" @click="listItemClick" v-if="itemData[viewTemp['img']]"></image>
			<view class="content-box">
				<view class="title" @click="listItemClick">{{ goodsData.title }}</view>
				<view class="title-tip" @click="listItemClick">{{ goodsData.tip }}</view>
				<view class="content" @click="listItemClick">
					<view class="numbers">
						<text class="unit" v-if="!isNaN(Number(goodsData.price))&&goodsData.price">￥</text>
						{{ goodsData.price }}
					</view>
					<view class="tags"></view>
				</view>
				<view class="footer">
					<view class="foot-name" @click="listItemClick">{{ goodsData.footer }}</view>
					<view class="foot-button">
						<text v-if="deRowButDisplay(itemData,item)" class="lg text-blue" :class="'cuIcon-' + item.button_type" v-for="item in rowButton" :key="item.id" @click="footBtnClick(item)">{{item.button_name}}</text>
						<!-- <text class="lg text-blue cuIcon-delete"></text> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ListItem',
	data() {
		return {
			picUrl: '',
			goodsData: {
				title: '',
				tip: '',
				img: '',
				price: '',
				footer: ''
			}
		};
	},
	methods: {
		listItemClick() {
			this.$emit('click-list-item', this.itemData);
		},
		footBtnClick(btn) {
			this.$emit('click-foot-btn', { button: btn, row: this.itemData });
		},
		async getPicture(file_no) {
			const serviceName = 'srvfile_attachment_select';
			const url = this.getServiceUrl('file', serviceName, 'select');
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
			};
			if (file_no !== null && file_no !== '' && file_no !== undefined) {
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					const data = res.data.data[0];
					if (data) {
						const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl + "&thumbnailType=" + this.$api.imgThumbnailType;
						return fileurl;
					}
				}
			}
		},
		deRowButDisplay:function(item,button){
			if(item && button.hasOwnProperty("isShow") && button["isShow"].length > 0){
				let isShow = []
				for(let key  in button["isShow"]){
					switch (button["isShow"][key].ruleType){
						case "eq":
							if(item[button["isShow"][key].colName] === button["isShow"][key].value){
								isShow.push(true)
							}
							break;
						case "nq":
							if(item[button["isShow"][key].colName] !== button["isShow"][key].value){
								isShow.push(true)
							}
							break;
						default:
							break;
					}
				}
				if(isShow.length === button["isShow"].length){
					return true
				}else{
					return false
				}
			}else{
				return true
			}
		}
	},
	props: {
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
		showSearchBar: {
			type: Boolean,
			default: false
		},
		rowButton: {
			type: Array,
			default: () => {
				[];
			}
		},
		srv_cols: {
			type: Array,
			default: () => {
				[];
			}
		},
		itemData: {
			type: Object,
			default: () => {}
		}
	},
	watch: {
		srv_cols: {
			handler(newVal) {
				let arr = Object.values(this.viewTemp);
				console.log(this.srv_cols);
				// Object.values
				if (arr.length === 0 && this.srv_cols && this.srv_cols.length > 0) {
					let arr2 = this.srv_cols.map(item => item.columns);
					Object.keys(this.goodsData).forEach((item, index) => {
						this.goodsData[item] = this.itemData[arr2[index]];
					});
					this.goodsData['img'] = '';
				}
			}
		},
		itemData: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
				if (newValue[this.viewTemp.img]) {
					this.getPicture(newValue[this.viewTemp.img]).then(url => {
						this.goodsData.img = url;
					});
				}
				if (newValue[this.viewTemp.title]) {
					this.goodsData.title = newValue[this.viewTemp.title];
				}
				if (newValue[this.viewTemp.tip]) {
					this.goodsData.tip = newValue[this.viewTemp.tip];
				}
				if (newValue[this.viewTemp.price]) {
					this.goodsData.price = newValue[this.viewTemp.price];
				}
				if (newValue[this.viewTemp.footer]) {
					this.goodsData.footer = newValue[this.viewTemp.footer];
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.list-item-wrap {
	width: 100%;
	margin: 20upx 0;
	.list-item {
		width: calc(100% - 40upx);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20upx;
		box-sizing: border-box;
		.main-image {
			width: 220upx;
			height: 220upx;
			border-radius: 5upx;
			margin-right: 20upx;
		}
		.content-box {
			transition: all 1s ease-out;
			box-sizing: border-box;
			max-width: calc(100% - 20upx);
			flex: 1;
			// padding-right: 10px;
			color: #999;
			.title {
				line-height: 40upx;
				color: #333;
				margin-bottom: 10upx;
			}
			.title-tip {
				font-size: 24upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.content {
				.numbers {
					color: #e93b3d;
					line-height: 40upx;
					margin-top: 20upx;
					font-size: 36upx;
				}
				.unit {
					font-size: 30upx;
				}
			}
			.footer {
				display: flex;
				justify-content: space-between;
				height: 80upx;
				align-items: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.foot-name {
					position: relative;
					display: inline-block;
					padding-right: 28upx;
					line-height: 44upx;
					&::after {
						content: '';
						display: block;
						width: 8px;
						height: 8px;
						border-top: 1px solid #999;
						border-left: 1px solid #999;
						transform-origin: 50%;
						transform: rotate(135deg);
						position: absolute;
						width: 6px;
						height: 6px;
						right: 5px;
						top: 50%;
						margin-top: -3px;
					}
				}
				.foot-button {
					min-width: 100upx;
					display: flex;
					font-size: 30upx;
					justify-content: space-around;
          .text-blue{
            padding-left: 10upx;
          }
				}
			}
		}
	}
}
</style>
