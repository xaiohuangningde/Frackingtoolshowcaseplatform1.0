import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-10b7e963/health", (c) => {
  return c.json({ status: "ok" });
});

// 获取所有工具
app.get("/make-server-10b7e963/tools", async (c) => {
  try {
    const tools = await kv.getByPrefix("tool:");
    return c.json({ success: true, data: tools });
  } catch (error) {
    console.error("获取工具列表失败:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// 添加工具
app.post("/make-server-10b7e963/tools", async (c) => {
  try {
    const body = await c.req.json();
    const { name, group, description, posterUrl, modelUrl } = body;

    if (!name || !group || !posterUrl || !modelUrl) {
      return c.json({ success: false, error: "缺少必填字段" }, 400);
    }

    const id = crypto.randomUUID();
    const tool = {
      id,
      name,
      group,
      description: description || "",
      posterUrl,
      modelUrl,
      createdAt: Date.now(),
    };

    await kv.set(`tool:${id}`, tool);
    return c.json({ success: true, data: tool });
  } catch (error) {
    console.error("添加工具失败:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// 更新工具
app.put("/make-server-10b7e963/tools/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();

    const existing = await kv.get(`tool:${id}`);
    if (!existing) {
      return c.json({ success: false, error: "工具不存在" }, 404);
    }

    const updated = { ...existing, ...updates };
    await kv.set(`tool:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("更新工具失败:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// 删除工具
app.delete("/make-server-10b7e963/tools/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`tool:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("删除工具失败:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// 批量更新分组
app.post("/make-server-10b7e963/groups/rename", async (c) => {
  try {
    const { oldName, newName } = await c.req.json();

    if (!oldName || !newName) {
      return c.json({ success: false, error: "缺少必填字段" }, 400);
    }

    const tools = await kv.getByPrefix("tool:");
    const updates = tools
      .filter((tool: any) => tool.group === oldName)
      .map((tool: any) => ({ ...tool, group: newName }));

    for (const tool of updates) {
      await kv.set(`tool:${tool.id}`, tool);
    }

    return c.json({ success: true, count: updates.length });
  } catch (error) {
    console.error("重命名分组失败:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// 删除分组（将工具移至"未分组"）
app.post("/make-server-10b7e963/groups/delete", async (c) => {
  try {
    const { groupName } = await c.req.json();

    if (!groupName) {
      return c.json({ success: false, error: "缺少分组名称" }, 400);
    }

    const tools = await kv.getByPrefix("tool:");
    const updates = tools
      .filter((tool: any) => tool.group === groupName)
      .map((tool: any) => ({ ...tool, group: "未分组" }));

    for (const tool of updates) {
      await kv.set(`tool:${tool.id}`, tool);
    }

    return c.json({ success: true, count: updates.length });
  } catch (error) {
    console.error("删除分组失败:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);