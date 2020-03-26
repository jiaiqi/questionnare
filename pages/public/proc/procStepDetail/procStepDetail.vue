<template>
  <view>
    <cu-custom bgColor="bg-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">流程详情</block>
      <!-- <block slot="right"><text class="cuIcon-add" style="font-size: 40upx;margin-right: 20upx;" @click="toApply"></text></block> -->
      <view class="form-view">
        
      </view>
      <view class="approval-view">
        
      </view>
    </cu-custom>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stepData: {},
      serviceName:"",
      formInfo:{
        serviceName:"",
        formType:""
      },
      
    };
  },
  methods: {
    handleBasicConfig() {
      let e = this.stepData
        if (e.biz_cfg_data && e.biz_cfg_data.length > 0) {
          const biz_cfg = e.biz_cfg_data;
          biz_cfg.map(item => {
            if (item._type_form) {
              this.formInfo.formType = item._type_form;
              this.formInfo.serviceName = item[`${item._type_form}_service`];
              // this.approvalFormCfg[0].options = [];
            }
          });
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
    
  },
  onLoad(option) {
    if (option.stepData) {
      this.stepData = JSON.parse(decodeURIComponent(decodeURIComponent(option.stepData)));
    }
  }
};
</script>

<style lang="scss"></style>
