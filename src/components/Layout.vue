<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
      <div class="logo">
        <h2>成绩管理系统</h2>
      </div>
      <nav class="menu">
        <router-link to="/home" class="menu-item" :class="{ active: currentRoute.path === '/home' }">
          <el-icon><HomeFilled /></el-icon>
          <span class="menu-text">首页</span>
        </router-link>
        <router-link v-if="userStore.isAdmin" to="/home/grade-entry" class="menu-item" active-class="active">
          <el-icon><EditPen /></el-icon>
          <span class="menu-text">成绩录入</span>
        </router-link>
        <router-link to="/home/grade-query" class="menu-item" active-class="active">
          <el-icon><Search /></el-icon>
          <span class="menu-text">成绩查询</span>
        </router-link>
        <router-link v-if="userStore.isAdmin" to="/home/students" class="menu-item" active-class="active">
          <el-icon><User /></el-icon>
          <span class="menu-text">学生管理</span>
        </router-link>
        <router-link v-if="userStore.isAdmin" to="/home/courses" class="menu-item" active-class="active">
          <el-icon><Reading /></el-icon>
          <span class="menu-text">课程管理</span>
        </router-link>
        <router-link to="/home/statistics" class="menu-item" active-class="active">
          <el-icon><PieChart /></el-icon>
          <span class="menu-text">统计分析</span>
        </router-link>
      </nav>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="header">
        <div class="header-left">
          <button class="toggle-sidebar" :class="{ collapsed: isSidebarCollapsed }" @click="toggleSidebar">
            <span class="toggle-icon"></span>
            <span class="toggle-text">{{isSidebarCollapsed ? '展开' : '收起'}}</span>
          </button>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentRoute.name !== 'Home'">{{ getPageTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="right-menu">
          <el-dropdown trigger="click">
            <div class="avatar-container">
              <el-avatar 
                :size="32" 
                :src="userStore.avatar"
                v-if="userStore.avatar"
              >
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <el-icon v-else class="avatar-icon"><UserFilled /></el-icon>
              <span class="username">{{ userStore.userInfo.username }}</span>
              <el-icon><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/home/profile')">
                  <el-icon><User /></el-icon>个人信息
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/home/settings')">
                  <el-icon><Setting /></el-icon>系统设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeFilled,
  EditPen,
  Search,
  User,
  Reading,
  PieChart,
  Setting,
  SwitchButton,
  UserFilled,
  CaretBottom
} from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const currentRoute = useRoute()
const showDropdown = ref(false)
const isSidebarCollapsed = ref(false)
const userStore = useUserStore()

// 计算当前页面标题
const getPageTitle = computed(() => {
  const routeMap: { [key: string]: string } = {
    'Home': '首页',
    'GradeEntry': '成绩录入',
    'GradeQuery': '成绩查询',
    'Students': '学生管理',
    'Courses': '课程管理',
    'Statistics': '统计分析',
    'Profile': '个人信息',
    'Settings': '系统设置'
  }
  return routeMap[currentRoute.name as string] || '首页'
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  showDropdown.value = false
}

const handleProfile = () => {
  router.push('/home/profile')
  showDropdown.value = false
}

const handleSettings = () => {
  router.push('/home/settings')
  showDropdown.value = false
}

// 点击其他地方关闭下拉菜单
const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.user-info')) {
    showDropdown.value = false
  }
}

// 添加全局点击事件监听
window.addEventListener('click', closeDropdown)
</script>

<style lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.sidebar {
  width: 240px;
  padding: 20px 0;
  flex-shrink: 0;
  background-color: var(--sidebar-bg-color);
  color: var(--sidebar-text-color);
  border-right: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;

  &.collapsed {
    width: 80px;

    .menu-text {
      display: none;
    }

    .logo h2 {
      display: none;
    }

    .menu-item .el-icon {
      margin-right: 0;
      margin-left: 8px;
    }
  }
}

.logo {
  padding: 0 20px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--sidebar-text-color);
    white-space: nowrap;
  }
}

.menu {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
}

.menu-item {
  padding: 12px 16px;
  margin: 4px 0;
  text-decoration: none;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 10px;
  color: var(--sidebar-text-color);
  transition: all 0.3s ease;

  &:hover,
  &.active {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  .el-icon {
    min-width: 24px;
    margin-right: 10px;
    font-size: 18px;
    transition: margin-right 0.3s ease;
    color: inherit;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: all 0.3s ease;
}

.header {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: var(--header-bg-color);
  color: var(--header-text-color);
  border-bottom: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toggle-sidebar {
  padding: 6px 12px;
  background-color: transparent;
  color: var(--el-text-color-primary);
  border: 1px solid var(--el-border-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  min-width: 80px;
  text-align: center;
  line-height: 1;

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  &:active {
    transform: scale(0.98);
  }

  .toggle-icon {
    position: relative;
    width: 14px;
    height: 14px;
    flex-shrink: 0;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background-color: currentColor;
      border-radius: 1px;
      transition: all 0.3s;
    }

    &::before {
      width: 10px;
      height: 2px;
      top: 6px;
      left: 2px;
      transform-origin: center;
    }

    &::after {
      width: 2px;
      height: 10px;
      top: 2px;
      left: 6px;
      transform-origin: center;
    }
  }

  &.collapsed {
    .toggle-icon::after {
      transform: scaleY(0);
    }
  }

  .toggle-text {
    line-height: 14px;
  }
}

.breadcrumb {
  font-size: 16px;
  color: var(--header-text-color);
}

.el-breadcrumb {
  line-height: 1;
}

.right-menu {
  display: flex;
  align-items: center;
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  
  .el-avatar {
    margin-right: 8px;
  }
  
  .avatar-icon {
    font-size: 20px;
    margin-right: 8px;
  }
  
  .username {
    font-size: 14px;
    margin-right: 4px;
  }
}

.content {
  flex: 1;
  padding: 24px;
  background-color: #f0f2f5;
}

.sidebar.collapsed {
  .menu {
    padding: 0 8px;
  }

  .menu-text {
    display: none;
  }

  .logo h2 {
    display: none;
  }

  .menu-item {
    padding: 12px;
    justify-content: center;

    .el-icon {
      margin-right: 0;
      margin-left: 0;
    }
  }
}
</style> 