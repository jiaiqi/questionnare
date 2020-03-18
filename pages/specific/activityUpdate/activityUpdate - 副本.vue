<template>
  <view>
    <cu-custom bgColor="bg-gradual-pink" :isBack="true">
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
            <view class="text-content" v-html="JSON.parse(JSON.stringify(formData.remark).replace(/\<img/gi, '<img width=100% height=100%   '))"></view>
            <!-- <view class="text-content">{{ activityData.remark }}</view> -->
            <!-- <view>
							<view class="cu-tag bg-red light sm round">正义天使</view>
							<view class="cu-tag bg-green light sm round">史诗</view>
						</view> -->
          </view>
        </view>
      </view>
    </view>
    <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-titles text-orange "></text>
        已设置的问题：
      </view>
      <!-- <view class="action"> 
				<switch :class="isCard?'checked':''" :checked="isCard?true:false" @change="IsCard"></switch>
			</view> -->
    </view>
    <view class="cu-card article">
      <view class="cu-item shadow">
        <bxform ref="bxformActivity" v-if="viewCfg.length > 0" :pageType="activityFormType" @on-form-item="onFieldsItem" :fields="viewCfg" :BxformType="activityFormType"></bxform>
        <view style="width: 100%;height: 100upx;opacity:0;">底部占位盒子</view>
      </view>
    </view>

    <view class="cu-bar tabbar bg-white foot">
      <view class="action text-green" @click="toadded">
        <view class="cuIcon-homefill"></view>
        设置活动
      </view>
      <!-- <view class="action text-gray">
				<view class="cuIcon-similar"></view> 分类
			 </view>-->
      <view class="action text-gray" @click="showReview">
        <view class="cuIcon-my"><view class="cu-tag badge"></view></view>
        预览
      </view>

      <view class="action text-gray add-action">
        <button class="cu-btn cuIcon-add bg-green shadow" @click="showAdd"></button>
        添加问题
      </view>
    </view>
    <view class="cu-modal bottom-modal" :class="showModal ? 'show' : ''">
      <view class="cu-dialog" @tap.stop>
        <view class="cu-bar bg-white">
          <view class="action text-blue" @tap="hideModal">取消</view>
          <view class="action text-green" @click="addItem">确定</view>
        </view>
        <view class="cu-modal-content">
          <bxform ref="bxformAddQuestion" :pageType="itemFormType" :fields="configCols" :BxformType="itemFormType"></bxform>
          <!-- <bxform ref="bxform" :fields="configCols"></bxform> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// const util = require('../../util/util.js');
// import qsInput from '../../components/QuShe-inputs/inputs'

