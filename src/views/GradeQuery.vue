<template>
  <div class="grade-query">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>成绩查询</h2>
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
        <el-form-item label="录入时间">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 统计信息 -->
      <div class="statistics" v-if="filteredGradeList.length > 0">
        <el-descriptions :column="4" border>
          <el-descriptions-item label="总人数">{{ filteredGradeList.length }}</el-descriptions-item>
          <el-descriptions-item label="平均分">{{ averageScore }}</el-descriptions-item>
          <el-descriptions-item label="最高分">{{ maxScore }}</el-descriptions-item>
          <el-descriptions-item label="最低分">{{ minScore }}</el-descriptions-item>
          <el-descriptions-item label="及格率">{{ passRate }}%</el-descriptions-item>
          <el-descriptions-item label="优秀率">{{ excellentRate }}%</el-descriptions-item>
          <el-descriptions-item label="良好率">{{ goodRate }}%</el-descriptions-item>
          <el-descriptions-item label="不及格率">{{ failRate }}%</el-descriptions-item>
        </el-descriptions>
      </div>

      <el-table :data="pagedGradeList" style="width: 100%" v-loading="loading">
        <el-table-column prop="studentName" label="学生姓名" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="score" label="成绩" width="100">
          <template #default="{ row }">
            <span :class="getScoreClass(row.score)">{{ row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.score)">{{ getScoreLevel(row.score) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="录入时间" width="180" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
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
  dateRange: [string, string] | null
}

// 查询表单
const queryForm = ref<QueryForm>({
  studentId: '',
  courseId: '',
  minScore: null,
  maxScore: null,
  dateRange: null
})

// 模拟数据
const students = computed(() => dataService.students.value)
const courses = computed(() => dataService.courses.value)

const gradeList = ref<Grade[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const queryFormRef = ref<FormInstance>()

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
    if (queryForm.value.dateRange && queryForm.value.dateRange.length === 2) {
      const itemDate = new Date(item.createTime).toISOString().split('T')[0]
      if (itemDate < queryForm.value.dateRange[0] || itemDate > queryForm.value.dateRange[1]) {
        return false
      }
    }
    return true
  })
})

// 分页后的成绩列表
const pagedGradeList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGradeList.value.slice(start, end)
})

// 统计信息计算
const averageScore = computed(() => {
  if (filteredGradeList.value.length === 0) return 0
  const total = filteredGradeList.value.reduce((sum, item) => sum + item.score, 0)
  return (total / filteredGradeList.value.length).toFixed(1)
})

const maxScore = computed(() => {
  if (filteredGradeList.value.length === 0) return 0
  return Math.max(...filteredGradeList.value.map(item => item.score))
})

const minScore = computed(() => {
  if (filteredGradeList.value.length === 0) return 0
  return Math.min(...filteredGradeList.value.map(item => item.score))
})

const passRate = computed(() => {
  if (filteredGradeList.value.length === 0) return 0
  const passCount = filteredGradeList.value.filter(item => item.score >= 60).length
  return ((passCount / filteredGradeList.value.length) * 100).toFixed(1)
})

const excellentRate = computed(() => {
  if (filteredGradeList.value.length === 0) return 0
  const excellentCount = filteredGradeList.value.filter(item => item.score >= 90).length
  return ((excellentCount / filteredGradeList.value.length) * 100).toFixed(1)
})

const goodRate = computed(() => {
  if (filteredGradeList.value.length === 0) return 0
  const goodCount = filteredGradeList.value.filter(item => item.score >= 80 && item.score < 90).length
  return ((goodCount / filteredGradeList.value.length) * 100).toFixed(1)
})

const failRate = computed(() => {
  if (filteredGradeList.value.length === 0) return 0
  const failCount = filteredGradeList.value.filter(item => item.score < 60).length
  return ((failCount / filteredGradeList.value.length) * 100).toFixed(1)
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
    maxScore: null,
    dateRange: null
  }
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 成绩等级和样式
const getScoreClass = (score: number) => {
  if (score >= 90) return 'text-success'
  if (score >= 80) return 'text-primary'
  if (score >= 60) return 'text-warning'
  return 'text-danger'
}

const getScoreLevel = (score: number) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 60) return '及格'
  return '不及格'
}

const getScoreTagType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

onMounted(() => {
  dataService.initData() // 初始化学生和课程数据
  fetchGradeList()
})
</script>

<style scoped>
.grade-query {
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

.statistics {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.text-success {
  color: #67C23A;
}

.text-primary {
  color: #409EFF;
}

.text-warning {
  color: #E6A23C;
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

:deep(.el-date-editor) {
  width: 240px;
}

:deep(.el-descriptions) {
  margin: 0;
  padding: 20px;
  background-color: #fff;
}

:deep(.el-descriptions__cell) {
  text-align: center;
}
</style> 