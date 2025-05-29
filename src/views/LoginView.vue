<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="login-title">成绩管理系统</h2>
      </template>
      <el-form :model="loginForm" label-width="0" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="login-button" 
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
        <div class="login-tips">
          <p>测试账号：</p>
          <p>管理员账号：admin / 密码：123456</p>
          <p>普通用户：user / 密码：123456</p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const loading = ref(false)
const store = useUserStore() // 直接初始化 store

const loginForm = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  console.log('尝试登录:', loginForm.value) // 添加调试信息

  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.error('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    console.log('调用登录方法...') // 添加调试信息
    const success = await store.login(
      loginForm.value.username,
      loginForm.value.password
    )
    console.log('登录结果:', success) // 添加调试信息

    if (success) {
      ElMessage.success('登录成功')
      console.log('准备跳转到首页...') // 添加调试信息
      await router.push('/home')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    console.error('登录出错:', error) // 添加调试信息
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
}

.login-title {
  text-align: center;
  margin: 0;
  color: #303133;
}

.login-button {
  width: 100%;
}

.login-tips {
  margin-top: 20px;
  color: #909399;
  font-size: 13px;
  text-align: center;
}

.login-tips p {
  margin: 5px 0;
}

:deep(.el-input__wrapper) {
  background-color: #f5f7fa;
}

:deep(.el-card__header) {
  padding: 20px;
}
</style>
