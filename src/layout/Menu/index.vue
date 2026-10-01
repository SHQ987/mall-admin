<template>
  <el-menu
    :default-active="route.path"
    :collapse="settingStore.isCollapse"
    :collapse-transition="false"
    background-color="#001529"
    text-color="#fff"
    active-text-color="#409eff"
    router
  >
    <MenuTree :routes="menuList" :base-path="''" />
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useSettingStore } from '@/store/modules/setting'
import MenuTree from './menuTree.vue'

const route = useRoute()
const userStore = useUserStore()
const settingStore = useSettingStore()

// 由可访问路由构造菜单数据：Home（来自 Layout 子路由）+ 异步顶级路由（Product/Acl/Screen）
const menuList = computed<RouteRecordRaw[]>(() => {
  const all = userStore.menuRoutes
  const layout = all.find((r) => r.name === 'Layout')
  const base = (layout?.children || []).filter((c) => !c.meta?.hidden)
  const asyncTop = all.filter(
    (r) => r.name !== 'Layout' && r.name !== 'Login' && r.name !== 'NotFound'
  )
  return [...base, ...asyncTop]
})
</script>
