<template>
  <view class="proc-wrap">
    <cu-custom bgColor="bg-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">流程详情</block>
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
        <!-- <scroll-view scroll-x class="bg-white  response cu-steps  scroll-view" :scroll-into-view="'scroll-' + scroll" scroll-with-animation> -->
        <!-- <view
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
          </view> -->
        <!-- </scroll-view> -->
        <view class="cu-timeline" v-if="procBasicConfig.proCharData && procBasicConfig.proCharData.length > 0">
          <!-- <view class="cu-time">06-17</view> -->
          <view
            class="cu-item "
            v-for="(item, index) in procBasicConfig.proCharData"
            :key="index"
            @click="clickSteps({ data: item, index: index })"
            :class="{ 'text-green': index < scroll, 'text-blue': index === scroll }"
          >
            <view class="content" :class="{ 'bg-gradual-green': index < scroll, 'bg-blue': index === scroll }">
              <view class="head">
                <view class="name">{{ item.step_name }}</view>
                <view class="state">状态：{{ item.state }}</view>
              </view>
              <view class="state" v-if="item._approval_user">
                责任人：
                <text>{{ item._approval_user }}</text>
              </view>
              <!-- <view class="" v-if="item._record_data" style="display: flex">
                <view style="flex: 1;">数据状态：{{ item._record_data.data_status }}</view>
                <view style="flex: 1;">审批状态：{{ item._record_data.approval_status }}</view>
              </view> -->
              <view class="" v-if="item._record_data">
                <text class="margin-right-xs">处理时间：</text>
                {{ item._record_data.create_time }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="detail-view" v-else-if="TabCur === 0">
      <view class="detail-form"><bxform ref="bxDetailForm" :pageType="type" :BxformType="type" :fields="fields"></bxform></view>
    </view>
    <view class="step-list" v-else-if="TabCur === 2">
      <view class="step-list-item" v-for="(item, index) in procRecord" :key="index" @click="toRecordDetail(item)">
        <view class="title">
          <text class="label">步骤名称：</text>
          <text class="value">{{ item.step_no_name }}</text>
        </view>
        <view class="status">
          <text class="label">处理结果：</text>
          <text class="value">{{ item.proc_result }}</text>
        </view>
        <view class="detail">
          <view class="detail-item">
            <view class="label" v-if="item.data_status">数据状态：{{ item.data_status }}</view>
            <view class="value"></view>
          </view>
          <view class="detail-item">
            <view class="label" v-if="item.create_user">审核人：{{ item.create_user }}</view>
            <view class="value"></view>
          </view>
          <view class="detail-item">
            <view class="label" v-if="item.create_user">创建人：{{ item.create_user }}</view>
            <view class="value"></view>
          </view>

          <view class="detail-item">
            <view class="label">审核时间：{{ item.modify_time.slice(0, 10) }}</view>
            <view class="value"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="" style="flex: 1;">
        <view class="">
          <text class="text-gray">当前步骤：</text>
          <text class="value text-blue">{{ currentStepInfo.step_name }}</text>
        </view>
        <view class="">
          <text class="text-gray">审批人：</text>
          <text>{{ currentStepInfo._approval_user }}</text>
        </view>
      </view>
      <view class="" v-if="procBasicConfig.proHanleData && procBasicConfig.proHanleData.authority">
        <text class="cu-btn bg-blue margin-right" v-if="procBasicConfig.proHanleData.activeStep !== 0" @click="showApprovalForm">审批</text>
        <text class="cu-btn bg-blue margin-right" v-if="procBasicConfig.proHanleData.activeStep === 0" @click="showApprovalForm">申请</text>
      </view>
    </view>
    <uni-popup ref="approvalPopup" type="bottom">
      <view class="form-view">
        <view class="" style="width: 100%;" v-for="(item, index) in stepsCfgData" :key="index">
          <bxform :ref="'bxFormStep' + index" :pageType="item.formType" :BxformType="item.formType" :fields="item.fields"></bxform>
        </view>
        <bxform v-if="procBasicConfig.proHanleData.activeStep !== 0" ref="approvalForm" :pageType="'add'" :BxformType="'add'" :fields="approvalFormCfg"></bxform>
        <view class="button-box"><text class="cu-btn bg-blue" @click="approvalForm">提交</text></view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
  components: { bxform, uniPopup },
  data() {
    return {
      TabCur: 1,
      scrollLeft: 0,
      tabList: [
        {
          label: '基本信息'
        },
        {
          label: '流程步骤'
        },
        {
          label: '流程审批记录'
        }
      ],
      activityData: {},
      proc_instance_no: '',
      scroll: 0,
      type: 'add',
      procRecord: [],
      procBasicConfig: {},
      colsV2Data: {},
      srvInfo: {
        app: '',
        serviceName: 'srvprocess_basic_cfg_select'
      },
      currentStepInfo: {}, //当前步骤的信息
      stepsCfgData: [], //当前步骤表单数据
      firstStepInfo: {}, //基础信息
      firstStepForm: [],
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
      currentStepFields: [], //当前步骤的字段
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
          srvInfo: {
            serviceName: 'srvsso_user_select',
            appNo: 'sso',
            isTree: false,
            column: 'user_no',
            showCol: 'real_name' //要展示的字段
          },
          option_list_v2: {},
          type: 'cascader',
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
          isRequire: false,
          isShowExp: [{ colName: 'proc_result', ruleType: 'eq', value: 'pass' }],
          options: []
        },
        {
          label: '说明',
          column: 'remark',
          value: '',
          type: 'textarea',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'proc_result', ruleType: 'neq', value: 'pass' }],
          options: []
        }
      ]
    };
  },
  computed: {
    remarkRun: function() {
      if (true) {
        return '';
      }
    }
  },
  methods: {
    tabSelect(e) {
      this.TabCur = Number(e.currentTarget.dataset.id);
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
    },
    toRecordDetail(data) {
      //查看流程审批记录详情
    },
    hideApprovalForm() {
      // this.showProcApproval = false;
      this.$refs.approvalPopup.close();
    },
    showApprovalForm() {
      this.$refs.approvalPopup.open();
    },
    clickSteps(e) {
      console.log('clickSteps', e);
    },
    async getBasicCfg(proc_instance_no) {
      // srvprocess_basic_cfg_select 流程初始化数据查询
      let serviceName = this.srvInfo.serviceName;
      let req = { serviceName: 'srvprocess_basic_cfg_select', colNames: ['*'], condition: [{ colName: 'proc_instance_no', ruleType: 'eq', value: proc_instance_no }] };
      let res = await this.onRequest('select', 'srvprocess_basic_cfg_select', req, 'oa');
      if (res.data.state === 'SUCCESS') {
        this.procBasicConfig = res.data;
        this.activityData = res.data.mainData;
        this.getCurStepConfig(res.data['proCharData'][res.data['proHanleData']['activeStep']]);
        this.getApprovalForm(res.data['proCharData'][res.data['proHanleData']['activeStep']]); //获取当前步骤的信息
        this.getCurStepConfig(res.data['proCharData'][0], 'firstStep'); //获取第一步信息
        this.currentStepInfo = res.data['proCharData'][res.data['proHanleData']['activeStep']];
        this.firstStepInfo = res.data['proCharData'][0];
        this.scroll = res.data.proHanleData.activeStep;
      }
    },
    async getApprovalForm(e) {
      console.log('getApprovalForm', e);
      let cfg = e.biz_cfg_data; //表单配置
      let cfgData = [
        {
          type: '',
          serviceName: '',
          fields: [],
          formData: {}
        }
      ];
      if (cfg && cfg.length > 0) {
        for (let i = 0; i < cfg.length; i++) {
          const item = cfg[i];
          if (item.type === 'form') {
            if (item._type_form) {
              let serviceName = item[`${item._type_form}_service`];
              let type = item._type_form;
              let fields = await this.getColV2(serviceName, item._type_form);
              cfg[i]['fields'] = fields;
              cfg[i]['formType'] = type;
              console.log('fields111111', fields);
              // .then(fields=>{
              //    cfgData[i][fields] = fields
              //    console.log('fields',fields)
              //    this.stepsCfgData = cfgData
              //  })
            }
          }
        }
        this.stepsCfgData = cfg;
      }
    },
    async getProcRecord() {
      //查找流程审批记录
      let req = {
        serviceName: 'srvprocess_record_select',
        colNames: ['*'],
        condition: [{ colName: 'proc_instance_no', value: this.proc_instance_no, ruleType: 'eq' }],
        order: [{ colName: 'id', orderType: 'desc' }]
      };
      let res = await this.onRequest('select', 'srvprocess_record_select', req, 'oa');
      if (res.data.state === 'SUCCESS') {
        this.procRecord = res.data.data;
      }
    },
    async getDetail(e, type) {
      console.log('getDetail', e);
      let col = this.fields.map(item => item.column);
      let req = {
        serviceName: type && type === 'firstStep' ? e.select_service : '',
        condition: [{ colName: 'proc_instance_no', ruleType: 'eq', value: this.proc_instance_no }],
        colNames: col,
        hisVer: true
      };
      let res = await this.onRequest('select', req.serviceName, req, 'oa');
      if (res.data.state === 'SUCCESS') {
        console.log('getDetail111', res.data.data);
        if (res.data.data.length > 0) {
          this.firstStepForm.push(res.data.data[0]);
          Object.keys(res.data.data[0]).forEach(key => {
            this.fields.forEach((field, index) => {
              if (field.column === key) {
                field['value'] = res.data.data[0][key];
                this.$set(this.fields, index, field);
              }
            });
          });
        }
      }
    },
    getCurStepConfig(e, type) {
      if (e && e.state !== '未开始') {
        console.log('getCurStepConfig', e);
        if (e.biz_cfg_data && e.biz_cfg_data.length > 0) {
          const biz_cfg = e.biz_cfg_data;
          biz_cfg.map(item => {
            if (item._type_form) {
              this.formInfo.formType = item._type_form;
              this.type = item._type_form;
              this.formInfo.serviceName = item[`${item._type_form}_service`];
              this.getColV2(this.formInfo.serviceName, item._type_form).then(fields => {
                if (type === 'firstStep') {
                  this.fields = fields;
                  Object.keys(this.procBasicConfig.mainData).forEach(key => {
                    this.fields.forEach((field, index) => {
                      if (field.column === key) {
                        field['value'] = this.procBasicConfig.mainData[key];
                        this.$set(this.fields, index, field);
                      }
                    });
                  });
                } else {
                  this.currentStepFields = fields;
                }
              });
            } else if (item.select_service) {
              this.formInfo.formType = 'detail';
              this.type = 'detail';
              this.formInfo.serviceName = item.select_service;
              this.getColV2(this.formInfo.serviceName, this.type).then(fields => {
                if (type === 'firstStep') {
                  this.fields = fields;
                  Object.keys(this.procBasicConfig.mainData).forEach(key => {
                    this.fields.forEach((field, index) => {
                      if (field.column === key) {
                        field['value'] = this.procBasicConfig.mainData[key];
                        this.$set(this.fields, index, field);
                      }
                    });
                  });
                  // this.getDetail(item, 'firstStep');
                  // this.TabCur = 0
                } else {
                  this.currentStepFields = fields;
                }
              });
            }
          });
        }
      }
    },
    approvalForm() {
      // 提交审批
      let self = this;
      if (this.procBasicConfig.proHanleData.activeStep === 0) {
        //重新申请
        for (let i = 0; i < this.stepsCfgData.length; i++) {
          let ref = 'bxFormStep' + i;
          let item = this.stepsCfgData[i];
          if (item.formType) {
            let serviceName = item[`${item.formType}_service`];
            let itemData = self.$refs[ref][0].getFieldModel();
            if (!itemData) {
              itemData = this.activityData;
            }
            let req = [
              {
                serviceName: 'srvoa_issue_info_update',
                condition: [{ colName: 'proc_instance_no', ruleType: 'eq', value: this.proc_instance_no }],
                proc_instance_no: this.proc_instance_no,
                data: [itemData]
              }
            ];
            this.onRequest('apply', serviceName, req, 'oa').then(res => {
              if (res.data.state === 'SUCCESS') {
                console.log(res.data, 'res.data');
                uni.showToast({
                  title: res.data.resultMessage,
                  icon: 'none'
                });

                uni.showModal({
                  title: '提示',
                  content: res.data.resultMessage,
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      self.hideApprovalForm();
                      self.getBasicCfg(self.proc_instance_no);
                      self.getProcRecord(self.proc_instance_no);
                    }
                  }
                });
              }
            });
          }
        }
      } else {
        let approval = self.$refs.approvalForm.getFieldModel();
        console.log('approval', approval);
        let child_data_list = [];
        let id = this.procBasicConfig.mainData.id;
        let stepsCfgData = this.stepsCfgData;
        // if(approval.proc_result==='turn'){

        // }else if(approval.proc_result==='return_to_last'){

        // }else if(approval.proc_result==='return_to_start'){

        // }else
        if (approval.proc_result === 'pass') {
          for (let i = 0; i < this.stepsCfgData.length; i++) {
            let ref = 'bxFormStep' + i;
            let item = this.stepsCfgData[i];
            if (item.formType) {
              let serviceName = item[`${item.formType}_service`];
              let obj = {
                serviceName: item[`${item.formType}_service`],
                data: [self.$refs[ref][0].getFieldModel()],
                condition: [
                  {
                    colName: 'id',
                    ruleType: 'in',
                    value: self.procBasicConfig.mainData.id
                  }
                ]
              };
              child_data_list.push(obj);
            }
          }
        }
        if (this.procBasicConfig.proHanleData.activeStep === 1) {
          child_data_list = [];
        }
        console.log(child_data_list, 'child_data_list');
        let reqData = [
          {
            data: [
              {
                child_data_list: child_data_list,
                key: approval.proc_result,
                proc_result: approval.proc_result,
                remark: approval.remark,
                turn_user_no: approval.turn_user_no
              }
            ],
            proc_instance_no: self.proc_instance_no,
            step_no: self.currentStepInfo.step_no
          }
        ];
        let url = this.getServiceUrl('oa', 'approval', 'process');
        self.onRequest('process', 'approval', reqData, 'oa').then(res => {
          if (res.data.state === 'SUCCESS') {
            console.log(res.data);
            uni.showToast({
              title: res.data.resultMessage,
              icon: 'none'
            });
          }
          this.hideApprovalForm();
          this.getBasicCfg(this.proc_instance_no);
          this.getProcRecord(this.proc_instance_no);
        });
        console.log(`reqData`, reqData);
      }
    },
    async getColV2(serviceName, type) {
      let colVs = await this.getServiceV2(serviceName, type, type, 'oa');
      this.colsV2Data = colVs;
      // let type = this.type;
      console.log('colsV2Data', colVs);
      let fields = [];
      switch (type) {
        // case 'update':
        //   fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.activityData);
        //   break;
        case 'update':
          fields = colVs._fieldInfo;
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
      if (this.procBasicConfig.proHanleData.activeStep === 0 && type == 'update') {
        fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.activityData);
      }
      if (fields && Array.isArray(fields)) {
        fields = fields.filter((item, index) => {
          if (!item.value) {
            item.value = '';
          }
          // if (item.type === 'Note') {
          //   item.type = 'textarea';
          // }
          // if (!this.authority) {
          //   item.disabled = true;
          // }
          // if (item['in_' + type] === 1) {
          return item;
          // }
        });

        // this.fields = fields;
      }
      console.log('colsV2Datafields', fields);
      return fields;
    }
  },
  onLoad(option) {
    if (option.proc_instance_no) {
      this.proc_instance_no = option.proc_instance_no;
      this.srvInfo.app = uni.getStorageSync('activeApp');
      this.getBasicCfg(option.proc_instance_no);
      this.getProcRecord(option.proc_instance_no);
    }
  }
};
</script>

