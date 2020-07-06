<template>
  <view class="content">
    <view class="cu-bar search fixed bg-white">
      <view
        class="cu-avatar round"
        @tap="showModal"
        style="background-image:url(https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=557109946,2739587198&fm=74&app=80&f=PNG&size=f121,121?sec=1880279984&t=bb70b527cf95f2995d30196a35fa09bd"
      ></view>

      <view class="content">
        <text>{{ policeRoomInfo.name ? policeRoomInfo.name : '' }}</text>
        <text class="cuIcon-triangledownfill"></text>
      </view>
    </view>

    <view class="cu-modal drawer-modal justify-start" :class="modalName == 'DrawerModalL' ? 'show' : ''" @tap="hideModal">
      <view class="cu-dialog basis-lg" @tap.stop="" :style="[{ top: CustomBar + 'px', height: '100%' }]">
        <view class="cu-list menu text-left">
          <view class="cu-item arrow" v-for="(item, index) in 5" :key="index">
            <view class="content">
              <view>派出所 {{ index + 1 }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="" style="height: 100upx;"></view>
    <view class="wrapheadr">
      <view class="">
        <view class="titlecolor">122</view>
        <view class="text">户籍人口</view>
      </view>
      <view class="">
        <view class="titlecolor">85</view>
        <view class="text">滚动人口</view>
      </view>
      <view class="">
        <view class="titlecolor">6</view>
        <view class="text">居民</view>
      </view>
      <view class="">
        <view class="titlecolor">79</view>
        <view class="text">户籍人口</view>
      </view>
      <view class="">
        <view class="titlecolor">13/5</view>
        <view class="text">数量/信息员</view>
      </view>
    </view>
    <view class="wrapJl">
      <view class="" style="margin-bottom: 20upx;">
        <text class="cuIcon-title text-blue"></text>
        警力配备
      </view>
      <view class="Jlsuccess" style="" v-for="i in 1" :key="i">
        <image class="heaserImg" src="http://img0.imgtn.bdimg.com/it/u=3741733804,1966033566&fm=26&gp=0.jpg" mode=""></image>
        <view class="infrom" style="">
          <text class="nametitle">屈红军</text>
          <text style="opacity: 0;">***</text>
          <text>48岁</text>
          <text style="opacity: 0;">***</text>
          <text class="tigb bg-blue">民警</text>
          <view class="Inumber">手机号:18788888888 入驻时间:2018-1-8</view>
        </view>
      </view>
      <view class="Jlsuccess" style="" v-for="i in 1" :key="i">
        <image class="heaserImg" src="http://img0.imgtn.bdimg.com/it/u=3741733804,1966033566&fm=26&gp=0.jpg" mode=""></image>
        <view class="infrom" style="">
          <text class="nametitle">屈红军</text>
          <text style="opacity: 0;">***</text>
          <text>48岁</text>
          <text style="opacity: 0;">***</text>
          <text class="tigb bg-blue">辅警</text>
          <view class="jointime">
            <view class="Inumber">手机号:18788888888</view>
            <view class="Inumber">入驻时间:2018-1-8</view>
          </view>
        </view>
      </view>
    </view>

    <view class="jobsS">
      <view class="" style="margin-bottom: 20upx;">
        <text class="cuIcon-title text-blue"></text>
        办公设施
      </view>
      <view class="" style="display: flex;justify-content: space-between; flex-wrap: wrap;">
        <view class="listto" style="" v-for="(iten, index) in jobdata" :key="index">
          <view class="jobtitle">{{ iten.title }}</view>
          <view class="cu-tag bg-blue">{{ iten.num }}</view>
        </view>
      </view>
    </view>
    <view class="qiun-charts">
      <view class="titlebar">
        <text @click="shopmarkt(index)" :class="index == idx ? 'titltcolr' : ''" v-for="(item, index) in title" :key="index">{{ item }}</text>
      </view>
      <canvas v-if="canvasBoole" canvas-id="canvasColumn" id="canvasColumn" class="charts"></canvas>
      <view class="pieStyle" style="" v-else>
        <canvas canvas-id="canvasPie" id="canvasPie" class="charts-pie"></canvas>
        <view class="">1.区域边界：东至群建巷，西至陵原边，南至摩天院路</view>
        <view class="">2.经度：107.157629；纬度：34.387778</view>
      </view>
    </view>
    <view class="" style="height: 100upx;"></view>
    <view class="" style="text-align: center;color:#878181 ;">详细地址:{{ policeRoomInfo.addr ? policeRoomInfo.addr : '群众路216号' }}</view>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js';
import { isJSON } from '@/common/checker.js';
var canvaColumn = null;
var canvaPie = null;
export default {
  data() {
    return {
      modalName: null,
      CustomBar: this.CustomBar,
      title: ['九重点数量', '学校以及营业场所', '房屋出租'],
      idx: 0,
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      textarea: '',
      canvasBoole: true,
      jobdata: [
        { title: '办公用房面积', num: '12m²' },
        { title: '办公电脑', num: '2台' },
        { title: '公安网', num: '3台' },
        { title: '警用器材', num: '12套' },
        { title: '手持终端', num: '暂无' },
        { title: '自行车', num: '4辆' }
      ],
      policeRoomInfo: {}
    };
  },
  methods: {
    async getPoliceRoomInfo(jws_no) {
      let url = this.getServiceUrl('daq', 'srvdaq_jws_info_select', 'select');
      let req = {
        serviceName: 'srvdaq_jws_info_select',
        colNames: ['*'],
        condition: [{ colName: 'jws_no', ruleType: 'in', value: jws_no }]
      };
      let res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        this.policeRoomInfo = res.data.data[0];
      }
    },
    point() {
      console.log();
      if (this.idx == 0) {
        this.canvasBoole = true;
        let Column = {
          categories: ['涉恐重点人', '国家保护重点人', '精神患者', '刑放', '吸毒', '涉军', '非访', '涉众上访', '邪教'],
          series: [
            {
              name: '九重点数量',
              data: [15, 10, 20, 30, 40, 20, 8, 50, 5]
            }
          ]
        };
        this.showColumn('canvasColumn', Column, 'column');
      } else if (this.idx == 1) {
        this.canvasBoole = true;
        let Column = {
          categories: ['娱乐场所', '中学', '小学', '幼儿园', '旅馆', '网吧', '油(气)站'],
          series: [
            {
              name: '学校以及营业场所',
              data: [8, 6, 33, 12, 20, 9, 48]
            }
          ]
        };
        this.showColumn('canvasColumn', Column, 'line');
      } else {
        this.canvasBoole = false;
        let chartData = {
          series: [
            {
              name: '甲类',
              data: 50
            },
            {
              name: '乙类',
              data: 30
            },
            {
              name: '丙类',
              data: 20
            },
            {
              name: '厂房',
              data: 28
            }
          ]
        };
        this.showPie('canvasPie', chartData);
      }
    },
    shopmarkt(index) {
      this.idx = index;
      this.point();
    },
    showModal(e) {
      this.modalName = 'DrawerModalL';
    },
    hideModal(e) {
      this.modalName = null;
    },
    showColumn(canvasId, chartData, type) {
      let _self = this;
      canvaColumn = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: type,
        legend: {
          show: true
        },
        fontSize: 11,
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
          rotateLabel: true
        },

        yAxis: {
          //disabled:true
        },
        dataLabel: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            type: 'group',
            width: (_self.cWidth * _self.pixelRatio * 0.45) / chartData.categories.length
          }
        }
      });
    },
    showPie(canvasId, chartData) {
      let _self = this;
      canvaPie = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'pie',
        fontSize: 13,
        legend: { show: true },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio - 20,
        height: _self.cHeight * _self.pixelRatio - 40,
        dataLabel: true,
        extra: {
          pie: {
            lableWidth: 15
          }
        }
      });
    }
  },
  created() {
    if (this.$route.query.jws_no) {
      this.getPoliceRoomInfo(this.$route.query.jws_no);
    }
  },
  mounted() {},
  onLoad() {
    let _self = this;
    this.cWidth = uni.upx2px(690);
    this.cHeight = uni.upx2px(500);
    this.point();
  }
};
</script>

