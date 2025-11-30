# 压裂工具展示平台 - 重构版本

## 项目重构说明

本项目已完成重构，解决了文件结构冗余问题，修复了导入路径，并添加了 Vercel 部署配置。

### 主要改进

1. **文件结构优化**
   - 移除了冗余的 `src/src` 嵌套结构
   - 统一了所有组件和工具的导入路径
   - 清理了重复的文件和目录

2. **代码结构规范化**
   - 创建了标准的 `src/hooks`、`src/types`、`src/lib` 目录
   - 统一了组件导入路径
   - 规范化了配置文件位置

3. **部署支持**
   - 添加了 `vercel.json` 配置文件
   - 创建了 API 代理处理 Vercel 部署
   - 添加了环境变量示例文件

## 本地开发

1. 安装依赖:
   ```bash
   npm install
   ```

2. 启动开发服务器:
   ```bash
   npm run dev
   ```

3. 应用将运行在 http://localhost:3000

## Vercel 部署

### 准备工作

1. 将代码推送到 GitHub 仓库

2. 在 Vercel 中导入项目

3. 配置环境变量：
   ```
   SUPABASE_PROJECT_ID=fhrrmwmcyjjhaoexjnnx
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocnJtd21jeWpqaGFvZXhqbm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzYyNTIsImV4cCI6MjA4MDAxMjI1Mn0.QmSok-jjQtiqDazyXmrtrdg_pFTopTbFx8CXNmMzu3k
   ```

### 部署流程

1. 在 Vercel 项目设置中，确保构建设置正确:
   - Build Command: `npm run build`
   - Output Directory: `build`

2. 部署完成后，检查应用是否正常运行

3. 测试 3D 模型展示和 CRUD 功能

## 离线部署

在内网环境中，需要下载 Model Viewer 脚本到本地：

1. 创建 `public/libs` 目录:
   ```bash
   mkdir -p public/libs
   ```

2. 下载 Model Viewer 脚本:
   ```bash
   wget https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js -O public/libs/model-viewer.min.js
   ```

3. 修改 `src/config.ts`:
   ```typescript
   MODEL_VIEWER: {
     USE_CDN: false,  // 改为 false
     CDN_SCRIPT: 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js',
     LOCAL_SCRIPT: '/libs/model-viewer.min.js',
   }
   ```

## 项目结构

重构后的项目结构如下：

```
src/
├── components/           # UI 组件
│   ├── Sidebar.tsx      # 侧边栏分组导航
│   ├── ToolCard.tsx     # 工具卡片
│   ├── ModelDetail.tsx  # 3D 模型详情
│   ├── UploadDialog.tsx # 添加工具弹窗
│   └── DeploymentGuide.tsx # 部署说明
├── hooks/               # 自定义 Hooks
│   ├── use-model-viewer.ts  # 3D 引擎加载
│   └── use-tools.ts         # 数据管理
├── lib/                 # 工具库
│   └── supabase.ts      # API 请求封装
├── types/               # TypeScript 类型定义
│   └── index.ts
├── config.ts            # 平台配置
├── App.tsx              # 主应用组件
└── main.tsx             # 应用入口

api/                     # Vercel API 路由
└── index.js             # API 代理

vercel.json              # Vercel 部署配置
.env.example             # 环境变量示例
```

## 技术栈

- **前端**: React 18 + TypeScript + Tailwind CSS
- **后端**: Supabase Edge Functions
- **3D 渲染**: Google Model-Viewer
- **构建工具**: Vite
- **部署**: Vercel

## 故障排查

1. **模型加载失败**
   - 检查模型 URL 是否可访问
   - 确认文件格式为 `.glb` 或 `.gltf`
   - 查看是否存在 CORS 跨域问题

2. **API 请求失败**
   - 检查 Supabase 环境变量配置
   - 确认 Supabase Edge Functions 是否正常工作
   - 查看浏览器控制台网络请求

3. **构建失败**
   - 检查依赖是否正确安装
   - 确认文件路径导入是否正确
   - 查看 TypeScript 类型错误