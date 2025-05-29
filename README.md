# 学生成绩管理系统

基于 Vue 3 + TypeScript + Element Plus 开发的学生成绩管理系统。

## 功能特点

- 用户认证与授权
- 成绩录入与查询
- 学生信息管理
- 课程管理
- 成绩统计分析
- 个人信息管理

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- Vue Router
- Pinia
- LocalStorage

## 开发环境要求

- Node.js >= 16
- npm >= 7

## 安装与运行

```bash
# 克隆项目
git clone https://github.com/yuu225/Score.git

# 进入项目目录
cd Score

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── assets/        # 静态资源
├── components/    # 公共组件
├── router/        # 路由配置
├── stores/        # 状态管理
├── services/      # 数据服务
├── views/         # 页面组件
│   ├── auth/      # 认证相关
│   ├── grade/     # 成绩管理
│   ├── management/# 信息管理
│   └── user/      # 用户相关
└── App.vue        # 根组件
```

## 在线预览

访问 [https://yuu225.github.io/Score/](https://yuu225.github.io/Score/) 查看在线演示。

## 主要功能

### 成绩管理
- 成绩录入
- 成绩查询
- 成绩统计
- 成绩分析

### 信息管理
- 学生信息管理
- 课程信息管理
- 用户信息管理

### 系统功能
- 用户登录/注销
- 权限控制
- 数据持久化

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m '添加一些特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

- 邮箱：2470637775@qq.com
- GitHub：[yuu225](https://github.com/yuu225)
