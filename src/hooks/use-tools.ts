/**
 * 工具数据管理 Hook
 * 使用 Supabase 后端 API 进行数据持久化
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../lib/supabase';
import type { FrackingTool, ToolInput, UseToolsReturn } from '../types';

export function useTools(): UseToolsReturn {
  const [tools, setTools] = useState<FrackingTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载工具数据
  const loadTools = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{ success: boolean; data: FrackingTool[] }>('/tools');
      
      if (response.success) {
        // 按创建时间降序排列
        const sortedTools = response.data.sort((a, b) => b.createdAt - a.createdAt);
        setTools(sortedTools);
        setError(null);
      } else {
        throw new Error('获取数据失败');
      }
    } catch (err) {
      console.error('加载工具列表失败:', err);
      setError('数据加载失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadTools();
    
    // 设置轮询，每5秒刷新一次数据（实现伪实时同步）
    const interval = setInterval(() => {
      loadTools();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadTools]);

  // 添加工具
  const addTool = async (toolInput: ToolInput): Promise<void> => {
    try {
      const response = await apiRequest<{ success: boolean; data: FrackingTool }>('/tools', {
        method: 'POST',
        body: JSON.stringify(toolInput),
      });

      if (response.success) {
        // 立即刷新列表
        await loadTools();
      } else {
        throw new Error('添加失败');
      }
    } catch (err) {
      console.error('添加工具失败:', err);
      throw new Error('添加工具失败，请重试');
    }
  };

  // 更新工具
  const updateTool = async (id: string, updates: Partial<FrackingTool>): Promise<void> => {
    try {
      const response = await apiRequest<{ success: boolean }>(`/tools/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (response.success) {
        await loadTools();
      } else {
        throw new Error('更新失败');
      }
    } catch (err) {
      console.error('更新工具失败:', err);
      throw new Error('更新工具失败，请重试');
    }
  };

  // 删除工具
  const deleteTool = async (id: string): Promise<void> => {
    try {
      const response = await apiRequest<{ success: boolean }>(`/tools/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        await loadTools();
      } else {
        throw new Error('删除失败');
      }
    } catch (err) {
      console.error('删除工具失败:', err);
      throw new Error('删除工具失败，请重试');
    }
  };

  // 重命名分组（批量更新）
  const updateGroup = async (oldName: string, newName: string): Promise<void> => {
    if (!newName.trim() || newName === oldName) {
      return;
    }

    try {
      const response = await apiRequest<{ success: boolean }>('/groups/rename', {
        method: 'POST',
        body: JSON.stringify({ oldName, newName }),
      });

      if (response.success) {
        await loadTools();
      } else {
        throw new Error('重命名失败');
      }
    } catch (err) {
      console.error('重命名分组失败:', err);
      throw new Error('重命名分组失败，请重试');
    }
  };

  // 删除分组（将工具移至"未分组"）
  const deleteGroup = async (groupName: string): Promise<void> => {
    if (groupName === '全部') {
      throw new Error('无法删除"全部"分组');
    }

    try {
      const response = await apiRequest<{ success: boolean }>('/groups/delete', {
        method: 'POST',
        body: JSON.stringify({ groupName }),
      });

      if (response.success) {
        await loadTools();
      } else {
        throw new Error('删除失败');
      }
    } catch (err) {
      console.error('删除分组失败:', err);
      throw new Error('删除分组失败，请重试');
    }
  };

  return {
    tools,
    loading,
    error,
    addTool,
    updateTool,
    deleteTool,
    updateGroup,
    deleteGroup
  };
}