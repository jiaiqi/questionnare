<template>
  <view class="tab-list" v-if="cateList.length > 0">
    <view class="cu-bar bg-white">
      <view class="action sub-title">
        <text class="text-xl text-bold text-blue">{{ pageItem.item_name }}</text>
        <text class="bg-blue"></text>
      </view>
    </view>
    <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
      <view class="cu-item" :class="index == TabCur ? 'text-blue cur' : ''" v-for="(cate, index) in cateList" :key="index" @tap="tabSelect($event, cate)" :data-id="index">
        <view v-if="cate && cate.tablist_name">{{ cate.tablist_name }}</view>
      </view>
    </scroll-view>
    <view class="news-list" v-for="(list, index) in contList" :key="index" @click="clickListItem(list)">
      <!-- 单图布局 -->
      <view class="news-list-item single-image left-image" v-if="list[contentTemplate['imgCol']]">
        <image :src="list.picUrl" mode="" class="image" :lazy-load="true"></image>
        <view class="content">
          <view class="title">{{ list[contentTemplate['titleCol']] }}</view>
          <view class="text">{{ list[contentTemplate['dateCol']] }}</view>
        </view>
      </view>
      <!-- 单行 纯文本布局 -->
      <view class="news-list-item none-image" v-if="!list[contentTemplate['imgCol']]">
        <view class="content">
          <view class="title">{{ list[contentTemplate['titleCol']] }}</view>
          <view class="text"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TabList',
  data() {
    return {
      TabCur: 0, //当前tab
      scrollLeft: 0,
      cateList: [], //分类列表
      contList: [], //内容列表
      page: {
        total: 0,
        rownumber: 5,
        pageNo: 1
      }
    };
  },
  props: {
    srvApp: {
      //服务对应的app
      type: String,
      default: 'daq'
    },
    cateService: {
      //分类服务名
      type: String,
      default: 'srvdaq_page_item_tablist_select'
    },
    contentService: {
      // 内容服务名
      type: String,
      default: 'srvdaq_cms_content_select'
    },
    contentTemplate: {
      //内容模板
      type: Object,
      default: () => {
        return {
          imgCol: 'icon_image',
          titleCol: 'title',
          dateCol: 'create_time'
        };
      }
    },
    pageItem: {
      //页面项数据
      type: Object,
      default: () => {}
    }
  },
  methods: {
    clickListItem(e) {
      //点击列表项
      console.log('点击了列表项,', e);
    },
    tabSelect(e, item) {
      //点击tab
      this.TabCur = Number(e.currentTarget.dataset.id);
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      console.log('点击了Tab,', item);
      this.getContList(item.no);
    },
    /**
     * 获取分类列表
     */
    async getCateList() {
      uni.showLoading({
        mask: true
      });
      const url = this.getServiceUrl(this.srvApp, this.cateService, 'select');
      const req = { serviceName: this.cateService, colNames: ['*'], condition: [{ colName: 'item_no', ruleType: 'eq', value: this.pageItem.item_no }] };
      let res = await this.$http.post(url, req);
      uni.hideLoading();
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        let data = res.data.data;
        this.cateList = data;
        return data;
      }
    },
    /**
     * 获取内容列表
     * @param {String} cate_no -分类编号
     */
    async getContList(cate_no) {
      uni.showLoading({
        mask: true
      });
      const url = this.getServiceUrl(this.srvApp, this.contentService, 'select');
      const req = { serviceName: this.contentService, colNames: ['*'], condition: [{ colName: 'no', value: cate_no, ruleType: 'eq' }] };
      let res = await this.$http.post(url, req);
      uni.hideLoading();
      if (res.data.state === 'SUCCESS' && res.data.data.length >= 0) {
        let data = res.data.data;
        this.contList = data;
        data.forEach((item, index) => {
          this.getPictureUrl(item.icon_image).then(url => {
            item['picUrl'] = url;
            this.$set(data, index, item);
            this.contList = data;
          });
        });
        // this.contList = data;
        return data;
      }
    },
    /**
     * 根据文件编号查找对应文件url
     * @param {String} file_no -文件编号
     */
    async getPictureUrl(file_no) {
      const serviceName = 'srvfile_attachment_select';
      const url = this.getServiceUrl('file', serviceName, 'select');
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
      };
      if (file_no !== null && file_no !== '' && file_no !== undefined) {
        let res = await this.$http.post(url, req);
        if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
          const data = res.data.data[0];
          if (data) {
            const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl;
            return fileurl;
          }
        }
      }
    }
  },
  mounted() {
    this.getCateList().then(data => {
      if (data && data.length > 0) {
        this.getContList(data[0].no);
      }
    });
  }
};
</script>

<style lang="scss">
.tab-list {
  // display: flex;
  // flex-direction: column;
  min-height: 1000upx;
  .news-list {
    width: 100%;
    // width: calc(100% - 20upx);
    margin: 20upx 0;
    display: flex;
    .news-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.none-image {
        line-height: 40upx;
        position: relative;
        text-indent: 40upx;
        &::before {
          content: '';
          width: 10upx;
          height: 10upx;
          border-radius: 50%;
          color: #333;
          left: 20upx;
          top: calc(50% - 5upx);
          position: absolute;
          background-color: #333;
        }
      }
      &.single-image {
        width: calc(100% - 40upx);
        margin: 0 auto;
        // padding-left: 40upx;
        .image {
          width: 150upx;
          height: 150upx;
          margin-right: 20upx;
          border-radius: 20upx;
        }
        .content {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 0;
          flex: 1;
          height: 160upx;
          max-width: 520upx;
          .title {
            font-weight: 600;
            height: auto;
            overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
          }
          .text {
            width: 95%;
            max-height: 120upx;
            font-size: 24upx;
            color: #666;
            padding-top: 10upx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
      .content {
        flex: 1;
        line-height: 40upx;
        padding: 10upx;
      }
    }
  }
}
</style>
