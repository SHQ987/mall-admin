<template>
  <div class="attr">
    <!-- 三级分类选择 -->
    <el-card shadow="never">
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select v-model="c1Id" placeholder="请选择" @change="handleC1" style="width: 180px">
            <el-option v-for="c in c1List" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="c2Id" placeholder="请选择" @change="handleC2" style="width: 180px">
            <el-option v-for="c in c2List" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="c3Id" placeholder="请选择" @change="fetchAttr" style="width: 180px">
            <el-option v-for="c in c3List" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 属性列表 -->
    <el-card shadow="never" class="mt-20" v-show="scene === 0">
      <el-button type="primary" :icon="'Plus'" :disabled="!c3Id" @click="addAttr">添加属性</el-button>
      <el-table :data="attrList" border class="mt-20">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="attrName" label="属性名称" width="180" />
        <el-table-column label="属性值">
          <template #default="{ row }">
            <el-tag v-for="v in row.attrValueList" :key="v.id" class="ml-5">{{ v.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" type="warning" :icon="'Edit'" @click="editAttr(row)">编辑</el-button>
            <el-popconfirm title="确定删除？" @confirm="deleteAttr(row)">
              <template #reference>
                <el-button size="small" type="danger" :icon="'Delete'">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/修改属性 -->
    <el-card shadow="never" class="mt-20" v-show="scene === 1">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input v-model="attrForm.attrName" placeholder="请输入属性名" />
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" :disabled="!attrForm.attrName" @click="addValue">添加属性值</el-button>
      <el-table :data="attrForm.attrValueList" border class="mt-20">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column label="属性值名称">
          <template #default="{ row, $index }">
            <el-input
              v-if="row.isEdit"
              v-model="row.valueName"
              placeholder="请输入"
              size="small"
              ref="valueInputs"
              @blur="row.isEdit = false"
            />
            <span v-else @click="toEdit(row, $index)">{{ row.valueName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ $index }">
            <el-button size="small" type="danger" :icon="'Delete'" @click="attrForm.attrValueList.splice($index, 1)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-20">
        <el-button type="primary" @click="saveAttr">保存</el-button>
        <el-button @click="scene = 0">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getCategory1Api,
  getCategory2Api,
  getCategory3Api,
  getAttrApi,
  addOrUpdateAttrApi,
  deleteAttrApi,
  type Category,
  type Attr,
  type AttrValue
} from '@/api/product/attr'

const c1List = ref<Category[]>([])
const c2List = ref<Category[]>([])
const c3List = ref<Category[]>([])
const c1Id = ref<number>()
const c2Id = ref<number>()
const c3Id = ref<number>()

const attrList = ref<Attr[]>([])
const scene = ref(0)
const attrForm = reactive<Attr>({ attrName: '', categoryId: 0, categoryLevel: 3, attrValueList: [] })
const valueInputs = ref<any[]>([])

const init = async () => {
  c1List.value = (await getCategory1Api()).data
}
const handleC1 = async () => {
  c2Id.value = undefined
  c3Id.value = undefined
  c2List.value = []
  c3List.value = []
  attrList.value = []
  c2List.value = (await getCategory2Api(c1Id.value!)).data
}
const handleC2 = async () => {
  c3Id.value = undefined
  c3List.value = []
  attrList.value = []
  c3List.value = (await getCategory3Api(c2Id.value!)).data
}
const fetchAttr = async () => {
  if (!c3Id.value) return
  attrList.value = (await getAttrApi(c1Id.value!, c2Id.value!, c3Id.value!)).data
}

const addAttr = () => {
  Object.assign(attrForm, { attrName: '', categoryId: c3Id.value, categoryLevel: 3, attrValueList: [] })
  scene.value = 1
}
const editAttr = (row: Attr) => {
  Object.assign(attrForm, JSON.parse(JSON.stringify(row)))
  scene.value = 1
}
const addValue = () => {
  attrForm.attrValueList.push({ valueName: '', isEdit: true } as AttrValue)
  nextTick(() => valueInputs.value?.at(-1)?.focus())
}
const toEdit = (row: AttrValue, idx: number) => {
  row.isEdit = true
  nextTick(() => valueInputs.value?.[idx]?.focus())
}
const saveAttr = async () => {
  await addOrUpdateAttrApi(attrForm)
  ElMessage.success('保存成功')
  scene.value = 0
  fetchAttr()
}
const deleteAttr = async (row: Attr) => {
  await deleteAttrApi(row.id!)
  ElMessage.success('删除成功')
  fetchAttr()
}

init()
</script>

<style scoped lang="scss">
.attr {
  .ml-5 {
    margin-left: 5px;
  }
  .mt-20 {
    margin-top: 20px;
  }
}
</style>
