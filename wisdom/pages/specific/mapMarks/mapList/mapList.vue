<template>
  <view><SwiperMenu :menuList="menuList" @clickMenu="clickMenu" :menuTemplate="menuTemplate"></SwiperMenu></view>
</template>

<script>
import SwiperMenu from '@/components/bx-swiper-menu/bx-swiper-menu.vue';
export default {
  components: { SwiperMenu },
  data() {
    return {
      menuList: [],
      menuTemplate:{
        lableCol:'page_name'
      }
    };
  },
  methods: {
    clickMenu(item){
      console.log(item)
      if(item.serviceName){
        uni.navigateTo({
          url:'../mapMarks?mapConfig='+encodeURIComponent(JSON.stringify(item))
        })
      }
    },
    async mapConfig() {
      let url = this.getServiceUrl('daq', 'srvdaq_map_page_config_select', 'select');
      let req = { serviceName: 'srvdaq_map_page_config_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 10 }, order: [] };
      let res = await this.$http.post(url, req);
      if (res.data.state == 'SUCCESS') {
        let menuList = res.data.data.map(item=>{
          item.dest_menu_no = item.page_name
          return item
        })
        this.menuList = [menuList]
      }
    }
  },
  created() {
    this.mapConfig()
  }
};
</script>

<style lang="scss"></style>
