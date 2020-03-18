<template>
	<view>
		<bx-list
			ref="bxList"
			:serviceName="serviceName"
			:condition="condition"
			:pageType="pageType"
			:viewTemp="viewTemp"
			:listConfig="listConfig"
			:rownumber="5"
			@click-list-item="clickItem"
			@list-change="listChange"
			@clickFootBtn="clickFootBtn"
		></bx-list>
	</view>
</template>

<script>
  import bxList from '@/components/bx-list/bx-list.vue'
	export default {
    name:'shoppingCart',
    components:{bxList},
		data() {
			return {
				serviceName:'',
        condition:[],
        pageType:'',
        viewTemp:{},
        listConfig:{},
			};
		},
    methods:{
      clickItem(){
        
      },
      listChange(){
        
      },
      clickFootBtn(){
        
      }
    }
	}
</script>

<style lang="scss">

</style>
