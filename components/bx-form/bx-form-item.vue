<template>
  <view>
    <view class="cu-form-group " v-if="fieldData.display">
      <view class="title text-blue" :class="!valid.valid ? 'valid_error' : ''">
        <text class="text-red text-shadow" v-show="fieldData.isRequire">*</text>
        {{ fieldData.label }}:
        <text v-show="!valid.valid">({{ valid.msg }})</text>
      </view>
      <view v-if="pageFormType === 'detail'">
        <text class="text-bold text-xl" v-if="pageFormType === 'detail' && fieldData.type !== 'images' && fieldData.type !== 'snote' && fieldData.type !== 'Note'">
          {{ fieldData.value }}
        </text>
        <!-- JSON.parse(JSON.stringify(fieldData.value).replace(/\<img/gi, '<img width=100% height=100%   ')) -->
        <view
          v-html="JSON.parse(JSON.stringify(fieldData.value).replace(/\<img/gi, '<img width=100% height=100%   '))"
          v-if="pageFormType === 'detail' && (fieldData.type === 'snote' || fieldData.type === 'Note')"
        ></view>
        <view class="" v-else-if="pageFormType === 'detail' && fieldData.type === 'images'">
          <image
            v-if="fieldData.type === 'images'"
            v-for="(item, index) in imagesUrl"
            :key="index"
            style="padding: 5upx;"
            class="cu-avatar radius lg"
            @tap="showModal(index, 'Image')"
            data-target="Image"
            :src="item"
          ></image>
        </view>
      </view>

      <view class="" v-if="pageFormType === 'form' || pageFormType === 'add' || pageFormType === 'update'">
        <radio-group @change="radioChange" v-if="fieldData.type === 'radio'" :class="!valid.valid ? 'valid_error' : ''">
          <radio
            :key="index"
            :disabled="fieldData.disabled ? fieldData.disabled : false"
            v-for="(itema, index) in fieldData.options"
            class="radio"
            :checked="itema === fieldData.value"
            :value="itema"
          >
            <span style="flex: 1;">{{ itema }}</span>
          </radio>
        </radio-group>
        <radio-group @change="radioChange" v-else-if="fieldData.type === 'radioFk'" :class="!valid.valid ? 'valid_error' : ''">
          <!-- <label class="uni-list-cell uni-list-cell-pd" :key="itema.value"
		    v-for="(itema, index) in fieldData.options">
				<view>
					<radio :value="itema.value" :checked="index === current" />
				</view>
				<view>{{itema.label}}</view>
			</label> -->
          <radio
            :key="index"
            v-for="(itema, index) in fieldData.options"
            class="radio"
            :disabled="fieldData.disabled ? fieldData.disabled : false"
            :checked="itema.value === fieldData.value"
            :value="itema.value"
          >
            <span style="flex: 1;">{{ itema.label }}</span>
          </radio>
        </radio-group>
        <checkbox-group name="checkbox-group" class="checkbox-group" @change="radioChange" v-else-if="fieldData.type === 'checkbox'" :class="!valid.valid ? 'valid_error' : ''">
          <label v-for="(item, index) in fieldData.options" :key="index" class="checkbox">
            <checkbox
              :value="item"
              :disabled="fieldData.disabled ? fieldData.disabled : false"
              :checked="fieldData.value !== undefined && iArray(fieldData.value) ? fieldData.value.includes(item) : false"
            />
            <text style="flex: 1;">{{ item }}</text>
          </label>
        </checkbox-group>
        <checkbox-group name="checkbox-group" class="checkbox-group" @change="radioChange" v-else-if="fieldData.type === 'checkboxFk'" :class="!valid.valid ? 'valid_error' : ''">
          <label v-for="(item, index) in fieldData.options" :key="index" class="checkbox">
            <checkbox
              :value="item.key"
              :disabled="fieldData.disabled ? fieldData.disabled : false"
              :checked="fieldData.value !== undefined && iArray(fieldData.value) ? fieldData.value.includes(item.key) : false"
            />
            <!-- fieldData.value.includes(item) -->
            <text style="flex: 1;">{{ item.label }}</text>
          </label>
        </checkbox-group>
        <!-- <view v-else-if="fieldData.type === 'images'" style="width: 100%;">
					<image style="width: 100%;" v-for="(item,index) in imagesUrl" :key="index" :src="item" mode="aspectFit"></image>
				</view> -->
        <view v-else-if="fieldData.type === 'images'">
          <robby-image-upload
            :value="imagesUrl"
            :enable-del="fieldData.disabled ? !fieldData.disabled : true"
            :enable-add="fieldData.disabled ? !fieldData.disabled : true"
            :server-url="upLoadUrl"
            @delete="deleteImage"
            @add="getImageInfo"
            :form-data="formData"
            :header="reqHeader"
            :showUploadProgress="true"
            :server-url-delete-image="deleteFileUrl"
            :limit="fieldData.fileNum"
          ></robby-image-upload>
        </view>
        <textarea
          style="min-height: 60px;"
          :maxlength="fieldData.item_type_attr && fieldData.item_type_attr.max_len ? fieldData.item_type_attr.max_len : 100"
          @blur="onInputBlur"
          auto-height
          v-model="fieldData.value"
          @input="onInputChange"
          :disabled="fieldData.disabled ? fieldData.disabled : false"
          :class="!valid.valid ? 'valid_error' : ''"
          v-else-if="fieldData.type === 'textarea' && showTextarea"
          :placeholder="'输入' + fieldData.label"
        ></textarea>
        <bx-editor
          :field="fieldData"
          v-if="(fieldData.type === 'snote' || fieldData.type === 'Note') && !fieldData.disabled"
          ref="bxEditor"
          @fieldData-value-changed="editorValueChange"
        ></bx-editor>
        <view
          class="content padding-0"
          style="padding:0;width: 100%!important;flex-direction: column;position: relative;"
          v-else-if="fieldData.type === 'date' || fieldData.type === 'dateTime' || fieldData.type === 'time'"
        >
          <input
            @blur="onInputBlur"
            @input="onInputChange"
            v-model="fieldData.value"
            disabled
            class="date-input"
            @click.stop="fieldData.disabled ? false : toggleTab(fieldData.type)"
            :placeholder="'请选择' + fieldData.label"
            :class="!valid.valid ? 'valid_error' : ''"
            style="width: 100%;"
            name="input"
          />
          <text
            class="input-icon cuIcon-calendar text-gray"
            style="position: absolute;top:20upx;right: 20upx;"
            @click.stop="fieldData.disabled ? false : toggleTab(fieldData.type)"
          ></text>

          <w-picker mode="date" startYear="1900" endYear="2030" :current="false" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#f00"></w-picker>
          <w-picker mode="yearMonth" startYear="1900" endYear="2030" :current="false" @confirm="onConfirm" :disabledAfter="false" ref="yearMonth" themeColor="#f00"></w-picker>
          <w-picker mode="dateTime" startYear="1900" endYear="2030" step="1" :current="false" @confirm="onConfirm" ref="dateTime" themeColor="#f00"></w-picker>
          <w-picker mode="time" :current="false" @confirm="onConfirm" ref="time" step="1"></w-picker>
        </view>
        <!-- fieldData.type === 'list' -->
        <view v-else-if="fieldData.type === 'list'">
          <view class="cu-list menu card-menu ">
            <view class="cu-item" v-for="(item, index) in optionsDatasRun" :key="index">
              <view class="content solid">
                <text class="cuIcon-tagfill text-blue  margin-right-xs" :class="{ 'text-green': '' }">{{ index + 1 }}</text>
                <input
                  class="input-sm"
                  type="text"
                  placeholder="请输入"
                  v-model="item['model'][fieldData.optionsConfig['key_col']['value']]"
                  @input="changeVal(item, optionsDatas[index], index)"
                />
              </view>
              <view class="buttons">
                <view
                  v-if="item.type !== 'draft' && optionsDatasRun[index]['valueChanged']"
                  class="cu-btn  bg-green light"
                  style="height:2.4em;min-height: 1.6em;line-height: 1.6em;"
                  @click="addListOptions(index, 'update')"
                >
                  修改
                </view>
                <view v-if="item.type === 'draft'" class="cu-btn  bg-blue light" style="height:2.4em;min-height: 1.6em;line-height: 1.6em;" @click="addListOptions(index, 'add')">
                  添加
                </view>
                <view v-if="item.type !== 'draft'" class="cu-btn  bg-orange light" style="height:2.4em;min-height: 1.6em;line-height: 1.6em;" @click="deleteListOptions(index)">
                  删除
                </view>
              </view>
            </view>
          </view>
        </view>
        <input
          @blur="onInputBlur"
          type="number"
          :placeholder="'输入' + fieldData.label"
          @input="onInputChange"
          :max="fieldData.item_type_attr && fieldData.item_type_attr.max ? fieldData.item_type_attr.max : 999"
          :min="fieldData.item_type_attr && fieldData.item_type_attr.min ? fieldData.item_type_attr.min : 0"
          v-model="fieldData.value"
          :class="!valid.valid ? 'valid_error' : ''"
          name="input"
          :disabled="fieldData.disabled ? fieldData.disabled : false"
          v-else-if="fieldData.type === 'number'"
        />
        <input
          @blur="onInputBlur"
          type="digit"
          :placeholder="'输入' + fieldData.label"
          @input="onInputChange"
          :disabled="fieldData.disabled ? fieldData.disabled : false"
          :max="fieldData.item_type_attr && fieldData.item_type_attr.max ? fieldData.item_type_attr.max : 999"
          :min="fieldData.item_type_attr && fieldData.item_type_attr.min ? fieldData.item_type_attr.min : 0"
          v-model="fieldData.value"
          :class="!valid.valid ? 'valid_error' : ''"
          name="input"
          v-else-if="fieldData.type === 'digit' || fieldData.type === 'Float'"
        />
        <view v-else-if="fieldData.type === 'treeSelector'">
          <bxTreeSelector
            ref="bxTreeSelector"
            :isMultiple="false"
            :defaultValue="fieldData.value"
            :options="fieldData.option_list_v2"
            :fieldsModel="fieldsModel"
            @on-tree-change="onTreeSelector"
          ></bxTreeSelector>
        </view>
        <view v-else-if="fieldData.type === 'cascader'" @click="openCascader">
          <input :placeholder="'点击选择' + fieldData.label" v-model="fieldData.value" disabled :class="!valid.valid ? 'valid_error' : ''" name="input" />
        </view>
        <view class="item-group flex align-center" style="" v-else-if="fieldData.type === 'input'">
          <input
            @blur="onInputBlur"
            :maxlength="fieldData.item_type_attr && fieldData.item_type_attr.max_len ? fieldData.item_type_attr.max_len : 100"
            :disabled="fieldData.disabled ? fieldData.disabled : false"
            :placeholder="'输入' + fieldData.label"
            v-model="fieldData.value"
            @input="onInputChange"
            :class="!valid.valid ? 'valid_error' : ''"
            name="input"
            type="text"
          />
          <!-- <button
            class="cu-btn bg-green shadow input-button"
            v-if="fieldData.buttons && fieldData.buttons.length > 0"
            :key="index"
            v-for="(btn, index) in fieldData.buttons"
            @click.stop="onButtons(fieldData, btn)"
          >
            {{ btn.name }}
          </button> -->
        </view>

        <!-- 字段按钮组 -->
        <block v-if="fieldData.buttons && fieldData.buttons.length > 0">
          <view class="grid text-center col-4">
            <view class="padding-sm line-blue" @click.stop="onButtons(fieldData, btn)" :key="index" v-for="(btn, index) in fieldData.buttons">
              <text :class="btn.icon"></text>
              {{ btn.name }}
            </view>
          </view>
        </block>
      </view>
    </view>
    <view class="cu-modal" :class="modalName == 'Image' ? 'show' : ''" @tap="hideModal">
      <view class="cu-dialog" style="height: 100vh;width:100vw;z-index: 999999;">
        <view class="bg-img" :style="'background-image: url(' + imagesUrl[imageIndex] + ');height:100%;background-size:100%;'">
          <view class="cu-bar justify-end text-blue">
            <view class="action" @tap="hideModal"><text class="cuIcon-close text-blue"></text></view>
          </view>
        </view>
        <!-- <view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">关闭</view>
				</view> -->
      </view>
    </view>

    <uni-popup ref="popup" type="bottom" @change="changePopup">
      <cascader-selector @getCascaderValue="getCascaderValue" :srvInfo="fieldData.srvInfo" :defaultLineVal="defaultLineVal"></cascader-selector>
    </uni-popup>
  </view>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker.vue';
