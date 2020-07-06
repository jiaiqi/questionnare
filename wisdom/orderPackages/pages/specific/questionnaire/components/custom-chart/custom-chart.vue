<template>
  <view class="chart-wrap">
    <view class="button-group">
      <view class="button radius" :class="{ 'bg-blue': selected === 'pie' }" @click="changeChartType('pie')">
        <i class="fa fa-pie-chart fa-x margin-right-xs"></i>
        饼图
      </view>
      <view class="button radius" :class="{ 'bg-blue': selected === 'ring' }" @click="changeChartType('ring')">
        <i class="fa fa-circle-o-notch fa-x margin-right-xs"></i>
        圆环
      </view>
      <view class="button radius" :class="{ 'bg-blue': selected === 'column' }" @click="changeChartType('column')">
        <i class="fa fa-bar-chart fa-x margin-right-xs"></i>
        柱状
      </view>
      <view class="button radius" :class="{ 'bg-blue': selected === 'line' }" @click="changeChartType('line')">
        <i class="fa fa-line-chart fa-x margin-right-xs"></i>
        折线
      </view>
    </view>
    <view class="chart-area" v-if="isShowChart"><canvas :canvas-id="canvasId" :id="canvasId" class="charts" @touchstart="touchChart"></canvas></view>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js';
