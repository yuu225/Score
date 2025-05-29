<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="welcome-card">
          <h2>欢迎使用成绩管理系统</h2>
          <p>当前时间：{{ currentTime }}</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="shortcut-row">
      <el-col :span="6" v-if="userStore.isAdmin">
        <el-card class="shortcut-card" @click="router.push('/home/grade-entry')">
          <el-icon><EditPen /></el-icon>
          <h3>成绩录入</h3>
          <p>录入学生课程成绩</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="shortcut-card" @click="router.push('/home/grade-query')">
          <el-icon><Search /></el-icon>
          <h3>成绩查询</h3>
          <p>查询学生成绩信息</p>
        </el-card>
      </el-col>
      <el-col :span="6" v-if="userStore.isAdmin">
        <el-card class="shortcut-card" @click="router.push('/home/students')">
          <el-icon><User /></el-icon>
          <h3>学生管理</h3>
          <p>管理学生基本信息</p>
        </el-card>
      </el-col>
      <el-col :span="6" v-if="userStore.isAdmin">
        <el-card class="shortcut-card" @click="router.push('/home/courses')">
          <el-icon><Reading /></el-icon>
          <h3>课程管理</h3>
          <p>管理课程基本信息</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="shortcut-card" @click="router.push('/home/statistics')">
          <el-icon><PieChart /></el-icon>
          <h3>统计分析</h3>
          <p>成绩统计与分析</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="shortcut-card" @click="router.push('/home/profile')">
          <el-icon><User /></el-icon>
          <h3>个人信息</h3>
          <p>查看和修改个人信息</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="shortcut-card" @click="router.push('/home/settings')">
          <el-icon><Setting /></el-icon>
          <h3>系统设置</h3>
          <p>修改系统相关设置</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { EditPen, Search, User, Reading, PieChart, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const currentTime = ref(new Date().toLocaleString())
const timer = ref<NodeJS.Timeout>()

onMounted(() => {
  // 更新当前时间
  timer.value = setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}

.welcome-card {
  background-color: var(--el-color-primary-light-9);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: var(--el-color-primary);
  }

  p {
    margin: 10px 0 0;
    color: var(--el-text-color-secondary);
  }
}

.shortcut-row {
  margin-top: 20px;
}

.shortcut-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }

  .el-icon {
    font-size: 32px;
    color: var(--el-color-primary);
    margin-bottom: 10px;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 18px;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}
</style> 