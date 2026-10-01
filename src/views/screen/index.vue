<template>
  <div class="container">
    <div class="screen" ref="refScreen">
      <!-- 顶部标题 -->
      <header class="top">
        <span class="top-time">{{ now }}</span>
        <h1 class="top-title">mall-admin · 数据可视化大屏</h1>
        <span class="top-logo">MALL ADMIN</span>
      </header>

      <div class="bottom">
        <!-- 左 -->
        <div class="col left">
          <section class="panel tourist">
            <h3>实时游客统计</h3>
            <div ref="touristRef" class="chart"></div>
          </section>
          <section class="panel sex">
            <h3>男女比例</h3>
            <div ref="sexRef" class="chart"></div>
          </section>
          <section class="panel age">
            <h3>年龄比例</h3>
            <div ref="ageRef" class="chart"></div>
          </section>
        </div>

        <!-- 中 -->
        <div class="col center">
          <section class="panel map">
            <h3>景区分布与游客航线</h3>
            <div ref="mapRef" class="chart"></div>
          </section>
          <section class="panel line">
            <h3>游客趋势</h3>
            <div ref="lineRef" class="chart"></div>
          </section>
        </div>

        <!-- 右 -->
        <div class="col right">
          <section class="panel rank">
            <h3>景区排行</h3>
            <div ref="rankRef" class="chart"></div>
          </section>
          <section class="panel yearrank">
            <h3>年度游客量</h3>
            <div ref="yearRef" class="chart"></div>
          </section>
          <section class="panel contpair">
            <h3>业态对比</h3>
            <div ref="contRef" class="chart"></div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const refScreen = ref<HTMLElement>()
const now = ref('')
const touristRef = ref<HTMLElement>()
const sexRef = ref<HTMLElement>()
const ageRef = ref<HTMLElement>()
const mapRef = ref<HTMLElement>()
const lineRef = ref<HTMLElement>()
const rankRef = ref<HTMLElement>()
const yearRef = ref<HTMLElement>()
const contRef = ref<HTMLElement>()

const charts: echarts.ECharts[] = []

const getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return Math.min(ww, wh)
}

const tick = () => {
  now.value = new Date().toLocaleString('zh-CN', { hour12: false })
}

