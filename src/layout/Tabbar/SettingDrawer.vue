<template>
  <el-drawer v-model="visible" title="系统设置" size="300px" :append-to-body="true">
    <el-divider>主题模式</el-divider>
    <div class="setting-row">
      <span>暗黑模式</span>
      <el-switch v-model="darkModel" @change="(v: any) => settingStore.setDark(!!v)" />
    </div>

    <el-divider>主题颜色</el-divider>
    <div class="color-list">
      <span
        v-for="c in colors"
        :key="c"
        class="color-dot"
        :style="{ background: c }"
        :class="{ active: c === settingStore.themeColor }"
        @click="settingStore.setThemeColor(c)"
      />
    </div>

    <el-divider>侧边栏</el-divider>
    <div class="setting-row">
      <span>折叠菜单</span>
      <el-switch v-model="collapseModel" @change="(v: any) => settingStore.isCollapse = !!v" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettingStore } from '@/store/modules/setting'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const settingStore = useSettingStore()
const visible = ref(false)
const darkModel = ref(settingStore.dark)
const collapseModel = ref(settingStore.isCollapse)
const colors = ['#409eff', '#1677ff', '#722ed1', '#13c2c2', '#52c41a', '#fa541c', '#eb2f96']

watch(
  () => visible.value,
  (v) => emit('update:modelValue', v)
)
watch(
  () => darkModel.value,
  (v) => (settingStore.dark = v)
)
// 暴露打开方法
defineExpose({ open: () => (visible.value = true) })
</script>

<style scoped lang="scss">
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}
.color-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  &.active {
    border-color: #000;
  }
}
</style>
