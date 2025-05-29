<template>
  <div class="students">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>学生管理</h2>
          <el-button type="primary" @click="handleAdd">添加学生</el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :model="queryForm" ref="queryFormRef" inline class="search-form">
        <el-form-item label="学号">
          <el-input v-model="queryForm.studentId" placeholder="请输入学号" clearable />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="queryForm.class" placeholder="请输入班级" clearable />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="queryForm.major" placeholder="请输入专业" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredStudents" style="width: 100%" v-loading="loading">
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="class" label="班级" width="120" />
        <el-table-column prop="major" label="专业" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredStudents.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加学生' : '编辑学生'"
      width="500px"
      @close="resetDialogForm"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="dialogForm.studentId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="dialogForm.class" placeholder="请输入班级" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="dialogForm.major" placeholder="请输入专业" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { dataService, type Student } from '../services/dataService'

interface QueryForm {
  studentId: string
  name: string
  class: string
  major: string
}

// 查询表单
const queryForm = ref<QueryForm>({
  studentId: '',
  name: '',
  class: '',
  major: ''
})

// 对话框表单
const dialogForm = ref({
  id: '',
  studentId: '',
  name: '',
  class: '',
  major: '',
  createTime: ''
})

// 验证规则
const rules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  class: [
    { required: true, message: '请输入班级', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ]
}

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const queryFormRef = ref<FormInstance>()
const dialogFormRef = ref<FormInstance>()

// 过滤后的学生列表
const filteredStudents = computed(() => {
  return dataService.students.value.filter(item => {
    if (queryForm.value.studentId && !item.studentId.includes(queryForm.value.studentId)) {
      return false
    }
    if (queryForm.value.name && !item.name.includes(queryForm.value.name)) {
      return false
    }
    if (queryForm.value.class && !item.class.includes(queryForm.value.class)) {
      return false
    }
    if (queryForm.value.major && !item.major.includes(queryForm.value.major)) {
      return false
    }
    return true
  })
})

// 分页后的学生列表
const pagedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStudents.value.slice(start, end)
})

// 查询处理
const handleQuery = () => {
  currentPage.value = 1
}

// 重置查询
const handleReset = () => {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }
  queryForm.value = {
    studentId: '',
    name: '',
    class: '',
    major: ''
  }
  currentPage.value = 1
}

// 重置对话框表单
const resetDialogForm = () => {
  dialogForm.value = {
    id: '',
    studentId: '',
    name: '',
    class: '',
    major: '',
    createTime: ''
  }
  if (dialogFormRef.value) {
    dialogFormRef.value.resetFields()
  }
}

// 添加学生
const handleAdd = () => {
  dialogType.value = 'add'
  resetDialogForm()
  dialogVisible.value = true
}

// 编辑学生
const handleEdit = (row: Student) => {
  dialogType.value = 'edit'
  dialogForm.value = { ...row }
  dialogVisible.value = true
}

// 删除学生
const handleDelete = async (row: Student) => {
  try {
    await ElMessageBox.confirm('确定要删除这名学生吗？', '提示', {
      type: 'warning'
    })
    dataService.deleteStudent(row.id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!dialogFormRef.value) return

  await dialogFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const student: Student = {
          id: dialogType.value === 'add' ? String(Date.now()) : dialogForm.value.id,
          studentId: dialogForm.value.studentId,
          name: dialogForm.value.name,
          class: dialogForm.value.class,
          major: dialogForm.value.major,
          createTime: dialogType.value === 'add' ? new Date().toLocaleString() : dialogForm.value.createTime
        }

        if (dialogType.value === 'add') {
          // 检查学号是否已存在
          const exists = dataService.students.value.some(
            item => item.studentId === student.studentId
          )
          if (exists) {
            ElMessage.error('该学号已存在')
            return
          }
          dataService.addStudent(student)
        } else {
          dataService.updateStudent(student)
        }

        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '修改失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

onMounted(() => {
  dataService.initData()
})
</script>

<style scoped>
.students {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form-item__content) {
  justify-content: flex-start;
}
</style> 