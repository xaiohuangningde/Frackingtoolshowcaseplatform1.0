/**
 * Supabase REST API 客户端
 * 修复版：移除 created_at 发送，让数据库自动生成
 */

// 优先从环境变量获取，如果没有则使用默认值
const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || "daqqydhbydcgwxsyxyis";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcXF5ZGhieWRjZ3d4c3l4eWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjQ3MzUsImV4cCI6MjA4MDA0MDczNX0.2fP-fsLkQ0GIMEhRMMlMzCAAqGYr_ZpuGSUIi0XMmY4";

const REST_API_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/rest/v1`;
const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation' // 告诉 Supabase 返回创建/更新后的数据
};

const TOOL_TABLE = 'fracking_tools';

// 辅助函数：将数据库时间字符串转换为时间戳数字
const toTimestamp = (dateStr: string | null): number => {
  if (!dateStr) return Date.now();
  return new Date(dateStr).getTime();
};

// 获取所有工具
export async function getTools() {
  try {
    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?order=created_at.desc`, {
      method: 'GET',
      headers: HEADERS
    });

    if (!response.ok) {
      if (response.status === 406 || response.status === 404) return [];
      const errorText = await response.text();
      console.error(`Get Tools Error (${response.status}):`, errorText);
      throw new Error(`获取工具失败: ${response.status}`);
    }

    const tools = await response.json();
    return tools.map((tool: any) => ({
      id: tool.id,
      name: tool.name,
      // 兼容旧数据 group 和新数据 group_name
      group: tool.group_name || tool.group || '未分组',
      description: tool.description || '',
      posterUrl: tool.poster_url,
      modelUrl: tool.model_url,
      createdAt: toTimestamp(tool.created_at)
    }));
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

// 添加工具
export async function addTool(toolData: any) {
  try {
    // 构造 Payload
    // 关键修复：不发送 created_at，让数据库默认值处理
    const payload = {
      name: toolData.name,
      group_name: toolData.group, 
      description: toolData.description,
      poster_url: toolData.posterUrl,
      model_url: toolData.modelUrl
    };

    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase Insert Error:', errorText);
      // 尝试解析详细错误信息
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(`添加失败: ${errorJson.message || errorJson.error || response.status}`);
      } catch (e) {
        throw new Error(`添加失败 (${response.status}): ${errorText}`);
      }
    }

    const result = await response.json();
    
    // 确保返回了数据
    if (!result || result.length === 0) {
      throw new Error('服务器未返回数据，但操作可能已成功');
    }

    const newTool = result[0];
    
    return {
      id: newTool.id,
      name: newTool.name,
      group: newTool.group_name, // 注意这里接收的是 group_name
      description: newTool.description,
      posterUrl: newTool.poster_url,
      modelUrl: newTool.model_url,
      createdAt: toTimestamp(newTool.created_at)
    };
  } catch (error) {
    console.error('添加工具异常:', error);
    throw error;
  }
}

// 更新工具
export async function updateTool(id: string, updates: any) {
  try {
    const payload: any = {};
    
    if (updates.name !== undefined) payload['name'] = updates.name;
    if (updates.group !== undefined) payload['group_name'] = updates.group;
    if (updates.description !== undefined) payload['description'] = updates.description;
    if (updates.posterUrl !== undefined) payload['poster_url'] = updates.posterUrl;
    if (updates.modelUrl !== undefined) payload['model_url'] = updates.modelUrl;

    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?id=eq.${id}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Update Error:', errorText);
        throw new Error(`更新失败: ${response.status}`);
    }

    const result = await response.json();
    const updatedTool = result[0];
    
    return {
      id: updatedTool.id,
      name: updatedTool.name,
      group: updatedTool.group_name,
      description: updatedTool.description,
      posterUrl: updatedTool.poster_url,
      modelUrl: updatedTool.model_url,
      createdAt: toTimestamp(updatedTool.created_at)
    };
  } catch (error) {
    console.error('更新工具异常:', error);
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

    if (!response.ok) throw new Error(`删除失败: ${response.status}`);
    return true;
  } catch (error) {
    console.error('删除工具异常:', error);
    throw error;
  }
}

// 重命名分组
export async function renameGroup(oldName: string, newName: string) {
  try {
    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?group_name=eq.${oldName}`, {
      method: 'PATCH',
      headers: { ...HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ group_name: newName })
    });

    if (!response.ok) throw new Error(`重命名失败: ${response.status}`);
    return true;
  } catch (error) {
    console.error('重命名分组异常:', error);
    throw error;
  }
}

// 删除分组
export async function deleteGroup(groupName: string) {
  try {
    const response = await fetch(`${REST_API_URL}/${TOOL_TABLE}?group_name=eq.${groupName}`, {
      method: 'PATCH',
      headers: { ...HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ group_name: '未分组' })
    });

    if (!response.ok) throw new Error(`删除分组失败: ${response.status}`);
    return true;
  } catch (error) {
    console.error('删除分组异常:', error);
    throw error;
  }
}
