import React from 'react';
import { X, AlertCircle, CheckCircle, Code, Server, Database } from 'lucide-react';
import { CONFIG, isOnlineMode } from '../config';
import { getApiModeDescription } from '../lib/api-switch';

interface DeploymentGuideProps {
  onClose: () => void;
}

export function DeploymentGuide({ onClose }: DeploymentGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-gray-900">部署说明</h2>
            <p className="text-sm text-gray-500 mt-1">工业级压裂工具展示平台 - 配置与部署指南</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* 当前状态 */}
            <section className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-blue-900 mb-2">当前配置状态</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isOnlineMode() ? 'bg-green-500' : 'bg-orange-500'}`} />
                      <span>渲染模式: {isOnlineMode() ? '在线模式 (CDN)' : '离线模式 (本地)'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-purple-500`} />
                      <span>数据模式: {getApiModeDescription()}</span>
                    </div>
                    <div>平台版本: {CONFIG.APP.VERSION}</div>
                    <div>脚本地址: {isOnlineMode() ? CONFIG.MODEL_VIEWER.CDN_SCRIPT : CONFIG.MODEL_VIEWER.LOCAL_SCRIPT}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 数据存储模式切换 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-gray-700" />
                <h3 className="text-gray-900">数据存储模式</h3>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-green-900 font-medium mb-1">当前使用本地存储模式</div>
                    <div className="text-sm text-green-800">
                      数据保存在浏览器的 localStorage 中，无需服务器，适合演示和开发。
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div>
                  <div className="text-gray-700 mb-1">💡 切换到 Supabase 云端模式</div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`// 修改 src/lib/supabase.ts 中的常量
const API_MODE = 'rest';  // 使用 Supabase REST API
const USE_LOCAL_MODE = false;  // 禁用本地模式`}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  注意：切换到云端模式需要先在 Supabase 中创建数据表。
                  详细步骤请参考 <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">SUPABASE-SETUP.md</code> 文件。
                </div>
              </div>
            </section>

            {/* 内网部署指南 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-5 h-5 text-gray-700" />
                <h3 className="text-gray-900">内网/离线部署</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div>
                  <div className="text-gray-700 mb-1">1. 下载 model-viewer 库到本地</div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                    wget https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js -O public/libs/model-viewer.min.js
                  </div>
                </div>
                <div>
                  <div className="text-gray-700 mb-1">2. 修改 /src/config.ts 配置文件</div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`MODEL_VIEWER: {
  USE_CDN: false,  // 改为 false
  ...
}`}
                  </div>
                </div>
                <div>
                  <div className="text-gray-700 mb-1">3. 重新构建项目</div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs">
                    npm run build
                  </div>
                </div>
              </div>
            </section>

            {/* Firebase 配置 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-gray-700" />
                <h3 className="text-gray-900">Supabase 数据持久化</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div>
                  <div className="text-gray-700 mb-2">✅ 已配置完成</div>
                  <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded">
                    当前已连接到 Supabase 后端，数据会自动保存到云端 KV 存储。
                  </div>
                </div>
                <div>
                  <div className="text-gray-700 mb-1">数据存储方式</div>
                  <div className="text-xs text-gray-600">
                    • 使用 Supabase Edge Functions 提供 RESTful API<br />
                    • 数据存储在 KV Store (键值对数据库)<br />
                    • 每 5 秒自动同步，支持多端实时更新
                  </div>
                </div>
                <div>
                  <div className="text-gray-700 mb-1">API 端点</div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                    GET    /tools          # 获取所有工具{'\n'}
                    POST   /tools          # 添加工具{'\n'}
                    PUT    /tools/:id      # 更新工具{'\n'}
                    DELETE /tools/:id      # 删除工具{'\n'}
                    POST   /groups/rename  # 重命名分组{'\n'}
                    POST   /groups/delete  # 删除分组
                  </div>
                </div>
              </div>
            </section>

            {/* 数据迁移说明 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-gray-700" />
                <h3 className="text-gray-900">迁移至 Supabase（未来）</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <p className="mb-2">所有数据逻辑已封装在 <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">/src/hooks/use-tools.ts</code> 中。</p>
                <p>如需切换至 Supabase，只需修改该 Hook 的实现即可，无需改动组件代码。</p>
              </div>
            </section>

            {/* 注意事项 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-gray-900">性能优化建议</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>使用 CDN 加速 .glb 模型文件和封面图（推荐阿里云 OSS、七牛云）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>模型文件尽量控制在 10MB 以内，使用 Draco 压缩</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>封面图使用 WebP 格式，尺寸建议 800×800px</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>内网环境下，建议将所有资源部署在同一局域网内</span>
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB] bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}