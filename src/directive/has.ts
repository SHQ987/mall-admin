import type { App, Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

// v-has="'btn.xxx'" 按钮权限指令：无权限时移除元素
const has: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const userStore = useUserStore()
    const buttons = userStore.buttons || []
    if (binding.value && !buttons.includes(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

export function setupPermissionDirective(app: App) {
  app.directive('has', has)
}
