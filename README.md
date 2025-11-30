🚀 压裂工具平台部署指南 (Vercel)

本指南帮助你将项目部署到 Vercel，并正确连接 Supabase 数据库。

1. 准备 Supabase 数据库

在项目上线前，你需要确保 Supabase 数据库已经创建了必要的表。

登录 Supabase Dashboard.

进入你的项目 -> SQL Editor.

点击 New query.

复制并运行以下 SQL（来自 supabase/schema.sql）：

-- 创建压裂工具数据表
CREATE TABLE IF NOT EXISTS fracking_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  group_name TEXT NOT NULL, -- 注意：'group' 是 SQL 关键字，建议改名，或者在代码中小心处理
  description TEXT DEFAULT '',
  poster_url TEXT NOT NULL,
  model_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 注意：你的代码中字段名为 'group'，如果数据库报错，请确保 SQL 中使用了双引号 "group"
-- 下面是修正后的代码适配 SQL：

CREATE TABLE IF NOT EXISTS fracking_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "group" TEXT NOT NULL, 
  description TEXT DEFAULT '',
  poster_url TEXT NOT NULL,
  model_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fracking_tools_group ON fracking_tools("group");
CREATE INDEX IF NOT EXISTS idx_fracking_tools_created_at ON fracking_tools(created_at DESC);

ALTER TABLE fracking_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fracking tools" ON fracking_tools FOR SELECT USING (true);
CREATE POLICY "Anyone can insert fracking tools" ON fracking_tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update fracking tools" ON fracking_tools FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete fracking tools" ON fracking_tools FOR DELETE USING (true);


2. 部署到 Vercel

将代码推送到 GitHub。

登录 Vercel，点击 Add New... -> Project。

导入你的 GitHub 仓库。

重要：在 "Environment Variables" (环境变量) 部分添加以下变量（覆盖代码中的默认值）：

变量名

值 (从 Supabase 设置获取)

VITE_SUPABASE_PROJECT_ID

你的项目ID (例如: daqqydhbydcgwxsyxyis)

VITE_SUPABASE_ANON_KEY

你的 anon public key

VITE_API_MODE

rest

注意: 必须设置 VITE_API_MODE 为 rest，否则项目可能仍会尝试使用本地存储。

点击 Deploy。

3. 验证部署

部署完成后：

打开 Vercel 提供的域名。

打开浏览器控制台 (F12)。

查看 Network 面板，刷新页面。

你应该能看到对 https://<project-id>.supabase.co/rest/v1/fracking_tools 的请求。

如果请求成功 (200 OK)，说明连接正常。

4. 常见问题排查

构建失败: 检查 Build Logs。如果提示 @vercel/node 相关错误，请确认你已经使用了我提供的修正版 vercel.json。

数据不保存: 检查浏览器控制台，确认 VITE_API_MODE 是否生效。如果没有生效，可能是代码中写死了 'local'，请使用修正版 src/lib/supabase.ts。

CORS 错误: Supabase 默认允许所有来源，但如果遇到问题，请在 Supabase Dashboard -> Settings -> API -> Allowed Origins 中添加你的 Vercel 域名。
