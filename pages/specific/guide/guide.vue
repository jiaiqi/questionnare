<template>
  <view>
    <!-- <view class="amap-wrapper"><el-amap class="amap-box" :vid="'amap-vue'"></el-amap></view> -->
    <div class="amap-page-container">
      <el-amap vid="amap" :zoom="zoom" :center="center" class="amap-demo">
        <el-amap-info-window
          :position="currentWindow.position"
          :content="currentWindow.content"
          :visible="currentWindow.visible"
          :events="currentWindow.events"
        >
        <view class="" style="font-size: 30upx;font-weight: 600;">
          {{currentWindow.content}}
        </view>
        </el-amap-info-window>
        <el-amap-marker
          :key="index"
          v-for="(marker, index) in windows"
          :position="marker.position"
          :events="marker.events"
          :visible="marker.visible"
          :draggable="marker.draggable"
          :vid="index"
        ></el-amap-marker>
      </el-amap>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      markList: [], //坐标合集
      zoom: 14,
      center: [107.2573, 34.360028],
      windows: [],
      slotWindow: {
        position: [121.5163285, 31.21515044]
      },
      currentWindow: {
        position: [0, 0],
        content: '',
        events: {},
        visible: false
      }
    };
  },
  methods: {
    async getMarks() {
      let self =this
      let url = this.getServiceUrl('daq', 'srvdaq_jws_info_select', 'select');
      let req = { serviceName: 'srvdaq_jws_info_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 10 }, order: [] };
      let res = await this.$http.post(url, req);
      if (res.data.state == 'SUCCESS') {
        this.markList = res.data.data;
        let marks = res.data.data;
        let a = {
          name: '新维巷社区 警务室',
          lon: '107.12748',
          jws_no: 'JWS2020040213580009',
          lat: '34.37980'
        };
        marks = marks.map((item,index) => {
          let obj = {
            position: [item.lon, item.lat],
            content: `<div style="font-weight:600;">${item.name} </div>`,
            visible: true,
            events: {
              click: () => {
                self.switchWindow(index)
              },
              close() {
                console.log('close infowindow' + item.name);
              }
            }
          };
          item = obj;
          return item;
        });
        console.log('marks', marks);
        this.windows = marks;
      }
    },
    switchWindow(tab) {
      // this.currentWindow.visible = false;
      this.$nextTick(() => {
        this.currentWindow = this.windows[tab];
        this.currentWindow.visible = true;
      });
    }
  },
  mounted() {
    // this.initMap()
    this.getMarks().then(() => {
      this.currentWindow = this.windows[0];
    });
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.amap-wrapper {
  width: 750upx;
  min-height: 100vh;
}
</style>
