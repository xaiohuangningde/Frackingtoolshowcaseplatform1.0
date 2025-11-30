/**
 * 本地存储 API
 * 临时解决方案，用于绕过 Supabase 认证问题
 */

const STORAGE_KEY = 'fracking-tools-data';

// 获取所有工具
export const getTools = async () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取工具数据失败:', error);
    return [];
  }
};

// 添加工具
export const addTool = async (tool: any) => {
  try {
    const tools = await getTools();
    const newTool = {
      ...tool,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    tools.push(newTool);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    return newTool;
  } catch (error) {
    console.error('添加工具失败:', error);
    throw error;
  }
};

// 更新工具
export const updateTool = async (id: string, updates: any) => {
  try {
    const tools = await getTools();
    const index = tools.findIndex(tool => tool.id === id);
    if (index === -1) {
      throw new Error('工具不存在');
    }
    tools[index] = { ...tools[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    return tools[index];
  } catch (error) {
    console.error('更新工具失败:', error);
    throw error;
  }
};

// 删除工具
export const deleteTool = async (id: string) => {
  try {
    const tools = await getTools();
    const filteredTools = tools.filter(tool => tool.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTools));
    return true;
  } catch (error) {
    console.error('删除工具失败:', error);
    throw error;
  }
};

// 重命名分组
export const renameGroup = async (oldName: string, newName: string) => {
  try {
    const tools = await getTools();
    const updatedTools = tools.map(tool => 
      tool.group === oldName ? { ...tool, group: newName } : tool
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTools));
    return updatedTools.filter(tool => tool.group === newName).length;
  } catch (error) {
    console.error('重命名分组失败:', error);
    throw error;
  }
};

// 删除分组
export const deleteGroup = async (groupName: string) => {
  try {
    const tools = await getTools();
    const updatedTools = tools.map(tool => 
      tool.group === groupName ? { ...tool, group: '未分组' } : tool
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTools));
    return tools.filter(tool => tool.group === groupName).length;
  } catch (error) {
    console.error('删除分组失败:', error);
    throw error;
  }
};