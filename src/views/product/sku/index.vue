<template>
  <div class="sku">
    <el-card shadow="never">
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="skuName" label="SKU 名称" />
        <el-table-column prop="price" label="价格" width="120" />
        <el-table-column prop="weight" label="重量(kg)" width="120" />
        <el-table-column label="默认图片" width="120">
          <template #default="{ row }">
            <img :src="row.skuDefaultImg" alt="" style="width: 60px; height: 60px; object-fit: contain" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isSale === 1 ? 'success' : 'info'">{{ row.isSale === 1 ? '已上架' : '未上架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="{ row }">
            <el-button
              v-if="row.isSale === 0"
              size="small"
              type="success"
              :icon="'Top'"
              title="上架"
              @click="onSale(row)"
            />
            <el-button
              v-else
              size="small"
              type="warning"
              :icon="'Bottom'"
              title="下架"
              @click="cancelSale(row)"
            />
            <el-popconfirm title="确定删除？" @confirm="remove(row)">
              <template #reference>
                <el-button size="small" type="danger" :icon="'Delete'" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <Pagination v-model:page-no="pageNo" v-model:page-size="pageSize" :total="total" @update:page-no="getList" @update:page-size="getList" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import { getSkuListApi, onSaleApi, cancelSaleApi, deleteSkuApi, type Sku } from '@/api/product/sku'

const skuList = ref<Sku[]>([])
const pageNo = ref(1)
const pageSize = ref(7)
const total = ref(0)
const loading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const res = await getSkuListApi(pageNo.value, pageSize.value)
    skuList.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const onSale = async (row: Sku) => {
  await onSaleApi(row.id!)
  ElMessage.success('已上架')
  getList()
}
const cancelSale = async (row: Sku) => {
  await cancelSaleApi(row.id!)
  ElMessage.success('已下架')
  getList()
}
const remove = async (row: Sku) => {
  await deleteSkuApi(row.id!)
  ElMessage.success('删除成功')
  getList()
}

onMounted(getList)
</script>

<style scoped lang="scss">
.sku {
  :deep(.mt-20) {
    margin-top: 20px;
  }
}
</style>
