<template>
  <div class="grade-entry">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>成绩录入</h2>
          <el-button type="primary" @click="handleAdd">添加成绩</el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :model="queryForm" ref="queryFormRef" inline class="search-form">
        <el-form-item label="学生">
          <el-select v-model="queryForm.studentId" placeholder="请选择学生" clearable filterable>
            <el-option
              v-for="student in students"
              :key="student.id"
              :label="student.name"
              :value="student.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable filterable>
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成绩范围">
          <el-input-number v-model="queryForm.minScore" :min="0" :max="100" placeholder="最低分" />
          <span class="separator">-</span>
          <el-input-number v-model="queryForm.maxScore" :min="0" :max="100" placeholder="最高分" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredGradeList" style="width: 100%" v-loading="loading">
        <el-table-column prop="studentName" label="学生姓名" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="score" label="成绩" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-danger': row.score < 60 }">{{ row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="录入时间" width="180" />
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
          :total="filteredGradeList.length"
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
      :title="dialogType === 'add' ? '添加成绩' : '编辑成绩'"
      width="500px"
      @close="resetDialogForm"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学生" prop="studentId">
          <el-select 
            v-model="dialogForm.studentId" 
            placeholder="请选择学生" 
            filterable
            :disabled="dialogType === 'edit'"
          >
            <el-option
              v-for="student in students"
              :key="student.id"
              :label="student.name"
              :value="student.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="courseId">
          <el-select 
            v-model="dialogForm.courseId" 
            placeholder="请选择课程" 
            filterable
            :disabled="dialogType === 'edit'"
          >
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input-number 
            v-model="dialogForm.score" 
            :min="0" 
            :max="100"
            :precision="1"
            :step="0.5"
          />
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
import { dataService } from '../services/dataService'

interface Grade {
  id: string
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  score: number
  createTime: string
}

interface QueryForm {
  studentId: string
  courseId: string
  minScore: number | null
  maxScore: number | null
}

// 查询表单
const queryForm = ref<QueryForm>({
  studentId: '',
  courseId: '',
  minScore: null,
  maxScore: null
})

// 对话框表单数据
const dialogForm = ref({
  id: '',
  studentId: '',
  courseId: '',
  score: 0
})

// 验证规则
const rules = {
  studentId: [{ required: true, message: '请选择学生', trigger: 'change' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  score: [
    { required: true, message: '请输入成绩', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '成绩范围 0-100', trigger: 'blur' }
  ]
}

// 模拟数据
const students = computed(() => dataService.students.value)
const courses = computed(() => dataService.courses.value)

const gradeList = ref<Grade[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const queryFormRef = ref<FormInstance>()
const dialogFormRef = ref<FormInstance>()

// 过滤后的成绩列表
const filteredGradeList = computed(() => {
  return dataService.grades.value.filter(item => {
    if (queryForm.value.studentId && item.studentId !== queryForm.value.studentId) {
      return false
    }
    if (queryForm.value.courseId && item.courseId !== queryForm.value.courseId) {
      return false
    }
    if (queryForm.value.minScore !== null && item.score < queryForm.value.minScore) {
      return false
    }
    if (queryForm.value.maxScore !== null && item.score > queryForm.value.maxScore) {
      return false
    }
    return true
  })
})

// 获取成绩列表
const fetchGradeList = async () => {
  loading.value = true
  try {
    // 成绩数据已经在 dataService.initData() 中初始化
    loading.value = false
  } catch (error) {
    ElMessage.error('获取成绩列表失败')
    loading.value = false
  }
}

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
    courseId: '',
    minScore: null,
    maxScore: null
  }
  currentPage.value = 1
}

// 重置对话框表单
const resetDialogForm = () => {
  dialogForm.value = {
    id: '',
    studentId: '',
    courseId: '',
    score: 0
  }
  if (dialogFormRef.value) {
    dialogFormRef.value.resetFields()
  }
}

// 添加成绩
const handleAdd = () => {
  dialogType.value = 'add'
  resetDialogForm()
  dialogVisible.value = true
}

// 编辑成绩
const handleEdit = (row: Grade) => {
  dialogType.value = 'edit'
  dialogForm.value = { ...row }
  dialogVisible.value = true
}

// 删除成绩
const handleDelete = async (row: Grade) => {
  try {
    await ElMessageBox.confirm('确定要删除这条成绩记录吗？', '提示', {
      type: 'warning'
    })
    // 在实际应用中，这里应该调用后端 API
    const index = gradeList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      gradeList.value.splice(index, 1)
      localStorage.setItem('grades', JSON.stringify(gradeList.value))
      ElMessage.success('删除成功')
    }
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
        const studentInfo = students.value.find(s => s.id === dialogForm.value.studentId)
        const courseInfo = courses.value.find(c => c.id === dialogForm.value.courseId)
        
        if (!studentInfo || !courseInfo) {
          throw new Error('学生或课程信息不存在')
        }

        const newGrade: Grade = {
          id: dialogType.value === 'add' ? String(Date.now()) : dialogForm.value.id,
          studentId: dialogForm.value.studentId,
          studentName: studentInfo.name,
          courseId: dialogForm.value.courseId,
          courseName: courseInfo.name,
          score: dialogForm.value.score,
          createTime: new Date().toLocaleString()
        }

        if (dialogType.value === 'add') {
          // 检查是否已存在相同学生和课程的成绩
          const exists = dataService.grades.value.some(
            item => item.studentId === newGrade.studentId && item.courseId === newGrade.courseId
          )
          if (exists) {
            ElMessage.error('该学生的这门课程成绩已存在')
            return
          }
          dataService.addGrade(newGrade)
        } else {
          dataService.updateGrade(newGrade)
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
  dataService.initData() // 初始化学生和课程数据
  fetchGradeList()
})
</script>

<style scoped>
.grade-entry {
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

.separator {
  margin: 0 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.text-danger {
  color: #F56C6C;
}

:deep(.el-form-item__content) {
  justify-content: flex-start;
}

:deep(.el-input-number) {
  width: 120px;
}
</style> 