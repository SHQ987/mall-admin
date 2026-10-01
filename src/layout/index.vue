<template>
  <el-container class="layout">
    <el-aside :width="settingStore.isCollapse ? $aside-collapsed-width : $aside-width" class="layout-aside">
      <Logo />
      <el-scrollbar>
        <Menu />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <Tabbar />
      </el-header>
      <el-main class="layout-main">
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/store/modules/setting'
import Logo from './Logo/index.vue'
import Menu from './Menu/index.vue'
import Tabbar from './Tabbar/index.vue'
import Main from './Main/index.vue'

const settingStore = useSettingStore()
</script>

<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
  &-aside {
    background: $menu-bg;
    transition: width 0.3s;
    overflow: hidden;
  }
  &-header {
    padding: 0;
    height: $header-height;
    line-height: $header-height;
  }
  &-main {
    padding: 0;
    background: #f0f2f5;
  }
}
</style>
