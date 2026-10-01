<template>
  <div class="user">
    <el-card shadow="never">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="keyword" placeholder="用户名" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="'Search'" @click="getList">搜索</el-button>
          <el-button :icon="'RefreshLeft'" @click="keyword = ''; getList()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="openAdd" v-has="'btn.User.add'">添加用户</el-button>

      <el-table :data="list" border class="mt-20">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-button size="small" type="info" :icon="'User'" @click="assignRole(row)" v-has="'btn.User.assgin'">分配角色</el-button>
            <el-button size="small" type="warning" :icon="'Edit'" @click="openEdit(row)" v-has="'btn.User.update'">编辑</el-button>
            <el-popconfirm title="确定删除？" @confirm="remove(row)">
              <template #reference>
                <el-button size="small" type="danger" :icon="'Delete'" v-has="'btn.User.remove'">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <Pagination v-model:page-no="pageNo" v-model:page-size="pageSize" :total="total" @update:page-no="getList" @update:page-size="getList" />
    </el-card>

    <el-dialog v-model="dialog" :title="form.id ? '编辑用户' : '添加用户'" width="460px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.id">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="roleDialog" title="分配角色" width="460px">
      <el-checkbox-group v-model="checkedRoles">
        <el-checkbox v-for="r in allRoles" :key="r.id" :value="r.id" :label="r.roleName" />
      </el-checkbox-group>
      <template #footer>
        <el-button @click="roleDialog = false">取消</el-button>
        <el-button type="primary" @click="saveRole">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import {
  getUserListApi,
  addOrUpdateUserApi,
  deleteUserApi,
  assignRoleApi,
  getUserRoleApi,
  type UserItem
} from '@/api/user'

const list = ref<UserItem[]>([])
const pageNo = ref(1)
const pageSize = ref(5)
const total = ref(0)
const keyword = ref('')

const dialog = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<UserItem>({ username: '', nickName: '', password: '' })
const rules = reactive<FormRules>({
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
})

const roleDialog = ref(false)
const allRoles = ref<UserItem[]>([])
const checkedRoles = ref<number[]>([])
const curUserId = ref<number>()

const getList = async () => {
  const res = await getUserListApi(pageNo.value, pageSize.value, keyword.value)
  list.value = res.data.records
  total.value = res.data.total
}

const openAdd = () => {
  Object.assign(form, { id: undefined, username: '', nickName: '', password: '' })
  dialog.value = true
}
const openEdit = (row: UserItem) => {
  Object.assign(form, row)
  dialog.value = true
}
const save = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    await addOrUpdateUserApi(form)
    ElMessage.success('保存成功')
    dialog.value = false
    getList()
  })
}
const remove = async (row: UserItem) => {
  await deleteUserApi(row.id!)
  ElMessage.success('删除成功')
  getList()
}

const assignRole = async (row: UserItem) => {
  curUserId.value = row.id
  const res = await getUserRoleApi(row.id!)
  allRoles.value = res.data.allRolesList
  checkedRoles.value = res.data.assignRoles.map((r) => r.id!) as number[]
  roleDialog.value = true
}
const saveRole = async () => {
  await assignRoleApi({ userId: curUserId.value!, roleIdList: checkedRoles.value })
  ElMessage.success('分配成功')
  roleDialog.value = false
  getList()
}

onMounted(getList)
</script>

<style scoped lang="scss">
.user {
  .mt-20 {
    margin-top: 20px;
  }
}
</style>
