<template>
  <view class="cu-card article bg-blue" style="min-height: 100vh;">
    <view class="cu-item shadow" style="padding: 10upx;">
      <view class="question-title">
        <view class="text-cut" style="">{{ formData.title }}</view>
      </view>
      <view class="content" style="padding: 0 30upx;">
        <view class="desc">
          <view class="text-content-text text-black"><view v-html="JSON.parse(JSON.stringify(formData.remark).replace(/\<img/gi, '<img width=100% height=100%   '))"></view></view>
          <view style="margin-top: .5rem;">
            <view class="text-blue" v-if="formData.start_time">开始时间：{{ formData.start_time.slice(0, 10) }}</view>
            <view class="text-blue" v-if="formData.end_time">结束时间：{{ formData.end_time.slice(0, 10) }}</view>
          </view>
        </view>
      </view>
      <view class="content" style="padding: 20upx 0;box-sizing: border-box;">
        <bxform ref="bxform" :fields="configCols" :BxformType="'form'" pageType="add" @value-blur="saveValue"></bxform>
      </view>
      <view class="content" style="padding: 0 30upx;">
        <view class="desc">
          <view class="text-content-text"><view v-html="JSON.parse(JSON.stringify(formData.end_remark).replace(/\<img/gi, '<img width=100% height=100% '))"></view></view>
          <!-- <view class="text-content">{{ formData.end_remark }}</view> -->
        </view>
      </view>
      <view class="button-box" style="margin: 30upx;" v-if="formType === 'form' && configCols && configCols.length > 0&&formData['user_state']==='未完成'">
        <button class="bg-blue line-white" type="" @click="submitForm('submit')">提交</button>
      </view>
      <view class="button-box" style="margin: 30upx;" v-if="formType === 'detail' && configCols && configCols.length > 0 && formData.info_collect_type === '评估' &&formData.user_state==='完成'&& fill_batch_no">
        <button class="bg-blue line-white" type="" @click="seeReport()">查看评估结果</button>
      </view>
    </view>
    <view class="footer-button" v-if="configCols && configCols.length > 0">
      <view class="foot-btn" @click="toCreate">我要创建</view>
      <view class="foot-btn" @click="toFeedback" v-if="activity_no !== '20200309125000000100'">意见反馈</view>
    </view>
    <!-- <view class="button-box" style="margin: 30upx;" v-if="formType === 'form' && configCols && configCols.length > 0">
      <button class="bg-blue line-white" type="" @click="submitForm('submit')">提交</button>
    </view> -->
    <view class="qrcode-box" style="text-align: center;margin-bottom: 30upx;">
      <view class="contact">为了及时获取最新信息</view>
      <view class="contact">长按下方二维码 识别关注公众号</view>
      <view style="display: flex;margin-bottom: 20upx;">
        <text class="cuIcon-refresharrow"></text>
        <text class="cuIcon-refresharrow"></text>
      </view>
      <image class="qrcode" src="../../../static/code.png" mode=""></image>
      <view class="foot-words" style="margin-top: 10upx;">百想科技</view>
      <view class="foot-words">进入公众号后</view>
      <view class="foot-words">点击下方“信息采集”按钮</view>
      <view class="foot-words">即可进入问卷列表</view>
    </view>
    <view class="cu-modal bottom-modal" :class="modalName == 'bottomModal' ? 'show' : ''">
      <view class="cu-dialog">
        <view class="padding-xl">
          <view class="cu-bar justify-start">
            <view class="action sub-title">
              <text class="text-xl text-bold text-blue">评估报告</text>
              <text class="text-ABC text-blue">Report</text>
              <!-- last-child选择器-->
            </view>
          </view>
          <view class="padding-sm" v-for="(item, index) in assessmentReport" :key="index">{{ item.sug_desc }}</view>
        </view>
        <view class="cu-bar">
          <view class=""></view>
          <view class="action text-green" @tap="hideModal">确定</view>
          <!-- <view class="action text-blue" @tap="hideModal">取消</view> -->
        </view>
      </view>
    </view>
  </view>

  <!-- </view> -->
  <!-- <view class="question-wrap">
    <view class="question-title">{{ formData.title }}</view>
    <view class="question-remark">{{ formData.remark }}</view>
    <view class="question-content">
      <view class="form-wrap"><bxform ref="bxform" :fields="configCols" :BxformType="'form'" @value-blur="saveValue"></bxform></view>
    </view>
    <view class="button-box" v-if="formType === 'form'"><button type="primary" @click="submitForm('submit')">提交</button></view>

    <view class="question-endremark">{{ formData.end_remark }}</view>
  </view> -->
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';

