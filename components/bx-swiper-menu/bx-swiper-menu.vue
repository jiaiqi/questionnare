<template>
  <swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="false" interval="5000" duration="500">
    <swiper-item v-for="(item, index) in menuList" :key="index">
      <view class="bg-white  menu-item">
        <view class="bg-imgs " v-for="(item2, index2) in item" :key="index2" @click="clickMenu(item2)">
          <view class="menu-pic bg-blue">{{ item2[menuTemplate['lableCol']].slice(0, 2) }}</view>
          <!-- <view class="menu-pic bg-blue" v-if="!item2.type">{{ item2.dest_app }}</view> -->
          <!-- <view class="menu-pic2" v-if="item2.type && item2.type === 'more'"><image src="../../../static/img/more2.png" mode=""></image></view> -->
          <view class="label">{{ item2[menuTemplate['lableCol']] }}</view>
        </view>
      </view>
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  data() {
    return {
      // menuList:[],
    };
  },
  props: {
    menuList: {
      type: Array,
      default: () => {
        [];
      }
    },
    menuTemplate: {
      type: Object,
      default: () => {
        return {
          lableCol: 'dest_menu_no'
        };
      }
    }
  },
  methods: {
    clickMenu(e) {
      this.$emit('clickMenu', e);
    }
  }
};
</script>

<style scoped lang="scss">
// width: 100%;
// min-height: 400upx;
// padding: 20upx 0;
// // &/deep/ .screen-swiper {
// //     min-height: 300px!important;
// // }
.screen-swiper {
  margin: 20upx 10upx;
  background-color: #fff;
  border-radius: 20upx;
  overflow: hidden;
}
.menu-item {
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;

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
</style>
