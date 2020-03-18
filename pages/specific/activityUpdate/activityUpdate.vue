<template>
  <view>
    <cu-custom bgColor="bg-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">活动问题编辑</block>
    </cu-custom>
    <view class="cu-card article">
      <view class="cu-item shadow">
        <view class="title">
          <view class="text-cut">{{ activityData.title }}</view>
        </view>
        <view class="content">
          <view class="desc">
            <view  class="text-content" v-html="JSON.parse(JSON.stringify(activityData.remark).replace(/\<img/gi, '<img width=100% height=100%   '))"></view>
            <!-- <view class="text-content">{{ activityData.remark }}</view> -->
          </view>
        </view>
      </view>
    </view>
    <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-titles text-orange "></text>
        已设置的问题：
      </view>
    </view>
    <view class="cu-card article">
      <view class="cu-item shadow">
        <bxform ref="bxformActivity" v-if="viewCfg.length > 0" :pageType="activityFormType" @on-form-item="onFieldsItem" :fields="viewCfg" :BxformType="activityFormType"></bxform>
        <view style="width: 100%;height: 100upx;opacity:0;">底部占位盒子</view>
      </view>
    </view>
    <view class="cu-bar tabbar bg-white foot">
      <view class="action text-green" @click="toadded">
        <view class="cuIcon-settingsfill"></view>
        设置活动
      </view>
      <view class="action text-gray" @click="showReview">
        <view class="cuIcon-attentionfill"><view class=" badge"></view></view>
        预览
      </view>

      <view class="action text-gray add-action">
        <button class="cu-btn cuIcon-add bg-green shadow" @click="showAdd"></button>
        添加问题
      </view>
    </view>
    <view class="cu-modal bottom-modal" :class="showModal ? 'show' : ''">
      <view class="cu-dialog" @tap.stop>
        <view class="cu-modal-content" v-if="configCols.length > 0">
          <bxform ref="bxformAddQuestion" :pageType="itemFormType" :fields="itemModel" :BxformType="itemFormType" @value-blur="valueChange" :key="showAddForm"></bxform>
          <view class="cu-bar btn-group">
            <button class="cu-btn bg-grey shadow-blur round" @tap="hideModal">取消</button>
            <button class="cu-btn bg-green shadow-blur round" @click="addItem('save')" v-if="questionType === '选项' && !configCols[0].value">保存问题</button>
            <button class="cu-btn bg-blue shadow-blur round" @click="hideModal('refresh')" v-if="questionType === '选项' && configCols[0].value">完成</button>
            <button class="cu-btn bg-blue shadow-blur round" @click="addItem" v-if="questionType !== '选项'">提交</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {
    bxform: e => import('@/components/bx-form/bx-form.vue')
  },
  data() {
    return {
      activityFormType: 'form',
      itemFormType: 'add',
      viewCfg: [],
      maxSeq: 1,
      question_no: '',
      isQuestion: false,
      questionType: '文本',
      activityNo: null,
      activityData: {
        activity_no: '',
        title: '', //---活动标题
        end_time: '', //--活动结束时间
        remark: '', //---活动简介
        end_remark: '' //--结束语
      },
      showModal: false,
      showAddForm: true,
      configCols: [
        {
          label: '问题编号',
          column: 'item_no',
          disabled: true,
          value: '',
          type: 'input',
          display: false,
          isRequire: false,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: 'null' }],
          options: []
        },
        {
          label: '问题类型',
          column: 'item_type',
          value: '文本',
          type: 'radio',
          display: true,
          isRequire: true,
          isShowExp: '',
          options: ['文本', '数字', '选项', '图片', '时间日期']
        },
        {
          label: '名称',
          column: 'item_title',
          value: '',
          type: 'input',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'neq', value: '' }],
          options: []
        },
        {
          label: '选项列表',
          column: 'options_list',
          value: '',
          type: 'list',
          display: true,
          isRequire: false,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '选项' }, { colName: 'item_no', ruleType: 'neq', value: '' }],
          optionsConfig: {
            selectServiceName: 'srvdaq_option_cfg_select',
            addServiceName: 'srvdaq_option_cfg_add',
            deleteServiceName: 'srvdaq_option_cfg_delete',
            updateServiceName: 'srvdaq_option_cfg_update',
            appNo: 'daq',
            conditions: [
              {
                colName: 'item_no',
                ruleType: 'eq',
                value: 'item_no'
              }
            ],
            key_col: {
              refed_col: 'id',
              key_disp_col: 'option_value',
              value: 'option_value',
              no: 'option_seq'
            },
            model: {
              item_no: '',
              option_value: '',
              option_seq: ''
            }
          },
          options: [
            // {
            //   id: 1,
            //   item_no: '',
            //   option_seq: 2,
            //   option_value: '选项一'
            // },
            // {
            //   id: 2,
            //   item_no: '',
            //   option_seq: 2,
            //   option_value: '选项二'
            // }
          ]
        },
        {
          label: '选项类型',
          column: 'option_type',
          value: '单选',
          type: 'radioFk',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '选项' }],
          options: [
            {
              label: '单选',
              value: '单选'
            },
            {
              label: '多选',
              value: '多选'
            }
          ]
        },
        {
          label: '是否必填',
          column: 'is_require',
          value: '是',
          type: 'radio',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'neq', value: '' }],
          options: ['是', '否']
        },
        {
          label: '行数',
          column: 'view_model',
          value: 'input',
          type: 'radioFk',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '文本' }],
          options: [
            {
              value: 'input',
              label: '单行'
            },
            {
              value: 'textarea',
              label: '多行'
            }
          ]
        },
        {
          label: '最大字数',
          column: 'max_len',
          value: 50,
          type: 'number',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '文本' }],
          options: []
        },
        {
          label: '数字精度',
          column: 'decimal_places',
          value: 'Int',
          type: 'radioFk',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '数字' }],
          options: [
            {
              value: 'number',
              label: '整数'
            },
            {
              value: 'digit',
              label: '小数'
            }
          ]
        },
        {
          label: '数字最大值',
          column: 'max',
          value: 100,
          type: 'number',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '数字' }],
          options: []
        },
        {
          label: '数字最小值',
          column: 'min',
          value: 0,
          type: 'number',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '数字' }],
          options: []
        },
        {
          label: '时间类型',
          column: 'format',
          value: 'date',
          type: 'radioFk',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '时间日期' }],
          options: [
            {
              value: 'dateTime',
              label: '年月日时分秒'
            },
            {
              value: 'date',
              label: '年月日'
            },
            {
              value: 'time',
              label: '时分秒'
            }
          ]
        },
        {
          label: '图片数量',
          column: 'max_num',
          value: 3,
          type: 'number',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '图片' }],
          options: []
        }
      ],
      inputBut: [
        {
          name: '上移',
          key: 'up',
          icon: 'cuIcon-top'
        },
        {
          name: '下移',
          key: 'down',
          icon: 'cuIcon-down'
        },
        {
          name: '编辑',
          key: 'edit',
          icon: 'cuIcon-edit'
        },
        {
          name: '删除',
          key: 'delete',
          color: 'red',
          icon: 'cuIcon-deletefill'
        }
      ]
    };
  },
  onLoad() {
    if (this.$route.query.hasOwnProperty('activity_no')) {
      this.activityNo = this.$route.query.activity_no;
      this.getActivityInfo(this.activityNo);
    }
  },
  computed: {
    itemModel: {
      get: function() {
        return this.configCols;
      },
      set: function(e) {
        this.configCols = this.configCols.map((item, index) => {
          if (item.column === e.col) {
            item.value = e.val;
            console.log('computed---itemModel:', e);
          }
          if (item.column === 'options_list') {
            item['options'] = [];
          }
          return item;
          this.$set(this.configCols, index, item);
        });
      }
    }
  },
  methods: {
    valueChange(e) {
      console.log('value-change', e);
      if (e.column && e.column === 'item_type') {
        this.questionType = e.value;
        this.showAddForm = !this.showAddForm;
      }
    },
    onFieldsItem(e) {
      console.log(e);
      let item = e.item;
      let fields = this.viewCfg;
      let index = null;
      let upIndex = null;
      let downIndex = null;
      for (let i = 0; i < fields.length; i++) {
        if (item.column === fields[i]['column']) {
          index = i;
        }
      }
      let updates = new Array(2);
      switch (e.button.key) {
        case 'up':
          upIndex = index - 1;
          console.log('upIndex', upIndex);
          updates[0] = fields[upIndex];
          updates[1] = fields[index];
          break;
        case 'down':
          downIndex = index + 1;
          console.log('downIndex', downIndex);
          updates[0] = fields[index];
          updates[1] = fields[downIndex];
          break;
        case 'delete':
          break;
        default:
          break;
      }
      if (e.button.key === 'up' && updates.length === 2 && !updates[0]) {
        uni.showToast({
          title: '此问题已排在最前',
          icon: 'none'
        });
      } else if (e.button.key === 'down' && updates.length === 2 && !updates[1]) {
        uni.showToast({
          title: '此问题已排在最末',
          icon: 'none'
        });
      } else if (e.button.key === 'up' || e.button.key === 'down') {
        let seqList = updates.map(item => item.seq);
        updates[0]['seq'] = seqList[1];
        updates[1]['seq'] = seqList[0];
        uni.showLoading({
          mask: true
        });
        this.updateQuestion(updates[0]).then(res => {
          this.updateQuestion(updates[1]).then(res => {
            this.viewCfg = [];
            this.viewCfg.length = 0;
            this.getActivityInfo(this.activityNo);
            uni.hideLoading();
          });
        });
      } else if (e.button.key === 'delete') {
        uni.showLoading({
          mask: true
        });
        this.deleteQuestion(item);
      } else if (e.button.key === 'edit') {
        this.isQuestion = true;
        console.log('编辑 updates', fields[index], this.configCols);
        this.question_no = e.item.column;
        this.updateQuestions(fields[index]);
      }
      console.log('需要编辑的列', updates, index, this.configCols);
    },
    deleteQuestion(item) {
      let self = this;
      uni.showModal({
        title: '提示',
        content: '确认删除此问题？',
        success(res) {
          if (res.confirm) {
            let url = self.getServiceUrl('daq', 'srvdaq_item_cfg_delete', 'delete');
            let req = [{ serviceName: 'srvdaq_item_cfg_delete', condition: [{ colName: 'item_no', ruleType: 'eq', value: item.column }] }];
            self.$http.post(url, req).then(res => {
              if (res.data.resultCode === 'SUCCESS') {
                uni.showToast({
                  title: '删除成功',
                  icon: 'none'
                });
                self.getActivityInfo(self.activityNo);
                uni.hideLoading();
              } else {
                uni.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
              }
            });
          } else {
            uni.showToast({
              title: '取消删除',
              icon: 'none'
            });
          }
        }
      });
    },
    async updateQuestions(item) {
      this.showAddForm = !this.showAddForm;
      let field = item;
      let itemAttr = item.item_type_attr;
      console.log('字段额外属性', itemAttr);
      this.configCols = this.configCols.map((item, index) => {
        switch (item.column) {
          case 'item_no':
            item.value = field.column;
            return item;
            break;
          case 'item_type':
            switch (field.type) {
              case 'number':
                item.value = '数字';
                break;
              case 'input':
                item.value = '文本';
                break;
              case 'radio':
                item.value = '选项';
                break;
              case 'checkbox':
                item.value = '选项';
                break;
              case 'images':
                item.value = '图片';
                break;
              case 'date':
                item.value = '时间日期';
                break;
              case 'time':
                item.value = '时间日期';
                break;
              case 'dateTime':
                item.value = '时间日期';
                break;
              default:
                break;
            }
            return item;
            break;
          case 'item_title':
            item.value = field.label;
            return item;
            break;
          case 'option_type':
            item.value = itemAttr.radioType === 'single' ? '单选' : itemAttr.radioType === 'multi' ? '多选' : '';
            return item;
            break;
          case 'is_require':
            item.value = field.isRequire === true ? '是' : '否';
            return item;
            break;
          case 'max_len':
            item.value = itemAttr.max_len;
            return item;
            break;
          case 'decimal_places':
            item.value = itemAttr.decimal_places;
            return item;
            break;
          case 'max':
            item.value = itemAttr.max;
            return item;
            break;
          case 'view_model':
            item.value = itemAttr.view_model;
            if (item.value === '单行') {
              item.value = 'input';
            } else {
              item.value = 'textarea';
            }
            return item;
            break;
          case 'options_list':
            item.options = field._rawData.option_data;
            return item;
            break;
          case 'min':
            item.value = itemAttr.min;
            return item;
            break;
          case 'format':
            item.value = itemAttr.dateType;
            return item;
            break;
          case 'max_num':
            item.value = itemAttr.max_num;
            return item;
            break;
          default:
            break;
        }
        return item;
      });
      this.showModal = true;
    },
    async updateQuestion(item) {
      let url = this.getServiceUrl('daq', 'srvdaq_item_cfg_update', 'update');
      let req = [{ serviceName: 'srvdaq_item_cfg_update', condition: [{ colName: 'item_no', ruleType: 'eq', value: item.column }], data: [{ item_seq: item.seq }] }];
      let res = await this.$http.post(url, req);
      return res.data.resultCode === 'SUCCESS';
    },
    showReview() {
      // formType: 表单类型 预览:preview 正常:normal
      uni.redirectTo({
        url: '/pages/specific/questionnaire/questionnaire?formType=detail&activity_no=' + this.activityNo
      });
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
        self.viewCfg = response.data.data[0].item_data;
        let seqList = self.viewCfg.map(item => item.item_seq);
        self.maxSeq = seqList.sort()[seqList.length - 1];
        self.viewCfg = this.viewCfg.map(item => {
          return this.getConfig(item);
        });
        self.viewCfg = self.arraySort(self.viewCfg, 'seq');
      }
    },
    async addItem(type) {
      let self = this;
      let itemData = this.$refs.bxformAddQuestion.getFieldModel();
      console.log('itemData', itemData);
      this.showAddForm = !this.showAddForm;
      let url = this.getServiceUrl('daq', 'srvdaq_item_cfg_add', 'add');
      let req = [
        {
          serviceName: 'srvdaq_item_cfg_add',
          data: []
        }
      ];
      if (this.isQuestion) {
        url = this.getServiceUrl('daq', 'srvdaq_item_cfg_update', 'operate');
        req = [
          {
            serviceName: 'srvdaq_item_cfg_update',
            condition: [{ colName: 'item_no', ruleType: 'eq', value: this.question_no }],
            data: []
          }
        ];
      }
      if (itemData) {
        let newInput = this.getCoulmnConfig(itemData);
        console.log('newInput', newInput);
        newInput.activity_no = this.activityNo;
        if (!this.isQuestion) {
          let seqList = this.viewCfg
            .map(item => item.seq)
            .filter(item => {
              return item && item;
            })
            .sort();
          newInput['item_seq'] = seqList && seqList.length > 0 ? seqList[seqList.length - 1] + 1 : 1;
        }
        console.log('newInput', newInput);
        req[0].data.push(newInput);
        let response = await this.$http.post(url, req);
        console.log('srvdaq_item_cfg_add', response);
        if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
          self.getActivityInfo(self.activityNo);
          if (type && type === 'save') {
            let question_no = response.data.response[0].response.effect_data[0].item_no;
            console.log('question_no', question_no);
            self.configCols = self.configCols.map((item, index) => {
              if (item.column === 'item_no') {
                item.value = question_no;
              }
              return item;
            });
          }
        }
        if (type !== 'save') {
          self.hideModal();
        } else {
          this.isQuestion = true;
        }
      } else {
        console.log('表单填写不完整');
      }
    },
    DateChange(e) {
      this.date = e.detail.value;
    },
    toUpdate() {
      uni.redirectTo({
        url: '/pages/specific/activityUpdate/activityUpdate?id=' + 1
      });
    },
    toadded() {
      uni.redirectTo({
        url: '/pages/specific/added/added?activity_no=' + this.activityNo + '&serviceName=srvdaq_activity_cfg_add&type=update'
      });
    },
    activeFc(res) {
      uni.showToast({
        title: '获取输入成功'
      });
      console.log(JSON.stringify(res));
    },
    showAdd(e) {
      this.isQuestion = false;
      this.showModal = true;
    },
    hideModal(e) {
      if (e === 'refresh') {
        this.getActivityInfo(this.activityNo);
      }
      this.configCols.map(item => {
        if (item.label === '问题类型') {
          item.value = '文本';
        } else {
          item.value = '';
        }
      });
      this.showAddForm = !this.showAddForm;
      this.showModal = false;
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
        seq: e.item_seq,
        display: true,
        item_type_attr: e.item_type_attr,
        buttons: [],
        _rawData: e
      };
      config.buttons = this.inputBut;
      if (e.option_data && e.item_type === '选项') {
        config.options = e.option_data.map(item => {
          return item.option_value;
        });
      }
      if (e.item_type === '图片') {
        config['fileNum'] = e.item_type_attr['fileNum'];
      }
      if (e.item_type === '时间日期') {
        //date yearMonth dateTime time
        config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'dateTime';
      }
      switch (e.item_type) {
        case '文本':
          config.type = e.item_type_attr['view_model'] === 'textarea' ? 'textarea' : 'input';
          break;
        case '图片':
          config.type = 'images';
          break;
        case '选项':
          config.type = 'radio';
          break;
      }
      if (e.item_type === '数字') {
        // number-数字 digit-带小数点
        if (e.item_type_attr.numberType) {
          config.type = e.item_type_attr.numberType;
        } else {
          config.type = 'number';
        }
      }
      if (e.item_type === '选项') {
        // radio-单选 checkbox-多选
        if (e.item_type_attr && e.item_type_attr.radioType) {
          if (e.item_type_attr.radioType === 'single') {
            config.type = 'radio';
          } else if (e.item_type_attr.radioType === 'multi') {
            config.type = 'checkbox';
          }
        } else {
          config.type = 'radio';
        }
      }
      return config;
    }
  }
};
</script>

<style lang="scss" scoped>
.cu-modal.bottom-modal.show {
  z-index: 9999;
  overflow: hidden;
}
.cu-modal.bottom-modal .cu-dialog {
  overflow-y: scroll;
}
.cu-modal-content {
  height: 100%;
}
.cu-card.article>.cu-item .content .text-content{
  height: auto;
}
.view{
	/deep/ p{
		img{
			width: 100%;
		}
	}
}
</style>