<style scoped lang="scss">
.proc-wrap {
  padding-bottom: 150upx;
  // padding-top: 100upx;
  // background-color: #fff;
  position: relative;
  .scroll-fixed {
    top: 90upx;
    z-index: 1024;
    position: fixed;
  }
  .uni-popup {
    z-index: 999;
  }
}
.steps-view {
  // margin-top: 100upx;
  // padding-bottom: 150upx;
}
.flow-view {
  width: 100%;
  // min-height: 80vh;
  margin-top: 10upx;
  background-color: #fff;
  overflow: hidden;
  .scroll-view {
    padding: 30upx 10upx;
  }
  .cu-timeline {
    .cu-item {
        padding: 5px 15px 5px 54px;
        position: relative;
        display: block;
        z-index: 0;
    }
    .head {
      display: flex;
    }
    .name {
      flex: 1;
      font-size: 34upx;
      line-height: 60upx;
      font-weight: 700;
    }
    .state {
      flex: 1;
      font-size: 30upx;
      line-height: 60upx;
    }
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
  margin-top: 10upx;
  padding-bottom: 150upx;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.cu-dialog {
  height: auto;
}
.form-view {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(100vh - 100px);
  overflow-y: scroll;
  .button-box {
    height: 100upx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20upx 0 40upx;
  }
  .cu-btn {
    width: 60%;
    height: 60upx;
  }
}
.bottom-bar {
  background-color: #fff;
  z-index: 20;
  width: 100%;
  height: 100upx;
  padding-left: 20upx;
  display: flex;
  // flex-direction: column;
  // justify-content: center;
  align-items: center;
  border-top: 1px solid rgba($color: #999, $alpha: 0.5);
  position: fixed;
  bottom: 0;
  .text-blue {
    font-weight: bold;
    font-size: 32upx;
  }
}
</style>
