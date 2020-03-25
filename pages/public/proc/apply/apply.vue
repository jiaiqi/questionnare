<template>
  <view>
    <cu-custom bgColor="bg-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content" v-if="serviceV2Data.service_view_name">{{ serviceV2Data.service_view_name }}</block>
      <!-- <block slot="right"><text class="cuIcon-add" style="font-size: 40upx;margin-right: 20upx;" @click="toApply"></text></block> -->
    </cu-custom>
    <view class="form-wrap" v-if="srv_cols.length > 0"><bxform ref="bxForm" :pageType="type" :BxformType="type" :fields="srv_cols"></bxform></view>
  </view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';
export default {
  components: { bxform },
  data() {
    return {
      type: 'add',
      serviceName: '',
      srv_cols: [],
      procBasicConfig: {},
      serviceV2Data: {}
    };
  },
  methods: {
    valueChange() {},
    async getBasicCfg() {
      // srvprocess_basic_cfg_select 流程初始化数据查询
      let serviceName = this.serviceName;
      let req = { serviceName: 'srvprocess_basic_cfg_select', colNames: ['*'], condition: [{ colName: 'service_name', ruleType: 'eq', value: serviceName }] };
      let res = await this.onRequest('select', 'srvprocess_basic_cfg_select', req, 'oa');
      if (res.data.state === 'SUCCESS') {
        this.procBasicConfig = res.data;
      }
    },
    async getColV2() {
      let serviceName = this.serviceName;
      let req = {
        serviceName: 'srvsys_service_columnex_v2_select',
        colNames: ['*'],
        condition: [{ colName: 'service_name', value: serviceName, ruleType: 'eq' }, { colName: 'use_type', value: 'add', ruleType: 'eq' }],
        order: [{ colName: 'seq', orderType: 'asc' }]
      };
      let res = await this.onRequest('select', 'srvsys_service_columnex_v2_select', req, 'oa');
      if (res.data.state === 'SUCCESS') {
        let data = res.data.data;
        let srv_cols = data.srv_cols;
        srv_cols = srv_cols.filter(item => {
          if (item.in_list === 1) {
            return item;
          }
        });
        this.srv_cols = srv_cols;
        data.srv_cols = srv_cols;
        this.serviceV2Data = data;
      }
    }
  },
  onLoad(option) {
    if (option.serviceName) {
      this.serviceName = option.serviceName;
      this.getBasicCfg();
      this.getColV2();
      // this.listConfig = JSON.parse(decodeURIComponent(decodeURIComponent(option.listConfig)));
    }
  }
};
</script>

<style lang="scss" scoped>
.form-wrap {
  height: calc(100vh - 100upx);
}
</style>
