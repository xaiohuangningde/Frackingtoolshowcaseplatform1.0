/**
 * 平台配置文件
 * 用于控制 CDN/本地资源切换，适配内网环境
 */

export const CONFIG = {
  // 3D 渲染引擎配置
  MODEL_VIEWER: {
    // 设置为 true 使用公网 CDN，false 使用本地文件
    USE_CDN: true,
    CDN_SCRIPT: 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js',
    LOCAL_SCRIPT: '/libs/model-viewer.min.js',
  },

  // 应用设置
  APP: {
    NAME: '压裂工具数字化展示平台',
    VERSION: '1.0.0',
    DEFAULT_POSTER: 'https://images.unsplash.com/photo-1581092583537-20d51876f3e9?w=800&h=800&fit=crop',
  }
} as const;

// 获取当前 model-viewer 脚本 URL
export const getModelViewerScript = () => {
  return CONFIG.MODEL_VIEWER.USE_CDN 
    ? CONFIG.MODEL_VIEWER.CDN_SCRIPT 
    : CONFIG.MODEL_VIEWER.LOCAL_SCRIPT;
};

// 环境标识
export const isOnlineMode = () => CONFIG.MODEL_VIEWER.USE_CDN;