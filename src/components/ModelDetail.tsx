import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, Loader2, Maximize2, Info, AlertTriangle } from 'lucide-react';
import type { FrackingTool } from '../types';
import { isOnlineMode } from '../config';

interface ModelDetailProps {
  tool: FrackingTool;
  onClose: () => void;
}

export function ModelDetail({ tool, onClose }: ModelDetailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const modelViewerRef = useRef<any>(null);

  // 监听 ESC 键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // 监听模型加载事件
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const onLoad = () => {
      setIsLoading(false);
      setModelError(null);
    };

    const onError = (event: any) => {
      setIsLoading(false);
      const detail = event?.detail;
      
      // 错误类型判断
      if (detail?.type === 'loadfailure') {
        setModelError('模型加载失败：文件不存在或格式错误');
      } else if (detail?.message?.includes('CORS')) {
        setModelError('跨域错误：模型资源不允许跨域访问，请联系管理员');
      } else if (detail?.message?.includes('network')) {
        setModelError('网络错误：无法连接到模型服务器');
      } else {
        setModelError('未知错误：模型无法正常加载');
      }
    };

    modelViewer.addEventListener('load', onLoad);
    modelViewer.addEventListener('error', onError);

    // 检查是否已加载
    if (modelViewer.loaded) {
      setIsLoading(false);
    }

    return () => {
      modelViewer.removeEventListener('load', onLoad);
      modelViewer.removeEventListener('error', onError);
    };
  }, []);

  // 重置视角
  const handleResetCamera = () => {
    if (modelViewerRef.current) {
      try {
        modelViewerRef.current.resetTurntableRotation?.();
        modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
      } catch (err) {
        console.warn('重置视角失败', err);
      }
    }
  };

  // 全屏
  const handleFullscreen = () => {
    if (modelViewerRef.current?.requestFullscreen) {
      modelViewerRef.current.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* 顶部工具栏 */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            title="关闭 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-white">
            <h2 className="text-lg">{tool.name}</h2>
            <p className="text-sm text-white/60">{tool.group}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showInfo 
                ? 'bg-white text-gray-900' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="切换信息面板"
          >
            <Info className="w-4 h-4" />
            <span className="text-sm">信息</span>
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            title="重置视角"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            title="全屏"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex relative">
        {/* 3D 查看器 */}
        <div className="flex-1 relative">
          {modelError ? (
            // 模型加载错误
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-md mx-auto px-6 py-8 bg-red-500/10 backdrop-blur-md rounded-xl border border-red-500/20 text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-white mb-2">模型加载失败</h3>
                <p className="text-sm text-white/70 mb-4">{modelError}</p>
                <div className="text-xs text-white/50 mb-4">
                  <div>模型 URL: {tool.modelUrl}</div>
                  <div className="mt-2">当前模式: {isOnlineMode() ? '在线' : '离线'}</div>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  返回列表
                </button>
              </div>
            </div>
          ) : (
            <>
              <model-viewer
                ref={modelViewerRef}
                src={tool.modelUrl}
                poster={tool.posterUrl}
                camera-controls
                auto-rotate
                auto-rotate-delay="3000"
                rotation-per-second="30deg"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent'
                }}
              />

              {/* Loading 状态 */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-white">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <span>加载 3D 模型中...</span>
                    <span className="text-xs text-white/60">{tool.modelUrl}</span>
                  </div>
                </div>
              )}

              {/* 操作提示 */}
              {!isLoading && (
                <div className="absolute bottom-6 left-6 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <div className="flex items-center gap-4 text-white text-sm">
                    <span>🖱️ 拖拽旋转</span>
                    <span>🔍 滚轮缩放</span>
                    <span>🔄 自动旋转</span>
                  </div>
                </div>
              )}

              {/* 渲染引擎状态 */}
              <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-xs text-white/80">
                {isOnlineMode() ? '在线模式 (CDN)' : '离线模式 (本地)'}
              </div>
            </>
          )}
        </div>

        {/* 信息侧边栏 */}
        {showInfo && (
          <aside className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/10 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-white mb-3">基本信息</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-white/60 mb-1">工具名称</div>
                    <div className="text-sm text-white">{tool.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">所属分组</div>
                    <div className="text-sm text-white">
                      <span className="px-2 py-1 bg-white/10 rounded">
                        {tool.group}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">创建时间</div>
                    <div className="text-sm text-white">
                      {new Date(tool.createdAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 技术参数 */}
              <div>
                <h3 className="text-white mb-3">技术参数</h3>
                <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                  {tool.description}
                </div>
              </div>

              {/* 资源信息 */}
              <div>
                <h3 className="text-white mb-3">资源链接</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-white/60 mb-1">封面图</div>
                    <div className="text-white/40 break-all font-mono bg-black/20 p-2 rounded">
                      {tool.posterUrl}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">3D 模型</div>
                    <div className="text-white/40 break-all font-mono bg-black/20 p-2 rounded">
                      {tool.modelUrl}
                    </div>
                  </div>
                </div>
              </div>

              {/* 预览图 */}
              <div>
                <h3 className="text-white mb-3">封面预览</h3>
                <img 
                  src={tool.posterUrl} 
                  alt={tool.name}
                  className="w-full rounded-lg border border-white/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E加载失败%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}