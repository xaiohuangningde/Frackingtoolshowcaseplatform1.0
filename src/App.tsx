import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ToolCard } from './components/ToolCard';
import { UploadDialog } from './components/UploadDialog';
import { ModelDetail } from './components/ModelDetail';
import { DeploymentGuide } from './components/DeploymentGuide';
import { Plus, Info, Loader2, AlertCircle } from 'lucide-react';
import { useTools } from './hooks/use-tools';
import { useModelViewer } from './hooks/use-model-viewer';
import type { FrackingTool } from './types';
import { CONFIG } from './config';

export default function App() {
  const { tools, loading, error, addTool, updateTool, deleteTool, updateGroup, deleteGroup } = useTools();
  const { loaded: modelViewerLoaded, error: modelViewerError } = useModelViewer();
  
  const [selectedGroup, setSelectedGroup] = useState<string>('全部');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<FrackingTool | null>(null);

  // 动态获取所有分组
  const groups = ['全部', ...Array.from(new Set(tools.map(tool => tool.group)))];

  // 筛选工具
  const filteredTools = selectedGroup === '全部' 
    ? tools 
    : tools.filter(tool => tool.group === selectedGroup);

  // 添加新工具
  const handleAddTool = async (toolInput: Omit<FrackingTool, 'id' | 'createdAt'>) => {
    try {
      await addTool(toolInput);
      setIsUploadDialogOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : '添加失败');
    }
  };

  // 重命名分组
  const handleRenameGroup = async (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) return;
    
    if (groups.includes(newName)) {
      alert('该分组名称已存在');
      return;
    }

    try {
      await updateGroup(oldName, newName);
      if (selectedGroup === oldName) {
        setSelectedGroup(newName);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '重命名失败');
    }
  };

  // 删除分组
  const handleDeleteGroup = async (groupName: string) => {
    if (groupName === '全部') return;

    const confirm = window.confirm(`确定要删除分组"${groupName}"吗？该分组下的所有工具将移至"未分组"。`);
    if (!confirm) return;

    try {
      await deleteGroup(groupName);
      if (selectedGroup === groupName) {
        setSelectedGroup('全部');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    }
  };

  // 删除工具
  const handleDeleteTool = async (tool: FrackingTool) => {
    try {
      await deleteTool(tool.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    }
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <Loader2 className="w-12 h-12 animate-spin" />
          <span>加载数据中...</span>
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-red-600">
          <AlertCircle className="w-12 h-12" />
          <span>{error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-40">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">{CONFIG.APP.NAME}</h1>
            <p className="text-gray-500 text-sm mt-1">
              高性能 3D 模型展示 · 实时数据同步 · 支持离线部署
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              部署说明
            </button>
            <button
              onClick={() => setIsUploadDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加工具
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          onRenameGroup={handleRenameGroup}
          onDeleteGroup={handleDeleteGroup}
        />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              共 {filteredTools.length} 个工具
              {selectedGroup !== '全部' && ` · 分组: ${selectedGroup}`}
            </div>
            
            {/* Model Viewer 状态指示 */}
            {modelViewerError ? (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded">
                <AlertCircle className="w-3.5 h-3.5" />
                3D 引擎加载失败
              </div>
            ) : !modelViewerLoaded ? (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                加载 3D 引擎...
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                {CONFIG.MODEL_VIEWER.USE_CDN ? '在线模式' : '离线模式'}
              </div>
            )}
          </div>

          {/* Tool Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                onSelect={() => setSelectedTool(tool)} 
                onDelete={handleDeleteTool}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">该分组暂无工具</div>
              <button
                onClick={() => setIsUploadDialogOpen(true)}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                添加第一个工具
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Upload Dialog */}
      {isUploadDialogOpen && (
        <UploadDialog
          onClose={() => setIsUploadDialogOpen(false)}
          onSubmit={handleAddTool}
          existingGroups={groups.filter(g => g !== '全部')}
        />
      )}

      {/* Deployment Guide */}
      {isDeployGuideOpen && (
        <DeploymentGuide onClose={() => setIsDeployGuideOpen(false)} />
      )}

      {/* Model Detail */}
      {selectedTool && (
        <ModelDetail
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}