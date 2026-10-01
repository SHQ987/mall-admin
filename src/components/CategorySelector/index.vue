<template>
  <el-form :inline="true" class="category-selector">
    <el-form-item label="一级分类">
      <el-select v-model="c1" placeholder="请选择" @change="onC1" style="width: 160px">
        <el-option v-for="item in c1List" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="c2" placeholder="请选择" @change="onC2" style="width: 160px">
        <el-option v-for="item in c2List" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="c3" placeholder="请选择" style="width: 160px">
        <el-option v-for="item in c3List" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCategory1Api, getCategory2Api, getCategory3Api, type Category } from '@/api/product/attr'

const c1 = defineModel<number | undefined>('category1Id')
const c2 = defineModel<number | undefined>('category2Id')
const c3 = defineModel<number | undefined>('category3Id')

const c1List = ref<Category[]>([])
const c2List = ref<Category[]>([])
const c3List = ref<Category[]>([])

onMounted(async () => {
  c1List.value = (await getCategory1Api()).data
})

const onC1 = async () => {
  c2.value = undefined
  c3.value = undefined
  c2List.value = []
  c3List.value = []
  c2List.value = (await getCategory2Api(c1.value!)).data
}
const onC2 = async () => {
  c3.value = undefined
  c3List.value = []
  c3List.value = (await getCategory3Api(c2.value!)).data
}
</script>

<style scoped lang="scss">
.category-selector {
  margin-bottom: 0;
}
</style>
