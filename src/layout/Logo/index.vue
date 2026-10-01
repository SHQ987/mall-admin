<template>
  <div class="logo" :class="{ collapse: settingStore.isCollapse }">
    <img class="logo-img" src="/favicon.svg" alt="logo" />
    <span v-show="!settingStore.isCollapse" class="logo-title">mall-admin</span>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/store/modules/setting'
const settingStore = useSettingStore()
</script>

<style scoped lang="scss">
.logo {
  height: $logo-height;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  &.collapse {
    justify-content: center;
    padding: 0;
  }
  .logo-img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  .logo-title {
    margin-left: 12px;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }
}
</style>
