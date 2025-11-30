/**
 * Model Viewer 脚本加载 Hook
 * 支持 CDN/本地切换，适配内网环境
 */

import { useEffect, useState } from 'react';
import { getModelViewerScript } from '../config';

export function useModelViewer() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查是否已加载
    if (customElements.get('model-viewer')) {
      setLoaded(true);
      return;
    }

    const scriptUrl = getModelViewerScript();
    const script = document.createElement('script');
    script.type = 'module';
    script.src = scriptUrl;

    script.onload = () => {
      setLoaded(true);
      setError(null);
    };

    script.onerror = () => {
      setError(`无法加载 model-viewer 脚本: ${scriptUrl}`);
      setLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      // 清理脚本（可选）
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return { loaded, error };
}