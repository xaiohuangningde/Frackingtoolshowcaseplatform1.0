/**
 * Supabase REST API 客户端
 * 直接使用 Supabase REST API 而不是 Edge Functions
 */

// Supabase 配置（内联以避免循环依赖）
const SUPABASE_PROJECT_ID = "daqqydhbydcgwxsyxyis";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcXF5ZGhieWRjZ3d4c3l4eWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjQ3MzUsImV4cCI6MjA4MDA0MDczNX0.2fP-fsLkQ0GIMEhRMMlMzCAAqGYr_ZpuGSUIi0XMmY4";

// Supabase REST API 基础 URL
const REST_API_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/rest/v1`;
const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// 创建简单的工具表数据结构（如果不存在）
const TOOL_TABLE = 'fracking_tools';

// 获取所有工具
export async function getTools() {
  try {
    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?order=created_at.desc`, {
      method: 'GET',
      headers: HEADERS
    });

    if (!response.ok) {
      // 如果表不存在，返回空数组
      if (response.status === 406 || response.status === 404) {
        console.log('工具表不存在，返回空数组');
        return [];
      }
      throw new Error(`获取工具失败: ${response.status} ${response.statusText}`);
    }

    const tools = await response.json();
    // 转换为应用所需格式
    return tools.map((tool: any) => ({
      id: tool.id,
      name: tool.name,
      group: tool.group,
      description: tool.description || '',
      posterUrl: tool.poster_url,
      modelUrl: tool.model_url,
      createdAt: tool.created_at || Date.now()
    }));
  } catch (error) {
    console.error('获取工具失败:', error);
    return [];
  }
}

// 添加工具
export async function addTool(toolData: any) {
  try {
    const payload = {
      name: toolData.name,
      group: toolData.group,
      description: toolData.description,
      poster_url: toolData.posterUrl,
      model_url: toolData.modelUrl,
      created_at: Date.now()
    };

    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`添加工具失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const newTool = result[0];
    
    // 转换为应用所需格式
    return {
      id: newTool.id,
      name: newTool.name,
      group: newTool.group,
      description: newTool.description || '',
      posterUrl: newTool.poster_url,
      modelUrl: newTool.model_url,
      createdAt: newTool.created_at || Date.now()
    };
  } catch (error) {
    console.error('添加工具失败:', error);
    throw error;
  }
}

// 更新工具
export async function updateTool(id: string, updates: any) {
  try {
    const payload = {};
    
    if (updates.name !== undefined) payload['name'] = updates.name;
    if (updates.group !== undefined) payload['group'] = updates.group;
    if (updates.description !== undefined) payload['description'] = updates.description;
    if (updates.posterUrl !== undefined) payload['poster_url'] = updates.posterUrl;
    if (updates.modelUrl !== undefined) payload['model_url'] = updates.modelUrl;

    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?id=eq.${id}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`更新工具失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const updatedTool = result[0];
    
    // 转换为应用所需格式
    return {
      id: updatedTool.id,
      name: updatedTool.name,
      group: updatedTool.group,
      description: updatedTool.description || '',
      posterUrl: updatedTool.poster_url,
      modelUrl: updatedTool.model_url,
      createdAt: updatedTool.created_at || Date.now()
    };
  } catch (error) {
    console.error('更新工具失败:', error);
    throw error;
  }
}

// 删除工具
export async function deleteTool(id: string) {
  try {
    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?id=eq.${id}`, {
      method: 'DELETE',
      headers: HEADERS
    });

    if (!response.ok) {
      throw new Error(`删除工具失败: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('删除工具失败:', error);
    throw error;
  }
}

// 重命名分组
export async function renameGroup(oldName: string, newName: string) {
  try {
    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?group=eq.${oldName}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify({ group: newName })
    });

    if (!response.ok) {
      throw new Error(`重命名分组失败: ${response.status} ${response.statusText}`);
    }

    // 返回更新的工具数量
    const updatedCount = response.headers.get('content-range')?.split('/')[1] || '0';
    return parseInt(updatedCount, 10);
  } catch (error) {
    console.error('重命名分组失败:', error);
    throw error;
  }
}

// 删除分组（将工具移至"未分组"）
export async function deleteGroup(groupName: string) {
  try {
    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?group=eq.${groupName}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify({ group: '未分组' })
    });

    if (!response.ok) {
      throw new Error(`删除分组失败: ${response.status} ${response.statusText}`);
    }

    // 返回更新的工具数量
    const updatedCount = response.headers.get('content-range')?.split('/')[1] || '0';
    return parseInt(updatedCount, 10);
  } catch (error) {
    console.error('删除分组失败:', error);
    throw error;
  }
}