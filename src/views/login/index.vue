<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>mall-admin · 后台管理系统</span>
        </div>
      </template>
      <el-form ref="formRef" :model="loginForm" :rules="rules" label-width="0" size="large">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名：admin" :prefix-icon="'User'" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            placeholder="密码：111111"
            :prefix-icon="'Lock'"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <p class="tip">演示账号：admin / 111111（前端 Mock，任意非空均可登录）</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({ username: 'admin', password: '111111' })

const validateUsername = (_rule: any, value: string, callback: any) => {
  if (!value) return callback(new Error('请输入用户名'))
  if (value.length < 3) return callback(new Error('用户名至少 3 位'))
  callback()
}

const rules = reactive<FormRules>({
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, max: 15, trigger: 'blur', message: '密码长度 6-15 位' }
  ]
})

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.userLogin(loginForm)
      ElMessage.success('登录成功')
      router.push('/')
    } catch (err: any) {
      ElMessage.error(err?.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}
.login-card {
  width: 380px;
  .card-header {
    text-align: center;
    font-weight: 700;
    font-size: 18px;
  }
  .login-btn {
    width: 100%;
  }
  .tip {
    margin: 8px 0 0;
    font-size: 12px;
    color: #999;
    text-align: center;
  }
}
</style>
