<template>
  <div class="statistics-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>成绩统计分析</h2>
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

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="statistics-cards" v-if="filteredGrades.length > 0">
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header-small">
                <span>总成绩数</span>
                <el-tag>{{ filteredGrades.length }}</el-tag>
              </div>
            </template>
            <div class="statistics-detail">
              <div class="detail-item">
                <span>及格人数：</span>
                <span>{{ passCount }}</span>
              </div>
              <div class="detail-item">
                <span>不及格人数：</span>
                <span class="text-danger">{{ failCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header-small">
                <span>平均分</span>
                <el-tag type="success">{{ averageScore }}</el-tag>
              </div>
            </template>
            <div class="statistics-detail">
              <div class="detail-item">
                <span>最高分：</span>
                <span class="text-success">{{ maxScore }}</span>
              </div>
              <div class="detail-item">
                <span>最低分：</span>
                <span :class="minScore < 60 ? 'text-danger' : ''">{{ minScore }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header-small">
                <span>及格率</span>
                <el-tag :type="passRate >= 80 ? 'success' : passRate >= 60 ? 'warning' : 'danger'">
                  {{ passRate }}%
                </el-tag>
              </div>
            </template>
            <div class="statistics-detail">
              <div class="detail-item">
                <span>优秀率：</span>
                <span class="text-success">{{ excellentRate }}%</span>
              </div>
              <div class="detail-item">
                <span>良好率：</span>
                <span class="text-primary">{{ goodRate }}%</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header-small">
                <span>分数段分布</span>
                <el-tag type="info">分布图</el-tag>
              </div>
            </template>
            <div class="statistics-detail">
              <div class="detail-item">
                <el-progress :percentage="excellentRate" status="success" :format="() => '优秀'" />
                <el-progress :percentage="goodRate" status="warning" :format="() => '良好'" />
                <el-progress :percentage="passRate - goodRate - excellentRate" :format="() => '及格'" />
                <el-progress :percentage="failRate" status="exception" :format="() => '不及格'" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 成绩分布图表 -->
      <div class="charts-container" v-if="filteredGrades.length > 0">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header-small">
                  <span>课程成绩分布</span>
                </div>
              </template>
              <div class="chart-wrapper">
                <el-table :data="courseStats" style="width: 100%">
                  <el-table-column prop="courseName" label="课程名称" />
                  <el-table-column prop="avgScore" label="平均分">
                    <template #default="{ row }">
                      {{ row.avgScore.toFixed(1) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="passRate" label="及格率">
                    <template #default="{ row }">
                      <el-progress
                        :percentage="row.passRate"
                        :status="row.passRate >= 80 ? 'success' : row.passRate >= 60 ? 'warning' : 'exception'"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header-small">
                  <span>分数段分布</span>
                </div>
              </template>
              <div class="chart-wrapper">
                <el-table :data="scoreRangeStats" style="width: 100%">
                  <el-table-column prop="range" label="分数段" />
                  <el-table-column prop="count" label="人数" />
                  <el-table-column prop="percentage" label="占比">
                    <template #default="{ row }">
                      <el-progress
                        :percentage="row.percentage"
                        :status="getScoreRangeStatus(row.range)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 无数据提示 -->
      <el-empty v-else description="暂无成绩数据" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { dataService } from '../services/dataService'

interface QueryForm {
  studentId: string
  courseId: string
  dateRange: [string, string] | null
}

// 查询表单
const queryForm = ref<QueryForm>({
  studentId: '',
  courseId: '',
  dateRange: null
})

const queryFormRef = ref<FormInstance>()

// 学生和课程数据
const students = computed(() => dataService.students.value)
const courses = computed(() => dataService.courses.value)

// 过滤后的成绩列表
const filteredGrades = computed(() => {
  return dataService.grades.value.filter(item => {
    if (queryForm.value.studentId && item.studentId !== queryForm.value.studentId) {
      return false
    }
    if (queryForm.value.courseId && item.courseId !== queryForm.value.courseId) {
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

// 获取成绩列表
const fetchGradeList = () => {
  // 成绩数据已经在 dataService.initData() 中初始化
}

// 基础统计数据
const passCount = computed(() => filteredGrades.value.filter(item => item.score >= 60).length)
const failCount = computed(() => filteredGrades.value.length - passCount.value)
const averageScore = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  const total = filteredGrades.value.reduce((sum, item) => sum + item.score, 0)
  return (total / filteredGrades.value.length).toFixed(1)
})
const maxScore = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  return Math.max(...filteredGrades.value.map(item => item.score))
})
const minScore = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  return Math.min(...filteredGrades.value.map(item => item.score))
})

// 比率统计
const passRate = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  return Number(((passCount.value / filteredGrades.value.length) * 100).toFixed(1))
})
const excellentRate = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  const count = filteredGrades.value.filter(item => item.score >= 90).length
  return Number(((count / filteredGrades.value.length) * 100).toFixed(1))
})
const goodRate = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  const count = filteredGrades.value.filter(item => item.score >= 80 && item.score < 90).length
  return Number(((count / filteredGrades.value.length) * 100).toFixed(1))
})
const failRate = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  return Number(((failCount.value / filteredGrades.value.length) * 100).toFixed(1))
})

