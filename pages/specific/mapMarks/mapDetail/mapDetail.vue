<template>
	<view>
    <iframe style="width: 750upx;height: calc(100vh - 100px);" :src="`https://m.amap.com/navi/?dest=${mapData.position[0]},${mapData.position[1]}&destName=${mapData.name}&hideRouteIcon=1&key=d2bd7dceab6e3a017102afb7e87fbaa9`" frameborder="0"></iframe>
		<view class="map-card">
		  
		<view class="title">
		  {{mapData.name}}
		</view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mapData:{}
			}
		},
		methods: {
			
		},
    mounted() {
      let mapData = this.$route.query.mapData
      if(mapData){
        this.mapData = JSON.parse(decodeURIComponent(mapData))
      }
    },
    onLoad() {
      
    }
	}
</script>

<style lang="scss" scoped>
  .map-card{
    width: calc(100% - 20upx);
    display: flex;
    justify-content: center;
    background-color: #fff;
    border-radius: 20upx;
    margin: 10upx auto;
    .title{
      font-weight: 700;
      line-height: 100upx;
    }
  }
</style>
