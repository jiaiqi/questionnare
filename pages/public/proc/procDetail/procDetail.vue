<template>
  <view class="proc-wrap">
    <cu-custom bgColor="bg-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">流程步骤</block>
    </cu-custom>
    <scroll-view scroll-x class="bg-white nav ">
      <view class="flex text-center">
        <view class="cu-item flex-sub" :class="index == TabCur ? 'text-orange cur' : ''" v-for="(item, index) in tabList" :key="index" @tap="tabSelect" :data-id="index">
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

    <view class="steps-view" v-if="TabCur === 1">
      <view class="flow-view" v-if="procBasicConfig.proCharData && procBasicConfig.proCharData.length > 0">
        <scroll-view scroll-x class="bg-white  response cu-steps  scroll-view" :scroll-into-view="'scroll-' + scroll" scroll-with-animation>
          <view
            class="cu-item padding-lr-xl"
            :class="{ 'text-green': index < scroll, 'text-blue': index === scroll }"
            v-for="(item, index) in procBasicConfig.proCharData"
            :key="index"
            :id="'scroll-' + index"
            @click="clickSteps({ data: item, index: index })"
          >
            <text class="num" :data-index="index + 1"></text>
            <view class="" style="display: flex;flex-direction: column;">
              <text>{{ item.step_name }}</text>
              <text>[ {{ item.state }} ]</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="step-list">
        <view class="step-list-item" v-for="(item, index) in procBasicConfig.proCharData" :key="index" @click="clickSteps({ data: item, index: index })">
          <view class="title">
            <text class="label">步骤名称：</text>
            <text class="value">{{ item.step_name }}</text>
          </view>
          <view class="status">
            <text class="label">状态：</text>
            <text class="value">{{ item.state }}</text>
          </view>
          <view class="detail" v-if="item._record_data">
            <view class="detail-item">
              <view class="label" v-if="item._record_data.data_status">数据状态：{{ item._record_data.data_status }}</view>
              <view class="value"></view>
            </view>
            <view class="detail-item">
              <view class="label" v-if="item._approval_user">审核人：{{ item._approval_user }}</view>
              <view class="value"></view>
            </view>
            <view class="detail-item">
              <view class="label" v-if="item._record_data.create_user_disp">创建人：{{ item._record_data.create_user_disp }}</view>
              <view class="value"></view>
            </view>

            <view class="detail-item">
              <view class="label">审核时间：{{ item._record_data.modify_time.slice(0, 10) }}</view>
              <view class="value"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="detail-view" v-else-if="TabCur === 0">
      <view class=" detail-form"><bxform ref="bxDetailForm" :pageType="type" :BxformType="type" :fields="fields"></bxform></view>
      <view class=" approval-form"><bxform ref="bxForm" :pageType="type" :BxformType="type" :fields="approvalFormCfg"></bxform></view>
      <button type="primary" v-if="authority">提交审批</button>
    </view>
    <!--    <view class="cu-modal bottom-modal " :class="{ show: showProcApproval }">
      <view class="cu-dialog">
        <view class=" approval-form"><bxform ref="bxForm" :pageType="type" :BxformType="type" :fields="approvalFormCfg"></bxform></view>
        <view class="cu-bar bg-white">
          <view class="action text-green">提交审批</view>
          <view class="action text-blue" @tap="hideModal">取消</view>
        </view>
      </view>
    </view> -->
    <view class="bottom-bar">
      <view class="">
        <text class="text-gray">当前步骤：</text>
        <text class="value text-blue">{{ currentStepInfo.step_name }}</text>
      </view>
      <view class="">
        <text class="text-gray">审批人：</text>
        <text>{{ currentStepInfo._approval_user }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';

export default {
  components: { bxform },
  data() {
    return {
      TabCur: 1,
      scrollLeft: 0,
      tabList: [
        {
          label: '基本信息'
        },
        {
          label: '流程记录'
        }
      ],
      activityData: {},
      proc_instance_no: '',
      userInfo: {},
      scroll: 0,
      type: 'add',
      procBasicConfig: {},
      colsV2Data: {},
      srvInfo: {
        app: '',
        serviceName: 'srvprocess_basic_cfg_select'
      },
      currentStepInfo: {}, //当前步骤的信息
      formInfo: {
        serviceName: '',
        formType: ''
      },
      showProcApproval: false, //是否显示审批表单
      approvalVal: {
        proc_result: '',
        remark: '',
        turn_user_no: '',
        step_no: ''
      },
      fields: [],
      authority: false, //编辑权限
      approvalFormCfg: [
        {
          label: '意见',
          column: 'proc_result',
          value: 'pass',
          type: 'radioFk',
          display: true,
          isRequire: true,
          isShowExp: [],
          options: [
            { value: 'pass', label: '已处理' },
            { value: 'turn', label: '转派' },
            { value: 'return_to_start', label: '退回开始' },
            { value: 'return_to_last', label: '退回' }
          ]
        },
        {
          label: '转派用户',
          column: 'turn_user_no',
          value: '',
          type: 'input',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'proc_result', ruleType: 'eq', value: 'turn' }],
          options: []
        },
        {
          label: '说明',
          column: 'remark',
          value: '',
          type: 'textarea',
          display: true,
          isRequire: true,
          isShowExp: [],
          options: []
        }
      ]
    };
  },
  methods: {
    hideModal() {
      this.showProcApproval = false;
    },
    tabSelect(e) {
      this.TabCur = Number(e.currentTarget.dataset.id);
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
    },
    clickSteps(e) {
      console.log(e);
      this.handleBasicConfig(e.data);
      // this.showProcApproval = true;
      // uni.navigateTo({
      //   url: '../procStepDetail/procStepDetail?stepData=' + encodeURIComponent(JSON.stringify(e.data))
      // });
      // this.scroll = e.index;
    },
    async getBasicCfg(proc_instance_no) {
      // srvprocess_basic_cfg_select 流程初始化数据查询
      let serviceName = this.srvInfo.serviceName;
      let req = { serviceName: 'srvprocess_basic_cfg_select', colNames: ['*'], condition: [{ colName: 'proc_instance_no', ruleType: 'eq', value: proc_instance_no }] };
      let res = await this.onRequest('select', 'srvprocess_basic_cfg_select', req, 'oa');
      if (res.data.state === 'SUCCESS') {
        this.procBasicConfig = res.data;
        this.handleBasicConfig(res.data['proCharData'][res.data.proHanleData.activeStep]);
        this.scroll = res.data.proHanleData.activeStep;
      }
    },
    handleBasicConfig(e) {
      if (e&&e.state!=="未开始") {
        this.currentStepInfo = e;
        this.authority = e.authority;
        if (!this.authority) {
          this.approvalFormCfg.map(item => {
            item.disabled = true;
          });
        }
        console.log('handleBasicConfig', e);
        if (e.biz_cfg_data && e.biz_cfg_data.length > 0) {
          const biz_cfg = e.biz_cfg_data;
          biz_cfg.map(item => {
            if (item._type_form) {
              this.formInfo.formType = item._type_form;
              this.type = item._type_form;
              this.formInfo.serviceName = item[`${item._type_form}_service`];
              this.getColV2(this.formInfo.serviceName, item._type_form).then(() => {
                this.TabCur = 0;
              });
              // this.approvalFormCfg[0].options = [];
            }
          });
        }
      }
    },
    onApproval(value, disabled) {
      let self = this;
      console.log(value);
      if (!this.disabled) {
        if (value === 'return') {
          let step = self.procBasicConfig.proHanleData.return_options;
          if (step.length === 1) {
            self.approvalVal.step_no = step[0].value;
          }
          console.log('step', step);
        } else if (value !== 'turn') {
          this.approvalVal.turn_user_no = '';
        } else if (value !== 'return') {
          this.approvalVal.step_no = '';
        }
      }
    },
    approval() {
      // 提交审批
      let self = this;
      let CallbackGo = function(response) {
        if (response.data.state === 'SUCCESS') {
          self.showProcApproval = false;
          // self.broadcast('xChildDetail', 'refresh', true)
          // self.getProcBasic()
          // self.getData()
          // self.$vux.toast.show({
          //   type: 'text',
          //   text: response.data.resultMessage
          // })
          // self.handler()
          self.approvalVal = {
            proc_result: '',
            remark: '',
            turn_user_no: '',
            step_no: ''
          };
          console.log(response.data.data, response.data);
        } else {
          // self.$vux.toast.show({
          //   type: 'text',
          //   text: response.data.resultMessage
          // })
        }
      };
      let reqs = [];
      let req = {
        proc_instance_no: this.$route.params.proc_instance_no,
        step_no: this.procBasicConfig.proHanleData.step_no,
        data: []
      };
      let obj = self.approvalVal;
      let a;
      for (a in obj) {
        if (obj[a] === '') {
          delete obj[a];
        }
      }
      let len = Object.keys(obj);
      if (len.length > 0) {
        req.data.push(obj);
        if (self.approvalVal.proc_result === 'pass' && self.stepForm.length > 0) {
          let childDataList = [];
          let d = {
            serviceName: 'srvvx_task_review_update',
            condition: []
          };
          let data = self.stepForm;
          let ds = {};
          for (let p = 0; p < data.length; p++) {
            if (data[p].column !== null && data[p].column !== undefined) {
              ds[data[p].columns] = data[p].column;
            }
          }
          let c = {
            colName: 'id',
            ruleType: 'in',
            value: ds.id
          };
          let cdata = this.deepClone(ds);
          // delete cdata.id
          if (self.procBasicConfig.proHanleData.authority === true) {
            cdata.review_user = self.procBasicConfig.proHanleData._approval_user_no;
          }
          let keys = Object.keys(cdata);
          if (keys.length >= 5) {
            d.data = [cdata];
            d.condition.push(c);
            childDataList.push(d);
            let procdata = req.data[0];
            procdata['child_data_list'] = childDataList;
            // reqs[0].data[0]['child_data_list'] = childDataList
            reqs.push(req);
            console.log(reqs);
            // self.crosAjaxData(self.$api.approval, 'post', reqs, CallbackGo)
          } else {
            // self.$vux.toast.show({
            //   type: 'text',
            //   text: '评审信息不完整'
            // })
          }
        } else {
          reqs.push(req);
          // this.crosAjaxData(self.$api.approval, 'post', reqs, CallbackGo)
        }
      } else {
        // self.$vux.toast.show({
        //   type: 'text',
        //   text: '请填写审批意见'
        // })
      }
    },
    async getColV2(serviceName, type) {
      let colVs = await this.getServiceV2(serviceName, type, type, 'oa');
      this.colsV2Data = colVs;
      // let type = this.type;
      console.log('colsV2Data', colVs);
      let fields = [];
      switch (type) {
        case 'update':
          fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.activityData);
          break;
        case 'add':
          fields = colVs._fieldInfo;
          break;
        case 'detail':
          fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.activityData);
          break;
        default:
          break;
      }
      console.log('fields:', fields, type);
      if (fields && Array.isArray(fields)) {
        fields = fields.filter((item, index) => {
          if (!item.value) {
            item.value = '';
          }
          if (!this.authority) {
            item.disabled = true;
          }
          if (item['in_' + type] === 1) {
            return item;
          }
        });
        console.log('this.fields ', fields);
        this.fields = fields;
      }
    }
  },
  onLoad(option) {
    if (option.proc_instance_no) {
      this.userInfo = uni.getStorageSync('login_user_info');
      this.proc_instance_no = option.proc_instance_no;
      this.srvInfo.app = uni.getStorageSync('activeApp');
      this.getBasicCfg(option.proc_instance_no);
    }
  }
};
</script>

<style scoped lang="scss">
.proc-wrap {
  // padding-bottom: 150upx;
  // background-color: #fff;
}
.steps-view {
  // margin-top: 100upx;
  padding-bottom: 150upx;
}
.flow-view {
  width: calc(100% - 20upx);
  margin: 10upx auto;
  border-radius: 10upx;
  overflow: hidden;
  .scroll-view {
    padding: 30upx 10upx;
  }
}
.step-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  .step-list-item {
    background-color: #fff;
    width: calc(100% - 20upx);
    display: flex;
    flex-direction: column;
    margin: 10upx;
    padding: 20upx;
    border-radius: 10upx;
    .title {
      font-size: 32upx;
      line-height: 50upx;
      font-weight: bold;
    }
    .detail {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .detail-item {
        min-width: 40%;
      }
    }
  }
}
.detail-view {
  padding-bottom: 150upx;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.approval-form {
  margin-bottom: 30upx;
}
.bottom-bar {
  background-color: #fff;
  z-index: 20;
  width: 100%;
  height: 100upx;
  padding-left: 20upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid rgba($color: #999, $alpha: 0.5);
  position: fixed;
  bottom: 0;
  .text-blue {
    font-weight: bold;
    font-size: 32upx;
  }
}
</style>