var _self;
export default {
  name: 'custom-chart',
  data() {
    return {
      selected: 'pie',
      isShowChart: false,
      pixelRatio: 1,
      canvasChart: null,
      cWidth: 0,
      cHeight: 0,
      piearr: [],
      chartData: {}
    };
  },
  computed: {
    canvasId() {
      return 'chart' + this.id;
    }
  },
  watch: {
    selected(newValue, oldValue) {
      if (newValue) {
        this.initChart();
      }
    }
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    originData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    changeChartType(type) {
      this.isShowChart = false;
      this.selected = this.selected === type ? '' : type;
      if (this.originData && typeof this.originData === 'object') {
        const data = this.deepClone(this.originData);
        let keyList = Object.keys(data);
        let chartData = {
          categories: [],
          series: []
        };
        chartData.categories = [];
        // chartData.categories = keyList;
        let seriesData = [];
        keyList.forEach(keys => {
          let name = keys;
          if (keys.length > 10) {
            name = keys.slice(0, 10)+'...';
          }
          chartData.categories.push(name)
          if (this.selected === 'pie' || this.selected === 'ring') {
            chartData.series.push({ name: name, data: data[keys] });
          } else if (this.selected === 'column' || this.selected === 'line') {
            seriesData.push(data[keys]);
          }
        });
        if (this.selected === 'column' || this.selected === 'line') {
          chartData.series = [{name: '',data: seriesData}];
        }
        this.chartData = chartData;
      }
      if (this.selected) {
        this.isShowChart = true;
        if (this.canvasChart) {
          this.canvasChart.stopAnimation();
        }
        this.initChart();
      }
    },
    initChart() {
      if (this.chartData && this.chartData.series) {
        this.showChart(this.canvasId, this.chartData, this.selected);
      }
    },
    buildChartData() {},
    showChart(canvasId, chartData, chartType = 'pie') {
      let max = 0;
      if (this.chartData.series && Array.isArray(this.chartData.series) && this.chartData.series.length > 0 && (chartType === 'line' || chartType === 'column')) {
        max = this.chartData.series[0].data.sort((a, b) => b - a)[0];
        let n = 1;
        for (let i = 0; i < 10; i++) {
          if (max < Math.pow(10, n) && max > Math.pow(10, n - 1)) {
            max += Math.pow(10, n - 1);
            break;
          }
          n++;
        }
      }
      let legend = { show: true };
      let title = null;
      let subtitle = null;
      let chartConfig = {};
      switch (chartType) {
        case 'pie':
          chartConfig = {
            $this: this,
            canvasId: canvasId,
            type: 'pie',
            fontSize: 11,
            legend: {
              show: true,
              position: 'right',
              float: 'right',
              itemGap: 10,
              lineHeight: 26,
              borderWidth: 1
            },
            background: '#FFFFFF',
            pixelRatio: 1,
            series: chartData.series,
            animation: true,
            duration: 1000,
            width: this.cWidth,
            height: this.cHeight,
            dataLabel: true,
            extra: {
              pie: {
                labelWidth: 10
              }
            }
          };
          break;
        case 'ring':
          chartConfig = {
            $this: this,
            canvasId: canvasId,
            type: 'ring',
            fontSize: 11,
            legend: {
              show: true,
              position: 'right',
              float: 'center',
              itemGap: 10,
              lineHeight: 26,
              borderWidth: 1
            },
            extra: {
              pie: {
                offsetAngle: -35,
                labelWidth: 10
              }
            },
            background: '#FFFFFF',
            pixelRatio: 1,
            series: chartData.series,
            animation: true,
            duration: 1000,
            width: this.cWidth,
            height: this.cHeight,
            disablePieStroke: false,
            dataLabel: true
          };
          break;
        case 'column':
          chartConfig = {
            $this: this,
            canvasId: canvasId,
            type: 'column',
            legend: { show: false },
            fontSize: 11,
            background: '#FFFFFF',
            pixelRatio: 1,
            animation: true,
            duration: 1000,
            categories: chartData.categories,
            series: chartData.series,
            xAxis: {
              disableGrid: true,
              rotateLabel: true
            },
            yAxis: {
              // disabled: true,
              // splitNumber: step,
              min: 0,
              max: max
            },

            dataLabel: true,
            width: this.cWidth,
            height: this.cHeight,
            extra: {
              column: {
                type: 'group',
                width: 20
              }
            }
          };
          break;
        case 'line':
          chartConfig = {
            $this: _self,
            canvasId: canvasId,
            type: 'line',
            fontSize: 11,
            legend: { show: false },
            dataLabel: false,
            dataPointShape: true,
            background: '#FFFFFF',
            pixelRatio: 1,
            categories: chartData.categories,
            series: chartData.series,
            animation: true,
            duration: 1000,
            xAxis: {
              // disableGrid: true
              type: 'grid',
              gridColor: '#CCCCCC',
              gridType: 'dash',
              rotateLabel: true
              // dashLength: 8
            },
            yAxis: {
              // gridType: 'dash',
              // gridColor: '#CCCCCC',
              // dashLength: 8,
              // splitNumber: 1,
              // format: val => {
              //   return val.toFixed(0) ;
              // }
              // splitNumber: step,
              min: 0,
              max: max
            },
            width: this.cWidth,
            height: this.cHeight,
            extra: {
              line: {
                type: 'straight'
              }
            }
          };
          break;
      }
      if (this.canvasChart) {
        this.canvasChart.stopAnimation();
      }
      this.canvasChart = new uCharts(chartConfig);
      // this.piearr = this.canvasChart.opts.series;
    },
    touchChart(e) {
      const self = this;
      this.canvasChart.showToolTip(e, {
        format: function(item, category) {
          if (self.selected === 'ring' || self.selected === 'pie') {
            return item.name + ':' + item.data;
          } else if (self.selected === 'column' || self.selected === 'line') {
            return category + ':' + item.data;
          }
        }
      });
    }
  },
  mounted() {
    _self = this;
    this.cWidth = uni.upx2px(700);
    this.cHeight = uni.upx2px(400);
    this.changeChartType('pie');
  }
};
</script>

<style scoped lang="scss">
.chart-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20upx;
  .button-group {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .button {
      padding: 6upx 14upx;
      margin: 0 5upx;
      &:not([class*='bg-']) {
        background-color: #f0f0f0;
      }
    }
  }
  .chart-area {
    .charts {
      width: 100%;
      height: 400upx;
    }
  }
}
</style>
