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