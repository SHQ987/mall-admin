<template>
  <div class="spu">
    <el-card shadow="never">
      <CategorySelector v-model:category1-id="c1Id" v-model:category2-id="c2Id" v-model:category3-id="c3Id" />
    </el-card>

    <!-- 场景 0：SPU 列表 -->
    <el-card shadow="never" class="mt-20" v-show="scene === 0">
      <el-button type="primary" :icon="'Plus'" :disabled="!c3Id" @click="addSpu">添加 SPU</el-button>
      <el-table :data="spuList" border class="mt-20">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="spuName" label="SPU 名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="320">
          <template #default="{ row }">
            <el-button size="small" type="success" :icon="'Plus'" @click="addSku(row)">添加SKU</el-button>
            <el-button size="small" type="warning" :icon="'Edit'" @click="editSpu(row)">编辑</el-button>
            <el-button size="small" type="info" :icon="'View'" @click="viewSku(row)">SKU列表</el-button>
            <el-popconfirm title="确定删除？" @confirm="deleteSpu(row)">
              <template #reference>
                <el-button size="small" type="danger" :icon="'Delete'" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 场景 1：添加/修改 SPU -->
    <el-card shadow="never" class="mt-20" v-show="scene === 1">
      <el-form :model="spuForm" label-width="100px" style="max-width: 640px">
        <el-form-item label="SPU 名称">
          <el-input v-model="spuForm.spuName" placeholder="请输入 SPU 名称" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="spuForm.tmId" placeholder="请选择品牌" style="width: 100%">
            <el-option v-for="t in trademarkList" :key="t.id" :label="t.tmName" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="SPU 描述">
          <el-input v-model="spuForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="SPU 图片">
          <el-upload
            list-type="picture-card"
            :file-list="fileList"
            :http-request="fakeUpload"
            :on-remove="onRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select v-model="selectedSaleAttr" placeholder="选择销售属性" style="width: 200px; margin-right: 12px">
            <el-option v-for="s in baseSaleAttrList" :key="s.id" :label="s.saleAttrName" :value="s.saleAttrName" />
          </el-select>
          <el-button type="primary" :icon="'Plus'" @click="addSaleAttr">添加销售属性</el-button>
          <div class="mt-20">
            <el-tag
              v-for="(attr, idx) in spuForm.spuSaleAttrList"
              :key="idx"
              closable
              class="ml-5"
              @close="spuForm.spuSaleAttrList?.splice(idx, 1)"
            >
              {{ attr.saleAttrName }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveSpu">保存</el-button>
      <el-button @click="scene = 0">取消</el-button>
    </el-card>

    <!-- 添加 SKU 对话框 -->
    <el-dialog v-model="skuDialog" title="添加 SKU" width="520px">
      <el-form :model="skuForm" label-width="100px">
        <el-form-item label="SKU 名称"><el-input v-model="skuForm.skuName" /></el-form-item>
        <el-form-item label="价格"><el-input-number v-model="skuForm.price" :min="0" /></el-form-item>
        <el-form-item label="重量(kg)"><el-input-number v-model="skuForm.weight" :min="0" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="skuDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSku">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看 SKU 列表 -->
    <el-dialog v-model="skuListDialog" title="SKU 列表" width="640px">
      <el-table :data="skuListView" border>
        <el-table-column prop="skuName" label="名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="weight" label="重量" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type UploadRequestOptions, type UploadUserFile } from 'element-plus'
import CategorySelector from '@/components/CategorySelector/index.vue'
import {
  getSpuListApi,
  getSpuByIdApi,
  getSpuImageListApi,
  getSpuSaleAttrListApi,
  getBaseSaleAttrListApi,
  addOrUpdateSpuApi,
  addSkuApi,
  getSkuListBySpuApi,
  deleteSpuApi,
  type Spu,
  type SaleAttr,
  type Sku
} from '@/api/product/spu'
import { getAllTrademarkApi, type Trademark } from '@/api/product/trademark'

const c1Id = ref<number>()
const c2Id = ref<number>()
const c3Id = ref<number>()
const spuList = ref<Spu[]>([])
const scene = ref(0)

const spuForm = reactive<Spu>({ spuName: '', description: '', category3Id: 0, tmId: 0, spuImageList: [], spuSaleAttrList: [] })
const trademarkList = ref<Trademark[]>([])
const baseSaleAttrList = ref<SaleAttr[]>([])
const selectedSaleAttr = ref('')
const fileList = ref<UploadUserFile[]>([])

const skuDialog = ref(false)
const skuForm = reactive<Sku>({ skuName: '', price: 0, weight: 0, skuDefaultImg: '' })
const curSpuId = ref<number>()

const skuListDialog = ref(false)
const skuListView = ref<Sku[]>([])

const fetchSpuList = async () => {
  if (!c3Id.value) return
  const res = await getSpuListApi(1, 10, c3Id.value)
  spuList.value = res.data.records
}
watch(c3Id, fetchSpuList)

onMounted(async () => {
  trademarkList.value = (await getAllTrademarkApi()).data
  baseSaleAttrList.value = (await getBaseSaleAttrListApi()).data
})

const addSpu = () => {
  Object.assign(spuForm, { id: undefined, spuName: '', description: '', category3Id: c3Id.value, tmId: 0, spuImageList: [], spuSaleAttrList: [] })
  fileList.value = []
  scene.value = 1
}

const editSpu = async (row: Spu) => {
  const res = await getSpuByIdApi(row.id!)
  Object.assign(spuForm, res.data)
  spuForm.category3Id = c3Id.value!
  const imgs = await getSpuImageListApi(row.id!)
  fileList.value = imgs.data.map((i) => ({ name: i.imgName, url: i.imgUrl }))
  const sale = await getSpuSaleAttrListApi(row.id!)
  spuForm.spuSaleAttrList = sale.data
  scene.value = 1
}

const addSaleAttr = () => {
  if (!selectedSaleAttr.value) return ElMessage.warning('请先选择销售属性')
  if (spuForm.spuSaleAttrList?.some((s) => s.saleAttrName === selectedSaleAttr.value)) return ElMessage.warning('已存在该销售属性')
  spuForm.spuSaleAttrList!.push({ saleAttrName: selectedSaleAttr.value, spuSaleAttrValueList: [] })
  selectedSaleAttr.value = ''
}

const fakeUpload = (options: UploadRequestOptions) => {
  setTimeout(() => {
    const url = `https://picsum.photos/seed/${Date.now()}/200/200`
    fileList.value.push({ name: options.file.name, url })
    options.onSuccess({})
  }, 200)
}
const onRemove = (file: any) => {
  const idx = fileList.value.findIndex((f) => f.uid === file.uid)
  if (idx > -1) fileList.value.splice(idx, 1)
}

const saveSpu = async () => {
  spuForm.spuImageList = fileList.value.map((f) => ({ imgName: f.name!, imgUrl: f.url! }))
  await addOrUpdateSpuApi(spuForm)
  ElMessage.success('保存成功')
  scene.value = 0
  fetchSpuList()
}

const deleteSpu = async (row: Spu) => {
  await deleteSpuApi(row.id!)
  ElMessage.success('删除成功')
  fetchSpuList()
}

const addSku = (row: Spu) => {
  curSpuId.value = row.id
  Object.assign(skuForm, { skuName: '', price: 0, weight: 0, skuDefaultImg: '' })
  skuDialog.value = true
}
const saveSku = async () => {
  if (curSpuId.value) await addSkuApi({ ...skuForm, skuDefaultImg: `https://picsum.photos/seed/${Date.now()}/120/120` })
  ElMessage.success('SKU 已添加')
  skuDialog.value = false
}

const viewSku = async (row: Spu) => {
  skuListView.value = (await getSkuListBySpuApi(row.id!)).data
  skuListDialog.value = true
}
</script>

<style scoped lang="scss">
.spu {
  .ml-5 {
    margin-left: 5px;
  }
  .mt-20 {
    margin-top: 20px;
  }
}
</style>
