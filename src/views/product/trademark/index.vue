<template>
  <div class="trademark">
    <el-card shadow="never">
      <el-button type="primary" :icon="'Plus'" @click="openAdd" v-has="'btn.Trademark.add'">添加品牌</el-button>
      <el-table :data="list" border class="mt-20" v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="tmName" label="品牌名称" />
        <el-table-column label="品牌 LOGO">
          <template #default="{ row }">
            <img :src="row.logoUrl" alt="logo" style="width: 80px; height: 80px; object-fit: contain" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" type="warning" :icon="'Edit'" @click="openEdit(row)" v-has="'btn.Trademark.update'">编辑</el-button>
            <el-popconfirm title="确定删除该品牌？" @confirm="remove(row)">
              <template #reference>
                <el-button size="small" type="danger" :icon="'Delete'" v-has="'btn.Trademark.remove'">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <Pagination v-model:page-no="pageNo" v-model:page-size="pageSize" :total="total" @update:page-no="getList" @update:page-size="getList" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑品牌' : '添加品牌'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="form.tmName" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌 LOGO" prop="logoUrl">
          <el-upload
            class="logo-uploader"
            :show-file-list="false"
            :http-request="fakeUpload"
            :before-upload="beforeUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="logo-img" />
            <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">演示环境使用随机占位图</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadRequestOptions } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import { getTrademarkApi, addOrUpdateTrademarkApi, deleteTrademarkApi, type Trademark } from '@/api/product/trademark'

const list = ref<Trademark[]>([])
const pageNo = ref(1)
const pageSize = ref(3)
const total = ref(0)
const loading = ref(false)

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<Trademark>({ tmName: '', logoUrl: '' })

const rules = reactive<FormRules>({
  tmName: [{ required: true, trigger: 'blur', message: '请输入品牌名称' }],
  logoUrl: [{ required: true, trigger: 'change', message: '请上传品牌 LOGO' }]
})

const getList = async () => {
  loading.value = true
  try {
    const res = await getTrademarkApi(pageNo.value, pageSize.value)
    list.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.id = undefined
  form.tmName = ''
  form.logoUrl = ''
}

const openAdd = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: Trademark) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

const beforeUpload = (file: File) => {
  const isImg = file.type.startsWith('image/')
  if (!isImg) ElMessage.error('请上传图片')
  return isImg
}

// 演示用：模拟上传成功返回占位图
const fakeUpload = (options: UploadRequestOptions) => {
  setTimeout(() => {
    form.logoUrl = `https://picsum.photos/seed/${Date.now()}/120/120`
    options.onSuccess({})
  }, 300)
}

const save = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    await addOrUpdateTrademarkApi(form)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    getList()
  })
}

const remove = async (row: Trademark) => {
  await deleteTrademarkApi(row.id!)
  ElMessage.success('删除成功')
  getList()
}

onMounted(getList)
</script>

<style scoped lang="scss">
.trademark {
  .logo-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }
    .logo-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }
  }
}
.mt-20 {
  margin-top: 20px;
}
</style>