var wx = require('jweixin-module');
export default {
  name: 'questionnaire', //问卷答题页面
  components: {
    bxform
  },
  data() {
    return {
      formType: 'form', // 表单类型 预览:detail 正常:form
      activity_no: '', // 问卷编号
      status: '未开始',
      configCols: [],
      formData: {
        title: '', // 标题
        remark: '', //欢迎语
        end_remark: '' //结束语
      },
      userInfo: {}, // 登录用户信息
      wxUserInfo: {}, // 微信用户信息
      questionData: {},
      fill_batch_no: '', //活动批次编号
      modalName: null,
      assessmentReport: []
    };
  },
  methods: {
    hideModal(e) {
      this.modalName = null;
    },
    async seeReport() {
      // 查看评估结果
      // uni.showLoading({
      // 	mask: true
      // });
      uni.navigateTo({
        url: `/pages/specific/assessmentResult/assessmentResult?activity_no=${this.activity_no}&fill_batch_no=${this.fill_batch_no}`
      });
      // let url = this.getServiceUrl('daq', 'srvdaq_activity_sug_select', 'select');
      // let req = {
      // 	serviceName: 'srvdaq_activity_sug_select',
      // 	colNames: ['*'],
      // 	condition: [
      // 		{
      // 			colName: 'activity_no',
      // 			ruleType: 'eq',
      // 			value: this.activity_no
      // 		},
      // 		{
      // 			colName: 'fill_batch_no',
      // 			ruleType: 'eq',
      // 			value: this.fill_batch_no
      // 		}
      // 	]
      // };
      // let res = await this.$http.post(url, req);
      // // console.log(res.data);
      // uni.hideLoading()
      // if (res.data.state === 'SUCCESS') {
      // 	this.assessmentReport = res.data.data;
      // }
      // this.modalName = 'bottomModal';
    },
    toCreate() {
      // 跳转到问卷列表页面
      uni.redirectTo({
        url: '/pages/specific/home/home'
      });
    },
    toFeedback() {
      // 跳转到意见反馈问卷
      uni.redirectTo({
        url: '/pages/specific/questionnaire/questionnaire?formType=form&activity_no=20200309125000000100&status=进行中'
      });
    },
    saveValue(e) {
      console.log('saveValue', e, this.status);
      if (e.value && this.status === '进行中') {
        // return
        let itemData = [
          {
            item_no: e.column,
            option_data: [e.value]
          }
        ];
        if (e.type === 'checkbox') {
          itemData = [
            {
              item_no: e.column,
              option_data: e.value
            }
          ];
        }
        if (Array.isArray(e.value)) {
          itemData = [
            {
              item_no: e.column,
              option_data: e.value
            }
          ];
        }

        const serviceName = 'srvdaq_activity_result_save';
        const url = this.getServiceUrl('daq', serviceName, 'operate');
        let req = [
          {
            serviceName: serviceName,
            data: [
              {
                activity_no: this.activity_no,
                item_data: itemData
              }
            ]
          }
        ];
        if (this.fill_batch_no) {
          req[0].data[0].fill_batch_no = this.fill_batch_no;
        }
        this.$http.post(url, req).then(res => {
          if (res.data.state === 'SUCCESS') {
            if (res.data.resultCode === 'SUCCESS') {
              console.log(res.data.response[0].response);
              let data = res.data.response[0].response;
              if (data.fill_batch_no && !this.fill_batch_no) {
                this.fill_batch_no = data.fill_batch_no;
              }
              // uni.showToast({
              // 	title: '提交成功',
              // 	icon: 'none'
              // });
            }
          } else {
            console.log(res);
          }
        });
      }
    },
    submitForm() {
      let self = this;
      uni.showModal({
        title: '提示',
        content: '确认提交问卷?',
        success: function(res) {
          if (res.confirm) {
            if (self.status !== '进行中') {
              uni.showToast({
                title: '状态非进行中的问卷不支持提交',
                icon: 'none'
              });
            } else {
              let itemData = self.$refs.bxform.getFieldModel();
              console.log('itemData', itemData);
              let resultData = [];
              Object.keys(itemData).forEach(item => {
                let obj = {
                  item_no: item,
                  option_data: [itemData[item]]
                };
                if (Array.isArray(itemData[item])) {
                  obj.option_data = itemData[item];
                }
                if (itemData[item]) {
                  resultData.push(obj);
                }
              });
              let serviceName = 'srvdaq_activity_result_submit';
              const url = self.getServiceUrl('daq', serviceName, 'operate');
              let req = [
                {
                  serviceName: serviceName,
                  data: [
                    {
                      fill_batch_no: self.fill_batch_no,
                      activity_no: self.activity_no,
                      item_data: resultData
                    }
                  ]
                }
              ];
              console.log('resultData', resultData);
              self.$http.post(url, req).then(res => {
                if (res.data.state === 'SUCCESS') {
                  if (res.data.resultCode === 'SUCCESS') {
                    uni.showToast({
                      title: '提交成功',
                      icon: 'none'
                    });
                    self.formType = 'detail';
                    self.getQuestionnaireData(self.formData)
                    // uni.redirectTo({
                    //   url: '../home/home'
                    // });
                  }
                } else {
                  if (res.data.resultCode === 'FAILURE') {
                    uni.showToast({
                      title: res.data.resultMessage,
                      icon: 'none'
                    });
                  }
                  console.log(res);
                }
              });
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    getQuestionnaireData(questionData) {
      // 获取问卷数据
      let that = this;
      uni.showLoading({
        mask: true
      });
      const serviceName = 'srvdaq_init_view_select';
      const url = this.getServiceUrl('daq', serviceName, 'select');
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        order: [{ colName: 'item_seq', orderType: 'asc' }],
        condition: [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: this.activity_no
          },
          {
            colName: 'type', // 查看视图初始化
            ruleType: 'eq',
            value: 'use'
          }
        ]
      };
      if (this.status === '未开始') {
        req.condition = [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: this.activity_no
          },
          {
            colName: 'biz_type',
            ruleType: 'eq',
            value: 'cfg'
          }
        ];
      }
      console.log(this.questionData);
      if (questionData && questionData.fill_batch_no) {
        req.condition = [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: questionData.activity_no
          },
          {
            colName: 'type',
            ruleType: 'eq',
            value: 'use'
          },
          {
            colName: 'fill_batch_no',
            ruleType: 'eq',
            value: questionData.fill_batch_no
          }
        ];
      }
      if (this.activity_no && this.fill_batch_no) {
        req.condition = [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: this.activity_no
          },
          {
            colName: 'type',
            ruleType: 'eq',
            value: 'use'
          },
          {
            colName: 'fill_batch_no',
            ruleType: 'eq',
            value: this.fill_batch_no
          }
        ];
      }
      if (this)
        this.$http
          .post(url, req)
          .then(res => {
            uni.hideLoading();
            if (res.data.state === 'SUCCESS') {
              const data = res.data.data[0];
              this.activity_no = data.activity_no;
              let configCols = [];
              data.item_data.forEach(item => {
                configCols.push(this.getConfig(item));
              });
              if (data.logo) {
                this.getPicture(data.logo).then(url => {
                  this.$set(this.formData, 'fileUrl', url);
                });
              }
              if (data.user_data) {
                console.log('data.answer_times', data.answer_times);
                configCols.forEach(item => {
                  if (this.formType === 'detail') {
                    item.disabled = true;
                  }

                  data.user_data.forEach(items => {
                    if (item.column === items.item_no) {
                      if (item.item_type_attr && item.item_type_attr.radioType === 'multi') {
                        item.value = items.option_data;
                        console.log('items.option_data', items.option_data);
                      } else {
                        console.log('item_type', item);
                        item.value = items.option_data[0];
                      }
                    }
                  });
                });
              }
              this.formData = data;
              if (data.user_state === '完成') {
                this.formType = 'detail';
              }
              this.configCols = configCols;
              // alert("即将获取用户信息")
              this.getUserInfo();
            } else if (res.data.resultCode === '0011') {
              uni.showToast({
                title: '未登录',
                icon: 'none'
              });
            } else if (res.data.resultCode === 'FAILURE') {
              uni.showToast({
                title: res.data.resultMessage,
                icon: 'none'
              });
              if (res.data.resultMessage === '活动已结束') {
                this.updateState().then(response => {
                  uni.showModal({
                    title: '提示',
                    content: res.data.resultMessage + ',即将跳转到列表页面',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        uni.navigateBack({
                          animationDuration: 2000
                        });
                      }
                    }
                  });
                });
              }
            }
          })
          .catch(err => {
            console.log('err', err);
            uni.hideLoading();
          });
    },
    async updateState(e) {
      let reqData = [
        {
          status: '已结束'
        }
      ];
      let url = this.getServiceUrl('daq', 'srvdaq_activity_cfg_update', 'operate');
      let req = [
        {
          serviceName: 'srvdaq_activity_cfg_update',
          data: reqData,
          condition: [
            {
              colName: 'activity_no',
              ruleType: 'eq',
              value: this.activity_no
            }
          ]
        }
      ];
      let response = await this.$http.post(url, req);
      if (response.data.resultCode === 'SUCCESS') {
        // this.getList(this.currentTab)
      }
      return response;
      console.log(response);
    },
    async getUserInfo() {
      // 获取微信账号信息
      let url = this.$api.getUserInfo;
      let req = {
        serviceName: 'srvwx_basic_user_info_select',
        colNames: ['*'],
        condition: [
          {
            colName: 'app_no',
            ruleType: 'eq',
            value: this.$api.appNo.wxh5
          }
        ]
      };
      let res = await this.$http.post(url, req);
      // alert("wxUserInfo:"+JSON.stringify(res))
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        const userInfo = res.data.data[0];
        this.wxUserInfo = userInfo;
        uni.setStorageSync('wxUserInfo', userInfo);
        // alert(JSON.stringify(userInfo));
      } else {
        uni.showToast({
          title: '未获取到当前微信用户信息',
          icon: 'none'
        });
      }
      this.getSignature();
    },
    async getPicture(file_no) {
      const serviceName = 'srvfile_attachment_select';
      const url = this.getServiceUrl('file', serviceName, 'select');
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
      };
      if (file_no !== null && file_no !== '' && file_no !== undefined) {
        let res = await this.$http.post(url, req);
        if (res.data.state === 'SUCCESS') {
          const data = res.data.data[0];
          if (data) {
            const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl;
            return fileurl;
          }
        }
      }
    },
    getConfig(e) {
      let config = {
        label: e.item_title,
        column: e.item_no,
        srvInfo: {
          serviceName: 'srvdaq_activity_result_submit',
          appNo: 'daq'
        },
        value: e.value,
        type: e.item_type,
        isRequire: e.is_require === '是' ? true : false,
        isShowExp: [],
        options: [],
        item_type_attr: e.item_type_attr,
        display: true
      };
      // if (e.option_data && e.item_type === '选项') {
      //   config.options = e.option_data.map(item => {
      //     return item.option_value;
      //   });
      // }
      if (this.formType === 'detail') {
        config.disabled = true;
      }
      // if (e.item_type === '图片') {
      //   config['fileNum'] = e.item_type_attr['fileNum'];
      // }
      // if (e.item_type === '时间日期') {
      //   //date yearMonth dateTime time
      //   config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'dateTime';
      // }
      switch (e.item_type) {
        case '文本':
          config.type = e.item_type_attr['view_model'] === 'textarea' ? 'textarea' : 'input';
          break;
        case '图片':
          config.type = 'images';
          config['fileNum'] = e.item_type_attr['fileNum'];
          break;
        case '选项':
          config.type = e.item_type_attr.radioType && e.item_type_attr.radioType === 'multi' ? 'checkbox' : 'radio';
          config.options = e.option_data.map(item => {
            return item.option_value;
          });
          break;
        case '时间日期':
          config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'dateTime';
          break;
        case '数字':
          config.type = e.item_type_attr.numberType ? e.item_type_attr.numberType : 'number';
          break;
        default:
          config.type = e.item_type;
          break;
      }
      return config;
    },
    saveShareRecord(share_type) {
      let url = this.$api.saveShareRecord;
      let req = [
        {
          serviceName: 'srvdaq_record_share_add',
          data: [
            {
              biz_no: this.activity_no,
              biz_type: 'daq',
              share_url: window.location.href,
              from_user: this.userInfo.user_no,
              share_type: share_type ? share_type : '朋友圈'
            }
          ]
        }
      ];
      this.$http.post(url, req).then(res => {
        console.log(res);
      });
    },
    getSignature(formData) {
      let self = this;
      let linkurl = window.location.href.split('#')[0];
      let req = {
        serviceName: 'srvwx_app_signature_select',
        colNames: ['*'],
        condition: [
          {
            colName: 'app_no',
            ruleType: 'eq',
            value: this.$api.appNo.wxh5
          },
          {
            colName: 'page_url',
            ruleType: 'eq',
            // value: linkurl
            value: uni.getStorageSync('linkUrl') ? uni.getStorageSync('linkUrl') : window.location.href.split('#')[0]
          }
        ]
      };
      if (uni.getStorageSync('linkUrl')) {
        console.log('linkUrl', uni.getStorageSync('linkUrl'));
        // alert('linkUrl' + uni.getStorageSync('linkUrl'));
      }
      uni.setStorageSync('linkUrl', null);
      self.$http.post(self.$api.getSignature, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          let resData = res.data.data[0];
          console.log('getSignature', resData);
          uni.setStorageSync('signatureInfo', resData);
          wx.config({
            debug: false, // 调试阶段建议开启
            appId: resData.appId, // APPID
            timestamp: resData.timestamp, // 时间戳timestamp
            nonceStr: resData.noncestr, // 随机数nonceStr
            signature: resData.signature, // 签名signature
            // 需要调用的方法接口
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage']
          });

          wx.ready(() => {
            console.log('wx.ready()', self.wxUserInfo);
            linkurl = linkurl.replace(/formType=detail/, 'formType=form');
            wx.updateAppMessageShareData({
              //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
              imgUrl: self.wxUserInfo.headimgurl
                ? self.wxUserInfo.headimgurl
                : self.formData.fileUrl
                ? self.formData.fileUrl
                : 'https://srvms.100xsys.cn:443/file/download?fileNo=20200306184125960100', // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              desc: self.formData.summary, // 摘要,如果分享到朋友圈的话，不显示摘要。
              title: self.formData.title, // 分享卡片标题
              // link:  window.location.href, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              success: function() {
                // 分享成功后的回调函数
                // uni.showModal({
                //     title: '提示',
                //     content: linkurl,
                //     success: function (res) {
                //         if (res.confirm) {
                //             console.log('用户点击确定');
                //         } else if (res.cancel) {
                //             console.log('用户点击取消');
                //         }
                //     }
                // });
                self.saveShareRecord('朋友');
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // //// alert('分享失败')
              }
            }); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            wx.updateTimelineShareData({
              imgUrl: self.wxUserInfo.headimgurl
                ? self.wxUserInfo.headimgurl
                : self.formData.fileUrl
                ? self.formData.fileUrl
                : 'https://srvms.100xsys.cn:443/file/download?fileNo=20200306184125960100', // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              desc: self.formData.summary, // 摘要,如果分享到朋友圈的话，不显示摘要。
              title: self.formData.title, // 分享卡片标题
              link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              success: function() {
                // 分享成功后的回调函数
                // //// alert('分享成功')
                self.saveShareRecord('朋友圈');
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // //// alert('分享失败')
              }
            });
          });
          wx.error(function(res) {
            // alert(JSON.stringify(res));
            console.log(res);
          });
        } else {
        }
      });
    },
    getParams(name) {
      let str = window.location.href;
      str = str.split('?')[1];
      let arr = str.split('&');
      let obj = {};
      arr.forEach(item => {
        obj[item.split('=')[0]] = item.split('=')[1];
      });
      if (obj[name]) {
        return obj[name];
      } else {
        return false;
      }
    }
  },
  mounted() {},
  onShow() {},
  created() {},
  onLoad(option) {
    if (option.formType && option.formType === 'detail') {
      this.formType = option.formType;
    } else {
      this.formType = 'form';
    }
    if (option.fill_batch_no) {
      this.fill_batch_no = option.fill_batch_no;
    }
    let questionData = option.questionData;
    if (questionData) {
      questionData = JSON.parse(decodeURIComponent(option.questionData));
    }
    if (questionData && questionData.fill_batch_no) {
      this.formType = 'detail';
      this.questionData = questionData;
      this.getQuestionnaireData(this.questionData);
    } else {
      if (option.status) {
        this.status = decodeURIComponent(option.status);
        console.log('status', this.status);
      }
      if (option.activity_no) {
        this.activity_no = option.activity_no;
        this.getQuestionnaireData();
      } else if (this.questionData.activity_no) {
        this.status = '已完成';
        this.activity_no = this.questionData.activity_no;
        this.getQuestionnaireData();
      } else {
        uni.showModal({
          title: '提示',
          content: '未知的问卷编号，即将跳转到问卷列表',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              uni.reLaunch({
                url: '/pages/specific/home/home'
              });
            }
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.question-title {
  height: 100upx;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #333;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-button {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  // min-height: 100upx;
  .foot-btn {
    height: 40upx;
    line-height: 40upx;
    border-bottom: 1px solid #fff;
  }
}

.qrcode-box {
  display: flex;
  width: 100%;
  padding: 50upx 0;
  flex-direction: column;
  align-items: center;
  .qrcode {
    width: 400upx;
    height: 400upx;
    padding: 10upx;
    background-color: #fff;
    border-radius: 10upx;
  }
  .contact {
    height: 50upx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .foot-words {
    display: flex;
    font-size: 24upx;
    flex-direction: column;
    align-items: center;
    line-height: 50upx;
  }
}
.text-content-text {
  width: 100%;
  min-height: 200upx;
  height: auto;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  font-size: 34upx;
  line-height: 60upx;
}
.cu-modal.bottom-modal {
  color: #333;
  .cu-dialog {
    height: auto;
  }
}
</style>
