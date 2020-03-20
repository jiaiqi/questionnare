<template>
  <view class="page-wrap">
    <view v-for="(pageItem, itemIndex) in pageItemList" :key="itemIndex">
      <view class="carousel-view" v-if="pageItem.div_type === 'carousel'">
        <swiper class="screen-swiper" :class="dotStyle ? 'square-dot' : 'round-dot'" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
          <swiper-item v-for="(item, index) in swiperList" :key="index" @click="clickSwiper(item)">
            <image :src="item.picUrl" mode="aspectFill" v-if="item.picUrl"></image>
          </swiper-item>
        </swiper>
      </view>
      <view class="menu-view" v-if="pageItem.div_type === 'buttons'">
        <swiper class="screen-swiper round-dot screen-sm" :indicator-dots="true" :circular="true" :autoplay="false" interval="5000" duration="500">
          <swiper-item v-for="(item, index) in menuList" :key="index">
            <view class="bg-white  menu-item">
              <view class="bg-imgs " v-for="(item2, index2) in item" :key="index2" @click="clickMenu(item2)">
                <view class="menu-pic bg-blue">{{ item2.dest_app }}</view>
                <!-- <view class="menu-pic bg-blue" v-if="!item2.type">{{ item2.dest_app }}</view> -->
                <!-- <view class="menu-pic2" v-if="item2.type && item2.type === 'more'"><image src="../../../static/img/more2.png" mode=""></image></view> -->
                <view class="label">{{ item2.dest_app }}</view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <!--  <view class="screen-xl">
          <view v-for="(item, index) in menuList" :key="index">
            <view class="bg-white  menu-item">
              <view class="bg-imgs " v-for="(item2, index2) in item" :key="index2" @click="clickMenu(item2)">
                <view class="menu-pic bg-blue" v-if="!item2.type">{{ item2.dest_app }}</view>
                <view class="menu-pic" v-if="item2.type && item2.type === 'more'"><image src="../../../static/img/more2.png" mode=""></image></view>
                <view class="label">{{ item2.dest_app }}</view>
              </view>
            </view>
          </view>
        </view> -->
      </view>

      <view class="news-view" v-if="pageItem.div_type === 'tablist'">
       <!-- <scroll-view scroll-x class="bg-white nav text-center" scroll-with-animation :scroll-left="scrollLeft" v-if="tabNewsList&&tabNewsList.length>0">
          <view class="cu-item" :class="index == TabCur ? 'text-white cur' : ''" v-for="(item, index) in tabNewsList" :key="index" @tap="tabSelect" :data-id="index">{{ item.name }}</view>
        </scroll-view> -->
        <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
        	<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabNewsList" :key="index" @tap="tabSelect" :data-id="index">
        		<view v-if="item&&item.name">
        		  {{ item.name }}
        		</view>
        	</view>
        </scroll-view>
        <view v-if="tabNewsList[TabCur]&&tabNewsList[TabCur].data">
          <view class="news-list" v-for="(list, index) in tabNewsList[TabCur].data" :key="index" @click="clickListItem(list)">
            <!-- 单图布局 -->
            <view class="news-list-item single-image left-image" v-if="list.picUrl">
              <image :src="list.picUrl" mode="" class="image" :lazy-load="true"></image>
              <view class="content">
                <view class="title">{{ list.title }}</view>
                <!-- <view class="text" v-html="list.content"></view> -->
                <view class="text" >{{list.create_time}}</view>
              </view>
            </view>
            <!-- 单行 纯文本布局 -->
            <view class="news-list-item none-image" v-if="!list.picUrl">
              <view class="content">
                <view class="title">{{ list.title }}</view>
                <view class="text"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import bxList from '@/components/bx-list/bx-list.vue';
