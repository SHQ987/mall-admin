<template>
  <div class="tabbar">
    <div class="tabbar-left">
      <el-icon class="collapse-btn" @click="settingStore.toggleCollapse()">
        <component :is="settingStore.isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
      <Breadcrumb />
    </div>

    <div class="tabbar-right">
      <el-button text :icon="'Refresh'" circle title="刷新" @click="refresh" />
      <el-button text :icon="'FullScreen'" circle title="全屏" @click="toggleFullscreen" />
      <el-button text :icon="'Moon'" circle title="暗黑模式" @click="settingStore.setDark(!settingStore.dark)" />
      <el-button text :icon="'Setting'" circle title="设置" @click="openSetting" />
      <el-dropdown @command="handleCommand">
        <span class="user-dropdown">
          <el-avatar :size="28" :src="userStore.avatar || ''">{{ userStore.name?.[0] }}</el-avatar>
          <span class="username">{{ userStore.name || '用户' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <SettingDrawer ref="drawerRef" v-model="drawerVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useSettingStore } from '@/store/modules/setting'
import Breadcrumb from './Breadcrumb.vue'
import SettingDrawer from './SettingDrawer.vue'

const router = useRouter()
const userStore = useUserStore()
const settingStore = useSettingStore()

const drawerVisible = ref(false)
const drawerRef = ref<InstanceType<typeof SettingDrawer>>()
const openSetting = () => drawerRef.value?.open()

const refresh = () => {
  router.go(0)
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    await userStore.userLogout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
.tabbar {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  .tabbar-left {
    display: flex;
    align-items: center;
    .collapse-btn {
      font-size: 20px;
      cursor: pointer;
      margin-right: 16px;
    }
  }
  .tabbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    .user-dropdown {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      outline: none;
      .username {
        font-size: 14px;
      }
    }
  }
}
</style>
