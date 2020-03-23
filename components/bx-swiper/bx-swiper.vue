<template>
  <view class="carousel-view">
    <swiper class="screen-swiper" :class="dotStyle ? 'square-dot' : 'round-dot'" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
      <swiper-item v-for="(item, index) in swiperList" :key="index" @click="clickSwiper(item)">
        <image :src="item[imgCol]" mode="aspectFill" v-if="item[imgCol]"></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dotStyle: true
    };
  },
  props: {
    imgCol: {
      type: String,
      required:true,
      default: 'picUrl'
    },
    swiperList: {
      type: Array,
      default: () => {
        [];
      }
    }
  },
  methods: {
    clickSwiper(e) {
      this.$emit('clickSwiper', e);
    }
  }
};
</script>

<style lang="scss">
.carousel-view {
  background-color: #fff;
  border-bottom-left-radius: 20upx;
  border-bottom-right-radius: 20upx;
}
</style>