import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue';
import cascaderSelector from '@/components/cascader/cascaderSelector.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import bxTreeSelector from '@/components/bx-tree-selector/bx-tree-selector.vue';
import bxEditor from '@/components/ueditor/ueditor.vue';
let _this = null;
export default {
  name: 'bxFormItem',
  components: {
    wPicker,
    robbyImageUpload,
    cascaderSelector,
    uniPopup,
    bxEditor,
    bxTreeSelector
  },
  props: {
    field: {
      type: Object,
      default() {
        return {};
      }
    },
    pageFormType: {
      type: String,
      default: 'form'
    },
    showTextarea: {
      type: Boolean,
      default: true
    },
    fieldsModel: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  name: 'formItem',
  data() {
    return {
      defaultLineVal: '',
      imageIndex: null,
      modalName: null,
      formData: {
        serviceName: 'srv_bxfile_service',
        interfaceName: 'add',
        app_no: '',
        table_name: '',
        columns: ''
      },
      fieldModelsData: this.fieldsModel,
      reqHeader: null,
      fieldData: this.field,
      valid: {
        column: this.field.column,
        valid: true,
        msg: '不能为空!'
      },
      deleteFileUrl: this.$api.deleteFile,
      upLoadUrl: this.$api.upload,
      imagesUrl: [],
      title: 'Hello',
      startYear: new Date().getFullYear(),
      optionsDatas: [],
      listModel: {},
      listRedundance: [],
      showOptionsList: false
    };
  },
  updated() {},
  computed: {
    showOptionsListRun: function() {
      return this.showOptionsList;
    },
    redundance: function() {
      if (this.fieldData.type === 'list') {
        let colKey = this.fieldData.optionsConfig.conditions;
        let colKeys = colKey.map((item, index) => {
          return item.value;
        });
        return colKeys;
      }
    },
    listChildModel: {
      get: function() {
        let self = this;
        if (self.fieldData.type === 'list') {
          let listItemModel = self.deepClone(self.fieldData.optionsConfig.model);
          let colKey = self.fieldData.optionsConfig.conditions;
          for (let i = 0; i < colKey.length; i++) {
            listItemModel[colKey[i].colName] = self.fieldModelsData[colKey[i].value];
          }
          let req = {
            type: 'draft',
            model: listItemModel
          };
          self.listModel = self.deepClone(req);
          return self.listModel;
        }
      },
      set: function(v) {
        this.listModel = v;
      }
    },
    fieldModelsDataRun() {
      return this.fieldModelsData;
    },
    optionsDatasRun: function() {
      let datas = this.deepClone(this.optionsDatas);
      datas.push(this.deepClone(this.listChildModel));
      return datas;
    }
  },
  updated() {},
  created() {
    this.fieldData = this.field;
    this.reqHeader = {
      bx_auth_ticket: uni.getStorageSync('bx_auth_ticket')
    };
    if (this.fieldData.type === 'images') {
      (this.formData = {
        serviceName: 'srv_bxfile_service',
        interfaceName: 'add',
        app_no: '',
        table_name: '',
        columns: ''
      }),
        (this.formData['app_no'] = this.fieldData.srvInfo.appNo);
      // this.formData['table_name'] = this.fieldData.srvInfo.tableName;
      this.formData['columns'] = this.fieldData.column;
      if (this.fieldData.value !== '' && this.fieldData.value !== null && this.fieldData.value !== undefined) {
        this.formData['file_no'] = this.fieldData.value;
      }
    }
    if (this.fieldData.type === 'cascader') {
      this.formData['serviceName'] = this.fieldData.srvInfo.serviceName;
      this.formData['app_no'] = this.fieldData.srvInfo.appNo;
    }
    if (this.fieldData.type === 'list') {
      if (this.fieldData.options && this.fieldData.options.length > 0) {
        this.optionsDatas = this.fieldData.options.map((item, index) => {
          let obj = {
            model: item,
            type: 'update'
          };
          return obj;
        });
      }
    }
    this.getDefVal();
    // console.log(this.fieldData.label + this.pageFormType + this.fieldData.value);
  },
  // onShow() {
  // 	this.fieldData = this.field;
  // 	this.getDefVal()
  // },
  methods: {
    editorValueChange(name, e) {
      this.fieldData.value = e.value;
      e.column = e.info.name;
      console.log(e);
      this.$emit('on-value-change', e);
    },
    changeVal(newval, oldval, index) {
      // list中input绑定的值改变时触发
      setTimeout(() => {
        if (this.optionsDatasRun[index] && this.optionsDatas[index]) {
          let newValue = this.optionsDatasRun[index]['model'][this.fieldData.optionsConfig['key_col']['value']];
          let oldValue = this.optionsDatas[index]['model'][this.fieldData.optionsConfig['key_col']['value']];
          if (newValue !== oldValue) {
            this.$set(this.optionsDatas[index], 'valueChanged', true);
          } else {
            this.$set(this.optionsDatas[index], 'valueChanged', false);
          }
        }
      }, 0);
    },
    addListOptions(index, type) {
      let self = this;
      let sers = this.fieldData.optionsConfig.addServiceName;
      let app = this.fieldData.optionsConfig.appNo;
      let datas = this.optionsDatasRun[index]['model'];
      // this.optionsDatasRun[index]

      for (let key in this.redundance) {
        datas[this.redundance[key]] = this.fieldModelsDataRun[this.redundance[key]];
      }
      if (this.fieldData.optionsConfig['key_col'].hasOwnProperty('no')) {
        datas[this.fieldData.optionsConfig['key_col'].no] = index + 1;
      }
      let req = [
        {
          serviceName: sers,
          data: [datas]
        }
      ];
      if (self.optionsDatasRun[index]['type'] === 'draft' && type === 'add') {
        this.onRequest('add', sers, req, app).then(res => {
          if (res.data.state === 'SUCCESS') {
            self.optionsDatasRun[index]['type'] = 'update';
            self.optionsDatasRun[index]['model'] = res.data.response[0].response.effect_data[0];
            if (!self.optionsDatas[index]) {
              self.optionsDatas.push(self.deepClone(self.optionsDatasRun[index]));
            }
            // self.optionsDatas.push(res.data.data[0])
            console.log('选项添加成功', res.data.response[0].response);
          }
        });
      } else if (type === 'update') {
        // let url = this.getServiceUrl(uni.getStorageSync("activeApp"), srv, optionType)
        // this.$http.post()
        sers = this.fieldData.optionsConfig.updateServiceName;
        console.log('datas', datas);
        let reqData = {
          option_value: datas.option_value
        };
        req = [
          {
            serviceName: sers,
            condition: [{ colName: 'id', ruleType: 'eq', value: datas.id }],
            data: [reqData]
          }
        ];
        let url = this.getServiceUrl(app, sers, 'operate');
        this.$http.post(url, req).then(res => {
          if (res.data.state === 'SUCCESS') {
            self.optionsDatasRun[index]['type'] = 'update';
            self.optionsDatasRun[index]['model'] = res.data.response[0].response.effect_data[0];
            // if (!self.optionsDatas[index]) {
            //   self.optionsDatas.push(self.deepClone(self.optionsDatasRun[index]));
            // }
            this.$set(this.optionsDatas[index], 'valueChanged', false);
            uni.showToast({
              title: res.data.resultMessage
            });
            // self.optionsDatas.push(res.data.data[0])
            console.log('选项修改成功', res.data.response[0].response);
          }
        });
      }

      console.log('保存', index, self.optionsDatasRun[index]);
    },
    deleteListOptions(index) {
      let self = this;
      let sers = self.fieldData.optionsConfig.deleteServiceName;
      let app = self.fieldData.optionsConfig.appNo;
      let key = self.optionsDatas[index]['model'].id;
      let req = [
        {
          serviceName: sers,
          condition: [
            {
              colName: 'id',
              ruleType: 'eq',
              value: key
            }
          ]
        }
      ];
      if (self.optionsDatas[index]['type'] !== 'draft') {
        self.onRequest('delete', sers, req, app).then(res => {
          if (res.data.state === 'SUCCESS') {
            // self.optionsDatasRun[index]["type"]  = "update"
            // self.optionsDatasRun[index]["model"]  = res.data.response[0].response.effect_data[0]
            // if(!self.optionsDatas[index]){
            // self.optionsDatas.push(self.deepClone(self.optionsDatasRun[index]))
            // }
            self.optionsDatas.splice(index, 1);

            // self.optionsDatas.push(res.data.data[0])
            console.log('删除成功', res.data);
          }
        });
      }
    },
    showModal(e, i) {
      this.modalName = i;
      this.imageIndex = e;
    },
    hideModal(e) {
      this.modalName = null;
    },
    deleteImage(e) {
      console.log(e);
    },
    onTreeSelector(e) {
      this.fieldData.value = e;
      this.onInputChange();
      console.log('点击了onTreeSelector', this.fieldData, e);
    },
    getImageInfo(e) {
      let res = JSON.parse(e.allImages[0]);

      this.fieldData.value = res.file_no;
      console.log('图片返回：', e, e.allImages[0], res, this.fieldData.value);
      if (this.fieldData.value !== '' && this.fieldData.value !== null && this.fieldData.value !== undefined) {
        this.formData['file_no'] = this.fieldData.value;
      }
      this.onInputChange();
      this.getDefVal();
    },
    onButtons(e, b) {
      let item = e;
      let button = b;
      this.$emit('on-form-item', { button, item });
    },
    async getDefVal() {
      let self = this;
      // console.log('file:',this.fieldData,this.field)
      if (this.fieldData.type === 'images' && this.fieldData.value !== '') {
        console.log('file:1', this.fieldData, this.field);
        let fileDatas = await self.getFilePath(this.fieldData.value);
        console.log(fileDatas);
        self.imagesUrl = [];
        if (fileDatas) {
          for (let i = 0; i < fileDatas.length; i++) {
            console.log('file:2', self.$api.getFilePath + fileDatas[i].fileurl);

            self.imagesUrl.push(self.$api.getFilePath + fileDatas[i].fileurl);
          }
        }
        console.log('imagesUrl:===>', this.imagesUrl, fileDatas);
      } else if (this.fieldData.type === 'list' && this.fieldData.value !== '') {
        let listItemModel = this.fieldData.optionsConfig.model;
        let colKey = this.fieldData.optionsConfig.conditions;
        for (let i = 0; i < colKey.length; i++) {
          this.$set(this.listModel, colKey[i].colName, this.fieldModelsData[colKey[i].value]);
          this.listModel[colKey[i].colName] = this.fieldModelsData[colKey[i].value];
        }

        console.log('updated', this.fieldModelsData);
        // this.listModel = listItemModel
        // return this.listModel
      }
    },
    radioChange(e) {
      if (this.fieldData.type === 'radioFk' || this.fieldData.type === 'checkboxFk') {
        this.fieldData.value = e.target.value;
      } else {
        this.fieldData.value = e.target.value;
        this.onInputBlur();
        this.$emit('on-value-change', this.fieldData);
        console.log(e.target.value);
        this.getValid();
      }
      console.log('点击选项', this.fieldData.value, e);
    },
    onInputChange() {
      if (this.fieldData.type === 'number' || this.fieldData.type === 'digit') {
        setTimeout(() => {
          if (this.fieldData.item_type_attr && this.fieldData.item_type_attr.max) {
            console.log(this.fieldData.item_type_attr.max, this.fieldData.value);
            if (Number(this.fieldData.value) > Number(this.fieldData.item_type_attr.max)) {
              this.fieldData.value = Number(this.fieldData.item_type_attr.max);
            }
            if (Number(this.fieldData.value) < Number(this.fieldData.item_type_attr.min)) {
              this.fieldData.value = Number(this.fieldData.item_type_attr.min);
            }
          }
        }, 0);
        // this.fieldData.value = Number(this.fieldData.value);
      }
      this.$emit('on-value-change', this.fieldData);
      this.getValid();
    },
    onInputBlur() {
      this.$emit('on-value-blur', this.fieldData);
    },
    getValid: function() {
      // if (this.field.showExp && this.field.isRequire && this.field.value !== '') {
      // 	this.valid.valid = true;
      // } else if (!this.field.showExp || !this.field.isRequire) {
      // 	this.valid.valid = true;
      // } else {
      // 	this.valid.valid = false;
      // }
      // this.fieldData.valid = this.valid;
      if (this.fieldData.isRequire && this.fieldData.value !== '') {
        if (this.fieldData.hasOwnProperty('_validators') && this.fieldData._validators.hasOwnProperty('isType')) {
          this.fieldData.valid = this.fieldData._validators.isType(this.fieldData.value);
          this.valid.valid = true;
        } else {
          this.fieldData.valid = { valid: true, msg: '有效' };
          this.valid.valid = true;
        }
        // this.valid.valid = this.fieldData.valid.valid;
      } else if (this.fieldData.isRequire && this.fieldData.value === '') {
        this.fieldData.valid = { valid: false, msg: this.fieldData.label + '不能为空' };
        this.valid.valid = false;
      } else {
        this.fieldData.valid = { valid: true, msg: '有效' };
        this.valid.valid = true;
      }
      console.log('getValid');
      this.$emit('on-value-change', this.fieldData);
      return this.valid;
    },
    toggleTab(str) {
      console.log('点击', str);
      this.$refs[str].show();
      console.log(this.$refs[str].show());
    },
    onConfirm(val) {
      console.log(val);
      //如果页面需要调用多个mode类型，可以根据mode处理结果渲染到哪里;
      // switch(this.mode){
      // 	case "date":
      // 		break;
      // }
      // this.fieldData.value={...val};
      this.fieldData.value = val.result;
      this.onInputBlur();
    },
    changePopup(e) {
      this.$emit('on-form-item', this.fieldData);
    },
    openCascader() {
      this.defaultLineVal = this.fieldData.value;
      this.$refs.popup.open();
    },
    getCascaderValue(val, btnType) {
      console.log(val);
      if (btnType === 'sure') {
        this.$refs.popup.close();
        if (val) {
          val['column'] = this.fieldData.column;
          this.$emit('get-cascader-val', val);
          if (this.fieldData.srvInfo.column) {
            this.fieldData.value = val[this.fieldData.srvInfo.column];
          } else {
            this.fieldData.value = val.path_name;
          }
        } else {
          this.$emit('get-cascader-val');
        }
      }
    }
  },
  watch: {
    field: {
      handler: function(newValue, oldValue) {
        this.fieldData = newValue;
      },
      deep: true
    },
    fieldData: {
      handler: function(newValue, oldValue) {
        if (newValue.type === 'number') {
          newValue.value = parseInt(newValue.value);
        }
        this.getValid();
        this.getDefVal();
      },
      // immediate:true,
      deep: true
    },
    fieldsModel: {
      handler: function(newValue, oldValue) {
        console.log('fieldsModel--------', newValue);
        //    if(self.fieldData.type === "list"){
        //  let listItemModel =  self.fieldData.optionsConfig.model
        //  let colKey = self.fieldData.optionsConfig.conditions
        //  for(let i = 0;i<colKey.length;i++){
        // 	 listItemModel[colKey[i].colName] = newValue[colKey[i].value]
        //  }
        //  self.listChildModel = listItemModel
        // }
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.input-sm {
  height: 2.4em;
  line-height: 2.4em;
  min-height: 2.4em;
}
.content {
  text-align: left;
  // height: 400upx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
uni-text.input-icon {
  position: relative;
  font-size: 42upx;
  right: 60upx;
}
.tab {
  padding: 20upx 0;
  font-size: 32upx;
}
.tab.active {
  color: #f00;
}
.result {
  margin-top: 100upx;
  font-size: 32upx;
}
.input-button {
  width: 40%;
  margin-left: 20upx;
  display: inline-block;
  height: 100%;
  padding: 10upx;
  font-size: 32upx;
  line-height: 64upx;
}
.item_type_attr {
  width: 100%;
}
.cu-list.card-menu {
  padding: 0;
  margin: 0;
  .cu-item {
    display: flex;
    padding: 0;
    margin: 0;
    justify-content: space-between;
    .content {
      flex: 1;
      max-width: 60%;
    }
    .buttons {
      // flex: 1;
      display: flex;
      justify-content: space-between;
      .cu-btn {
        &:first-child {
          margin-right: 10upx;
        }
      }
    }
  }
}
.cu-form-group .title {
  display: flex;
  align-items: flex-end;
  height: auto;
  margin: 20upx 0 10upx;
}
.cu-card.article > .cu-item .title {
  line-height: normal;
}
uni-checkbox /deep/ .uni-checkbox-input {
  width: 16px !important;
  height: 16px !important;
}
uni-checkbox-group .checkbox {
  display: flex;
  align-items: center;
}
uni-radio::before,
uni-checkbox::before {
  font-family: 'cuIcon';
  content: '\E645';
  position: absolute;
  color: #ffffff !important;
  top: 50%;
  margin-top: -8px;
  right: 2px;
  font-size: 14px;
  line-height: 14px;
  pointer-events: none;
  -webkit-transform: scale(1, 1);
  transform: scale(1, 1);
  -webkit-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
  z-index: 9;
}
uni-radio /deep/ .uni-radio-input {
  margin: 0;
  width: 16px !important;
  height: 16px !important;
}
uni-radio-input /deep/ uni-radio-input-checked {
  width: 16px !important;
  height: 16px !important;
}
uni-radio.radio /deep/ .uni-radio-input-checked::after {
  content: '';
  background-color: transparent;
  display: block;
  position: absolute;
  width: 6px;
  height: 6px;
  z-index: 999;
  top: 0px;
  left: 0px;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 100px;
  border: 4px solid #ffffff !important;
}
</style>
