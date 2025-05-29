<template>
  <div class="users">
    <h2>用户管理</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>注册时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.registerDate }}</td>
            <td>
              <span :class="['status', user.status]">{{ user.status }}</span>
            </td>
            <td>
              <button class="btn edit">编辑</button>
              <button class="btn delete">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  username: string
  email: string
  registerDate: string
  status: 'active' | 'inactive'
}

const users = ref<User[]>([
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    registerDate: '2024-03-15',
    status: 'active'
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    registerDate: '2024-03-14',
    status: 'inactive'
  },
  // 添加更多模拟数据...
])
</script>

<style scoped>
.users {
  padding: 20px;
}

h2 {
  margin-bottom: 24px;
  color: #1f2937;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 500;
  color: #374151;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.active {
  background-color: #d1fae5;
  color: #059669;
}

.status.inactive {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: 8px;
}

.btn.edit {
  background-color: #dbeafe;
  color: #2563eb;
}

.btn.delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn:hover {
  opacity: 0.9;
}
</style> 