// 课程统计
const courseStats = computed(() => {
  const stats = new Map()
  
  filteredGrades.value.forEach(grade => {
    if (!stats.has(grade.courseId)) {
      stats.set(grade.courseId, {
        courseName: grade.courseName,
        totalScore: 0,
        count: 0,
        passCount: 0
      })
    }
    
    const stat = stats.get(grade.courseId)
    stat.totalScore += grade.score
    stat.count++
    if (grade.score >= 60) {
      stat.passCount++
    }
  })

  return Array.from(stats.values()).map(stat => ({
    courseName: stat.courseName,
    avgScore: stat.totalScore / stat.count,
    passRate: Number(((stat.passCount / stat.count) * 100).toFixed(1))
  }))
})

// 分数段统计
const scoreRangeStats = computed(() => {
  const ranges = [
    { range: '90-100', min: 90, max: 100 },
    { range: '80-89', min: 80, max: 89 },
    { range: '70-79', min: 70, max: 79 },
    { range: '60-69', min: 60, max: 69 },
    { range: '0-59', min: 0, max: 59 }
  ]

  return ranges.map(range => {
    const count = filteredGrades.value.filter(
      grade => grade.score >= range.min && grade.score <= range.max
    ).length
    return {
      range: range.range,
      count,
      percentage: Number(((count / filteredGrades.value.length) * 100).toFixed(1))
    }
  })
})

// 获取分数段状态
const getScoreRangeStatus = (range: string) => {
  switch (range) {
    case '90-100':
      return 'success'
    case '80-89':
      return 'primary'
    case '70-79':
    case '60-69':
      return 'warning'
    default:
      return 'exception'
  }
}

// 查询处理
const handleQuery = () => {
  // 查询时不需要特殊处理，因为使用了计算属性
}

// 重置查询
const handleReset = () => {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }
  queryForm.value = {
    studentId: '',
    courseId: '',
    dateRange: null
  }
}

onMounted(() => {
  dataService.initData()
  fetchGradeList()
})
</script>

<style scoped>
.statistics-page {
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

.statistics-cards {
  margin-bottom: 20px;
}

.card-header-small {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.statistics-detail {
  padding: 10px 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.charts-container {
  margin-top: 20px;
}

.chart-wrapper {
  height: 300px;
  padding: 10px;
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

:deep(.el-date-editor) {
  width: 240px;
}

:deep(.el-progress) {
  margin-bottom: 8px;
}

:deep(.el-progress:last-child) {
  margin-bottom: 0;
}

:deep(.el-card__header) {
  padding: 10px 20px;
}

:deep(.el-progress-bar__outer) {
  background-color: #f5f7fa;
}
</style> 