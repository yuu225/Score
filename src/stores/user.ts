import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  username: string
  realName: string
  email: string
  phone: string
  role: string
}

// 模拟用户数据，实际项目中应该从后端API获取
const mockUsers = [
  {
    username: 'admin',
    password: '123456',
    role: 'admin',
    avatar: ''
  },
  {
    username: 'user',
    password: '123456',
    role: 'user',
    avatar: ''
  }
]

// 从localStorage获取保存的用户头像
const getSavedAvatar = (username: string): string => {
  const savedAvatars = JSON.parse(localStorage.getItem('userAvatars') || '{}')
  return savedAvatars[username] || ''
}

// 保存用户头像到localStorage
const saveAvatar = (username: string, avatarUrl: string) => {
  const savedAvatars = JSON.parse(localStorage.getItem('userAvatars') || '{}')
  savedAvatars[username] = avatarUrl
  localStorage.setItem('userAvatars', JSON.stringify(savedAvatars))
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token'))
  const avatar = ref('')
  const userInfo = ref<UserInfo>({
    username: '',
    realName: '',
    email: '',
    phone: '',
    role: ''
  })

  // 设置头像
  function setAvatar(url: string) {
    avatar.value = url
    if (userInfo.value.username) {
      saveAvatar(userInfo.value.username, url)
    }
  }

  // 设置用户信息
  function setUserInfo(info: typeof userInfo.value) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 登录
  async function login(username: string, password: string): Promise<boolean> {
    const user = mockUsers.find(
      u => u.username === username && u.password === password
    )

    if (user) {
      token.value = btoa(username + Date.now())
      localStorage.setItem('token', token.value)
      
      // 获取保存的头像
      const savedAvatar = getSavedAvatar(username)
      setAvatar(savedAvatar)
      
      setUserInfo({
        username: user.username,
        role: user.role,
        realName: user.role === 'admin' ? '管理员' : '学生用户',
        email: `${username}@example.com`,
        phone: '13800138000'
      })
      return true
    }
    return false
  }

  // 登出
  function logout() {
    token.value = null
    avatar.value = ''
    localStorage.removeItem('token')
  }

  // 检查是否登录
  const isLoggedIn = computed(() => !!token.value)

  // 检查是否是管理员
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  return {
    token,
    avatar,
    userInfo,
    setAvatar,
    setUserInfo,
    login,
    logout,
    isLoggedIn,
    isAdmin
  }
}) 