// import bxform from '@/components/bx-form/bx-form.vue'
export default {
  components: {
    bxform: e => import('@/components/bx-form/bx-form.vue')
    // bxform,
  },
  data() {
    return {
      activityFormType: 'form',
      itemFormType: 'add',
      viewCfg: [],
      maxSeq: 0,
      viewCfgTest: [
        {
          activity_no: '20200220222102000026',
          item_no: '000001',
          item_seq: 1,
          item_title: '你的性别?',
          item_type: 'checkbox',
          is_require: '是',
          item_type_attr: {
            view_model: '平铺',
            option_type: '单选'
          },
          is_public: '否',
          show_cfg: [],
          option_data: [
            {
              option_no: '00001',
              option_seq: 1,
              option_value: '男'
            },
            {
              option_no: '00002',
              option_seq: 2,
              option_value: '女'
            }
          ]
        },
        {
          activity_no: '20200208002600000007',
          item_no: '0000032',
          item_seq: 2,
          item_title: '你的爱好?',
          item_type: 'checkbox',
          is_require: '是',
          item_type_attr: {
            view_model: '平铺',
            option_type: '多选'
          },
          is_public: '否',
          show_cfg: [],
          option_data: [
            {
              option_no: '00001',
              option_seq: 1,
              option_value: '苹果'
            },
            {
              option_no: '00002',
              option_seq: 2,
              option_value: '香蕉'
            },
            {
              option_no: '00003',
              option_seq: 3,
              option_value: '菠萝'
            },
            {
              option_no: '00004',
              option_seq: 4,
              option_value: '火龙果'
            }
          ]
        },
        {
          activity_no: '20200208002600000007',
          item_no: '000003',
          item_seq: 3,
          item_title: '你的姓名?',
          item_type: 'string',
          is_require: '是',
          item_type_attr: {
            view_model: '单行',
            max_len: 4
          },
          is_public: '否',
          show_cfg: [],
          option_data: []
        },
        {
          activity_no: '20200208002600000007',
          item_no: '000004',
          item_seq: 4,
          item_title: '你的详细地址?',
          item_type: 'string',
          is_require: '是',
          item_type_attr: {
            view_model: '多行',
            max_len: 40
          },
          is_public: '否',
          show_cfg: [],
          option_data: []
        },
        {
          activity_no: '20200208002600000007',
          item_no: '000005',
          item_seq: 5,
          item_title: '你的体重(kg)?',
          item_type: 'number',
          is_require: '是',
          item_type_attr: {
            decimal_places: 'decimal', //Int  twoDecimalPlaces
            max: 200,
            min: 20
          },
          is_public: '否',
          show_cfg: [],
          option_data: []
        },
        {
          activity_no: '20200208002600000007',
          item_no: '000006',
          item_seq: 6,
          item_title: '你的生日?',
          item_type: 'date',
          is_require: '是',
          item_type_attr: {
            format: 'date'
          },
          is_public: '否',
          show_cfg: [],
          option_data: []
        },
        {
          activity_no: '20200208002600000007',
          item_no: '000007',
          item_seq: 7,
          item_title: '你的照片?',
          item_type: 'image',
          is_require: '是',
          item_type_attr: {
            max_num: 3
          },
          is_public: '否',
          show_cfg: [],
          option_data: []
        }
      ],
      inputsArray: [
        {
          type: '', //input textarea pics  radio checkbox picker-date（picker-dateTime| String| 日期加时间| | picker-date| String| 日期| | picker-time| String| 时间|） picker-city text  infinitePics
          title: '名称', //
          inputType: '', // text number
          maxlength: '', // 最大长度
          ignore: false, // 是否为空
          defaultValue: '', // 默认值
          itemArray: [] // 选项值和名称 name value
        }
      ],
      activityNo: null,
      activityData: {
        // activity_no: '20123554666666222121',
        // title: 'xxxx收集活动', //---活动标题
        // end_time: '2020-03-05 12:00:00', //--活动结束时间
        // remark: '活动简介说明', //---活动简介
        // end_remark: '问卷到此结束,感谢你的参与' //--结束语
      },
      showModal: false,
      problemData: [
        {
          activity_no: '20123554666666222121', //--活动编号
          item_seq: 1, //--序号
          item_title: '姓名', //--条目问题标题
          item_type: 'string', //--条目问题类型
          is_require: '是', //--是否必须填写
          item_type_attr: {
            view_model: '单行/多行', //--文本显示类型
            max_len: 300 //-- 最大字符长度 可选
          }
        },
        {
          activity_no: '20123554666666222121', //--活动编号
          item_seq: 1, //--序号
          item_title: '身高', //--条目问题标题
          item_type: 'number', //--条目问题类型
          is_require: '是', //--是否必须填写
          item_type_attr: {
            view_model: '单行/多行', //--文本显示类型
            max_len: 300 //-- 最大字符长度 可选
          }
        },
        {
          activity_no: '20123554666666222121', //--活动编号
          item_seq: 1, //--序号
          item_title: '生日', //--条目问题标题
          item_type: 'date', //--条目问题类型
          is_require: '是', //--是否必须填写
          item_type_attr: {
            view_model: '单行/多行', //--文本显示类型
            max_len: 300 //-- 最大字符长度 可选
          }
        },
        {
          activity_no: '20123554666666222121', //--活动编号
          item_seq: 1, //--序号
          item_title: '照片', //--条目问题标题
          item_type: 'image', //--条目问题类型
          is_require: '是', //--是否必须填写
          item_type_attr: {
            view_model: '单行/多行', //--文本显示类型
            max_len: 300 //-- 最大字符长度 可选
          }
        }
      ],
      newProblemData: {
        activity_no: '20123554666666222121', //--活动编号
        item_seq: 1, //--序号
        item_title: '', //--条目问题标题
        item_type: 'string', //--条目问题类型
        is_require: false, //--是否必须填写
        item_type_attr: {},
        is_public: '否',
        show_cfg: [],
        option_data: []
      },
      configCols: [
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
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '选项' }],
          optionsConfig: {
            selectServiceName: 'srvdaq_option_cfg_select',
            addServiceName: 'srvdaq_option_cfg_add',
            deleteServiceName: 'srvdaq_option_cfg_delete',
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
              no: 'item_seq'
            },
            model: {
              item_no: '',
              option_value: '',
              item_seq: ''
            }
          },
          options: [
            {
              id: 1,
              item_no: '20200208003220000005',
              option_seq: 2,
              option_value: '女1'
            },
            {
              id: 2,
              item_no: '20200208003220000005',
              option_seq: 2,
              option_value: '女2'
            },
            {
              id: 3,
              item_no: '20200208003220000005',
              option_seq: 2,
              option_value: '女3'
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
          value: '单行',
          type: 'radio',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '文本' }],
          options: ['单行', '多行']
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
          type: 'radioFK',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '数字' }],
          options: [
            {
              key: 'Int',
              label: '整数'
            },
            {
              key: 'decimal',
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
          type: 'radioFK',
          display: true,
          isRequire: true,
          isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '时间日期' }],
          options: [
            {
              key: 'datetime',
              label: '年月日时分秒'
            },
            {
              key: 'date',
              label: '年月日'
            },
            {
              key: 'time',
              label: '时分'
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
    // this.inputsArray = this.getInputsArray(this.viewCfg)
  },
  methods: {
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

      console.log('需要编辑的列', updates, index);
    },
    showReview() {
      // formType: 表单类型 预览:preview 正常:normal
      uni.redirectTo({
        url: '../questionnaire/questionnaire?formType=preview&activity_no=' + this.activityNo
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
        // this.inputsArray = this.getInputsArray(this.viewCfg)
        // uni.redirectTo({
        //     url: '../activityUpdate/activityUpdate?activity_no=' + this.activieyData.activity_no
        // });
      }
    },
    onInput(e) {
      let itemNo = e.item.no;
      let onType = e.btn.key;
      if (onType === 'delete') {
        this.inputsArray.map((item, index) => {
          if (item.no === itemNo) {
            this.inputsArray.splice(index, 1);
          }
        });
      }
      console.log('点击了', e);
    },
    async addItem() {
      let self = this;
      let itemData = this.$refs.bxformAddQuestion.getFieldModel();
      let url = this.getServiceUrl('daq', 'srvdaq_item_cfg_add', 'add');
      let req = [
        {
          serviceName: 'srvdaq_item_cfg_add',
          data: []
        }
      ];
      if (itemData) {
        console.log('itemData', itemData);
        let newInput = this.getCoulmnConfig(itemData);
        console.log('newInput', newInput);
        newInput.activity_no = this.activityNo;
        newInput['item_seq'] = this.maxSeq + 1;
        // newInput.item_seq = this.viewCfg[this.viewCfg.length - 1].item_seq + 1
        req[0].data.push(newInput);
        let response = await this.$http.post(url, req);
        console.log('srvdaq_item_cfg_add', response);
        if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
          this.getActivityInfo(this.activityNo);
        }
        // console.log('newInput',newInput)
        // let inputsD = self.getInputsArray([newInput])
        // console.log('inputsD',inputsD)
        // self.inputsArray.push(inputsD[0])
        self.hideModal();
        // self.newProblemData = {
        // 	"item_title": "", //--条目问题标题
        // 	"item_type": "string", //--条目问题类型
        // 	"is_require":false, //--是否必须填写
        // 	"item_type_attr": {
        // 	}
        // }
      } else {
        console.log('表单填写不完整');
      }
    },
    DateChange(e) {
      this.date = e.detail.value;
    },
    toUpdate() {
      uni.redirectTo({
        url: '../activityUpdate/activityUpdate?id=' + 1
      });
    },
    toadded() {
      uni.redirectTo({
        url: '../added/added?activity_no=' + this.activityNo
      });
    },
    activeFc(res) {
      uni.showToast({
        title: '获取输入成功'
      });
      console.log(JSON.stringify(res));
    },
    showAdd(e) {
      this.showModal = true;
    },
    hideModal(e) {
      this.showModal = false;
    },
    radioChange(e) {
      this.newProblemData.item_type = e.target.value;
      console.log(e.target.value);
    },
    stringView(e) {
      // this.newProblemData.item_type_attr['view_model'] = e.target.value
      console.log(e.target.value);
    },
    isRequire(e) {
      this.newProblemData.is_require = e.detail.value;
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
          config.type = 'input';
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
    // 加载更多 util.throttle为防抖函数
    // lower1: util.throttle(function(e) {
    // 	console.log(`加载${this.currentTab}`)//currentTab表示当前所在页数 根据当前所在页数发起请求并带上page页数
    // 	uni.showLoading({
    // 		title: '加载中',
    // 		mask:true
    // 	})
    // 	this.isRequest().then((res)=>{
    // 		let tempList = this.list
    // 		tempList[this.currentTab] = tempList[this.currentTab].concat(res)
    // 		console.log(tempList)
    // 		this.list = tempList
    // 		this.$forceUpdate() //二维数组，开启强制渲染
    // 	})
    // }, 300),
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
</style>
