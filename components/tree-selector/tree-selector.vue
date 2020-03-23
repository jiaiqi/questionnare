<template>
  <view class="selector-wrap cu-timeline">
    <view class=" parent-node cu-item text-blue">
      <view class="parent-list  ">
        <view class="list-item" v-for="(item, index) in treeData" :key="index" @click="clickParentNode(item, index)">
          <view class="label" :class="currentNodes === index ? 'active' : ''">{{ item[disColName] }}</view>
        </view>
      </view>
    </view>
    <childSelector
      v-if="childNode.length > 0"
      :name="activeNode[nodeKey]"
      :treeData="childNode"
      :childNodeCol="childNodeCol"
      :disColName="disColName"
      @clickLastNode="clickLastNode"
      :nodeKey="nodeKey"
    ></childSelector>
    <!-- <view class="child-list">
      <view class="list-item" v-for="(item, index) in childNode" :key="index" @click="clickLastNode(item)">{{ item[disColName] }}</view>
    </view> -->
  </view>
</template>

<script>
export default {
  components: {
    childSelector: e => import('@/components/tree-selector/tree-selector.vue')
  },
  data() {
    return {
      activeNode: {},
      currentNodes: -1,
      childNode: []
    };
  },
  props: {
    treeData: {
      type: Array,
      default: () => {}
    },
    childNodeCol: {
      type: String,
      default: '_childNode'
    },
    disColName: {
      type: String,
      default: 'name'
    },
    nodeKey: {
      type: String,
      default: 'no'
    }
  },
  methods: {
    onTree(e) {
      if (e.item._childNode.length === 0) {
        this.$emit('clickLastNode', e);
      }
    },
    clickParentNode(item, index) {
      console.log('onclick', item, index);
      this.currentNodes = index;
      if (item._childNode.length === 0) {
        console.log('onclick', item, index);
        this.$emit('clickLastNode', { item, index });
      } else {
        if (this.activeNode[this.nodeKey] === item[this.nodeKey]) {
          this.activeNode = {};
          this.childNode.length = 0;
        } else {
          this.activeNode = item;
          this.childNode = item[this.childNodeCol];
        }
      }
      this.$emit('clickParentNode', { item, index });
      // this.currentNodes = index;
      // this.$emit('clickParentNode', e);
      // if (e._childNode) {
      //   this.childNode = e._childNode;
      // }
    },
    clickLastNode(e) {
      //点击最底层节点
      if (e.item._childNode.length === 0) {
        this.$emit('clickLastNode', e);
      }
      // this.$emit('clickLastNode', e);
    }
  },
  treeData: {
    handler: function(nVal, oVal) {
      console.log('------new  VAL', nVal);
      this.childNode.length = 0;
      this.activeNode = {};
    },
    deep: true
  }
};
</script>

<style scoped lang="scss">
.cu-timeline {
  // background-color: #efefef;
}
.selector-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  // background-color: #efefef;
  width: 100%;
  .parent-node {
    display: flex;
    width: 100%;
    // background-color: #efefef;
    .line-box {
      width: 30upx;
      height: 100upx;
      flex: 1;
    }
  }
  // &::before{
  //   // content: '⚪';
  //   content: '\26AA';
  //   position: absolute;
  //   left: 30upx;
  //   top: 100upx;
  //   color: #fff;
  //   // background-color: #fff;
  //   // left: -50upx;
  //   // top: 0;
  // }
  // &::after{
  //   // content: '⚪';
  //   content: '';
  //   position: absolute;
  //   width: 2px;
  //   color: #333;
  //   height: 200upx;
  //   left: 40upx;
  //   top: 100upx;
  //   // background-color: #fff;
  //   // left: -50upx;
  //   // top: 0;
  // }
  .parent-list {
    width: 100%;
    // flex: 1;
    margin-right: 20upx;
    margin: 0 20upx 40upx 0;
    background-color: #fff;
    min-height: 200upx;
    border-radius: 20upx;
    display: flex;
background-color: #efefef;
color: #333;
    .list-item {
      .label {
        padding: 10upx 20upx;
        margin: 10upx 20upx;
        &.active {
          background-color: #0081ff;
          color: #fff;
        }
      }
    }
  }
}
</style>
