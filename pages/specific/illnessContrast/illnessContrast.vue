<template>
  <view v-if="IllData.length > 0" class="illness-wrap">
    <cu-custom bgColor="bg-gradual-green" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">自检症状对照</block>
    </cu-custom>
    <view class="cu-list menu illness-card">
      <view class="sickName">
        <text class="cuIcon-warn "></text>
        <text>{{ sickName }}</text>
      </view>
      <view v-for="(item, index) in IllData" class="cu-list menu illness-item animation-slide-left" :key="index">
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-questionfill text-red"></text>
            <text class="text-grey"></text>
            <text class="text-red text-bold">{{ item._disease_no_disp }}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-homefill text-cyan"></text>
            <!-- <text class="text-cyan">科室：</text> -->
            <text class="text-cyan">{{ item.keName }}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-read text-grey"></text>
            <text class="text-grey">科室说明：</text>
            <text class="text-grey">{{ item.explain }}</text>
            <!-- <view class="department-explain">
              <text class="text-grey">{{ item.explain }}</text>
            </view> -->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'illnessContrast', //症状自检
  components: {},
  data() {
    return {
      IllData: [],
      sickName: '',
      menuArrow: false
    };
  },
  methods: {
    async getIllness(symNo) {
      uni.showLoading({
        title: '加载中',
        mask: true
      });
      let serviceName = 'srvhealth_symptoms_disease_select';
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'symptoms_no', value: symNo, ruleType: 'eq' }]
      };
      let res = await this.onRequest('select', serviceName, req, 'health');
      if (res.data.state === 'SUCCESS') {
        let resData = res.data.data;
        // this.IllData = res.data.data
        let no = [];
        resData.forEach(item => {
          no.push(item.disease_no);
        });
        let noStr = no.toString();
        this.getIllnessOffice(resData, noStr);
      }
    },
    async getIllnessOffice(data, str) {
      let serviceName = 'srvhealth_disease_dept_select';
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'disease_no', value: str, ruleType: 'in' }]
      };
      let res = await this.onRequest('select', serviceName, req, 'health');
      let officeData = res.data.data;

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < officeData.length; j++) {
          if (data[i].disease_no == officeData[j].disease_no) {
            data[i].illNums = officeData[j].disease_no;
            data[i].keNums = officeData[j].dept_no;
          }
        }
      }
      let disease = [];
      let dept = [];
      officeData.forEach(item => {
        disease.push(item.disease_no);
        dept.push(item.dept_no);
      });
      let disease_str = disease.toString();
      let dept_str = dept.toString();
      this.getDiseaseName(disease_str, dept_str, data);
    },
    async getDiseaseName(illNum, ksNum, endData) {
      let serviceName = 'srvhealth_disease_select';
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'disease_no', value: illNum, ruleType: 'in' }]
      };
      let res = await this.onRequest('select', serviceName, req, 'health');
      let disData = res.data.data;
      endData.forEach(item => {
        disData.forEach(dis => {
          if (item.illNums == dis.disease_no) {
            item.illName = dis.disease_name;
          }
        });
      });
      console.log('getDiseaseName---------------', res.data.data, endData);
      if (res.data.state === 'SUCCESS') {
        this.getDeptName(ksNum, endData);
      }
    },
    async getDeptName(ksNum, disData) {
      let serviceName = 'srvhealth_his_dept_select';
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'dept_no', value: ksNum, ruleType: 'in' }]
      };
      let res = await this.onRequest('select', serviceName, req, 'health');
      let deptName = res.data.data;
      disData.forEach(dist => {
        deptName.forEach(de => {
          if (dist.keNums == de.dept_no) {
            dist.keName = de.dept_name;
            dist.explain = de.dept_desc;
          }
        });
      });
      uni.hideLoading();
      this.IllData = disData;
      if (disData.length === 0) {
        uni.showModal({
          title: '提示',
          content: '未找到对应疾病，即将返回上一级',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              uni.redirectTo({
                url: '/pages/specific/symptom/symptom'
              });
            }
          }
        });
      }
    }
  },
  onLoad(option) {
    let symNo = option.no;
    if (!symNo) {
      symNo = 'A12';
    }
    this.sickName = option.name;
    this.getIllness(symNo);
    // this.getIllnessOffice()
  }
};
</script>

<style lang="scss" scoped>
.illness-wrap {
  display: flex;
  flex-direction: column;
  .illness-card {
    display: flex;
    flex-direction: column;
    // background-color: #fff;
    margin: 20upx;
    // border-radius: 20upx;
    .sickName {
      margin: 0 0 20upx;
      padding-left: 20upx;
      font-size: 40upx;
      font-weight: 600;
      color: #39b54a;
      line-height: 80upx;
      background-color: #ffffff;
      border-radius: 20upx;
      text {
        padding-right: 20upx;
      }
    }
    .illness-item {
      border-radius: 20upx;
      background-color: #ffffff;
      padding: 0upx 0 40upx;
      .department-explain {
        text-indent: 60upx;
      }
    }
  }
}
[class*='animation-'] {
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}
.animation-slide-left {
  animation-name: slide-left;
}
.animation-slide-right {
  animation-name: slide-right;
}
@keyframes slide-left {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slide-right {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
