<template>
  <view class="analyze-wrap">
    <scroll-view scroll-x class="bg-white nav text-center tab-list" :scroll-with-animation="true">
      <view class="cu-item" :class="index == currentTab ? 'text-blue cur' : ''" v-for="(item, index) in tabList" :key="index" @tap="changeTab" :data-id="index">
        {{ item.label }}
      </view>
    </scroll-view>
    <view class="analyze-main" v-if="questionList && questionList.length > 0 && currentTab === 0">
      <view class="question-item" v-for="(item, index) in questionList" :key="index">
        <view class="question-title">
          <text class="question-no">第{{ index + 1 }}题:</text>
          <text class="question-label">{{ item.item_title }}</text>
          <text class="question-type">[{{ item.item_type }}]</text>
        </view>
        <view class="question-analyze" v-if="item.item_type === '选项' && item.itemValue && Object.keys(item.itemValue).length > 0">
          <bx-table :optionData="item.itemValue"></bx-table>
          <custom-chart :id="item.id" :originData="item.itemValue"></custom-chart>
        </view>
        <view class="nodata" v-if="item.item_type === '选项' && !item.itemValue">本填写有效人次为0</view>
        <view class="question-text" v-if="item.item_type !== '选项'">
          <view class="cu-btn line-blue" @click="toDetail(item, index)">
            {{
              item.showList
                ? '收起详细信息' + ' ' + (item.itemValue ? Object.keys(item.itemValue).length : 0) + ' '
                : '查看详细信息 ' + ' ' + (item.itemValue ? Object.keys(item.itemValue).length : 0) + ' '
            }}
          </view>
        </view>
        <view class="detail-list" v-if="item.showList"><bx-table :optionData="item.itemValue" :showList="item.item_type !== '选项' ? true : false"></bx-table></view>
        <view class=""></view>
      </view>
    </view>
    <bx-list
      v-if="activityData.item_data && currentTab === 1"
      ref="bxList"
      serviceName="srvdaq_record_reply_select"
      :condition="[{ colName: 'activity_no', ruleType: 'eq', value: this.$route.query.activity_no }]"
      pageType="list"
      :viewTemp="viewTemp"
      :fixed="true"
      :top="-8"
      :listConfig="listConfig"
      :rownumber="10"
      :showFootBtn="false"
      @click-list-item="clickItem"
      @clickFootBtn="clickFootBtn"
    ></bx-list>
  </view>
</template>

