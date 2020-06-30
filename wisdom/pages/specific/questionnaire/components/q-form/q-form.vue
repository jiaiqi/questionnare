<template>
  <view class="form-wrap">
    <view class="form-item radio">
      <radio-group class="block" @change="RadioChange">
        <view class="cu-form-group margin-top">
          <view class="title">单选操作(radio)</view>
          <radio :class="radio == 'A' ? 'checked' : ''" :checked="radio == 'A' ? true : false" value="A"></radio>
        </view>
      </radio-group>
    </view>
    <view class="form-item checkbox">
      <checkbox-group class="block" @change="CheckboxChange">
      	<view class="cu-form-group margin-top">
      		<view class="title">复选选操作(checkbox)</view>
      		<checkbox :class="checkbox[0].checked?'checked':''" :checked="checkbox[0].checked?true:false" value="A"></checkbox>
      	</view>
      </checkbox-group>
    </view>
    <view class="form-item datePicker">
      
    </view>
    <view class="form-item number">
      <view class="cu-form-group margin-top">
      	<view class="title">邮件</view>
      	<input placeholder="两字短标题" name="input" type="digit"></input>
      </view>
    </view>
    <view class="form-item text">
      <view class="cu-form-group margin-top">
      	<view class="title">邮件</view>
      	<input placeholder="两字短标题" name="input"></input>
      </view>
    </view>
    <view class="form-item file">
      
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      radio: 'A',
      checkbox: [{
      	value: 'A',
      	checked: true
      }, {
      	value: 'B',
      	checked: true
      }, {
      	value: 'C',
      	checked: false
      }],
    };
  },
  methods: {
    RadioChange(){}
  }
};
</script>

<style></style>
