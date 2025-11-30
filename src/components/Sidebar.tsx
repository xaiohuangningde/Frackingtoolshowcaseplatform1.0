import React, { useState } from 'react';
import { Layers, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface SidebarProps {
  groups: string[];
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
  onRenameGroup: (oldName: string, newName: string) => void;
  onDeleteGroup: (groupName: string) => void;
}

export function Sidebar({ 
  groups, 
  selectedGroup, 
  onSelectGroup,
  onRenameGroup,
  onDeleteGroup
}: SidebarProps) {
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);

  const handleStartEdit = (groupName: string) => {
    setEditingGroup(groupName);
    setEditValue(groupName);
    setShowMenuFor(null);
  };

  const handleSaveEdit = (oldName: string) => {
    if (editValue.trim() && editValue !== oldName) {
      onRenameGroup(oldName, editValue.trim());
    }
    setEditingGroup(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditValue('');
  };

  const handleDelete = (groupName: string) => {
    setShowMenuFor(null);
    onDeleteGroup(groupName);
  };

  return (
    <aside className="w-64 border-r border-[#E5E7EB] bg-white h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <Layers className="w-4 h-4" />
          <span className="text-sm">工具分组</span>
        </div>

        <nav className="space-y-1">
          {groups.map(group => {
            const isEditing = editingGroup === group;
            const canManage = group !== '全部';

            return (
              <div key={group} className="relative group/item">
                {isEditing ? (
                  // 编辑模式
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(group);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      onBlur={() => handleSaveEdit(group)}
                      autoFocus
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                ) : (
                  // 正常显示模式
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectGroup(group)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedGroup === group
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {group}
                    </button>
                    
                    {canManage && (
                      <div className="relative">
                        <button
                          onClick={() => setShowMenuFor(showMenuFor === group ? null : group)}
                          className="p-1.5 opacity-0 group-hover/item:opacity-100 hover:bg-gray-100 rounded transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {showMenuFor === group && (
                          <>
                            {/* 点击外部关闭菜单 */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowMenuFor(null)}
                            />
                            
                            {/* 下拉菜单 */}
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => handleStartEdit(group)}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                重命名
                              </button>
                              <button
                                onClick={() => handleDelete(group)}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                删除分组
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}