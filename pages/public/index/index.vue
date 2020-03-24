<template>
  <view class="page-wrap">
    <view v-for="(pageItem, itemIndex) in pageItemList" :key="itemIndex">
      <SwiperCarousel :swiperList="swiperList" v-if="pageItem.div_type === 'carousel'" @clickSwiper="clickSwiper" :imgCol="'picUrl'"></SwiperCarousel>
      <SwiperMenu class="menu-view" v-if="pageItem.div_type === 'buttons'" :menuList="menuList" @clickMenu="clickMenu"></SwiperMenu>
      <TabList
        @clickListItem="clickListItem"
        @showMore="showMore($event,pageItem)"
        v-if="pageItem.div_type === 'tablist'"
        :pageItem="pageItem"
        :srvApp="tabListConfig['srvApp']"
        :contentService="tabListConfig['contentService']"
        :cateService="tabListConfig['cateService']"
        :contentTemplate="tabListConfig['contentTemplate']"
      ></TabList>
    </view>
  </view>
</template>

<script>
import TabList from '@/components/bx-tablist/bx-tablist.vue';
import SwiperCarousel from '@/components/bx-swiper/bx-swiper.vue';
import SwiperMenu from '@/components/bx-swiper-menu/bx-swiper-menu.vue';
export default {
  components: { TabList, SwiperCarousel, SwiperMenu },
  data() {
    return {
      scrollTop: 0,
      TabCur: 0,
      scrollLeft: 0,
      dotStyle: true,
      pageItemList: [], //页面项列表，控制页面显示内容
      menuList: [], //按钮列表
      newsList: [], //新闻列表
      swiperList: [], //轮播图列表
      categoryList: [], //分类列表
      tabListConfig: {
        srvApp: 'daq',
        contentService: 'srvdaq_cms_content_select',
        cateService: 'srvdaq_page_item_tablist_select',
        contentTemplate: {
          imgCol: 'icon_image',
          titleCol: 'title',
          dateCol: 'create_time'
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
            tabNewsList[index] = tabNewsList[index].concat([listItem]);
            NewsList[index] = {};
            NewsList[index]['data'] = tabNewsList[index];
            NewsList[index]['name'] = listItem.cate_name;
          }
        });
      });
      return NewsList;
    }
  },
  methods: {
    showMore(e,pageitem) {
      console.log('点击了更多按钮', e,pageitem);
      uni.navigateTo({
        url:"/pages/specific/newsList/newsList?cate_no="+e.no
      })
    },
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
        uni.navigateTo({
          url: '/pages/public/home/home'
        });
      } else if (e.type && e.type === 'health') {
        uni.navigateTo({
          url: '/pages/specific/symptom/symptom'
        });
      } else if (e.dest_page) {
        uni.navigateTo({
          url: e.dest_page
        });
      }
    },
    clickListItem(e) {
      // 列表点击事件
      console.log('点击了列表项：', e);
      uni.navigateTo({
        url: `/pages/specific/article/article?serviceName=srvdaq_cms_content_select&content_no=${e.content_no}&cate_name=${e.cate_name}`
        // url: '/pages/specific/article/article?article=' + encodeURIComponent(JSON.stringify(e))
      });
    },
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
        res.data.data.map((item, index) => {
          switch (item.div_type) {
            case 'buttons':
              item['componentsType'] = 'SwiperMenu';
              break;
            case 'carousel':
              item['componentsType'] = 'SwiperCarousel';
              break;
            case 'tablist':
              item['componentsType'] = 'TabList';
              break;
              return;
          }
          this.getPageItem(item).then(data => {
            item['data'] = data;
            this.$set(this.pageItemList, index, item);
          });
          return item;
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
          return;
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
                // {type:'health',dest_app: '更多'},{ type: 'more', dest_app: '更多' }
                // itemList = itemList.concat([{ type: 'health', dest_menu_no: '症状自检' }, { type: 'more', dest_menu_no: '更多' }]);
                if (itemList.length <= 8) {
                  // itemLists = [[...itemList]];
                  itemLists = [itemList];
                } else if (itemList.length > 8 && itemList.length <= 16) {
                  itemLists = [itemList.slice(0, 8), itemList.slice(8)];
                } else if (itemList.length > 16) {
                  itemLists = [itemList.slice(0, 8), itemList.slice(8, 16)];
                }
                this.menuList = itemLists;
                break;
              case 'carousel':
                pageitem['picUrl'] = this.$api.serverURL + '/file/download?fileNo=' + pageitem.carousel_image;
                this.$set(itemList, index, pageitem);
                this.swiperList = itemList;
                // this.getPictureUrl(pageitem.carousel_image).then(url => {
                //   pageitem['picUrl'] = url;
                //   this.$set(itemList, index, pageitem);
                //   this.swiperList = itemList;
                // });
                break;
              case 'tablist':
                // this.newsList = itemList;
                // this.getPictureUrl(pageitem.icon_image).then(url => {
                //   pageitem['picUrl'] = url;
                //   this.$set(itemList, index, pageitem);
                //   this.newsList = itemList;
                // });
                // this.getCategoryList(pageitem.no).then(data => {
                //   pageitem['cate_name'] = data.cate_name;
                //   pageitem['cate_no'] = data.no;
                //   this.$set(itemList, index, pageitem);
                //   this.newsList = itemList;
                // });
                break;
            }
            itemList = res.data.data;
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
    padding: 0 20upx;
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
  .page-wrap {
    position: relative;
    overflow: hidden;
    // background-color: #EEEEEE;
  }
  // .menu-view {
  //   // width: 100%;
  //   // min-height: 400upx;
  //   // padding: 20upx 0;
  //   // &/deep/ .screen-swiper {
  //   //     min-height: 300px!important;
  //   // }
  //   .menu-item {
  //     display: flex;
  //     box-sizing: border-box;
  //     flex-wrap: wrap;
  //   }
  //   .bg-imgs {
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     align-items: center;
  //     margin: 10upx;
  //     width: 22%;
  //     .menu-pic2 {
  //       width: 100upx;
  //       height: 100upx;
  //       border-radius: 20upx;
  //     }
  //     .menu-pic {
  //       width: 100upx;
  //       height: 100upx;
  //       border-radius: 20upx;
  //       font-size: 30upx;
  //       margin: 0 auto;
  //       justify-content: center;
  //       align-items: center;
  //       display: flex;
  //       font-family: '黑体';
  //       // background-color: #409EFF;
  //       z-index: 1;
  //       &::before {
  //         content: '';
  //         position: absolute;
  //         width: 100upx;
  //         height: 100upx;
  //         // opacity: 1;
  //         background: rgba($color: #0081ff, $alpha: 0.8);
  //         transform: translate(3px, 4px);
  //         border-radius: 20upx;
  //         z-index: -1;
  //         box-shadow: 10px 10px 22px 2px rgba(0, 0, 100, 0.2);
  //       }
  //       &:active {
  //         transform: translate(2px, 2px);
  //       }
  //     }
  //     .label {
  //       line-height: 50upx;
  //       margin-top: 10upx;
  //     }
  //   }
  // }
  // .news-view {
  //   display: flex;
  //   flex-direction: column;
  //   .news-list {
  //     width: calc(100% - 20upx);
  //     margin: 30upx 0;
  //     display: flex;
  //     .news-list-item {
  //       display: flex;
  //       justify-content: space-between;
  //       align-items: center;
  //       &.none-image {
  //         line-height: 40upx;
  //         position: relative;
  //         text-indent: 40upx;
  //         &::before {
  //           content: '';
  //           width: 10upx;
  //           height: 10upx;
  //           border-radius: 50%;
  //           color: #333;
  //           left: 20upx;
  //           top: calc(50% - 5upx);
  //           position: absolute;
  //           background-color: #333;
  //         }
  //       }
  //       &.single-image {
  //         width: calc(100% - 40upx);
  //         margin: 0 auto;
  //         // padding-left: 40upx;
  //         .image {
  //           width: 150upx;
  //           height: 150upx;
  //           margin-right: 20upx;
  //           border-radius: 20upx;
  //         }
  //         .content {
  //           display: flex;
  //           flex-direction: column;
  //           justify-content: space-around;
  //           padding: 0;
  //           flex: 1;
  //           height: 160upx;
  //           max-width: 520upx;
  //           .title {
  //             font-weight: 600;
  //             height: auto;
  //             overflow: hidden;
  //             // text-overflow: ellipsis;
  //             // white-space: nowrap;
  //           }
  //           .text {
  //             width: 95%;
  //             max-height: 120upx;
  //             font-size: 24upx;
  //             color: #666;
  //             padding-top: 10upx;
  //             overflow: hidden;
  //             text-overflow: ellipsis;
  //             display: -webkit-box;
  //             -webkit-line-clamp: 2;
  //             -webkit-box-orient: vertical;
  //           }
  //         }
  //       }

  //       .content {
  //         flex: 1;
  //         line-height: 40upx;
  //         padding: 10upx;
  //       }
  //     }
  //   }
  // }
}
</style>
