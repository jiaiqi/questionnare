<template>
  <view class="balanced-diet">
    <!-- <view class="headline">减脂能量平衡分析</view> -->
    <view class="cu-bar tabbar bg-white shadow foot" style="width: 100%;">
      <view class="action" @click="NavChange" data-cur="basics"><view :class="PageCur == 'basics' ? 'text-green' : 'text-gray'">健康</view></view>
      <view class="action" @click="NavChange" data-cur="component"><view :class="PageCur == 'component' ? 'text-green' : 'text-gray'">慢病</view></view>
      <view class="action" @click="NavChange" data-cur="plugin"><view :class="PageCur == 'plugin' ? 'text-green' : 'text-gray'">我的</view></view>
    </view>
    <view class="top cu-item">
      <view class="top-item"><image :src="wxUserInfo.headimgurl ? wxUserInfo.headimgurl : '../../static/logo.png'" mode="" class="head-img"></image></view>
      <view class="top-item light bg-cyan" v-if="userInfo">
        <view class="info">{{ wxUserInfo && wxUserInfo.nickname ? wxUserInfo.nickname : userInfo._userno_disp ? userInfo._userno_disp.split('/')[0] : '' }}</view>
        <view class="info" v-if="userInfo.sex">{{ userInfo.sex }}</view>
        <view class="info" v-if="userInfo.height">{{ userInfo.height }}cm</view>
        <view class="info" v-if="userInfo.weight">{{ userInfo.weight }}kg</view>
      </view>
      <view class="top-item light bg-cyan">
        <view class="top-item-content">累计{{ KeepDays ? KeepDays : '?' }}天</view>
        <view class="top-item-content">减脂 ?kg</view>
        <view class="top-item-bottom" @click="changeDate">
          <view class="lg text-cyan cuIcon-back" v-if="selectDate === nowDate"></view>
          <view class="the-date">{{ selectDate === nowDate ? '今天' : selectDate }}</view>
          <view class="lg text-cyan cuIcon-right" v-if="selectDate === nowDate"></view>
        </view>
        <!-- <view class="lg text-gray cuIcon-calendar"></view> -->
      </view>
    </view>
    <view class="main-box">
      <view class="main-title">能量平衡</view>
      <view class="main-content  bg-gradual-blue">
        <view class="energy-item ">
          <view class="text">饮食摄入</view>
          <view class="number">{{ parseFloat(dietIn).toFixed(1) }}</view>
        </view>
        <view class="operate">-</view>
        <view class="energy-item">
          <view class="text">运动消耗</view>
          <view class="number">{{ parseFloat(sportOut).toFixed(1) }}</view>
        </view>
        <view class="operate">-</view>
        <view class="energy-item">
          <view class="text">基础代谢</view>
          <view class="number">{{ basicOut ? parseFloat(basicOut).toFixed(1) : '0.0' }}</view>
        </view>
        <view class="operate">=</view>
        <view class="energy-item">
          <view class="text">体重变化</view>
          <view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
           <text style="width: 60%;"> {{ parseFloat(energyChange) > 0 ? `+${parseFloat(energyChange).toFixed(1)}` : parseFloat(energyChange).toFixed(1) }}</text>
            <text class="units">大卡</text>
          </view>
          <view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
            <text style="width: 60%;">{{ energyChange === 0 ? '0.0' : parseFloat(energyChange / 7.7) > 0 ? `+${parseFloat(energyChange / 7.7).toFixed(1)}` : parseFloat(energyChange / 7.7).toFixed(1) }}</text>
            <text class="units">g脂肪</text>
          </view>
        </view>
      </view>
    </view>
    <view class="main-box">
      <view class="main-top">
        <view class="main-title">饮食摄入</view>
        <view class="main-button cu-btn cuIcon" @click="openForm('diet')"><text class="lg text-blue cuIcon-add"></text></view>
      </view>
      <view class="main-content  bg-gradual-blue">
        <view class="table" v-if="dietRecord">
          <view class="row" v-for="(item, index) in dietRecord" :key="index">
            <view class="readonly">
              <view class="column" @click="openPopup(dietRecord, index, 'htime', 'food')">{{ item.htime?item.htime.slice(0, 5):'' }}</view>
              <view class="column">{{ item.name }}</view>
              <!-- <view class="column" @click="openPopup(dietRecord, index, 'name', 'food')">{{ item.name }}</view> -->
              <view class="column" @click="openPopup(dietRecord, index, 'amount', 'food')">{{ item.amount + item.unit }}</view>
              <view class="column">{{ item.energy }}</view>
              <view class="column"><text class="lg text-white cuIcon-delete" @click="deleteItem(item, 'food')"></text></view>
              <!-- <view class="column" @click="openPopup(dietRecord, index, 'energy', 'food')">{{ item.energy }}</view> -->
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="main-box">
      <view class="main-top">
        <view class="main-title">运动</view>
        <view class="main-button cu-btn cuIcon" @click="openForm('sport')"><text class="lg text-blue cuIcon-add"></text></view>
      </view>
      <view class="main-content  bg-gradual-blue">
        <view class="table" v-if="sportsRecord">
          <view class="row" v-for="(item, index) in sportsRecord" :key="index">
            <view class="readonly">
              <view class="column" @click="openPopup(sportsRecord, index, 'htime', 'sport')">{{ item.htime?item.htime.slice(0, 5):'' }}</view>
              <view class="column">{{ item.name }}</view>
              <!-- <view class="column" @click="openPopup(sportsRecord, index, 'name', 'sport')">{{ item.name }}</view> -->
              <view class="column" @click="openPopup(sportsRecord, index, 'amount', 'sport')">{{ item.amount + item.unit }}</view>
              <view class="column">{{ item.energy }}</view>
              <view class="column"><text class="lg text-white cuIcon-delete" @click="deleteItem(item, 'sport')"></text></view>
              <!-- <view class="column" @click="openPopup(sportsRecord, index, 'energy', 'sport')">{{ item.energy }}</view> -->
            </view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="showtip" type="center" :mask-click="false" @change="change" style="z-index: 1025;">
      <view class="uni-tip">
        <text class="uni-tip-title">修改数据</text>
        <view class="input-box"><input type="text" @change="changeValue" v-model="currentVal" /></view>
        <view class="uni-tip-group-button">
          <text class="uni-tip-button" @click="cancel('cancel')">取消</text>
          <text class="uni-tip-button" @click="cancel('confirm')">确定</text>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="addUserForm" type="center" :mask-click="false" @change="change" style="z-index: 1025;">
      <view class="uni-tip">
        <text class="uni-tip-title">请填写个人信息</text>
        <bxform ref="bxform" :fields="configCols" :BxformType="'form'" pageType="add"></bxform>
        <view class="uni-tip-group-button">
          <text class="uni-tip-button" @click="clickUserForm('cancel')">取消</text>
          <text class="uni-tip-button" @click="clickUserForm('confirm')">提交</text>
        </view>
      </view>
    </uni-popup>
    <!-- <uni-popup ref="showtip2" type="center" :mask-click="false" @change="change" style="z-index: 1025;">
			<view class="uni-tip">
				<text class="uni-tip-title">修改数据</text>
				<view style="width: 100%; margin: auto;">
					<xfl-select
						:list="list"
						:clearable="false"
						:showItemNum="5"
						:listShow="false"
						:isCanInput="false"
						:style_Container="'height: 100upx; font-size: 16px;'"
						:placeholder="'请选择'"
						:initValue="formData['name'] ? formData['name'] : ''"
						:selectHideType="'hideAll'"
						@change="selectChange"
					></xfl-select>
				</view>
				<view class="input-box"><input type="text" @change="changeValue" v-model="currentVal" /></view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('cancel')">取消</text>
					<text class="uni-tip-button" @click="cancel('confirm')">确定</text>
				</view>
			</view>
		</uni-popup> -->
    <uni-popup ref="showForm" type="center" :mask-click="false" @change="change" style="z-index: 1026;">
      <view class="uni-tip">
        <view class="cu-form-group margin-top">
          <view class="title">时间</view>
          <input placeholder="请选择时间" v-model="formData.htime" name="input" @click="openTimePicker" disabled />
        </view>
        <view class="cu-form-group" style="height: auto;">
          <view class="title">{{ addType === 'food' ? '食物' : addType === 'sport' ? '运动' : '' }}</view>
          <view style="width: 100%; margin: auto;">
            <xfl-select
              :list="list"
              :clearable="false"
              :showItemNum="5"
              :listShow="false"
              :isCanInput="false"
              :style_Container="'height: 100upx; font-size: 16px;'"
              :placeholder="'请选择'"
              :initValue="formData['name'] ? formData['name'] : ''"
              :selectHideType="'hideAll'"
              @change="selectChange"
            ></xfl-select>
          </view>
          <!-- <input placeholder="请选择" name="input" v-model="formData.name" /> -->
          <!-- <picker @change="PickerChange" :value="pickerIndex" :range="picker" style="z-index: 1201;">
						<view class="picker">
							<input placeholder="请选择" name="input" v-model="formData.name" />
							{{pickerIndex>-1?picker[pickerIndex]:'禁止换行，超出容器部分会以 ... 方式截断'}}
						</view>
					</picker> -->
        </view>
        <view class="cu-form-group">
          <view class="title">数量 ( {{ formData.unit }})</view>
          <input placeholder="请填写数量" name="input" v-model="formData.amount" type="digit" />
          <!-- <input placeholder="单位" name="input" v-model="formData.unit" style="width: 100upx;" type="text" /> -->
        </view>
        <view class="uni-tip-group-button">
          <text class="uni-tip-button" @click="confirm('cancel')">取消</text>
          <text class="uni-tip-button" @click="confirm('confirm')">确定</text>
        </view>
      </view>
    </uni-popup>
    <mx-date-picker
      style="z-index: 1290;"
      :format="dateFormat"
      :show="showTimePicker"
      :type="timeType"
      :value="currentVal"
      :show-tips="true"
      :begin-text="'入住'"
      :end-text="'离店'"
      :show-seconds="true"
      @confirm="onSelected"
      @cancel="onSelected"
    />
  </view>
