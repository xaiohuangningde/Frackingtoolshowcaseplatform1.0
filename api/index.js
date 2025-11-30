// Vercel Serverless Function for API Proxy
// 这个文件用于在 Vercel 上代理请求到 Supabase Edge Functions

const { SUPABASE_PROJECT_ID, SUPABASE_ANON_KEY } = process.env;

// Supabase Edge Functions 基础 URL
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v2/make-server-10b7e963`;

// 处理所有 API 请求的代理函数
export default async function handler(req, res) {
  // 添加 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 OPTIONS 请求（预检）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 构造 Supabase 请求 URL
    const url = `${SUPABASE_URL}${req.url.replace('/api', '')}`;

    // 准备请求选项
    const options = {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy'
      }
    };

    // 如果有请求体，添加到选项中
    if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    console.log(`代理请求: ${req.method} ${url}`);

    // 发送请求到 Supabase Edge Functions
    const response = await fetch(url, options);
    const data = await response.json();

    // 返回响应
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API 代理错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
}