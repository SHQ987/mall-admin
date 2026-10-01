<template>
  <el-pagination
    class="mt-20"
    :current-page="pageNo"
    :page-size="pageSize"
    :total="total"
    :page-sizes="[3, 5, 7, 10]"
    layout="prev, pager, next, jumper, ->, sizes, total"
    background
    @current-change="(p: number) => emit('update:pageNo', p)"
    @size-change="(s: number) => emit('update:pageSize', s)"
  />
</template>

<script setup lang="ts">
defineProps<{
  pageNo: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  'update:pageNo': [number]
  'update:pageSize': [number]
}>()
</script>
