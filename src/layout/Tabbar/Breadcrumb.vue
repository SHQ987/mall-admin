<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item v-for="(item, idx) in matched" :key="idx">
      <el-icon v-if="item.meta?.icon" class="bc-icon"><SvgIcon :name="item.meta.icon as string" /></el-icon>
      <span>{{ item.meta?.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SvgIcon from '@/components/SvgIcon/index.vue'

const route = useRoute()
const matched = computed(() =>
  route.matched.filter((m) => m.meta?.title && !m.meta?.hidden)
)
</script>

<style scoped lang="scss">
.breadcrumb {
  display: inline-flex;
  align-items: center;
  :deep(.el-breadcrumb__inner) {
    display: inline-flex;
    align-items: center;
  }
  .bc-icon {
    margin-right: 4px;
  }
}
</style>
