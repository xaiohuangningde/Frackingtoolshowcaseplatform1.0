/**
 * 全局类型定义
 */

export interface FrackingTool {
  id: string;
  name: string;
  group: string;
  description: string;
  posterUrl: string;
  modelUrl: string;
  createdAt: number;
}

export type ToolInput = Omit<FrackingTool, 'id' | 'createdAt'>;

export interface UseToolsReturn {
  tools: FrackingTool[];
  loading: boolean;
  error: string | null;
  addTool: (tool: ToolInput) => Promise<void>;
  updateTool: (id: string, updates: Partial<FrackingTool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  updateGroup: (oldName: string, newName: string) => Promise<void>;
  deleteGroup: (groupName: string) => Promise<void>;
}