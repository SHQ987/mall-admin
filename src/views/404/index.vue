<template>
  <div class="notfound">
    <h1>404</h1>
    <p>页面走丢了～</p>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.notfound {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 120px;
    margin: 0;
    color: #409eff;
  }
  p {
    margin: 0 0 20px;
    color: #666;
  }
}
</style>
