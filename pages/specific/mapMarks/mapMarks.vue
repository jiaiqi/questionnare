<template>
  <view class="amap-wrap"><div id="container"></div></view>
</template>
<script>
export default {
  data() {
    return {
      mapConfig: {}
    };
  },
  methods: {
    async getMarks() {
      let self = this;
      let url = this.getServiceUrl('daq', 'srvdaq_jws_info_select', 'select');
      let req = { serviceName: 'srvdaq_jws_info_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 10 }, order: [] };
      let res = await this.$http.post(url, req);
      if (res.data.state == 'SUCCESS') {
        let marks = res.data.data;
        marks = marks.map((item, index) => {
          item['icon'] = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png';
          item['position'] = [item.lon, item.lat];
          item['content'] = `<div class="info-card" style="font-weight:600;">${item.name} </div>`;
          return item;
        });
        this.markList = marks;
        return marks;
      }
    },
    clickMarker(e) {
      //标记点击事件
      const infoWindow = new AMap.InfoWindow({
        //实例化信息窗体
        isCustom: true, //使用自定义窗体
        content: 'aaa',
        offset: new AMap.Pixel(16, -45)
      });
      infoWindow.setContent(e.target.content);
      infoWindow.open(map, e.target.getPosition());
    },
    initMap(markers) {
      const self = this;
      var map = new AMap.Map('container', {
        resizeEnable: true,
        center: markers[0].position,
        zoom: 16
      });
      map.clearMap(markers); // 清除地图覆盖物
      //实例化信息窗体
      var infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: 'aaa',
        offset: new AMap.Pixel(16, -45)
      });
      var layer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: true,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true
      });
      // 添加标记
      markers.forEach((item, index) => {
        var marker = new AMap.Marker({
          map: map,
          anchor:"a",
          icon: item.icon,
          position: [item.position[0], item.position[1]],
          offset: new AMap.Pixel(-13, -30)
        });
        let title = item.name;
        let content = [];
        console.log('item', item);
        // content.push(`派出所:${item.pchs}`);
        // content.push(`地址:${item.addr}`);
        // content.push(`地区:${item.region}`);

        marker.content = createInfoWindow(title, content.join('<br/>'), item);
  marker.setLabel({
        offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
        content: `<div class='info'>${item.name}</div>`, //设置文本标注内容
        direction: 'right' //设置文本标注方位
    });
        marker.on('click', clickMarker);
        marker.emit('click', { target: marker });
      });
      function clickMarker(e) {
        //标记点击事件
        const infoWindow = new AMap.InfoWindow({
          //实例化信息窗体
          isCustom: true, //使用自定义窗体
          content: 'aaa',
          offset: new AMap.Pixel(16, -45)
        });
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
      }
      //构建自定义信息窗体
      function createInfoWindow(title, content, item) {
        var info = document.createElement('div');
        info.className = 'info-card';
        info.style = 'font-weight:700; border-radius:10px;padding:20px; position: relative;width: 80%;min-width: 200upx;height: 200upx;background:#fff';
        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement('div');
        var titleD = document.createElement('div');
        top.className = 'info-top';
        titleD.innerHTML = title;
        top.appendChild(titleD);
        info.appendChild(top);
        // 定义中部内容
        var middle = document.createElement('div');
        middle.className = 'info-middle';
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

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
            url: 'mapDetail/mapDetail?mapData=' + decodeURIComponent(JSON.stringify(item))
          });
        };
        info.appendChild(bottom);
        return info;
      }
      var center = map.getCenter();
      map.setFitView();
    }
  },
  mounted() {
    if (this.$route.query.mapConfig) {
    }
    this.getMarks().then(marks => {
      this.initMap(marks);
    });
  }
};
</script>

<style lang="scss" scoped>
@import '/static/css/amap.css';

.amap-wrap {
  min-height: 100vh;
}
html,
body,
#container {
  height: 100%;
  width: 100%;
}
.info-card {
  position: relative;
  width: 80%;
  min-width: 200upx;
  height: 200upx;
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