<script>
import BxTable from '../components/bx-table/bx-table.vue';
import CustomChart from '../components/custom-chart/custom-chart.vue';
import uCharts from '@/components/u-charts/u-charts.js';
import bxList from '@/components/bx-list/bx-list.vue';
var _self;
var canvaColumn = null;
export default {
  name: 'questionnaireAnalysis', //问卷分析
  data() {
    return {
      activityData: {},
      viewCfg: {},
      currentTab: 0,
      scrollLeft: 0,
      tabList: [
        {
          index: 0,
          label: '统计结果'
        },
        {
          index: 1,
          label: '详细数据'
        }
      ],
      questionList: [],
      chartData: {},
      recordServiceName: 'srvdaq_record_reply_select',
      listData: [],
      listConfig: {},
      viewTemp: {
        title: 'user_no',
        tip: 'user_type',
        // img: 'img',
        // price: 'current_price',
        footer: 'create_time'
      },
      page: { total: 0, pageNo: 1, rownumber: 5 }
    };
  },
  components: {
    BxTable,
    CustomChart,
    bxList
  },
  computed: {
    activity_no() {
      if (this.$route.query && this.$route.query.activity_no) {
        return this.$route.query.activity_no;
      }
    }
  },
  methods: {
    changeTab(e) {
      this.currentTab = Number(e.currentTarget.dataset.id);
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      if (this.currentTab === 0) {
        document.title = '统计结果';
      } else if (this.currentTab === 1) {
        document.title = '详细数据';
      }
    },
    toDetail(item, index) {
      //跳转到查看详情
      console.log(item);
      if (item.itemValue && Object.keys(item.itemValue).length > 0) {
        item.showList = !item.showList;
        this.$set(this.questionList, index, item);
      } else {
        uni.showToast({
          title: '没有填写记录!',
          icon: 'none'
        });
      }
    },
    async getChartData() {
      let chartData = {
        categories: ['男', '女'],
        series: [
          {
            name: '男',
            data: [35]
          },
          {
            name: '女',
            data: [70]
          }
        ]
      };
      chartData = {
        categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
        series: [
          {
            name: '成交量1',
            data: [15, { value: 20, color: '#f04864' }, 45, 37, 43, 34]
          },
          {
            name: '成交量2',
            data: [30, { value: 40, color: '#facc14' }, 25, 14, 34, 18]
          }
        ]
      };
      this.chartData = chartData;
    },
    async getActivityInfo(e) {
      let self = this;
      let url = this.getServiceUrl('daq', 'srvdaq_init_view_select', 'select');
      let req = {
        serviceName: 'srvdaq_init_view_select',
        condition: [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: e
          },
          {
            colName: 'biz_type',
            ruleType: 'eq',
            value: 'cfg'
          }
        ]
      };
      let response = await this.$http.post(url, req);
      console.log('srvdaq_init_view_select', response);
      if (response.data.state === 'SUCCESS' && response.data.data.length > 0) {
        self.activityData = response.data.data[0];
        this.getActivityRecordList();
        this.getChartData();
      }
    },
    async getActivityRecordList() {
      if (this.$route.query.activity_no) {
        const url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
        const req = {
          serviceName: 'srvdaq_record_reply_select',
          colNames: ['*'],
          condition: [{ colName: 'activity_no', ruleType: 'eq', value: this.$route.query.activity_no }]
        };
        const res = await this.$http.post(url, req);
        if (res.data.state === 'SUCCESS') {
          const data = res.data.data;
          const fill_batch_no = data.map(item => item.fill_batch_no);
          let serviceList = ['srvdaq_storage_text_select', 'srvdaq_storage_number_select', 'srvdaq_storage_date_select', 'srvdaq_storage_option_select'];
          let newArr = [];
          let questList = this.deepClone(this.activityData.item_data);
          for (let i = 0; i < serviceList.length; i++) {
            let item = serviceList[i];
            let questArr = await this.getTypeOptionList(item);
            questList.map(quest => {
              questArr.forEach(q => {
                if (quest.item_no === q.item_no) {
                  quest.itemValue = q.val;
                  quest.showList = false;
                  newArr.push(quest);
                }
              });
            });
          }
          questList = questList.filter(item => item.item_type !== '图片');
          this.questionList = questList;
        }
      }
    },

    async getTypeOptionList(serviceName) {
      const url = this.getServiceUrl('daq', serviceName, 'select');
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        group: [
          {
            colName: 'item_no',
            type: 'by'
          },
          {
            colName: 'fill_batch_no',
            type: 'by'
          },
          {
            colName: 'option_value',
            type: 'by'
          }
        ],
        condition: [{ colName: 'activity_no', ruleType: 'eq', value: this.$route.query.activity_no }]
      };
      const res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS') {
        const data = res.data.data;
        const questionList = [...new Set(data.map(item => item.item_no))];
        let arr = questionList.map(quest => {
          let obj = {
            item_no: quest,
            val: {}
          };
          data.forEach(item => {
            if (item.item_no === quest) {
              obj.val[item.option_value] = obj.val[item.option_value] ? obj.val[item.option_value] + 1 : 1;
            }
          });
          return obj;
        });
        return arr;
      }
    },
    clickItem(e) {
      console.log('questionData', e);
      if (e.fill_batch_no) {
        uni.navigateTo({
          url: '/pages/specific/questionnaire/questionnaire?questionData=' + encodeURIComponent(JSON.stringify(e))
        });
      }
    },
    clickFootBtn(e) {
      console.log(e);
    },
    async getListData() {
      let serviceName = this.serviceName;
      let url = this.getServiceUrl('daq', serviceName, 'select');
      let req = { serviceName: serviceName, colNames: ['*'], condition: [{ colName: 'activity_no', ruleType: 'eq', value: this.activity_no }] };
      let res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS') {
        this.listData = res.data.data;
        this.page.total = res.data.page.total;
        this.page.pageNo = res.data.page.pageNo;
      }
    },
    async getListV2() {
      let colVs = await this.getServiceV2('srvdaq_record_reply_select', 'list', 'list', 'daq');
      colVs.srv_cols = colVs.srv_cols.filter(item => item.in_list === 1);
      console.log('colVs', colVs);
      this.listConfig = colVs;
      return colVs;
    }
  },
  onLoad() {
    document.title = '统计结果';
  },
  created() {
    if (this.$route.query && this.$route.query.activity_no) {
      this.getActivityInfo(this.$route.query.activity_no);
      this.condition = [{ colName: 'activity_no', ruleType: 'eq', value: this.$route.query.activity_no }];
      this.getListV2().then(() => {});
    }
  },
  watch: {
    activityData: {
      handler(newValue, oldValue) {
        if (!newValue.item_data || !Array.isArray(newValue.item_data)) {
          newValue.item_data = [];
        } else {
          // this.questionList = this.deepClone(newValue.item_data);
        }
      }
    }
  }
};
</script>

<style lang="scss">
.analyze-wrap {
  width: 100%;
  max-width: 1000upx;
  margin: 0 auto;
  min-height: 100vh;
  overflow: auto;
  .tab-list {
    max-height: 100upx;
    .cu-item {
      height: 80upx;
      line-height: 80upx;
    }
  }
  .analyze-main {
    background-color: #fff;
    padding: 20upx 20upx 0;
    margin-top: 10upx;
    .question-item {
      border-bottom: dashed 1px #eee;
      padding-bottom: 20upx;
      margin-bottom: 20upx;
      .question-title {
        display: flex;
        line-height: 50upx;
        .question-no {
          font-weight: 700;
          min-width: 100upx;
        }
        .question-label {
          font-size: 26upx;
          margin: 0 20upx;
        }
        .question-type {
          color: #9f9f9f;
          display: flex;
          align-items: center;
          font-size: 20upx;
        }
      }
      .question-analyze {
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
      .question-text {
        .cu-btn {
          padding: 0 50upx;
        }
      }
      .nodata {
        display: flex;
        height: 80upx;
        align-items: center;
        font-weight: 600;
        text-indent: 20upx;
        color: #e54d42;
      }
      &:last-child {
        border-bottom: none;
        padding-block-end: 60upx;
        margin-bottom: 0;
      }
    }
  }
}
</style>
