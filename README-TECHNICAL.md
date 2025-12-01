# 液压压裂工具展示平台 - 技术概述

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/xaiohuangningde/Frackingtoolshowcaseplatform1.0.git
cd Frackingtoolshowcaseplatformcommunity-main

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📋 核心功能

- **3D模型展示** - 基于Google Model Viewer的高性能3D渲染
- **工具管理** - 添加、编辑、删除液压压裂工具
- **分组管理** - 动态创建和管理工具分组
- **双模式存储** - 支持本地存储和云端同步
- **响应式设计** - 适配各种设备和屏幕尺寸

## 🛠 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS + 自定义组件
- **3D渲染**: Google Model Viewer (WebGL)
- **后端**: Supabase (PostgreSQL + REST API)
- **部署**: Vercel (推荐)

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── ModelDetail.tsx  # 模型详情页
│   ├── ToolCard.tsx    # 工具卡片
│   ├── Sidebar.tsx     # 侧边栏
│   └── UploadDialog.tsx # 上传对话框
├── hooks/              # 自定义Hooks
│   ├── use-tools.ts    # 工具数据管理
│   └── use-model-viewer.ts # 模型查看器
├── lib/                # 工具库
│   ├── supabase.ts     # Supabase API封装
│   ├── supabase-client.ts # REST客户端
│   └── local-store.ts  # 本地存储
├── types/              # TypeScript类型
└── App.tsx             # 主应用组件
```

## 🔧 配置

### 本地开发模式
应用默认使用本地存储模式，无需配置即可使用所有功能。

### 云端模式
1. 在Supabase创建项目
2. 设置数据库表（使用 `supabase/schema.sql`）
3. 更新 `src/lib/supabase.ts` 中的项目ID和密钥
4. 将 `API_MODE` 改为 'rest' 或 'edge'

## 🚀 部署

### Vercel部署（推荐）
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署到Vercel
vercel

# 设置环境变量
vercel env add
```

### 自托管部署
```bash
# 构建项目
npm run build

# 使用Docker部署
docker build -t fracking-tool-platform .
docker run -p 80:80 fracking-tool-platform
```

## 📊 API设计

### REST端点
```
GET    /tools              # 获取所有工具
POST   /tools              # 添加新工具
PUT    /tools/:id          # 更新指定工具
DELETE /tools/:id          # 删除指定工具
POST   /groups/rename      # 重命名分组
POST   /groups/delete      # 删除分组
```

### 数据结构
```typescript
interface FrackingTool {
  id: string;              // 唯一标识
  name: string;            // 工具名称
  group: string;           // 所属分组
  description: string;     // 工具描述
  posterUrl: string;       // 封面图URL
  modelUrl: string;        // 3D模型URL
  createdAt: number;       // 创建时间戳
}
```

## ⚡ 性能优化

- 代码分割和懒加载
- 组件memo化防止不必要重渲染
- 模型资源预加载和缓存
- 虚拟滚动处理大量数据
- 响应式图片和模型优化

## 🔧 开发指南

### 组件开发规范
```typescript
// 使用TypeScript和函数组件
export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<Type>(initialValue);
  
  return (
    <div className="component-name">
      {/* JSX内容 */}
    </div>
  );
};
```

### 状态管理
使用自定义Hooks管理复杂状态：
```typescript
export const useTools = () => {
  const [tools, setTools] = useState<FrackingTool[]>([]);
  
  // CRUD操作
  const addTool = async (tool: ToolInput) => { /* 实现 */ };
  const updateTool = async (id: string, updates: any) => { /* 实现 */ };
  const deleteTool = async (id: string) => { /* 实现 */ };
  
  return { tools, addTool, updateTool, deleteTool };
};
```

## 🐛 常见问题

### 3D模型无法显示
- 检查模型格式是否为GLB/GLTF
- 验证模型URL是否可访问
- 确认模型文件大小是否合理

### 数据同步问题
- 检查API模式配置
- 验证Supabase连接参数
- 清除本地缓存重新同步

### 性能问题
- 使用Chrome DevTools性能分析
- 检查组件重渲染次数
- 优化大型3D模型

## 📈 扩展功能

- [ ] 批量工具操作
- [ ] 高级搜索和过滤
- [ ] 模型标注和测量
- [ ] 多语言支持
- [ ] 用户权限管理

## 📞 技术支持

- 项目地址: https://github.com/xaiohuangningde/Frackingtoolshowcaseplatform1.0
- 问题反馈: 通过GitHub Issues提交
- 技术文档: [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)

---

*更新时间: 2025-11-30*