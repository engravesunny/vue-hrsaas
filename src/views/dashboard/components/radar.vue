<template>
  <div ref="myChart" class="myChart" />
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { RadarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import { LegendComponent } from 'echarts/components'
echarts.use([LegendComponent])
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
export default {
  name: 'Radar',

  data() {
    return {

    }
  },

  mounted() {
    const myChart = echarts.init(this.$refs.myChart)
    myChart.setOption({
      title: {
        text: '工作情况表'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: '张三 vs 李四',
          type: 'radar',
          data: [
            {
              value: [80, 87, 98, 58, 66, 80],
              name: '张三'
            },
            {
              value: [90, 68, 75, 87, 88, 85],
              name: '李四'
            }
          ]
        }
      ]
    })
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.myChart{
  width: 600px;
  height: 400px;
}
</style>
