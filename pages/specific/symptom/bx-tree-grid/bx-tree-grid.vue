<template>
  <view class="">
    <view class="parent-node ">
      <view class="margin-tb-sm text-center text-cut" v-for="(item, index) in treeData" :key="index" @click="onclick(item, index)">
        <button :class="item[nodeKey] === activeNode[nodeKey] ? 'bg-blue  text-white' : 'lines-blue'" class="cu-btn round margin-right-xs">
          {{ item[disColName] }}
          <text class="lg text-green cuIcon-right" v-if="item._childNode.length > 0 && item[nodeKey] !== activeNode[nodeKey]"></text>
          <text class="lg text-white cuIcon-down" v-if="item._childNode.length > 0 && item[nodeKey] === activeNode[nodeKey]"></text>
        </button>
      </view>
    </view>
    <childGrid
      class="child-node"
      v-if="childNode.length > 0"
      :name="activeNode[nodeKey]"
      :treeData="childNode"
      :childNodeCol="childNodeCol"
      :disColName="disColName"
      @on-tree-lastcode="onTree"
      :nodeKey="nodeKey"
    ></childGrid>
  </view>
</template>

<script>
export default {
  name: 'tree-grid',
  components: {
    childGrid: e => import('@/pages/specific/symptom/bx-tree-grid/bx-tree-grid.vue')
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      }
    },
    childNodeCol: {
      type: String,
      default() {
        return '';
      }
    },
    nodeKey: {
      type: String,
      default() {
        return '';
      }
    },
    disColName: {
      type: String,
      default() {
        return '';
      }
    },
    selectedTreeData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      activeNode: {},
      childNode: []
    };
  },
  created() {},
  onLoad(option) {},
  methods: {
    onTree(e) {
      if (e.item._childNode.length === 0) {
        this.$emit('on-tree-lastcode', e);
      }
    },
    onclick(item, index) {
      if (item._childNode.length === 0) {
        console.log('onclick', item, index);
        this.$emit('on-tree-lastcode', { item, index });
      } else {
        if (this.activeNode[this.nodeKey] === item[this.nodeKey]) {
          this.activeNode = {};
          this.childNode = [];
        } else {
          this.activeNode = item;
          this.childNode = item[this.childNodeCol];
        }
      }
      this.$emit('on-tree-grid-change', { item, index });
    }
  },
  watch: {
    treeData: {
      handler: function(nVal, oVal) {
        console.log('------new  VAL', nVal);
        this.childNode = [];
        this.activeNode = {};
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.parent-node {
  display: flex;
  padding-left: 60upx;
  // background-color: rgba($color: #225FBA, $alpha: 0.5);
  // &::before {
  //   content: '\26AA';
  //   border-radius: 50%;
  //   display: block;
  //   position: absolute;
  //   font-size: 20upx;
  //   top: 0px;
  //   z-index: 9;
  //   background-color: #ffffff;
  //   width: 25px;
  //   height: 25px;
  //   text-align: center;
  //   border: none;
  //   line-height: 75px;
  //   left: 18px;
  // }
  // &::after {
  //   content: '';
  //   display: block;
  //   position: absolute;
  //   width: 0.5px;
  //   background-color: #ddd;
  //   left: 30px;
  //   height: 100upx;
  //   top: 35px;
  //   z-index: 8;
  // }
}
.child-node{
  // border: 1px solid #225FBA;
  // border: 1px solid #eee;
  border-radius: 20upx;
  width: 90%;
  margin: 50upx auto 0;
  padding: 0;
  .round{
    border-radius: 0!important;
  }
  .parent-node{
    padding: 20upx;
    .round{
      border-radius: 0!important;
    }
  }
}
</style>
