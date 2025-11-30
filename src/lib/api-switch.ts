/**
 * API 切换工具
 * 用于在本地存储和云端 Supabase 之间切换
 */

// 本地模式开关，设置为 false 使用 Supabase
export const LOCAL_STORAGE_MODE = true;

// 获取当前模式
export const isLocalStorageMode = () => LOCAL_STORAGE_MODE;

// 切换到云端模式
export const enableCloudMode = () => {
  console.log('切换到云端模式...');
  // 在实际部署中，可以通过环境变量来控制
  // 这里只是示例
};

// 切换到本地模式
export const enableLocalMode = () => {
  console.log('切换到本地模式...');
};

// 获取当前模式状态描述
export const getApiModeDescription = () => {
  return isLocalStorageMode() 
    ? '本地存储模式 (数据保存在浏览器中)' 
    : '云端 Supabase 模式 (数据保存在云端)';
};

// 清空本地存储数据
export const clearLocalStorageData = () => {
  localStorage.removeItem('fracking-tools-data');
  console.log('已清空本地存储数据');
};