<style lang="scss" scoped>
@import '../../../../common/qiun.css';
.titltcolr {
  color: #5fa7f6 !important;
}
.wrapheadr {
  // width: 100vw;
  margin: 30upx;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 20upx 30upx;
  text-align: center;
  border-radius: 8upx;
  .titlecolor {
    color: #5173e1;
    font-size: 35upx;
    line-height: 30px;
  }

  .text {
    font-size: 25upx;
    color: #959595;
    line-height: 30px;
  }
}
.wrapJl {
  border-radius: 8upx;
  margin: 30upx;
  // height: 200px;
  background-color: #fff;
  padding: 20upx;
  .Jlsuccess {
    display: flex;
    margin-bottom: 28upx;
    .infrom {
      height: 80upx;
      margin-left: 18upx;
    }
  }
}
.qiun-charts {
  width: auto !important;
  background-color: #ffffff;
  margin: 0 30upx;
  padding-top: 20upx;
}
.titlebar {
  font-size: 28upx;
  margin-bottom: 10upx;
}
.titlebar text {
  color: #959595;
}
.titlebar text:before {
  display: inline-block;
  content: '';
  height: 20upx;
  width: 38upx;
  background-color: #449dff;
  margin: 0 17upx;
}
.pieStyle {
  background-color: #fff;
  padding: 0 30upx;
  font-size: 13px;
  color: #b1b1b7;
  border-radius: 8upx;
  view {
    line-height: 45upx;
  }
}
.jointime {
  display: flex;
  justify-content: space-between;
}
.heaserImg {
  display: inline-block !important;
  width: 80upx !important;
  height: 80upx !important;
  border-radius: 50% !important;
}
.nametitle {
  font-size: 30upx;
  font-weight: bold;
}
.Inumber {
  font-size: 26upx;
  color: #959595;
  line-height: 50upx;
}
.tigb {
  font-size: 24upx;
  padding: 4upx 10upx;
  text-align: center;
  border-radius: 7upx;
}
.facililist {
  margin: 20upx;
  display: flex;
  justify-content: space-between;
}
.cu-tag {
  height: 38upx !important;
  border-radius: 20upx;
}
.listto {
  text-align: center;
  width: 170upx;
  margin: 10upx 20upx;
}
.jobtitle {
  margin: 15upx 0;
}
.jobsS {
  border-radius: 8upx;
  margin: 30upx;
  // height: 200px;
  background-color: #fff;
  padding: 20upx;
}
</style>
