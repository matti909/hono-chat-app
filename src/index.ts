/// <reference types="@cloudflare/workers-types" />
import { createD1App } from "./controllers/main";

// Type for Cloudflare Workers environment
type Env = {
  hono_chat_app: D1Database;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  ANTHROPIC_API_KEY: string;
};

// For Cloudflare Workers
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const workerApp = createD1App(env.hono_chat_app);
    return workerApp.fetch(request, env, ctx);
  },
};
