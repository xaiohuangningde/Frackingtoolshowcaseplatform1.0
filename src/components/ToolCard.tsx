import React, { useState } from 'react';
import { Eye, AlertCircle, Trash2 } from 'lucide-react';
import type { FrackingTool } from '../types';
import { CONFIG } from '../config';

interface ToolCardProps {
  tool: FrackingTool;
  onSelect: () => void;
  onDelete?: (tool: FrackingTool) => void;
}

export function ToolCard({ tool, onSelect, onDelete }: ToolCardProps) {
  const [imageError, setImageError] = useState(false);

  // 处理删除操作
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发查看模型
    
    if (onDelete) {
      const confirm = window.confirm(`确定要删除工具"${tool.name}"吗？此操作不可撤销。`);
      if (confirm) {
        onDelete(tool);
      }
    }
  };

  return (
    <div 
      className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all cursor-pointer group relative"
      onClick={onSelect}
    >
      {/* 封面图区域 */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {imageError ? (
          // 图片加载失败占位符
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <AlertCircle className="w-12 h-12 mb-2" />
            <span className="text-sm">封面图加载失败</span>
          </div>
        ) : (
          <img
            src={tool.posterUrl || CONFIG.APP.DEFAULT_POSTER}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Hover 遮罩 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-3 text-white">
            <Eye className="w-12 h-12" />
            <span>查看 3D 模型</span>
          </div>
        </div>

        {/* 分组标签 */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-700 rounded-lg text-xs shadow-sm">
          {tool.group}
        </div>
        
        {/* 删除按钮 */}
        {onDelete && (
          <button 
            onClick={handleDelete}
            className="absolute top-3 right-3 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
            title="删除工具"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 信息区域 */}
      <div className="p-4">
        <h3 className="text-gray-900 mb-2">{tool.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
    </div>
  );
}