</template>

<script>
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import xflSelect from '@/components/xfl-select/xfl-select.vue';
import bxform from '@/components/bx-form/bx-form.vue';
var wx = require('jweixin-module');
export default {
  components: { MxDatePicker, xflSelect, bxform },
  data() {
    return {
      addUserInfo: {
        userno: '',
        sex: '',
        birthday: '',
        height: '',
        weight: '',
        job: ''
      },
      field: {},
      configCols: [
        {
          label: '性别',
          column: 'sex',
          value: '',
          type: 'radio',
          isRequire: true,
          isShowExp: [],
          options: ['男', '女']
        },
        {
          label: '生日',
          column: 'birthday',
          value: '',
          type: 'date',
          isRequire: true,
          isShowExp: [],
          options: []
        },
        {
          label: '身高',
          column: 'height',
          value: '',
          type: 'number',
          isRequire: true,
          isShowExp: [],
          options: []
        },
        {
          label: '体重',
          column: 'weight',
          value: '',
          type: 'number',
          isRequire: true,
          isShowExp: [],
          options: []
        },
        {
          label: '职业',
          column: 'job',
          value: '',
          type: 'input',
          isRequire: true,
          isShowExp: [],
          options: []
        }
      ],
      list: [
        //要展示的数据
        '苹果',
        { value: '香蕉', disabled: true },
        '葡萄',
        '芒果',
        '大白菜'
      ],
      refresh: false,
      PageCur: 'basics',
      userInfo: {},
      loginUserInfo: {},
      dietRecord: [],
      sportsRecord: [],
      timeType: 'time',
      showTimePicker: false,
      dateFormat: 'hh:ii:ss',
      timeValue: '',
      dietIn: 0, //饮食摄入
      sportOut: 0, //运动消耗
      editable: false,
      currentType: 'food',
      currentData: [],
      currentColumn: '',
      currentIndex: 0,
      currentVal: null,
      nowDate: this.formateDate(new Date(), 'date'),
      selectDate: this.formateDate(new Date(), 'date'),
      addType: 'food',
      onSelect: '', //新增表单中打开时间选择器时 onSelect为form
      onEditor: '',
      formData: {
        userno: '',
        hdate: this.formateDate(new Date(), 'date'),
        htime: '',
        name: '',
        amount: '',
        unit: '',
        energy: ''
      },
      sportType: [],
      foodType: [],
      pageInfo: { total: 0, pageNo: 1, rownumber: 10 },
      picker: [],
      pickerIndex: -1,
      foodList: [],
      sportList: [],
      wxUserInfo: {},
      unit_energy: '', //当前选项每单位的能量
      KeepDays: '' //保持天数
    };
  },
  watch: {
    timeType(newValue, oldValue) {
      if (newValue === 'time') {
        this.dateFormat = 'hh:ii:ss';
      } else if (newValue === 'date') {
        this.dateFormat = 'yyyy-mm-dd';
      }
    }
  },
  computed: {
    energyChange() {
      if (this.dietIn && this.sportOut && this.basicOut) {
        return Number(this.dietIn) - Number(this.sportOut) - Number(this.basicOut);
      } else if (this.basicOut) {
        return this.basicOut * -1;
      } else {
        return 0;
      }
    },
    age() {
      if (this.userInfo.birthday) {
        let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
        return age;
      }
    },
    basicOut() {
      //基础代谢
      // IF(B4="男",IF(B3>=60,B2*13.4+490,IF(B3>=31,B2*11.5+830,B2*15.2+680)),IF(B3>=60,B2*10.4+600,IF(B3>=31,B2*8.6+830,B2*14.6+450)))
      if (this.userInfo.sex === '男') {
        if (this.age >= 60) {
          return this.userInfo.weight * 13.4 + 490;
        } else if (this.age >= 31 && this.age < 60) {
          return this.userInfo.weight * 11.5 + 830;
        } else {
          return this.userInfo.weight * 15.2 + 600; //<31
        }
      } else {
        if (this.age >= 60) {
          return this.userInfo.weight * 10.4 + 600;
        } else if (this.age >= 31 && this.age <= 60) {
          return this.userInfo.weight * 8.6 + 830;
        } else {
          return this.userInfo.weight * 14 + 450; //<31
        }
      }
      // const age =this.age
      // const sex = this.userInfo.sex
      // const weight = this.userInfo.weight
      // return sex==='男'?age>=60?weight*13.4+490:age>=31&&age<60?weight*11.5+830:weight*15.2+600:age>=60?weight*10.4+600:age>=31&&this.age<=60?weight*8.6+830:weight*14+450
    }
  },
  methods: {
    getKeepDays() {
      let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
      let req = {
        serviceName: 'srvhealth_diet_record_select',
        colNames: ['*'],
        condition: [{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no }],
        group: [
          {
            colName: 'hdate',
            type: 'distinct_count'
          }
        ]
      };
      this.$http.post(url, req).then(res => {
        console.log(res.data.data);
        if (res.data.state === 'SUCCESS') {
          this.KeepDays = res.data.data[0].hdate;
        }
      });
    },
    clickUserForm(type) {
      let itemData = this.$refs.bxform.getFieldModel();
      console.log(itemData);
      if (type === 'cancel') {
        // this.$refs.addUserForm.close();
      } else if (type === 'confirm' && itemData) {
        this.addUser(itemData);
      }
    },
    selectChange(e) {
      console.log(e.newVal);
      if (e.newVal) {
        this.formData['name'] = e.newVal;
        let data = [];
        if (this.addType === 'food') {
          data = this.foodType;
        } else if (this.addType === 'sport') {
          data = this.sportType;
        }
        data.forEach(item => {
          if (item.name === e.newVal) {
            this.unit_energy = item.unit_energy;
            this.formData['unit'] = item.unit;
          }
        });
      }
    },
    PickerChange(e) {
      this.pickerIndex = e.detail.value;
    },
    openTimePicker() {
      this.$refs.showForm.close();
      this.showTimePicker = true;
      this.onSelect = 'form';
      this.timeType = 'time';
      this.dateFormat = 'hh:ii:ss';
    },
    confirm(e) {
      // debugger
      if (e === 'confirm') {
        console.log(this.formData);
        let formData = this.formData;
        if (!formData['name']) {
          uni.showToast({
            title: '请选择' + this.addType === 'food' ? '食物' : '运动类型',
            icon: 'none'
          });
          alert('请选择食物/运动类型');
          return;
        }
        // if (!this.formData['name']) {
        //   uni.showToast({
        //     title: '请选择' + this.addType === 'food' ? '食物' : '运动类型',
        //     icon: 'none'
        //   });
        //   return;
        // }
        if (!formData['amount']) {
          uni.showToast({
            title: '请填写数量',
            icon: 'none'
          });
          alert('请填写数量');
          return;
        }
        if (!formData['htime']) {
          uni.showToast({
            title: '请选择时间',
            icon: 'none'
          });
          alert('请选择时间');
          return;
        }
        this.formData['energy'] = Number(this.formData['amount']) * Number(this.unit_energy);
        this.addData(this.addType);
        // this.$refs.showForm.close();
        // if (this.addType === 'food') {
        // 	this.addData('food');
        // } else if (this.addType === 'sport') {
        // 	this.addData('sport');
        // }
      } else {
        for (let i in this.formData) {
          this.formData[i] = '';
        }
      }
      this.$refs.showForm.close();
    },
    openForm(type) {
      // 新增数据
      this.$refs.showForm.open();
      this.onEditor = 'form';
      if (type === 'diet') {
        this.addType = 'food';
        this.list = this.foodType.map(item => {
          return item.name;
        });
        console.log('this.list ', this.list, this.foodType);
      } else if (type === 'sport') {
        this.addType = 'sport';
        this.list = this.sportType.map(item => {
          return item.name;
        });
        console.log('this.list ', this.list, this.sportType);
      }
    },
    addData(type) {
      uni.showLoading({
        mask: true
      });
      let serviceName = '';
      let url = '';
      if (type === 'food') {
        serviceName = 'srvhealth_diet_record_add';
        url = this.getServiceUrl('health', 'srvhealth_diet_record_add', 'operate');
      } else if (type === 'sport') {
        serviceName = 'srvhealth_body_activity_record_add';
        url = this.getServiceUrl('health', 'srvhealth_body_activity_record_add', 'operate');
        this.formData.energy = this.formData.energy * this.userInfo.weight;
      }
      this.formData['hdate'] = this.selectDate;
      console.log('formData', this.formData);
      let req = [
        {
          serviceName: serviceName,
          condition: [],
          data: [this.formData]
        }
      ];
      this.$http.post(url, req).then(res => {
        console.log(res.data);
        if (res.data.resultCode === 'SUCCESS') {
          uni.hideLoading();
          uni.showToast({
            title: '添加成功',
            icon: 'success'
          });
          let userno = uni.getStorageSync('login_user_info') && uni.getStorageSync('login_user_info').user_no ? uni.getStorageSync('login_user_info').user_no : '';
          if (!userno) {
            uni.showToast({
              title: '未发现user_no',
              icon: 'none'
            });
          }
          this.formData = {
            userno: userno,
            hdate: this.selectDate,
            htime: '',
            name: '',
            amount: '',
            unit: '',
            energy: ''
          };
          // if (type === 'food') {
          this.getDietRecord();
          // } else if (type === 'sport') {
          this.getSportsRecord();
          for (let i in this.formData) {
            this.formData[i] = '';
          }
          // }
        } else {
          uni.showToast({
            title: '添加失败',
            icon: 'none'
          });
        }
      });
    },
    deleteItem(item, type) {
      let self = this;
      uni.showModal({
        title: '提示',
        content: '确定删除此条记录?',
        success(res) {
          if (res.confirm) {
            uni.showLoading({
              mask: true,
              title: '正在删除...'
            });
            let serviceName = '';
            let url = '';
            if (type === 'food') {
              serviceName = 'srvhealth_diet_record_delete';
              url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
            } else if (type === 'sport') {
              serviceName = 'srvhealth_body_activity_record_delete';
              url = self.getServiceUrl('health', 'srvhealth_body_activity_record_delete', 'operate');
            }
            let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: item.id }] }];
            self.$http.post(url, req).then(res => {
              uni.hideLoading();
              if (res.data.resultCode === 'SUCCESS') {
                self.getDietRecord();
                self.getSportsRecord();
                uni.showToast({
                  title: '删除成功!',
                  icon: 'none'
                });
                this.refresh = !this.refresh;
              } else {
                uni.showToast({
                  title: '删除失败!',
                  icon: 'none'
                });
              }
            });
          } else if (res.cancel) {
            uni.showToast({
              title: '取消删除',
              icon: 'none'
            });
          }
        }
      });
    },
    updateData(data, type) {
      let serviceName = '';
      let url = '';
      let req = {};
      let obj = {};
      obj[this.currentColumn] = this.currentVal;
      if (type === 'food') {
        serviceName = 'srvhealth_diet_record_update';
        url = this.getServiceUrl('health', 'srvhealth_diet_record_update', 'operate');
        req = [
          {
            serviceName: 'srvhealth_diet_record_update',
            condition: [{ colName: 'id', ruleType: 'eq', value: data.id }],
            data: [obj]
          }
        ];
        this.$http.post(url, req).then(res => {
          console.log(res.data);
          if (res.data.resultCode === 'SUCCESS') {
            uni.showToast({
              title: '修改成功'
            });
            this.getDietRecord();
          }
        });
      } else if (type === 'sport') {
        serviceName = 'srvhealth_body_activity_record_update';
        url = this.getServiceUrl('health', 'srvhealth_body_activity_record_update', 'operate');
        req = [
          {
            serviceName: 'srvhealth_body_activity_record_update',
            condition: [{ colName: 'id', ruleType: 'eq', value: data.id }],
            data: [obj]
          }
        ];
        this.$http.post(url, req).then(res => {
          console.log(res.data);
          if (res.data.resultCode === 'SUCCESS') {
            uni.showToast({
              title: '修改成功'
            });
            this.getSportsRecord();
          }
        });
      }
    },
    changeDate() {
      // 切换日期
      this.dateFormat = 'yyyy-mm-dd';
      this.timeType = 'date';
      this.currentVal = new Date().getFullYear() + '-' + Number(new Date().getMonth() + 1) + '-' + new Date().getDate();
      this.showTimePicker = true;
    },
    onSelected(e) {
      //时间选择器
      this.showTimePicker = false;
      if (e) {
        // this.dietIn = 0
        // this.sportOut = 0

        this['time'] = e.value;
        //选择的值
        console.log('value => ' + e.value);
        //原始的Date对象
        console.log('date => ' + e.date);
        if (this.timeType === 'time') {
          if (this.onSelect === 'form') {
            this.formData['htime'] = e.value;
            this.onSelect = '';
            this.$refs.showForm.open();
          } else {
            const data = this.currentData;
            const index = this.currentIndex;
            let val = e.value;
            data[index][this.currentColumn] = val;
            if (this.currentType === 'food') {
              this.$set(this.dietRecord, index, data[index]);
            } else if (this.currentType === 'sport') {
              this.$set(this.sportsRecord, index, data[index]);
            }
          }
        } else if (this.timeType === 'date') {
          this.selectDate = e.value;
          this.getDietRecord();
          this.getSportsRecord();
        }
      } else if (this.onSelect === 'form') {
        this.$refs.showForm.open();
      }
    },
    cancel(type) {
      //popup弹出层点击事件
      if (type === 'confirm') {
        const data = this.currentData;
        const index = this.currentIndex;
        let val = this.currentVal;
        data[index][this.currentColumn] = val;
        console.log('item', data[index]);
        if (this.currentType === 'food') {
          this.$set(this.dietRecord, index, data[index]);
          this.updateData(data[index], 'food');
        } else if (this.currentType === 'sport') {
          this.$set(this.sportsRecord, index, data[index]);
          this.updateData(data[index], 'sport');
        }
      }
      this.$refs.showtip.close();
    },
    changeValue(val) {
      console.log(val);
    },
    change(e) {
      // let val = this.currentVal;
      // let item = this.currentData[this.currentIndex][this.currentColumn];
      // this.$set(this.currentData, this.curr);
      // console.log('是否打开:' + e.show);
    },
    openPopup(data, index, colName, type) {
      if (data.length > 0) {
        console.log(data, index, colName);
        this.currentData = data;
        this.currentColumn = colName;
        this.currentIndex = index;
        this.currentType = type;
        this.currentVal = data[index][colName];
        if (colName === 'htime') {
          this.dateFormat = 'hh:ii:ss';
          this.timeType = 'time';
          this.showTimePicker = true;
        } else {
          this.$nextTick(() => {
            this.$refs.showtip.open();
          });
        }
      }
    },
    async getBaseInfo() {
      // 使用user_no查找基本信息
      uni.showLoading({
        mask: true
      });
      let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
      // let user_no = 'okMrXs-zyQb_v-wkKRC4ClS8dviA';
      // this.loginUserInfo.user_no = user_no;

      let req = {
        serviceName: 'srvhealth_person_info_select',
        condition: [{ colName: 'userno', ruleType: 'eq', value: this.loginUserInfo.user_no }],
        colNames: ['id', 'userno', 'sex', 'birthday', 'height', 'weight', 'job']
      };
      let res = await this.$http.post(url, req);
      uni.hideLoading();
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        this.userInfo = res.data.data[0];
        this.getDietRecord();
        this.getSportsRecord();
        this.getSportType();
        this.getFoodType();
      } else if (res.data.data.length === 0) {
        //没有查到用户信息
        this.$refs.addUserForm.open();
        // this.addUser();
      }
    },
    async addUser(itemData) {
      if (itemData) {
        let data = { userno: this.loginUserInfo.user_no };
        data = Object.assign(data, itemData);
        let url = this.getServiceUrl('health', 'srvhealth_person_info_add', 'operate');
        let req = [{ serviceName: 'srvhealth_person_info_add', condition: [], data: [data] }];
        let res = await this.$http.post(url, req);
        this.$refs.addUserForm.close();
        if (res.data.state === 'SUCCESS') {
          uni.showToast({
            title: '提交成功'
          });
          this.getBaseInfo();
        } else {
          uni.showToast({
            title: '提交失败',
            icon: 'none'
          });
        }
      } else {
        uni.showToast({
          title: '表单填写不完整'
        });
      }
    },
    async getDietRecord() {
      //饮食记录
      let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
      let req = {
        serviceName: 'srvhealth_diet_record_select',
        colNames: ['*'],
        condition: [{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no }, { colName: 'hdate', ruleType: 'like', value: this.selectDate.trim() }],
        page: { pageNo: 1, rownumber: 10 },
        order: []
      };
      let res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        console.log(res.data.data);
        res.data.data.forEach(item => {
          item['editable'] = false;
        });
        this.dietRecord = res.data.data;
        let dietIn = 0;
        res.data.data.forEach(item => {
          dietIn += item.energy;
        });
        this.dietIn = dietIn;
      } else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
        this.dietRecord = [];
        this.dietIn = 0;
      }
      this.refresh = !this.refresh;
    },
    async getSportsRecord() {
      // 运动记录
      let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
      let req = {
        serviceName: 'srvhealth_body_activity_record_select',
        colNames: ['*'],
        condition: [{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no }, { colName: 'hdate', ruleType: 'like', value: this.selectDate.trim() }],
        page: { pageNo: 1, rownumber: 10 },
        order: []
      };
      let res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        console.log(res.data.data);
        this.sportsRecord = res.data.data.map(item => {
          // item.energy = item.energy * this.userInfo.weight
          return item;
        });
        let sportOut = 0;
        res.data.data.forEach(item => {
          sportOut = item.energy * item.amount + sportOut;
          console.log(item, this.userInfo.weight, 'sportOut');
          item['editable'] = false;
        });
        this.sportOut = sportOut;
      } else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
        this.sportsRecord = [];
        this.sportOut = 0;
      }
      this.refresh = !this.refresh;
    },
    async getFoodType() {
      // 食物类型
      let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
      let req = { serviceName: 'srvhealth_diet_contents_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 10 }, order: [] };
      let res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        console.log(res.data.data);
        this.foodType = res.data.data;
      }
      this.refresh = !this.refresh;
    },
    async getSportType() {
      // 运动类型
      let url = this.getServiceUrl('health', 'srvhealth_body_activity_contents_select', 'select');
      let req = { serviceName: 'srvhealth_body_activity_contents_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 10 }, order: [] };
      let res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        console.log(res.data.data);
        this.sportType = res.data.data;
      }
      this.refresh = !this.refresh;
    },
    NavChange(e) {
      this.PageCur = e.currentTarget.dataset.cur;
    },
    async getUserInfo() {
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
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        const userInfo = res.data.data[0];
        this.wxUserInfo = userInfo;
        this.getSignature();
      }
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
            value: linkurl
            // value: window.location + ''
          }
        ]
      };
      console.log('linkurl', linkurl);
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
            jsApiList: [
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareWeibo',
              'onMenuShareQQ',
              'onMenuShareQZone'
            ]
          });
          wx.ready(() => {
            console.log('wx.ready()', self.wxUserInfo);
            // alert(JSON.stringify(self.wxUserInfo))
            // alert(JSON.stringify(self.formData))
            wx.updateAppMessageShareData({
              //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
              imgUrl: self.wxUserInfo.headimgurl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              desc: '均衡饮食', // 摘要,如果分享到朋友圈的话，不显示摘要。
              title: '均衡饮食', // 分享卡片标题
              // link:  window.location.href, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              success: function() {
                // 分享成功后的回调函数
                // //// alert('分享成功')
                // self.saveShareRecord('朋友');
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // //// alert('分享失败')
              }
            }); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            wx.updateTimelineShareData({
              imgUrl: self.formData.fileUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              desc: '均衡饮食', // 摘要,如果分享到朋友圈的话，不显示摘要。
              title: '均衡饮食', // 分享卡片标题
              link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              success: function() {
                // 分享成功后的回调函数
                // //// alert('分享成功')
                // self.saveShareRecord('朋友圈');
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // //// alert('分享失败')
              }
            });
          });
          wx.error(function(res) {
            uni.showModal({
              title: '提示',
              content: JSON.stringify(res),
              success() {}
            });
          });
        } else {
          uni.showToast({
            title: '获取签名失败',
            icon: 'none'
          });
        }
      });
    },
    initLogin() {
      let that = this;
      let code = null;
      // code = this.getParams('code');
      // 公众号环境
      code = this.$route.query.code;
      console.log('code:', code);
      let isWeixinClient = this.isWeixinClient();
      console.log('是否微信环境', isWeixinClient);
      if (isWeixinClient) {
        //微信环境
        if (code) {
          // 已经得到code,进行验证登录
          alert('已获取到code,即将进行验证登录');
          this.saveWxUser();
        } else {
          //公众号 未授权 -> 获取授权
          alert('未发现code,尝试获取重定向链接');
          that.getAuthorized();
        }
      } else if (!isWeixinClient) {
        // 非微信环境(H5或APP)
        uni.showToast({
          title: '请在微信中访问此页面',
          icon: 'none',
          duration: 3000
        });
      }
    },
    async getAuthorized() {
      // 公众号环境获取回调地址(在回调地址中获取code)
      let url = this.getServiceUrl('wx', 'srvwx_public_page_authorization', 'operate');
      let req = [
        {
          data: [
            {
              app_no: this.$api.appNo.wxh5,
              redirect_uri: window.location.href
            }
          ],
          serviceName: 'srvwx_public_page_authorization'
        }
      ];
      let response = await this.$http.post(url, req);
      console.log('response:', response);
      if (response.data.response[0].response.authUrl) {
        alert('redirctUrl:' + response.data.response[0].response.authUrl);
        window.location.href = response.data.response[0].response.authUrl;
      } else {
        uni.showToast({
          title: response.data.resultMessage,
          icon: 'none'
        });
      }
    },
    saveWxUser() {
      // 静默登录(验证登录)
      let that = this;
      let req = [
        {
          data: [
            {
              code: that.$route.query.code,
              app_no: that.$api.appNo.wxh5
            }
          ],
          serviceName: 'srvwx_app_login_verify'
        }
      ];
      const url = this.getServiceUrl('wx', 'srvwx_app_login_verify', 'operate');
      this.$http.post(url, req).then(response => {
        if (response.data.resultCode === 'SUCCESS' && response.data.response[0].response) {
          console.log('授权成功', response);
          let resData = response.data.response[0].response;
          let expire_timestamp = parseInt(new Date().getTime() / 1000) + resData.expire_time; //过期时间的时间戳(秒)
          uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
          uni.setStorageSync('expire_time', resData.expire_time); // 有效时间
          uni.setStorageSync('expire_timestamp', expire_timestamp); // 过期时间
          if (resData.login_user_info.user_no) {
            uni.setStorageSync('login_user_info', resData.login_user_info);
            console.log('resData.login_user_info', resData.login_user_info);
          }
          if (resData.login_user_info.data) {
            uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
          }
          uni.setStorageSync('isLogin', true);
          uni.showToast({
            title: '授权成功',
            icon: 'none'
          });
          this.getBaseInfo();
          this.getUserInfo();
        } else {
          uni.setStorageSync('isLogin', false);
          console.log('授权失败');
          uni.showToast({
            title: '授权失败',
            icon: 'none'
          });
          alert('授权失败' + JSON.stringify(response));
        }
      });
    }
  },
  onLoad() {
    let userInfo = uni.getStorageSync('login_user_info');
    if (userInfo && userInfo.user_no) {
      this.formData.userno = userInfo.user_no;
      // alert('login_user_info：' + JSON.stringify(userInfo));
      this.loginUserInfo = userInfo;
      this.getBaseInfo();
      this.getUserInfo();
      this.getKeepDays();
      uni.showToast({
        title: '已登录，正在获取数据',
        icon: 'none'
      });
    } else {
      this.getBaseInfo();
      alert('未发现登录用户信息');
    }
    // let isLogin = uni.getStorageSync('isLogin');
    // if (isLogin === true) {
    // 	let userInfo = uni.getStorageSync('login_user_info');
    // 	if (userInfo && userInfo.user_no) {
    // 		alert('login_user_info：' + JSON.stringify(userInfo));
    // 		this.loginUserInfo = userInfo;
    // 		this.getBaseInfo();
    // 		this.getUserInfo();
    // 		uni.showToast({
    // 			title: '已登录，正在获取数据',
    // 			icon: 'none'
    // 		});
    // 	} else {
    // 		alert('未发现登录用户信息');
    // 	}
    // } else {
    // 	uni.showToast({
    // 		title: '未登录，正在登录...',
    // 		icon: 'none'
    // 	});
    // 	// this.loginUserInfo['user_no'] = 'okMrXs-zyQb_v-wkKRC4ClS8dviA';
    // 	// this.getBaseInfo();
    // 	// this.initLogin();
    // 	// uni.navigateTo({
    // 	// 	url: '../accountExec/accountExec?backUrl=' + encodeURIComponent('../balancedDiet/balancedDiet')
    // 	// });
    // }
  }
};
</script>

