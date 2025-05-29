<template>
  <div class="courses">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>课程管理</h2>
          <el-button type="primary" @click="handleAdd">添加课程</el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :model="queryForm" ref="queryFormRef" inline class="search-form">
        <el-form-item label="课程号">
          <el-input v-model="queryForm.courseId" placeholder="请输入课程号" clearable />
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="queryForm.name" placeholder="请输入课程名" clearable />
        </el-form-item>
        <el-form-item label="教师">
          <el-input v-model="queryForm.teacher" placeholder="请输入教师姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredCourses" style="width: 100%" v-loading="loading">
        <el-table-column prop="courseId" label="课程号" width="120" />
        <el-table-column prop="name" label="课程名称" width="150" />
        <el-table-column prop="credit" label="学分" width="100" />
        <el-table-column prop="teacher" label="任课教师" width="120" />
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
          :total="filteredCourses.length"
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
      :title="dialogType === 'add' ? '添加课程' : '编辑课程'"
      width="500px"
      @close="resetDialogForm"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="课程号" prop="courseId">
          <el-input v-model="dialogForm.courseId" placeholder="请输入课程号" />
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input-number v-model="dialogForm.credit" :min="0.5" :max="10" :step="0.5" />
        </el-form-item>
        <el-form-item label="任课教师" prop="teacher">
          <el-input v-model="dialogForm.teacher" placeholder="请输入教师姓名" />
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
import { dataService, type Course } from '../services/dataService'

interface QueryForm {
  courseId: string
  name: string
  teacher: string
}

// 查询表单
const queryForm = ref<QueryForm>({
  courseId: '',
  name: '',
  teacher: ''
})

// 对话框表单
const dialogForm = ref({
  id: '',
  courseId: '',
  name: '',
  credit: 2,
  teacher: '',
  createTime: ''
})

// 验证规则
const rules = {
  courseId: [
    { required: true, message: '请输入课程号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  credit: [
    { required: true, message: '请输入学分', trigger: 'blur' },
    { type: 'number', min: 0.5, max: 10, message: '学分范围 0.5-10', trigger: 'blur' }
  ],
  teacher: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' }
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

// 过滤后的课程列表
const filteredCourses = computed(() => {
  return dataService.courses.value.filter(item => {
    if (queryForm.value.courseId && !item.courseId.includes(queryForm.value.courseId)) {
      return false
    }
    if (queryForm.value.name && !item.name.includes(queryForm.value.name)) {
      return false
    }
    if (queryForm.value.teacher && !item.teacher.includes(queryForm.value.teacher)) {
      return false
    }
    return true
  })
})

// 分页后的课程列表
const pagedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCourses.value.slice(start, end)
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
    courseId: '',
    name: '',
    teacher: ''
  }
  currentPage.value = 1
}

// 重置对话框表单
const resetDialogForm = () => {
  dialogForm.value = {
    id: '',
    courseId: '',
    name: '',
    credit: 2,
    teacher: '',
    createTime: ''
  }
  if (dialogFormRef.value) {
    dialogFormRef.value.resetFields()
  }
}

// 添加课程
const handleAdd = () => {
  dialogType.value = 'add'
  resetDialogForm()
  dialogVisible.value = true
}

// 编辑课程
const handleEdit = (row: Course) => {
  dialogType.value = 'edit'
  dialogForm.value = { ...row }
  dialogVisible.value = true
}

// 删除课程
const handleDelete = async (row: Course) => {
  try {
    await ElMessageBox.confirm('确定要删除这门课程吗？', '提示', {
      type: 'warning'
    })
    dataService.deleteCourse(row.id)
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
        const course: Course = {
          id: dialogType.value === 'add' ? String(Date.now()) : dialogForm.value.id,
          courseId: dialogForm.value.courseId,
          name: dialogForm.value.name,
          credit: dialogForm.value.credit,
          teacher: dialogForm.value.teacher,
          createTime: dialogType.value === 'add' ? new Date().toLocaleString() : dialogForm.value.createTime
        }

        if (dialogType.value === 'add') {
          // 检查课程号是否已存在
          const exists = dataService.courses.value.some(
            item => item.courseId === course.courseId
          )
          if (exists) {
            ElMessage.error('该课程号已存在')
            return
          }
          dataService.addCourse(course)
        } else {
          dataService.updateCourse(course)
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
.courses {
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

:deep(.el-input-number) {
  width: 180px;
}
</style> 