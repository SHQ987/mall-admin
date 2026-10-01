<template>
  <div class="role">
    <el-card shadow="never">
      <el-form :inline="true">
        <el-form-item label="职位搜索">
          <el-input v-model="searchValue" placeholder="请输入职位关键字" style="width: 220px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="'Search'" :disabled="!searchValue" @click="getRole">搜索</el-button>
          <el-button :icon="'RefreshLeft'" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="addRole" v-has="'btn.Role.add'">添加职位</el-button>

      <el-table :data="records" border stripe class="mt-20">
        <el-table-column type="index" label="#" align="center" width="60" />
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column label="操作" width="320">
          <template #default="{ row }">
            <el-button size="small" type="primary" :icon="'User'" @click="roleSet(row)">分配权限</el-button>
            <el-button size="small" type="warning" :icon="'Edit'" @click="editRole(row)" v-has="'btn.Role.update'">编辑</el-button>
            <el-popconfirm :title="`确定删除${row.roleName}吗？`" @confirm="deleteRole(row)">
              <template #reference>
                <el-button size="small" type="danger" :icon="'Delete'" v-has="'btn.Role.remove'">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <Pagination v-model:page-no="pageNo" v-model:page-size="pageSize" :total="total" @update:page-no="getRole" @update:page-size="getRole" />
    </el-card>

    <el-dialog v-model="dialog" :title="roleForm.id ? '编辑职位' : '添加职位'" width="30%">
      <el-form ref="formRef" :model="roleForm" :rules="rules" label-width="90px">
        <el-form-item label="职位名称" prop="roleName">
          <el-input v-model="roleForm.roleName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="saveRole">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawer" title="权限分配" size="360px">
      <el-tree
        ref="treeRef"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="{ label: 'name', children: 'children' }"
      />
      <template #footer>
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="saveSetPer">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import {
  getRoleListApi,
  addOrUpdateRoleApi,
  deleteRoleApi,
  getRoleMenuApi,
  assignRoleMenuApi,
  type RoleItem
} from '@/api/acl/role'

const records = ref<RoleItem[]>([])
const pageNo = ref(1)
const pageSize = ref(5)
const total = ref(0)
const searchValue = ref('')

const dialog = ref(false)
const formRef = ref<FormInstance>()
const roleForm = reactive<RoleItem>({ roleName: '' })
const rules = reactive<FormRules>({
  roleName: [
    { required: true, trigger: 'blur', message: '请输入职位名称' },
    { min: 2, trigger: 'blur', message: '职位名称至少两位' }
  ]
})

const drawer = ref(false)
const treeRef = ref<any>()
const menuArr = ref<any[]>([])
const checkedKeys = ref<number[]>([])
const curRoleId = ref<number>()

const getRole = async (page = 1) => {
  pageNo.value = page
  const res = await getRoleListApi(pageNo.value, pageSize.value, searchValue.value)
  records.value = res.data.records
  total.value = res.data.total
}
const reset = () => {
  searchValue.value = ''
  getRole()
}

const addRole = () => {
  Object.assign(roleForm, { id: undefined, roleName: '' })
  dialog.value = true
}
const editRole = (row: RoleItem) => {
  Object.assign(roleForm, row)
  dialog.value = true
}
const saveRole = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    await addOrUpdateRoleApi(roleForm)
    ElMessage.success(roleForm.id ? '更新成功' : '添加成功')
    dialog.value = false
    getRole()
  })
}

const roleSet = async (row: RoleItem) => {
  curRoleId.value = row.id
  const res = await getRoleMenuApi(row.id!)
  menuArr.value = res.data.menuList
  checkedKeys.value = res.data.checkedKeys
  drawer.value = true
}
const saveSetPer = async () => {
  const keys = [...treeRef.value.getCheckedKeys(), ...treeRef.value.getHalfCheckedKeys()]
  await assignRoleMenuApi(curRoleId.value!, keys)
  ElMessage.success('分配成功')
  drawer.value = false
}

const deleteRole = async (row: RoleItem) => {
  await deleteRoleApi(row.id!)
  ElMessage.success('删除成功')
  getRole()
}

onMounted(() => getRole())
</script>

<style scoped lang="scss">
.role {
  .mt-20 {
    margin-top: 20px;
  }
}
</style>