export default {
  components: { bxList },
  data() {
    return {
      TabCur: 0,
      scrollLeft: 0,
      dotStyle: true,
      pageItemList: [], //页面项列表，控制页面显示内容
      menuList: [], //按钮列表
      newsList: [], //新闻列表
      swiperList: [], //轮播图列表
      categoryList: [], //分类列表
      listConfig: {
        serviceName: 'srvdaq_cms_content_select',
        pageType: 'list',
        viewTemp: {
          // title: 'name',
          // tip: 'desc',
          // img: 'img',
          // price: 'current_price',
          // footer: 'shop_name'
        }
      }
      // tabsList:{}
      // tabNewsList: [] //根据栏目分类的新闻列表
    };
  },
  created() {
    this.getPageItemList();
  },
  computed: {
    tabNewsList() {
      //根据栏目分类的新闻列表
      let NewsList = [];
      let tabNewsList = [];
      this.categoryList.forEach((cate, index) => {
        tabNewsList[index] = [];
        this.newsList.forEach(listItem => {
          if (cate.no === listItem.cate_no) {
            // tabNewsList[listItem.cate_name] = tabNewsList[listItem.cate_name].concat([listItem]);
            tabNewsList[index] = tabNewsList[index].concat([listItem]);
            // this.$set(this.tabNewsList, index, tabNewsList[index]);
            NewsList[index] = {};
            NewsList[index]['data'] = tabNewsList[index];
            NewsList[index]['name'] = listItem.cate_name;
            // NewsList[listItem.cate_name]= tabNewsList[index]
            // NewsList[index]['name'] = listItem.cate_name
          }
        });
      });
      return NewsList;
    }
  },
  watch: {
    // newsList: {
    //   deep: true,
    //   handler(newValue, oldValue) {
    //     console.log('newsList', newValue);
    //     if (newValue && newValue.length > 0) {
    //       let tabNewsList = [];
    //       this.categoryList.forEach((cate, index) => {
    //         tabNewsList[index] = [];
    //         newValue.forEach(listItem => {
    //           console.log('cate.no', cate.no, listItem.no);
    //           if (cate.no === listItem.cate_no) {
    //             tabNewsList[index] = tabNewsList[index].concat([listItem]);
    //             this.$set(this.tabNewsList, index, tabNewsList[index]);
    //           }
    //         });
    //       });
    //       // this.tabNewsList = tabNewsList
    //     }
    //   }
    // }
  },
  methods: {
    tabSelect(e) {
      //点击tab
      this.TabCur = Number(e.currentTarget.dataset.id);
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      
    },
    clickSwiper(e) {
      // 点击了轮播图
      console.log('点击了轮播图,', e);
    },
    clickMenu(e) {
      // 菜单按钮点击事件
      console.log('点击了按钮：', e);
      if (e.type && e.type === 'more') {
        // 点击了更多按钮
        console.log('点击了更多按钮');
        this.showMoreMenu();
      }
    },
    showMoreMenu() {
      // 展示所有按钮
      uni.redirectTo({
        url:'/pages/public/home/home'
      })
    },
    clickListItem(e) {
      // 列表点击事件
      console.log('点击了列表项：', e);
      uni.navigateTo({
        url: `/pages/specific/article/article?serviceName=srvdaq_cms_content_select&content_no=${e.content_no}&cate_name=${e.cate_name}`
        // url: '/pages/specific/article/article?article=' + encodeURIComponent(JSON.stringify(e))
      });
    },
    clickFootBtn() {},
    async getPageItemList() {
      //获取页面项列表
      uni.showLoading({
        mask: true
      });
      let url = this.getServiceUrl('daq', 'srvdaq_website_page_item_select', 'select');
      let req = {
        serviceName: 'srvdaq_website_page_item_select',
        colNames: ['*'],
        order: [{ colName: 'seq', orderType: 'asc' }]
      };
      let res = await this.$http.post(url, req);
      uni.hideLoading();
      if (res.data.state === 'SUCCESS') {
        this.pageItemList = res.data.data;
        res.data.data.forEach((item, index) => {
          this.getPageItem(item).then(data => {
            item['data'] = data;
            this.$set(this.pageItemList, index, item);
          });
        });
        return res.data.data;
      }
    },
    async getPageItem(item = {}) {
      // 获取页面项
      uni.showLoading({
        mask: true
      });
      let serviceName = '';
      switch (item.div_type) {
        case 'buttons':
          serviceName = 'srvdaq_page_item_buttons_select';
          break;
        case 'carousel':
          serviceName = 'srvdaq_page_item_carousel_select';
          break;
        case 'tablist':
          serviceName = 'srvdaq_cms_content_select';
          break;
      }
      if (item.div_type === 'tablist' && serviceName) {
        let urls = this.getServiceUrl('daq', serviceName, 'select');
        let reqs = {
          serviceName: serviceName,
          colNames: ['*'],
          group: [
            {
              colName: 'no',
              type: 'by'
            }
          ]
          // order: [{ colName: 'seq', orderType: 'asc' }] ,
        };
        let ress = await this.$http.post(urls, reqs);
        if (ress.data.state === 'SUCCESS') {
          this.categoryList = ress.data.data;
        }
      }
      if (serviceName) {
        let url = this.getServiceUrl('daq', serviceName, 'select');
        let req = {
          serviceName: serviceName,
          colNames: ['*'],
          order: [{ colName: 'seq', orderType: 'asc' }]
        };
        let res = await this.$http.post(url, req);
        uni.hideLoading();
        if (res.data.state === 'SUCCESS') {
          // this.itemList = res.data.data;
          let itemList = res.data.data;
          itemList.forEach((pageitem, index) => {
            switch (item.div_type) {
              case 'buttons':
                let itemLists = [];
                if (itemList.length <= 7) {
                  itemLists = [[...itemList, { type: 'more', dest_app: '更多' }]];
                  // itemLists = [itemList];
                } else if (itemList.length > 7 && itemList.length < 16) {
                  // } else if (itemList.length > 8 && itemList.length <= 16) {
                  itemLists = [itemList.slice(0, 7), [...itemList.slice(8, 15), { type: 'more', dest_app: '更多' }]];
                  // itemLists = [itemList.slice(0, 8), itemList.slice(8)];
                } else if (itemList.length > 16) {
                  itemLists = [itemList.slice(0, 8), [...itemList.slice(8, 15), { type: 'more', dest_app: '更多' }]];
                }
                this.menuList = itemLists;
                break;
              case 'carousel':
                this.getPictureUrl(pageitem.carousel_image).then(url => {
                  pageitem['picUrl'] = url;
                  this.$set(itemList, index, pageitem);
                  this.swiperList = itemList;
                });
                break;
              case 'tablist':
                // this.newsList = itemList;
                this.getPictureUrl(pageitem.icon_image).then(url => {
                  pageitem['picUrl'] = url;
                  this.$set(itemList, index, pageitem);
                  this.newsList = itemList;
                });
                this.getCategoryList(pageitem.no).then(data => {
                  pageitem['cate_name'] = data.cate_name;
                  pageitem['cate_no'] = data.no;
                  this.$set(itemList, index, pageitem);
                  this.newsList = itemList;
                });
                break;
            }
          });
          return itemList;
        }
      }
    },
    async getCategoryList(no) {
      //根据分类编号查询对应分类
      uni.showLoading({
        mask: true
      });
      const url = this.getServiceUrl('daq', 'srvdaq_cms_category_select', 'select');
      const req = { serviceName: 'srvdaq_cms_category_select', queryMethod: 'select', colNames: ['*'], condition: [{ colName: 'no', value: no, ruleType: 'eq' }] };
      let res = await this.$http.post(url, req);
      uni.hideLoading();
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        let data = res.data.data[0];
        return data;
      }
    },
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
        if (res.data.state === 'SUCCESS') {
          const data = res.data.data[0];
          if (data) {
            const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl;
            return fileurl;
          }
        }
      }
    }
  },
  watch: {
    pageItemList: {
      deep: true,
      handler(newVal) {
        // console.log(newVal);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 750px) {
  .screen-xl {
    display: block;
  }
  .screen-sm {
    display: none !important;
  }
  .page-wrap {
    max-width: 1200px;
    margin: 0 auto;
    // display: flex;
    display: grid;
  }
  // &/deep/ .screen-swiper {
  //     min-height: 300px!important;
  // }
  .menu-view {
    min-height: 300px;
    .menu-item {
      display: flex;
      flex-wrap: wrap;
      .bg-imgs {
        width: 200px;
        height: 60px;
        margin: 20px;
        .menu-pic {
          display: none;
          // justify-content: center;
          // align-items: center;
        }
        .label {
          width: 100%;
          display: flex;
          padding: 20px;
          justify-content: center;
          align-items: center;
          background-color: #0081ff;
          color: #fff;
        }
      }
    }
  }
  .news-view {
    display: flex;
    flex-direction: column;
    .news-list {
      width: calc(100% - 20px);
      margin: 10px;
      display: flex;
      .news-list-item {
        display: flex;
        &.none-image {
          line-height: 40px;
          position: relative;
          text-indent: 40px;
          &::before {
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            color: #333;
            left: 20px;
            top: calc(50% - 5px);
            position: absolute;
            background-color: #333;
          }
        }
        &.single-image {
          width: calc(100% - 40upx);
          margin: 0 auto;
          // padding-left: 40upx;
          .image {
            width: 150px;
            height: 150px;
            margin-right: 20px;
            border-radius: 20px;
          }
          .content {
            display: flex;
            flex-direction: column;
            padding: 0;
            flex: 1;
            .title {
              font-weight: 600;
              font-size: 30px;
            }
            .text {
              width: 95%;
              max-height: 100px;
              font-size: 20px;
              color: #666;
              padding-top: 10px;
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
          line-height: 40px;
          padding: 10px;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .screen-xl {
    display: none !important;
  }
  .screen-sm {
  }
  .menu-view {
    min-height: 400upx;
    padding: 20upx 0;
    // &/deep/ .screen-swiper {
    //     min-height: 300px!important;
    // }
    .menu-item {
      display: flex;
      box-sizing: border-box;
      flex-wrap: wrap;
    }
    .bg-imgs {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 10upx;
      width: 22%;
      .menu-pic2 {
        width: 100upx;
        height: 100upx;
        border-radius: 20upx;
      }
      .menu-pic {
        width: 100upx;
        height: 100upx;
        border-radius: 20upx;
        font-size: 30upx;
        margin: 0 auto;
        justify-content: center;
        align-items: center;
        display: flex;
        font-family: '黑体';
        // background-color: #409EFF;
        z-index: 1;
        &::before {
          content: '';
          position: absolute;
          width: 100upx;
          height: 100upx;
          // opacity: 1;
          background: rgba($color: #0081ff, $alpha: 0.8);
          transform: translate(3px, 4px);
          border-radius: 20upx;
          z-index: -1;
          box-shadow: 10px 10px 22px 2px rgba(0, 0, 100, 0.2);
        }
        &:active {
          transform: translate(2px, 2px);
        }
      }
      .label {
        line-height: 50upx;
        margin-top: 10upx;
      }
    }
  }
  .news-view {
    display: flex;
    flex-direction: column;
    .news-list {
      width: calc(100% - 20upx);
      margin: 30upx 0;
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
}
</style>
