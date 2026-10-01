<template>
  <div class="home">
    <el-row :gutter="16">
      <el-col :span="6" v-for="s in stats" :key="s.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat">
            <el-icon class="stat-icon" :style="{ background: s.color }"><component :is="s.icon" /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ s.value }}</div>
              <div class="stat-title">{{ s.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <el-col :span="16">
        <el-card shadow="hover" header="近 7 日访问趋势">
          <div ref="trendRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" header="商品分类占比">
          <div ref="pieRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const stats = [
  { title: '总用户数', value: '12,846', icon: 'User', color: '#409eff' },
  { title: '商品总数', value: '8,392', icon: 'Goods', color: '#67c23a' },
  { title: '今日订单', value: '1,204', icon: 'List', color: '#e6a23c' },
  { title: '销售额(万)', value: '93.6', icon: 'Histogram', color: '#f56c6c' }
]

const trendRef = ref<HTMLElement>()
const pieRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null

onMounted(() => {
  if (trendRef.value) {
    trendChart = echarts.init(trendRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 30, bottom: 30 },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [{ name: '访问量', type: 'line', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320], areaStyle: { opacity: 0.2 } }]
    })
  }
  if (pieRef.value) {
    pieChart = echarts.init(pieRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: '分类占比',
          type: 'pie',
          radius: ['40%', '65%'],
          data: [
            { value: 1048, name: '手机' },
            { value: 735, name: '电脑' },
            { value: 580, name: '配件' },
            { value: 484, name: '家电' }
          ]
        }
      ]
    })
  }
})

const resize = () => {
  trendChart?.resize()
  pieChart?.resize()
}
window.addEventListener('resize', resize)
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  trendChart?.dispose()
  pieChart?.dispose()
})
</script>

<style scoped lang="scss">
.home {
  .stat-card {
    .stat {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 700;
    }
    .stat-title {
      color: #909399;
      font-size: 13px;
    }
  }
  .chart {
    height: 300px;
  }
}
.mt-16 {
  margin-top: 16px;
}
</style>
