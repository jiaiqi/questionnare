<template>
  <view>
    <TabList
     v-if="pageItem.cate_no"
      @clickListItem="clickListItem"
      :pageItem="pageItem"
      onlyList
      :srvApp="tabListConfig['srvApp']"
      :contentService="tabListConfig['contentService']"
      :cateService="tabListConfig['cateService']"
      :contentTemplate="tabListConfig['contentTemplate']"
    ></TabList>
  </view>
</template>

<script>
import TabList from '@/components/bx-tablist/bx-tablist.vue';
export default {
  components: { TabList },
  data() {
    return {
      pageItem:{cate_no:''},
      tabListConfig: {
        srvApp: 'daq',
        contentService: 'srvdaq_cms_content_select',
        cateService: 'srvdaq_page_item_tablist_select',
        contentTemplate: {
          imgCol: 'icon_image',
          titleCol: 'title',
          dateCol: 'create_time'
        }
      }
    };
  },
  methods: {
    clickListItem() {}
  },
  onLoad(option) {
    if(option.cate_no){
      this.pageItem['cate_no'] = option.cate_no
    }
  }
};
</script>

<style lang="scss"></style>
