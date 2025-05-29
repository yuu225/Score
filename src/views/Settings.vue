<template>
  <div class="settings-page">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h2>系统设置</h2>
        </div>
      </template>
      
      <div class="settings-section">
        <h3>主题设置</h3>
        <div class="theme-options">
          <div
            v-for="theme in themeStore.themes"
            :key="theme.name"
            class="theme-option"
            :class="{ active: themeStore.currentTheme === theme.name }"
            @click="themeStore.changeTheme(theme.name)"
          >
            <div class="color-preview" :style="{ backgroundColor: theme.color }">
              <span class="color-text" :style="{ color: theme.textColor }">Aa</span>
            </div>
            <div class="theme-name">{{ theme.label }}</div>
          </div>
        </div>
      </div>

      <!-- 添加自定义主题部分 -->
      <div class="settings-section">
        <h3>自定义主题</h3>
        <el-form :model="customTheme" label-width="100px">
          <el-form-item label="主题名称">
            <el-input v-model="customTheme.name" placeholder="请输入主题名称（英文）"/>
          </el-form-item>
          <el-form-item label="显示名称">
            <el-input v-model="customTheme.label" placeholder="请输入显示名称"/>
          </el-form-item>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="customTheme.color"/>
          </el-form-item>
          <el-form-item label="文字颜色">
            <el-color-picker v-model="customTheme.textColor"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addTheme">添加主题</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore, type ThemeOption } from '../stores/theme'

const themeStore = useThemeStore()

// 自定义主题表单
const customTheme = ref<ThemeOption>({
  name: '',
  label: '',
  color: '#ffffff',
  textColor: '#333333'
})

// 添加自定义主题
const addTheme = () => {
  if (!customTheme.value.name || !customTheme.value.label) {
    return
  }
  
  themeStore.addCustomTheme({ ...customTheme.value })
  
  // 重置表单
  customTheme.value = {
    name: '',
    label: '',
    color: '#ffffff',
    textColor: '#333333'
  }
}
</script>

<style lang="scss" scoped>
.settings-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}

.settings-section {
  margin-bottom: 30px;

  h3 {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.theme-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.theme-option {
  width: calc(33.33% - 10px);
  padding: 10px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    border-color: var(--el-color-primary);
  }

  .color-preview {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    border-radius: 4px;
  }

  .color-text {
    font-size: 14px;
    font-weight: 600;
  }

  .theme-name {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style> 