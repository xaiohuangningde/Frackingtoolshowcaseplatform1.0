/**
 * Supabase 连接测试工具
 */

import { SUPABASE_PROJECT_ID, SUPABASE_ANON_KEY } from './supabase';

// 测试 Supabase 连接
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const url = `https://${SUPABASE_PROJECT_ID}.supabase.co/rest/v1/`;
  
  try {
    console.log('测试 Supabase 连接...');
    
    // 测试基本连接
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return { success: true, message: 'Supabase 连接成功' };
    } else {
      return { 
        success: false, 
        message: `Supabase 连接失败: ${response.status} ${response.statusText}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Supabase 连接错误: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// 测试 Edge Functions
export async function testEdgeFunctions(): Promise<{ success: boolean; message: string }> {
  const url = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v2/make-server-10b7e963/tools`;
  
  try {
    console.log('测试 Supabase Edge Functions...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, message: 'Edge Functions 连接成功', data };
    } else {
      return { 
        success: false, 
        message: `Edge Functions 连接失败: ${response.status} ${response.statusText}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Edge Functions 连接错误: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}