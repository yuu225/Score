import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ThemeOption {
  name: string
  label: string
  color: string
  textColor: string
}

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const themes: ThemeOption[] = [
    { name: 'white', label: '纯净白', color: '#ffffff', textColor: '#333333' },
    { name: 'navy', label: '淡蓝灰', color: '#f0f2f5', textColor: '#2c3e50' },
    { name: 'warm', label: '暖米色', color: '#faf6f1', textColor: '#5c4f3d' },
    { name: 'teal', label: '清青色', color: '#f0f5f5', textColor: '#2f4f4f' }
  ]
  
  const currentTheme = ref(localStorage.getItem('theme') || 'white')
  
  // 计算属性
  const currentThemeConfig = computed(() => 
    themes.find(t => t.name === currentTheme.value)
  )
  
  // 动作
  function changeTheme(themeName: string) {
    if (!themes.some(t => t.name === themeName)) return
    
    currentTheme.value = themeName
    localStorage.setItem('theme', themeName)
    
    const root = document.documentElement
    const themeConfig = themes.find(t => t.name === themeName)
    
    if (themeConfig) {
      root.style.setProperty('--sidebar-bg-color', themeConfig.color)
      root.style.setProperty('--sidebar-text-color', themeConfig.textColor)
      root.style.setProperty('--header-bg-color', themeConfig.color)
      root.style.setProperty('--header-text-color', themeConfig.textColor)
    }
  }
  
  // 自定义主题
  function addCustomTheme(theme: ThemeOption) {
    if (themes.some(t => t.name === theme.name)) return
    themes.push(theme)
  }
  
  return {
    themes,
    currentTheme,
    currentThemeConfig,
    changeTheme,
    addCustomTheme
  }
}) 