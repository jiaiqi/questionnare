<template>
  <view class="table-content" v-if="tableData.length > 0">
    <view class="row" v-if="!showList">
      <view class="column">选项</view>
      <view class="column">小计</view>
      <view class="column">比例</view>
    </view>
    <view class="row" v-if="showList" :class="{ 'show-list': showList }">
      <!-- <view class="column">序号</view> -->
      <view class="column">答题文本</view>
      <view class="column">次数</view>
    </view>
    <view class="row" :class="{ 'show-list': showList }" v-for="option in showList?pagingData:tableData" :key="option.id">
      <text class="column" v-if="!showList">{{ option.label }}</text>
      <text class="column">{{ option.value }}</text>
      <text class="column" v-if="showList">{{ optionData[option.value] }}</text>
      <text class="column" v-if="option.ratio">{{ option.ratio }}</text>
    </view>
    <view class="row">
      <text class="column" v-if="!showList">本题填写有效人次:{{ amount }}</text>
    </view>
    <view class="pagination" v-if="showList&&amount>pageSize" >
      <button class="cu-btn sm" :disabled="pageNo===1" @click="changePage('up')">
      上一页  
      </button>
      <view class="pages-info">
        <text class="current text-blue">{{pageNo}}</text>/<text class="total">{{totalPage}}</text>
      </view>
      <button class="cu-btn sm" :disabled="pageNo===totalPage" @click="changePage('down')">
      下一页  
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'bx-table',
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      pagingData:[]
    };
  },
  computed: {
    totalPage(){
      return Math.ceil(this.amount/this.pageSize)
    },
    amount() {
      let amount = 0;
      if (typeof this.optionData === 'object'&&!this.showList) {
        Object.keys(this.optionData).length > 0 &&
          Object.keys(this.optionData).forEach(item => {
            if (Number(this.optionData[item]).toString() !== 'NaN') {
              amount += Number(this.optionData[item]);
            }
          });
      }else if(this.showList){
        amount = Object.keys(this.optionData).length
      }
      
      return amount;
    },
    tableData() {
      let arr = [];
      let amount = this.amount;
      if (typeof this.optionData === 'object') {
        Object.keys(this.optionData).forEach((item, index) => {
          if (!this.showList) {
            arr.push({
              label: item,
              value: this.optionData[item],
              ratio: ((Number(this.optionData[item]) * 100) / amount).toFixed(2).toString() + '%' //'%'
            });
          } else {
            arr.push({
              label: index + 1,
              value: item
            });
          }
        });
      }
      return arr;
    }
  },
  watch: {
    tableData:{
      immediate:true,
      handler(newValue, oldValue){
        if(newValue&&Array.isArray(newValue)&&newValue.length>0){
          this.pagingData =  this.pagination(this.pageNo, this.pageSize, newValue)
        }
      }
    }
  },
  props: {
    colList: {
      type: Array,
      default: () => [{ label: '年' }, { label: '日' }, { label: '月' }]
    },
    dataList: {
      type: Array,
      default: () => []
    },
    optionData: {
      type: Object,
      default: () => {}
    },
    showList: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    changePage(type){
      let pageNo = this.pageNo
      let pageSize = this.pageSize
      let data = this.tableData
      let total = this.totalPage
      switch (type){
        case 'up':
          pageNo>1?pageNo--:pageNo=1
          break;
        case 'down':
          pageNo!==total?pageNo++:""
          break;
      }
      this.pageNo = pageNo
      this.pagingData = this.pagination(pageNo,pageSize,data)
      
    },
    pagination(pageNo, pageSize, array) {
      let offset = (pageNo - 1) * pageSize;
      return offset + pageSize >= array.length ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
    }
  }
};
</script>

<style scoped lang="scss">
.table-content {
  min-width: 50%;
  margin: 10upx 0;
  .row {
    display: flex;
    justify-content: space-between;
    text-align: center;
    overflow: hidden;
    border-bottom: 1px solid #eee;
    .column {
      min-width: 20%;
      min-height: 50upx;
      display: flex;
      align-items: center;
      border-left: 1px solid #eee;
      flex: 1;
      &:first-child {
        flex: 3;
        text-align: left;
        text-indent: 10upx;
      }
      &:nth-child(2){
        display: flex;
        justify-content: flex-end;
        padding-right: 10upx;
      }
      &:last-child {
        display: flex;
        justify-content: flex-end;
        padding-right: 10upx;
        border-right: 1px solid #eee;
      }
    }
    &.show-list {
      .column {
        &:first-child {
          flex: 1;
          padding-left: 20upx;
          word-break: break-all;
          word-wrap: break-word;
        }
        &:last-child {
          min-width: 60upx;
          max-width: 80upx;
          justify-content: center;
        }
      }
    }
    &:first-child {
      background-color: #eee;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      .column{
        justify-content: center;
      }
    }
    &:last-child {
      background-color: #eee;
      border-bottom: 1px solid #eee;
      border-top: 1px solid #eee;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      .column {
        width: 100%;
        text-align: center;
        justify-content: center;
      }
    }
  }
  .pagination{
    display: flex;
    width: 80%;
    margin: 0 auto;
    height: 80upx;
    padding-top: 10upx;
    align-items: flex-start;
    justify-content: space-around;
    .pag-btn{
      font-size: 20upx;
      background-color: #278fff;
      padding: 0 20upx;
      line-height: 40upx;
      &.disabled{
        background-color: #efefef;
      }
    }
    .pages-info{
      line-height: 50upx;
    }
  }
}
</style>
