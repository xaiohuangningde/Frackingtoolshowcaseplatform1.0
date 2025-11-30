# Supabase 配置指南

## 1. 创建数据表

登录 [Supabase Dashboard](https://app.supabase.com)，选择您的项目。

在左侧导航栏中，进入 **SQL Editor**，点击 **New query**，然后执行以下 SQL 代码创建必要的数据表：

```sql
-- 创建压裂工具数据表
CREATE TABLE IF NOT EXISTS fracking_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  group TEXT NOT NULL,
  description TEXT DEFAULT '',
  poster_url TEXT NOT NULL,
  model_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_fracking_tools_group ON fracking_tools(group);
CREATE INDEX IF NOT EXISTS idx_fracking_tools_created_at ON fracking_tools(created_at DESC);

-- 启用行级安全性 (RLS)
ALTER TABLE fracking_tools ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读取数据（只读）
CREATE POLICY "Anyone can view fracking tools" ON fracking_tools
  FOR SELECT USING (true);

-- 允许所有用户插入数据（创建新工具）
CREATE POLICY "Anyone can insert fracking tools" ON fracking_tools
  FOR INSERT WITH CHECK (true);

-- 允许所有用户更新数据（更新工具）
CREATE POLICY "Anyone can update fracking tools" ON fracking_tools
  FOR UPDATE USING (true);

-- 允许所有用户删除数据（删除工具）
CREATE POLICY "Anyone can delete fracking tools" ON fracking_tools
  FOR DELETE USING (true);
```

## 2. 配置项目

1. 在项目的 `src/lib/supabase.ts` 文件中，确保 Supabase 配置正确：

```typescript
export const SUPABASE_PROJECT_ID = "daqqydhbydcgwxsyxyis";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcXF5ZGhieWRjZ3d4c3l4eWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjQ3MzUsImV4cCI6MjA4MDA0MDczNX0.2fP-fsLkQ0GIMEhRMMlMzCAAqGYr_ZpuGSUIi0XMmY4";

// API 模式选择: 'local', 'rest', 'edge'
const API_MODE = 'rest'; // 使用 Supabase REST API
const USE_LOCAL_MODE = false; // 禁用本地模式
```

2. 保存文件后，重新启动项目：

```bash
npm run dev
```

## 3. 测试连接

在浏览器中打开 http://localhost:3000，打开浏览器开发者工具的控制台，应该能看到连接成功的日志信息。

## 4. API 模式说明

项目支持三种 API 模式：

- **本地模式 (local)**：数据存储在浏览器的 localStorage 中，无需服务器连接
- **REST API 模式 (rest)**：使用 Supabase REST API，数据存储在云端
- **Edge Functions 模式 (edge)**：使用 Supabase Edge Functions，需要部署自定义函数

## 5. 故障排查

如果遇到连接问题：

1. 检查项目 ID 和 API 密钥是否正确
2. 确认 Supabase 项目是否已启用
3. 检查网络连接是否正常
4. 查看浏览器控制台的错误信息
5. 确认 SQL 表是否已正确创建

## 6. 开发与生产环境

在开发环境中，可以使用本地模式 (`API_MODE = 'local'`) 来避免网络依赖。

在生产环境中，应使用 REST API 模式 (`API_MODE = 'rest'`) 或 Edge Functions 模式 (`API_MODE = 'edge'`)。