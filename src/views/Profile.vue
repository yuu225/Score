<template>
  <div class="profile-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>个人信息</h2>
        </div>
      </template>

      <div class="profile-content">
        <!-- 左侧头像部分 -->
        <div class="avatar-section">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
            accept="image/*"
          >
            <template v-if="userStore.avatar">
              <img :src="userStore.avatar" class="avatar" />
            </template>
            <template v-else>
              <el-icon class="avatar-icon"><UserFilled /></el-icon>
            </template>
            <div class="avatar-hover">
              <el-icon><Edit /></el-icon>
              <span>更换头像</span>
            </div>
          </el-upload>
          <div class="avatar-tips">
            <p>支持 jpg、png、gif 格式，文件小于 2MB</p>
            <el-button v-if="userStore.avatar" type="danger" link @click="removeAvatar">
              删除头像
            </el-button>
          </div>
        </div>

        <!-- 右侧信息部分 -->
        <div class="info-section">
          <el-form :model="userInfo" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="userInfo.username" />
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-input v-model="userInfo.realName" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userInfo.phone" />
            </el-form-item>
            <el-form-item label="角色">
              <el-tag>{{ userInfo.role }}</el-tag>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUserInfo">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// 用户信息表单
const userInfo = ref({
  username: userStore.userInfo.username,
  realName: userStore.userInfo.realName,
  email: userStore.userInfo.email,
  phone: userStore.userInfo.phone,
  role: userStore.userInfo.role
})

// 处理头像上传
const handleAvatarChange = (file: any) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      userStore.setAvatar(result)
      ElMessage.success('头像更新成功')
    }
  }
  reader.readAsDataURL(file.raw)
}

// 删除头像
const removeAvatar = () => {
  userStore.setAvatar('')
  ElMessage.success('头像已删除')
}

// 保存用户信息
const saveUserInfo = () => {
  userStore.setUserInfo(userInfo.value)
  ElMessage.success('个人信息保存成功')
}
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 20px;
}

.profile-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
}

.info-section {
  flex: 1;
}

.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 2px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
    
    .avatar-hover {
      opacity: 1;
    }
  }
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-icon {
  font-size: 48px;
  color: var(--el-text-color-placeholder);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;

  .el-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }

  span {
    font-size: 12px;
  }
}

.avatar-tips {
  margin-top: 8px;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 12px;

  p {
    margin: 0 0 8px 0;
  }
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
</style> 