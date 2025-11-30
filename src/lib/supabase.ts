/**
 * Supabase API 封装
 * 适配 Supabase Edge Functions 的数据交互
 */

// 从环境变量或配置文件中获取 Supabase 项目信息
export const SUPABASE_PROJECT_ID = "daqqydhbydcgwxsyxyis";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcXF5ZGhieWRjZ3d4c3l4eWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjQ3MzUsImV4cCI6MjA4MDA0MDczNX0.2fP-fsLkQ0GIMEhRMMlMzCAAqGYr_ZpuGSUIi0XMmY4";

// 本地模式 - 用于开发调试，绕过 Supabase API 认证
const USE_LOCAL_MODE = true;

// Edge Functions 基础 URL
const EDGE_FUNCTION_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v2/make-server-10b7e963`;

// 本地存储 API 导入
import { 
  getTools as localGetTools,
  addTool as localAddTool,
  updateTool as localUpdateTool,
  deleteTool as localDeleteTool,
  renameGroup as localRenameGroup,
  deleteGroup as localDeleteGroup
} from './local-store';

// REST API 客户端导入
import {
  getTools as restGetTools,
  addTool as restAddTool,
  updateTool as restUpdateTool,
  deleteTool as restDeleteTool,
  renameGroup as restRenameGroup,
  deleteGroup as restDeleteGroup
} from './supabase-client';

// API 模式选择: 'local', 'rest', 'edge'
const API_MODE = 'local'; // 改为 'rest' 使用 Supabase REST API，改为 'edge' 使用 Edge Functions

// 通用请求封装
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // 根据模式选择不同的 API 实现方式
  
  // 本地存储模式
  if (API_MODE === 'local' || USE_LOCAL_MODE) {
    try {
      console.log('使用本地模式处理请求:', endpoint, options.method || 'GET');
      
      // 解析请求体
      let requestBody = null;
      if (options.body) {
        try {
          requestBody = JSON.parse(options.body as string);
        } catch (e) {
          console.error('解析请求体失败:', e);
        }
      }

      // 根据端点和方法路由到不同的本地函数
      if (endpoint === '/tools') {
        if (options.method === 'GET' || !options.method) {
          return { success: true, data: await localGetTools() };
        } else if (options.method === 'POST') {
          const newTool = await localAddTool(requestBody);
          return { success: true, data: newTool };
        }
      } else if (endpoint.startsWith('/tools/') && (options.method === 'PUT' || options.method === 'DELETE')) {
        const id = endpoint.replace('/tools/', '');
        if (options.method === 'PUT') {
          const updatedTool = await localUpdateTool(id, requestBody);
          return { success: true, data: updatedTool };
        } else if (options.method === 'DELETE') {
          await localDeleteTool(id);
          return { success: true };
        }
      } else if (endpoint === '/groups/rename' && options.method === 'POST') {
        const { oldName, newName } = requestBody;
        const count = await localRenameGroup(oldName, newName);
        return { success: true, count };
      } else if (endpoint === '/groups/delete' && options.method === 'POST') {
        const { groupName } = requestBody;
        const count = await localDeleteGroup(groupName);
        return { success: true, count };
      }
      
      throw new Error(`未处理的请求: ${endpoint} ${options.method}`);
    } catch (error) {
      console.error('本地模式请求失败:', endpoint, error);
      throw error;
    }
  }
  
  // Supabase REST API 模式
  if (API_MODE === 'rest') {
    try {
      console.log('使用 Supabase REST API 处理请求:', endpoint, options.method || 'GET');
      
      // 解析请求体
      let requestBody = null;
      if (options.body) {
        try {
          requestBody = JSON.parse(options.body as string);
        } catch (e) {
          console.error('解析请求体失败:', e);
        }
      }

      // 根据端点和方法路由到不同的 REST API 函数
      if (endpoint === '/tools') {
        if (options.method === 'GET' || !options.method) {
          const tools = await restGetTools();
          return { success: true, data: tools };
        } else if (options.method === 'POST') {
          const newTool = await restAddTool(requestBody);
          return { success: true, data: newTool };
        }
      } else if (endpoint.startsWith('/tools/') && (options.method === 'PUT' || options.method === 'DELETE')) {
        const id = endpoint.replace('/tools/', '');
        if (options.method === 'PUT') {
          const updatedTool = await restUpdateTool(id, requestBody);
          return { success: true, data: updatedTool };
        } else if (options.method === 'DELETE') {
          await restDeleteTool(id);
          return { success: true };
        }
      } else if (endpoint === '/groups/rename' && options.method === 'POST') {
        const { oldName, newName } = requestBody;
        const count = await restRenameGroup(oldName, newName);
        return { success: true, count };
      } else if (endpoint === '/groups/delete' && options.method === 'POST') {
        const { groupName } = requestBody;
        const count = await restDeleteGroup(groupName);
        return { success: true, count };
      }
      
      throw new Error(`未处理的请求: ${endpoint} ${options.method}`);
    } catch (error) {
      console.error('REST API 请求失败:', endpoint, error);
      throw error;
    }
  }

  // Edge Functions 模式 (原始代码)
  const url = `${EDGE_FUNCTION_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    console.log('使用 Edge Functions 处理请求:', endpoint, options.method || 'GET');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // 尝试从响应中获取错误信息
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // 如果解析错误数据失败，使用默认错误消息
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Edge Functions API 请求失败:', endpoint, error);
    throw error;
  }
}

// 辅助函数：GET 请求
export const get = <T = any>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' });

// 辅助函数：POST 请求
export const post = <T = any>(endpoint: string, data?: any) => 
  apiRequest<T>(endpoint, { 
    method: 'POST', 
    body: data ? JSON.stringify(data) : undefined 
  });

// 辅助函数：PUT 请求
export const put = <T = any>(endpoint: string, data?: any) => 
  apiRequest<T>(endpoint, { 
    method: 'PUT', 
    body: data ? JSON.stringify(data) : undefined 
  });

// 辅助函数：DELETE 请求
export const del = <T = any>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' });