<style lang="scss">
.balanced-diet {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  margin: 0 auto;
  padding-top: 40upx;
  box-sizing: border-box;
  .headline {
    font-size: 40upx;
    height: 80upx;
    font-weight: 600;
    text-align: center;
  }
  .top {
    display: flex;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto;
    .top-item {
      display: flex;
      flex-wrap: wrap;
      height: 150upx;
      justify-content: space-between;
      align-items: center;
      &:first-child {
        width: 150upx;
        height: 150upx;
        .head-img {
          width: 100%;
          height: 100%;
          border-radius: 10upx;
        }
      }
      &:nth-child(2) {
        flex: 1;
        margin: 0 20upx;
      }
      &:last-child {
        width: 200upx;
        justify-content: space-around;
      }
      .info {
        width: 45%;
        text-align: center;
        height: 50upx;
        line-height: 50upx;
      }
      .top-item-bottom {
        display: flex;
        display: flex;
        justify-content: center;
        align-items: center;
        .the-date {
          padding: 0 10upx;
        }
      }
    }
  }
  .main-box {
    display: flex;
    flex-direction: column;
    border-radius: 10upx;
    box-sizing: border-box;
    width: 95%;
    margin: 0 auto;
    animation: show 1.2s ease 0s 1 normal none running;
    .main-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .main-title {
      border-left: 2px solid #f43f3b;
      // height: 80upx;
      // line-height: 80upx;
      margin: 20upx 0 20upx 0;
      font-size: 34upx;
      font-weight: 600;
      text-indent: 10upx;
      // background-color: rgba($color: #999, $alpha: 0.3);
    }
    .main-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 150upx;
      margin-bottom: 10upx;
      border-radius: 10upx;
      padding: 10upx;
      box-sizing: border-box;
      .energy-item {
        min-height: 100upx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .text {
          font-size: 20upx;
        }
        .number {
          font-size: 30upx;
          text-align: center;
        }
        .text-red {
          color: #red;
        }
        .units {
          padding-left: 10upx;
          font-size: 20upx;
          color: #000;
        }
      }
      .operate {
        font-size: 60upx;
        font-weight: 600;
        width: 60upx;
        text-align: center;
      }
      .table {
        width: 100%;
        .row {
          .readonly {
            width: 100%;
            display: flex;
            min-height: 60upx;
            align-items: center;
            .column {
              // text-indent: 20upx;
              flex: 1;
              // text-align: left;
              display: flex;
              .units {
                flex: 1;
              }
              &:nth-child(3) {
                flex: 0.7;
                display: flex;
                justify-content: center;
              }
              &:nth-child(4) {
                flex: 0.7;
                display: flex;
                justify-content: center;
              }
              &:nth-child(5) {
                flex: 0.3;
              }
              // input{
              // 	width: 100%;
              // }
            }
          }
        }
      }
    }
  }
  /* 提示窗口 */
  .uni-tip {
    /* #ifndef APP-NVUE */
    display: flex;
    flex-direction: column;
    /* #endif */
    padding: 15px;
    width: 300px;
    background-color: #fff;
    border-radius: 10px;
    input {
      // border: 2px solid #999;
      // height: 60upx;
      // border-radius: 10upx;
    }
    .title {
      width: auto;
    }
    .cu-form-group + .cu-form-group {
      border-top: none;
    }
  }

  .uni-tip-title {
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
  }

  .uni-tip-content {
    // padding: 15px;
    font-size: 14px;
    color: #666;
  }

  .uni-tip-group-button {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    margin-top: 20px;
    background-color: #fff;
  }

  .uni-tip-button {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #3b4144;
  }
  .cu-form-group {
    background-color: #fff;
    width: 100%;
    height: 150upx;
  }
}
@keyframes show {
  0% {
    -webkit-transform: translateY(-50px);
    transform: translateY(-50px);
  }

  60% {
    -webkit-transform: translateY(20px);
    transform: translateY(20px);
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
  }
}
</style>