const initCharts = () => {
  const mk = (el?: HTMLElement) => {
    if (!el) return null
    const c = echarts.init(el)
    charts.push(c)
    return c
  }

  // 实时游客统计（仪表盘）
  mk(touristRef.value)?.setOption({
    series: [
      {
        type: 'gauge',
        progress: { show: true, width: 14 },
        axisLine: { lineStyle: { width: 14 } },
        detail: { formatter: '{value}', fontSize: 28, color: '#29fcff' },
        data: [{ value: 2168, name: '在线游客' }],
        max: 5000,
        title: { color: '#fff' }
      }
    ]
  })

  // 男女比例
  mk(sexRef.value)?.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#fff' } },
    series: [
      {
        type: 'pie',
        radius: ['35%', '60%'],
        label: { color: '#fff' },
        data: [
          { value: 58, name: '男', itemStyle: { color: '#5470c6' } },
          { value: 42, name: '女', itemStyle: { color: '#ee6666' } }
        ]
      }
    ]
  })

  // 年龄比例
  mk(ageRef.value)?.setOption({
    tooltip: {},
    xAxis: { type: 'category', data: ['<18', '18-25', '26-35', '36-50', '>50'], axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: '#234' } } },
    series: [{ type: 'bar', data: [12, 35, 30, 15, 8], itemStyle: { color: '#29fcff' } }]
  })

  // 游客趋势折线
  mk(lineRef.value)?.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: '#234' } } },
    series: [{ type: 'line', smooth: true, areaStyle: { opacity: 0.2 }, data: [120, 200, 150, 80, 70, 110], itemStyle: { color: '#ff5722' } }]
  })

  // 景区排行
  mk(rankRef.value)?.setOption({
    tooltip: {},
    xAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: '#234' } } },
    yAxis: { type: 'category', data: ['故宫', '长城', '西湖', '泰山', '兵马俑'].reverse(), axisLabel: { color: '#fff' } },
    series: [{ type: 'bar', data: [320, 280, 250, 210, 180].reverse(), itemStyle: { color: '#fac858' } }]
  })

  // 年度游客量
  mk(yearRef.value)?.setOption({
    tooltip: {},
    xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023'], axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: '#234' } } },
    series: [{ type: 'bar', data: [900, 600, 1200, 1500, 2100], itemStyle: { color: '#91cc75' } }]
  })

  // 业态对比
  mk(contRef.value)?.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#fff' } },
    series: [
      {
        type: 'pie',
        roseType: 'radius',
        radius: ['20%', '60%'],
        label: { color: '#fff' },
        data: [
          { value: 40, name: '门票' },
          { value: 30, name: '住宿' },
          { value: 20, name: '餐饮' },
          { value: 10, name: '文创' }
        ]
      }
    ]
  })

  // 中国地图（运行时拉取 geojson，失败则降级为散点示意）
  const mapChart = mk(mapRef.value)
  if (mapChart) {
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then((r) => r.json())
      .then((geo) => {
        echarts.registerMap('china', geo)
        mapChart.setOption({
          geo: { map: 'china', roam: true, itemStyle: { areaColor: '#0b1a3a', borderColor: '#29fcff' }, emphasis: { itemStyle: { areaColor: '#1c4b8a' } } },
          series: [
            {
              type: 'lines',
              coordinateSystem: 'geo',
              data: [{ coords: [[116.4, 39.9], [121.47, 31.23]], lineStyle: { color: '#ff5722' } }],
              effect: { show: true, trailLength: 0.3, symbol: 'arrow', color: '#ffeb3b' },
              lineStyle: { width: 2, curveness: 0.3 }
            },
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: [
                { name: '北京', value: [116.4, 39.9, 200] },
                { name: '上海', value: [121.47, 31.23, 180] },
                { name: '广州', value: [113.26, 23.13, 160] }
              ],
              symbolSize: 12,
              itemStyle: { color: '#29fcff' }
            }
          ]
        })
      })
      .catch(() => {
        mapChart.setOption({
          title: { text: '地图数据加载失败（离线环境）', left: 'center', top: 'center', textStyle: { color: '#888' } }
        })
      })
  }
}

const resize = () => {
  refScreen.value && (refScreen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`)
  charts.forEach((c) => c.resize())
}

onMounted(() => {
  tick()
  const t = setInterval(tick, 1000)
  initCharts()
  resize()
  window.addEventListener('resize', resize)
  onBeforeUnmount(() => clearInterval(t))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  charts.forEach((c) => c.dispose())
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: #020d2a;
  overflow: hidden;
}
.screen {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 1920px;
  height: 1080px;
  transform-origin: left top;
  background: radial-gradient(circle at 50% 0%, #0b1a3a 0%, #020d2a 70%);
  color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
}
.top {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1c4b8a;
  &-title {
    font-size: 32px;
    letter-spacing: 4px;
    color: #29fcff;
    text-shadow: 0 0 12px #29fcff;
  }
  &-time,
  &-logo {
    font-size: 16px;
    color: #66ccff;
  }
}
.bottom {
  display: flex;
  height: calc(1080px - 80px);
  gap: 16px;
  padding-top: 16px;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  &.left,
  &.right {
    flex: 1;
  }
  &.center {
    flex: 2;
  }
}
.panel {
  flex: 1;
  border: 1px solid #1c4b8a;
  border-radius: 6px;
  background: rgba(11, 26, 58, 0.6);
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  h3 {
    font-size: 16px;
    color: #29fcff;
    margin-bottom: 6px;
  }
  .chart {
    flex: 1;
    min-height: 0;
  }
  &.center .map {
    flex: 4;
  }
}
</style>
