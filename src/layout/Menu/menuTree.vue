<template>
  <template v-for="route in routes" :key="route.path">
    <el-sub-menu v-if="hasChildren(route)" :index="resolvePath(route.path)">
      <template #title>
        <el-icon v-if="route.meta?.icon"><SvgIcon :name="route.meta.icon as string" /></el-icon>
        <span>{{ route.meta?.title }}</span>
      </template>
      <MenuTree :routes="route.children!" :base-path="resolvePath(route.path)" />
    </el-sub-menu>

    <el-menu-item v-else :index="resolvePath(route.path)">
      <el-icon v-if="route.meta?.icon"><SvgIcon :name="route.meta.icon as string" /></el-icon>
      <template #title>{{ route.meta?.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import SvgIcon from '@/components/SvgIcon/index.vue'

defineOptions({ name: 'MenuTree' })

const props = defineProps<{
  routes: RouteRecordRaw[]
  basePath: string
}>()

const hasChildren = (route: RouteRecordRaw) =>
  route.children && route.children.filter((c) => !c.meta?.hidden).length > 0

const resolvePath = (path: string) => {
  if (path.startsWith('/')) return path
  if (!props.basePath) return '/' + path
  return props.basePath.replace(/\/$/, '') + '/' + path
}
</script>
