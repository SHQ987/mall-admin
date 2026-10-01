<template>
  <div class="permission">
    <el-card shadow="never">
      <el-table :data="menuArr" style="width: 100%; margin-bottom: 20px" row-key="id" border :tree-props="{ children: 'children' }">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="权限值" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              v-show="row.level < 3"
              type="primary"
              size="small"
              @click="addPer(row)"
              v-has="'btn.Permission.add'"
            >
              {{ row.level === 2 ? '添加功能' : '添加菜单' }}
            </el-button>
            <el-button
              v-show="row.level !== 1"
              type="warning"
              size="small"
              :icon="'Edit'"
              @click="updatePer(row)"
              v-has="'btn.Permission.update'"
            >
              编辑
            </el-button>
            <el-popconfirm :title="`确定删除${row.name}吗？`" @confirm="deletePer(row)">
              <template #reference>
                <el-button v-show="row.level !== 1" type="danger" size="small" :icon="'Delete'" v-has="'btn.Permission.remove'">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="dialog" :title="perForm.id ? '编辑菜单' : '新增菜单'" width="25%">
        <el-form label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="perForm.name" />
          </el-form-item>
          <el-form-item label="权限值">
            <el-input v-model="perForm.code" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialog = false">取消</el-button>
          <el-button type="primary" @click="sendPer">确定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMenuApi, addOrUpdateMenuApi, deleteMenuApi, type Permission } from '@/api/acl/permission'

const menuArr = ref<Permission[]>([])
const dialog = ref(false)
const perForm = reactive<Permission>({ code: '', name: '', level: 0, pid: 0 })

const getPer = async () => {
  menuArr.value = (await getMenuApi()).data
}
const addPer = (row: Permission) => {
  Object.assign(perForm, { id: undefined, code: '', name: '', level: row.level + 1, pid: row.id })
  dialog.value = true
}
const updatePer = (row: Permission) => {
  Object.assign(perForm, row)
  dialog.value = true
}
const deletePer = async (row: Permission) => {
  await deleteMenuApi(row.id!)
  ElMessage.success('删除成功')
  getPer()
}
const sendPer = async () => {
  await addOrUpdateMenuApi(perForm)
  ElMessage.success(perForm.id ? '更新成功' : '添加成功')
  dialog.value = false
  getPer()
}

onMounted(getPer)
</script>

<style scoped lang="scss"></style>
