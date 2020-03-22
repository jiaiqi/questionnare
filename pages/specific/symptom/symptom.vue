<template>
  <view class="symptom">
	  <cu-custom bgColor="bg-gradual-green" :isBack="true"><block slot="backText">返回</block><block slot="content">疾病自检</block></cu-custom>
    <!-- <treeGrid :treeData="appMenu" :childNodeCol="'_childNode'" :disColName="'name'" :nodeKey="'no'" @on-tree-grid-change="onTreeGridChange" @on-tree-lastcode="onMenu"></treeGrid> -->
   <!-- <treeSelector
      :srvInfo="srvInfo"
      :treeData="appMenu"
      :childNodeCol="'_childNode'"
      :disColName="'name'"
      :nodeKey="'no'"
      @clickParentNode="onTreeGridChange"
      @clickLastNode="onMenu"
    ></treeSelector> -->
	<MultilevelMenu :menuList="appMenu"></MultilevelMenu>
  </view>
</template>

<script>
// import treeSelector from '@/components/tree-selector/tree-selector.vue';
import MultilevelMenu from '@/components/MultilevelMenu/MultilevelMenu.vue'
export default {
  name: 'symptom', //自检症状
  // components: {treeSelector },
  components:{MultilevelMenu},
  data() {
    return {
      appMenu: [],
      srvInfo: {
        serviceName: 'srvhealth_self_symptoms_select',
        appNo: 'health'
      },
      defaultLineVal: ''
    };
  },
  methods: {
    getCascaderValue() {},
    getAllNode() {},
    getAppMenu() {
      let self = this;
      let req = {
        serviceName: 'srvhealth_self_symptoms_select',
        colNames: ['*']
        // condition: [{ colName: 'parent_no', ruleType: 'isnull' }]
      };
      self.onRequest('select', 'srvhealth_self_symptoms_select', req, 'health').then(res => {
        console.log('appmenu1', res);
        if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
          // self.appMenu = self.arraySort(res.data.data, 'app_seq');
          self.appMenu = res.data.data;
          self.appMenu = self.treeReform(res.data.data, 'parent_no', 'no');
          self.appMenu = self.appMenu.map((item, index) => {
            let a = {
              title: '',
              name: '',
              icon: '',
              seq: '',
              link: '',
              type: 'button',
              _childNode: ''
            };
            a.title = item.name;
            a.name = item.remark;
            a._childNode = item._childNode;
            a.no = item.no;
            a.parent_no = item.parent_no;
            // a.icon = item.app_icon;
            // a.seq = item.app_seq;
            // a.class_no = item.class_no;
            // a.class_name = item.class_name;
            // a.link = item.class_name
            // a.type = item.class_name
            return a;
          });
        }
      });
      console.log('appmenu2', this.appMenu);
    },
    onTreeGridChange(e) {
      console.log('onTreeGridChange', e);
    },
    onMenu(e) {
      // if (this.isInvalid(e.item.service_name)) {
      //   let viewTemp = e.item.app_temp_col_map;
      //   if (this.isInvalid(e.item.app_temp_col_map)) {
      //   }
      //   uni.navigateTo({
      //     url: '/pages/public/list/list?serviceName=' + e.item.service_name + '&pageType=list' + (this.isInvalid(e.item.app_temp_col_map) ? '&viewTemp=' + viewTemp : '')
      //   });
      // } else {
      //   uni.showToast({
      //     title: '无效服务'
      //   });
      // }
      console.log('onMenu', e);
      if (e.item.name && e.item.no) {
        // 跳转到疾病对照页面
        uni.navigateTo({
          url: `/pages/specific/illnessContrast/illnessContrast?name=${e.item.name}&no=${e.item.no}`
        });
      }
    }
  },
  created() {
    uni.setNavigationBarTitle({
      title: '自检症状'
    });
    this.getAppMenu();
  },
  onShow() {
    this.getAppMenu();
  }
};
</script>

<style lang="scss">
.symptom {
  padding-top: 50upx;
  height: 100vh;
  background-color: #fff;
}
.cascader {
}
</style>
