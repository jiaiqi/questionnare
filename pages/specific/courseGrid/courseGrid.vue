<template>
  <view class="course-wrap" :class="{ rotate: rotate }">
      <view class="course-wrap">
        <view class="header"><text>2019-2020 </text>学年 第二学期</view>
      <!--  <view class="week">
          <view class="week-item">课次</view>
          <view class="week-item">一</view>
          <view class="week-item">二</view>
          <view class="week-item">三</view>
          <view class="week-item">四</view>
          <view class="week-item">五</view>
          <view class="week-item">六</view>
        </view> -->
        <view class="course">
          
          <view class="time-area">
            <view class="week">
              <view class="week-item">课次</view>
            </view>
            <view class="time-item">
              <view class="index">1</view>
              <view class="time">08:00</view>
            </view>
            <view class="time-item">
              <view class="index">2</view>
              <view class="time">09:00</view>
            </view>
            <view class="time-item">
              <view class="index">3</view>
              <view class="time">10:00</view>
            </view>
            <view class="time-item">
              <view class="index">4</view>
              <view class="time">11:00</view>
            </view>
            <view class="time-item">
              <view class="index">5</view>
              <view class="time">14:00</view>
            </view>
            <view class="time-item">
              <view class="index">6</view>
              <view class="time">15:00</view>
            </view>
            <view class="time-item">
              <view class="index">7</view>
              <view class="time">16:00</view>
            </view>
            <view class="time-item">
              <view class="index">8</view>
              <view class="time">17:00</view>
            </view>
            <view class="time-item">
              <view class="index">9</view>
              <view class="time">19:00</view>
            </view>
            <view class="time-item">
              <view class="index">10</view>
              <view class="time">20:00</view>
            </view>
            <!-- <view class="time-item">
              <button type="primary" @click="rotateScreen">旋转屏幕</button>
            </view> -->
          </view>
          <scroll-view scroll-x="true" @scroll="scroll" scroll-left="0">
          <view class="course-area">
            <view class="week">
              <view class="week-item">一</view>
              <view class="week-item">二</view>
              <view class="week-item">三</view>
              <view class="week-item">四</view>
              <view class="week-item">五</view>
              <view class="week-item">六</view>
            </view>
            <view class="course-row" v-for="(item, index) in courseData" :key="index">
              <view class="course-row-item" :class="{ 'no-bg': !item.Monday }">{{ item.Monday }}</view>
              <view class="course-row-item" :class="{ 'no-bg': !item.Tuesday }">{{ item.Tuesday }}</view>
              <view class="course-row-item" :class="{ 'no-bg': !item.Wednesday }">{{ item.Wednesday }}</view>
              <view class="course-row-item" :class="{ 'no-bg': !item.Thursday }">{{ item.Thursday }}</view>
              <view class="course-row-item" :class="{ 'no-bg': !item.Friday }">{{ item.Friday }}</view>
              <view class="course-row-item" :class="{ 'no-bg': !item.Saturday }">{{ item.Saturday }}</view>
            </view>
          </view>
          </scroll-view>
        </view>
      </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      rotate: false,
      courseData: [
        {
          Monday: 'C语言程序设计',
          Tuesday: '',
          Wednesday: '模拟电子技术',
          Thursday: '离散数学',
          Friday: '计算机组成原理',
          Saturday: '软件工程'
        },
        {
          Monday: '',
          Tuesday: '微电子与电路基础',
          Wednesday: '多媒体技术',
          Thursday: '离散数学',
          Friday: '',
          Saturday: '数据结构与算法'
        },
        {
          Monday: '计算机导论',
          Tuesday: '数据结构与算法',
          Wednesday: '数字逻辑电路实验',
          Thursday: '',
          Friday: '计算机组织与体系结构',
          Saturday: '软件工程'
        },
        {
          Monday: '数据库系统',
          Tuesday: '电路分析原理',
          Wednesday: '',
          Thursday: '近世代数',
          Friday: '计算机组成原理',
          Saturday: '基础电路实验'
        },
        {
          Monday: 'C语言程序设计',
          Tuesday: '数据结构与算法',
          Wednesday: '模拟电子技术',
          Thursday: '',
          Friday: '计算机组成原理',
          Saturday: ''
        }
      ]
    };
  },
  methods: {
    scroll() {},
    rotateScreen() {
      this.rotate = !this.rotate;
    }
  }
};
</script>

<style lang="scss">
.rotate {
  transform: rotate(90deg);
}
.course-wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .header{
    font-size: 32upx;
    line-height: 80upx;
    text-align: center;
    background-color: #2980b9;
    color: #fff;
    // margin-bottom: 1upx ;
    // border-bottom: 1px solid #EFEFEF;
    }
  .week {
    // width: 120%;
    display: flex;
    background-color: #2980b9;
    // width: 120%;
    color: #efefef;
    .week-item {
      flex: 1;
      text-align: center;
    }
  }
  .course {
    display: flex;
    // flex-direction: column;
    .time-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      // justify-content: space-around;
      .week{
        margin: 0; padding: 0;
      }
      .time-item {
        height: 100upx;
        margin-right: 2px;
        margin-bottom: 2px;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        .index {
          font-size: 30upx;
          line-height: 40upx;
        }
        .time {
        }
      }
    }
    .course-area {
      width: 120%;
      flex: 6;
    }
    .course-row {
      display: flex;
      width: 15  0%;
      flex: 1;
      .course-row-item {
        font-size: 30upx;
        height: 200upx;
        margin: 2px;
        padding: 5px;
        background-color: rgba($color: #e64340, $alpha: 0.5);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        color: #fff;
        flex: 1;
        &:active{
          transform: scale(1.5);
          transition:all .5s;
        }
        
        &:first-child {
          background-color: rgba($color: #e74c3c, $alpha: 0.8);
        }
        &:nth-child(2) {
          background-color: rgba($color: #1abc9c, $alpha: 0.8);
        }
        &:nth-child(3) {
          background-color: rgba($color: #2ecc71, $alpha: 0.8);
        }
        &:nth-child(4) {
          background-color: rgba($color: #3498db, $alpha: 0.8);
        }
        &:nth-child(5) {
          background-color: rgba($color: #f1c40f, $alpha: 0.8);
        }
        &:nth-child(6) {
          background-color: rgba($color: #00b294, $alpha: 0.8);
        }
        &.no-bg {
          background-color: #fff;
        }
      }
    }
  }
}
</style>
