<template>
  <view class="">
    <!-- 房屋信息 -->
    <view v-if="houseArray && Array.isArray(houseArray) ">
      <view class="account-name"><!-- <text>{{ name }} <text class="text-grey margin-left"> [ 业主 ]</text></text> --></view>
      <view
        class="account-info-card cu-list menu"
        v-for="(item, index) in houseArray"
        :key="index"
        :class="[menuBorder ? 'sm-border' : '', menuCard ? 'card-menu margin-top' : '']"
      >
        <view class="cu-item" :class="menuArrow ? 'arrow' : ''">
          <view class="content content_info">
            <text class="text-grey">户主:</text>
            <text class="text-grey">{{ item.bind_user }}</text>
          </view>
        </view>
        <view class="cu-item" :class="menuArrow ? 'arrow' : ''">
          <view class="content content_info">
            <text class="text-grey">房屋编号:</text>
            <text class="text-grey">{{ item.name }}</text>
          </view>
        </view>

        <view class="cu-item" :class="menuArrow ? 'arrow' : ''">
          <view class="content content_info">
            <text class="text-grey">房屋状态:</text>
            <text class="text-grey">{{ item.house_status }}</text>
          </view>
        </view>
        <view class="cu-item" :class="menuArrow ? 'arrow' : ''">
          <view class="content content_info">
            <text class="text-grey">房屋类别:</text>
            <text class="text-grey">{{ item._house_type_disp }}</text>
          </view>
        </view>
        <view class="cu-item" :class="menuArrow ? 'arrow' : ''">
          <view class="content content_info">
            <text class="text-grey">户型:</text>
            <text class="text-grey">{{ item._hxbm_disp}}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="showPersonList(item)">
          <view class="content content_info">
            <text class="text-grey">详情</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'personInfo',
  data() {
    return {
      menuBorder: true,
      menuCard: true,
      menuArrow: false,
      houseArray:[],
      accountInfo: '',
      isSingleHouse: true //只有一套房产
    };
  },
  computed: {
    name() {
      if (Array.isArray(this.accountInfo) && this.accountInfo.length > 0) {
        return this.accountInfo[0].xm;
      } else if (typeof this.accountInfo === 'object' && !Array.isArray(this.accountInfo)) {
        return this.accountInfo.xm;
      }
    }
  },
  methods: {
    showPersonList(e){
      // 跳转到此房屋下的实有人口列表
      uni.navigateTo({
        url:'../personInfo?fwbm='+e.fwbm
      })
    },
    async getHouseNum() {
      const url = this.getServiceUrl('zhxq', 'srvzhxq_buiding_house_select', 'select');
      let user = uni.getStorageSync('login_user_info').user_no;
      let req = {
        serviceName: 'srvzhxq_buiding_house_select',
        colNames: ['*'],
        condition: [
          { colName: 'is_bind', ruleType: 'eq', value: '是' },
          { colName: 'bind_user', ruleType: 'eq',value:user},
        ]
      };
      const res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS') {
        let data = res.data.data;
        this.houseArray = data
      }
    }
  },
  onLoad() {
    this.getHouseNum();
  }
};
</script>

<style lang="scss" scoped>
.content_info {
  display: flex;
  justify-content: space-between;
}
.account-name {
  color: #333;
  line-height: 60rpx;
  font-size: 30rpx;
  font-weight: 700;
  text-indent: 30rpx;
  text-align: center;
  background-color: #fff;
  // margin-bottom: 30rpx;
}
.little-title {
  background-color: #fff;
  border-bottom: 1px dashed #efefef;
  text-indent: 30rpx;
  line-height: 60rpx;
  padding-top: 30rpx;
}
</style>
