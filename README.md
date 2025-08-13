# Slash Admin

一个基于 React + TypeScript + Vite 的现代化管理后台模板。

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 4
- **UI 组件库**: Ant Design 5
- **样式方案**: Tailwind CSS + CSS-in-JS
- **状态管理**: Zustand
- **路由管理**: React Router 6
- **HTTP 客户端**: Axios
- **国际化**: i18next
- **图表库**: ApexCharts
- **动画库**: Framer Motion
- **代码规范**: ESLint + Prettier

## 📦 快速开始

### 环境要求

- Node.js >= 16
- pnpm (推荐) 或 npm

### 安装依赖

```bash
# 使用 pnpm
pnpm install

```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

```

开发服务器将在 `http://localhost:3001` 启动

### 构建生产版本

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 🛠️ 项目结构

```
src/
├── api/              # API 接口
├── assets/           # 静态资源
├── components/       # 公共组件
├── hooks/           # 自定义 Hooks
├── layouts/         # 布局组件
├── locales/         # 国际化配置
├── pages/           # 页面组件
├── router/          # 路由配置
├── store/           # 状态管理
├── theme/           # 主题配置
└── utils/           # 工具函数
```

## 🎨 特性

- ✨ 现代化技术栈，开发体验优秀
- 🎯 TypeScript 支持，类型安全
- 📱 响应式设计，支持多端适配
- 🌙 深色模式支持
- 🌍 国际化支持 (中文/英文)
- 📊 丰富的图表组件
- 🎭 流畅的动画效果
- 🔐 权限管理系统
- 📝 富文本编辑器
- 📤 文件上传功能
- 📅 日历组件
- 🎯 代码分割和懒加载

## 🔧 开发工具

- **代码检查**: `pnpm lint`
- **代码格式化**: `pnpm lint:fix`
- **类型检查**: TypeScript 严格模式

## 📄 许可证

MIT License

---

**后端服务**: [express-admin](https://github.com/peijunlei/express-admin)
