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
          <view class="cu-item " v-for="(item, index) in procBasicConfig.proCharData" :key="index" :class="{ 'text-green': index < scroll, 'text-blue': index === scroll }">
            <view class="content" :class="{'bg-gradual-green': index < scroll, 'bg-blue': index === scroll}">
              <view class="name">{{ item.step_name }}</view>
              <view class="state">
               状态：{{ item.state }} <text v-if="item._approval_user">({{item._approval_user}})</text>
              </view>
              <view class="user">
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
          label: '流程步骤'
        },
        {
          label: '流程审批记录'
        }
      ],
      activityData: {},
      proc_instance_no: '',
      userInfo: {},
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
      currentStepFields: [],
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
    clickSteps(e) {
      console.log('clickSteps', e);
      if (e.index === 0) {
        this.TabCur = 0;
      }
      if (e.data.state === '已处理') {
      } else if (e.data.state === '正在处理') {
      }
      // this.handleBasicConfig(e.data);
      // this.showProcApproval = true;
      if (e.data.state !== '未开始' && e.index !== 0) {
        const type = e.data.state === '已处理' ? 'detail' : 'update';
        uni.navigateTo({
          url: `../procStepDetail/procStepDetail?step_no=${e.data.step_no}&proc_instance_no=${this.proc_instance_no}&type=${type}`
        });
      }
      // this.scroll = e.index;
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
        this.getCurStepConfig(res.data['proCharData'][0], 'firstStep');
        this.currentStepInfo = res.data['proCharData'][res.data['proHanleData']['activeStep']];
        this.firstStepInfo = res.data['proCharData'][0];
        this.scroll = res.data.proHanleData.activeStep;
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
      // if(e.biz_cfg_data&&e.biz_cfg_data.length>0){
      //   let biz_cfg = e.biz_cfg_data
      //   for(let i=0;i<biz_cfg.length;i++){
      //     const item = biz_cfg[i]

      //   }
      // }
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
                  // this.getDetail(item, 'firstStep');
                  // this.TabCur = 0
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
      if (fields && Array.isArray(fields)) {
        fields = fields.filter((item, index) => {
          if (!item.value) {
            item.value = '';
          }
          if (!this.authority) {
            item.disabled = true;
          }
          // if (item['in_' + type] === 1) {
          return item;
          // }
        });
        // this.fields = fields;
      }
      return fields;
    }
  },
  onLoad(option) {
    if (option.proc_instance_no) {
      this.userInfo = uni.getStorageSync('login_user_info');
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
  .cu-timeline{
    .name{
      font-size: 34upx;
      font-weight: 700;
    }
    .state{
      font-size: 30upx;
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
