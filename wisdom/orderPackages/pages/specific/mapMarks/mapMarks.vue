<template>
  <view class="amap-wrap">
    <view class="menu-box">
      <view class="area-picker">
        <view class="picker" @click="$refs.picker.show()">{{ areaName }}</view>
        <view class="lg text-grey cuIcon-unfold"></view>
      </view>
      <view class="button" v-if="isFilter"><text class="lg text-gray cuIcon-repeal" @click="cancelChange"></text></view>
    </view>
    <div id="container"></div>
    <lb-picker @confirm="MultiChange" @cancel="cancelChange" ref="picker" :props="myProps" :list="areaList" v-model="pickerVal" mode="multiSelector" :level="2"></lb-picker>
  </view>
</template>
<script>
import LbPicker from '@/components/lb-picker';
export default {
  components: { LbPicker },
  data() {
    return {
      pickerVal: [],
      mapConfig: {},
      myProps: {
        label: 'label',
        value: 'label',
        children: 'children'
      },
      markList: [],
      mapInstance: null,
      showRightModal: false,
      areaValue: '',
      multiIndex: [0, 0],
      isFilter: false, //是否根据条件过滤
      multiArray: [[], []],
      areaList: [
        {
          label: '凤翔县',
          children: [
            {
              label: '田家庄派出所',
              value: '田家庄派出所'
            },
            {
              label: '横水派出所',
              value: '横水派出所'
            },
            {
              label: '石家营派出所',
              value: '石家营派出所'
            }
          ]
        },
        {
          label: '太白县',
          children: [
            {
              label: '桃川派出所',
              value: '桃川派出所'
            },
            {
              label: '王家堎派出所',
              value: '王家堎派出所'
            },
            {
              label: '鹦鸽派出所',
              value: '鹦鸽派出所'
            }
          ]
        },
        {
          label: '眉县',
          children: [
            {
              label: '常青派出所',
              value: '常青派出所'
            },
            {
              label: '汤峪派出所',
              value: '汤峪派出所'
            },
            {
              label: '营头派出所',
              value: '营头派出所'
            }
          ]
        },
        {
          label: '金台区',
          children: [
            {
              label: '中山西路派出所',
              value: '中山西路派出所'
            },
            {
              label: '中山东路派出所',
              value: '中山东路派出所'
            },
            {
              label: '长寿派出所',
              value: '长寿派出所'
            }
          ]
        },
        {
          label: '陈仓区',
          children: [
            {
              label: '贾村派出所',
              value: '贾村派出所'
            },
            {
              label: '杨家沟派出所',
              value: '杨家沟派出所'
            },
            {
              label: '阳平派出所',
              value: '阳平派出所'
            }
          ]
        }
      ]
    };
  },
  computed: {
    areaName() {
      let val = this.pickerVal[1];
      val = this.isFilter ? val : '宝鸡市';
      return val;
    }
  },
  methods: {
    cancelChange() {
      this.isFilter = false;
      this.getMarks().then(marks => {
        if (marks && Array.isArray(marks)) {
          if (marks.length === 0) {
            console.log(this.markList);
            this.mapInstance.remove(this.markList);
          } else {
            this.initMap(marks);
          }
        }
      });
    },
    MultiChange(e) {
      this.isFilter = true;
      let cond = [{ colName: 'pchs', ruleType: 'like', value: e.value[1] }];
      this.getMarks(cond).then(marks => {
        if (marks && Array.isArray(marks)) {
          if (marks.length === 0) {
            console.log(this.markList);
            this.mapInstance.remove(this.markList);
          } else {
            this.initMap(marks);
          }
        }
      });
    },
    changeArea() {
      // 切换区域
      let area = this.areaValue;
      let condition = [{ colName: 'lat', ruleType: 'like', value: '107' }];
      this.getMarks(condition).then(marks => {
        if (marks && Array.isArray(marks)) {
          if (marks.length === 0) {
            console.log(this.markList);
            this.mapInstance.remove(this.markList);
          } else {
            this.initMap(marks);
          }
          this.showRightModal = false;
          this.areaValue = null;
        }
      });
    },
    async getAreaGroup() {
      let self = this;
      let url = this.getServiceUrl('daq', 'srvdaq_jws_info_select', 'select');
      let req = {
        serviceName: 'srvdaq_jws_info_select',
        colNames: ['*'],
        group: [
          {
            colName: 'region',
            type: 'by'
          },
          {
            colName: 'pchs',
            type: 'by'
          }
        ],
        order: []
      };
      // let res = await this.$http.post(url, req);
    },
    radioChange(e) {
      console.log(e);
      if (e.detail.value) {
        this.areaValue = e.detail.value;
      }
    },
    showModal(e) {
      this.showRightModal = !this.showRightModal;
      this.getAreaGroup();
    },
    hideModal() {
      this.getMarks().then(marks => {
        if (marks && Array.isArray(marks) && marks.length > 0) {
          this.initMap(marks);
        }
      });
      this.showRightModal = false;
      this.areaValue = null;
    },
    async getMarks(cond) {
      let self = this;
      let url = this.getServiceUrl('daq', 'srvdaq_jws_info_select', 'select');
      let req = { serviceName: 'srvdaq_jws_info_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 10 }, order: [] };
      if (cond && Array.isArray(cond) && cond.length > 0) {
        req.condition = cond;
      }
      let res = await this.$http.post(url, req);
      if (res.data.state == 'SUCCESS') {
        let marks = res.data.data;
        marks = marks.map((item, index) => {
          // item['icon'] = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png';
          item['icon'] = require('@/static/img/map/icon_police_room_s.png');
          item['position'] = [item.lon, item.lat];
          item['content'] = `<div class="info-card" style="font-weight:600;">${item.name} </div>`;
          return item;
        });
        if (marks.length > 0) {
          this.markList = marks;
        }
        return marks;
      }
    },
    initMap(markers) {
      const self = this;
      this.mapInstance = new AMap.Map('container', {
        resizeEnable: true,
        center: markers[0].position,
        zoom: 16
      });
      this.mapInstance.clearMap(markers); // 清除地图覆盖物
      // 添加标记
      markers = markers.map((item, index) => {
        var marker = new AMap.Marker({
          map: self.mapInstance,
          anchor: 'a',
          icon: item.icon,
          position: [item.position[0], item.position[1]],
          offset: new AMap.Pixel(-13, -30)
        });
        let title = item.name;
        let content = [];
        // console.log('item', item);
        // content.push(`派出所:${item.pchs}`);
        // content.push(`地址:${item.addr}`);
        // content.push(`地区:${item.region}`);
        marker.content = createInfoWindow(title, content.join('<br/>'), item);
        //  var markerContent = document.createElement('div');

        //  marker.setContent(markerContent); //更新点标记内容
        marker.setLabel({
          offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
          content: `<div class='info'>${item.name}</div>`, //设置文本标注内容
          direction: 'bottom' //设置文本标注方位
        });
        marker.on('click', clickMarker);
        marker.emit('click', { target: Object.assign(marker, item) });
        return marker;
        // marker.emit('click', { target: marker });
      });
      this.markList = markers;
      function clickMarker(e) {
        //标记点击事件
        if (e.lnglat && e.target.jws_no) {
          uni.navigateTo({
            url: 'mapDetail/mapDetail?jws_no=' + e.target.jws_no
            // url: 'mapDetail/mapDetail?mapData=' + decodeURIComponent(JSON.stringify(item))+'&jws_no='+item.jws_no
          });
        }
        // const infoWindow = new AMap.InfoWindow({
        //   //实例化信息窗体
        //   isCustom: true, //使用自定义窗体
        //   // content: 'aaa',
        //   offset: new AMap.Pixel(16, -25)
        // });
        // // infoWindow.setContent(e.target.content);
        // infoWindow.open(self.mapInstance, e.target.getPosition());
      }
      //构建自定义信息窗体
      function createInfoWindow(title, content, item) {
        var info = document.createElement('div');
        info.className = 'info-card';
        info.style = 'font-weight:700; border-radius:10px;padding:20px; position: relative;width: 80%;min-width: 200upx;height: 200upx;background:#fff';
        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        // var top = document.createElement('div');
        // var titleD = document.createElement('div');
        // top.className = 'info-top';
        // titleD.innerHTML = title;
        // top.appendChild(titleD);
        // info.appendChild(top);
        // 定义中部内容
        // var middle = document.createElement('div');
        // middle.className = 'info-middle';
        // middle.style.backgroundColor = 'white';
        // // middle.innerHTML = content;
        // info.appendChild(middle);

        // 定义底部内容
        var bottom = document.createElement('div');
        bottom.className = 'info-bottom';
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        bottom.innerText = '详情';
        bottom.style.fontWeight = '100';
        bottom.style.textDecoration = 'underline';
        bottom.style.color = 'blue';
        bottom.onclick = () => {
          console.log(item);
          uni.navigateTo({
            url: 'mapDetail/mapDetail?mapData=' + item.jws_no
            // url: 'mapDetail/mapDetail?mapData=' + decodeURIComponent(JSON.stringify(item))+'&jws_no='+item.jws_no
          });
        };
        info.appendChild(bottom);
        return info;
      }
      var center = self.mapInstance.getCenter();
      self.mapInstance.setFitView();
    }
  },
  created() {
    var url = 'https://webapi.amap.com/maps?v=1.4.15&key=66d553508408ed7a1b83dfe5c265ec2d';
    var jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
  },
  mounted() {
    if (this.areaList.length > 0) {
      let multiArray = [this.areaList.map(item => item.region), this.areaList[0].children.map(item => item.label)];
      this.multiArray = multiArray;
    }
    setTimeout(() => {
      this.getAreaGroup();
      this.getMarks().then(marks => {
        if (marks && Array.isArray(marks) && marks.length > 0) {
          this.initMap(marks);
        }
      });
    }, 100);
  }
};
</script>

<style lang="scss" scoped>
// @import '/static/css/amap.css';

html,
body {
  height: 100%;
  width: 100%;
}
.amap-wrap {
  #container {
    height: 100vh;
    // height: calc(100% - 100upx);
    width: 100%;
    /deep/ .amap-marker-label {
      border: none;
      background-color: rgba($color: #000000, $alpha: 0);
      color: #333;
      // background: cadetblue;
    }
  }

  .menu-box {
    min-height: 100upx;
    width: 100%;
    font-size: 60upx;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: absolute;
    top: 0px;
    right: 0;
    z-index: 100;
    .area-name {
      font-size: 40upx;
      padding: 10px;
    }
    .area-picker {
      font-size: 40upx;
      background-color: #fff;
      min-width: 100px;
      padding: 10px;
      height: 50px;
      display: flex;
      border-radius: 20upx;
      overflow: hidden;
      border: 1px solid #eee;
      align-items: center;
      justify-content: center;
      margin: 10px;
      box-shadow: 0 10px 35px 0px rgba(0, 0, 0, 0.2);
      // justify-content: space-around;
      .picker {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin-right: 10upx;
      }
    }
    .text {
      font-size: 30upx;
    }
    .button {
      font-size: 30upx;
      line-height: 40upx;
      margin: 0 10px;
      background-color: #fff;
      // // width: 100%;
      // height: 50px;
    }
  }
}

.cu-modal.drawer-modal .cu-dialog {
  min-width: 300px;
}
.cu-modal.bottom-modal.show {
  .cu-dialog {
    height: 300px;
  }
}
.filter-box {
  padding: 20upx;
  .title {
    width: 100%;
    height: 100upx;
    line-height: 100upx;
    color: #333;
    text-indent: 40upx;
  }
  .uni-label-pointer {
    margin-right: 20upx;
  }
  /deep/ uni-radio::before {
    right: 10px;
  }
}
.info-card {
  position: relative;
  width: 80%;
  min-width: 200upx;
  height: 200upx;
}

/deep/.amap-icon img {
  width: 30px;
  height: 34.5px;
}
/deep/ .info {
  color: #333;
  font-weight: bold;
}
.content-window-card {
  position: relative;
  box-shadow: none;
  bottom: 0;
  left: 0;
  width: auto;
  padding: 0;
}

.content-window-card p {
  height: 2rem;
}

.custom-info {
  border: solid 1px silver;
}

div.info-top {
  position: relative;
  background: none repeat scroll 0 0 #f9f9f9;
  border-bottom: 1px solid #ccc;
  border-radius: 5px 5px 0 0;
}

div.info-top div {
  display: inline-block;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 10px;
}

div.info-top img {
  position: absolute;
  top: 10px;
  right: 10px;
  transition-duration: 0.25s;
}

div.info-top img:hover {
  box-shadow: 0px 0px 5px #000;
}

div.info-middle {
  font-size: 12px;
  padding: 10px 6px;
  line-height: 20px;
}

div.info-bottom {
  height: 0px;
  width: 100%;
  clear: both;
  text-align: center;
}

div.info-bottom img {
  position: relative;
  z-index: 104;
}

span {
  margin-left: 5px;
  font-size: 11px;
}

.info-middle img {
  float: left;
  margin-right: 6px;
}
</style>
